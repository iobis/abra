#' Run a SQL template against an `abra_query`
#'
#' Substitutes the `abra_query`'s area/period/depth/filters/grid into the
#' named SQL template's `-- [start cell block]`/`-- [start conditions]`
#' markers and executes it, returning an `abra_query_result` object.
#'
#' If the query was pre-computed with [pre_compute()], the templates read the
#' pre-computed table and the area, period, depth and filters are not applied
#' again.
#'
#' The `open-data` and `speciesgrids` products are supported (templates are
#' read from the `open-data`/`speciesgrids` subfolder of `sql_folder`);
#' `obistherm` connections are rejected.
#'
#' @param abra_query an `abra_query` object with at least a grid set (see
#'   [set_grid()]).
#' @param sql_templates vector with the name of one or multiple SQL template(s) in
#'   `sql_folder`. Can be passed with or without ".sql"
#' @param sql_folder the folder containing the `.sql` templates. Defaults to
#'   `"sql"` (relative to the working directory).
#' @param verbose logical. Print the resulting SQL before running it?
#' @return an `abra_query_result` object (a data frame with the query's
#'   area/period/depth/filters/grid carried over for provenance). If multiple
#'   templates are passed, the result will be a list of abra_query_results
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 5) |>
#'   run_query("basic-metrics")
#' }
run_query <- function(
    abra_query,
    sql_templates,
    sql_folder = NULL,
    verbose = FALSE
) {
    if (!.is_abra_query(abra_query)) {
        .em("{.arg abra_query} should be an `abra_query` object; build one with the `set_*` functions")
    }

    if (any(grepl("\\.sql", sql_templates))) sql_templates <- gsub("\\.sql", "", grepl("\\.sql", sql_templates))

    ds_type <- .check_ds_type(abra_query)

    if (ds_type == "obistherm") {
        .em("`obistherm` is not supported by {.fn run_query} yet")
    } else if (ds_type %in% c("open-data", "speciesgrids")) {
        # checked once here (not per template); NULL if not pre-computed (see pre_compute())
        precomputed <- .active_precomputed(abra_query)
        result <- lapply(
            sql_templates,
            \(x) .run_query_open_data(abra_query, x, sql_folder, verbose, precomputed)
        )
    } else {
        .em("Connection type not recognized.")
    }
    if (length(result) > 1) {
        class(result) <- c("abra_query_result_list", class(result))
        names(result) <- tolower(gsub("-", "_", sql_templates))
    } else {
        result <- result[[1]]
    }

    return(result)
}

#' Run a SQL template against an `open-data` connection
#'
#' The `open-data`-specific implementation dispatched to by [run_query()].
#'
#' @inheritParams run_query
#' @return an `abra_query_result` object.
#' @noRd
.run_query_open_data <- function(
    abra_query,
    sql_file,
    sql_folder = NULL,
    verbose = FALSE,
    precomputed = NULL
) {
    definers <- attr(abra_query, "abra_query")$definers

    sq <- .build_query_sql(abra_query, sql_file, sql_folder, precomputed)

    robisdb::install_h3(abra_query)

    if (verbose) message("Executing query")
    if (verbose) cat(paste(paste(sq, collapse = "\n"), "\n\n"))

    result <- abra_query |>
        robisdb::get_query(paste(sq, collapse = "\n"))

    version_line <- sq[grepl("-- version", sq)]
    version <- if (length(version_line) > 0) gsub("-- version: ", "", version_line[1]) else NA

    result <- result |>
        tibble::as_tibble() |>
        .new_abra_query_result() |>
        .change_abra_obj(
            definers = definers,
            details = list(
                query = sql_file,
                version = version
            )
        )

    return(result)
}

#' Convert a gridded query result into `sf` polygons
#'
#' Writes an [run_query()] result back to the database, expands each cell
#' index into its boundary geometry, and returns the result as an `sf`
#' object (wrapped at the antimeridian).
#'
#' @param connection a `robisdb_conn` object to run the boundary expansion
#'   against.
#' @param query_result an `abra_query_result` object, as returned by
#'   [run_query()].
#' @return an `sf` object with one polygon per grid cell.
#' @export
cell_to_polygon <- function(connection, query_result) {

   if (!inherits(query_result, "abra_query")) .em("Object is not of class `abra_query`")

    robisdb::send_query(connection, "drop table if exists result_abra;")
    DBI::dbWriteTable(connection$connection, "result", query_result)

    cell_type <- attr(result, "abra_query")[["cell_type"]]

    if (cell_type == "h3") {
        pols <- get_query(con, "
            from result_abra
            select *, h3_cell_to_boundary_wkt(cell) as geom
        ")
    } else if (cell_type == "a5") {

    } else if (cell_type == "grid") {

    } else {
        stop("Cell type not recognized")
    }

    sf_result <-  sf::st_as_sf(pols, wkt = "geom", crs = 4326)
    sf_result <- sf::st_wrap_dateline(sf_result, options = c("WRAPDATELINE=YES", "DATELINEOFFSET=180"))

    return(sf_result)
}