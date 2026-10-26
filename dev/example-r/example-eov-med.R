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
# metrics below read from that table.

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

# The SQL now reads the pre-computed table, and the filters are not repeated
print_sql(eov_queries$corals, "richness-bycell")

# Whole-area metrics ----------------------------------------------------------
# One row (or one series) per group. A name that matches nothing silently gives
# zero records, so check `richness` first.

global_templates <- c(
    "richness",
    "richness-estimators",
    "cell-sampling",
    "temporal-gaps",
    "records-by-year",
    "cumulative-species",
    "threatened-species"
)

global <- lapply(eov_queries, run_query, sql_templates = global_templates)

global$corals$richness
global$seagrass$richness
global$fishes$richness

# Combine one metric across EOVs
combine <- function(results, template) {
    bind_rows(lapply(names(results), \(eov) {
        mutate(as.data.frame(results[[eov]][[gsub("-", "_", template)]]), eov = eov)
    }))
}

# Sampling effort over time and species accumulation
records_year <- combine(global, "records-by-year")
cumulative <- combine(global, "cumulative-species")

ggplot(records_year, aes(date_year, total, color = eov)) +
    geom_line() +
    labs(x = NULL, y = "Records", title = "Records by year") +
    theme_light()

ggplot(cumulative, aes(first_year, cumulative_species, color = eov)) +
    geom_step() +
    labs(x = NULL, y = "Cumulative species", title = "Species accumulation") +
    theme_light()

# Metrics by grid cell --------------------------------------------------------

cell_templates <- c("richness-bycell", "richness-estimators-bycell", "cell-sampling-bycell")

by_cell <- lapply(eov_queries, run_query, sql_templates = cell_templates)

# Join the three metrics of an EOV into one table
cells_eov <- lapply(by_cell, \(res) {
    res$richness_bycell |>
        select(cell, n_species, n_records) |>
        left_join(select(res$richness_estimators_bycell, cell, chao1, completeness), by = "cell")
})

# Cells to polygons, using the H3 extension of the connection
cell_polygons <- function(cells) {
    DBI::dbWriteTable(con$connection, "eov_cells", data.frame(cell = unique(cells$cell)),
        temporary = TRUE, overwrite = TRUE)
    pols <- get_query(con, "
        select cell, h3_cell_to_boundary_wkt(h3_string_to_h3(cell)) as wkt
        from eov_cells")
    left_join(cells, st_as_sf(pols, wkt = "wkt", crs = 4326), by = "cell") |>
        st_as_sf()
}

map_metric <- function(cells, column, title) {
    ggplot(cell_polygons(cells)) +
        geom_sf(aes(fill = .data[[column]]), color = NA) +
        scale_fill_viridis_c(trans = "log10", name = NULL) +
        labs(title = title) +
        theme_light()
}

map_metric(cells_eov$corals, "n_species", "Corals: observed species richness")
map_metric(cells_eov$seagrass, "n_species", "Seagrass: observed species richness")
map_metric(cells_eov$fishes, "n_species", "Fishes: observed species richness")

# Observed richness follows sampling effort: read it together with the number of
# records and with the completeness (observed / Chao1)
map_metric(cells_eov$corals, "n_records", "Corals: number of records")
map_metric(cells_eov$corals, "completeness", "Corals: sampling completeness")

disconnect(con)
