<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    title,
    description = '',
    children
  }: { id: string; title: string; description?: string; children: Snippet } = $props();
</script>

<section {id}>
  <h2>{title}</h2>
  {#if description}<p class="description">{description}</p>{/if}
  {@render children()}
</section>

<style>
  section {
    margin-top: 2.5rem;
    scroll-margin-top: 4rem;
  }

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }

  .description {
    color: var(--muted);
    margin: 0 0 1rem;
    max-width: 70ch;
  }
</style>
