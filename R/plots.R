
wrld <- rnaturalearth::ne_countries(returnclass = "sf")

abra_map_theme <- function() {
    theme_light() +
        theme(
            legend.position = "bottom",
            panel.background = element_rect(fill = "#dbdbdc")
        )
}

abra_cbar_con <- function(
  title = ggplot2::waiver(), barwidth = grid::unit(
      12,
      "lines"
  ), barheight = grid::unit(0.4, "lines"), title_position = "top",
  title_hjust = 0.5, label_position = "bottom", ...
) {
    ggplot2::guide_colorbar(
        title = title, direction = "horizontal",
        barwidth = barwidth, barheight = barheight, title.position = title_position,
        title.hjust = title_hjust, label.position = label_position,
        frame.colour = NA, ticks.colour = NA, ...
    )
}

abra_cbar_bin <- function(
  title = ggplot2::waiver(), barwidth = grid::unit(2, "lines"),
  barheight = grid::unit(0.4, "lines"), title_position = "top",
  title_hjust = 0.5, label_position = "bottom", show.limits = TRUE, ...
) {
    ggplot2::guide_bins(
        title = title, direction = "horizontal",
        show.limits = show.limits,
        theme = ggplot2::theme(
            legend.key.width = barwidth,
            legend.key.height = barheight,
            legend.key.spacing.x = grid::unit(0, "pt"),
            legend.axis.line = ggplot2::element_blank(),
            legend.title.position = title_position,
            legend.text.position = label_position,
            legend.title = ggplot2::element_text(hjust = title_hjust)
        ),
        ...
    )
}

plot_grid <- function(
  result, metric, target_area = NULL, simple = TRUE, complete = FALSE,
  crop = TRUE, title = metric, palette = "Blues", direction = 1, ...
) {

    result <- h3_to_grid(result)

    if (!simple) {
        wrld <- rnaturalearth::ne_countries(returnclass = "sf", scale = 10)
    }
    if (complete & !is.null(target_area)) {
        result <- complete_h3_grid(result, target_area)
    }

    sf::sf_use_s2(FALSE)
    if (crop) {
        if (!is.null(target_area)) {
            target_area <- sf::st_as_sf(sf::st_as_sfc(target_area, crs = 4326))
            wrld <- sf::st_crop(wrld, target_area)
        } else {
            wrld <- sf::st_crop(wrld, result)
        }
    }

    values <- result[[metric]]
    if (dplyr::n_distinct(values) < 5) {
        result[[metric]] <- factor(values, levels = sort(unique(values)))
        sca <- scale_fill_brewer(palette = palette, direction = direction, name = title, ...)
    } else {
        sca <- scale_fill_distiller(
            palette = palette, direction = direction,
            guide = abra_cbar_con(title = title), ...
        )
    }

    ggplot() +
        geom_sf(data = wrld, fill = "white", color = "white") +
        geom_sf(data = result, aes(fill = .data[[metric]])) +
        {if (!is.null(target_area)) geom_sf(data = target_area, color = "blue", fill = NA)} +
        sca +
        coord_sf(expand = FALSE) +
        abra_map_theme()
}

plot_sampled_years <- function(result, ...) {
    plot_grid(result, metric = "sampled_years", ...)
}