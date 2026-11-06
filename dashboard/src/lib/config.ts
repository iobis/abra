// ─────────────────────────────────────────────────────────────────────────────
// Settings of the dashboard. This is the file to edit to make it yours.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  // Title and subtitle. If they are empty, the ones written by `prepare-data.R`
  // (static/data/meta.json) are used.
  title: '',
  subtitle: '',

  // Short text shown at the top of the page, under the title. Leave empty to hide it.
  intro:
    'Records of marine species from the Ocean Biodiversity Information System (OBIS) in this area. ' +
    'Counts of records and species reflect where and when people sampled, not only where species live: ' +
    'read the maps and curves together with the sampling charts.',

  // Folder (inside `static/`) with the files created by `prepare-data.R`
  dataPath: 'data',

  // Sections to show, in order. Remove a line to hide a section, or move it to change the order.
  //   overview      numbers for the whole area
  //   map           map of the grid cells and sampling effort
  //   time          records by year and month, species accumulation
  //   taxonomy      taxonomic resolution and species list
  //   depth         depth information
  //   datasets      datasets and their data types
  //   information   publication and year information metrics
  sections: ['overview', 'map', 'time', 'taxonomy', 'depth', 'datasets', 'information'],

  // Colors
  colors: {
    primary: '#113b9f', // bars, lines and links
    secondary: '#d1495b', // second series in charts
    // Colors for groups (e.g. phyla)
    categorical: ['#113b9f', '#d1495b', '#2a9d8f', '#e9c46a', '#8d5fd3', '#f4a261', '#6c757d']
  },

  // Map
  map: {
    // Metrics the map can show: a column of `cells.parquet` and its label.
    // Columns that are not in the file are ignored.
    metrics: [
      { column: 'n_records', label: 'Records' },
      { column: 'n_species', label: 'Species' },
      { column: 'n_datasets', label: 'Datasets' },
      { column: 'n_species_single_record', label: 'Species with a single record' }
    ],
    // Use a logarithmic color scale (recommended for counts)
    log: true,
    // Basemap: a MapLibre style. This one uses the OBIS vector tiles. You can replace it
    // by the address of any MapLibre style JSON.
    style: {
      version: 8,
      sources: {
        land: {
          type: 'vector',
          tiles: ['https://tiles.obis.org/land_tiles/{z}/{x}/{y}.pbf'],
          minzoom: 0,
          maxzoom: 14
        },
        coastlines: {
          type: 'vector',
          tiles: ['https://tiles.obis.org/coastlines_tiles/{z}/{x}/{y}.pbf'],
          minzoom: 0,
          maxzoom: 14
        }
      },
      layers: [
        { id: 'background', type: 'background', paint: { 'background-color': '#e8ecf0' } },
        {
          id: 'land',
          type: 'fill',
          source: 'land',
          'source-layer': 'land',
          paint: { 'fill-color': '#f8fafc' }
        },
        {
          id: 'coastlines',
          type: 'line',
          source: 'coastlines',
          'source-layer': 'coastlines',
          paint: { 'line-color': '#334155', 'line-width': 0.4, 'line-opacity': 0.85 }
        }
      ]
    } as any,
    // Color ramp, from low to high values
    ramp: ['#0868ac', '#0ea8bd', '#44d699', '#f6d145', '#dc3220']
  },

  // Links shown in the footer
  links: [
    { label: 'OBIS', href: 'https://obis.org' },
    { label: 'abra', href: 'https://github.com/iobis/abra' }
  ]
};
