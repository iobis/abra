devtools::load_all("r-package")
library(robisdb)
library(abra)
library(ggplot2)
library(sf)

con <- connect_opendata_local("/Volumes/OBIS2/data/obis_data")

target_area <- mregions2::gaz_geometry(3293)

statement <- con |>
    set_area(target_area) |>
    set_period("2000-01-01", "2010-01-01") |>
    set_depth() |>
    set_grid(grid_type = "h3", resolution = 3)

statement

print_sql(statement, "cell-sampling")

?metrics

# By default, it uses the sql/open-data folder
result <- run_query(statement,
                    c(
                        "richness-bycell",
                        "last-seen-bycell"
                    ),
                    verbose = T)

result

result$basic_metrics

statement <- statement |>
    add_dataset_info()

i_metrics <- run_query(statement,
                       c(
                        "publication-information",
                        "year-information"
                       ))

disconnect(con)