// Reading the Parquet files with Hyparquet.
//
// Hyparquet reads Parquet files in the browser with HTTP range requests: only the
// footer and the row groups that are asked for are downloaded, so large files are fine.

import { base } from '$app/paths';
import { asyncBufferFromUrl, parquetMetadataAsync, parquetReadObjects } from 'hyparquet';
import type { AsyncBuffer } from 'hyparquet';
import { config } from './config';

export type Row = Record<string, any>;

export interface ReadOptions {
  /** Columns to read (default: all). */
  columns?: string[];
  /** First row to read (default: 0). */
  rowStart?: number;
  /** Row after the last one to read (default: end of the file). */
  rowEnd?: number;
}

export interface Meta {
  title?: string;
  subtitle?: string;
  area_bbox?: number[];
  date_start?: string;
  date_end?: string;
  depth?: number[] | null;
  taxa?: Record<string, string[]> | null;
  resolution?: number;
  information_rank?: string;
  generated?: string;
  files?: string[];
}

/** Address of a file of the data folder. */
export const dataUrl = (file: string) => `${base}/${config.dataPath}/${file}`;

const buffers = new Map<string, Promise<AsyncBuffer>>();
const tables = new Map<string, Promise<Row[]>>();

function open(name: string) {
  if (!buffers.has(name)) buffers.set(name, asyncBufferFromUrl({ url: dataUrl(`${name}.parquet`) }));
  return buffers.get(name)!;
}

// Parquet 64-bit integers come as BigInt; use plain numbers
function plain(rows: Row[]): Row[] {
  for (const row of rows) {
    for (const key in row) if (typeof row[key] === 'bigint') row[key] = Number(row[key]);
  }
  return rows;
}

/** Reads (part of) a table, e.g. `loadTable('records_by_year')`. Results are cached. */
export function loadTable(name: string, options: ReadOptions = {}): Promise<Row[]> {
  const key = `${name}:${JSON.stringify(options)}`;
  if (!tables.has(key)) {
    tables.set(
      key,
      open(name).then((file) => parquetReadObjects({ file, ...options })).then(plain)
    );
  }
  return tables.get(key)!;
}

/** Number of rows and column names of a table, reading only its footer. */
export async function tableInfo(name: string): Promise<{ numRows: number; columns: string[] }> {
  const metadata = await parquetMetadataAsync(await open(name));
  return {
    numRows: Number(metadata.num_rows),
    columns: metadata.schema.slice(1).map((c) => c.name)
  };
}

/** The description of the analysis written by `prepare-data.R` (empty if not found). */
export async function loadMeta(): Promise<Meta> {
  try {
    const response = await fetch(dataUrl('meta.json'));
    return response.ok ? await response.json() : {};
  } catch {
    return {};
  }
}
