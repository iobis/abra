#' Check if an object is a `robisdb` connection
#'
#' @param .obj an object to test.
#' @return a logical.
#' @noRd
.is_robisdb_conn <- function(.obj) {
    inherits(.obj, "robisdb_conn")
}

#' Check if an object is an `abra_query`
#'
#' @param .obj an object to test.
#' @return a logical.
#' @noRd
.is_abra_query <- function(.obj) {
    inherits(.obj, "abra_query")
}

#' Promote a `robisdb` connection to an `abra_query`, if needed
#'
#' Used at the start of every `set_*()` function so that the first call in a
#' chain can be given either a bare `robisdb_conn` or an existing
#' `abra_query`.
#'
#' @param .obj a `robisdb_conn` or `abra_query` object.
#' @return an `abra_query` object.
#' @noRd
.make_if_not <- function(.obj) {
    if (!.is_abra_query(.obj)) {
        if (!.is_robisdb_conn(.obj)) {
            .em(".obj should be of an robisdb connection")
        } else {
            .obj <- .new_abra_query(.obj)
        }
    }
    return(.obj)
}

#' Build the default `abra_query` attribute structure
#'
#' @return a list with `definers` (area, period, depth, filters, grid,
#'   resolution, all unset) and `details` (query, version, both unset) slots.
#' @noRd
.new_abra_obj <- function() {
    list(
        definers = list(
            area = NA,
            period = NA,
            depth = NA,
            depth_bands = NA,
            taxonomic_level = NA,
            filters = NA,
            grid = NA,
            resolution = NA
        ),
        details = list(
            query = NA,
            version = NA,
            precomputed = NA
        )
    )
}

#' Tag an object as an `abra_query`
#'
#' Prepends the `abra_query` class and attaches a fresh `abra_query`
#' attribute (see `.new_abra_obj()`) if `.obj` isn't already one.
#'
#' @param .obj a `robisdb_conn` object.
#' @return `.obj`, classed as `abra_query`.
#' @noRd
.new_abra_query <- function(.obj) {
    if (!.is_abra_query(.obj)) {
        class(.obj) <- c("abra_query", class(.obj))
        attr(.obj, "abra_query") <- .new_abra_obj()
    }
    return(.obj)
}

#' Update the `abra_query` attribute of an object
#'
#' Merges `definers` and/or `details` into the object's existing
#' `abra_query` attribute, leaving anything not named in `definers`/`details`
#' untouched. Used by every `set_*()` function and by the analysis functions.
#'
#' @param .obj an `abra_query` or `abra_query_result` object.
#' @param definers a named list of `definers` entries to update, or `NULL`.
#' @param details a named list of `details` entries to update, or `NULL`.
#' @return `.obj`, with its `abra_query` attribute updated.
#' @noRd
.change_abra_obj <- function(.obj, definers = NULL, details = NULL) {
    if (!.is_abra_query(.obj)) {
        if (!inherits(.obj, "abra_query_result")) .em(".obj is not of class `abra_query`")
    }
    original <- attr(.obj, "abra_query")
    if (!is.null(definers)) {
        original$definers <- utils::modifyList(original$definers, definers)
    }
    if (!is.null(details)) {
        original$details <- utils::modifyList(original$details, details)
    }
    attr(.obj, "abra_query") <- original
    return(.obj)
}

#' Tag an object as an `abra_query_result`
#'
#' Used by the analysis functions to wrap the data returned from the database,
#' carrying forward the `definers`/`details` that produced it (see
#' `.change_abra_obj()`) for provenance and for [print.abra_query_result()].
#'
#' @param .obj the raw query result (a data frame or tibble).
#' @return `.obj`, classed as `abra_query_result` with a fresh `abra_query`
#'   attribute (to be filled in by the caller via `.change_abra_obj()`).
#' @noRd
.new_abra_query_result <- function(.obj) {
    class(.obj) <- c("abra_query_result", class(.obj))
    attr(.obj, "abra_query") <- .new_abra_obj()
    return(.obj)
}

#' Summarise the definers of a query as printable lines
#'
#' Shared by the print methods. Only the definers that were set are listed.
#'
#' @param definers the `definers` list of an `abra_query` attribute.
#' @return a named character vector (name = label, value = description).
#' @noRd
.definers_lines <- function(definers) {
    lines <- character(0)
    is_set <- function(x) !identical(x, NA)

    if (is_set(definers$area)) {
        area <- definers$area
        if (nchar(area) > 60) area <- paste0(substr(area, 1, 57), "...")
        lines["Area"] <- area
    }

    if (is_set(definers$period)) {
        lines["Period"] <- paste0(
            "start = ", definers$period$date_start %||% "not set",
            ", end = ", definers$period$date_end %||% "not set"
        )
    }

    if (is_set(definers$depth)) {
        lines["Depth"] <- paste0(
            "start = ", definers$depth$startdepth %||% "not set",
            ", end = ", definers$depth$enddepth %||% "not set"
        )
    }

    if (is_set(definers$depth_bands)) {
        lines["Depth bands"] <- paste(definers$depth_bands, collapse = ", ")
    }

    if (is_set(definers$filters)) {
        active_filters <- definers$filters[!vapply(definers$filters, is.null, logical(1))]
        if (length(active_filters) > 0) {
            lines["Filters"] <- paste(names(active_filters), vapply(active_filters, paste, character(1), collapse = "/"), sep = " = ", collapse = ", ")
        }
    }

    if (is_set(definers$taxonomic_level)) {
        lines["Taxonomic level"] <- definers$taxonomic_level
    }

    if (is_set(definers$grid)) {
        lines["Grid"] <- paste0(definers$grid, " (resolution ", definers$resolution, ")")
    }

    lines
}

#' Print the lines of `.definers_lines()` as `cli` bullets
#'
#' @param lines a named character vector, see `.definers_lines()`.
#' @noRd
.print_lines <- function(lines) {
    if (length(lines) == 0) {
        cli::cli_bullets(c("!" = "No parameters set yet"))
    } else {
        # the values are passed as data (not as part of the template), so braces in
        # them (e.g. in a WKT string) are not interpreted by cli
        bullets <- paste0("{.strong ", names(lines), "}: {cli::col_grey(lines[", seq_along(lines), "])}")
        names(bullets) <- rep("*", length(bullets))
        cli::cli_bullets(bullets)
    }
}

#' Print an `abra_query` object
#'
#' Prints the underlying `robisdb` connection details (via [NextMethod()]),
#' followed by a summary of whichever area/period/depth/filters/grid have
#' been set so far on the query.
#'
#' @param x an `abra_query` object.
#' @param ... further arguments passed to or from other methods (unused).
#' @return `x`, invisibly.
#' @export
print.abra_query <- function(x, ...) {
    NextMethod()
    cli::cat_line()
    cli::cat_line()
    cli::cli_h2("Statement details")

    lines <- .definers_lines(attr(x, "abra_query")$definers)

    pc <- attr(x, "abra_query")$details$precomputed
    if (is.list(pc)) {
        lines["Pre-computed"] <- pc$table
    }

    .print_lines(lines)

    return(invisible(x))
}

#' Print an `abra_query_result` object
#'
#' Prints a summary of the area/period/depth/filters/grid that produced the
#' result, followed by the data itself (via [NextMethod()]).
#'
#' @param x an `abra_query_result` object, as returned by an analysis function (e.g. [basic_stats()]).
#' @param ... further arguments passed to or from other methods (unused).
#' @return `x`, invisibly.
#' @export
print.abra_query_result <- function(x, ...) {
    .print_lines(.definers_lines(attr(x, "abra_query")$definers))

    NextMethod()

    return(invisible(x))
}

#' Print an `abra_query_result_list` object
#'
#' Prints the names of the results in the list, and a summary of the
#' area/period/depth/filters/grid that produced them.
#'
#' @param x an `abra_query_result_list` object, as returned by [run_analyses()].
#' @param ... further arguments passed to or from other methods (unused).
#' @return `x`, invisibly.
#' @export
print.abra_query_result_list <- function(x, ...) {

    cli::cli_h2(paste("abra_query_result list containing", length(x), "results"))
    cli::cat_line(paste("Access each result by its name:"))
    to_print <- names(x)
    names(to_print) <- rep("*", length(to_print))
    cli::cli_bullets(to_print)
    cli::cat_line()
    cli::cat_line("Query details")

    .print_lines(.definers_lines(attr(x[[1]], "abra_query")$definers))

    return(invisible(x))
}
