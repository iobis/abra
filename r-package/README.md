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

You need a local copy of the OBIS open data, which can be downloaded and kept up to
date with `robisdb::sync_opendata()`.

1. Connect to the data with `robisdb`.
2. Set the options of the query by chaining `set_*()` calls: area, period,
   depth, taxa (`set_filters()`) and grid.
3. Run analyses, one function each (or several with `run_analyses()`).

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
| `set_depth()` | depth range of the records (records without depth are left out) |
| `set_filters()` | taxa (by rank), datasets, nodes, quality flags. Several taxa are combined with *or*; the other filters with *and* |
| `set_grid()` | grid system and resolution (H3) |
| `set_taxonomic_level()` | taxonomic rank used by the information metrics |
| `set_depth_bands()` | depth bands used by `depth_bands()` |
| `add_dataset_info()` | adds the `dataset_info` table (dataset publication dates, downloaded from the OBIS API) to the connection; needed by `published_by_year()` and `publication_information()` |

### Analyses

| Group | Functions |
|---|---|
| Records overview | `basic_stats()`, `records_by_year()`, `records_by_month()`, `published_by_year()`, `cumulative_species()`, `taxon_level()`, `depth_coverage()`, `depth_bands()`, `datasets_by_extension()`, `species_list()` |
| Spatial | `records_by_cell()`, `cell_histogram()`, `cell_evenness()`, `cell_to_polygon()` |
| Information metrics | `publication_information()`, `year_information()` |

Most analyses have `by_cell = TRUE` to get one result per grid cell.
`run_analyses()` runs several analyses at once. See `?abra` for the overview.

Each analysis returns an `abra_query_result`, a tibble that also carries the
query that produced it. `cell_to_polygon()` turns a result with a `cell` column into
an `sf` object, to map it.

```r
cells <- records_by_cell(statement)        # one row per H3 cell
cell_to_polygon(cells, statement) |> plot()
```

The publication and year information metrics count unique combinations of cell,
year and taxon (by default phylum; change it with `set_taxonomic_level()`) instead of
records, so intensively sampled places do not dominate the result:

```r
con |> add_dataset_info()
publication_information(statement)
year_information(statement)
```

### Several analyses at once

Every analysis reads the OBIS data, which is slow for a large local copy.
`run_analyses()` runs several analyses and applies the area, period, depth and
filters only once for all of them:

```r
results <- run_analyses(statement, c("basic_stats", "records_by_year", "species_list"))
results$basic_stats
```

The query it used (already applied to the data) is kept in `attr(results, "query")`, so
you can run more analyses on it without reading the data again:

```r
basic_stats(attr(results, "query"), by = "dataset")
```

#### Optional: `pre_compute()`

If you prefer to call the analyses one by one, run `pre_compute()` first. It saves
the records that match the area, period, depth and filters in a table of the connection,
and all the analyses that follow read from that table (a fraction of a second each,
instead of a full scan each):

```r
statement <- statement |> pre_compute()
basic_stats(statement)
records_by_year(statement)
```

The grid, `set_taxonomic_level()` and `set_depth_bands()` can still be changed
afterwards. If the area, period, depth or filters are changed, the analyses warn and use
the full dataset again. The table is named `obis_computed` by default; use `table =` to
keep several at once (see the [example](../dev/example-r/example-eov-med.R)).

### Export for a dashboard: `export_cube()`

`export_cube()` writes a result as a Parquet file sorted and chunked for fast reading
in the browser (for example with [Hyparquet](https://github.com/hyparam/hyparquet)),
plus a JSON manifest with the values of each dimension. It is not needed by the
[dashboard](../dashboard) of this repository, which reads plain Parquet files.

```r
records_by_year(statement, by_cell = TRUE) |>
  export_cube("records_by_year.parquet", dimensions = "date_year")
```

## Supported data products

The analyses currently support the `open-data` product only; connections to
`speciesgrids` or `obistherm` are rejected with a clear error.

## Documentation

Every exported function is documented with Roxygen: see `?abra` for an overview
and, for example, `?basic_stats`. Regenerate `NAMESPACE` and `man/` after editing a
function's documentation with:

```r
devtools::document()
```

## Tests

The tests cover the query building (`set_*()`), the SQL conditions and `export_cube()`,
and do not need the OBIS data:

```r
devtools::test()
```
