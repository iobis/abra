<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import Section from '$lib/components/Section.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Load from '$lib/components/Load.svelte';
  import PlotChart from '$lib/components/PlotChart.svelte';
  import { config } from '$lib/config';
  import { compact, MONTHS } from '$lib/format';
  import type { Row } from '$lib/data';

  // Phyla with the most species at the end of the period, to draw their curves
  function topGroups(rows: Row[], n = 6): string[] {
    const last = new Map<string, number>();
    for (const r of rows) last.set(r.phylum, Math.max(last.get(r.phylum) ?? 0, r.cumulative_species));
    return [...last.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name]) => name);
  }

  let byPhylum = $state(false);
</script>

<Section
  id="time"
  title="Through time"
  description="When the records were collected, and how fast new species were added to the list."
>
  <div class="grid">
    <Panel title="Records by year" note="Number of records by observation year.">
      <Load file="records_by_year">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 260,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Records', tickFormat: compact, grid: true },
              marks: [
                Plot.rectY(rows, { x1: (d) => d.date_year - 0.45, x2: (d) => d.date_year + 0.45, y: 'n_records', fill: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>

    <Panel title="Records by month" note="All years together: shows when sampling happens.">
      <Load file="records_by_month">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 260,
              marginLeft: 50,
              x: { label: null, tickFormat: (m: number) => MONTHS[m - 1], ticks: 12 },
              y: { label: 'Records', tickFormat: compact, grid: true },
              marks: [
                Plot.rectY(rows, { x1: (d) => d.month - 0.4, x2: (d) => d.month + 0.4, y: 'n_records', fill: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    </Panel>
  </div>

  <div class="gap"></div>

  <Panel
    title="Species accumulation"
    note="Cumulative number of species by the year of their first record. The curve follows sampling effort as much as biodiversity."
  >
    <label class="toggle">
      <input type="checkbox" bind:checked={byPhylum} /> By phylum
    </label>
    {#if byPhylum}
      <Load file="cumulative_species_phylum">
        {#snippet children(rows)}
          {@const groups = topGroups(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 300,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Species', tickFormat: compact, grid: true },
              color: { legend: true, domain: groups, range: config.colors.categorical },
              marks: [
                Plot.line(rows.filter((r) => groups.includes(r.phylum)), {
                  x: 'first_year', y: 'cumulative_species', stroke: 'phylum', curve: 'step-after', tip: true
                })
              ]
            })}
          />
        {/snippet}
      </Load>
    {:else}
      <Load file="cumulative_species">
        {#snippet children(rows)}
          <PlotChart
            options={(width) => ({
              width,
              height: 300,
              marginLeft: 50,
              x: { label: null, tickFormat: 'd' },
              y: { label: 'Species', tickFormat: compact, grid: true },
              marks: [
                Plot.areaY(rows, { x: 'first_year', y: 'cumulative_species', curve: 'step-after', fill: config.colors.primary, fillOpacity: 0.15 }),
                Plot.line(rows, { x: 'first_year', y: 'cumulative_species', curve: 'step-after', stroke: config.colors.primary, tip: true }),
                Plot.ruleY([0])
              ]
            })}
          />
        {/snippet}
      </Load>
    {/if}
  </Panel>
</Section>

<style>
  .gap {
    height: 1rem;
  }

  .toggle {
    font-size: 0.85rem;
    display: inline-block;
    margin-bottom: 0.4rem;
  }
</style>
