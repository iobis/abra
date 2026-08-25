all_sql <- list.files("sql")

repo <- "iobis/abra"

null_if_empty <- function(x) {
    if (length(x) < 1) {
        NULL
    } else {
        x
    }
}

files_content <- lapply(all_sql, \(f) {
    content <- readLines(file.path("sql", f), warn = FALSE)
    list(
        local_file = f,
        remote_file = glue::glue(
            "https://raw.githubusercontent.com/{repo}/refs/heads/main/sql/{f}"
        ),
        version = gsub("-- version: ", "", content[grepl("-- version", content)]) |> null_if_empty(),
        target = gsub("-- target: ", "", content[grepl("-- target", content)]) |> null_if_empty(),
        objective = gsub("-- objective: ", "", content[grepl("-- objective", content)]) |> null_if_empty()
    )
})

jsonlite::write_json(files_content, "sql-files.json", pretty = TRUE)
