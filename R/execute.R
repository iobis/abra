.execute_call <- function(.obj) {
    stopifnot("Object should be of type abra_query" = inherits(.obj, "abra_query"))

    if (grepl("spg", .obj$connection$info$type)) {
        q <- parse_query(.obj$definers$query) |>
            .spg_query()
    } else if (grepl("open-data", .obj$connection$info$type)) {
        q <- parse_query(.obj$definers$query) |>
            .od_query()
    }

    if (grepl("spg|open-data", .obj$connection$info$type)) {
        if (!nzchar(q)) q <- "1=1"
        d <- DBI::dbGetQuery(
            .obj$connection$con,
            glue::glue("
            select *
            from obis
            where {q};
            ")
        )
    } else {
        qlist <- .obj$definers$query
        d <- robis::occurrence(
            taxonid = qlist$taxonid,
            scientificname = qlist$scientificname,
            datasetid = qlist$datasetid,
            nodeid = qlist$nodeid,
            instituteid = qlist$instituteid,
            geometry = qlist$geometry,
            startdate = qlist$date_start,
            enddate = qlist$date_end,
            startdepth = qlist$startdepth,
            enddepth = qlist$enddepth,
            flags = qlist$flags
        )
        d <- d |>
            dplyr::filter(!is.na(decimalLongitude) & !is.na(decimalLatitude))
        if (.obj$grid$type == "h3") {
            d$cell <- h3jsr::point_to_cell(d[,c("decimalLongitude", "decimalLatitude")], res = .obj$grid$resolution)
        }
    }
    class(d) <- c("abra_data", class(d))
    return(d)
}

parse_query <- function(query_list) {
    pcchar <- function(x) paste(paste0("'", x, "'"), collapse = ", ")
    as_clause <- function(field, value) {
        if (length(value) == 1) {
            paste(field, "=", pcchar(value))
        } else {
            paste0(field, " in (", pcchar(value), ")")
        }
    }
    # Fields that are handled the same way (equality/`in`) for every source;
    # names are the query_list keys, values are the canonical field names
    # that .spg_query()/.od_query() translate to their own schema.
    id_fields <- c(
        scientificname = "scientificName",
        taxonid = "taxonID",
        datasetid = "datasetID",
        nodeid = "nodeID",
        instituteid = "instituteID"
    )

    query_args <- lapply(names(id_fields), function(key) {
        value <- query_list[[key]]
        if (is.null(value)) return(NULL)
        as_clause(id_fields[[key]], value)
    })
    names(query_args) <- unname(id_fields)
    query_args[!vapply(query_args, is.null, logical(1))]
}

.spg_query <- function(query) {
    unsupported <- intersect(names(query), c("datasetID", "nodeID", "instituteID"))
    if (length(unsupported) > 0) {
        cli::cli_warn(paste(
            "speciesgrids is pre-aggregated across records and does not support",
            "filtering by", paste(unsupported, collapse = ", "), "- ignoring these filters."
        ))
        query[unsupported] <- NULL
    }

    gs <- \(x, from, to) gsub(from, to, x, fixed = TRUE)

    query <- vapply(query, \(clause) {
        clause |>
            gs("scientificName", "species") |>
            gs("taxonID", "AphiaID")
    }, character(1))

    paste(query, collapse = " and ")
}

.od_query <- function(query) {
    gs <- \(x, from, to) gsub(from, to, x, fixed = TRUE)

    if ("nodeID" %in% names(query)) {
        # node_ids is an array column in obis-open-data, so membership needs
        # a list operation rather than a simple `=`/`in` comparison
        vals <- regmatches(query[["nodeID"]], gregexpr("'[^']*'", query[["nodeID"]]))[[1]]
        query[["nodeID"]] <- glue::glue("len(list_intersect(node_ids, [{paste(vals, collapse = ', ')}])) > 0")
    }

    query <- vapply(query, \(clause) {
        clause |>
            gs("scientificName", "interpreted.scientificName") |>
            gs("taxonID", "interpreted.speciesid") |>
            gs("datasetID", "dataset_id") |>
            gs("instituteID", "interpreted.institutionID")
    }, character(1))

    # Recommended by the obis-open-data docs: excludes quality-dropped and
    # absence records, which are otherwise included in the raw export
    query <- c(query, "(dropped is not true)", "(absence is not true)")

    paste(query, collapse = " and ")
}

collect <- function(x) {
  UseMethod("collect", x)
}

collect.abra_query <- function(x) {
    .execute_call(x)
}

show_query <- function(.obj) {
    
}