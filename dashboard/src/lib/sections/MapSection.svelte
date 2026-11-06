<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import Section from '$lib/components/Section.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Load from '$lib/components/Load.svelte';
  import PlotChart from '$lib/components/PlotChart.svelte';
  import MapView from '$lib/components/MapView.svelte';
  import { config } from '$lib/config';
  import { compact, int } from '$lib/format';
  import type { Meta } from '$lib/data';

  let { meta }: { meta: Meta } = $props();

  let selected = $state(config.map.metrics[0].column);
</script>

<Section
  id="map"
  title="Map"
  description="Records and species in each cell of the grid. Gaps on the map are often gaps in sampling, not absence of species."
>
  <Load file="cells">
    {#snippet children(cells)}
      {@const available = config.map.metrics.filter((m) => m.column in cells[0])}
      <div class="panel">
        <label class="select">
          Show
          <select bind:value={selected}>
            {#each available as m (m.column)}
              <option value={m.column}>{m.label}</option>
            {/each}
          </select>
        </label>
        <MapView
          {cells}
          metric={selected}
          label={available.find((m) => m.column === selected)?.label ?? selected}
          bbox={meta.area_bbox}
        />
        <p class="muted count">{int(cells.length)} cells</p>
      </div>
    {/snippet}
  </Load>

  <div class="below">
    <Panel title="Sampling effort across cells" note="Number of cells by number of records they hold.">
      <Load file="cell_histogram">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 240,
              marginLeft: 50,
              x: { label: 'Records in the cell', domain: ['1', '100', '1,000', '10,000', '>10,000'] },
              y: { label: 'Cells', tickFormat: compact, grid: true },
              marks: [
                Plot.barY(rows, { x: 'bin', y: 'cells', fill: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>
  </div>
</Section>

<style>
  .select {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.6rem;
    font-size: 0.9rem;
  }

  select {
    font: inherit;
    padding: 0.25rem 0.4rem;
    border: 1px solid var(--line);
    border-radius: 6px;
  }

  .count {
    font-size: 0.8rem;
    margin: 0.4rem 0 0;
  }

  .below {
    margin-top: 1rem;
  }
</style>
