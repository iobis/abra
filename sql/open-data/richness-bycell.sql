-- version: 0.1 2026-10-14
-- target: open-data
-- objective: richness at species, genus, family, order, class and phylum level, and number of records (by grid cell)
select
    count(distinct interpreted.species) as n_species,
    count(distinct interpreted.genus) as n_genus,
    count(distinct interpreted.family) as n_family,
    count(distinct interpreted.order) as n_order,
    count(distinct interpreted.class) as n_class,
    count(distinct interpreted.phylum) as n_phylum,
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
