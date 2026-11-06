<script lang="ts">
  // Loads a Parquet table and shows its content through the `children` snippet.
  // Shows a message instead if the file is missing, so a section never breaks the page.
  import type { Snippet } from 'svelte';
  import { loadTable, type ReadOptions, type Row } from '$lib/data';

  let {
    file,
    options = {},
    children
  }: { file: string; options?: ReadOptions; children: Snippet<[Row[]]> } = $props();
</script>

{#await loadTable(file, options)}
  <p class="muted">Loading…</p>
{:then rows}
  {#if rows.length}
    {@render children(rows)}
  {:else}
    <p class="muted">No data.</p>
  {/if}
{:catch}
  <p class="muted">
    Not available: <code>{file}.parquet</code> was not found. Run <code>prepare-data.R</code> to create it.
  </p>
{/await}
