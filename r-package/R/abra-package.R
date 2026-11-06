#' abra: area based analysis of OBIS records
#'
#' Analyses of the marine records of the OBIS open data inside an area, by
#' period, depth, taxa and grid cell.
#'
#' @section Workflow:
#' 1. Connect to the data with `robisdb::connect_opendata_local()`.
#' 2. Set the options of the query with [set_area()], [set_period()],
#'    [set_depth()], [set_filters()] and [set_grid()] (and
#'    [set_taxonomic_level()], [set_depth_bands()] for some analyses).
#' 3. Optionally, apply the options once with [pre_compute()].
#' 4. Run the analyses, one by one or with [run_analyses()].
#'
#' ```
#' result <- con |>
#'   set_area(area) |>
#'   set_period("2000-01-01", "2020-12-31") |>
#'   set_grid("h3", 4) |>
#'   pre_compute() |>
#'   basic_stats()
#' ```
#'
#' @section Analyses:
#' Records overview: [basic_stats()], [records_by_year()], [records_by_month()],
#' [published_by_year()], [cumulative_species()], [taxon_level()],
#' [depth_coverage()], [depth_bands()], [datasets_by_extension()], [species_list()].
#'
#' Spatial: [records_by_cell()], [cell_histogram()], [cell_evenness()],
#' [cell_to_polygon()].
#'
#' Information metrics: [publication_information()], [year_information()].
#'
#' Most analyses have a `by_cell` argument to get one result per grid cell.
#'
#' @section Sampling bias:
#' Counts of records and species follow where and when people sampled. Read
#' them next to the sampling diagnostics ([cell_histogram()],
#' [cell_evenness()], [records_by_year()], [depth_coverage()]).
#'
#' @keywords internal
"_PACKAGE"
