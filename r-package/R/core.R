#' Arguments shared by the analysis functions
#'
#' @param query an `abra_query` object: a `robisdb` open-data connection with
#'   the area, period, depth, filters and grid set through the `set_*()`
#'   functions, optionally pre-computed with [pre_compute()].
#' @param by_cell logical. Return one row per grid cell (see [set_grid()]) instead
#'   of a single result for the whole area?
#' @param verbose logical. Print the SQL before running it?
#' @name analysis_args
#' @keywords internal
NULL

# Checks that `query` is an abra_query on the open-data product (the only one
# supported by the analysis functions for now)
.check_open_data <- function(query) {
    if (!.is_abra_query(query)) {
        .em("{.arg query} should be an `abra_query` object; build one with the `set_*` functions")
    }
    ds_type <- .check_ds_type(query)
    if (ds_type != "open-data") {
        .em("The analyses are only available for the {.val open-data} product for now, but this connection is {.val {ds_type}}")
    }
    invisible(ds_type)
}

# Promotes a bare robisdb connection to an abra_query and checks it is open-data
.as_query <- function(query) {
    query <- .make_if_not(query)
    .check_open_data(query)
    query
}

# Extension columns of the `obis` table that tell if a record has an eMoF or a DNA
# derived data extension
.emof_term <- "http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact"
.dna_term <- "http://rs.gbif.org/terms/1.0/DNADerivedData"
.extension_flag <- function(term) sprintf('len(extensions."%s") > 0', term)

# Fields of the `interpreted` struct that the analyses use. pre_compute() keeps only
# these: copying the whole struct (dozens of text fields) is much slower and larger.
# Add a field here if an analysis starts to use a new one.
.interpreted_fields <- c(
    "kingdom", "phylum", "class", "order", "family", "genus", "species", "aphiaid",
    "redlist_category", "date_year", "date_mid",
    "decimalLatitude", "decimalLongitude",
    "minimumDepthInMeters", "maximumDepthInMeters"
)

# SQL expression building a slim `interpreted` struct with `.interpreted_fields`
.slim_interpreted <- function() {
    paste0(
        "struct_pack(",
        paste0('"', .interpreted_fields, '" := interpreted."', .interpreted_fields, '"', collapse = ", "),
        ")"
    )
}

# Table to read the records from, the condition to apply to them and the expressions
# that tell if a record has the eMoF or the DNA extension: the pre-computed table
# (conditions already applied; it only keeps the columns used by the analyses) or the
# full `obis` table
.analysis_source <- function(query) {
    .check_open_data(query)
    pc <- .active_precomputed(query)
    if (!is.null(pc)) {
        list(table = pc, where = "true", has_emof = "has_emof", has_dna = "has_dna")
    } else {
        list(
            table = "obis", where = .query_conditions(query),
            has_emof = .extension_flag(.emof_term), has_dna = .extension_flag(.dna_term)
        )
    }
}

# H3 cell expression for the grid of the query
.cell_expr <- function(query) {
    definers <- attr(query, "abra_query")$definers
    if (identical(definers$grid, NA)) {
        .em("A grid should be set with {.fn set_grid} for this analysis")
    }
    if (definers$grid != "h3") {
        .em("Only the {.val h3} grid is implemented for the analyses, not {.val {definers$grid}}")
    }
    glue::glue("h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, {definers$resolution})")
}

# Pieces of a SQL for results grouped by cell or dataset (or not grouped). Each piece
# ends with a comma, to be placed before other columns: `sel` in the select list,
# `grp` after "group by" and `ord` after "order by". `col` is the column name.
.group_spec <- function(query, by = NULL) {
    if (is.null(by)) {
        return(list(sel = "", grp = "", ord = "", col = NULL, where = ""))
    }
    if (by == "dataset") {
        return(list(sel = "dataset_id,", grp = "dataset_id,", ord = "dataset_id,", col = "dataset_id", where = ""))
    }
    list(
        sel = paste0(.cell_expr(query), " as cell,"),
        grp = "cell,", ord = "cell,", col = "cell",
        # records without coordinates cannot be placed in a cell
        where = "and interpreted.decimalLatitude is not null and interpreted.decimalLongitude is not null"
    )
}

# `by` argument of a function with a `by_cell` flag
.by_cell <- function(by_cell) if (isTRUE(by_cell)) "cell" else NULL

# Errors if the dataset_info table (see add_dataset_info()) is missing
.check_dataset_info <- function(query) {
    if (!DBI::dbExistsTable(query$connection, "dataset_info")) {
        .em("The table {.field dataset_info} is needed for this analysis, create it with {.fn add_dataset_info}")
    }
}

# Publication year of the datasets, from `dataset_info`: `created`, falling back to `published`
.dataset_year_sql <- function() {
    "select
        id as dataset_id,
        extract(year from coalesce(
            try_cast(created as timestamp),
            try_cast(published as timestamp)
        ))::int as pub_year
    from dataset_info"
}

# Installs and loads the H3 extension (dbExecute, so no open result set is left behind)
.install_h3 <- function(query) {
    DBI::dbExecute(query$connection, "install h3 from community; load h3;")
    invisible(query)
}

# Runs a SQL (glue string) for an analysis and wraps the result as an abra_query_result
.run_analysis <- function(query, name, sql, verbose = FALSE) {
    sql <- as.character(sql)
    .install_h3(query)
    if (verbose) cat(sql, "\n\n")

    result <- robisdb::get_query(query, sql)

    result |>
        tibble::as_tibble() |>
        .new_abra_query_result() |>
        .change_abra_obj(
            definers = attr(query, "abra_query")$definers,
            details = list(query = name, version = NA)
        )
}
