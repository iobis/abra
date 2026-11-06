#' Records and species by grid cell
#'
#' Number of records and species in each cell of the grid (see [set_grid()]), with
#' the coordinates of the cell center.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `cell`, `n_records`, `n_species`, `x`
#'   (longitude) and `y` (latitude) of the cell center. Use [cell_to_polygon()] to
#'   get the cells as polygons.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_grid("h3", 4) |>
#'   records_by_cell()
#' }
records_by_cell <- function(query, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, "cell")

    sql <- glue::glue("
        select
            {g$sel}
            count(*) as n_records,
            count(distinct interpreted.species) as n_species,
            h3_cell_to_lng(h3_string_to_h3(cell)) as x,
            h3_cell_to_lat(h3_string_to_h3(cell)) as y
        from {s$table}
        where {s$where} {g$where}
        group by cell
        order by cell
    ")
    .run_analysis(query, "records_by_cell", sql, verbose)
}

#' Distribution of the number of records per cell
#'
#' Number of cells in each class of number of records (1, up to 100, up to 1,000,
#' up to 10,000 and more than 10,000), to show how unevenly the area was sampled.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `bin` and `cells`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_grid("h3", 5) |>
#'   cell_histogram()
#' }
cell_histogram <- function(query, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, "cell")

    sql <- glue::glue("
        with cells as (
            select {g$sel} count(*) as total
            from {s$table}
            where {s$where} {g$where}
            group by cell
        )
        select
            case
                when total <= 1 then '1'
                when total <= 100 then '100'
                when total <= 1000 then '1,000'
                when total <= 10000 then '10,000'
                else '>10,000'
            end as bin,
            count(*) as cells
        from cells
        group by bin
        order by case bin
            when '1' then 1 when '100' then 2 when '1,000' then 3
            when '10,000' then 4 else 5 end
    ")
    .run_analysis(query, "cell_histogram", sql, verbose)
}

#' Evenness of the records across cells
#'
#' Relative Shannon entropy (Pielou's evenness) of the number of records per
#' cell: 0 when the records are concentrated in a few cells and 1 when they are
#' spread evenly over all the cells with records.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `n_cells` and `shannon_entropy` (`NA` when
#'   there is a single cell).
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_grid("h3", 5) |>
#'   cell_evenness()
#' }
cell_evenness <- function(query, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, "cell")

    sql <- glue::glue("
        with cells as (
            select {g$sel} count(*) as total
            from {s$table}
            where {s$where} {g$where}
            group by cell
        ),
        with_p as (
            select total / sum(total) over () as p_i from cells
        )
        select
            count(*) as n_cells,
            round(-sum(p_i * ln(p_i)) / nullif(ln(greatest(count(*), 1)), 0), 3) as shannon_entropy
        from with_p
    ")
    .run_analysis(query, "cell_evenness", sql, verbose)
}

#' Convert grid cells into polygons
#'
#' Adds the boundary of each H3 cell of a result as an `sf` geometry, to map
#' it.
#'
#' @param x a data frame, such as the result of an analysis with a `cell`
#'   column (H3 cell indexes as strings).
#' @param query the `abra_query` (or `robisdb` connection) used to compute the
#'   boundaries with the H3 extension of the database.
#' @return an `sf` object, `x` with one polygon (WGS 84) per row.
#' @export
#' @examples
#' \dontrun{
#' cells <- con |>
#'   set_area(area) |>
#'   set_grid("h3", 4) |>
#'   records_by_cell()
#' cell_to_polygon(cells, con)
#' }
cell_to_polygon <- function(x, query) {
    if (!"cell" %in% names(x)) .em("{.arg x} should have a {.field cell} column")
    .install_h3(query)

    tmp <- "abra_cells"
    DBI::dbWriteTable(
        query$connection, tmp, data.frame(cell = unique(x$cell)),
        temporary = TRUE, overwrite = TRUE
    )
    on.exit(DBI::dbRemoveTable(query$connection, tmp, fail_if_missing = FALSE), add = TRUE)

    pols <- robisdb::get_query(query, glue::glue(
        "select cell, h3_cell_to_boundary_wkt(h3_string_to_h3(cell)) as wkt from {tmp}"
    ))
    pols <- sf::st_as_sf(pols, wkt = "wkt", crs = 4326)

    out <- dplyr::left_join(tibble::as_tibble(x), pols, by = "cell")
    sf::st_as_sf(out)
}
