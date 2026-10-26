-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: share of species with 1 to 5 records (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with counts as (
    select
        species,
        sum(records)::bigint as n
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
        and species is not null
    group by species
)
select
    count(*) as n_species,
    count(case when n = 1 then 1 end) as n_singletons,
    count(case when n <= 5 then 1 end) as n_rare_species,
    round(100.0 * count(case when n <= 5 then 1 end) / count(*), 2) as pct_rare_species
from counts;
