lapply(list.files("R", full.names = T), source)

con <- connect()

con


target_area <- "POLYGON ((-41.308594 -21.289374, -46.40625 -23.483401, -48.251953 -25.324167, -46.757813 -26.667096, -38.847656 -22.43134, -41.308594 -21.289374))"

query <- con |>
    set_area(target_area) |>
    set_period(date_start = "2010-01-01") |>
    set_depth() |>
    set_grid(grid_type = "h3", resolution = 4) |>
    set_query(taxonid = 125515)

data <- query |>
    collect()

summary.abra_data <- function(.data) {
    unique_taxa <- unique(.data$aphiaID)
    cat(glue::glue("
    Number of records: {nrow(.data)}
    Number of unique taxa: {length(unique_taxa)}
    "))
}

summary(data)

samp_years <- sampled_years(data)
plot_grid(samp_years, metric = "sampled_years", complete = T, target_area = target_area)

n_recs <- n_records(data)
plot_grid(n_recs, metric = "records", complete = T, target_area = target_area)
