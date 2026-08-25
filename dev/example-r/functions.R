load_and_run <- function(
    sql_path,
    cell_type = "h3",
    cell_resolution = 6,
    filter_modifier = NULL,
    print_query = FALSE
) {
    sq <- readLines(sql_path, warn = FALSE)

    if (cell_type == "h3") {
        cell_block <- c(
            "-- [start cell block]",
            glue(
        "h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, {cell_resolution}) as cell"
            ),
            "-- [end cell block]"
        )
        sq[grep("start cell block", sq):grep("end cell block", sq)] <- cell_block
    } else if (cell_type == "a5") {
        # TODO!!!
        cell_block <- c(
            "-- [start cell block]",
            glue(
        "h3_latlng_to_cell(interpreted.decimalLatitude, interpreted.decimalLongitude, {cell_resolution}) as cell"
            ),
            "-- [end cell block]"
        )
        sq[grep("start cell block", sq):grep("end cell block", sq)] <- cell_block
    } else {
        stop("Cell type not recognized")
    }
    if (!is.null(filter_modifier)) {
        sq[grep("start conditions", sq):grep("end conditions", sq)] <- c(
            "-- [start conditions]", filter_modifier, "-- [end conditions]"
        )
    }
    message("Executing query")
    if (print_query) cat(paste(sq, collapse = "\n"))
    return(con |> get_query(paste(sq, collapse = "\n")))
}

run_metrics <- function(sql) {
    result <- load_and_run(sql,
                           cell_type = cell_type,
                           cell_resolution = cell_res)

    message("Converting to sf")
    sf_result <- cell_to_polygon(result, cell_type)
    sf_result <- sf::st_wrap_dateline(sf_result, options = c("WRAPDATELINE=YES", "DATELINEOFFSET=180"))
    return(sf_result)
}

cell_to_polygon <- function(.data, cell_type = "h3") {
    send_query(con, "drop table if exists result;")
    DBI::dbWriteTable(con$connection, "result", .data)
    if (cell_type == "h3") {
        pols <- get_query(con, "
            from result
            select *, h3_cell_to_boundary_wkt(cell) as geom
        ")
        pols <- sf::st_as_sf(pols, wkt = "geom", crs = 4326)
    } else if (cell_type == "a5") {

    } else {
        stop("Cell type not recognized")
    }
    return(pols)
}

plot_metric <- function(
    result,
    metric_name,
    name = waiver(),
    palette = "Blues",
    direction = -1,
    trans = NULL, # or log10, for example
    add_map = TRUE,
    map_type = "grey"
) {

    # to be checked
    # if (trans %in% c("log10", "log")) {
    #     result[sf::st_drop_geometry(result[,metric_name]) == 0, metric_name] <- 1
    # }

    {if (add_map) {
        if (map_type == "grey") {
            grey_map_s()
        } else {
            blank_map_s()
        }
    } else {
        ggplot()
    }} +
        geom_sf(data = result, aes(fill = .data[[metric_name]]), color = NA) +
        scale_fill_distiller(
            name = name,
            palette = palette, direction = direction, transform = trans,
            guide = obisrecipes::guide_colourbar_h(),
            labels = scales::label_number(scale_cut = scales::cut_short_scale())
        ) +
        theme_obis() +
        theme(
            legend.position = "bottom"
        )
}

plot_across <- function(result, cell_type, cell_res, which_log = "", titles = NULL) {
    nams <- names(result)[!names(result) %in% c("cell", "geom")]
    nams_form <- stringr::str_to_sentence(gsub("n_", "", nams))
    if (!is.null(titles)) {
        if (length(titles) != length(nams)) {
            warning("`titles` is the wrong lenght, using the names instead")
            titles <- nams_form
        }
    } else {
        titles <- nams_form
    }
    for (id in seq_along(nams)) {
        if (nams[id] %in% which_log) tt <- "log10" else tt <- "identity"
        p <- plot_metric(result, nams[id], trans = tt, name = paste0("Number of ", nams_form[id]), map_type = "blank") +
            labs(
                title = titles[id],
                subtitle = glue::glue("Aggregated at resolution {cell_res} using {toupper(cell_type)} grid"),
                caption = glue::glue("Analysed on {Sys.Date()}")
            )
        #p <- p |> obis_add_logo()
        ggsave(sni(tolower(nams_form[id])), width = 9, height = 7, plot = p)
    }
}
