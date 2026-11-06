# Prepare the data of the dashboard (and of the Quarto report)
#
# Runs a full set of analyses for ONE area with the abra package and saves each
# result as a Parquet file in `output_dir`, plus a `meta.json` describing the
# analysis. The dashboard (static/data) and the Quarto report (quarto/) both
# read this folder, so they always show the same numbers.
#
# 1. Edit the SETTINGS below.
# 2. Run the script:  Rscript prepare-data.R    (from the `dashboard` folder)
#
# Everything above the "ANALYSES" line is meant to be edited; the rest is the
# same for every area.

library(robisdb)
library(abra)
library(dplyr)
library(arrow)
library(sf)

# ---- SETTINGS ----------------------------------------------------------------

# Folder with the OBIS open data (Parquet files). It can be set with the
# environment variable OBIS_DATA.
data_path <- Sys.getenv("OBIS_DATA", "/Volumes/OBIS2/data/obis_data")

# Where the results are saved. Keep it as it is to use them in the dashboard.
output_dir <- "static/data"

# Texts shown in the dashboard and in the report
title <- "Mediterranean Sea"
subtitle <- "Marine biodiversity records in OBIS"

# Area: anything accepted by set_area(): an sf object or a WKT string.
# Example with a Marine Regions area (https://marineregions.org):
area <- mregions2::gaz_geometry(1905, multipart = FALSE)
# Example with a WKT polygon:
# area <- "POLYGON ((-6 30, 36 30, 36 46, -6 46, -6 30))"

# Period (use NULL for no limit), depth range in meters (NULL for no limit)
date_start <- "1990-01-01"
date_end <- "2025-12-31"
min_depth <- NULL
max_depth <- NULL

# Taxa to include (NULL for all). Use any rank: kingdom, phylum, class, order,
# family, genus or species. Several ranks can be combined (the taxa are added).
taxa <- NULL
# taxa <- list(class = "Teleostei")
# taxa <- list(order = c("Scleractinia", "Antipatharia"), class = "Octocorallia")

# H3 grid resolution of the maps (3 = ~12,000 km2 per cell, 4 = ~1,700 km2,
# 5 = ~250 km2). Use coarser cells for larger areas.
resolution <- 4

# Taxonomic rank used by the information metrics
information_rank <- "phylum"

# Dataset publication dates are needed for `published_by_year` and
# `publication_information`. They are downloaded from the OBIS API; if you
# already have the dataset table as a Parquet file (columns id, created,
# published), set its path here to skip the download. Use FALSE to skip these
# two analyses.
dataset_info <- TRUE
dataset_info_parquet <- NULL

# ---- ANALYSES ----------------------------------------------------------------

dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

con <- connect_opendata_local(data_path)

statement <- con |>
    set_area(area) |>
    set_period(date_start, date_end) |>
    set_depth(min_depth, max_depth) |>
    set_grid(grid_type = "h3", resolution = resolution) |>
    set_taxonomic_level(information_rank)

if (!is.null(taxa)) statement <- do.call(set_filters, c(list(statement), taxa))

# Apply the area, period and taxa once; all the analyses read the result
statement <- pre_compute(statement)

# Dataset publication dates
has_dataset_info <- FALSE
if (!isFALSE(dataset_info)) {
    if (!is.null(dataset_info_parquet)) {
        DBI::dbExecute(con$connection, glue::glue(
            "create or replace table dataset_info as select * from read_parquet('{dataset_info_parquet}')"
        ))
        has_dataset_info <- TRUE
    } else {
        has_dataset_info <- tryCatch({
            add_dataset_info(con)
            TRUE
        }, error = function(e) {
            message("Could not get the dataset table, skipping the publication analyses: ", conditionMessage(e))
            FALSE
        })
    }
}

# Writes a result as Parquet. Small row groups let the dashboard read only the
# part of a large file that it needs (HTTP range requests).
save <- function(x, name, row_group_size = 1000) {
    x <- as.data.frame(x)
    class(x) <- "data.frame"
    attr(x, "abra_query") <- NULL
    write_parquet(x, file.path(output_dir, paste0(name, ".parquet")),
        compression = "snappy", chunk_size = row_group_size)
    message("Saved ", name, " (", nrow(x), " rows)")
}

stats <- basic_stats(statement)
save(stats, "basic_stats")

# One row per grid cell, with all the cell metrics the map can show
cells <- records_by_cell(statement) |>
    left_join(select(basic_stats(statement, by = "cell"), -n_records, -n_species), by = "cell")
save(cells, "cells")
save(cell_histogram(statement), "cell_histogram")

save(records_by_year(statement), "records_by_year")
save(records_by_month(statement), "records_by_month")
save(cumulative_species(statement), "cumulative_species")
save(cumulative_species(statement, by = "phylum"), "cumulative_species_phylum")
save(taxon_level(statement), "taxon_level")
save(depth_coverage(statement), "depth_coverage")
save(depth_bands(statement), "depth_bands")
save(datasets_by_extension(statement), "datasets_by_extension")
save(species_list(statement), "species_list")
save(year_information(statement), "year_information")

if (has_dataset_info) {
    save(published_by_year(statement), "published_by_year")
    save(publication_information(statement), "publication_information")
}

# ---- Description of the analysis ----------------------------------------------

area_sf <- if (inherits(area, "character")) st_as_sfc(area, crs = 4326) else st_geometry(area)
bbox <- as.numeric(st_bbox(st_transform(st_union(area_sf), 4326)))

meta <- list(
    title = title,
    subtitle = subtitle,
    area_bbox = bbox, # xmin, ymin, xmax, ymax
    date_start = date_start,
    date_end = date_end,
    depth = c(min_depth, max_depth),
    taxa = taxa,
    resolution = resolution,
    information_rank = information_rank,
    generated = format(Sys.Date()),
    abra_version = as.character(utils::packageVersion("abra")),
    files = sub("\\.parquet$", "", list.files(output_dir, pattern = "\\.parquet$"))
)
jsonlite::write_json(meta, file.path(output_dir, "meta.json"), auto_unbox = TRUE, pretty = TRUE, null = "null")

disconnect(con)
message("Done. Results in ", normalizePath(output_dir))
