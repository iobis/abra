-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of records (identified to species) per year (by grid cell)
select
    interpreted.date_year as date_year,
    count(interpreted.species) as total,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
        and interpreted.date_year is not null
group by cell, interpreted.date_year
order by cell, date_year;
