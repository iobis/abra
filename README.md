# abra

OBIS Area-Based Records Analysis: tooling for running area/period/depth/taxon
filtered queries against OBIS's DuckDB-based data products (open-data,
speciesgrids, obistherm), aggregating the results onto a spatial grid (H3 by
default), and reporting on them.

## Repository layout

- [`r-package/`](r-package/) - the `abra` R package: build a query by
  chaining `set_area()`/`set_period()`/`set_depth()`/`set_filters()`/
  `set_grid()` onto a `robisdb` connection, then run analyses on it
  (`basic_stats()`, `records_by_year()`, `publication_information()`, ...).
  See [`r-package/README.md`](r-package/README.md) for installation and
  usage.
- [`dashboard/`](dashboard/) - a static web dashboard (SvelteKit) that shows the
  results of one analysis for one area, hosted for free on GitHub Pages. See
  [`dashboard/README.md`](dashboard/README.md).
- [`quarto/`](quarto/) - a single Quarto document that renders the same results as
  a PDF report. See [`quarto/README.md`](quarto/README.md).
- [`python-package/`](python-package/) - a Python package, planned but not
  yet started.
- [`dev/`](dev/) - exploratory scripts and examples; not part of the package.

## Getting started

For setting up a query and running analyses, start with the R package:

```r
pak::pkg_install("iobis/robisdb")
pak::pkg_install("iobis/abra/r-package")
```

See [`r-package/README.md`](r-package/README.md) for a usage example.
