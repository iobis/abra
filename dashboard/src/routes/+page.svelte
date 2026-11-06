<script lang="ts">
  import type { Component } from 'svelte';
  import { config } from '$lib/config';
  import { dataUrl, loadMeta } from '$lib/data';
  import Overview from '$lib/sections/Overview.svelte';
  import MapSection from '$lib/sections/MapSection.svelte';
  import TimeSection from '$lib/sections/TimeSection.svelte';
  import TaxonomySection from '$lib/sections/TaxonomySection.svelte';
  import DepthSection from '$lib/sections/DepthSection.svelte';
  import DatasetsSection from '$lib/sections/DatasetsSection.svelte';
  import InformationSection from '$lib/sections/InformationSection.svelte';

  // To add a section: create a component in src/lib/sections, import it above and
  // add it here with an id, then put the id in `sections` in src/lib/config.ts.
  const available: Record<string, { label: string; component: Component<any> }> = {
    overview: { label: 'Overview', component: Overview },
    map: { label: 'Map', component: MapSection },
    time: { label: 'Through time', component: TimeSection },
    taxonomy: { label: 'Taxonomy', component: TaxonomySection },
    depth: { label: 'Depth', component: DepthSection },
    datasets: { label: 'Datasets', component: DatasetsSection },
    information: { label: 'Information', component: InformationSection }
  };

  const sections = config.sections.filter((id) => id in available);
  const metaPromise = loadMeta();
</script>

<svelte:head>
  {#await metaPromise then meta}
    <title>{config.title || meta.title || 'OBIS dashboard'}</title>
  {/await}
</svelte:head>

{#await metaPromise then meta}
  <header>
    <div class="inner">
      <h1>{config.title || meta.title || 'OBIS dashboard'}</h1>
      {#if config.subtitle || meta.subtitle}<p class="subtitle">{config.subtitle || meta.subtitle}</p>{/if}
      {#if config.intro}<p class="intro">{config.intro}</p>{/if}
    </div>
  </header>

  <nav>
    <div class="inner">
      {#each sections as id (id)}
        <a href="#{id}">{available[id].label}</a>
      {/each}
    </div>
  </nav>

  <main class="inner">
    {#each sections as id (id)}
      {@const Section = available[id].component}
      <Section {meta} />
    {/each}
  </main>

  <footer>
    <div class="inner">
      <p>
        Data:
        {#each meta.files ?? [] as file (file)}
          <a href={dataUrl(`${file}.parquet`)}>{file}</a>{' '}
        {/each}
      </p>
      <p>
        {#each config.links as link (link.href)}
          <a href={link.href}>{link.label}</a>{' '}
        {/each}
      </p>
    </div>
  </footer>
{/await}

<style>
  .inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  header {
    background: var(--primary);
    color: white;
    padding: 2rem 0 1.6rem;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    margin: 0.3rem 0 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .intro {
    margin: 0.8rem 0 0;
    max-width: 75ch;
    font-size: 0.92rem;
    opacity: 0.85;
  }

  nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--card);
    border-bottom: 1px solid var(--line);
  }

  nav .inner {
    display: flex;
    gap: 1.2rem;
    overflow-x: auto;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
  }

  nav a {
    text-decoration: none;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  main {
    padding-bottom: 3rem;
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 1.2rem 0 2rem;
    font-size: 0.8rem;
    color: var(--muted);
  }

  footer a {
    margin-right: 0.5rem;
  }
</style>
