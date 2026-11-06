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
        if (inherits(geom, c("sf", "sfc"))) {
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

#' Set the depth bands used by `depth_bands()`
#'
#' [depth_bands()] classifies each record into a band of this partition; without
#' this setter it uses the default bands (0-20, 20-200, 200-1000, 1000+ m). The band of a record is based on its
#' minimum depth, or its maximum depth when the minimum is missing; records
#' with no depth are labelled `"Unknown"`. This is independent of
#' [set_depth()], which filters records.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param breaks an increasing numeric vector of band limits in meters. The
#'   last value can be `Inf` for an open-ended deepest band.
#' @return an `abra_query` object, with the depth bands definer set.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_depth_bands(c(0, 50, 200, 1000, Inf))
#' }
set_depth_bands <- function(.obj, breaks = c(0, 20, 200, 1000, Inf)) {
    .obj <- .make_if_not(.obj)

    if (!is.numeric(breaks) || length(breaks) < 2 || anyNA(breaks) || is.unsorted(breaks, strictly = TRUE)) {
        .em("{.arg breaks} should be a strictly increasing numeric vector with at least two values")
    }

    .obj |>
        .change_abra_obj(definers = list(depth_bands = breaks))
}

#' Set taxonomic/dataset filters for a query
#'
#' Restricts the records to given taxa, datasets, nodes or quality flags.
#' Taxa can be given at any rank with the rank arguments (`phylum`, `class`,
#' ...), which are matched against the corresponding column of the data
#' (e.g. `class = "Anthozoa"` only matches records with `class` equal to
#' Anthozoa). Several taxon arguments can be combined, and the result is the
#' *union* of the taxa (`order = "Scleractinia", family = "Posidoniaceae"`
#' keeps both groups). Dataset, node and flag filters are combined with the
#' taxa using *and*.
#'
#' Not every filter is available for every data product (e.g. `instituteid`
#' has no equivalent column in the open-data parquet dataset): unsupported
#' filters are ignored with a warning when an analysis runs, not here.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param kingdom,phylum,class,order,family,genus,species character vectors
#'   of taxon names, matched at that rank, or `NULL`.
#' @param scientificname scientific names matched at *any* rank, or `NULL`.
#'   Prefer the rank arguments: a name that exists at several ranks, or a
#'   higher taxon not stored as a column, is easier to get wrong here.
#' @param taxonid the taxon identifier (WoRMS AphiaID) to filter on, or
#'   `NULL`. Only records identified exactly to this taxon are matched, not
#'   its descendants.
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
#' con |> set_filters(order = c("Scleractinia", "Alcyonacea"))
#' con |> set_filters(class = "Actinopterygii", flags = "NO_DEPTH")
#' }
set_filters <- function(
  .obj,
  kingdom = NULL,
  phylum = NULL,
  class = NULL,
  order = NULL,
  family = NULL,
  genus = NULL,
  species = NULL,
  scientificname = NULL,
  taxonid = NULL,
  datasetid = NULL,
  nodeid = NULL,
  instituteid = NULL,
  flags = NULL
) {
    .obj <- .make_if_not(.obj)
    arg <- list(
        kingdom = kingdom, phylum = phylum, class = class, order = order,
        family = family, genus = genus, species = species,
        scientificname = scientificname, taxonid = taxonid, datasetid = datasetid,
        nodeid = nodeid, instituteid = instituteid, flags = flags
    )
    ranks <- arg[c("kingdom", "phylum", "class", "order", "family", "genus", "species")]
    if (!all(vapply(ranks, \(x) is.null(x) || is.character(x), logical(1)))) {
        .em("Taxon names should be given as character vectors")
    }
    if (all(vapply(arg, is.null, logical(1)))) {
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
#' The analyses that work by grid cell (e.g. [records_by_cell()], or any analysis
#' with `by_cell = TRUE`) need a grid.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object. A bare `robisdb_conn`
#'   (as returned by `robisdb::connect*()`) is promoted to an `abra_query`
#'   automatically; the `set_*()` functions can otherwise be chained in any
#'   order.
#' @param grid_type the grid system to aggregate into: one of `"h3"`,
#'   `"a5"` or `"geoHash"`. Only `"h3"` is currently implemented end-to-end
#'   in the analyses.
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

#' Set the taxonomic level used by the information metrics
#'
#' The information metrics ([publication_information()] and
#' [year_information()]) count unique combinations of cell and taxon at this
#' rank; without this setter they use phylum.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object (see [set_grid()]).
#' @param rank one of `"kingdom"`, `"phylum"`, `"class"`, `"order"`,
#'   `"family"`, `"genus"` or `"species"`.
#' @return an `abra_query` object, with the taxonomic level definer set.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> set_taxonomic_level("family")
#' }
set_taxonomic_level <- function(.obj, rank = "phylum") {
    .obj <- .make_if_not(.obj)

    if (length(rank) > 1) .em("You can only set one target rank")
    if (is.null(rank) || length(rank) < 1) .em("You should set at least one rank")
    if (!rank %in% c("kingdom", "phylum", "class", "order", "family", "genus", "species")) {
        .em("Rank is not valid.")
    }

    .obj <- .obj |>
            .change_abra_obj(definers = list(
                taxonomic_level = rank
            ))

    return(.obj)
}

#' Add the dataset metadata table to the connection
#'
#' Downloads the metadata of the OBIS datasets (title, node, publication dates,
#' ...) with [robis::dataset()] and saves it in a table named `dataset_info` in the
#' connection. It is needed by the analyses that use the publication date of the
#' datasets, such as [published_by_year()] and [publication_information()]. Nothing
#' is done if the table already exists.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object.
#' @param dataset_id optional vector of dataset ids to download, passed to
#'   [robis::dataset()]. The default is all datasets.
#' @return `.obj`, invisibly.
#' @family query builders
#' @export
#' @examples
#' \dontrun{
#' con |> add_dataset_info()
#' }
add_dataset_info <- function(.obj, dataset_id = NULL) {
    if (!.is_robisdb_conn(.obj)) .em(".obj should be of an robisdb connection")
    if (!DBI::dbExistsTable(.obj$connection, "dataset_info")) {
        cli::cli_alert_info("Creating table `dataset_info` with dataset metadata from OBIS, this can take some minutes")
        di <- try(robis::dataset(datasetid = dataset_id), silent = TRUE)
        if (inherits(di, "try-error")) .em("OBIS API failed. Try again.")
        cols <- intersect(c(
            "id", "url", "archive", "published", "created", "updated", "core",
            "extent", "intellectualrights", "title", "citation", "node_id", "node_name"
        ), names(di))
        di <- as.data.frame(di)[, cols, drop = FALSE]
        # list columns (e.g. several nodes per dataset) cannot be written as they are
        for (col in cols) {
            if (is.list(di[[col]])) di[[col]] <- vapply(di[[col]], paste, character(1), collapse = "|")
        }
        DBI::dbWriteTable(.obj$connection, "dataset_info", di)
    } else {
        cli::cli_alert_info("Table `dataset_info` already exists.")
    }
    return(invisible(.obj))
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
