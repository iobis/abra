-- version: 0.1 2026-10-14
-- target: open-data
-- objective: years sampled, first/last year and longest run of consecutive years per cell (by grid cell)
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
select * from per_cell
order by cell;
