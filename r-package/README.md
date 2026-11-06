# abra

OBIS Area-Based Records Analysis: an R package for building and running
area/period/depth/taxon-filtered queries against OBIS's DuckDB-based data
products, and aggregating the results onto a spatial grid.

## Installation

`abra` depends on [`robisdb`](https://github.com/iobis/robisdb), which
provides the underlying DuckDB connection to OBIS's parquet datasets. Install
both from GitHub:

```r
# install.packages("pak")
pak::pkg_install("iobis/robisdb")
pak::pkg_install("iobis/abra/r-package")
```

## Usage

1. Connect to the data with `robisdb`.
2. Set the options of the query by chaining `set_*()` calls: area, period,
   depth, taxa (`set_filters()`) and grid.
3. Run analyses, one function each.

```r
library(robisdb)
library(abra)

con <- connect_opendata_local("path/to/parquet")

statement <- con |>
  set_area("POLYGON ((-46 -24, -42 -24, -42 -20, -46 -20, -46 -24))") |>
  set_period(date_start = "2010-01-01", date_end = "2020-12-31") |>
  set_filters(class = "Teleostei") |>
  set_grid(grid_type = "h3", resolution = 5)

basic_stats(statement)
records_by_year(statement)
cumulative_species(statement, by = "phylum")
```

Printing a query shows a summary of what has been set:

```
> con |> set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |> set_grid(resolution = 5)
── robisdb connection ──
...
── Statement details ──
• Area: POLYGON ((0 0, 1 0, 1 1, 0 0))
• Grid: h3 (resolution 5)
```

### Setters

| Function | Sets |
|---|---|
| `set_area()` | area of interest (`sf`, `SpatVector` or WKT) |
| `set_period()` | date range of the observations |
| `set_depth()` | depth range of the records |
| `set_filters()` | taxa (by rank), datasets, nodes, quality flags |
| `set_grid()` | grid system and resolution (H3) |
| `set_taxonomic_level()` | taxonomic rank used by the information metrics |
| `set_depth_bands()` | depth bands used by `depth_bands()` |
| `add_dataset_info()` | adds the `dataset_info` table (dataset publication dates) |

### Analyses

| Group | Functions |
|---|---|
| Records overview | `basic_stats()`, `records_by_year()`, `records_by_month()`, `published_by_year()`, `cumulative_species()`, `taxon_level()`, `depth_coverage()`, `depth_bands()`, `datasets_by_extension()`, `species_list()` |
| Spatial | `records_by_cell()`, `cell_histogram()`, `cell_evenness()`, `cell_to_polygon()` |
| Information metrics | `publication_information()`, `year_information()` |

Most analyses have `by_cell = TRUE` to get one result per grid cell.
`run_analyses()` runs several analyses at once. See `?abra` for the overview.

Each analysis returns an `abra_query_result`, a tibble that also carries the
query that produced it.

### Speed: `pre_compute()`

Every analysis scans the OBIS parquet files. When several analyses are run
for the same selection, apply the area, period, depth and filters once with
`pre_compute()`: the matching records are saved in a table of the connection
and all the analyses that follow read from it.

```r
statement <- statement |> pre_compute()
basic_stats(statement)
records_by_year(statement)
```

If the area, period, depth or filters are changed after `pre_compute()`, the
analyses warn and use the full dataset again.

## Supported data products

The analyses currently support the `open-data` product only; connections to
`speciesgrids` or `obistherm` are rejected with a clear error.

## Documentation

Every exported function is documented with Roxygen. Regenerate `NAMESPACE`
and `man/` after editing a function's documentation with:

```r
devtools::document()
```
