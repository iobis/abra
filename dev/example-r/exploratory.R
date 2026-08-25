library(robisdb)
library(dplyr)
library(ggplot2)
library(obisrecipes)
library(INLA)

local_db <- "/Volumes/OBIS2/data/obis_data"

con <- connect_opendata_local(local_db)

con |> install_a5()
con |> install_h3()

which_grid <- "h3"

if (which_grid == "h3") {
    records_by_year <- con |>
        get_query(
            "select count(*) as records, interpreted.date_year, h3_latlng_to_cell(interpreted.decimalLatitude, interpreted.decimalLongitude, 5) as cell,
            h3_cell_to_boundary_wkt(h3_latlng_to_cell(interpreted.decimalLatitude, interpreted.decimalLongitude, 5)) as geom
            from obis
            where dropped is not true and absence is not true
            group by interpreted.date_year, cell, geom;
            "
        )
} else {
    records_by_year <- con |>
        get_query(
            "select count(*) as records, interpreted.date_year, a5_lonlat_to_cell(interpreted.decimalLongitude, interpreted.decimalLatitude, 8) as cell,
            ST_AsText(
                ST_MakePolygon(
                    ST_MakeLine(
                        list_transform(
                            a5_cell_to_boundary(
                                a5_lonlat_to_cell(interpreted.decimalLongitude, interpreted.decimalLatitude, 8)
                            ),
                            x -> ST_Point(x[1], x[2])
                        )
                    )
                )
            ) as geom
            from obis
            where dropped is not true and absence is not true
            group by interpreted.date_year, cell, geom;
            "
        )
}

con |> disconnect()

cells_with_year <- records_by_year |>
    filter(!is.na(date_year)) |>
    group_by(cell, geom) |>
    summarise(samples = n(), max_year = max(date_year))

cells_with_year_sf <- sf::st_as_sf(cells_with_year, wkt = "geom", crs = 4326) |>
    sf::st_wrap_dateline(options = c("WRAPDATELINE=YES", "DATELINEOFFSET=180"))

cells_with_year_sf <- cells_with_year_sf |>
    mutate(year_sampled = case_when(
        samples == 1 ~ "Single year",
        samples > 1 & samples <= 5 ~ "Up to 5 years",
        samples > 5 & samples <= 10 ~ "Up to 10 years",
        samples > 10 ~ "More than 10 years"
    )) |>
    mutate(last_year = case_when(
        max_year == 2026 ~ "This year",
        max_year >= 2021 & max_year < 2026 ~ "Last 5 years",
        max_year >= 2016 & max_year < 2021 ~ "Last 10 years",
        max_year < 2016 ~ "Older than 10 years"
    )) |>
    mutate(year_sampled = factor(year_sampled, levels = c("More than 10 years", "Up to 10 years", "Up to 5 years", "Single year"))) |>
    mutate(max_year = factor(max_year, levels = c("This year", "Last 5 years", "Last 10 years", "Older than 10 years")))


p <- blank_map_s() +
    geom_sf(
        data = cells_with_year_sf, aes(fill = samples),
        color = NA, linewidth = 0
    ) +
    scale_fill_distiller(
        palette = "Blues", name = "Number of years",
        guide = obisrecipes::guide_colourbar_h()
    ) +
    theme_obis() +
    theme(legend.position = "bottom") +
    labs(
        title = "Number of years with records on OBIS",
        subtitle = "H3 grid resolution 5 (~252 km²)",
        caption = paste("Extracted on", Sys.Date())
    )

ggsave("~/Downloads/test-map-1.png", p, width = 15, height = 11)

p2 <- blank_map_s() +
    geom_sf(
        data = cells_with_year_sf, aes(fill = year_sampled),
        color = NA, linewidth = 0
    ) +
    obisrecipes::scale_fill_obis_cat(
        "ibm",
        name = "Number of years"
    ) +
    theme_obis() +
    theme(legend.position = "bottom") +
    labs(
        title = "Number of years with records on OBIS",
        subtitle = "H3 grid resolution 5 (~252 km²)",
        caption = paste("Extracted on", Sys.Date())
    )

ggsave("~/Downloads/test-map-2.png", p2, width = 15, height = 11)


p3 <- blank_map_s() +
    geom_sf(
        data = cells_with_year_sf, aes(fill = last_year),
        color = NA, linewidth = 0
    ) +
    obisrecipes::scale_fill_obis_cat(
        "ibm",
        name = "Sampled year"
    ) +
    theme_obis() +
    theme(legend.position = "bottom") +
    labs(
        title = "Last sampled years with records on OBIS",
        subtitle = "H3 grid resolution 5 (~252 km²)",
        caption = paste("Extracted on", Sys.Date())
    )

ggsave("~/Downloads/test-map-3.png", p3, width = 15, height = 11)


# For each cell, fit records ~ year and classify the trend as increasing,
# decreasing or stable. type_fit selects the model:
#  - "bayesian": negative-binomial GLM via INLA (Laplace approximation, no
#    MCMC), classified from the posterior probability the year slope > 0.
#  - "nb_glm": frequentist negative-binomial GLM (MASS::glm.nb), classified
#    from the slope's p-value.
type_fit <- "nb_glm" # "bayesian" or "nb_glm"

min_years_for_trend <- 3
trend_prob_threshold <- 0.9 # used when type_fit == "bayesian": P(slope > 0) cutoff
trend_alpha <- 0.05 # used when type_fit == "nb_glm": significance level

records_by_year_valid <- records_by_year |>
    filter(!is.na(date_year))

cell_groups <- split(records_by_year_valid, records_by_year_valid$cell)

cell_trends <- vector("list", length(cell_groups))

pb <- progress::progress_bar$new(total = length(cell_trends))

for (i in seq_along(cell_groups)) {

    pb$tick()

    cell_data <- cell_groups[[i]] |> arrange(date_year)
    this_cell <- cell_data$cell[1]
    n_years <- nrow(cell_data)

    if (n_years < min_years_for_trend) {
        cell_trends[[i]] <- tibble(
            cell = this_cell, trend = "insufficient data",
            slope = NA_real_, stat = NA_real_, n_years = n_years
        )
        next
    }

    cell_data <- cell_data |> mutate(year_c = date_year - mean(date_year))

    if (type_fit == "bayesian") {
        fit <- tryCatch(
            inla(
                records ~ year_c,
                data = cell_data,
                family = "nbinomial",
                control.predictor = list(compute = FALSE)
            ),
            error = function(e) NULL
        )

        if (is.null(fit)) {
            cell_trends[[i]] <- tibble(
                cell = this_cell, trend = "insufficient data",
                slope = NA_real_, stat = NA_real_, n_years = n_years
            )
            next
        }

        slope_estimate <- fit$summary.fixed["year_c", "mean"]
        stat <- 1 - inla.pmarginal(0, fit$marginals.fixed[["year_c"]])

        trend <- case_when(
            stat >= trend_prob_threshold ~ "increasing",
            stat <= (1 - trend_prob_threshold) ~ "decreasing",
            TRUE ~ "stable"
        )
    } else if (type_fit == "nb_glm") {
        fit <- tryCatch(
            MASS::glm.nb(records ~ year_c, data = cell_data),
            error = function(e) NULL
        )

        if (is.null(fit)) {
            cell_trends[[i]] <- tibble(
                cell = this_cell, trend = "insufficient data",
                slope = NA_real_, stat = NA_real_, n_years = n_years
            )
            next
        }

        coefs <- summary(fit)$coefficients
        slope_estimate <- coefs["year_c", "Estimate"]
        stat <- coefs["year_c", "Pr(>|z|)"]

        trend <- case_when(
            stat < trend_alpha & slope_estimate > 0 ~ "increasing",
            stat < trend_alpha & slope_estimate < 0 ~ "decreasing",
            TRUE ~ "stable"
        )
    } else {
        stop("type_fit must be 'bayesian' or 'nb_glm'")
    }

    cell_trends[[i]] <- tibble(
        cell = this_cell, trend = trend,
        slope = slope_estimate, stat = stat, n_years = n_years
    )

}

cell_trends <- bind_rows(cell_trends) |>
    mutate(trend = factor(trend, levels = c("increasing", "stable", "decreasing", "insufficient data")))

cells_with_year_sf <- cells_with_year_sf |>
    left_join(cell_trends, by = "cell")

p4 <- blank_map_s() +
    geom_sf(
        data = cells_with_year_sf, aes(fill = trend),
        color = NA, linewidth = 0
    ) +
    obisrecipes::scale_fill_obis_cat(
        "ibm",
        name = "Trend"
    ) +
    theme_obis() +
    theme(legend.position = "bottom") +
    labs(
        title = "Trend in number of records over time",
        subtitle = glue::glue(
            "H3 grid resolution 5 (~252 km²), {if (type_fit == 'bayesian') 'Bayesian' else 'Frequentist'} NB-GLM"
        ),
        caption = paste("Extracted on", Sys.Date())
    )

ggsave("~/Downloads/test-map-4.png", p4, width = 15, height = 11)
