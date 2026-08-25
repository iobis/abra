#' Run a SQL template against an `abra_query`
#'
#' Substitutes the `abra_query`'s area/period/depth/filters/grid into the
#' named SQL template's `-- [start cell block]`/`-- [start conditions]`
#' markers and executes it, returning an `abra_query_result` object.
#'
#' Only the `open-data` product is currently supported; `speciesgrids` and
#' `obistherm` connections are rejected.
#'
#' @param abra_query an `abra_query` object with at least a grid set (see
#'   [set_grid()]).
#' @param sql_file the name (without `.sql` extension) of a SQL template in
#'   `sql_folder`.
#' @param sql_folder the folder containing the `.sql` templates. Defaults to
#'   `"sql"` (relative to the working directory).
#' @param verbose logical. Print the resulting SQL before running it?
#' @return an `abra_query_result` object (a data frame with the query's
#'   area/period/depth/filters/grid carried over for provenance).
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
    sql_file,
    sql_folder = NULL,
    verbose = FALSE
) {
    if (!.is_abra_query(abra_query)) {
        .em("{.arg abra_query} should be an `abra_query` object; build one with the `set_*` functions")
    }

    ds_type <- .check_ds_type(abra_query)

    if (ds_type == "obistherm") {
        .em("`obistherm` is not supported by {.fn run_query} yet")
    } else if (ds_type == "speciesgrids") {
        .em("`speciesgrids` is not supported by {.fn run_query} yet")
    } else if (ds_type == "open-data") {
        .run_query_open_data(abra_query, sql_file, sql_folder, verbose)
    } else {
        .em("Connection type not recognized.")
    }
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
    verbose = FALSE
) {
    definers <- attr(abra_query, "abra_query")$definers

    sq <- .build_query_sql(abra_query, sql_file, sql_folder)

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