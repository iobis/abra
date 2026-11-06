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
  id="datasets"
  title="Datasets"
  description="The datasets that contributed records, the kind of data they hold and when they were published."
>
  <div class="grid">
    <Panel title="Datasets by data type" note="eMoF: extended measurements or facts. DNA: DNA derived data.">
      <Load file="datasets_by_extension">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 240,
              marginLeft: 100,
              marginRight: 50,
              x: { label: 'Datasets', grid: true },
              y: { label: null },
              marks: [
                Plot.barX(rows, { y: 'type', x: 'total', fill: config.colors.primary, sort: { y: '-x' }, tip: { format: { x: (v: number) => String(v) } } }),
                Plot.text(rows, { y: 'type', x: 'total', text: (d) => percent(d.total_perc), dx: 4, textAnchor: 'start' }),
                Plot.ruleX([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>

    <Panel title="Datasets by publication year" note="Datasets with records in the area, by the year they were first registered in OBIS.">
      <Load file="published_by_year">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 240,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Datasets', grid: true },
              marks: [
                Plot.rectY(rows, { x1: (d) => d.year - 0.45, x2: (d) => d.year + 0.45, y: 'n_datasets', fill: config.colors.primary, tip: true }),
                Plot.line(rows, { x: 'year', y: 'cumulative_datasets', stroke: config.colors.secondary, strokeWidth: 2 }),
                Plot.ruleY([0])
              ]
            })}
          />
          <p class="muted legend"><span style:color={config.colors.primary}>■</span> new datasets · <span style:color={config.colors.secondary}>━</span> cumulative</p>
        {/snippet}
      </Load>
    </Panel>
  </div>
</Section>

<style>
  .legend {
    font-size: 0.8rem;
    margin: 0.3rem 0 0;
  }
</style>
