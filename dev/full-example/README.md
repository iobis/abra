# Full example: from the OBIS data to a dashboard and a report

A complete demonstration of abra with three groups of taxa (corals, seagrass and
fishes) in the Mediterranean Sea. It is the analysis of
[`../example-r/example-eov-med.R`](../example-r/example-eov-med.R), but the results
are saved and shown in the [Svelte dashboard](../../dashboard) and in the
[Quarto report](../../quarto), one for each group.

```
01-prepare-data.R ──► dashboard/static/eov-med/<group>/*.parquet ──┬──► dashboard (a switch between the groups)
   (abra)                                                          └──► 02-render-reports.R ──► reports/<group>.pdf
```

| File | What it does |
|---|---|
| [`01-prepare-data.R`](01-prepare-data.R) | Defines the area and the groups (the same code as the example), runs the analyses with `run_analyses()` and saves the results. |
| [`02-render-reports.R`](02-render-reports.R) | Renders `quarto/report.qmd` once per group, and saves the PDFs in `reports/`. |

## Requirements

The same as the rest of the repository (see the [main README](../../README.md)): a
local copy of the OBIS open data, the R packages `robisdb` and `abra`, Node.js for
the dashboard and Quarto for the report. The script also uses `mregions2` (to get
the Mediterranean Sea).

## 1. Prepare the data

From the root of the repository:

```sh
Rscript dev/full-example/01-prepare-data.R
```

The path to the OBIS data is set at the top of the script, or with the environment
variable `OBIS_DATA`. Reading the OBIS data is the slow step (once per group; a few
minutes each). To keep the memory under control set `DUCKDB_MEMORY`, for example
`DUCKDB_MEMORY=8GB Rscript dev/full-example/01-prepare-data.R`.

It creates, in `dashboard/static/eov-med/`:

```
analyses.json        the list of groups: with it the dashboard shows a switch
corals/              one folder per group, with the same files that prepare-data.R
seagrass/            of the dashboard makes for one area (basic_stats.parquet,
fishes/              cells.parquet, ..., meta.json)
```

Take the arguments of `set_filters()` of each group, the area, the period and the
grid resolution from the top of the script to make it your own.

## 2. Open the dashboard

```sh
cd dashboard
npm install
VITE_DATA_PATH=eov-med npm run dev
```

Then open http://localhost:5173: the buttons under the title switch between the
groups (the address `?data=fishes` opens a group directly). `VITE_DATA_PATH` is the
folder of `static/` with the data; without it the dashboard shows the files of
`static/data`. To build the site (for example for GitHub Pages), use
`VITE_DATA_PATH=eov-med npm run build`.

## 3. Render the reports

```sh
Rscript dev/full-example/02-render-reports.R
```

The PDFs are saved in `dev/full-example/reports/` (`corals.pdf`, `seagrass.pdf` and
`fishes.pdf`). The report is the same one of the repository (`quarto/report.qmd`);
the folder with the data is set with its `data_dir` parameter:

```sh
cd quarto
quarto render report.qmd -P data_dir:../dashboard/static/eov-med/corals
```

(The script renders a temporary copy of the report, because Quarto deletes the
previous PDF of the document it renders.)

## Notes

- The generated files are not in the repository (the OBIS data is needed to make
  them). Commit `dashboard/static/eov-med` if you want to publish this dashboard.
- Observed richness follows sampling effort. Read the maps together with the number
  of records and the information metrics, as explained in the
  [main README](../../README.md#the-information-metric).
