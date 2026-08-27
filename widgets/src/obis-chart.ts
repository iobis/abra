import * as Plot from '@observablehq/plot';
import { getCube, getByteStats, queryCube } from './data/cube';
import { createLatestGuard, STALE } from './data/latestGuard';
import { sliceDimension } from './data/treeSlice';
import { createDimensionControls, type DimensionControls } from './shared/dimensionControls';
import { baseStyles } from './shared/styles';
import { formatBytes, formatCount } from './viz/colorScale';
import type { DatasetManifest } from './data/types';

type Kind = 'bar' | 'line' | 'table';

/**
 * `<obis-chart parquet="..." manifest="..." kind="bar|line|table" metric="n_records" top-n="10">`
 *
 * A standalone chart/table reading a Hyparquet cube directly. `bar` and
 * `line` read only the manifest's dimension_tree (zero Parquet reads —
 * every tree node already carries pre-summed measure totals); `table` runs
 * a real filtered Parquet query and shows the matching rows, sortable by
 * column, capped at `top-n` (default 100) rows sorted by the metric.
 *
 * Attributes: `parquet`, `manifest` (required URLs), `kind` (default
 * `bar`), `metric`, `filter` (a JSON object, initial only — see the
 * `filter`/`metric` properties for programmatic control), `top-n`, `height`
 * (table only; bar/line size to content), `hide-controls`.
 *
 * Events: `filterchange` (`detail: {filter, metric}`) — listen for this on
 * one widget to sync another on the same page (e.g. an `<obis-hexmap>`),
 * or set `hide-controls` and drive this widget's `filter`/`metric`
 * properties entirely from another widget's event.
 */
export class ObisChart extends HTMLElement {
	static get observedAttributes() {
		return ['parquet', 'manifest', 'kind', 'metric', 'filter', 'top-n', 'height', 'hide-controls'];
	}

	private root: ShadowRoot;
	private controlsHost: HTMLDivElement;
	private bodyEl: HTMLDivElement;
	private statusEl: HTMLDivElement;
	private statsEl: HTMLDivElement;

	private controls?: DimensionControls;
	private manifest?: DatasetManifest;
	private guard = createLatestGuard();
	private sourceKey = '';
	private sort: { column: string; dir: 1 | -1 } | null = null;
	private tableRows: Record<string, unknown>[] = [];

	constructor() {
		super();
		this.root = this.attachShadow({ mode: 'open' });
		const style = document.createElement('style');
		style.textContent = baseStyles;

		this.controlsHost = document.createElement('div');
		this.statusEl = document.createElement('div');
		this.statusEl.className = 'obis-loading';
		this.statusEl.textContent = 'Loading…';
		this.bodyEl = document.createElement('div');
		this.statsEl = document.createElement('div');
		this.statsEl.className = 'obis-stats';
		this.statsEl.style.cssText = 'position:static;margin-top:0.5rem;';

		this.root.append(style, this.controlsHost, this.statusEl, this.bodyEl, this.statsEl);
	}

	connectedCallback() {
		void this.init();
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue === newValue || !this.isConnected) return;
		if (name === 'parquet' || name === 'manifest') {
			void this.init();
		} else if (name === 'kind' || name === 'top-n') {
			void this.refresh();
		} else if (name === 'metric' && this.controls) {
			this.controls.setMetric(newValue ?? '');
			void this.refresh();
		} else if (name === 'filter' && this.controls) {
			this.controls.setFilter(newValue ? JSON.parse(newValue) : {});
			void this.refresh();
		} else if (name === 'hide-controls' && this.controls) {
			this.controlsHost.style.display = this.hasAttribute('hide-controls') ? 'none' : '';
		}
	}

	get filter() {
		return this.controls?.getFilter() ?? {};
	}
	set filter(value: Record<string, string>) {
		this.controls?.setFilter(value);
		void this.refresh();
	}

	get metric() {
		return this.controls?.getMetric() ?? '';
	}
	set metric(value: string) {
		this.controls?.setMetric(value);
		void this.refresh();
	}

	private get kind(): Kind {
		const k = this.getAttribute('kind');
		return k === 'line' || k === 'table' ? k : 'bar';
	}

	private get topN(): number {
		const n = Number(this.getAttribute('top-n'));
		return Number.isFinite(n) && n > 0 ? n : this.kind === 'table' ? 100 : 10;
	}

	private async init() {
		const parquet = this.getAttribute('parquet');
		const manifestUrl = this.getAttribute('manifest');
		if (!parquet || !manifestUrl) {
			this.showError('obis-chart requires parquet and manifest attributes');
			return;
		}
		this.sourceKey = parquet;

		let handle;
		try {
			handle = await getCube({ parquet, manifest: manifestUrl });
		} catch (e) {
			this.showError(e instanceof Error ? e.message : String(e));
			return;
		}
		this.manifest = handle.manifest;
		this.statusEl.style.display = 'none';

		const initialFilter = this.getAttribute('filter') ? JSON.parse(this.getAttribute('filter')!) : undefined;
		const initialMetric = this.getAttribute('metric') || undefined;
		this.controls = createDimensionControls(handle.manifest, { filter: initialFilter, metric: initialMetric }, (filter, metric) => {
			this.dispatchEvent(new CustomEvent('filterchange', { detail: { filter, metric }, bubbles: true }));
			void this.refresh();
		});
		this.controlsHost.replaceChildren(this.controls.element);
		this.controlsHost.style.display = this.hasAttribute('hide-controls') ? 'none' : '';

		void this.refresh();
	}

	private async refresh() {
		if (!this.manifest || !this.controls) return;
		if (this.kind === 'table') await this.renderTable();
		else this.renderPlot();
	}

	private renderPlot() {
		const metric = this.controls!.getMetric();
		const filter = this.controls!.getFilter();
		const slice = sliceDimension(this.manifest!.dimension_tree, filter, metric);

		this.bodyEl.textContent = '';
		const container = document.createElement('div');
		container.className = 'obis-chart-container';
		this.bodyEl.appendChild(container);
		this.statsEl.textContent = '';

		if (this.kind === 'bar') {
			const rows = [...slice].sort((a, b) => b.total - a.total).slice(0, this.topN);
			const chart = Plot.plot({
				marginLeft: 140,
				x: { label: metric, grid: true },
				y: { label: null },
				marks: [Plot.barX(rows, { y: 'value', x: 'total', sort: { y: '-x' }, fill: '#2a78d6' }), Plot.ruleX([0])]
			});
			container.appendChild(chart);
		} else {
			const rows = slice
				.map((r) => ({ ...r, x: isNaN(Number(r.value)) ? r.value : Number(r.value) }))
				.sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));
			const chart = Plot.plot({
				x: { label: null },
				y: { label: metric, grid: true },
				marks: [
					Plot.lineY(rows, { x: 'x', y: 'total', stroke: '#2a78d6', strokeWidth: 2 }),
					Plot.dot(rows, { x: 'x', y: 'total', fill: '#2a78d6', r: 3 })
				]
			});
			container.appendChild(chart);
		}
	}

	private async renderTable() {
		const metric = this.controls!.getMetric();
		const filter = this.controls!.getFilter();
		const parquet = this.getAttribute('parquet')!;
		const manifestUrl = this.getAttribute('manifest')!;

		const result = await this.guard(queryCube({ parquet, manifest: manifestUrl }, filter));
		if (result === STALE) return;
		this.tableRows = result;
		this.sort = { column: metric, dir: -1 };
		this.paintTable();
		this.updateStats();
	}

	private paintTable() {
		if (!this.manifest) return;
		const columns = Object.keys(this.manifest.columns);
		let rows = [...this.tableRows];

		if (this.sort) {
			const { column, dir } = this.sort;
			rows.sort((a, b) => {
				const av = a[column];
				const bv = b[column];
				if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
				return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
			});
		}
		rows = rows.slice(0, this.topN);

		this.bodyEl.textContent = '';
		const wrap = document.createElement('div');
		wrap.className = 'obis-table-wrap';
		const table = document.createElement('table');
		table.className = 'obis-table';

		const thead = document.createElement('thead');
		const headRow = document.createElement('tr');
		for (const col of columns) {
			const th = document.createElement('th');
			th.textContent = col + (this.sort?.column === col ? (this.sort.dir === 1 ? ' ▲' : ' ▼') : '');
			th.addEventListener('click', () => {
				this.sort = { column: col, dir: this.sort?.column === col ? (this.sort.dir === 1 ? -1 : 1) : -1 };
				this.paintTable();
			});
			headRow.appendChild(th);
		}
		thead.appendChild(headRow);

		const tbody = document.createElement('tbody');
		for (const row of rows) {
			const tr = document.createElement('tr');
			for (const col of columns) {
				const td = document.createElement('td');
				const v = row[col];
				td.textContent = typeof v === 'number' ? formatCount(v) : String(v ?? '');
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}

		table.append(thead, tbody);
		wrap.appendChild(table);
		if (this.getAttribute('height')) wrap.style.maxHeight = this.getAttribute('height')!;
		this.bodyEl.appendChild(wrap);
	}

	private updateStats() {
		const s = getByteStats(this.sourceKey);
		this.statsEl.textContent = '';
		if (!s) return;
		const span = document.createElement('span');
		span.className = 'value';
		span.textContent = formatBytes(s.sessionBytes);
		this.statsEl.append(`${this.tableRows.length} rows · `, span, ` of ${formatBytes(s.totalBytes)} read this session`);
	}

	private showError(message: string) {
		this.statusEl.className = 'obis-error';
		this.statusEl.textContent = message;
		this.statusEl.style.display = '';
	}
}

if (!customElements.get('obis-chart')) {
	customElements.define('obis-chart', ObisChart);
}
