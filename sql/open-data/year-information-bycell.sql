-- version: 0.1 2026-10-14
-- target: open-data
-- objective: year information metric (YI): unique (cell, taxon) per observation year (by grid cell)
-- Year information metric (YI): for each observation year y, the number of
-- unique (cell, taxon) combinations among the records observed in year y,
-- regardless of when they were published. The taxon is a phylum unless set with
-- set_taxonomic_level().
with obis_cells as (
    -- one row per (dataset, cell, observation year, taxon); a cheap pre-reduction
    select distinct
        interpreted.date_year as obs_year,
        -- [start taxon block]
        interpreted.phylum as taxon,
        -- [end taxon block]
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
        and interpreted.date_year is not null
        and interpreted.decimalLatitude is not null
        and interpreted.decimalLongitude is not null
),
combos as (
    select distinct obs_year as year, cell, taxon
    from obis_cells
    where taxon is not null
),
per_cell as (
    select year, cell, count(*) as n
    from combos
    group by year, cell
)
select year, cell, n as i_p
from per_cell
order by year, cell;
