-- version: 0.1 2026-10-14
-- target: open-data
-- objective: species richness and number of records by depth band (by grid cell)
-- bands come from set_depth_bands(); the CASE below is the default
with d as (
    select
        interpreted.species as species,
        coalesce(interpreted.minimumDepthInMeters, interpreted.maximumDepthInMeters) as depth_m,
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
),
banded as (
    select
        cell, species,
        depth_m,
        -- [start depth band block]
        case
    when depth_m is null then 'Unknown'
    when depth_m < 0 then '<0'
    when depth_m >= 0 and depth_m < 20 then '0-20'
    when depth_m >= 20 and depth_m < 200 then '20-200'
    when depth_m >= 200 and depth_m < 1000 then '200-1000'
    when depth_m >= 1000 then '1000+'
        end as depth_band
        -- [end depth band block]
    from d
)
select
    cell, depth_band,
    count(distinct species) as n_species,
    count(*) as n_records
from banded
group by cell, depth_band
order by cell, min(depth_m) nulls last;
