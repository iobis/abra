<script lang="ts">
  // Map of H3 cells: MapLibre draws the basemap and deck.gl draws the cells on top.
  import { onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { MapboxOverlay } from '@deck.gl/mapbox';
  import { H3HexagonLayer } from '@deck.gl/geo-layers';
  import { config } from '$lib/config';
  import type { Row } from '$lib/data';

  let {
    cells,
    metric,
    label,
    bbox
  }: {
    cells: Row[];
    metric: string;
    label: string;
    /** Area bounds [xmin, ymin, xmax, ymax], used when the cells have no coordinates. */
    bbox?: number[];
  } = $props();

  let container: HTMLDivElement;
  let overlay = $state.raw<MapboxOverlay | null>(null);

  // Color scale limits (cells without a positive value are not drawn when the scale is logarithmic)
  const limits = $derived.by(() => {
    let min = Infinity;
    let max = -Infinity;
    let minPositive = Infinity;
    for (const c of cells) {
      const v = Number(c[metric]);
      if (!Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
      if (v > 0 && v < minPositive) minPositive = v;
    }
    const useLog = config.map.log && minPositive < Infinity;
    return { min: useLog ? minPositive : min, max, useLog };
  });

  function position(value: number) {
    const { min, max, useLog } = limits;
    if (max === min) return 1;
    if (useLog) return value > 0 ? (Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) : 0;
    return (value - min) / (max - min);
  }

  const hex = (color: string) => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));

  function color(value: number): [number, number, number, number] {
    const ramp = config.map.ramp.map(hex);
    const t = Math.min(1, Math.max(0, position(value))) * (ramp.length - 1);
    const lo = Math.floor(t);
    const hi = Math.min(lo + 1, ramp.length - 1);
    const f = t - lo;
    const c = ramp[lo].map((v, i) => Math.round(v + f * (ramp[hi][i] - v)));
    return [c[0], c[1], c[2], 215];
  }

  function bounds(): [[number, number], [number, number]] | null {
    let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;
    for (const c of cells) {
      if (typeof c.x !== 'number' || typeof c.y !== 'number') continue;
      xmin = Math.min(xmin, c.x);
      xmax = Math.max(xmax, c.x);
      ymin = Math.min(ymin, c.y);
      ymax = Math.max(ymax, c.y);
    }
    if (xmin < Infinity) return [[xmin, ymin], [xmax, ymax]];
    return bbox && bbox.length === 4 ? [[bbox[0], bbox[1]], [bbox[2], bbox[3]]] : null;
  }

  onMount(() => {
    const map = new maplibregl.Map({
      container,
      style: config.map.style,
      center: [0, 20],
      zoom: 1.5,
      attributionControl: { compact: true, customAttribution: 'OBIS' }
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const layer = new MapboxOverlay({ layers: [] });
    map.addControl(layer as any);
    overlay = layer;

    const box = bounds();
    if (box) map.fitBounds(box, { padding: 40, duration: 0, maxZoom: 7 });

    return () => map.remove();
  });

  // Redraw the cells when the data or the metric change
  $effect(() => {
    if (!overlay) return;
    overlay.setProps({
      layers: [
        new H3HexagonLayer<Row>({
          id: 'cells',
          data: cells.filter((c) => !limits.useLog || Number(c[metric]) > 0),
          getHexagon: (d) => d.cell,
          getFillColor: (d) => color(Number(d[metric])),
          extruded: false,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 120],
          updateTriggers: { getFillColor: [metric, limits.min, limits.max] }
        })
      ],
      getTooltip: ({ object }: { object?: Row }) =>
        object ? {
          html: `<b>${label}</b>: ${Number(object[metric]).toLocaleString('en')}<br/>
                 Records: ${Number(object.n_records).toLocaleString('en')}<br/>
                 Species: ${Number(object.n_species).toLocaleString('en')}`,
          style: { fontSize: '12px', borderRadius: '6px' }
        } : null
    });
  });

  const gradient = $derived(`linear-gradient(to right, ${config.map.ramp.join(', ')})`);
  const fmt = (v: number) => (Number.isFinite(v) ? v.toLocaleString('en', { notation: 'compact' }) : '');
</script>

<div class="map" bind:this={container}></div>
<div class="legend">
  <span>{fmt(limits.min)}</span>
  <div class="bar" style:background={gradient}></div>
  <span>{fmt(limits.max)}</span>
  <span class="muted">{label}{limits.useLog ? ' (log scale)' : ''}</span>
</div>

<style>
  .map {
    height: 480px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--line);
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }

  .bar {
    width: 180px;
    height: 10px;
    border-radius: 5px;
  }
</style>
