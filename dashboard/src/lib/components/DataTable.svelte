<script lang="ts" module>
  export interface Column {
    key: string;
    label: string;
    /** Text for the cell; by default the value itself (numbers get thousands separators). */
    format?: (value: any, row: Record<string, any>) => string;
    align?: 'left' | 'right';
    italic?: boolean;
  }
</script>

<script lang="ts">
  // A table with search, sorting by column and pages.
  let {
    rows,
    columns,
    pageSize = 20,
    searchable = true
  }: {
    rows: Record<string, any>[];
    columns: Column[];
    pageSize?: number;
    searchable?: boolean;
  } = $props();

  let search = $state('');
  let sortKey = $state<string | null>(null);
  let sortDesc = $state(true);
  let page = $state(0);

  const filtered = $derived.by(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(term))
    );
  });

  const sorted = $derived.by(() => {
    if (!sortKey) return filtered;
    const key = sortKey;
    const dir = sortDesc ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (x == null) return 1; // empty values always last
      if (y == null) return -1;
      return (x < y ? -1 : x > y ? 1 : 0) * dir;
    });
  });

  const pages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
  const visible = $derived(sorted.slice(page * pageSize, (page + 1) * pageSize));

  // Go back to the first page when the search or the sorting changes
  $effect(() => {
    search;
    sortKey;
    sortDesc;
    page = 0;
  });

  function sortBy(key: string) {
    if (sortKey === key) sortDesc = !sortDesc;
    else {
      sortKey = key;
      sortDesc = true;
    }
  }

  function show(column: Column, row: Record<string, any>) {
    const value = row[column.key];
    if (column.format) return column.format(value, row);
    if (value == null) return '';
    return typeof value === 'number' ? value.toLocaleString('en') : String(value);
  }
</script>

{#if searchable}
  <input class="search" type="search" placeholder="Search…" bind:value={search} />
{/if}

<div class="wrap">
  <table>
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th class={column.align} onclick={() => sortBy(column.key)}>
            {column.label}
            {#if sortKey === column.key}<span class="arrow">{sortDesc ? '▼' : '▲'}</span>{/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each visible as row, i (i)}
        <tr>
          {#each columns as column (column.key)}
            <td class={[column.align, column.italic && 'italic']}>{show(column, row)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="pager">
  <span class="muted">{sorted.length.toLocaleString('en')} rows</span>
  <span>
    <button onclick={() => (page -= 1)} disabled={page === 0}>←</button>
    <span class="muted">Page {page + 1} of {pages}</span>
    <button onclick={() => (page += 1)} disabled={page >= pages - 1}>→</button>
  </span>
</div>

<style>
  .search {
    width: 100%;
    max-width: 280px;
    margin-bottom: 0.6rem;
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    font: inherit;
  }

  .wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  th,
  td {
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid var(--line);
    text-align: left;
    white-space: nowrap;
  }

  th {
    cursor: pointer;
    user-select: none;
    color: var(--muted);
    font-weight: 600;
    position: sticky;
    top: 0;
    background: var(--card);
  }

  th:hover {
    color: var(--text);
  }

  .right {
    text-align: right;
  }

  .italic {
    font-style: italic;
  }

  .arrow {
    font-size: 0.7em;
  }

  .pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.6rem;
    font-size: 0.85rem;
  }

  button {
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 6px;
    padding: 0.15rem 0.6rem;
    cursor: pointer;
    font: inherit;
  }

  button:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
