source("R/utils.R")
source("R/functions.R")
for (pkg in c("robisdb", "obisrecipes")) install_if_not(pkg)

library(robisdb)
library(obisrecipes)
library(glue)
library(dplyr)
library(ggplot2)
library(jsonlite)
library(patchwork)
sf::sf_use_s2(FALSE)
settings <- load_settings()
fs::dir_create(settings$output_folder)
main_blue <- "#113b9f"
cell_type <- "h3"
cell_res <- 4

con <- connect_opendata_local(settings$export_path)
con |> install_h3()
con |> install_a5()

# Run analyses

# Basic metrics
m1 <- run_metrics("sql/basic-metrics.sql")
plot_metric(m1, "n_records", trans = "log10", name = "Number of records", map_type = "blank")
plot_across(m1, cell_type, cell_res, which_log = c("n_records", "n_species", "n_genus", "n_family"))

# Extensions
m2 <- run_metrics("sql/extensions.sql")
plot_metric(m2, "n_records_dna", trans = "log10", name = "Number of records", map_type = "blank")
plot_across(m2, cell_type, cell_res,
            which_log = c("n_records_dna", "n_records_emof"),
            titles = c(
                "Number of datasets with DNA extension",
                "Number of datasets with eMoF extension",
                "Number of records with DNA extension",
                "Number of records with eMoF extension"
            ))