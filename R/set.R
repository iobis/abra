set_area <- function(.obj, geom) {
    if (inherits(geom, "sf")) {
        
    } else if (inherits(geom, "vect")) {

    } else if (is.character(geom)) {

    } else {
        cli::cli_abort("geometry should be one of sf, SpatVector or WKT (text)")
    }

    .obj$definers$area <- geom

    return(.obj)
}

set_period <- function(.obj, date_start = NULL, date_end = NULL) {
    if (is.null(date_start) & is.null(date_end)) {
        cli::cli_warn("Both `date_start` and `date_end` are NULL. Ignoring period set")
    } else {
        .obj$definers$period <- list(
            date_start = date_start,
            date_end = date_end
        )
    }

    return(.obj)
}

set_depth <- function(.obj, startdepth = NULL, enddepth = NULL) {
    if (is.null(startdepth) & is.null(enddepth)) {
        cli::cli_warn("Both `startdepth` and `enddepth` are NULL. Ignoring period set")
    } else {
        .obj$definers$depth <- list(
            startdepth = startdepth,
            enddepth = enddepth
        )
    }

    return(.obj)
}

set_query <- function(
  .obj,
  scientificname = NULL,
  taxonid = NULL,
  datasetid = NULL,
  nodeid = NULL,
  instituteid = NULL,
  flags = NULL
) {
    arg <- c(as.list(environment()))
    .obj$definers$query <- arg
    if (!is.na(.obj$definers$area[1])) {
        .obj$definers$query <- c(.obj$definers$query, geometry = .obj$definers$area)
    }
    if (!is.na(.obj$definers$depth[1])) {
        .obj$definers$query <- c(.obj$definers$query, .obj$definers$depth)
    }
    if (!is.na(.obj$definers$period[1])) {
        .obj$definers$query <- c(.obj$definers$query, .obj$definers$period)
    }
    return(.new_abra_query(.obj))
}

set_grid <- function(.obj, grid_type = "h3", resolution = 3) {
    resolution <- as.integer(resolution) 

    if (grid_type == "h3") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else if (grid_type == "a5") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else if (grid_type == "geoHash") {
        if (resolution > 15 || resolution < 1) cli::cli_abort("Resolution should be between 1 and 15")
    } else {
        cli::cli_abort("grid_type not recognized")
    }

    .obj$grid <- list(
        type = grid_type,
        resolution = resolution
    )

    return(.obj)
}

# .update_class <- function(.obj, new_class) {
#     if (!new_class %in% class(.obj)) {
#         class(.obj) <- c(new_class, .obj)
#     }
#     return(.obj)
# }

# z <- data.frame(a = 1)
# x <- structure(z, class = c("newClass", class(z)))
# str(x)
# class(x)

# sloop::s3_dispatch(print(x))
