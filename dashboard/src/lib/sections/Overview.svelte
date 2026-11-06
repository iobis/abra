<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Load from '$lib/components/Load.svelte';
  import { int } from '$lib/format';
  import type { Meta, Row } from '$lib/data';

  let { meta }: { meta: Meta } = $props();

  function cards(s: Row) {
    return [
      { label: 'Records', value: int(s.n_records) },
      { label: 'Species', value: int(s.n_species) },
      { label: 'Families', value: int(s.n_family) },
      { label: 'Phyla', value: int(s.n_phylum) },
      { label: 'Datasets', value: int(s.n_datasets) },
      { label: 'Years covered', value: s.min_year ? `${s.min_year}–${s.max_year}` : '–' },
      {
        label: 'Threatened species',
        value: int(s.n_species_cr + s.n_species_en + s.n_species_vu),
        note: 'CR, EN and VU on the Red List'
      },
      {
        label: 'Species with a single record',
        value: int(s.n_species_single_record),
        note: `${Math.round((100 * s.n_species_single_record) / s.n_species)}% of the species`
      }
    ];
  }

  const taxa = $derived(
    meta.taxa ? Object.entries(meta.taxa).map(([rank, names]) => `${rank}: ${[names].flat().join(', ')}`).join(' · ') : ''
  );
</script>

<Section id="overview" title="Overview">
  <Load file="basic_stats">
    {#snippet children(rows)}
      <div class="cards">
        {#each cards(rows[0]) as card (card.label)}
          <div class="panel card">
            <span class="label">{card.label}</span>
            <span class="value">{card.value}</span>
            {#if card.note}<span class="note">{card.note}</span>{/if}
          </div>
        {/each}
      </div>
    {/snippet}
  </Load>

  <p class="muted details">
    {#if meta.date_start}Records from {meta.date_start} to {meta.date_end}.{/if}
    {#if taxa}Taxa: {taxa}.{/if}
    {#if meta.resolution}Maps use H3 cells of resolution {meta.resolution}.{/if}
    {#if meta.generated}Data prepared on {meta.generated}.{/if}
  </p>
</Section>

<style>
  .cards {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .label {
    color: var(--muted);
    font-size: 0.82rem;
  }

  .value {
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--primary);
  }

  .card .note {
    color: var(--muted);
    font-size: 0.75rem;
    margin: 0;
  }

  .details {
    font-size: 0.85rem;
    margin-top: 0.8rem;
  }
</style>
