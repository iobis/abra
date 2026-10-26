-- version: 0.1 2026-10-14
-- target: open-data
-- objective: share of cells in which each species occurs (global)
-- the share is relative to all cells with records in the area
with by_species_cell as (
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
    group by cell, interpreted.species
)
select
    species,
    count(*) as n_cells,
    round(100.0 * count(*) / (select count(distinct cell) from by_species_cell), 2) as pct_cells,
    sum(n)::bigint as n_records
from by_species_cell
where species is not null
group by species
order by n_cells desc;
