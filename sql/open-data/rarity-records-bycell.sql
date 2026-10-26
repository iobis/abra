-- version: 0.1 2026-10-14
-- target: open-data
-- objective: share of species with 1 to 5 records (by grid cell)
with counts as (
    select
        interpreted.species as species,
        count(*) as n,
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
        and interpreted.species is not null
    group by cell, interpreted.species
)
select
    cell, count(*) as n_species,
    count(case when n = 1 then 1 end) as n_singletons,
    count(case when n <= 5 then 1 end) as n_rare_species,
    round(100.0 * count(case when n <= 5 then 1 end) / count(*), 2) as pct_rare_species
from counts
group by cell
order by cell;
