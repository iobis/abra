-- version: 0.1 2026-10-14
-- target: open-data
-- objective: first and last year each species was recorded (filter on last_year to flag species not recorded recently) (by grid cell)
select
    interpreted.species as species,
    min(interpreted.date_year) as first_year,
    max(interpreted.date_year) as last_year,
    count(*) as n_records,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
    and interpreted.species is not null
    and interpreted.date_year is not null
group by cell, interpreted.species
order by cell, max(interpreted.date_year), interpreted.species;
