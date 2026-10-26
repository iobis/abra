-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: share of cells in which each species occurs (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
-- the share is relative to all cells with records in the area
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
by_species_cell as (
    select species, cell, sum(records)::bigint as n
    from base
    group by species, cell
)
select
    species,
    count(*) as n_cells,
    round(100.0 * count(*) / (select count(distinct cell) from base), 2) as pct_cells,
    sum(n)::bigint as n_records
from by_species_cell
where species is not null
group by species
order by n_cells desc;
