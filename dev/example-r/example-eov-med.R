# Example: essential ocean variables (EOVs) in the French part of the Mediterranean Sea
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
# Each group is run with `run_analyses()`: the area, period and taxa are applied to
# the OBIS data a single time per group, and all its analyses read the result. This
# is the slow step (it reads all the OBIS data); the analyses themselves are fast.
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

target_area <- mregions2::gaz_geometry(25185, multipart = FALSE)
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

# One query per group
eov_queries <- lapply(eovs, \(filters) do.call(set_filters, c(list(base_query), filters)))

eov_queries$corals

# Analyses -------------------------------------------------------------------
# The publication dates of the datasets are needed by `publication_information()`
con |> add_dataset_info()

# `run_analyses()` runs a set of analyses with default arguments, and applies the
# selection to the OBIS data only once per group. This is the slow step.
# A name that matches nothing silently gives zero records: check `n_records`.
analyses <- c(
    "basic_stats", "records_by_year", "cumulative_species", "species_list",
    "records_by_cell", "cell_histogram", "cell_evenness",
    "year_information", "publication_information"
)

results <- lapply(eov_queries, run_analyses, analyses = analyses)

results$corals$basic_stats
results$seagrass$basic_stats
results$fishes$basic_stats

# Combine one analysis across the groups
combine <- function(results, analysis) {
    bind_rows(lapply(names(results), \(eov) {
        mutate(as.data.frame(results[[eov]][[analysis]]), eov = eov)
    }))
}

# Sampling effort over time and species accumulation
records_year <- combine(results, "records_by_year")
cumulative <- combine(results, "cumulative_species")

ggplot(records_year, aes(date_year, n_records, color = eov)) +
    geom_line() +
    labs(x = NULL, y = "Records", title = "Records by year") +
    theme_light()

ggplot(cumulative, aes(first_year, cumulative_species, color = eov)) +
    geom_step() +
    labs(x = NULL, y = "Cumulative species", title = "Species accumulation") +
    theme_light()

# Analyses by grid cell -------------------------------------------------------

map_metric <- function(cells, column, title) {
    ggplot(cell_to_polygon(cells, con)) +
        geom_sf(aes(fill = .data[[column]]), color = NA) +
        scale_fill_viridis_c(trans = "log10", name = NULL) +
        labs(title = title) +
        theme_light()
}

map_metric(results$corals$records_by_cell, "n_species", "Corals: observed number of species")
map_metric(results$seagrass$records_by_cell, "n_species", "Seagrass: observed number of species")
map_metric(results$fishes$records_by_cell, "n_species", "Fishes: observed number of species")

# Observed richness follows sampling effort: read it together with the number of
# records, and with how unevenly the records are spread over the cells
map_metric(results$corals$records_by_cell, "n_records", "Corals: number of records")
results$corals$cell_histogram
results$corals$cell_evenness

# Information metrics ---------------------------------------------------------
# Unique combinations of cell and taxon (phylum by default, see
# `set_taxonomic_level()`) instead of records
results$corals$year_information
results$corals$publication_information

disconnect(con)
