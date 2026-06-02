.new_abra_obj <- function() {
    list(
        connection = list(
            con = NA,
            info = list(
                type = NA,
                start = NA
            )
        ),
        definers = list(
            area = NA,
            period = NA,
            depth = NA,
            query = NA,
            grid = NA
        ),
        log = NA
    )
}

.add_abra_log <- function(.obj, append) {
    if (is.na(.obj$log)) {
        .obj$log <- append
    } else {
        .obj$log <- c(.obj$log, append)
    }
    .obj
}

.new_abra_conn <- function(.obj) {
    class(.obj) <- c("abra_conn", class(.obj))
    return(.obj)
}

.cli_header <- function() {
    cli::cli_h1("{cli::symbol$pointer} OBIS-ABRA pipeline")
    return(invisible(NULL))
}

print.abra_conn <- function(.obj) {
    .cli_header()
    cli::cli_alert_info("Connection of type {.code {(.obj$connection$info$type)}}")
    return(invisible(NULL))
}

.new_abra_query <- function(.obj) {
    if (!inherits(.obj, "abra_query")) {
        class(.obj) <- c("abra_query", class(.obj))
    }
    return(.obj)
}

print.abra_query <- function(.obj) {
    .cli_header()
    cli::cli_alert_info("Connection of type {.code {(.obj$connection$info$type)}}")
    cli::cli_alert_info("Query:")
    tp <- lapply(seq_along(.obj$definers$query), \(id) {
        if (!is.null(.obj$definers$query[[id]][1])) {
            paste(names(.obj$definers$query)[id], "=", paste(unlist(.obj$definers$query[[id]]), collapse = ", "))
        } else {
            # paste(names(.obj$definers$query)[id], "= NOT SET")
            NULL
        }
    })
    tp <- unlist(tp, use.names = F)
    tp <- cli::col_grey(tp)
    names(tp) <- rep(" ", length(tp))
    cli::cli_bullets(tp)
    return(invisible(NULL))
}
