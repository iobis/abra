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

# Native H3 resolution of the speciesgrids dataset - the finest resolution
# it can be queried at; coarser resolutions aggregate via h3_cell_to_parent().
.speciesgrids_h3_resolution <- 7L

#' Build the SELECT-list expression for a query's cell/grid column
#'
#' @param type the data product: `"open-data"`, `"speciesgrids"` or
#'   `"obistherm"` (see `.check_ds_type()`).
#' @param resolution the target H3 resolution.
#' @return a single string, e.g. `"h3_latlng_to_cell_string(...) as cell"`,
#'   to splice into the SQL template's `-- [start cell block]` marker.
#' @noRd
.build_h3_query <- function(type, resolution) {
    if (type == "speciesgrids") {
        if (resolution == .speciesgrids_h3_resolution) {
            "cell as cell"
        } else {
            glue::glue("h3_cell_to_parent(cell, {resolution}) as cell")
        }
    } else if (type == "open-data") {
        glue::glue("h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, {resolution}) as cell")
    } else if (type == "obistherm") {
        glue::glue("h3_latlng_to_cell_string(decimalLatitude, decimalLongitude, {resolution}) as cell")
    } else {
        .em("type not recognized for building h3 query")
    }
}

# Ranks that can be filtered with set_filters()
.filter_ranks <- c("kingdom", "phylum", "class", "order", "family", "genus", "species")

# OR-combined taxon conditions from a `filters` definer: the rank filters, the
# any-rank `scientificname` and the `taxonid`. `rank_prefix` is "interpreted." for the
# open-data and "" for speciesgrids (whose columns are not nested); `id_field` is the
# AphiaID column. Returns a single parenthesised string, or NULL if no taxon filter is set.
.taxon_conditions <- function(filters, rank_prefix, id_field, ds_type) {
    conds <- c()
    for (r in .filter_ranks) {
        if (!is.null(filters[[r]])) {
            conds <- c(conds, robisdb:::.sql_in(paste0(rank_prefix, '"', r, '"'), filters[[r]]))
        }
    }
    if (!is.null(filters$scientificname)) {
        if (ds_type == "open-data") {
            conds <- c(conds, robisdb:::.sql_taxon_match(filters$scientificname))
        } else {
            conds <- c(conds, vapply(.filter_ranks, \(r) robisdb:::.sql_in(paste0('"', r, '"'), filters$scientificname), character(1)))
        }
    }
    if (!is.null(filters$taxonid)) {
        if (!is.numeric(filters$taxonid)) .em("{.arg taxonid} should be numeric (AphiaID)")
        conds <- c(conds, robisdb:::.sql_in(id_field, filters$taxonid))
    }
    if (length(conds) == 0) return(NULL)
    paste0("(", paste(conds, collapse = " or "), ")")
}

#' Build the WHERE-clause conditions for a query
#'
#' Translates an `abra_query`'s `filters`/`period`/`depth`/`area` definers
#' into a single SQL WHERE-clause fragment, tailored to what the given data
#' product's schema actually supports; filters with no equivalent column for
#' that product are ignored with a warning rather than erroring.
#'
#' @param ds_type the data product: `"open-data"` or `"speciesgrids"` (see
#'   `.check_ds_type()`).
#' @param filters a list as stored in the `filters` definer (see
#'   [set_filters()]), or `list()` if unset.
#' @param period a list with `date_start`/`date_end` (see [set_period()]),
#'   or `list()` if unset.
#' @param depth a list with `startdepth`/`enddepth` (see [set_depth()]), or
#'   `list()` if unset.
#' @param area a WKT string (see [set_area()]), or `NULL` if unset.
#' @return a single string, to splice into the SQL template's
#'   `-- [start conditions]` marker.
#' @noRd
.build_filter_query <- function(ds_type, filters, period, depth, area) {
    if (ds_type == "open-data") {
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
        where_q <- c(where_q, .taxon_conditions(filters, "interpreted.", "interpreted.aphiaid", ds_type))

        paste(c("dropped is not true and absence is not true", where_q), collapse = " and ")
    } else if (ds_type == "speciesgrids") {
        unsupported <- c("datasetid", "nodeid", "instituteid", "flags")
        unsupported_used <- unsupported[!vapply(unsupported, function(f) is.null(filters[[f]]), logical(1))]
        if (length(unsupported_used) > 0) {
            .wm("Not available in speciesgrids, ignoring: {.field {unsupported_used}}")
        }
        if (!is.null(depth$startdepth) || !is.null(depth$enddepth)) {
            .wm("Depth filtering is not available in speciesgrids; ignoring")
        }
        if (!is.null(period$date_start) || !is.null(period$date_end)) {
            .wm("Date/period filtering is not available in speciesgrids (only {.field min_year}/{.field max_year} are stored); ignoring")
        }

        where_q <- c(.taxon_conditions(filters, "", "AphiaID", ds_type))
        if (!is.null(area)) {
            # h3_polygon_wkt_to_cells_string() returns nothing for MULTIPOLYGONs, so the
            # area is split into its polygons and the cell lists are concatenated
            parts <- sf::st_as_text(sf::st_cast(sf::st_as_sfc(area), "POLYGON"))
            cell_lists <- paste0(
                "h3_polygon_wkt_to_cells_string(", vapply(parts, robisdb:::.sql_quote, character(1)),
                ", ", .speciesgrids_h3_resolution, ")",
                collapse = ", "
            )
            where_q <- c(where_q, paste0("list_contains(flatten([", cell_lists, "]), cell)"))
        }

        if (length(where_q) > 0) paste(where_q, collapse = " and ") else "true"
    } else {
        .em("type not recognized for building filter query")
    }
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

# Replace the lines of `sq` between the `-- [start <name>]` and
# `-- [end <name>]` markers (inclusive) with `new`, whatever their lengths.
.replace_block <- function(sq, name, new) {
    start <- grep(paste("start", name), sq)[1]
    end <- grep(paste("end", name), sq)[1]
    c(sq[seq_len(start - 1)], new, sq[seq_len(length(sq) - end) + end])
}

#' Build the full SQL for a query, with all `set_*()` substitutions applied
#'
#' Shared by [run_query()] and [print_sql()], so the SQL that gets printed
#' is always exactly what would be executed.
#'
#' @inheritParams run_query
#' @return the substituted SQL template, as a character vector (one element
#'   per line).
#' @noRd
.build_query_sql <- function(abra_query, sql_file, sql_folder = NULL, precomputed = .active_precomputed(abra_query)) {
    ds_type <- .check_ds_type(abra_query)

    if (ds_type == "obistherm") {
        .em("`obistherm` is not supported by {.fn run_query} yet")
    } else if (!ds_type %in% c("open-data", "speciesgrids")) {
        .em("Connection type not recognized.")
    }

    definers <- attr(abra_query, "abra_query")$definers
    if (identical(definers$grid, NA)) {
        .em("A grid should be set with {.fn set_grid} before running a query")
    }
    if (ds_type == "speciesgrids" && definers$resolution > .speciesgrids_h3_resolution) {
        .em("speciesgrids is pre-aggregated at H3 resolution {.speciesgrids_h3_resolution}; the grid resolution cannot be finer than that")
    }

    if (is.null(sql_folder)) {
        sql_folder <- "sql"
    }
    # templates live in one subfolder per data product (sql/open-data, sql/speciesgrids);
    # a folder holding the .sql files directly is also accepted
    if (dir.exists(file.path(sql_folder, ds_type))) {
        sql_folder <- file.path(sql_folder, ds_type)
    }
    if (!dir.exists(sql_folder) || length(list.files(sql_folder, pattern = "\\.sql$")) < 1) {
        .em("Folder {.path {sql_folder}} does not exist or is empty.")
    }

    sql_folder_content <- list.files(sql_folder, pattern = "\\.sql$")

    sql_folder_files <- gsub("\\.sql", "", sql_folder_content)

    if (!sql_file %in% sql_folder_files) {
        .em("SQL file {.emph '{sql_file}'} not found in {.path {sql_folder}}")
    }

    sq <- readLines(file.path(sql_folder, paste0(sql_file, ".sql")), warn = FALSE)

    filters <- if (identical(definers$filters, NA)) list() else definers$filters
    period <- if (identical(definers$period, NA)) list() else definers$period
    depth <- if (identical(definers$depth, NA)) list() else definers$depth
    area <- if (identical(definers$area, NA)) NULL else definers$area

    cell_type <- definers$grid
    cell_resolution <- definers$resolution

    if (any(grepl("start cell block", sq))) {
        if (cell_type == "h3") {
            cell_block <- c(
                "-- [start cell block]",
                .build_h3_query(ds_type, cell_resolution),
                "-- [end cell block]"
            )
            sq <- .replace_block(sq, "cell block", cell_block)
        } else if (cell_type == "a5") {
            # TODO!!!
            cell_block <- c(
                "-- [start cell block]",
                glue::glue(
            "h3_latlng_to_cell(interpreted.decimalLatitude, interpreted.decimalLongitude, {cell_resolution}) as cell"
                ),
                "-- [end cell block]"
            )
            sq <- .replace_block(sq, "cell block", cell_block)
        } else if (cell_type == "geoHash") {
            .em("Cell type not implemented yet")
        } else {
            .em("Cell type not recognized")
        }
    }

    if (any(grepl("start taxon block", sq)) && !identical(definers$taxonomic_level, NA)) {
        sq <- .replace_block(sq, "taxon block", c(
            "-- [start taxon block]",
            paste0("interpreted.", definers$taxonomic_level, " as taxon,"),
            "-- [end taxon block]"
        ))
    }

    if (any(grepl("start depth band block", sq)) && !identical(definers$depth_bands, NA)) {
        sq <- .replace_block(sq, "depth band block", c(
            "-- [start depth band block]",
            .build_depth_band_query(definers$depth_bands),
            "-- [end depth band block]"
        ))
    }

    if (is.null(precomputed)) {
        conditions <- .build_filter_query(ds_type, filters, period, depth, area)
    } else {
        # area, period, depth and filters were applied by pre_compute(): read the table instead
        conditions <- "true"
        sq <- gsub("\\bfrom\\s+obis\\b", paste("from", precomputed), sq, perl = TRUE)
    }
    sq <- .replace_block(sq, "conditions", c(
        "-- [start conditions]", conditions, "-- [end conditions]"
    ))

    sq
}

# SQL keywords colored by .highlight_sql(). Single words only (multi-word
# keywords like "group by" still highlight correctly as two adjacent tokens).
.sql_keywords <- c(
    "select", "from", "where", "group", "by", "order", "as", "and", "or", "not",
    "in", "is", "null", "true", "false", "distinct", "count", "sum", "avg", "min",
    "max", "case", "when", "then", "else", "end", "union", "join", "on", "having",
    "limit", "with", "create", "table", "insert", "into", "values", "left",
    "right", "inner", "outer", "asc", "desc", "exists", "between", "install",
    "load", "drop", "unnest"
)

# Grid-function names highlighted separately from generic keywords by
# .highlight_sql(), since they're the H3/A5 cell-indexing calls readers
# scanning the SQL most want to spot.
.sql_functions <- c("h3_latlng_to_cell_string", "a5_lonlat_to_cell")

#' Colorize SQL for terminal output
#'
#' A lightweight, regex-based SQL highlighter: comments, string literals,
#' numbers, grid functions and keywords each get their own color via
#' `cli::col_*()`, which already no-op on terminals/outputs without ANSI
#' color support - so this is always safe to call.
#'
#' @param sq a character vector of SQL, one element per line.
#' @return `sq`, with ANSI color codes inserted.
#' @noRd
.highlight_sql <- function(sq) {
    kw <- paste(.sql_keywords, collapse = "|")
    fn <- paste(.sql_functions, collapse = "|")
    pattern <- sprintf(
        "(--.*$)|('(?:[^']|'')*')|(\\b\\d+(?:\\.\\d+)?\\b)|(?i:\\b(?:%s)\\b)|(?i:(?<!\\.)\\b(?:%s)\\b)",
        fn, kw
    )

    vapply(sq, function(line) {
        m <- gregexpr(pattern, line, perl = TRUE)[[1]]
        if (m[1] == -1) return(line)

        starts <- as.integer(m)
        lens <- attr(m, "match.length")

        out <- character(0)
        pos <- 1L
        for (i in seq_along(starts)) {
            start <- starts[i]
            len <- lens[i]
            if (start > pos) out <- c(out, substr(line, pos, start - 1))

            token <- substr(line, start, start + len - 1)
            styled <- if (startsWith(token, "--")) {
                cli::col_silver(token)
            } else if (startsWith(token, "'")) {
                cli::col_green(token)
            } else if (grepl("^\\d+(\\.\\d+)?$", token)) {
                cli::col_yellow(token)
            } else if (tolower(token) %in% tolower(.sql_functions)) {
                cli::col_magenta(token)
            } else {
                cli::col_cyan(token)
            }
            out <- c(out, styled)
            pos <- start + len
        }
        if (pos <= nchar(line)) out <- c(out, substr(line, pos, nchar(line)))
        paste(out, collapse = "")
    }, character(1), USE.NAMES = FALSE)
}

#' Print the SQL a query would run, without executing it
#'
#' Builds exactly the same SQL that [run_query()] would execute for
#' `abra_query` and `sql_file` - with the query's
#' area/period/depth/filters/grid already substituted in - and prints it,
#' without running it against the database. On terminals that support ANSI
#' colors, the printed SQL is syntax-highlighted; the returned string is
#' always plain (uncolored) SQL.
#'
#' @inheritParams run_query
#' @param drop_comments logical. Strip `-- comment` lines from the printed/
#'   returned SQL?
#' @return the SQL, invisibly, as a single (uncolored) string.
#' @export
#' @examples
#' \dontrun{
#' con |>
#'   set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
#'   set_grid(grid_type = "h3", resolution = 5) |>
#'   print_sql("basic-metrics")
#' }
print_sql <- function(abra_query, sql_file, sql_folder = "sql/open-data", drop_comments = TRUE, long_geom = FALSE) {
    if (!.is_abra_query(abra_query)) {
        .em("{.arg abra_query} should be an `abra_query` object; build one with the `set_*` functions")
    }

    if (!long_geom) {
        area <- attr(abra_query, "abra_query")$definers$area
        if (is.character(area) && nchar(area) > 30) {
            attr(abra_query, "abra_query")$definers$area <- "[big geometry object]"
        }
    }

    sq <- .build_query_sql(abra_query, sql_file, sql_folder)
    if (drop_comments) sq <- sq[!grepl("-- ", sq)]
    sql <- paste(sq, collapse = "\n")

    cat(paste(.highlight_sql(sq), collapse = "\n"), "\n")

    return(invisible(sql))
}
