# Full example, step 3: one PDF report per group
#
# Renders `quarto/report.qmd` once for each group prepared by `01-prepare-data.R`
# (the report takes the folder of the data as a parameter) and saves the PDFs in
# `dev/full-example/reports/`.
#
# Run it from the root of the repository:
#
#   Rscript dev/full-example/02-render-reports.R
#
# Needs Quarto (https://quarto.org) and the R packages used by the report (see
# quarto/README.md).

data_root <- Sys.getenv("EOV_OUTPUT", "dashboard/static/eov-med")
reports_dir <- "dev/full-example/reports"
dir.create(reports_dir, showWarnings = FALSE, recursive = TRUE)

groups <- jsonlite::read_json(file.path(data_root, "analyses.json"), simplifyVector = TRUE)

# The report is rendered from a temporary copy, so the files of `quarto/` (e.g. its
# own report.pdf) are left alone: Quarto removes the previous output of a document
work_dir <- tempfile("report-")
dir.create(work_dir)
file.copy("quarto/report.qmd", work_dir)
reports_dir <- normalizePath(reports_dir)
data_root <- normalizePath(data_root)

old_wd <- setwd(work_dir)
for (id in groups$id) {
    message("Rendering the report of ", id)
    status <- system2("quarto", c(
        "render", "report.qmd",
        "--output", paste0(id, ".pdf"),
        "-P", paste0("data_dir:", file.path(data_root, id))
    ))
    if (status != 0) stop("quarto failed for ", id)
    file.copy(paste0(id, ".pdf"), file.path(reports_dir, paste0(id, ".pdf")), overwrite = TRUE)
}
setwd(old_wd)

message("Done. Reports in ", normalizePath(reports_dir))
