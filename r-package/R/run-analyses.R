# Analyses that run with only an area (no grid or extra table needed), in the order run_analyses() runs them
.default_analyses <- c(
    "basic_stats", "records_by_year", "records_by_month", "cumulative_species",
    "taxon_level", "depth_coverage", "datasets_by_extension", "species_list"
)

# All the analyses that run_analyses() can run
.available_analyses <- c(
    .default_analyses, "depth_bands", "published_by_year", "records_by_cell",
    "cell_histogram", "cell_evenness", "publication_information", "year_information"
)

#' Run several analyses
#'
#' Runs a set of analyses with their default arguments. The query is
#' pre-computed first (see [pre_compute()]), so the full dataset is scanned only
#' once. To change the arguments of an analysis (e.g. `by_cell`), call its
#' function directly.
#'
#' @param query an `abra_query` object (see [set_area()] and the other `set_*()`
#'   functions).
#' @param analyses names of the analyses to run: `basic_stats`, `records_by_year`,
#'   `records_by_month`, `cumulative_species`, `taxon_level`, `depth_coverage`,
#'   `datasets_by_extension`, `species_list`, `depth_bands`, `published_by_year`,
#'   `records_by_cell`, `cell_histogram`, `cell_evenness`,
#'   `publication_information` and `year_information`. By default, the first
#'   eight, which need no grid or extra table. The others need a grid
#'   ([set_grid()]) or the `dataset_info` table ([add_dataset_info()]).
#' @param pre_compute logical. Pre-compute the query first, if it was not yet?
#' @param verbose logical. Print the SQL of each analysis?
#' @return an `abra_query_result_list`: a named list with the result of each
#'   analysis.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' results <- con |>
#'   set_area(area) |>
#'   set_period("2000-01-01", "2020-12-31") |>
#'   run_analyses(c("basic_stats", "records_by_year"))
#'
#' results$basic_stats
#' }
run_analyses <- function(query, analyses = .default_analyses, pre_compute = TRUE, verbose = FALSE) {
    query <- .as_query(query)
    unknown <- setdiff(analyses, .available_analyses)
    if (length(unknown) > 0) {
        available <- .available_analyses
        .em("Unknown analyses: {.val {unknown}}. Available: {.val {available}}")
    }

    if (pre_compute && !is.list(attr(query, "abra_query")$details$precomputed)) {
        query <- pre_compute(query)
    }

    results <- lapply(analyses, \(a) {
        cli::cli_alert_info("Running {.fn {a}}")
        get(a, mode = "function")(query, verbose = verbose)
    })
    names(results) <- analyses
    class(results) <- c("abra_query_result_list", class(results))
    results
}
