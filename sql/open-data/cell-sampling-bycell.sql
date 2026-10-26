-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of records and species per cell, to show spatial gaps (by grid cell)
select
    count(*) as n_records,
    count(distinct interpreted.species) as n_species,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by cell
order by cell;
