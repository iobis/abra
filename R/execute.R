.execute_call <- function(.obj) {
    stopifnot("Object should be of type abra_query" = inherits(.obj, "abra_query"))

    if (grepl("spg", .obj$connection$info$type)) {
        q <- parse_query(.obj$definers$query) |>
            .spg_query(q)
    } else if (grepl("open-data", .obj$connection$info$type)) {
        q <- parse_query(.obj$definers$query) |>
            .od_query(q)
    }

    if (grepl("spg|open-data", .obj$connection$info$type)) {
        DBI::dbGetQuery(
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
    return(d)
}

parse_query <- function(query_list) {
    nams <- names(query_list)
    pcchar <- function(x) paste(paste0("'", x, "'"), collapse = ", ")
    query_args <- lapply(seq_along(query_list), function(id) {
        if (tolower(nams[id]) == "scientificname") {
            if (length(query_list[[id]]) == 1) {
                oq <- paste("scientificName =", pcchar(query_list[[id]]))
            } else {
                oq <- paste0("scientificName in (", pcchar(query_list[[id]]), ")")
            }
        }
        if (tolower(nams[id]) == "taxonid") {
            if (length(query_list[[id]]) == 1) {
                oq <- paste("taxonID =", pcchar(query_list[[id]]))
            } else {
                oq <- paste0("taxonID in (", pcchar(query_list[[id]]), ")")
            }
        }
        if (tolower(nams[id]) == "taxonid") {
            if (length(query_list[[id]]) == 1) {
                oq <- paste("taxonID =", pcchar(query_list[[id]]))
            } else {
                oq <- paste0("taxonID in (", pcchar(query_list[[id]]), ")")
            }
        }

        return(oq)
    })
    return(paste(unlist(query_args, use.names = FALSE)))
}

.spg_query <- function(query_list) {
    gs <- \(x, from, to) {
        gsub(from, to, x)
    }
    query_list |>
        gs("scientificName", "species")
}

collect <- function(x) {
  UseMethod("collect", x)
}

collect.abra_query <- function(x) {
    .execute_call(x)
}

show_query <- function(.obj) {
    
}