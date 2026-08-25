#' Set the area of interest for a query
#'
#' Accepts a geometry in several common R spatial formats and stores it as
#' WKT (Well-Known Text) on the query. Multi-feature `sf`/`SpatVector`
#' objects are unioned/aggregated into a single geometry first.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param geom the area of interest, as one of: an `sf` object, a `terra`
#'   `SpatVector`, or a single WKT string. If `NULL` (the default), no area
#'   is set and the analysis runs globally.
#' @return an `abra_query` object, with the area definer set.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con <- robisdb::connect_opendata_local("path/to/parquet")
#' con |> set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))")
#' }
set_area <- function(.obj, geom = NULL) {
    .obj <- .make_if_not(.obj)
    if (is.null(geom)) {
        .wm("geom is NULL, and no area was set. Analysis will be global")
    } else {
        if (inherits(geom, "sf")) {
            geom <- sf::st_geometry(geom)
            if (length(geom) > 1) geom <- sf::st_union(geom)
            geom <- sf::st_as_text(geom)
        } else if (inherits(geom, "SpatVector")) {
            if (length(geom) > 1) geom <- terra::aggregate(geom)
            geom <- terra::geom(geom, wkt = TRUE)
        } else if (is.character(geom)) {
            valid_wkt <- tryCatch({
                sf::st_as_sfc(geom)
                TRUE
            }, error = function(e) FALSE)
            if (!valid_wkt) {
                cli::cli_abort("{.arg geom} is a character but is not a valid WKT string")
            }
        } else {
            cli::cli_abort("geometry should be one of sf, SpatVector or WKT (text)")
        }

        .obj <- .obj |>
            .change_abra_obj(definers = list(area = geom))
    }

    return(.obj)
}

#' Set the date range of interest for a query
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param date_start the earliest date to include (a `Date` or a string
#'   coercible to one), or `NULL` to leave the start of the range open.
#' @param date_end the latest date to include, or `NULL` to leave the end of
#'   the range open.
#' @return an `abra_query` object, with the period definer set. If both
#'   `date_start` and `date_end` are `NULL`, `.obj` is returned unchanged
#'   (with a warning).
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_period(date_start = "2000-01-01", date_end = "2020-12-31")
#' }
set_period <- function(.obj, date_start = NULL, date_end = NULL) {
    .obj <- .make_if_not(.obj)
    if (is.null(date_start) & is.null(date_end)) {
        .wm("Both `date_start` and `date_end` are NULL. Ignoring period set")
    } else {
        .obj <- .obj |>
            .change_abra_obj(definers = list(
                period = list(
                    date_start = date_start,
                    date_end = date_end
                )
            ))
    }

    return(.obj)
}

#' Set the depth range of interest for a query
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param startdepth the minimum depth below the sea surface, in meters, or
#'   `NULL` to leave it open.
#' @param enddepth the maximum depth below the sea surface, in meters, or
#'   `NULL` to leave it open.
#' @return an `abra_query` object, with the depth definer set. If both
#'   `startdepth` and `enddepth` are `NULL`, `.obj` is returned unchanged
#'   (with a warning).
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_depth(startdepth = 0, enddepth = 200)
#' }
set_depth <- function(.obj, startdepth = NULL, enddepth = NULL) {
    .obj <- .make_if_not(.obj)
    if (is.null(startdepth) & is.null(enddepth)) {
        .wm("Both `startdepth` and `enddepth` are NULL. Ignoring depth set")
    } else {
        .obj <- .obj |>
            .change_abra_obj(definers = list(
                depth = list(
                    startdepth = startdepth,
                    enddepth = enddepth
                )
            ))
    }

    return(.obj)
}

#' Set taxonomic/dataset filters for a query
#'
#' Not every filter is available for every data product (e.g. `instituteid`
#' has no equivalent column in the open-data parquet dataset): unsupported
#' filters are ignored with a warning at [run_query()] time, not here.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param scientificname the scientific name to filter on, or `NULL`.
#' @param taxonid the taxon identifier (WoRMS AphiaID) to filter on, or
#'   `NULL`.
#' @param datasetid the OBIS dataset identifier to filter on, or `NULL`.
#' @param nodeid the OBIS node identifier to filter on, or `NULL`.
#' @param instituteid the institute identifier to filter on, or `NULL`.
#' @param flags quality flags which need to be set, or `NULL`.
#' @return an `abra_query` object, with the filters definer set. If every
#'   argument is `NULL`, `.obj` is returned unchanged (with a warning).
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_filters(taxonid = 125515)
#' }
set_filters <- function(
  .obj,
  scientificname = NULL,
  taxonid = NULL,
  datasetid = NULL,
  nodeid = NULL,
  instituteid = NULL,
  flags = NULL
) {
    .obj <- .make_if_not(.obj)
    arg <- c(as.list(environment()))
    if (is.null(unlist(arg))) {
        .wm("No filter was added, ignoring.")
    } else {
        .obj <- .obj |>
            .change_abra_obj(definers = list(
                filters = arg
            ))
    }
    return(.obj)
}

#' Set the aggregation grid for a query
#'
#' Every `abra_query` needs a grid set before it can be run with
#' [run_query()] - this is usually the last `set_*()` call in a chain.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object. A bare `robisdb_conn`
#'   (as returned by `robisdb::connect*()`) is promoted to an `abra_query`
#'   automatically; the `set_*()` functions can otherwise be chained in any
#'   order.
#' @param grid_type the grid system to aggregate into: one of `"h3"`,
#'   `"a5"` or `"geoHash"`. Only `"h3"` is currently implemented end-to-end
#'   in [run_query()].
#' @param resolution the grid resolution, between 1 and 15 (coarser to
#'   finer). Some data products cap the finest resolution available (e.g.
#'   `speciesgrids` is pre-aggregated and cannot be queried finer than its
#'   native resolution).
#' @return an `abra_query` object, with the grid definer set.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_grid(grid_type = "h3", resolution = 5)
#' }
set_grid <- function(.obj, grid_type = "h3", resolution = 3) {
    .obj <- .make_if_not(.obj)

    if (is.null(grid_type) || is.null(resolution)) .em("A grid should be added, with a valid resolution.")
    if (is.na(grid_type) || is.na(resolution)) .em("A grid should be added, with a valid resolution.")

    resolution <- as.integer(resolution)

    if (grid_type == "h3") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else if (grid_type == "a5") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else if (grid_type == "geoHash") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else {
        cli::cli_abort("grid_type not recognized")
    }

    .obj <- .obj |>
            .change_abra_obj(definers = list(
                grid = grid_type,
                resolution = resolution
            ))

    return(.obj)
}

# .update_class <- function(.obj, new_class) {
#     if (!new_class %in% class(.obj)) {
#         class(.obj) <- c(new_class, .obj)
#     }
#     return(.obj)
# }

# z <- data.frame(a = 1)
# x <- structure(z, class = c("newClass", class(z)))
# str(x)
# class(x)

# sloop::s3_dispatch(print(x))
