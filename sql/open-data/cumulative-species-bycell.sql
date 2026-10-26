-- version: 0.1 2026-10-14
-- target: open-data
-- objective: cumulative number of species by year of first record (by grid cell)
-- sparse by design: a row only exists where at least one species was first
-- recorded in that year; gap years are not padded here (padding would
-- cross-join every group against a full year range). Pad at render time.
with first_seen as (
    select interpreted.species, min(interpreted.date_year) as first_year,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
            and interpreted.species is not null and interpreted.date_year is not null
    group by cell, interpreted.species
)
select
    cell, first_year,
    count(*) as new_species,
    sum(count(*)) over (partition by cell order by first_year) as cumulative_species
from first_seen
group by cell, first_year
order by cell, first_year;
