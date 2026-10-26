-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of cells by years sampled (1, >= 5, >= 10, > 10) and largest run of consecutive years (global)
with years as (
    select distinct
        interpreted.date_year as year,
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
        and interpreted.date_year is not null
),
runs as (
    -- consecutive years share the same (year - row number)
    select cell, min(year) as run_start, max(year) as run_end, count(*) as run_len
    from (select cell, year, year - row_number() over (partition by cell order by year) as grp from years)
    group by cell, grp
),
per_cell as (
    select
        cell,
        sum(run_len)::int as n_years,
        min(run_start) as first_year,
        max(run_end) as last_year,
        max(run_len) as longest_run
    from runs
    group by cell
)
select
    count(*) as n_cells,
    count(case when n_years = 1 then 1 end) as n_cells_1_year,
    count(case when n_years >= 5 then 1 end) as n_cells_ge_5_years,
    count(case when n_years >= 10 then 1 end) as n_cells_ge_10_years,
    count(case when n_years > 10 then 1 end) as n_cells_gt_10_years,
    max(longest_run) as largest_sequence,
    max_by(cell, longest_run) as cell_largest_sequence
from per_cell;
