-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: first and last year each species was recorded (filter on last_year to flag species not recorded recently) (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
select
    species,
    min(min_year) as first_year,
    max(max_year) as last_year,
    sum(records)::bigint as n_records
from obis
where
    -- [start conditions]
    true
    -- [end conditions]
    and min_year is not null
group by species
order by max(max_year), species;
