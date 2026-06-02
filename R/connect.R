connect <- function(con_type = "api", path = NULL) {

    if (!is.null(path) && con_type == "api") {
        warning("For connection of type API path will be ignored.")
    } else if (!is.null(path)) {
        con_type <- paste0(con_type, "-local")
    }

    con_list <- .new_abra_obj()

    switch(con_type,
           api = {con_list$connection$con <- NA},
           spg = {
            con_list$connection$con <- .create_connection(con_type)
           },
           `spg-local` = {
            con_list$connection$con <- .create_connection(con_type, path)
           },
           `open-data` = {
            con_list$connection$con <- .create_connection(con_type)
           },
           `open-data-local` = {
            con_list$connection$con <- .create_connection(con_type, path)
           })

    con_list$connection$info$type <- con_type
    con_list$connection$info$start <- Sys.time()

    return(.new_abra_conn(con_list))
}

.create_connection <- function(which_con, path = NULL) {
    require(duckdb)
    con <- DBI::dbConnect(duckdb())

    if (!is.null(path)) {
        if (which_con == "spg-local") {
            parquet_path <- file.path(path, "*")
        } else if (which_con == "open-data-local") {
            parquet_path <- file.path(path, "*.parquet")
        } else {
            stop("Connection should be one of spg (speciesgrids) or open-data (Parquet export)")
        }
    } else {
        if (which_con == "spg") {
            parquet_path <- "s3://obis-products/speciesgrids/h3_7/*"
        } else if (which_con == "open-data") {
            parquet_path <- "s3://obis-open-data/occurrence/*.parquet"
        } else {
            stop("Connection should be one of spg (speciesgrids) or open-data (Parquet export)")
        }
    }
    #suppressMessages()
    DBI::dbSendQuery(con, "
        install spatial; load spatial;
        install h3 from community; load h3;
        install a5 from community; load a5;
        install icu; load icu;
        install httpfs; load httpfs;
    ")

    if (which_con == "open-data") {
        cli::cli_warn("
        Connecting to the OBIS open data through S3 is not recommended and can be very slow.
        You can download a local copy using sync_open_data().")
    }

    DBI::dbSendQuery(con, glue::glue("
        create view obis as 
            select * from read_parquet('{parquet_path}');
        "))

    return(con)
}

connect_api <- function() {
    connect("api")
}

connect_spg_local <- function(path) {
    connect("spg", path)
}

connect_spg_s3 <- function() {
    connect("spg")
}

connect_od_local <- function(path) {
    connect("open-data", path)
}

connect_od_s3 <- function() {
    connect("open-data")
}

sync_spg <- function(path) {
    #TODO
}

sync_od <- function(path) {
    #TODO
}