#' Pre-compute the records of a query into a table
#'
#' Applies the area, period, depth and filters of the query once, and saves the
#' matching records in a table (`obis_computed` by default) of the connection.
#' Only what the analyses use is kept (the dataset, the 15 `interpreted` fields
#' they read, and whether the record has an eMoF or DNA extension), which keeps the
#' table small and fast to build even for large areas.
#'
#' The analysis functions (e.g. [basic_stats()]) run afterwards on the returned
#' object read from this table instead of the full dataset, and ignore the area,
#' period, depth and filters (they were already applied). This is much faster when several
#' analyses are run for the same selection, as the full dataset is only scanned
#' once.
#'
#' The grid, [set_depth_bands()] and [set_taxonomic_level()] are not part of the
#' pre-computation and can still be changed between runs. If the area, period,
#' depth or filters of the returned object are changed afterwards, or the table
#' no longer exists, the analysis functions warn and goes back to the full dataset.
#'
#' @param abra_query an `abra_query` object, with the area, period, depth and
#'   filters to apply (see [set_area()], [set_period()], [set_depth()] and
#'   [set_filters()]).
#' @param table name of the table to create in the connection.
#' @param overwrite logical. Replace the table if it already exists?
#' @return the `abra_query` object, marked as pre-computed.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' statement <- con |>
#'   set_area(area) |>
#'   set_period("2000-01-01", "2020-12-31") |>
#'   set_filters(order = c("Scleractinia", "Alcyonacea")) |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   pre_compute()
#'
#' basic_stats(statement)
#' records_by_year(statement)
#' }
pre_compute <- function(abra_query, table = "obis_computed", overwrite = TRUE) {
    abra_query <- .as_query(abra_query)
    if (!grepl("^[A-Za-z_][A-Za-z0-9_]*$", table)) {
        .em("{.arg table} should be a plain table name (letters, digits and underscores)")
    }
    if (!overwrite && DBI::dbExistsTable(abra_query$connection, table)) {
        .em("Table {.field {table}} already exists; use {.code overwrite = TRUE} to replace it")
    }

    inputs <- .precompute_inputs(abra_query)
    conditions <- .query_conditions(abra_query)

    .install_h3(abra_query)

    cli::cli_alert_info("Pre-computing table {.field {table}}, this scans the full dataset")
    robisdb::send_query(
        abra_query,
        glue::glue("
            create or replace table {table} as
            select
                dataset_id,
                {.slim_interpreted()} as interpreted,
                {.extension_flag(.emof_term)} as has_emof,
                {.extension_flag(.dna_term)} as has_dna
            from obis
            where {conditions}
        ")
    )
    n <- robisdb::get_query(abra_query, glue::glue("select count(*) as n from {table}"))$n
    cli::cli_alert_success("Table {.field {table}} created with {format(n, big.mark = ',')} records")

    # reset first: a list value is merged into the previous one by .change_abra_obj()
    abra_query |>
        .change_abra_obj(details = list(precomputed = NA)) |>
        .change_abra_obj(details = list(precomputed = list(table = table, inputs = inputs)))
}

# The definers applied by pre_compute()
.precompute_inputs <- function(abra_query) {
    attr(abra_query, "abra_query")$definers[c("area", "period", "depth", "filters")]
}

# Name of the pre-computed table to use for `abra_query`, or NULL if the query was not
# pre-computed, was changed since, or the table does not exist (the last two warn).
.active_precomputed <- function(abra_query) {
    pc <- attr(abra_query, "abra_query")$details$precomputed
    if (!is.list(pc)) return(NULL)

    if (!identical(pc$inputs, .precompute_inputs(abra_query))) {
        .wm("The area, period, depth or filters changed after {.fn pre_compute}; ignoring table {.field {pc$table}} and using the full dataset. Run {.fn pre_compute} again to update it.")
        return(NULL)
    }
    if (!DBI::dbExistsTable(abra_query$connection, pc$table)) {
        .wm("Pre-computed table {.field {pc$table}} was not found in the connection; using the full dataset.")
        return(NULL)
    }
    pc$table
}
