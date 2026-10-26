-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: new species per year (by first year recorded) and cumulative species, to show saturation (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
-- only new species per year: records cannot be split by year, so there is no
-- per-1000-records rate. A species is 'discovered' in its earliest min_year.
with first_seen as (
    select
        species,
        min(min_year) as first_year
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
        and species is not null
        and min_year is not null
    group by species
)
select
    first_year as year,
    count(*) as new_species,
    sum(count(*)) over (order by first_year) as cumulative_species
from first_seen
group by first_year
order by first_year;
