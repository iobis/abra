definers <- function(x) attr(x, "abra_query")$definers

test_that("the first set_*() call promotes a connection to an abra_query", {
    q <- set_grid(fake_con(), "h3", 4)
    expect_s3_class(q, "abra_query")
    expect_equal(definers(q)$grid, "h3")
    expect_equal(definers(q)$resolution, 4L)
})

test_that("set_*() functions can be chained in any order and keep earlier settings", {
    q <- fake_con() |>
        set_period("2000-01-01", "2020-12-31") |>
        set_depth(0, 200) |>
        set_taxonomic_level("family") |>
        set_depth_bands(c(0, 50, Inf)) |>
        set_filters(class = "Teleostei")
    d <- definers(q)
    expect_equal(d$period$date_start, "2000-01-01")
    expect_equal(d$depth$enddepth, 200)
    expect_equal(d$taxonomic_level, "family")
    expect_equal(d$depth_bands, c(0, 50, Inf))
    expect_equal(d$filters$class, "Teleostei")
})

test_that("set_area() validates WKT and stores it", {
    wkt <- "POLYGON ((0 0, 1 0, 1 1, 0 0))"
    expect_equal(definers(set_area(fake_con(), wkt))$area, wkt)
    expect_error(set_area(fake_con(), "not a polygon"))
    expect_error(set_area(fake_con(), 1))
    expect_warning(set_area(fake_con(), NULL), "global")
})

test_that("set_area() accepts sf objects and unions several features", {
    skip_if_not_installed("sf")
    pols <- sf::st_sfc(
        sf::st_polygon(list(rbind(c(0, 0), c(1, 0), c(1, 1), c(0, 0)))),
        sf::st_polygon(list(rbind(c(2, 2), c(3, 2), c(3, 3), c(2, 2)))),
        crs = 4326
    )
    q <- set_area(fake_con(), sf::st_sf(id = 1:2, geometry = pols))
    expect_match(definers(q)$area, "^MULTIPOLYGON")
})

test_that("set_period() and set_depth() ignore empty calls", {
    expect_warning(q <- set_period(fake_con()), "Ignoring")
    expect_true(identical(definers(q)$period, NA))
    expect_warning(q <- set_depth(fake_con()), "Ignoring")
    expect_true(identical(definers(q)$depth, NA))
})

test_that("set_grid() validates the grid and resolution", {
    expect_error(set_grid(fake_con(), "h3", 16))
    expect_error(set_grid(fake_con(), "h3", 0))
    expect_error(set_grid(fake_con(), "square", 3))
    expect_error(set_grid(fake_con(), NULL, 3))
})

test_that("set_taxonomic_level() and set_depth_bands() validate their input", {
    expect_error(set_taxonomic_level(fake_con(), "tribe"))
    expect_error(set_taxonomic_level(fake_con(), c("class", "order")))
    expect_error(set_depth_bands(fake_con(), c(0, 100, 50)))
    expect_error(set_depth_bands(fake_con(), 10))
    expect_error(set_depth_bands(fake_con(), c(0, NA, 10)))
})

test_that("set_filters() validates taxon names and ignores empty calls", {
    expect_error(set_filters(fake_con(), class = 1))
    expect_warning(q <- set_filters(fake_con()), "No filter")
    expect_true(identical(definers(q)$filters, NA))
})

test_that("set_*() functions reject objects that are not connections", {
    expect_error(set_grid(data.frame(), "h3", 3))
})

test_that("the printed summary lists only what was set", {
    expect_length(.definers_lines(definers(.new_abra_query(fake_con()))), 0)
    q <- fake_con() |>
        set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
        set_filters(order = c("A", "B")) |>
        set_depth_bands(c(0, 10, Inf)) |>
        set_grid("h3", 5)
    lines <- .definers_lines(definers(q))
    expect_named(lines, c("Area", "Depth bands", "Filters", "Grid"))
    expect_equal(unname(lines["Grid"]), "h3 (resolution 5)")
    expect_equal(unname(lines["Filters"]), "order = A/B")
})
