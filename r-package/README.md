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

A query is built by chaining `set_*()` calls onto a `robisdb` connection,
then run with `run_query()` against a named SQL template:

```r
library(robisdb)
library(abra)

con <- connect_opendata_local("path/to/parquet")

result <- con |>
  set_area("POLYGON ((-46 -24, -42 -24, -42 -20, -46 -20, -46 -24))") |>
  set_period(date_start = "2010-01-01", date_end = "2020-12-31") |>
  set_depth(startdepth = 0, enddepth = 200) |>
  set_filters(taxonid = 125515) |>
  set_grid(grid_type = "h3", resolution = 5) |>
  run_query("basic-metrics")

result
```

Every `set_*()` call is optional except `set_grid()`, which `run_query()`
requires. Printing a query (before or after running it) shows a summary of
what's been set:

```
> con |> set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |> set_grid(resolution = 5)
── robisdb connection ──
...
── Statement details ──
• Area: POLYGON ((0 0, 1 0, 1 1, 0 0))
• Grid: h3 (resolution 5)
```

## SQL templates

`run_query()` runs one of the SQL templates in [`sql/`](../sql/) at the
repository root, substituting the query's area/period/depth/filters/grid
into each template's `-- [start cell block]` and `-- [start conditions]`
markers. Fetch a local copy of the templates with:

```r
sync_sql_files("sql")
```

## Supported data products

OBIS publishes several DuckDB-queryable products (see `robisdb::connect()`).
`run_query()` currently only supports the `open-data` product; connections to
`speciesgrids` or `obistherm` are rejected with a clear error until support
is added.

## Documentation

Every exported function is documented with Roxygen (`?set_area`,
`?run_query`, `?sync_sql_files`, ...). Regenerate `NAMESPACE`/`man/` after
editing a function's documentation with:

```r
roxygen2::roxygenise()
```
