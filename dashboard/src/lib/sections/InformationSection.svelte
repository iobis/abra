<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import Section from '$lib/components/Section.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Load from '$lib/components/Load.svelte';
  import PlotChart from '$lib/components/PlotChart.svelte';
  import { config } from '$lib/config';
  import { compact } from '$lib/format';
  import type { Meta } from '$lib/data';

  let { meta }: { meta: Meta } = $props();

  const rank = $derived(meta.information_rank ?? 'phylum');
</script>

<Section
  id="information"
  title="Information metrics"
  description="Metrics that count unique combinations instead of records, so that a few intensively sampled places do not dominate."
>
  <div class="grid">
    <Panel
      title="Year information"
      note={`Unique combinations of cell and ${rank} recorded in each observation year, regardless of when they were published.`}
    >
      <Load file="year_information">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 260,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Combinations', tickFormat: compact, grid: true },
              marks: [
                Plot.areaY(rows, { x: 'date_year' in rows[0] ? 'date_year' : 'year', y: 'i_p', fill: config.colors.primary, fillOpacity: 0.15 }),
                Plot.line(rows, { x: 'date_year' in rows[0] ? 'date_year' : 'year', y: 'i_p', stroke: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>

    <Panel
      title="Publication information"
      note={`Unique combinations of cell, observation year and ${rank} among the records published in each year: how much new information each year of publishing added.`}
    >
      <Load file="publication_information">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 260,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Combinations', tickFormat: compact, grid: true },
              marks: [
                Plot.rectY(rows, { x1: (d) => d.year - 0.45, x2: (d) => d.year + 0.45, y: 'i_p', fill: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>
  </div>
</Section>
