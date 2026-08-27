import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Two separate build invocations (see package.json), not one multi-entry
// build: with multiple entries Rollup would hoist their shared local
// modules (data/cube.ts, shared/dimensionControls.ts, ...) into a common
// chunk, so a page embedding only <obis-hexmap> would still need to fetch
// a second file. Building each entry alone guarantees a single,
// self-contained ES module per widget — the whole point of "add one
// <script> tag" distribution.
const target = process.env.WIDGET;
const entries: Record<string, string> = {
	hexmap: resolve(import.meta.dirname, 'src/obis-hexmap.ts'),
	chart: resolve(import.meta.dirname, 'src/obis-chart.ts')
};
const entry = target ? entries[target] : undefined;
if (target && !entry) throw new Error(`Unknown WIDGET "${target}" — expected one of: ${Object.keys(entries).join(', ')}`);

export default defineConfig({
	// Without this, Vite assumes the bundle is deployed at the domain root
	// and emits the worker chunk's URL as an absolute `/assets/...` path —
	// wrong for a widget a consumer can host at any path (a CDN, a
	// subdirectory, ...). `base: './'` makes it resolve relative to
	// wherever obis-hexmap.js itself was actually loaded from.
	base: './',
	// Vite's normal app build auto-replaces process.env.NODE_ENV (and shims
	// `process` generally) for browser bundles; library mode does not do
	// this automatically. maplibre-gl reads process.env.NODE_ENV internally,
	// which throws `process is not defined` in a real browser without this.
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
		'process.env': '{}'
	},
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		lib: entry && {
			entry,
			formats: ['es'],
			fileName: () => `obis-${target}.js`
		}
	}
});
