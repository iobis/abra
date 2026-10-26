#' Download the abra SQL templates
#'
#' Downloads every SQL template listed in the package's `sql-files.json`
#' manifest (each entry gives a `local_file` name and the `remote_file` URL
#' to fetch it from) into a local folder, for use with [run_query()].
#'
#' @param local_folder the folder to download the `.sql` files into.
#'   Defaults to `"sql"` (relative to the working directory), created if it
#'   doesn't already exist.
#' @param warn logical. If `TRUE` and running interactively, ask for
#'   confirmation before overwriting a non-empty `local_folder`.
#' @return `NULL`, invisibly. Called for the side effect of downloading
#'   files; a message lists any downloads that failed.
#' @export
#' @examples
#' \dontrun{
#' sync_sql_files("sql")
#' }
sync_sql_files <- function(local_folder = "sql", warn = TRUE) {
    fs::dir_create(local_folder)

    if (length(list.files(local_folder)) > 0) {
        if (warn && interactive()) {
            answer <- readline("Folder is not empty and files might be overwritten, proceed? Y/N\n")
            if (tolower(answer) %in% c("n", "no", "not")) {
                cat("Stopped, no files were synced.")
                return(invisible(NULL))
            }
        }
    }

    manifest <- jsonlite::read_json("sql-files.json")

    result <- lapply(manifest, \(x) {
        message("Downloading ", x$local_file)
        fs::dir_create(dirname(file.path(local_folder, x$local_file)))
        dr <- try(download.file(
            x$remote_file, file.path(local_folder, x$local_file)
        ))
        if (inherits(dr, "try-error")) {
            paste0("failed|", x$remote_file)
        } else {
            "ok"
        }
    })
    result <- unlist(result, use.names = FALSE)

    if (any(grepl("failed", result))) {
        message("The following files failed. Try again.")
        result <- gsub("failed\\|", "", result[grepl("failed", result)])
        cat(paste(result, collapse = "\n"))
    }

    return(invisible(NULL))
}