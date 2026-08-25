select
    count(interpreted.species) as n_records_to_species,
    count(case when interpreted.species is null and interpreted.genus is not null then 1 end) as n_records_to_genus_only,
    count(case when interpreted.genus is null and interpreted.family is not null then 1 end) as n_records_to_family_only,
    count(case when interpreted.species is null and interpreted.genus is null and interpreted.family is null then 1 end) as n_records_coarser,
    count(*) as n_records,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by cell;
