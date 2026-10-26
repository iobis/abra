-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: cumulative number of species by year of first record, per phylum (by grid cell)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
-- sparse by design: a row only exists where at least one species was first
-- recorded in that year; gap years are not padded here.
with base as (
    select
        phylum,
        species,
        min_year,
        -- [start cell block]
        cell as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
),
first_seen as (
    select
        phylum,
        species,
        min(min_year) as first_year,
        cell
    from base
    where species is not null
        and min_year is not null
    group by cell, phylum, species
)
select
    cell, phylum, first_year,
    count(*) as new_species,
    sum(count(*)) over (partition by cell, phylum order by first_year) as cumulative_species
from first_seen
group by cell, phylum, first_year
order by cell, phylum, first_year;
