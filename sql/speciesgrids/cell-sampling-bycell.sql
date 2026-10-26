-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: number of records and species per cell, to show spatial gaps (by grid cell)
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
)
select
    sum(records)::bigint as n_records,
    count(distinct species) as n_species,
    cell
from base
group by cell
order by cell;
