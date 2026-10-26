-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number and share of cells with few records (< 10, 100 and 1000), to show spatial gaps (global)
with per_cell as (
    select
        count(*) as n_records,
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
    group by cell
)
select
    count(*) as n_cells,
    count(case when n_records < 10 then 1 end) as n_cells_lt_10,
    count(case when n_records < 100 then 1 end) as n_cells_lt_100,
    count(case when n_records < 1000 then 1 end) as n_cells_lt_1000,
    round(100.0 * count(case when n_records < 10 then 1 end) / count(*), 2) as pct_cells_lt_10,
    round(100.0 * count(case when n_records < 100 then 1 end) / count(*), 2) as pct_cells_lt_100,
    round(100.0 * count(case when n_records < 1000 then 1 end) / count(*), 2) as pct_cells_lt_1000,
    median(n_records) as median_records_per_cell
from per_cell;
