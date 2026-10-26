-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: cumulative number of species by year of first record, per class (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
-- sparse by design: a row only exists where at least one species was first
-- recorded in that year; gap years are not padded here.
with first_seen as (
    select
        class,
        species,
        min(min_year) as first_year
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
        and species is not null
        and min_year is not null
    group by class, species
)
select
    class, first_year,
    count(*) as new_species,
    sum(count(*)) over (partition by class order by first_year) as cumulative_species
from first_seen
group by class, first_year
order by class, first_year;
