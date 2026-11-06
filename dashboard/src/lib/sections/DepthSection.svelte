<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import Section from '$lib/components/Section.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Load from '$lib/components/Load.svelte';
  import PlotChart from '$lib/components/PlotChart.svelte';
  import { config } from '$lib/config';
  import { compact, percent } from '$lib/format';
</script>

<Section
  id="depth"
  title="Depth"
  description="How many records have depth information, and how records and species are spread over depth."
>
  <div class="grid">
    <Panel title="Depth information" note="Share of records with a minimum depth, a maximum depth, both or none.">
      <Load file="depth_coverage">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 240,
              marginLeft: 150,
              x: { label: 'Share of records (%)', grid: true },
              y: { label: null },
              marks: [
                Plot.barX(rows, { y: 'depth_coverage', x: 'total_perc', fill: config.colors.primary, sort: { y: '-x' }, tip: { format: { x: percent } } }),
                Plot.ruleX([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>

    <Panel title="Records and species by depth band" note="Depth in meters. Sampling is usually concentrated near the surface.">
      <Load file="depth_bands">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 240,
              marginLeft: 50,
              x: { label: 'Depth band (m)', domain: rows.map((r) => r.depth_band) },
              y: { label: 'Records / species', type: 'sqrt', tickFormat: compact, grid: true },
              color: { legend: true, domain: ['Records', 'Species'], range: [config.colors.primary, config.colors.secondary] },
              marks: [
                Plot.barY(rows, Plot.groupX({ y: 'sum' }, { x: 'depth_band', y: 'n_records', fill: () => 'Records', tip: true })),
                Plot.dot(rows, { x: 'depth_band', y: 'n_species', fill: () => 'Species', r: 5, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>
  </div>
</Section>
