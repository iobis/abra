# Full example, step 1: run the analyses and save the data
#
# This is the same analysis as `dev/example-r/example-eov-med.R` (essential ocean
# variables in the Mediterranean Sea: corals, seagrass and fishes), but instead of
# only plotting in R, it saves the results of every group as Parquet files that the
# dashboard (Svelte) and the Quarto report read:
#
#   dashboard/static/eov-med/
#     analyses.json        list of the groups (makes the dashboard show a switch)
#     corals/              one folder per group: Parquet files + meta.json
#     seagrass/
#     fishes/
#
# Run it from the root of the repository:
#
#   Rscript dev/full-example/01-prepare-data.R
#
# Needs a local copy of the OBIS open data (`robisdb::sync_opendata()`) and the
# packages robisdb, abra, sf, dplyr, arrow, jsonlite and mregions2 (for the
# Mediterranean area). Reading the OBIS data is the slow step: it is done once per
# group (a few minutes each, depending on the area and on the machine).
#
# Then see README.md: show the dashboard, and make one PDF report per group with
# `02-render-reports.R`.

devtools::load_all("r-package")
library(robisdb)
library(abra)
library(sf)
library(dplyr)
library(arrow)
sf_use_s2(FALSE)

# ---- SETTINGS ----------------------------------------------------------------

# Folder with the OBIS open data. It can be set with the environment variable OBIS_DATA.
data_path <- Sys.getenv("OBIS_DATA", "/Volumes/OBIS2/data/obis_data")

# Where the results are saved. The dashboard reads it with
# `VITE_DATA_PATH=eov-med npm run dev` (see README.md).
output_dir <- Sys.getenv("EOV_OUTPUT", "dashboard/static/eov-med")

# Memory limit of DuckDB (e.g. "8GB"), to keep the machine usable while the data is
# read. Use NULL for the DuckDB default (80% of the memory).
duckdb_memory <- Sys.getenv("DUCKDB_MEMORY", NA)
if (is.na(duckdb_memory)) duckdb_memory <- NULL

con <- connect_opendata_local(data_path)
if (!is.null(duckdb_memory)) {
    DBI::dbExecute(con$connection, glue::glue("set memory_limit = '{duckdb_memory}'"))
}

# Area ------------------------------------------------------------------------

target_area <- mregions2::gaz_geometry(25185, multipart = FALSE)
target_area <- st_union(st_buffer(target_area[, 1], 0.01))

target_resolution <- 4
area_bbox <- as.numeric(st_bbox(target_area)) # xmin, ymin, xmax, ymax

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

# Name of each group in the dashboard and in the report
labels <- c(corals = "Corals", seagrass = "Seagrass", fishes = "Fishes")

# Rank of the taxa counted by the information metrics (a group with a single phylum
# would have no variation if the default, phylum, was used)
information_rank <- c(corals = "order", seagrass = "family", fishes = "order")

# Base query shared by all groups
base_query <- con |>
    set_area(target_area) |>
    set_period("2000-01-01", "2025-12-31") |>
    set_grid(grid_type = "h3", resolution = target_resolution)

# One query per group
eov_queries <- Map(
    \(filters, rank) {
        q <- do.call(set_filters, c(list(base_query), filters))
        set_taxonomic_level(q, rank)
    },
    eovs, information_rank[names(eovs)]
)

# The publication dates of the datasets are needed by `publication_information()`
# and `published_by_year()`
con |> add_dataset_info()

# Analyses -------------------------------------------------------------------
# All the analyses shown in the dashboard and in the report. `run_analyses()` applies
# the selection to the OBIS data only once per group. This is the slow step.
# A name that matches nothing silently gives zero records: check `n_records`.
analyses <- c(
    "basic_stats", "records_by_year", "records_by_month", "cumulative_species",
    "taxon_level", "depth_coverage", "datasets_by_extension", "species_list",
    "depth_bands", "cell_histogram", "records_by_cell", "year_information",
    "published_by_year", "publication_information"
)

# Writes a table as Parquet. Small row groups let the dashboard read only the part of
# a large file that it needs.
save_table <- function(x, name, dir) {
    x <- as.data.frame(x)
    class(x) <- "data.frame"
    attr(x, "abra_query") <- NULL
    write_parquet(x, file.path(dir, paste0(name, ".parquet")), compression = "snappy", chunk_size = 1000)
    message("  saved ", name, " (", nrow(x), " rows)")
}

# Runs the analyses of one group and saves everything the dashboard and the report read
prepare_group <- function(id) {
    query <- eov_queries[[id]]
    dir <- file.path(output_dir, id)
    dir.create(dir, showWarnings = FALSE, recursive = TRUE)
    message("Group: ", id)

    results <- run_analyses(query, analyses)
    n_records <- results$basic_stats$n_records
    if (isTRUE(n_records == 0)) warning("No records for ", id, ": check the names of the taxa", call. = FALSE)

    # The extra analyses reuse the selection already applied (it is replaced by the
    # next `run_analyses()`, so they have to run now)
    selection <- attr(results, "query")

    for (name in setdiff(analyses, "records_by_cell")) save_table(results[[name]], name, dir)

    # One row per grid cell, with all the cell metrics the map can show
    cells <- results$records_by_cell |>
        left_join(select(basic_stats(selection, by = "cell"), -n_records, -n_species), by = "cell")
    save_table(cells, "cells", dir)

    save_table(cumulative_species(selection, by = "phylum"), "cumulative_species_phylum", dir)

    # Description of the analysis
    meta <- list(
        title = paste0(labels[[id]], ": Mediterranean Sea"),
        subtitle = "Essential ocean variables in OBIS",
        area_bbox = area_bbox, # xmin, ymin, xmax, ymax
        date_start = "2000-01-01",
        date_end = "2025-12-31",
        depth = NULL,
        taxa = eovs[[id]],
        resolution = target_resolution,
        information_rank = information_rank[[id]],
        generated = format(Sys.Date()),
        abra_version = as.character(utils::packageVersion("abra")),
        files = sub("\\.parquet$", "", list.files(dir, pattern = "\\.parquet$"))
    )
    jsonlite::write_json(meta, file.path(dir, "meta.json"), auto_unbox = TRUE, pretty = TRUE, null = "null")
    invisible(n_records)
}

for (id in names(eov_queries)) prepare_group(id)

# The list of groups: with this file the dashboard shows a switch between them
jsonlite::write_json(
    data.frame(id = names(eov_queries), label = unname(labels[names(eov_queries)])),
    file.path(output_dir, "analyses.json"),
    auto_unbox = TRUE, pretty = TRUE
)

disconnect(con)
message("Done. Results in ", normalizePath(output_dir))
