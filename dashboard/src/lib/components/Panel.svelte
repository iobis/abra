<script lang="ts">
  // A white card with a title, an optional note and content
  import type { Snippet } from 'svelte';

  let { title, note = '', children }: { title: string; note?: string; children: Snippet } = $props();
</script>

<div class="panel">
  <h3>{title}</h3>
  {#if note}<p class="note">{note}</p>{/if}
  {@render children()}
</div>
