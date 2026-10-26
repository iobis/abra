-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of threatened species (CR, EN, VU) and their records (by grid cell)
select
    count(distinct case when interpreted.redlist_category in ('CR', 'EN', 'VU') then interpreted.species end) as n_threatened_species,
    count(distinct case when interpreted.redlist_category = 'CR' then interpreted.species end) as n_cr_species,
    count(distinct case when interpreted.redlist_category = 'EN' then interpreted.species end) as n_en_species,
    count(distinct case when interpreted.redlist_category = 'VU' then interpreted.species end) as n_vu_species,
    count(distinct interpreted.species) as n_species,
    count(case when interpreted.redlist_category in ('CR', 'EN', 'VU') then 1 end) as n_records_threatened,
    count(*) as n_records,
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
