select
    count(case when interpreted.wrims is true then 1 end) as n_records_wrims,
    count(distinct case when interpreted.wrims is true then interpreted.species end) as n_species_wrims,
    count(case when interpreted.redlist_category in ('CR', 'EN', 'VU') then 1 end) as n_records_threatened,
    count(distinct case when interpreted.redlist_category in ('CR', 'EN', 'VU') then interpreted.species end) as n_species_threatened,
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
