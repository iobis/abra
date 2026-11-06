# Taxon column of the information metrics: the rank set with set_taxonomic_level(), phylum by default
.information_rank <- function(query) {
    rank <- attr(query, "abra_query")$definers$taxonomic_level
    if (identical(rank, NA)) "phylum" else rank
}

# Summary of the distinct combinations of a metric, in a CTE named `combos` with columns
# year and cell: per cell, or aggregated over cells with the spatial evenness (cv)
.information_summary_sql <- function(by_cell) {
    if (by_cell) {
        "select year, cell, count(*) as i_p
        from combos
        group by year, cell
        order by year, cell"
    } else {
        "per_cell as (
            select year, cell, count(*) as n
            from combos
            group by year, cell
        )
        select
            year,
            sum(n)::bigint as i_p,
            count(*) as n_cells,
            stddev_samp(n) / avg(n) as cv
        from per_cell
        group by year
        order by year"
    }
}

#' Publication information metric
#'
#' For each publication year, the number of unique combinations of grid cell,
#' observation year and taxon among the records published in that year (the
#' publication information metric, PI). Because it counts unique combinations
#' and not records, it measures how much new information about the area was
#' made available each year.
#'
#' The taxon is a phylum unless set with [set_taxonomic_level()]. The
#' publication year of a dataset is its `created` date, falling back to
#' `published`; datasets without any are ignored. Needs the `dataset_info` table
#' (see [add_dataset_info()]) and a grid (see [set_grid()]).
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `year` (publication year), `i_p`, and, if
#'   `by_cell` is `FALSE`, `n_cells` and `cv` (spatial evenness: the coefficient of
#'   variation of the combinations per cell). If `by_cell` is `TRUE`, one row per
#'   `year` and `cell`, with `i_p`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_grid("h3", 4) |>
#'   add_dataset_info() |>
#'   publication_information()
#' }
publication_information <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    .check_dataset_info(query)
    g <- .group_spec(query, "cell")
    rank <- .information_rank(query)

    sql <- glue::glue("
        with obis_cells as (
            select distinct
                {g$sel}
                dataset_id,
                interpreted.date_year as obs_year,
                interpreted.\"{rank}\" as taxon
            from {s$table}
            where {s$where} {g$where}
                and interpreted.date_year is not null
                and interpreted.\"{rank}\" is not null
        ),
        dataset_year as (
            {.dataset_year_sql()}
        ),
        combos as (
            select distinct pub_year as year, cell, obs_year, taxon
            from obis_cells
            join dataset_year using (dataset_id)
            where pub_year is not null
        )
        {if (by_cell) '' else ','}
        {.information_summary_sql(by_cell)}
    ")
    .run_analysis(query, "publication_information", sql, verbose)
}

#' Year information metric
#'
#' For each observation year, the number of unique combinations of grid cell
#' and taxon among the records observed in that year, regardless of when they
#' were published (the year information metric, YI).
#'
#' The taxon is a phylum unless set with [set_taxonomic_level()]. Use
#' [set_period()] to restrict the observation years. Needs a grid (see
#' [set_grid()]).
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `year` (observation year), `i_p`, and, if
#'   `by_cell` is `FALSE`, `n_cells` and `cv` (spatial evenness: the coefficient of
#'   variation of the combinations per cell). If `by_cell` is `TRUE`, one row per
#'   `year` and `cell`, with `i_p`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_period("2000-01-01", "2020-12-31") |>
#'   set_grid("h3", 4) |>
#'   year_information()
#' }
year_information <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, "cell")
    rank <- .information_rank(query)

    sql <- glue::glue("
        with combos as (
            select distinct
                {g$sel}
                interpreted.date_year as year,
                interpreted.\"{rank}\" as taxon
            from {s$table}
            where {s$where} {g$where}
                and interpreted.date_year is not null
                and interpreted.\"{rank}\" is not null
        )
        {if (by_cell) '' else ','}
        {.information_summary_sql(by_cell)}
    ")
    .run_analysis(query, "year_information", sql, verbose)
}
