-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: cumulative number of species by year of first record, per kingdom (by grid cell)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
-- sparse by design: a row only exists where at least one species was first
-- recorded in that year; gap years are not padded here.
with base as (
    select
        kingdom,
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
        kingdom,
        species,
        min(min_year) as first_year,
        cell
    from base
    where species is not null
        and min_year is not null
        and kingdom in ('Animalia', 'Plantae', 'Fungi', 'Archaea', 'Bacteria',
            'Chromista', 'Protozoa', 'Viruses', 'Biota incertae sedis')
    group by cell, kingdom, species
)
select
    cell, kingdom, first_year,
    count(*) as new_species,
    sum(count(*)) over (partition by cell, kingdom order by first_year) as cumulative_species
from first_seen
group by cell, kingdom, first_year
order by cell, kingdom, first_year;
