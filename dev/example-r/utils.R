install_if_not <- function(pkg) {
  pk <- requireNamespace(pkg, quietly = TRUE)
  if (!pk) {
    pak::pkg_install(paste0("iobis/", pkg))
  }
  return(invisible(NULL))
}

load_settings <- function() {
    s <- yaml::read_yaml("settings.yml", readLines.warn = FALSE)
    names(s) <- gsub("-", "_", names(s))
    s
}

download_dataset_info <- function() {
  tf <- "dataset_info.parquet"
  if (file.exists(tf)) {
    arrow::read_parquet(tf)
  } else {
    ds <- robis::dataset()
    ds <- ds[,c("id", "published", "created", "updated", "core", "extensions", "extent", "statistics", "records")]
    arrow::write_parquet(ds, tf)
    ds
  }
}

sni <- function(name) {
  file.path(settings$images_folder, paste0(name, ".png"))
}