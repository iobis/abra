-- version: 0.1 2026-10-14
-- target: open-data
-- objective: WRiMS-flagged species (e.g. introduced or invasive) and records over time (by grid cell)
select
    interpreted.date_year as year,
    count(distinct case when interpreted.wrims is true then interpreted.species end) as n_species_wrims,
    count(case when interpreted.wrims is true then 1 end) as n_records_wrims,
    count(distinct interpreted.species) as n_species,
    count(*) as n_records,
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
order by cell, year;
