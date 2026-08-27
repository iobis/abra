/** One node of a dataset manifest's dimension tree (see export_cube() in the abra R package). */
export interface DimensionValue {
	value: string;
	children: DimensionNode | null;
	/** One numeric field per entry in the manifest's top-level `measures` list. */
	[measure: string]: unknown;
}

export interface DimensionNode {
	column: string;
	values: DimensionValue[];
}

/** The `<dataset>.json` manifest written by `export_cube()`, alongside its `.parquet` file. */
export interface DatasetManifest {
	generated_at: string;
	rows: number;
	bytes: number;
	row_group_size: number;
	grid: { type: string; resolution: number } | null;
	geo_col: string | null;
	/** Column name -> Parquet type string (e.g. "string", "double", "int64"). */
	columns: Record<string, string>;
	measures: string[];
	dimension_tree: DimensionNode | null;
}

/** An equality-only filter: dimension column name -> selected value (always a string). */
export type DimensionFilterValue = Record<string, string>;
