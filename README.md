# abra

OBIS Area-Based Records Analysis: tooling for running area/period/depth/taxon
filtered queries against OBIS's DuckDB-based data products (open-data,
speciesgrids, obistherm), aggregating the results onto a spatial grid (H3 by
default), and reporting on them.

## Repository layout

- [`r-package/`](r-package/) - the `abra` R package: build a query by
  chaining `set_area()`/`set_period()`/`set_depth()`/`set_filters()`/
  `set_grid()` onto a `robisdb` connection, then run it with `run_query()`.
  See [`r-package/README.md`](r-package/README.md) for installation and
  usage.
- [`python-package/`](python-package/) - a Python package, planned but not
  yet started.
- [`sql/`](sql/) - the SQL templates `run_query()` runs, one per metric (e.g.
  `basic-metrics.sql`, `records-per-year.sql`). Templates can vary by data
  product (open-data vs. speciesgrids), and are cell/condition-substituted at
  run time - see the r-package README for details.
- [`sql-files.json`](sql-files.json) - manifest of the SQL templates
  (source URL, version, target product), used by `sync_sql_files()` to fetch
  a local copy of `sql/`.
- [`dev/`](dev/) - exploratory scripts used while developing the SQL
  templates and analyses; not part of the package.

## Getting started

For building and running queries, start with the R package:

```r
pak::pkg_install("iobis/robisdb")
pak::pkg_install("iobis/abra/r-package")
```

See [`r-package/README.md`](r-package/README.md) for a usage example.
