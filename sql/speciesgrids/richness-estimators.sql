-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: Chao1 richness estimate, sampling completeness (observed / Chao1) and records per species (global)
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
),
stats as (
    select
        count(*) as n_species,
        sum(n)::bigint as n_records,
        count(case when n = 1 then 1 end) as f1,
        count(case when n = 2 then 1 end) as f2
    from counts
)
select
    n_species,
    n_records,
    f1,
    f2,
    n_species + f1 * (f1 - 1) / (2.0 * (f2 + 1)) as chao1,
    n_species / (n_species + f1 * (f1 - 1) / (2.0 * (f2 + 1))) as completeness,
    n_records * 1.0 / n_species as records_per_species
from stats;
