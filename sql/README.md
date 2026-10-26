# SQL templates

Each file is a SQL template that `run_query()` fills in with the query set up through the `set_*()` functions and runs against a data product. There is one folder per product:

- `open-data/`: the full OBIS open data (one row per record).
- `speciesgrids/`: the pre-aggregated speciesgrids product (one row per cell and species, OBIS and GBIF records identified to species).

Only metrics that can be computed from the columns of a product are present in its folder. Run `print_sql(query, "template-name")` to see the SQL after substitution.

## How the templates work

- **Header**: `version`, `target` (product) and `objective`, as comments at the top (used to build `sql-files.json`).
- **Markers**: lines like `-- [start conditions]` / `-- [end conditions]` are replaced when the query runs:
  - `conditions`: dropped/absence filters plus the area, period, depth and filters set on the query. Extra filters written after the end marker are kept.
  - `cell block`: the grid cell expression, from `set_grid()`.
  - `taxon block`: the taxon column, from `set_taxonomic_level()` (otherwise the default written in the template).
  - `depth band block`: the depth classification, from `set_depth_bands()` (otherwise the default written in the template).
- **`-bycell`**: files with this suffix return one row per grid cell. The file without it returns the result for the whole area (cells are still used internally by metrics that need them, such as `cell-sampling`).

## Parameters you can usually change

`set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size) apply to every template. Metric-specific settings are listed with each metric below, and in the help page of each metric (e.g. `?metric_richness`).

On speciesgrids, `set_period()` and `set_depth()` are ignored (with a warning), `set_filters()` only supports `taxonid` and `scientificname`, and the grid cannot be finer than H3 resolution 7.

## Sensitivity to sampling bias

Almost all metrics based on counts of species or records follow where and when people sampled. Each metric is tagged:

- **[bias: high]**: strongly driven by sampling effort; interpret only next to the diagnostics below.
- **[bias: moderate]**: partly corrected for effort, or reflects effort only in part.
- [bias: low]: reflects data quality more than effort.
- [diagnostic]: describes the data or the bias itself; use these to judge the others.

## Metrics

| Template | Products | By cell | Bias |
|---|---|---|---|
| [richness](#richness) | open-data, speciesgrids | yes | **[bias: high]** |
| [diversity-indices](#diversity-indices) | open-data, speciesgrids | yes | **[bias: high]** |
| [richness-estimators](#richness-estimators) | open-data, speciesgrids | yes | **[bias: moderate]** |
| [rarity-records](#rarity-records) | open-data, speciesgrids | yes | **[bias: high]** |
| [species-cell-occupancy](#species-cell-occupancy) | open-data, speciesgrids | no | **[bias: high]** |
| [taxon-level](#taxon-level) | open-data | yes | [bias: low] |
| [cell-sampling](#cell-sampling) | open-data, speciesgrids | yes | [diagnostic] |
| [temporal-gaps](#temporal-gaps) | open-data | yes | [diagnostic] |
| [records-by-year](#records-by-year) | open-data | yes | **[bias: moderate]** |
| [records-by-month](#records-by-month) | open-data | yes | **[bias: moderate]** |
| [depth-coverage](#depth-coverage) | open-data | yes | [diagnostic] |
| [depth-bands](#depth-bands) | open-data | yes | **[bias: high]** |
| [coordinate-uncertainty](#coordinate-uncertainty) | open-data | yes | [diagnostic] |
| [extension-coverage](#extension-coverage) | open-data | yes | [diagnostic] |
| [cumulative-species](#cumulative-species) | open-data, speciesgrids | yes | **[bias: high]** |
| [discovery-rate](#discovery-rate) | open-data, speciesgrids | yes | **[bias: high]** |
| [last-seen](#last-seen) | open-data, speciesgrids | yes | **[bias: high]** |
| [threatened-species](#threatened-species) | open-data, speciesgrids | yes | **[bias: high]** |
| [wrims-species](#wrims-species) | open-data | yes | **[bias: high]** |
| [hotspot-overlap](#hotspot-overlap) | open-data, speciesgrids | yes | **[bias: high]** |
| [publication-information](#publication-information) | open-data | yes | **[bias: moderate]** |
| [year-information](#year-information) | open-data | yes | **[bias: moderate]** |

### Richness and composition

#### richness

**[bias: high]** Taxonomic richness. Number of distinct taxa at species, genus, family, order, class and phylum level, plus the number of records.

- **Files**: `richness.sql`, `richness-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_species`, `n_genus`, `n_family`, `n_order`, `n_class`, `n_phylum`, `n_records`. By cell: The same columns, one row per `cell`.
- **Bias**: Observed richness grows with the number of records and with sampling effort, so cells that are better sampled look richer. Compare cells only together with `cell-sampling` or `richness-estimators`.
- **Parameters**: only the general ones above.
- **Notes**: On speciesgrids `n_records` counts only records identified to species (OBIS and GBIF).

#### diversity-indices

**[bias: high]** Diversity indices. Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using the number of records of each species as its abundance.

- **Files**: `diversity-indices.sql`, `diversity-indices-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_species`, `n_records`, `shannon`, `simpson`, `pielou`. By cell: The same columns, one row per `cell`.
- **Bias**: Records are not individuals, and the indices depend on sample size and on a few heavily sampled species or datasets. Pielou is `NA` for cells with a single species.
- **Parameters**: only the general ones above.

#### richness-estimators

**[bias: moderate]** Richness estimators and sampling completeness. Bias-corrected Chao1 estimate of richness, sampling completeness (observed richness / Chao1) and records per species. `f1` and `f2` are the number of species with exactly one and two records.

- **Files**: `richness-estimators.sql`, `richness-estimators-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_species`, `n_records`, `f1`, `f2`, `chao1`, `completeness`, `records_per_species`. By cell: The same columns, one row per `cell`.
- **Bias**: Designed to account for undetected species, but it uses records as abundance and is only a lower bound; it is unreliable where there are very few records or where sampling is strongly clustered. Use `completeness` as a flag, not as truth.
- **Parameters**: only the general ones above.
- **Notes**: ACE is not implemented.

#### rarity-records

**[bias: high]** Rarity by number of records. Share of species with 1 to 5 records.

- **Files**: `rarity-records.sql`, `rarity-records-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_species`, `n_singletons`, `n_rare_species`, `pct_rare_species`. By cell: The same columns, one row per `cell`.
- **Bias**: A species with few records is often just under-sampled, not rare. The share of rare species is mostly a function of effort.
- **Parameters**: The threshold of 5 records (and the singleton count) is fixed in the template.

#### species-cell-occupancy

**[bias: high]** Species occupancy of cells. For each species, the number of cells in which it occurs and the share of all cells with records.

- **Files**: `species-cell-occupancy.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `species`, `n_cells`, `pct_cells`, `n_records`.
- **Bias**: Occupancy is bounded by where sampling happened; a species can look restricted only because the surrounding cells were never sampled.
- **Parameters**: The grid resolution changes the result strongly (coarser cells give higher occupancy).

#### taxon-level

[bias: low] Taxonomic resolution. Level (Species, Genus, Family, Order, Class, Phylum, Kingdom or Other) to which each distinct taxon in the data is resolved, with counts and percentages.

- **Files**: `taxon-level.sql`, `taxon-level-bycell.sql`
- **Products**: open-data
- **Returns**: `higher_level`, `total`, `total_perc`. By cell: The same columns, one row per `cell` and level.
- **Bias**: Reflects the quality of identification rather than biodiversity, but varies with the datasets in the area (e.g. DNA or imaging data).
- **Parameters**: only the general ones above.
- **Notes**: Not available for speciesgrids: it only holds records identified to species.

### Sampling and coverage

#### cell-sampling

[diagnostic] Sampling of cells. Number of cells with fewer than 10, 100 and 1000 records for the whole area; by cell, the records and species of each cell.

- **Files**: `cell-sampling.sql`, `cell-sampling-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_cells`, `n_cells_lt_10`, `n_cells_lt_100`, `n_cells_lt_1000`, the matching `pct_cells_lt_*`, and `median_records_per_cell`. By cell: `cell`, `n_records`, `n_species`.
- **Bias**: Describes the spatial bias in sampling effort, so it is the reference for reading the metrics marked high.
- **Parameters**: The thresholds 10, 100 and 1000 are fixed in the template.

#### temporal-gaps

[diagnostic] Temporal coverage of cells. How many years each cell was sampled and the longest run of consecutive sampled years.

- **Files**: `temporal-gaps.sql`, `temporal-gaps-bycell.sql`
- **Products**: open-data
- **Returns**: `n_cells`, `n_cells_1_year`, `n_cells_ge_5_years`, `n_cells_ge_10_years`, `n_cells_gt_10_years` (overlapping classes), `largest_sequence` and `cell_largest_sequence`. By cell: `cell`, `n_years`, `first_year`, `last_year`, `longest_run`.
- **Bias**: Describes the temporal bias in sampling. Many cells with a single year mean that trends per cell are not reliable.
- **Parameters**: The classes 1, 5, 10 years are fixed in the template.
- **Notes**: Not available for speciesgrids, which only stores the first and last year.

#### records-by-year

**[bias: moderate]** Records by year. Number of records (identified to species) per observation year.

- **Files**: `records-by-year.sql`, `records-by-year-bycell.sql`
- **Products**: open-data
- **Returns**: `date_year`, `total`. By cell: The same columns, one row per `cell` and year.
- **Bias**: Reflects effort, project funding and publication practices; it is not a trend in abundance.
- **Parameters**: `set_period()` limits the years.

#### records-by-month

**[bias: moderate]** Records by month. Number of records (identified to species) per month of the year, with the quarter.

- **Files**: `records-by-month.sql`, `records-by-month-bycell.sql`
- **Products**: open-data
- **Returns**: `month`, `total`, `quarter`. By cell: The same columns, one row per `cell` and month.
- **Bias**: Seasonality in the records mostly reflects seasonality of sampling (e.g. summer cruises), not of the organisms.
- **Parameters**: only the general ones above.

#### depth-coverage

[diagnostic] Depth information coverage. Whether records have both minimum and maximum depth, only one, or none.

- **Files**: `depth-coverage.sql`, `depth-coverage-bycell.sql`
- **Products**: open-data
- **Returns**: `depth_coverage`, `total`, `total_perc`. By cell: The same columns, one row per `cell` and class.
- **Bias**: Tells how much of the data can be used in depth-based analysis.
- **Parameters**: only the general ones above.

#### depth-bands

**[bias: high]** Richness and records by depth band. Number of species and records in each depth band. The band uses the minimum depth, or the maximum depth when the minimum is missing; records without depth are `Unknown`.

- **Files**: `depth-bands.sql`, `depth-bands-bycell.sql`
- **Products**: open-data
- **Returns**: `depth_band`, `n_species`, `n_records`. By cell: The same columns, one row per `cell` and band.
- **Bias**: Sampling is concentrated in shallow waters, so records and richness per band mostly reflect effort at each depth.
- **Parameters**: `set_depth_bands()` sets the band limits (default 0-20, 20-200, 200-1000, 1000+ m). It is different from `set_depth()`, which filters records.

#### coordinate-uncertainty

[diagnostic] Coordinate uncertainty. Distribution of the coordinate uncertainty (meters) and the share of records without it.

- **Files**: `coordinate-uncertainty.sql`, `coordinate-uncertainty-bycell.sql`
- **Products**: open-data
- **Returns**: `n_records`, `n_with_uncertainty`, `pct_missing`, `min_uncertainty`, `median_uncertainty`, `p90_uncertainty`, `max_uncertainty`, and counts per class (<= 100 m, 100 m-1 km, 1-10 km, > 10 km). By cell: The same columns, one row per `cell`.
- **Bias**: Shows whether the spatial resolution you chose is supported by the data: records with an uncertainty larger than the cell can fall in the wrong cell.
- **Parameters**: The size classes are fixed in the template.

#### extension-coverage

[diagnostic] Extension coverage. Records and datasets with an extendedMeasurementOrFact or DNA derived data extension.

- **Files**: `extension-coverage.sql`, `extension-coverage-bycell.sql`
- **Products**: open-data
- **Returns**: `n_records`, `n_records_emof`, `n_records_dna`, `pct_records_emof`, `pct_records_dna`, `n_datasets_emof`, `n_datasets_dna`. By cell: The same columns, one row per `cell`.
- **Bias**: Measures how much extra data is available; it depends on which datasets happen to be in the area.
- **Parameters**: only the general ones above.

### Temporal dynamics

#### cumulative-species

**[bias: high]** Cumulative species by year. Species first recorded each year and their cumulative number. Variants `cumulative-species-kingdom`, `-phylum` and `-class` do the same inside each group.

- **Files**: `cumulative-species.sql`, `cumulative-species-kingdom.sql`, `cumulative-species-phylum.sql`, `cumulative-species-class.sql`, `cumulative-species-bycell.sql`, `cumulative-species-kingdom-bycell.sql`, `cumulative-species-phylum-bycell.sql`, `cumulative-species-class-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `first_year`, `new_species`, `cumulative_species` (plus `kingdom`, `phylum` or `class` in the variants). By cell: The same columns, one row per `cell` (and group) and year.
- **Bias**: The curve follows the history of sampling effort; steps are caused by individual surveys or datasets. It is sparse: years without new species are not included.
- **Parameters**: The kingdom variant keeps only the kingdoms listed in the template.
- **Notes**: On speciesgrids the year is the earliest `min_year` of the species, and species without a year are dropped.

#### discovery-rate

**[bias: high]** Discovery rate. New species per year and per 1000 records, to see whether the species list is saturating.

- **Files**: `discovery-rate.sql`, `discovery-rate-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `year`, `new_species`, `cumulative_species`, `n_records`, `cumulative_records`, `new_species_per_1000_records`. By cell: The same columns, one row per `cell` and year.
- **Bias**: Saturation can reflect a limit to effort, not completeness; and changes in effort between years are not corrected.
- **Parameters**: only the general ones above.
- **Notes**: On speciesgrids only `year`, `new_species` and `cumulative_species` exist, since records cannot be split by year.

#### last-seen

**[bias: high]** Last year each species was seen. First and last year each species was recorded, and the number of records. Filter on `last_year` to flag species not recorded recently.

- **Files**: `last-seen.sql`, `last-seen-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `species`, `first_year`, `last_year`, `n_records`. By cell: The same columns, one row per `cell` and species (this can be very large).
- **Bias**: A species 'not seen recently' may simply not have been sampled again, or its recent data may not be published yet.
- **Parameters**: only the general ones above.

### Conservation

#### threatened-species

**[bias: high]** Threatened species. Number of threatened species (Red List categories CR, EN and VU), per category, and their records.

- **Files**: `threatened-species.sql`, `threatened-species-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_threatened_species`, `n_cr_species`, `n_en_species`, `n_vu_species`, `n_species`, `n_records_threatened`, `n_records`. By cell: The same columns, one row per `cell`.
- **Bias**: Follows richness and sampling effort, and the Red List is itself taxonomically biased: many marine groups are not assessed.
- **Parameters**: The categories are fixed in the template.
- **Notes**: On speciesgrids `category` is only filled for threatened or extinct species.

#### wrims-species

**[bias: high]** WRiMS-flagged species over time. Species and records flagged in WRiMS (e.g. introduced or invasive), per year.

- **Files**: `wrims-species.sql`, `wrims-species-bycell.sql`
- **Products**: open-data
- **Returns**: `year`, `n_species_wrims`, `n_records_wrims`, `n_species`, `n_records`. By cell: The same columns, one row per `cell` and year.
- **Bias**: Detections depend on monitoring effort (ports, targeted surveys) and on how well WRiMS covers each region.
- **Parameters**: `set_period()` limits the years.
- **Notes**: Not available for speciesgrids.

#### hotspot-overlap

**[bias: high]** Hotspot overlap. Cells in the top decile of richness and of threatened-species richness, and whether both coincide.

- **Files**: `hotspot-overlap.sql`, `hotspot-overlap-bycell.sql`
- **Products**: open-data, speciesgrids
- **Returns**: `n_cells`, `n_richness_hotspots`, `n_threatened_hotspots`, `n_overlap`, `pct_threatened_hotspots_in_richness_hotspots`. By cell: `cell`, `n_species`, `n_threatened_species`, `richness_hotspot`, `threatened_hotspot`, `overlap`.
- **Bias**: Hotspots built on observed richness mirror where sampling is most intense, and the two layers share this bias, so overlap is partly expected.
- **Parameters**: The top decile (90th percentile) is fixed in the template. A cell is a threatened-species hotspot only if it has at least one threatened species.

### Information metrics

#### publication-information

**[bias: moderate]** Publication information metric (PI). For each publication year, the number of unique (cell, observation year, taxon) combinations among the records published that year.

- **Files**: `publication-information.sql`, `publication-information-bycell.sql`
- **Products**: open-data
- **Returns**: `year`, `i_p`, `n_cells`, `cv` (spatial evenness: coefficient of variation of the combinations per cell). By cell: `year`, `cell`, `i_p`.
- **Bias**: Counts unique combinations instead of records, so it is less driven by record numbers, but it still depends on how much was sampled and published.
- **Parameters**: `set_taxonomic_level()` sets the taxon (default phylum). Needs a `dataset_info` table (`id`, `created`, `published`) in the connection.
- **Notes**: The publication year is `created`, falling back to `published`. Not available for speciesgrids.

#### year-information

**[bias: moderate]** Year information metric (YI). For each observation year, the number of unique (cell, taxon) combinations, regardless of when records were published.

- **Files**: `year-information.sql`, `year-information-bycell.sql`
- **Products**: open-data
- **Returns**: `year`, `i_p`, `n_cells`, `cv` (spatial evenness). By cell: `year`, `cell`, `i_p`.
- **Bias**: As for PI: less driven by record numbers, but still dependent on sampling effort per year.
- **Parameters**: `set_taxonomic_level()` sets the taxon (default phylum). `set_period()` limits the observation years.
- **Notes**: Not available for speciesgrids.
