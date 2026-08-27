import { Map as MaplibreMap, setWorkerUrl } from 'maplibre-gl';
import maplibreCss from 'maplibre-gl/dist/maplibre-gl.css?inline';
// `?worker&url` runs the worker script through Vite's real worker-bundling
// pipeline (following its own internal import of maplibre-gl-shared.mjs,
// which a plain `?url` import would miss) and yields the built chunk's URL
// as a plain string — see the README's "gotchas" section.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { H3HexagonLayer } from 'deck.gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { getCube, getByteStats, queryCube } from './data/cube';
import { createLatestGuard, STALE } from './data/latestGuard';
import { createDimensionControls, type DimensionControls } from './shared/dimensionControls';
import { baseStyles } from './shared/styles';
import { rampColor, logNormalizer, formatCount, formatBytes } from './viz/colorScale';
import { minMax } from './viz/extent';
import type { DatasetManifest, DimensionFilterValue } from './data/types';

setWorkerUrl(maplibreWorkerUrl);

/**
 * `<obis-hexmap parquet="..." manifest="..." metric="n_records" filter='{"type":"phylum"}' height="480px">`
 *
 * A standalone H3 hexagon choropleth reading a Hyparquet cube directly —
 * usable on any page with just a `<script type="module">` tag. Framework-
 * free (no runtime dependency beyond the web platform + the bundled libs):
 * OpenFreeMap's neutral basemap (not maplibre's own country-colored demo
 * style), a log1p sequential color scale (OBIS counts are power-law
 * distributed), a manual-loop min/max (Math.max(...bigArray) throws past
 * ~100k rows), a per-instance async race guard, and DOM-built (not string-
 * concatenated) tooltip HTML.
 *
 * Attributes: `parquet`, `manifest` (required, URLs — local, or any public/
 * presigned S3/R2/etc object; Range-request support and CORS are the
 * bucket's job, not this widget's), `metric`, `filter` (a JSON object,
 * initial only — see the `filter`/`metric` properties for programmatic
 * control), `basemap-style` (a MapLibre style URL), `height` (CSS height,
 * default `320px`), `hide-controls` (boolean attribute — omit the built-in
 * rank/taxon/metric selects, e.g. when another widget on the page drives
 * this one via the `filter`/`metric` properties).
 *
 * Events: `filterchange` (`detail: {filter, metric}`), dispatched whenever
 * the built-in controls change — listen for this to sync a second widget
 * on the same page (see the README for the two-line glue this takes).
 */
export class ObisHexMap extends HTMLElement {
	static get observedAttributes() {
		return ['parquet', 'manifest', 'metric', 'filter', 'basemap-style', 'height', 'hide-controls'];
	}

	private root: ShadowRoot;
	private controlsHost: HTMLDivElement;
	private mapEl: HTMLDivElement;
	private legendEl: HTMLDivElement;
	private statsEl: HTMLDivElement;
	private statusEl: HTMLDivElement;

	private map?: MaplibreMap;
	private overlay?: MapboxOverlay;
	private controls?: DimensionControls;
	private manifest?: DatasetManifest;
	private rows: Record<string, unknown>[] = [];
	private guard = createLatestGuard();
	private resizeObserver?: ResizeObserver;
	private sourceKey = '';

	constructor() {
		super();
		this.root = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		style.textContent = baseStyles;
		const maplibreStyle = document.createElement('style');
		maplibreStyle.textContent = maplibreCss;

		this.controlsHost = document.createElement('div');
		this.statusEl = document.createElement('div');
		this.statusEl.className = 'obis-loading';
		this.statusEl.textContent = 'Loading…';

		const mapWrap = document.createElement('div');
		mapWrap.className = 'obis-map';
		this.mapEl = document.createElement('div');
		this.mapEl.style.cssText = 'position:absolute;inset:0;';

		this.legendEl = document.createElement('div');
		this.legendEl.className = 'obis-panel obis-legend';

		this.statsEl = document.createElement('div');
		this.statsEl.className = 'obis-panel obis-stats';

		mapWrap.append(this.mapEl, this.legendEl, this.statsEl);
		this.root.append(style, maplibreStyle, this.controlsHost, this.statusEl, mapWrap);
	}

	connectedCallback() {
		this.style.setProperty('--obis-height', this.getAttribute('height') || '320px');
		(this.root.querySelector('.obis-map') as HTMLElement).style.aspectRatio = '';
		(this.root.querySelector('.obis-map') as HTMLElement).style.height = this.getAttribute('height') || '320px';

		this.resizeObserver = new ResizeObserver(() => this.map?.resize());
		this.resizeObserver.observe(this);

		void this.init();
	}

	disconnectedCallback() {
		this.resizeObserver?.disconnect();
		this.map?.remove();
		this.map = undefined;
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue === newValue || !this.isConnected) return;
		if (name === 'parquet' || name === 'manifest') {
			void this.init();
		} else if (name === 'metric' && this.controls) {
			this.controls.setMetric(newValue ?? '');
			void this.query();
		} else if (name === 'filter' && this.controls) {
			this.controls.setFilter(newValue ? JSON.parse(newValue) : {});
			void this.query();
		} else if (name === 'hide-controls' && this.controls) {
			this.controlsHost.style.display = this.hasAttribute('hide-controls') ? 'none' : '';
		}
	}

	/** Current filter selection. Setting it does not reflect back to the `filter` attribute — use this for programmatic control. */
	get filter(): DimensionFilterValue {
		return this.controls?.getFilter() ?? {};
	}
	set filter(value: DimensionFilterValue) {
		this.controls?.setFilter(value);
		void this.query();
	}

	get metric(): string {
		return this.controls?.getMetric() ?? '';
	}
	set metric(value: string) {
		this.controls?.setMetric(value);
		void this.query();
	}

	private async init() {
		const parquet = this.getAttribute('parquet');
		const manifestUrl = this.getAttribute('manifest');
		if (!parquet || !manifestUrl) {
			this.showError('obis-hexmap requires parquet and manifest attributes');
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
			void this.query();
		});
		this.controlsHost.replaceChildren(this.controls.element);
		this.controlsHost.style.display = this.hasAttribute('hide-controls') ? 'none' : '';

		if (!this.map) {
			this.map = new MaplibreMap({
				container: this.mapEl,
				style: this.getAttribute('basemap-style') || 'https://tiles.openfreemap.org/styles/positron',
				center: [10, 15],
				zoom: 1.3
			});
			this.overlay = new MapboxOverlay({ layers: [], getTooltip: (info) => this.buildTooltip(info) });
			this.map.addControl(this.overlay);
		}

		void this.query();
	}

	private async query() {
		if (!this.manifest || !this.controls) return;
		const parquet = this.getAttribute('parquet')!;
		const manifestUrl = this.getAttribute('manifest')!;
		const filter = this.controls.getFilter();

		const result = await this.guard(queryCube({ parquet, manifest: manifestUrl }, filter));
		if (result === STALE) return;
		this.rows = result;
		this.render();
		this.updateStats();
	}

	private render() {
		if (!this.overlay) return;
		const metric = this.controls?.getMetric() ?? '';

		const { min, max } = minMax(this.rows, (r) => r[metric] as number);
		const normalize = logNormalizer(min, max);

		const layer = new H3HexagonLayer({
			id: 'h3-layer',
			data: this.rows,
			pickable: true,
			filled: true,
			stroked: true,
			extruded: false,
			getHexagon: (d: any) => d.cell,
			getFillColor: (d: any) => [...rampColor(normalize((d[metric] as number) ?? 0)), 210],
			getLineColor: [255, 255, 255, 60],
			lineWidthMinPixels: 0.5,
			updateTriggers: { getFillColor: [metric] }
		});
		this.overlay.setProps({ layers: [layer] });
		this.updateLegend(metric, min, max);
	}

	private updateLegend(metric: string, min: number, max: number) {
		this.legendEl.textContent = '';
		const title = document.createElement('div');
		title.className = 'obis-legend-title';
		title.textContent = metric;
		this.legendEl.appendChild(title);

		if (!this.rows.length) {
			const note = document.createElement('div');
			note.textContent = 'No cells for this selection';
			this.legendEl.appendChild(note);
			return;
		}

		const ramp = document.createElement('div');
		ramp.className = 'obis-legend-ramp';
		ramp.style.background =
			'linear-gradient(90deg, #cde2fb, #b7d3f6, #9ec5f4, #86b6ef, #6da7ec, #5598e7, #3987e5, #2a78d6, #256abf, #1c5cab, #184f95, #104281, #0d366b)';
		const labels = document.createElement('div');
		labels.className = 'obis-legend-scale';
		const lo = document.createElement('span');
		lo.textContent = formatCount(min);
		const hi = document.createElement('span');
		hi.textContent = formatCount(max);
		labels.append(lo, hi);
		this.legendEl.append(ramp, labels);
	}

	private updateStats() {
		const s = getByteStats(this.sourceKey);
		this.statsEl.textContent = '';
		if (!s) return;
		this.statsEl.append(
			`${this.rows.length} cells · `,
			this.strong(formatBytes(s.sessionBytes)),
			` of ${formatBytes(s.totalBytes)} read this session`
		);
	}

	private strong(text: string) {
		const span = document.createElement('span');
		span.className = 'value';
		span.textContent = text;
		return span;
	}

	// Tooltip HTML is assembled from real DOM nodes built with textContent,
	// then serialized — never raw string concatenation of data-derived
	// values (dimension/measure values come from the Parquet file).
	private buildTooltip({ object }: { object?: Record<string, unknown> }) {
		if (!object || !this.manifest) return null;
		const metric = this.controls?.getMetric() ?? '';
		const dims = Object.keys(object).filter((k) => k !== this.manifest!.geo_col && !this.manifest!.measures.includes(k));
		const div = document.createElement('div');
		const title = document.createElement('div');
		title.textContent = dims.map((d) => object[d]).join(' / ');
		const value = document.createElement('div');
		const strong = this.strong(formatCount((object[metric] as number) ?? 0));
		value.append(strong, ` ${metric}`);
		div.append(title, value);
		return { html: div.innerHTML };
	}

	private showError(message: string) {
		this.statusEl.className = 'obis-error';
		this.statusEl.textContent = message;
		this.statusEl.style.display = '';
	}
}

if (!customElements.get('obis-hexmap')) {
	customElements.define('obis-hexmap', ObisHexMap);
}
