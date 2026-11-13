#' Basic statistics
#'
#' Number of records, species and higher taxa, years covered, number of
#' datasets, and Red List and rarity statistics for the records of the query.
#'
#' The Red List counts are numbers of species per category. A species is
#' counted as single record when it has one record in the group, and as not
#' seen since 1950 when its last record in the whole query (not just in the
#' group) is from 1950 or earlier.
#'
#' @inheritParams analysis_args
#' @param by how to split the result: `NULL` for one row for the whole area,
#'   `"dataset"` for one row per dataset, or `"cell"` for one row per grid cell
#'   (see [set_grid()]).
#' @return an `abra_query_result` (a tibble) with `n_records`, `n_species`,
#'   `n_genus`, `n_family`, `n_order`, `n_class`, `n_phylum`, `n_datasets`,
#'   `min_year`, `max_year`, `n_species_cr`, `n_species_en`, `n_species_vu`,
#'   `n_species_nt`, `n_species_ex`, `n_species_single_record` and
#'   `n_species_not_seen_since_1950`; plus `dataset_id` or `cell` if `by` is set.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   basic_stats()
#' }
basic_stats <- function(query, by = NULL, verbose = FALSE) {
    if (!is.null(by) && !by %in% c("dataset", "cell")) .em("{.arg by} should be NULL, {.val dataset} or {.val cell}")
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, by)
    join <- if (is.null(by)) "cross join redlist_stats r" else glue::glue("left join redlist_stats r using ({g$col})")
    plain_col <- if (is.null(by)) "" else paste0(g$col, ",")

    sql <- glue::glue("
        with species_stats as (
            select
                {g$sel}
                interpreted.species as species,
                max(interpreted.redlist_category) as redlist_category,
                count(*) as n_records,
                max(interpreted.date_year) as last_year
            from {s$table}
            where {s$where} {g$where} and interpreted.species is not null
            group by {g$grp} interpreted.species
        ),
        species_global as (
            select *, max(last_year) over (partition by species) as global_last_year
            from species_stats
        ),
        redlist_stats as (
            select
                {gsub('^(.*),$', '\\\\1', g$grp)}{if (is.null(by)) '' else ','}
                count(*) filter (where redlist_category = 'CR') as n_species_cr,
                count(*) filter (where redlist_category = 'EN') as n_species_en,
                count(*) filter (where redlist_category = 'VU') as n_species_vu,
                count(*) filter (where redlist_category = 'NT') as n_species_nt,
                count(*) filter (where redlist_category = 'EX') as n_species_ex,
                count(*) filter (where n_records = 1) as n_species_single_record,
                count(*) filter (where global_last_year <= 1950) as n_species_not_seen_since_1950
            from species_global
            {if (is.null(by)) '' else paste('group by', g$col)}
        ),
        basic as (
            select
                {g$sel}
                count(*) as n_records,
                count(distinct interpreted.species) as n_species,
                count(distinct interpreted.genus) as n_genus,
                count(distinct interpreted.family) as n_family,
                count(distinct interpreted.\"order\") as n_order,
                count(distinct interpreted.class) as n_class,
                count(distinct interpreted.phylum) as n_phylum,
                count(distinct dataset_id) as n_datasets,
                min(interpreted.date_year) as min_year,
                max(interpreted.date_year) as max_year
            from {s$table}
            where {s$where} {g$where}
            {if (is.null(by)) '' else paste('group by', g$col)}
        )
        select b.*, r.* {if (is.null(by)) '' else paste('exclude (', g$col, ')')}
        from basic b
        {join}
        {if (is.null(by)) '' else paste('order by', g$col)}
    ")
    .run_analysis(query, "basic_stats", sql, verbose)
}

#' Records by year
#'
#' Number of records per observation year.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `date_year`, `n_records` and
#'   `n_records_species` (records identified to species), plus `cell` if
#'   `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   records_by_year()
#' }
records_by_year <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))

    sql <- glue::glue("
        select
            {g$sel}
            interpreted.date_year as date_year,
            count(*) as n_records,
            count(interpreted.species) as n_records_species
        from {s$table}
        where {s$where} {g$where} and interpreted.date_year is not null
        group by {g$grp} interpreted.date_year
        order by {g$ord} date_year
    ")
    .run_analysis(query, "records_by_year", sql, verbose)
}

#' Records by month
#'
#' Number of records per month of the year (all years together), to show
#' seasonality of the sampling.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `month`, `quarter`, `n_records` and
#'   `n_records_species`, plus `cell` if `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   records_by_month()
#' }
records_by_month <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))

    sql <- glue::glue("
        with monthly as (
            select
                {g$sel}
                extract(month from to_timestamp(interpreted.date_mid / 1000))::int as month,
                count(*) as n_records,
                count(interpreted.species) as n_records_species
            from {s$table}
            where {s$where} {g$where} and interpreted.date_mid is not null
            group by {g$grp} month
        )
        select
            {g$ord}
            month,
            extract(quarter from make_date(2000, month, 1)) as quarter,
            n_records,
            n_records_species
        from monthly
        order by {g$ord} month
    ")
    .run_analysis(query, "records_by_month", sql, verbose)
}

#' Datasets and records by publication year
#'
#' For each year in which a dataset with records in the query was published, the
#' number of datasets and of their records (inside the query), and the
#' cumulative totals. The publication year is the `created` date of the
#' dataset, falling back to `published`.
#'
#' Needs the `dataset_info` table, see [add_dataset_info()].
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `year`, `n_datasets`, `n_records`,
#'   `cumulative_datasets` and `cumulative_records`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   add_dataset_info() |>
#'   published_by_year()
#' }
published_by_year <- function(query, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    .check_dataset_info(query)

    sql <- glue::glue("
        with datasets as (
            select dataset_id, count(*) as n_records
            from {s$table}
            where {s$where}
            group by dataset_id
        ),
        dataset_year as (
            {.dataset_year_sql()}
        )
        select
            pub_year as year,
            count(*) as n_datasets,
            sum(n_records)::bigint as n_records,
            sum(count(*)) over (order by pub_year) as cumulative_datasets,
            sum(sum(n_records)) over (order by pub_year) as cumulative_records
        from datasets
        join dataset_year using (dataset_id)
        where pub_year is not null
        group by pub_year
        order by pub_year
    ")
    .run_analysis(query, "published_by_year", sql, verbose)
}

#' Cumulative number of species
#'
#' Species first recorded in each year and their cumulative number, for the
#' whole query or inside each taxon of a rank. The result is sparse: years
#' without new species are not included.
#'
#' @inheritParams analysis_args
#' @param by a taxonomic rank (`"kingdom"`, `"phylum"`, `"class"`, `"order"`,
#'   `"family"` or `"genus"`) to compute the curve inside each taxon of that rank,
#'   or `NULL` for all species together.
#' @return an `abra_query_result` with `first_year`, `new_species` and
#'   `cumulative_species`, plus the rank column if `by` is set and `cell` if
#'   `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   cumulative_species(by = "phylum")
#' }
cumulative_species <- function(query, by = NULL, by_cell = FALSE, verbose = FALSE) {
    ranks <- c("kingdom", "phylum", "class", "order", "family", "genus")
    if (!is.null(by) && !(length(by) == 1 && by %in% ranks)) {
        .em("{.arg by} should be NULL or one of {.val {ranks}}")
    }
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))
    r_sel <- if (is.null(by)) "" else glue::glue('interpreted."{by}" as "{by}",')
    r_grp <- if (is.null(by)) "" else glue::glue('"{by}",')
    r_not_null <- if (is.null(by)) "" else glue::glue('and interpreted."{by}" is not null')
    partition <- paste(c(if (by_cell) "cell", if (!is.null(by)) glue::glue('"{by}"')), collapse = ", ")
    partition <- if (partition == "") "" else paste("partition by", partition)

    sql <- glue::glue("
        with first_seen as (
            select
                {g$sel}
                {r_sel}
                interpreted.species as species,
                min(interpreted.date_year) as first_year
            from {s$table}
            where {s$where} {g$where}
                and interpreted.species is not null and interpreted.date_year is not null
                {r_not_null}
            group by {g$grp} {r_grp} interpreted.species
        )
        select
            {g$ord}
            {r_grp}
            first_year,
            count(*) as new_species,
            sum(count(*)) over ({partition} order by first_year) as cumulative_species
        from first_seen
        group by {g$grp} {r_grp} first_year
        order by {g$ord} {r_grp} first_year
    ")
    .run_analysis(query, "cumulative_species", sql, verbose)
}

#' Taxonomic resolution
#'
#' Level to which each distinct taxon in the records is identified (Species,
#' Genus, Family, Order, Class, Phylum, Kingdom or Other), with counts and
#' percentages.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `higher_level`, `total` and
#'   `total_perc`, plus `cell` if `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   taxon_level()
#' }
taxon_level <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))
    part <- if (by_cell) "partition by cell" else ""

    sql <- glue::glue("
        with taxa as (
            select distinct
                {g$sel}
                interpreted.species as species, interpreted.genus as genus,
                interpreted.family as family, interpreted.\"order\" as \"order\",
                interpreted.class as class, interpreted.phylum as phylum,
                interpreted.kingdom as kingdom
            from {s$table}
            where {s$where} {g$where}
        ),
        ranked as (
            select
                {g$ord}
                case
                    when species is not null then 'Species'
                    when genus is not null then 'Genus'
                    when family is not null then 'Family'
                    when \"order\" is not null then 'Order'
                    when class is not null then 'Class'
                    when phylum is not null then 'Phylum'
                    when kingdom is not null then 'Kingdom'
                    else 'Other'
                end as higher_level
            from taxa
        )
        select
            {g$ord}
            higher_level,
            count(*) as total,
            count(*) * 100.0 / sum(count(*)) over ({part}) as total_perc
        from ranked
        group by {g$grp} higher_level
        order by {g$ord} case higher_level
            when 'Species' then 1 when 'Genus' then 2 when 'Family' then 3
            when 'Order' then 4 when 'Class' then 5 when 'Phylum' then 6
            when 'Kingdom' then 7 else 8 end
    ")
    .run_analysis(query, "taxon_level", sql, verbose)
}

#' Depth information coverage
#'
#' Number of records with both minimum and maximum depth, only one of them, or
#' none.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `depth_coverage`, `total` and
#'   `total_perc`, plus `cell` if `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   depth_coverage()
#' }
depth_coverage <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))
    part <- if (by_cell) "partition by cell" else ""

    sql <- glue::glue("
        with coverage as (
            select
                {g$sel}
                case
                    when interpreted.minimumDepthInMeters is not null
                        and interpreted.maximumDepthInMeters is not null then 'Both'
                    when interpreted.minimumDepthInMeters is not null then 'Minimum depth only'
                    when interpreted.maximumDepthInMeters is not null then 'Maximum depth only'
                    else 'None'
                end as depth_coverage,
                count(*) as total
            from {s$table}
            where {s$where} {g$where}
            group by {g$grp} depth_coverage
        )
        select
            {g$ord}
            depth_coverage,
            total,
            round(total * 100.0 / sum(total) over ({part}), 2) as total_perc
        from coverage
        order by {g$ord} depth_coverage
    ")
    .run_analysis(query, "depth_coverage", sql, verbose)
}

#' Species and records by depth band
#'
#' Number of species and records in each depth band. The depth of a record is
#' its minimum depth, or its maximum depth when the minimum is missing; records
#' without depth are labelled `"Unknown"`. The bands are set with
#' [set_depth_bands()] (default 0-20, 20-200, 200-1000 and 1000+ m).
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `depth_band`, `n_species` and
#'   `n_records`, plus `cell` if `by_cell` is `TRUE`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   set_depth_bands(c(0, 50, 200, 1000, Inf)) |>
#'   depth_bands()
#' }
depth_bands <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))
    breaks <- attr(query, "abra_query")$definers$depth_bands
    if (identical(breaks, NA)) breaks <- c(0, 20, 200, 1000, Inf)
    band_case <- .build_depth_band_query(breaks)

    sql <- glue::glue("
        with depths as (
            select
                {g$sel}
                interpreted.species as species,
                coalesce(interpreted.minimumDepthInMeters, interpreted.maximumDepthInMeters) as depth_m
            from {s$table}
            where {s$where} {g$where}
        ),
        banded as (
            select {g$ord} species, depth_m, {band_case}
            from depths
        )
        select
            {g$ord}
            depth_band,
            count(distinct species) as n_species,
            count(*) as n_records
        from banded
        group by {g$grp} depth_band
        order by {g$ord} min(depth_m) nulls last
    ")
    .run_analysis(query, "depth_bands", sql, verbose)
}

#' Datasets by extension
#'
#' Number of datasets (with records in the query) that have an
#' extendedMeasurementOrFact (eMoF) extension, a DNA derived data extension,
#' both, or none, judged from the extensions of their records.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `type` (`"DNA and eMoF"`, `"eMoF"`,
#'   `"DNA"` or `"None"`), `total` and `total_perc`.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   datasets_by_extension()
#' }
datasets_by_extension <- function(query, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)

    sql <- glue::glue("
        with datasets as (
            select
                dataset_id,
                coalesce(bool_or({s$has_emof}), false) as has_emof,
                coalesce(bool_or({s$has_dna}), false) as has_dna
            from {s$table}
            where {s$where}
            group by dataset_id
        ),
        typed as (
            select
                case
                    when has_emof and has_dna then 'DNA and eMoF'
                    when has_emof then 'eMoF'
                    when has_dna then 'DNA'
                    else 'None'
                end as type
            from datasets
        )
        select
            type,
            count(*) as total,
            count(*) * 100.0 / sum(count(*)) over () as total_perc
        from typed
        group by type
        order by type
    ")
    .run_analysis(query, "datasets_by_extension", sql, verbose)
}

#' List of species
#'
#' One row per taxon (AphiaID) with its classification, Red List category,
#' number of records and datasets, and first and last year recorded. Use it to
#' find the most recorded species, the rarest ones, or the species not
#' recorded recently.
#'
#' @inheritParams analysis_args
#' @return an `abra_query_result` with `aphiaid`, `species`, `genus`,
#'   `family`, `order`, `class`, `phylum`, `kingdom`, `redlist_category`,
#'   `n_records`, `n_datasets`, `first_year` and `last_year`, plus `cell` if
#'   `by_cell` is `TRUE`. Ordered by `n_records`, from the most recorded.
#' @family analyses
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area(area) |>
#'   species_list()
#' }
species_list <- function(query, by_cell = FALSE, verbose = FALSE) {
    query <- .as_query(query)
    s <- .analysis_source(query)
    g <- .group_spec(query, .by_cell(by_cell))

    sql <- glue::glue("
        select
            {g$sel}
            interpreted.aphiaid as aphiaid,
            max(interpreted.species) as species,
            max(interpreted.genus) as genus,
            max(interpreted.family) as family,
            max(interpreted.\"order\") as \"order\",
            max(interpreted.class) as class,
            max(interpreted.phylum) as phylum,
            max(interpreted.kingdom) as kingdom,
            max(interpreted.redlist_category) as redlist_category,
            count(*) as n_records,
            count(distinct dataset_id) as n_datasets,
            min(interpreted.date_year) as first_year,
            max(interpreted.date_year) as last_year
        from {s$table}
        where {s$where} {g$where} and interpreted.aphiaid is not null
        group by {g$grp} interpreted.aphiaid
        order by {g$ord} n_records desc, aphiaid
    ")
    .run_analysis(query, "species_list", sql, verbose)
}
