#' Abort with a `cli`-formatted message
#'
#' Alias for [cli::cli_abort()], used throughout the package for error
#' messages.
#' @noRd
.em <- cli::cli_abort

#' Warn with a `cli`-formatted message
#'
#' Alias for [cli::cli_warn()], used throughout the package for warnings
#' (e.g. unsupported filters being ignored).
#' @noRd
.wm <- cli::cli_warn

#' Determine which OBIS data product a connection points to
#'
#' Reads `connection$details$type` (set by `robisdb::connect*()`) and maps
#' it to one of `"open-data"`, `"speciesgrids"` or `"obistherm"`, regardless
#' of whether the connection is local or S3-streamed. Warns if an
#' `open-data` connection is streamed from S3 rather than a local copy.
#'
#' @param connection a `robisdb_conn` (or `abra_query`) object.
#' @return a string: `"open-data"`, `"speciesgrids"` or `"obistherm"`.
#' @noRd
.check_ds_type <- function(connection) {
    if (!.is_robisdb_conn(connection)) .em(".obj should be of an robisdb connection")

    con_type <- connection$details$type

    if (grepl("open-data", con_type)) {
        ds_type <- "open-data"
        if (!grepl("local", con_type)) {
            .wm("This is a connection with the OBIS open data, but you are using the S3 connection. This is not
                 recommended and analysis will be very slow. 
                 Sync a local copy instead using {.fun robisdb::sync_opendata}")
        }
    } else if (grepl("speciesgrids", con_type)) {
        ds_type <- "speciesgrids"
    } else if (grepl("obistherm", con_type)) {
        ds_type <- "obistherm"
    } else {
        .em("Connection type not recognized")
    }

    return(ds_type)
}

# Ranks that can be filtered with set_filters()
.filter_ranks <- c("kingdom", "phylum", "class", "order", "family", "genus", "species")

#' Taxon conditions of a query
#'
#' OR-combines the rank filters, the any-rank `scientificname` and the `taxonid`
#' of a `filters` definer (see [set_filters()]).
#'
#' @param filters the `filters` definer, or `list()` if unset.
#' @return a single parenthesised string, or `NULL` if no taxon filter is set.
#' @noRd
.taxon_conditions <- function(filters) {
    conds <- c()
    for (r in .filter_ranks) {
        if (!is.null(filters[[r]])) {
            conds <- c(conds, robisdb:::.sql_in(paste0('interpreted."', r, '"'), filters[[r]]))
        }
    }
    if (!is.null(filters$scientificname)) {
        conds <- c(conds, robisdb:::.sql_taxon_match(filters$scientificname))
    }
    if (!is.null(filters$taxonid)) {
        if (!is.numeric(filters$taxonid)) .em("{.arg taxonid} should be numeric (AphiaID)")
        conds <- c(conds, robisdb:::.sql_in("interpreted.aphiaid", filters$taxonid))
    }
    if (length(conds) == 0) return(NULL)
    paste0("(", paste(conds, collapse = " or "), ")")
}

#' Build the WHERE-clause conditions of a query
#'
#' Translates the `filters`/`period`/`depth`/`area` definers of an `abra_query`
#' into a single SQL condition on the `obis` table, always excluding dropped
#' records and absences.
#'
#' @param abra_query an `abra_query` object.
#' @return a single string.
#' @noRd
.query_conditions <- function(abra_query) {
    definers <- attr(abra_query, "abra_query")$definers
    filters <- if (identical(definers$filters, NA)) list() else definers$filters
    period <- if (identical(definers$period, NA)) list() else definers$period
    depth <- if (identical(definers$depth, NA)) list() else definers$depth
    area <- if (identical(definers$area, NA)) NULL else definers$area

    if (!is.null(filters$instituteid)) {
        .wm("{.field instituteid} is not available in the open-data dataset; ignoring")
    }

    where_q <- robisdb:::.sql_common_filters(
        datasetid = filters$datasetid,
        nodeid = filters$nodeid,
        startdate = period$date_start,
        enddate = period$date_end,
        startdepth = depth$startdepth,
        enddepth = depth$enddepth,
        geometry = area,
        flags = filters$flags
    )
    where_q <- c(where_q, .taxon_conditions(filters))

    paste(c("dropped is not true and absence is not true", where_q), collapse = " and ")
}

# SQL CASE expression classifying `depth_m` into the bands delimited by
# `breaks` (see set_depth_bands()), as a `depth_band` column.
.build_depth_band_query <- function(breaks) {
    n <- length(breaks)
    fmt <- function(x) format(x, scientific = FALSE, trim = TRUE)
    whens <- c(
        "when depth_m is null then 'Unknown'",
        sprintf("when depth_m < %s then '<%s'", fmt(breaks[1]), fmt(breaks[1]))
    )
    for (i in seq_len(n - 1)) {
        if (is.infinite(breaks[i + 1])) {
            whens <- c(whens, sprintf("when depth_m >= %s then '%s+'", fmt(breaks[i]), fmt(breaks[i])))
        } else {
            whens <- c(whens, sprintf(
                "when depth_m >= %s and depth_m < %s then '%s-%s'",
                fmt(breaks[i]), fmt(breaks[i + 1]), fmt(breaks[i]), fmt(breaks[i + 1])
            ))
        }
    }
    last <- if (is.finite(breaks[n])) sprintf("else '%s+'", fmt(breaks[n])) else NULL
    paste(c("case", whens, last, "end as depth_band"), collapse = "\n")
}
