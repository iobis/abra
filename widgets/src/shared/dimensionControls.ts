import type { DatasetManifest, DimensionFilterValue, DimensionNode } from '../data/types';

export interface DimensionControls {
	/** Container element (a row of <label><select>) to append into the widget's shadow root. */
	element: HTMLElement;
	getFilter(): DimensionFilterValue;
	getMetric(): string;
	/** External override (e.g. from an attribute/property change) — re-renders the selects. */
	setFilter(filter: DimensionFilterValue): void;
	setMetric(metric: string): void;
}

/**
 * Framework-free port of the dashboard template's DimensionFilter.svelte:
 * walks a manifest's dimension_tree to render N cascading <select>s plus a
 * metric <select>, defaulting each not-yet-chosen level to its
 * highest-total value (tree nodes are already sorted most-common-first).
 * Shared by both <obis-hexmap> and <obis-chart> so their standalone
 * (no external filter/metric supplied) behavior is identical.
 */
export function createDimensionControls(
	manifest: DatasetManifest,
	initial: { filter?: DimensionFilterValue; metric?: string },
	onChange: (filter: DimensionFilterValue, metric: string) => void
): DimensionControls {
	const container = document.createElement('div');
	container.className = 'obis-controls';

	const tree = manifest.dimension_tree;
	let filter: DimensionFilterValue = { ...initial.filter };
	let metric = initial.metric || manifest.measures[0] || '';

	function applyDefaults(node: DimensionNode | null) {
		if (!node) return;
		if (!(node.column in filter)) filter[node.column] = node.values[0]?.value;
		const chosen = node.values.find((v) => v.value === filter[node.column]) ?? node.values[0];
		applyDefaults(chosen?.children ?? null);
	}

	function levelsOf(node: DimensionNode | null): DimensionNode[] {
		const levels: DimensionNode[] = [];
		let n = node;
		while (n) {
			levels.push(n);
			const chosen = n.values.find((v) => v.value === filter[n!.column]) ?? n.values[0];
			n = chosen?.children ?? null;
		}
		return levels;
	}

	function fieldWithSelect(labelText: string, options: string[], selected: string, onSelect: (v: string) => void) {
		const field = document.createElement('label');
		field.className = 'obis-field';
		const span = document.createElement('span');
		span.textContent = labelText;
		const select = document.createElement('select');
		for (const value of options) {
			const opt = document.createElement('option');
			opt.value = value;
			opt.textContent = value;
			opt.selected = value === selected;
			select.appendChild(opt);
		}
		select.addEventListener('change', () => onSelect(select.value));
		field.append(span, select);
		return field;
	}

	function render() {
		container.textContent = '';
		const levels = levelsOf(tree);

		levels.forEach((level, i) => {
			const field = fieldWithSelect(
				level.column,
				level.values.map((v) => v.value),
				filter[level.column],
				(value) => {
					filter[level.column] = value;
					// Changing an outer selection invalidates any deeper choice;
					// clear and re-default the rest of the path under the new value.
					for (let j = i + 1; j < levels.length; j++) delete filter[levels[j].column];
					applyDefaults(tree);
					render();
					onChange({ ...filter }, metric);
				}
			);
			container.appendChild(field);
		});

		if (manifest.measures.length > 0) {
			const field = fieldWithSelect('metric', manifest.measures, metric, (value) => {
				metric = value;
				onChange({ ...filter }, metric);
			});
			container.appendChild(field);
		}
	}

	applyDefaults(tree);
	render();

	return {
		element: container,
		getFilter: () => ({ ...filter }),
		getMetric: () => metric,
		setFilter(next) {
			filter = { ...next };
			applyDefaults(tree);
			render();
		},
		setMetric(next) {
			metric = next;
			render();
		}
	};
}
