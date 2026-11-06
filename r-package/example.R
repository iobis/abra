library(robisdb)
library(abra)

con <- connect_opendata_local("/Volumes/OBIS2/data/obis_data")

# 1. Set the query: area, period, taxa and grid
statement <- con |>
    set_area("POLYGON ((-46 -24, -42 -24, -42 -20, -46 -20, -46 -24))") |>
    set_period("2000-01-01", "2020-12-31") |>
    set_grid(grid_type = "h3", resolution = 4)

statement

# 2. Run analyses, one by one...
basic_stats(statement)
records_by_year(statement)

# ...or several at once (the query is pre-computed first)
results <- run_analyses(statement, c("basic_stats", "cumulative_species", "taxon_level"))
results$basic_stats

disconnect(con)
