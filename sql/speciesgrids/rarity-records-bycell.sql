-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: share of species with 1 to 5 records (by grid cell)
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
counts as (
    select
        species,
        sum(records)::bigint as n,
        cell
    from base
    where species is not null
    group by cell, species
)
select
    cell, count(*) as n_species,
    count(case when n = 1 then 1 end) as n_singletons,
    count(case when n <= 5 then 1 end) as n_rare_species,
    round(100.0 * count(case when n <= 5 then 1 end) / count(*), 2) as pct_rare_species
from counts
group by cell
order by cell;
