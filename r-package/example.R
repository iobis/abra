library(robisdb)
library(abra)

con <- connect_opendata_local("/Volumes/OBIS2/data/obis_data")

statement <- con |>
    set_area() |>
    set_period() |>
    set_depth() |>
    set_grid(grid_type = "h3", resolution = 3)

statement

print_sql(statement, "basic-metrics")

result <- run_query(statement, "basic-metrics", verbose = T)

disconnect(con)