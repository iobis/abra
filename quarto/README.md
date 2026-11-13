# Quarto report

`report.qmd` is a single [Quarto](https://quarto.org) document that puts together
the results of **one full analysis for one area** and renders them as a clean PDF
(through [Typst](https://typst.app), which comes with Quarto, so no LaTeX is
needed): overview numbers, maps of the grid cells, records and species through
time, taxonomy, depth, datasets and the information metrics.

It reads the same results as the [dashboard](../dashboard), so the report and the
dashboard always show the same numbers.

## Make a report

**1. Prepare the data.** Edit the settings of
[`../dashboard/prepare-data.R`](../dashboard/prepare-data.R) (title, area, period,
taxa, grid) and run it from the `dashboard` folder:

```sh
cd ../dashboard
Rscript prepare-data.R
```

The results are saved in `dashboard/static/data/` (Parquet files and `meta.json`).
The repository includes demo data, so you can skip this step to try the report.
`prepare-data.R` needs the [abra](../r-package) and
[robisdb](https://github.com/iobis/robisdb) packages and a local copy of the OBIS
open data (`robisdb::sync_opendata()`).

**2. Render.** From this folder:

```sh
quarto render report.qmd
```

This creates `report.pdf` (not tracked by git). In RStudio or Positron, use the
*Render* button.

To render the results of another folder, give its path (relative to this folder) in
the `data_dir` parameter. This is how
[`dev/full-example`](../dev/full-example) makes one report per group of taxa:

```sh
quarto render report.qmd -P data_dir:../dashboard/static/eov-med/corals
```

Note that Quarto deletes the previous PDF of the document when it renders, even if
the new one has another name. Copy the PDFs you want to keep, or render a copy of
`report.qmd` as `dev/full-example/02-render-reports.R` does.

## What you need

- [Quarto](https://quarto.org/docs/get-started/) 1.4 or newer
- R with the packages `arrow`, `dplyr`, `ggplot2`, `scales`, `knitr`, `rmarkdown`,
  `jsonlite`, `tidyr` and `rnaturalearth` (with `rnaturalearthdata`) for the land on
  the maps
- Optional: `h3jsr`. With it, the maps draw the real hexagons; without it, they
  draw the center of each cell.

```r
install.packages(c("arrow", "dplyr", "ggplot2", "scales", "knitr", "rmarkdown",
                   "jsonlite", "tidyr", "rnaturalearth", "rnaturalearthdata", "h3jsr"))
```

## Change the report

Everything is in `report.qmd`, and each part is independent:

- **Remove an analysis:** delete its heading and chunks (for example everything
  under `# Depth`). Nothing else depends on it.
- **Skip an analysis without deleting it:** add `#| eval: false` at the top of its
  chunks.
- **Reorder:** move the sections around.
- **Missing results:** if a result file does not exist (for example you skipped
  the publication analyses), its charts are left out of the report.
- **Texts:** the title, subtitle and author are at the top of the file. The area
  name, period and dates come from `meta.json`.
- **Settings:** the first chunk (`settings`) has the folder with the data, the
  colors and the number of taxa in the table.
- **Charts:** they are plain [ggplot2](https://ggplot2.tidyverse.org) code.
- **Look of the page:** the options under `format: typst` set the paper size,
  margins, font size and font. `mainfont` is the font of the text; if it is not
  installed on your computer, Typst uses its default font. See the
  [Quarto Typst documentation](https://quarto.org/docs/output-formats/typst.html)
  for more options.

## Use other data

To report on another area, run `prepare-data.R` again with the new area and render
again. To keep several reports, write the results of each area to its own folder
(`output_dir` in `prepare-data.R`) and set `data_dir` in the first chunk of
`report.qmd` to that folder.
