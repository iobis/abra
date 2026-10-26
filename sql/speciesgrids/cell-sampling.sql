-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: number and share of cells with few records (< 10, 100 and 1000), to show spatial gaps (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with base as (
    select
        species,
        records,
        -- [start cell block]
        cell as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
),
per_cell as (
    select cell, sum(records)::bigint as n_records
    from base
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
