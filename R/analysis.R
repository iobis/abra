sampled_years <- function(.data) {

    no_year <- sum(is.na(.data$date_year))
    original <- attr(.data, "gridding")

    .data <- .data |>
        filter(!is.na(date_year)) |>
        group_by(cell) |>
        summarise(sampled_years = n_distinct(date_year), .groups = "drop")

    attr(.data, "gridding") <- original

    .data
}

n_records <- function(.data) {
    original <- attr(.data, "gridding")

    result <- .data |>
        group_by(cell) |>
        summarise(records = n(), .groups = "drop")

    attr(result, "gridding") <- original
    result
}

n_datasets <- function(.data) {
    original <- attr(.data, "gridding")

    result <- .data |>
        group_by(cell) |>
        summarise(datasets = n_distinct(datasetID), .groups = "drop")

    attr(result, "gridding") <- original
    result
}

n_nodes <- function(.data) {
    original <- attr(.data, "gridding")

    result <- .data |>
        group_by(cell) |>
        summarise(nodes = n_distinct(node_id), .groups = "drop")

    attr(result, "gridding") <- original
    result
}

# Pielou's evenness of records across datasets within a cell: 1 = records
# spread evenly across all contributing datasets, closer to 0 = a single
# dataset dominates the cell's coverage
dataset_evenness <- function(.data) {
    original <- attr(.data, "gridding")

    result <- .data |>
        group_by(cell, datasetID) |>
        summarise(dataset_records = n(), .groups = "drop_last") |>
        summarise(
            n_datasets = n(),
            dataset_evenness = if (n_datasets > 1) {
                p <- dataset_records / sum(dataset_records)
                -sum(p * log(p)) / log(n_datasets)
            } else {
                NA_real_
            },
            .groups = "drop"
        )

    attr(result, "gridding") <- original
    result
}

last_sampled <- function(.data, reference_year = as.integer(format(Sys.Date(), "%Y"))) {
    original <- attr(.data, "gridding")

    result <- .data |>
        filter(!is.na(date_year)) |>
        group_by(cell) |>
        summarise(
            last_year = max(date_year),
            years_since_sampled = reference_year - last_year,
            .groups = "drop"
        )

    attr(result, "gridding") <- original
    result
}

h3_to_grid <- function(df) {

    original <- attr(df, "gridding")

    con <- DBI::dbConnect(duckdb::duckdb())

    DBI::dbWriteTable(con, "h3con", df)

    con |> DBI::dbSendQuery("install spatial; load spatial;
                             install h3 from community; load h3;")

    converted <- con |> DBI::dbGetQuery(glue::glue("
    select *, h3_cell_to_boundary_wkt(cell) as wkt
    from h3con;
    "))

    DBI::dbDisconnect(con)

    converted <- sf::st_as_sf(converted, wkt = "wkt", crs = 4326)

    attr(converted, "gridding") <- original

    return(converted)
}

complete_h3_grid <- function(df, target_area) {

    original <- attr(df, "gridding")
    target_res <- attr(df, "gridding")$resolution

    con <- DBI::dbConnect(duckdb::duckdb())
    on.exit(DBI::dbDisconnect(con))

    con |> DBI::dbSendQuery("install spatial; load spatial;
                             install h3 from community; load h3;")

    converted <- con |> DBI::dbGetQuery(glue::glue("
    with table1 as (
        select unnest(h3_polygon_wkt_to_cells_string('{target_area}', {target_res})) as cell
    )
    select
        cell,
        h3_cell_to_boundary_wkt(cell) AS wkt
    from table1;
    "))

    converted <- sf::st_as_sf(converted, wkt = "wkt", crs = 4326)

    metric_cols <- setdiff(names(sf::st_drop_geometry(df)), "cell")
    missing <- converted |>
        filter(!(.data[["cell"]] %in% df[["cell"]]))
    missing[metric_cols] <- 0

    result <- bind_rows(df, missing)

    attr(result, "gridding") <- original
    return(result)
}
