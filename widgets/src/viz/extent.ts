/**
 * Manual-loop min/max over a numeric accessor — never `Math.max(...values)`.
 * Confirmed (obis-abra internal/app) that spreading into Math.max/Math.min
 * throws `RangeError: Maximum call stack size exceeded` once a filtered
 * query returns more than roughly 100k rows (a common taxon can return
 * 175k+ H3 cells).
 */
export function minMax<T>(rows: T[], accessor: (row: T) => number | null | undefined) {
	let min = Infinity;
	let max = -Infinity;
	for (const row of rows) {
		const v = accessor(row);
		if (v == null) continue;
		if (v < min) min = v;
		if (v > max) max = v;
	}
	if (!Number.isFinite(min)) {
		min = 0;
		max = 1;
	}
	return { min, max };
}
