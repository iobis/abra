# Example: essential ocean variables (EOVs) in the Mediterranean Sea
#
# Three biological groups are explored with the same area, period and grid:
#   - hard and soft corals
#   - seagrass
#   - fishes (bony and cartilaginous)
# Each one is a set of taxa, set with the rank arguments of `set_filters()`
# (`class`, `order`, `family`, `genus`, ...). Names are matched at that rank in the
# parquet, so the rank has to be the one used in the data (e.g. fishes are
# `Teleostei`, not `Actinopterygii`). Different ranks can be mixed: the result is
# the union of the taxa.
#
# Each group is pre-computed once with `pre_compute()`: the area, period and taxa
# are applied to the full dataset a single time and saved in a table, and all the
# metrics below read from that table. This is the slow step (it reads all the OBIS
# data); the analyses after it are fast.
#
# Run it from the root of the repository (`devtools::load_all("r-package")` loads
# the package from source; with the package installed, use `library(abra)` only).
# Needs a local copy of the OBIS open data (`robisdb::sync_opendata()`) and the
# packages robisdb, sf, dplyr, ggplot2 and mregions2 (for the Mediterranean area).

devtools::load_all("r-package")
library(robisdb)
library(abra)
library(ggplot2)
library(sf)
library(dplyr)
sf_use_s2(FALSE)

con <- connect_opendata_local("/Volumes/OBIS2/data/obis_data")

# Area ------------------------------------------------------------------------

target_area <- mregions2::gaz_geometry(1905, multipart = FALSE)
target_area <- st_union(st_buffer(target_area[, 1], 0.01))
plot(target_area)

target_resolution <- 4

# EOV definitions -------------------------------------------------------------

# Arguments of set_filters() for each group
eovs <- list(
    corals = list(
        class = "Octocorallia", # soft corals and sea fans
        order = c("Scleractinia", "Antipatharia") # stony and black corals
    ),
    seagrass = list(
        family = c("Posidoniaceae", "Zosteraceae", "Cymodoceaceae"),
        genus = "Halophila"
    ),
    fishes = list(
        class = c(
            "Teleostei", "Elasmobranchii", "Holocephali", "Chondrostei",
            "Cladistii", "Myxini", "Petromyzonti"
        )
    )
)

# Base query shared by all groups
base_query <- con |>
    set_area(target_area) |>
    set_period("2000-01-01", "2025-12-31") |>
    set_grid(grid_type = "h3", resolution = target_resolution)

# One pre-computed query per group. Each pre_compute() scans the full dataset and
# creates a table in the connection, so they are given different names.
eov_queries <- lapply(names(eovs), \(eov) {
    query <- do.call(set_filters, c(list(base_query), eovs[[eov]]))
    pre_compute(query, table = paste0("obis_", eov))
})
names(eov_queries) <- names(eovs)

eov_queries$corals



# Whole-area analyses ---------------------------------------------------------
# run_analyses() runs a set of analyses with default arguments. The queries are
# already pre-computed, so none of them scans the full dataset again.
# A name that matches nothing silently gives zero records: check `n_records`.

analyses <- c("basic_stats", "records_by_year", "cumulative_species", "species_list")

global <- lapply(eov_queries, run_analyses, analyses = analyses)

global$corals$basic_stats
global$seagrass$basic_stats
global$fishes$basic_stats

# Combine one analysis across the groups
combine <- function(results, analysis) {
    bind_rows(lapply(names(results), \(eov) {
        mutate(as.data.frame(results[[eov]][[analysis]]), eov = eov)
    }))
}

# Sampling effort over time and species accumulation
records_year <- combine(global, "records_by_year")
cumulative <- combine(global, "cumulative_species")

ggplot(records_year, aes(date_year, n_records, color = eov)) +
    geom_line() +
    labs(x = NULL, y = "Records", title = "Records by year") +
    theme_light()

ggplot(cumulative, aes(first_year, cumulative_species, color = eov)) +
    geom_step() +
    labs(x = NULL, y = "Cumulative species", title = "Species accumulation") +
    theme_light()

# Analyses by grid cell -------------------------------------------------------

by_cell <- lapply(eov_queries, records_by_cell)

map_metric <- function(cells, column, title) {
    ggplot(cell_to_polygon(cells, con)) +
        geom_sf(aes(fill = .data[[column]]), color = NA) +
        scale_fill_viridis_c(trans = "log10", name = NULL) +
        labs(title = title) +
        theme_light()
}

map_metric(by_cell$corals, "n_species", "Corals: observed species richness")
map_metric(by_cell$seagrass, "n_species", "Seagrass: observed species richness")
map_metric(by_cell$fishes, "n_species", "Fishes: observed species richness")

# Observed richness follows sampling effort: read it together with the number of
# records, and with how unevenly the records are spread over the cells
map_metric(by_cell$corals, "n_records", "Corals: number of records")
cell_histogram(eov_queries$corals)
cell_evenness(eov_queries$corals)

# Information metric ----------------------------------------------------------
# Needs the dataset publication dates
con |> add_dataset_info()

year_information(eov_queries$corals)
publication_information(eov_queries$corals)

disconnect(con)
