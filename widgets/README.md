# obis-widgets

Two framework-free web components — `<obis-hexmap>` and `<obis-chart>` —
that read a Parquet "cube" produced by `abra::export_cube()` directly in the
browser and can be dropped into any HTML page or Quarto document with a
single `<script>` tag. No build step, no bundler, no other JS framework
required on the consuming page.

They use [Hyparquet](https://github.com/hyparam/hyparquet) to do real
HTTP-range-request row-group pruning against the cube — a filtered query
only ever fetches the small slice of the file it actually needs, not the
whole thing, even for cubes tens of MB in size. The map is
[deck.gl](https://deck.gl)'s `H3HexagonLayer` over a
[MapLibre GL](https://maplibre.org) basemap; charts/tables use
[Observable Plot](https://observablehq.com/plot/).

## Quick start

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/<user>/abra@main/widgets/dist/obis-hexmap.js"></script>

<obis-hexmap
  parquet="https://your-bucket.example.com/cube.parquet"
  manifest="https://your-bucket.example.com/cube.json"
  metric="n_records"
></obis-hexmap>
```

That's the whole integration. Once pushed to GitHub, `dist/obis-hexmap.js`
and `dist/obis-chart.js` are directly usable via
[jsDelivr's GitHub file serving](https://www.jsdelivr.com/documentation#id-github)
(the URL pattern above) with no npm publish step — jsDelivr serves any file
straight from a GitHub repo/tag. Pin a tag or commit SHA instead of `@main`
for a stable, cacheable URL in production.

## Using it in a plain HTML page

See `examples/index.html` for a complete working page (map + a synced
chart and table). The short version:

```html
<script type="module" src="obis-hexmap.js"></script>
<obis-hexmap parquet="cube.parquet" manifest="cube.json" metric="n_records"></obis-hexmap>
```

## Using it in Quarto

Quarto passes raw HTML straight through in HTML output. Load the widget
script(s) once — via `include-in-header` in the YAML front matter is
cleanest if you use a widget more than once in the document — then drop
the custom elements in with a `{=html}` block. See
`examples/quarto-example.qmd` for a complete working document (render it
with `quarto render examples/quarto-example.qmd`); the short version:

````markdown
---
title: "My document"
format:
  html:
    include-in-header:
      text: |
        <script type="module" src="obis-hexmap.js"></script>
---

```{=html}
<obis-hexmap parquet="cube.parquet" manifest="cube.json" metric="n_records"></obis-hexmap>
```
````

This is HTML-output only — it won't render anything in a PDF or Word
target.

## Trying the examples locally

Both examples reference the demo cube at `internal/app/all_data.parquet`
(the same one `internal/prepare-parquet.R` produces — generate it first if
you haven't, or point the examples at your own cube instead).

Serve the **repo root** (not this folder) with anything that honors Range
requests — e.g. `npx serve` from `abra/` — then open
`http://localhost:<port>/widgets/examples/`. Plain `python3 -m http.server`
does not send real `206 Partial Content` responses and will silently break
the Parquet reads. If your server does "clean URL" redirects (e.g. the
`serve` package does, stripping `.html`), request the directory
(`.../examples/`) rather than `.../examples/index.html` explicitly —
the redirect target breaks the page's relative paths otherwise.

## Hosting the Parquet file

`parquet`/`manifest` can point at a local file, or any public or presigned
URL — including an S3 or Cloudflare R2 object. Two things must be true of
wherever you host it, since the whole point of this architecture is that
the browser only ever fetches a few small byte ranges instead of the whole
file:

- **The bucket must honor HTTP Range requests.** S3 and R2 both do this
  natively for public and presigned GETs — nothing to configure.
- **The bucket must send CORS headers allowing the embedding page's
  origin.** This is the one setup step most people miss: by default a
  cross-origin `fetch()` to a bucket is blocked until you add a CORS policy
  (both S3 and R2 support this in their console/API — allow `GET` and the
  `Range` request header, and expose `Content-Range`/`Content-Length` in
  the response).

Neither widget has any AWS/R2 SDK dependency or handles credentials — they
only ever deal with "a URL". A presigned URL is just a URL with query-string
auth baked in, fetchable exactly like a public one; whether it's public or
presigned, and for how long a presigned one stays valid, is entirely up to
whatever generated it.

## `<obis-hexmap>`

| Attribute | Required | Description |
|---|---|---|
| `parquet` | yes | URL to the `.parquet` cube |
| `manifest` | yes | URL to the cube's `.json` manifest (from `export_cube()`) |
| `metric` | no | Initial measure to color by (defaults to the manifest's first) |
| `filter` | no | Initial filter as a JSON object, e.g. `'{"type":"phylum"}'` — **initial value only**, see the `filter` property below for live control |
| `basemap-style` | no | A MapLibre style URL (defaults to OpenFreeMap's neutral `positron` style) |
| `height` | no | CSS height (default `320px`) |
| `hide-controls` | no | Boolean attribute — hide the built-in rank/taxon/metric selects (use when another widget on the page drives this one) |

Properties (for programmatic control — these do **not** reflect back to
attributes): `.filter` (get/set an object), `.metric` (get/set a string).

Event: `filterchange`, dispatched whenever the built-in controls change —
`event.detail` is `{filter, metric}`.

## `<obis-chart>`

Same `parquet`/`manifest`/`metric`/`filter`/`hide-controls` as above, plus:

| Attribute | Description |
|---|---|
| `kind` | `bar` (default), `line`, or `table` |
| `top-n` | Row/bar cap (default 10 for `bar`/`line`, 100 for `table`) |
| `height` | Max height for `table`'s scroll area (bar/line size to content) |

`bar` and `line` read only the manifest's dimension tree — **zero Parquet
reads** for these, since every tree node already carries pre-summed measure
totals. `table` runs a real filtered Parquet query and renders the matching
rows, sortable by clicking a column header.

Same `.filter`/`.metric` properties and `filterchange` event as
`<obis-hexmap>`.

## Composing widgets on one page

Each widget is fully independent and works standalone — drop one in and it
shows its own built-in controls. To link two or more together (e.g. a map
driving a chart), set `hide-controls` on the followers and wire the
`filterchange` event from whichever one keeps its controls — this is the
entire "glue code" required:

```html
<obis-hexmap id="map" parquet="cube.parquet" manifest="cube.json"></obis-hexmap>
<obis-chart id="chart" kind="bar" parquet="cube.parquet" manifest="cube.json" hide-controls></obis-chart>

<script type="module">
  document.getElementById('map').addEventListener('filterchange', (e) => {
    const chart = document.getElementById('chart');
    chart.filter = e.detail.filter;
    chart.metric = e.detail.metric;
  });
</script>
```

## Building

```sh
npm install
npm run build     # builds both dist/obis-hexmap.js and dist/obis-chart.js
```

`dist/` is committed to git (not gitignored) rather than built in CI —
that's what makes the jsDelivr-from-GitHub usage above work with zero
publish step. **Rebuild and commit `dist/` after any change to `src/`.**

Each widget is a single fully self-contained ES module (all dependencies
bundled — Hyparquet, and for the map, MapLibre GL + deck.gl + h3-js) except
for `dist/assets/maplibre-gl-worker-*.js`, a Web Worker script that must
always be served alongside `obis-hexmap.js` (workers can't be inlined into
the main bundle — this is a Web Platform constraint, not a build gap).
Current sizes: `obis-hexmap.js` ~2.5MB (~590KB gzipped, dominated by
MapLibre GL + deck.gl), `obis-chart.js` ~460KB (~130KB gzipped).

## Gotchas discovered while building this (Vite library mode specifics)

- **`process is not defined`**: Vite's normal app build auto-shims
  `process.env.NODE_ENV` for the browser; library mode does not do this
  automatically, and `maplibre-gl` reads it internally. Fixed via an
  explicit `define` in `vite.config.ts`.
- **Worker chunk 404s at the wrong path**: Vite's library build defaults
  to assuming the bundle is deployed at the domain root, emitting the
  MapLibre worker's URL as an absolute `/assets/...` path. Wrong for a
  widget hosted at an arbitrary path (a CDN, a subdirectory). Fixed with
  `base: './'`, which makes Vite resolve it relative to wherever
  `obis-hexmap.js` itself was actually loaded from.
- **Two entries, one build config each**: a single Vite config with two
  `lib.entry` items would let Rollup hoist shared local modules
  (`data/cube.ts`, `shared/dimensionControls.ts`, ...) into a common
  chunk — meaning a page using only `<obis-hexmap>` would still need to
  fetch a second file. `vite.config.ts` is invoked twice (`WIDGET=hexmap`
  / `WIDGET=chart`) instead, one entry per invocation, so each output file
  is genuinely self-contained.
- **No SSR to avoid.** Unlike a SvelteKit app (which would need to defer
  importing `maplibre-gl`/`deck.gl` to avoid crashing server-side
  prerendering), this bundle is browser-only by construction, so plain
  static imports at the top of `obis-hexmap.ts` are fine.
