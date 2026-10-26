# Documentation of the SQL metrics.
#
# Documentation only: one help page per template in `sql/`, so the metrics can be
# found with `?metric_<name>` (e.g. `?metric_richness`). Nothing here is code;
# the templates are run with `run_query()`. Keep in sync with `sql/README.md`.

#' SQL metrics
#'
#' Overview of all the SQL metrics (templates in `sql/`) that can be run with [run_query()]. Each metric has its own help page, linked below.
#'
#' @name metrics
#' @aliases metrics
#' @family sql metrics
#'
#' @section How to use:
#' Build a query with the `set_*()` functions and run a template by name:
#'
#' ```
#' con |>
#'   set_area(area) |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query(c("richness", "cell-sampling-bycell"))
#' ```
#'
#' Templates ending in `-bycell` return one row per grid cell. Templates are stored per data product in `sql/open-data/` and `sql/speciesgrids/`; see `sql/README.md`.
#'
#' @section Sensitivity to sampling bias:
#' Metrics tagged *high* follow where and when people sampled and should be read next to the *diagnostic* metrics (`cell-sampling`, `temporal-gaps`, ...). *Moderate* metrics are partly corrected for effort; *low* ones reflect data quality more than effort.
#'
#' @section Richness and composition:
#'
#' | Metric | Products | By cell | Bias | What it gives |
#' |---|---|---|---|---|
#' | [metric_richness] (`richness`) | open-data, speciesgrids | yes | high | Number of distinct taxa at species, genus, family, order, class and phylum level, plus the number of records |
#' | [metric_diversity_indices] (`diversity-indices`) | open-data, speciesgrids | yes | high | Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using the number of records of each species as its abundance |
#' | [metric_richness_estimators] (`richness-estimators`) | open-data, speciesgrids | yes | moderate | Bias-corrected Chao1 estimate of richness, sampling completeness (observed richness / Chao1) and records per species |
#' | [metric_rarity_records] (`rarity-records`) | open-data, speciesgrids | yes | high | Share of species with 1 to 5 records |
#' | [metric_species_cell_occupancy] (`species-cell-occupancy`) | open-data, speciesgrids | no | high | For each species, the number of cells in which it occurs and the share of all cells with records |
#' | [metric_taxon_level] (`taxon-level`) | open-data | yes | low | Level (Species, Genus, Family, Order, Class, Phylum, Kingdom or Other) to which each distinct taxon in the data is resolved, with counts and percentages |
#'
#' @section Sampling and coverage:
#'
#' | Metric | Products | By cell | Bias | What it gives |
#' |---|---|---|---|---|
#' | [metric_cell_sampling] (`cell-sampling`) | open-data, speciesgrids | yes | diagnostic | Number of cells with fewer than 10, 100 and 1000 records for the whole area; by cell, the records and species of each cell |
#' | [metric_temporal_gaps] (`temporal-gaps`) | open-data | yes | diagnostic | How many years each cell was sampled and the longest run of consecutive sampled years |
#' | [metric_records_by_year] (`records-by-year`) | open-data | yes | moderate | Number of records (identified to species) per observation year |
#' | [metric_records_by_month] (`records-by-month`) | open-data | yes | moderate | Number of records (identified to species) per month of the year, with the quarter |
#' | [metric_depth_coverage] (`depth-coverage`) | open-data | yes | diagnostic | Whether records have both minimum and maximum depth, only one, or none |
#' | [metric_depth_bands] (`depth-bands`) | open-data | yes | high | Number of species and records in each depth band |
#' | [metric_coordinate_uncertainty] (`coordinate-uncertainty`) | open-data | yes | diagnostic | Distribution of the coordinate uncertainty (meters) and the share of records without it |
#' | [metric_extension_coverage] (`extension-coverage`) | open-data | yes | diagnostic | Records and datasets with an extendedMeasurementOrFact or DNA derived data extension |
#'
#' @section Temporal dynamics:
#'
#' | Metric | Products | By cell | Bias | What it gives |
#' |---|---|---|---|---|
#' | [metric_cumulative_species] (`cumulative-species`) | open-data, speciesgrids | yes | high | Species first recorded each year and their cumulative number |
#' | [metric_discovery_rate] (`discovery-rate`) | open-data, speciesgrids | yes | high | New species per year and per 1000 records, to see whether the species list is saturating |
#' | [metric_last_seen] (`last-seen`) | open-data, speciesgrids | yes | high | First and last year each species was recorded, and the number of records |
#'
#' @section Conservation:
#'
#' | Metric | Products | By cell | Bias | What it gives |
#' |---|---|---|---|---|
#' | [metric_threatened_species] (`threatened-species`) | open-data, speciesgrids | yes | high | Number of threatened species (Red List categories CR, EN and VU), per category, and their records |
#' | [metric_wrims_species] (`wrims-species`) | open-data | yes | high | Species and records flagged in WRiMS (e.g |
#' | [metric_hotspot_overlap] (`hotspot-overlap`) | open-data, speciesgrids | yes | high | Cells in the top decile of richness and of threatened-species richness, and whether both coincide |
#'
#' @section Information metrics:
#'
#' | Metric | Products | By cell | Bias | What it gives |
#' |---|---|---|---|---|
#' | [metric_publication_information] (`publication-information`) | open-data | yes | moderate | For each publication year, the number of unique (cell, observation year, taxon) combinations among the records published that year |
#' | [metric_year_information] (`year-information`) | open-data | yes | moderate | For each observation year, the number of unique (cell, taxon) combinations, regardless of when records were published |
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
NULL

#' Taxonomic richness (`richness`)
#'
#' Number of distinct taxa at species, genus, family, order, class and phylum level, plus the number of records.
#'
#' @name metric_richness
#' @aliases metric_richness
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "richness")` or `run_query(query, "richness-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#' On speciesgrids `n_records` counts only records identified to species (OBIS and GBIF).
#'
#' @section Value:
#' Global template: `n_species`, `n_genus`, `n_family`, `n_order`, `n_class`, `n_phylum`, `n_records`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Observed richness grows with the number of records and with sampling effort, so cells that are better sampled look richer. Compare cells only together with `cell-sampling` or `richness-estimators`.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("richness")
#' }
NULL

#' Diversity indices (`diversity-indices`)
#'
#' Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using the number of records of each species as its abundance.
#'
#' @name metric_diversity_indices
#' @aliases metric_diversity_indices
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "diversity-indices")` or `run_query(query, "diversity-indices-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `n_species`, `n_records`, `shannon`, `simpson`, `pielou`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Records are not individuals, and the indices depend on sample size and on a few heavily sampled species or datasets. Pielou is `NA` for cells with a single species.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("diversity-indices")
#' }
NULL

#' Richness estimators and sampling completeness (`richness-estimators`)
#'
#' Bias-corrected Chao1 estimate of richness, sampling completeness (observed richness / Chao1) and records per species. `f1` and `f2` are the number of species with exactly one and two records.
#'
#' @name metric_richness_estimators
#' @aliases metric_richness_estimators
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "richness-estimators")` or `run_query(query, "richness-estimators-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#' ACE is not implemented.
#'
#' @section Value:
#' Global template: `n_species`, `n_records`, `f1`, `f2`, `chao1`, `completeness`, `records_per_species`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **Moderate.** Designed to account for undetected species, but it uses records as abundance and is only a lower bound; it is unreliable where there are very few records or where sampling is strongly clustered. Use `completeness` as a flag, not as truth.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("richness-estimators")
#' }
NULL

#' Rarity by number of records (`rarity-records`)
#'
#' Share of species with 1 to 5 records.
#'
#' @name metric_rarity_records
#' @aliases metric_rarity_records
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "rarity-records")` or `run_query(query, "rarity-records-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `n_species`, `n_singletons`, `n_rare_species`, `pct_rare_species`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** A species with few records is often just under-sampled, not rare. The share of rare species is mostly a function of effort.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The threshold of 5 records (and the singleton count) is fixed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("rarity-records")
#' }
NULL

#' Species occupancy of cells (`species-cell-occupancy`)
#'
#' For each species, the number of cells in which it occurs and the share of all cells with records.
#'
#' @name metric_species_cell_occupancy
#' @aliases metric_species_cell_occupancy
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "species-cell-occupancy")`.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `species`, `n_cells`, `pct_cells`, `n_records`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Occupancy is bounded by where sampling happened; a species can look restricted only because the surrounding cells were never sampled.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The grid resolution changes the result strongly (coarser cells give higher occupancy).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("species-cell-occupancy")
#' }
NULL

#' Taxonomic resolution (`taxon-level`)
#'
#' Level (Species, Genus, Family, Order, Class, Phylum, Kingdom or Other) to which each distinct taxon in the data is resolved, with counts and percentages.
#'
#' @name metric_taxon_level
#' @aliases metric_taxon_level
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "taxon-level")` or `run_query(query, "taxon-level-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#' Not available for speciesgrids: it only holds records identified to species.
#'
#' @section Value:
#' Global template: `higher_level`, `total`, `total_perc`.
#'
#' By cell: The same columns, one row per `cell` and level.
#'
#' @section Sensitivity to sampling bias:
#' **Low.** Reflects the quality of identification rather than biodiversity, but varies with the datasets in the area (e.g. DNA or imaging data).
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("taxon-level")
#' }
NULL

#' Sampling of cells (`cell-sampling`)
#'
#' Number of cells with fewer than 10, 100 and 1000 records for the whole area; by cell, the records and species of each cell.
#'
#' @name metric_cell_sampling
#' @aliases metric_cell_sampling
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "cell-sampling")` or `run_query(query, "cell-sampling-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `n_cells`, `n_cells_lt_10`, `n_cells_lt_100`, `n_cells_lt_1000`, the matching `pct_cells_lt_*`, and `median_records_per_cell`.
#'
#' By cell: `cell`, `n_records`, `n_species`.
#'
#' @section Sensitivity to sampling bias:
#' **Diagnostic.** Describes the spatial bias in sampling effort, so it is the reference for reading the metrics marked high.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The thresholds 10, 100 and 1000 are fixed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("cell-sampling")
#' }
NULL

#' Temporal coverage of cells (`temporal-gaps`)
#'
#' How many years each cell was sampled and the longest run of consecutive sampled years.
#'
#' @name metric_temporal_gaps
#' @aliases metric_temporal_gaps
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "temporal-gaps")` or `run_query(query, "temporal-gaps-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#' Not available for speciesgrids, which only stores the first and last year.
#'
#' @section Value:
#' Global template: `n_cells`, `n_cells_1_year`, `n_cells_ge_5_years`, `n_cells_ge_10_years`, `n_cells_gt_10_years` (overlapping classes), `largest_sequence` and `cell_largest_sequence`.
#'
#' By cell: `cell`, `n_years`, `first_year`, `last_year`, `longest_run`.
#'
#' @section Sensitivity to sampling bias:
#' **Diagnostic.** Describes the temporal bias in sampling. Many cells with a single year mean that trends per cell are not reliable.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The classes 1, 5, 10 years are fixed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("temporal-gaps")
#' }
NULL

#' Records by year (`records-by-year`)
#'
#' Number of records (identified to species) per observation year.
#'
#' @name metric_records_by_year
#' @aliases metric_records_by_year
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "records-by-year")` or `run_query(query, "records-by-year-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `date_year`, `total`.
#'
#' By cell: The same columns, one row per `cell` and year.
#'
#' @section Sensitivity to sampling bias:
#' **Moderate.** Reflects effort, project funding and publication practices; it is not a trend in abundance.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' `set_period()` limits the years.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("records-by-year")
#' }
NULL

#' Records by month (`records-by-month`)
#'
#' Number of records (identified to species) per month of the year, with the quarter.
#'
#' @name metric_records_by_month
#' @aliases metric_records_by_month
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "records-by-month")` or `run_query(query, "records-by-month-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `month`, `total`, `quarter`.
#'
#' By cell: The same columns, one row per `cell` and month.
#'
#' @section Sensitivity to sampling bias:
#' **Moderate.** Seasonality in the records mostly reflects seasonality of sampling (e.g. summer cruises), not of the organisms.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("records-by-month")
#' }
NULL

#' Depth information coverage (`depth-coverage`)
#'
#' Whether records have both minimum and maximum depth, only one, or none.
#'
#' @name metric_depth_coverage
#' @aliases metric_depth_coverage
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "depth-coverage")` or `run_query(query, "depth-coverage-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `depth_coverage`, `total`, `total_perc`.
#'
#' By cell: The same columns, one row per `cell` and class.
#'
#' @section Sensitivity to sampling bias:
#' **Diagnostic.** Tells how much of the data can be used in depth-based analysis.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("depth-coverage")
#' }
NULL

#' Richness and records by depth band (`depth-bands`)
#'
#' Number of species and records in each depth band. The band uses the minimum depth, or the maximum depth when the minimum is missing; records without depth are `Unknown`.
#'
#' @name metric_depth_bands
#' @aliases metric_depth_bands
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "depth-bands")` or `run_query(query, "depth-bands-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `depth_band`, `n_species`, `n_records`.
#'
#' By cell: The same columns, one row per `cell` and band.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Sampling is concentrated in shallow waters, so records and richness per band mostly reflect effort at each depth.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' `set_depth_bands()` sets the band limits (default 0-20, 20-200, 200-1000, 1000+ m). It is different from `set_depth()`, which filters records.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("depth-bands")
#' }
NULL

#' Coordinate uncertainty (`coordinate-uncertainty`)
#'
#' Distribution of the coordinate uncertainty (meters) and the share of records without it.
#'
#' @name metric_coordinate_uncertainty
#' @aliases metric_coordinate_uncertainty
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "coordinate-uncertainty")` or `run_query(query, "coordinate-uncertainty-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `n_records`, `n_with_uncertainty`, `pct_missing`, `min_uncertainty`, `median_uncertainty`, `p90_uncertainty`, `max_uncertainty`, and counts per class (<= 100 m, 100 m-1 km, 1-10 km, > 10 km).
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **Diagnostic.** Shows whether the spatial resolution you chose is supported by the data: records with an uncertainty larger than the cell can fall in the wrong cell.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The size classes are fixed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("coordinate-uncertainty")
#' }
NULL

#' Extension coverage (`extension-coverage`)
#'
#' Records and datasets with an extendedMeasurementOrFact or DNA derived data extension.
#'
#' @name metric_extension_coverage
#' @aliases metric_extension_coverage
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "extension-coverage")` or `run_query(query, "extension-coverage-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#'
#' @section Value:
#' Global template: `n_records`, `n_records_emof`, `n_records_dna`, `pct_records_emof`, `pct_records_dna`, `n_datasets_emof`, `n_datasets_dna`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **Diagnostic.** Measures how much extra data is available; it depends on which datasets happen to be in the area.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("extension-coverage")
#' }
NULL

#' Cumulative species by year (`cumulative-species`)
#'
#' Species first recorded each year and their cumulative number. Variants `cumulative-species-kingdom`, `-phylum` and `-class` do the same inside each group.
#'
#' @name metric_cumulative_species
#' @aliases metric_cumulative_species
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "cumulative-species")` or `run_query(query, "cumulative-species-bycell")` for one row per cell.
#' The variants `cumulative-species-kingdom`, `cumulative-species-phylum` and `cumulative-species-class` (and their `-bycell` versions) split the curve by group.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#' On speciesgrids the year is the earliest `min_year` of the species, and species without a year are dropped.
#'
#' @section Value:
#' Global template: `first_year`, `new_species`, `cumulative_species` (plus `kingdom`, `phylum` or `class` in the variants).
#'
#' By cell: The same columns, one row per `cell` (and group) and year.
#'
#' @section Sensitivity to sampling bias:
#' **High.** The curve follows the history of sampling effort; steps are caused by individual surveys or datasets. It is sparse: years without new species are not included.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The kingdom variant keeps only the kingdoms listed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("cumulative-species")
#' }
NULL

#' Discovery rate (`discovery-rate`)
#'
#' New species per year and per 1000 records, to see whether the species list is saturating.
#'
#' @name metric_discovery_rate
#' @aliases metric_discovery_rate
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "discovery-rate")` or `run_query(query, "discovery-rate-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#' On speciesgrids only `year`, `new_species` and `cumulative_species` exist, since records cannot be split by year.
#'
#' @section Value:
#' Global template: `year`, `new_species`, `cumulative_species`, `n_records`, `cumulative_records`, `new_species_per_1000_records`.
#'
#' By cell: The same columns, one row per `cell` and year.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Saturation can reflect a limit to effort, not completeness; and changes in effort between years are not corrected.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("discovery-rate")
#' }
NULL

#' Last year each species was seen (`last-seen`)
#'
#' First and last year each species was recorded, and the number of records. Filter on `last_year` to flag species not recorded recently.
#'
#' @name metric_last_seen
#' @aliases metric_last_seen
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "last-seen")` or `run_query(query, "last-seen-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `species`, `first_year`, `last_year`, `n_records`.
#'
#' By cell: The same columns, one row per `cell` and species (this can be very large).
#'
#' @section Sensitivity to sampling bias:
#' **High.** A species 'not seen recently' may simply not have been sampled again, or its recent data may not be published yet.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("last-seen")
#' }
NULL

#' Threatened species (`threatened-species`)
#'
#' Number of threatened species (Red List categories CR, EN and VU), per category, and their records.
#'
#' @name metric_threatened_species
#' @aliases metric_threatened_species
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "threatened-species")` or `run_query(query, "threatened-species-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#' On speciesgrids `category` is only filled for threatened or extinct species.
#'
#' @section Value:
#' Global template: `n_threatened_species`, `n_cr_species`, `n_en_species`, `n_vu_species`, `n_species`, `n_records_threatened`, `n_records`.
#'
#' By cell: The same columns, one row per `cell`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Follows richness and sampling effort, and the Red List is itself taxonomically biased: many marine groups are not assessed.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The categories are fixed in the template.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("threatened-species")
#' }
NULL

#' WRiMS-flagged species over time (`wrims-species`)
#'
#' Species and records flagged in WRiMS (e.g. introduced or invasive), per year.
#'
#' @name metric_wrims_species
#' @aliases metric_wrims_species
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "wrims-species")` or `run_query(query, "wrims-species-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#' Not available for speciesgrids.
#'
#' @section Value:
#' Global template: `year`, `n_species_wrims`, `n_records_wrims`, `n_species`, `n_records`.
#'
#' By cell: The same columns, one row per `cell` and year.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Detections depend on monitoring effort (ports, targeted surveys) and on how well WRiMS covers each region.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' `set_period()` limits the years.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("wrims-species")
#' }
NULL

#' Hotspot overlap (`hotspot-overlap`)
#'
#' Cells in the top decile of richness and of threatened-species richness, and whether both coincide.
#'
#' @name metric_hotspot_overlap
#' @aliases metric_hotspot_overlap
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "hotspot-overlap")` or `run_query(query, "hotspot-overlap-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data` and `speciesgrids`.
#'
#' @section Value:
#' Global template: `n_cells`, `n_richness_hotspots`, `n_threatened_hotspots`, `n_overlap`, `pct_threatened_hotspots_in_richness_hotspots`.
#'
#' By cell: `cell`, `n_species`, `n_threatened_species`, `richness_hotspot`, `threatened_hotspot`, `overlap`.
#'
#' @section Sensitivity to sampling bias:
#' **High.** Hotspots built on observed richness mirror where sampling is most intense, and the two layers share this bias, so overlap is partly expected.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' The top decile (90th percentile) is fixed in the template. A cell is a threatened-species hotspot only if it has at least one threatened species.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("hotspot-overlap")
#' }
NULL

#' Publication information metric (PI) (`publication-information`)
#'
#' For each publication year, the number of unique (cell, observation year, taxon) combinations among the records published that year.
#'
#' @name metric_publication_information
#' @aliases metric_publication_information
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "publication-information")` or `run_query(query, "publication-information-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#' The publication year is `created`, falling back to `published`. Not available for speciesgrids.
#'
#' @section Value:
#' Global template: `year`, `i_p`, `n_cells`, `cv` (spatial evenness: coefficient of variation of the combinations per cell).
#'
#' By cell: `year`, `cell`, `i_p`.
#'
#' @section Sensitivity to sampling bias:
#' **Moderate.** Counts unique combinations instead of records, so it is less driven by record numbers, but it still depends on how much was sampled and published.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' `set_taxonomic_level()` sets the taxon (default phylum).
#'
#' Needs a `dataset_info` table (`id`, `created`, `published`) in the connection.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("publication-information")
#' }
NULL

#' Year information metric (YI) (`year-information`)
#'
#' For each observation year, the number of unique (cell, taxon) combinations, regardless of when records were published.
#'
#' @name metric_year_information
#' @aliases metric_year_information
#' @family sql metrics
#'
#' @section Templates:
#' Run with `run_query(query, "year-information")` or `run_query(query, "year-information-bycell")` for one row per cell.
#'
#' @section Data products:
#' Available for `open-data`.
#' Not available for speciesgrids.
#'
#' @section Value:
#' Global template: `year`, `i_p`, `n_cells`, `cv` (spatial evenness).
#'
#' By cell: `year`, `cell`, `i_p`.
#'
#' @section Sensitivity to sampling bias:
#' **Moderate.** As for PI: less driven by record numbers, but still dependent on sampling effort per year.
#'
#' @section Parameters:
#' The query can be restricted or resized with `set_area()`, `set_period()`, `set_depth()` and `set_filters()` (restrict the records) and `set_grid()` (cell size).
#'
#' `set_taxonomic_level()` sets the taxon (default phylum).
#'
#' `set_period()` limits the observation years.
#'
#' @seealso [run_query()], [print_sql()], [set_area()], [set_grid()]
#'
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   run_query("year-information")
#' }
NULL
