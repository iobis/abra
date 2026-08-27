import { asyncBufferFromUrl, parquetMetadataAsync, parquetQuery } from 'hyparquet';
import type { DatasetManifest, DimensionFilterValue } from './types';

export interface CubeSource {
	parquet: string;
	manifest: string;
}

interface TrackedFile {
	byteLength: number;
	slice(start: number, end?: number): Promise<ArrayBuffer>;
}

interface CubeHandle {
	file: TrackedFile;
	metadata: Awaited<ReturnType<typeof parquetMetadataAsync>>;
	manifest: DatasetManifest;
}

export interface ByteStats {
	sessionBytes: number;
	totalBytes: number;
}

// Keyed by parquet URL, not per widget instance: if a map and a chart on the
// same page point at the same file, they share one cached AsyncBuffer/
// metadata fetch and one combined byte-stats counter, rather than each
// re-fetching and under-reporting its own "share" of the traffic.
const cache = new Map<string, Promise<CubeHandle>>();
const stats = new Map<string, ByteStats>();

function trackedFile(url: string, raw: Awaited<ReturnType<typeof asyncBufferFromUrl>>): TrackedFile {
	const s: ByteStats = { sessionBytes: 0, totalBytes: raw.byteLength };
	stats.set(url, s);
	return {
		byteLength: raw.byteLength,
		async slice(start, end) {
			s.sessionBytes += (end ?? raw.byteLength) - start;
			return raw.slice(start, end);
		}
	};
}

async function load(source: CubeSource): Promise<CubeHandle> {
	const [manifest, rawFile] = await Promise.all([
		fetch(source.manifest).then((r) => {
			if (!r.ok) throw new Error(`Failed to fetch manifest: ${source.manifest} (${r.status})`);
			return r.json() as Promise<DatasetManifest>;
		}),
		asyncBufferFromUrl({ url: source.parquet })
	]);
	const file = trackedFile(source.parquet, rawFile);
	const metadata = await parquetMetadataAsync(file);
	return { file, metadata, manifest };
}

export function getCube(source: CubeSource): Promise<CubeHandle> {
	if (!cache.has(source.parquet)) cache.set(source.parquet, load(source));
	return cache.get(source.parquet)!;
}

/** Current cumulative byte stats for a parquet URL, or null before its first query. */
export function getByteStats(parquetUrl: string): ByteStats | null {
	return stats.get(parquetUrl) ?? null;
}

const NUMERIC_TYPE = /^(u?int|float|double|decimal)/i;

/**
 * Builds a Hyparquet equality filter from a dimension selection, coercing
 * each value to a number when the manifest says the underlying column is
 * numeric — filter values are always strings (attributes, <select> values),
 * but e.g. a `year` dimension is stored (and compared) as an integer in the
 * Parquet file.
 */
function buildEqFilter(filter: DimensionFilterValue, manifest: DatasetManifest) {
	const out: Record<string, { $eq: string | number }> = {};
	for (const [col, value] of Object.entries(filter)) {
		const isNumeric = NUMERIC_TYPE.test(manifest.columns[col] ?? '');
		out[col] = { $eq: isNumeric ? Number(value) : value };
	}
	return out;
}

export async function queryCube(source: CubeSource, filter: DimensionFilterValue) {
	const { file, metadata, manifest } = await getCube(source);
	// parquetQuery always resolves rows as objects (Promise<Record<string, any>[]>).
	return parquetQuery({ file, metadata, filter: buildEqFilter(filter, manifest) });
}
