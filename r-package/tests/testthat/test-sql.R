test_that("depth bands are classified with a case expression", {
    sql <- .build_depth_band_query(c(0, 20, 200, 1000, Inf))
    expect_match(sql, "when depth_m is null then 'Unknown'", fixed = TRUE)
    expect_match(sql, "when depth_m < 0 then '<0'", fixed = TRUE)
    expect_match(sql, "when depth_m >= 0 and depth_m < 20 then '0-20'", fixed = TRUE)
    expect_match(sql, "when depth_m >= 1000 then '1000+'", fixed = TRUE)
    expect_match(sql, "end as depth_band$")

    # a finite last break leaves the deepest records in an open band
    sql <- .build_depth_band_query(c(0, 100, 500))
    expect_match(sql, "else '500+'", fixed = TRUE)
    # large breaks are not written in scientific notation
    expect_match(.build_depth_band_query(c(0, 100000)), "100000", fixed = TRUE)
})

test_that("query conditions always exclude dropped records and absences", {
    q <- .new_abra_query(fake_con())
    expect_equal(.query_conditions(q), "dropped is not true and absence is not true")
})

test_that("query conditions combine period, depth, area and taxa", {
    q <- fake_con() |>
        set_period("2000-01-01", "2020-12-31") |>
        set_depth(0, 200) |>
        set_area("POLYGON ((0 0, 1 0, 1 1, 0 0))") |>
        set_filters(class = "Teleostei", order = c("Scleractinia", "Antipatharia"))
    cond <- .query_conditions(q)
    expect_match(cond, "interpreted.date_mid >=", fixed = TRUE)
    expect_match(cond, "interpreted.date_mid <=", fixed = TRUE)
    expect_match(cond, "interpreted.minimumDepthInMeters >= 0", fixed = TRUE)
    expect_match(cond, "interpreted.maximumDepthInMeters <= 200", fixed = TRUE)
    expect_match(cond, "ST_Intersects(geometry", fixed = TRUE)
    # the taxa are combined with "or", and in parentheses
    expect_match(cond, "(interpreted.\"class\" in ('Teleostei') or interpreted.\"order\" in", fixed = TRUE)
})

test_that("taxon ids should be numeric", {
    expect_error(.taxon_conditions(list(taxonid = "1")), "numeric")
    expect_null(.taxon_conditions(list()))
})

test_that("only open-data connections are accepted by the analyses", {
    expect_error(basic_stats(fake_con("speciesgrids-local")), "open-data")
    expect_error(basic_stats(data.frame()), "robisdb")
})

test_that("a grid is needed by the cell analyses", {
    q <- .new_abra_query(fake_con())
    expect_error(.cell_expr(q), "set_grid")
    expect_error(.cell_expr(set_grid(fake_con(), "a5", 3)), "h3")
    expect_match(as.character(.cell_expr(set_grid(fake_con(), "h3", 4))), "h3_latlng_to_cell_string(.*, 4)")
})

test_that("grouping pieces follow the grouping", {
    q <- set_grid(fake_con(), "h3", 4)
    expect_equal(.group_spec(q, NULL)$sel, "")
    expect_equal(.group_spec(q, "dataset")$col, "dataset_id")
    cell <- .group_spec(q, "cell")
    expect_equal(cell$col, "cell")
    expect_match(cell$where, "decimalLatitude is not null")
})

test_that("run_analyses() rejects unknown analyses", {
    expect_error(run_analyses(fake_con(), "not_an_analysis", pre_compute = FALSE), "Unknown analyses")
})

test_that("pre_compute() validates the table name", {
    expect_error(pre_compute(fake_con(), table = "bad name; drop table x"), "plain table name")
})

test_that("export_cube() checks its arguments", {
    df <- data.frame(year = 1:2, n = 3:4)
    expect_error(export_cube(1, tempfile(), "year"), "data frame")
    expect_error(export_cube(df, tempfile(), "missing", geo_col = NULL), "not found")
    expect_error(export_cube(df, tempfile(), "year"), "not found")
})

test_that("export_cube() writes a parquet file and a manifest", {
    skip_if_not_installed("arrow")
    df <- data.frame(year = c(2000, 2000, 2001), cell = c("a", "b", "a"), n = c(1, 2, 3))
    path <- tempfile(fileext = ".parquet")
    manifest <- export_cube(df, path, dimensions = "year", grid = list(type = "h3", resolution = 4))
    expect_true(file.exists(path))
    expect_true(file.exists(sub("\\.parquet$", ".json", path)))
    expect_equal(manifest$rows, 3)
    expect_equal(manifest$measures, "n")
    expect_equal(manifest$dimension_tree$values[[1]]$value, "2000")
    expect_equal(manifest$dimension_tree$values[[1]]$n, 3)
})
