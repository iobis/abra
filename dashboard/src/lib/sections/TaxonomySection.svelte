<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import Section from '$lib/components/Section.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Load from '$lib/components/Load.svelte';
  import PlotChart from '$lib/components/PlotChart.svelte';
  import DataTable, { type Column } from '$lib/components/DataTable.svelte';
  import { config } from '$lib/config';
  import { percent } from '$lib/format';
  import { tableInfo } from '$lib/data';

  const columns: Column[] = [
    {
      key: 'species',
      label: 'Taxon',
      italic: true,
      // Records identified only to a higher rank have no species: show the lowest known rank
      format: (value, row) =>
        value ??
        ['genus', 'family', 'order', 'class', 'phylum', 'kingdom']
          .map((rank) => (row[rank] ? `${row[rank]} (${rank})` : null))
          .find(Boolean) ??
        ''
    },
    { key: 'family', label: 'Family' },
    { key: 'class', label: 'Class' },
    { key: 'redlist_category', label: 'Red List' },
    { key: 'n_records', label: 'Records', align: 'right' },
    { key: 'n_datasets', label: 'Datasets', align: 'right' },
    { key: 'first_year', label: 'First', align: 'right', format: (v) => (v ?? '').toString() },
    { key: 'last_year', label: 'Last', align: 'right', format: (v) => (v ?? '').toString() }
  ];

  // The species file can be large: only the first rows are read (Hyparquet reads just the
  // row groups that contain them) until the "load all" button is used.
  const firstRows = 1000;
  let limit = $state<number | undefined>(firstRows);
  const info = tableInfo('species_list').catch(() => null);
</script>

<Section
  id="taxonomy"
  title="Taxonomy"
  description="How well the records are identified, and the species found in the area."
>
  <Panel
    title="Taxonomic resolution"
    note="Share of the distinct taxa identified down to each level. Records identified only to a high level are less useful for species-level analysis."
  >
    <Load file="taxon_level">
      {#snippet children(rows)}
        <PlotChart
          options={(width) => ({
            width,
            height: 240,
            marginLeft: 70,
            x: { label: 'Share of taxa (%)', grid: true },
            y: { label: null, domain: rows.map((r) => r.higher_level) },
            marks: [
              Plot.barX(rows, { y: 'higher_level', x: 'total_perc', fill: config.colors.primary, tip: { format: { x: percent } } }),
              Plot.ruleX([0])
            ]
          })}
        />
      {/snippet}
    </Load>
  </Panel>

  <div class="gap"></div>

  <Panel title="Taxa in the area" note="Click a column to sort. Sorting and search apply to the rows loaded.">
    <Load file="species_list" options={{ rowEnd: limit }}>
      {#snippet children(rows)}
        <DataTable {rows} {columns} />
      {/snippet}
    </Load>
    {#await info then total}
      {#if total && limit !== undefined && total.numRows > limit}
        <p class="more">
          Showing the {limit.toLocaleString('en')} most recorded of {total.numRows.toLocaleString('en')} taxa.
          <button onclick={() => (limit = undefined)}>Load all</button>
        </p>
      {/if}
    {/await}
  </Panel>
</Section>

<style>
  .gap {
    height: 1rem;
  }

  .more {
    font-size: 0.85rem;
    color: var(--muted);
  }

  button {
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 6px;
    padding: 0.15rem 0.6rem;
    cursor: pointer;
    font: inherit;
  }
</style>
