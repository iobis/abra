#' Export a query result as a Hyparquet-ready cube, with a manifest sidecar
#'
#' Writes `data` to a Parquet file laid out for efficient client-side range
#' scans (see the `obis-dashboard-template` project): sorted by `dimensions`
#' (then `geo_col`, if set) and written with a small row group size, so a
#' browser-side Parquet reader doing predicate pushdown on `dimensions` only
#' has to read the row groups that actually match a filter, instead of the
#' whole file. Also writes a manifest JSON alongside the Parquet file, with
#' the distinct values of each dimension - nested, since `dimensions` is
#' treated as an ordered hierarchy, outermost first - and per-value measure
#' totals, so a dashboard's filter UI never has to scan the Parquet file
#' just to know what values exist.
#'
#' @details
#' # Dropped rows
#' Rows with `NA` in any `dimensions` column are dropped when
#' `drop_na_dimensions` is `TRUE` (the default): a Hyparquet `$eq: null`
#' filter gets no row-group pruning (Parquet min/max statistics don't cover
#' nulls), so an "unidentified" filter option would silently fall back to
#' scanning the whole file. If you need to keep these rows, set
#' `drop_na_dimensions = FALSE` and handle them specially in your dashboard.
#'
#' # Measure totals are summed, not re-derived
#' The manifest's per-value measure totals (including every
#' `dimension_tree` node) are the **sum** of `data`'s measure columns across
#' the matching rows. This is exact for additive measures (record counts,
#' dataset counts) but only an *upper bound* for distinct-count measures
#' (e.g. an `n_species` column computed as `count(distinct species)` per
#' grid cell): a species observed in more than one grid cell is counted
#' once per cell it appears in when summed across cells. There is no way to
#' recover an exact cross-cell distinct count from already-gridded data; if
#' you need an exact total for a distinct-count measure, compute it
#' separately (e.g. `count(distinct species) group by <dimensions>`, with no
#' grid column) and treat the manifest's summed figure as approximate.
#'
#' @param data a data frame/tibble to export - typically the result of an analysis function, or several combined with `dplyr::bind_rows()` and a label
#'   column (the `type`/`type_value` pattern used for rank breakdowns).
#' @param path output path for the Parquet file.
#' @param dimensions character vector of column names in `data` that a
#'   dashboard will filter/facet by, ordered outermost-first (e.g.
#'   `c("type", "type_value")` for a rank/taxon pair, or `c("year")` for a
#'   simple time series).
#' @param geo_col name of the spatial grid-cell column (e.g. `"cell"` for an
#'   H3 index), or `NULL` if this cube has no spatial component.
#' @param grid a list with `type` and `resolution` describing the grid
#'   `data` is aggregated to (e.g. `list(type = "h3", resolution = 4)`), or
#'   `NULL` to auto-detect from `data`'s `abra_query` attribute (only
#'   possible when `data` is a single, un-mutated analysis result;
#'   required for combined/derived data whenever `geo_col` is not `NULL`).
#' @param chunk_size the Parquet row group size. Smaller values give finer
#'   pruning granularity at the cost of more per-group overhead; the
#'   default is tuned for cubes in the hundreds-of-thousands-to-low-millions
#'   of rows.
#' @param manifest_path output path for the manifest JSON. Defaults to
#'   `path` with its extension replaced by `.json`.
#' @param drop_na_dimensions drop rows with `NA` in any `dimensions` column?
#'   See Details.
#' @return the manifest list, invisibly.
#' @family export
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_grid(grid_type = "h3", resolution = 4) |>
#'   basic_stats(by = "cell") |>
#'   export_cube("cube.parquet", dimensions = "basis_of_record", geo_col = NULL)
#' }
export_cube <- function(
    data,
    path,
    dimensions,
    geo_col = "cell",
    grid = NULL,
    chunk_size = 5000L,
    manifest_path = NULL,
    drop_na_dimensions = TRUE
) {
    if (!is.data.frame(data)) .em("{.arg data} should be a data frame")
    if (length(dimensions) < 1) .em("{.arg dimensions} should have at least one column name")

    missing_dims <- setdiff(dimensions, names(data))
    if (length(missing_dims) > 0) {
        .em("{.arg dimensions} not found in {.arg data}: {.field {missing_dims}}")
    }
    if (!is.null(geo_col) && !geo_col %in% names(data)) {
        .em("{.arg geo_col} ({.field {geo_col}}) not found in {.arg data}")
    }

    if (is.null(grid) && !is.null(geo_col)) {
        definers <- attr(data, "abra_query")$definers
        if (!is.null(definers) && !identical(definers$grid, NA)) {
            grid <- list(type = definers$grid, resolution = definers$resolution)
        } else {
            .em("{.arg grid} could not be auto-detected from {.arg data}; pass {.code grid = list(type=, resolution=)} explicitly")
        }
    }

    if (isTRUE(drop_na_dimensions)) {
        na_mask <- Reduce(`|`, lapply(dimensions, function(d) is.na(data[[d]])))
        n_dropped <- sum(na_mask)
        if (n_dropped > 0) {
            cli::cli_inform(
                "Dropping {n_dropped} row{?s} ({round(100 * n_dropped / nrow(data), 1)}%) with NA in a dimension column"
            )
            data <- data[!na_mask, , drop = FALSE]
        }
    }

    sort_cols <- c(dimensions, geo_col)
    data <- dplyr::arrange(data, dplyr::across(dplyr::all_of(sort_cols)))

    if (is.null(manifest_path)) {
        manifest_path <- sub("\\.[^.]*$", ".json", path)
    }

    arrow::write_parquet(data, path, chunk_size = chunk_size)

    measures <- setdiff(names(data), c(dimensions, geo_col))
    measures <- measures[vapply(data[measures], is.numeric, logical(1))]

    manifest <- list(
        generated_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
        rows = nrow(data),
        bytes = file.size(path),
        row_group_size = chunk_size,
        grid = grid,
        geo_col = geo_col,
        columns = .parquet_column_types(path),
        measures = measures,
        dimension_tree = .build_dimension_tree(data, dimensions, measures)
    )

    jsonlite::write_json(manifest, manifest_path, auto_unbox = TRUE, null = "null")

    return(invisible(manifest))
}

#' Read back a written Parquet file's column names/types
#'
#' Reads the schema off disk (rather than from `data`'s R classes) so the
#' manifest's `columns` field always reflects the actual on-disk Parquet
#' types (e.g. `double`/`int64`), not R's own type names.
#'
#' @param path path to a Parquet file.
#' @return a named list, column name -> Parquet type string.
#' @noRd
.parquet_column_types <- function(path) {
    schema_text <- arrow::ParquetFileReader$create(path)$GetSchema()$ToString()
    lines <- strsplit(schema_text, "\n")[[1]]
    parts <- strsplit(lines, ": ", fixed = TRUE)
    stats::setNames(
        as.list(vapply(parts, `[`, character(1), 2)),
        vapply(parts, `[`, character(1), 1)
    )
}

#' Recursively build a manifest's dimension tree
#'
#' @param data a data frame, already restricted to the rows relevant at
#'   this level of recursion (the full, already-sorted `data` at the top
#'   level).
#' @param dimensions the remaining (not-yet-consumed) dimension columns.
#' @param measures numeric measure column names to sum at each node.
#' @return a list with `column` and `values` (each a list with `value`, one
#'   entry per `measures` column, and `children`), or `NULL` once
#'   `dimensions` is exhausted.
#' @noRd
.build_dimension_tree <- function(data, dimensions, measures) {
    if (length(dimensions) == 0) return(NULL)

    col <- dimensions[1]
    rest <- dimensions[-1]

    split_data <- split(data, data[[col]])

    if (length(measures) > 0) {
        totals <- vapply(split_data, function(d) sum(d[[measures[1]]]), numeric(1))
        split_data <- split_data[order(totals, decreasing = TRUE)]
    }

    values <- lapply(names(split_data), function(v) {
        d <- split_data[[v]]
        entry <- list(value = v)
        for (m in measures) entry[[m]] <- sum(d[[m]])
        entry$children <- .build_dimension_tree(d, rest, measures)
        entry
    })

    list(column = col, values = values)
}
