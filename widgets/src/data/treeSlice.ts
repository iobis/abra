import type { DimensionFilterValue, DimensionNode } from './types';

export interface SliceEntry {
	value: string;
	total: number;
}

/**
 * Reads a chart-ready breakdown straight out of a manifest's dimension_tree
 * — zero Parquet reads, since every tree node already carries pre-summed
 * measure totals. Walks the tree consuming `filter`'s keys in tree order as
 * long as the matched value still has children; stops (and returns that
 * node's children) at the first level where either no selection has been
 * made yet, or the selected value is a leaf. This is what lets a chart show
 * "all taxa under the selected rank" rather than a single-bar chart of just
 * the one selected taxon.
 */
export function sliceDimension(
	root: DimensionNode | null,
	filter: DimensionFilterValue,
	metric: string
): SliceEntry[] {
	if (!root) return [];

	let node = root;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const chosen = filter[node.column];
		if (chosen == null) break;
		const match = node.values.find((v) => v.value === chosen);
		if (!match || !match.children) break;
		node = match.children;
	}

	return node.values.map((v) => ({ value: v.value, total: Number(v[metric] ?? 0) }));
}
