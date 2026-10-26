-- version: 0.1 2026-10-14
-- target: open-data
-- objective: publication information metric (PI): unique (cell, observation year, taxon) per publication year (aggregated over cells)
-- Publication information metric (PI): for each publication year p, the number
-- of unique (cell, observation year, taxon) combinations among the records
-- published in year p. The taxon is a phylum unless set with set_taxonomic_level().
-- Requires a `dataset_info` table (id, created, published).
with obis_cells as (
    -- one row per (dataset, cell, observation year, taxon); a cheap pre-reduction
    select distinct
        dataset_id,
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
dataset_year as (
    -- publication year: `created`, falling back to `published`
    select
        id as dataset_id,
        extract(year from coalesce(
            try_cast(created as timestamp),
            try_cast(published as timestamp)
        ))::int as pub_year
    from dataset_info
),
combos as (
    select distinct pub_year as year, cell, obs_year, taxon
    from obis_cells
    join dataset_year using (dataset_id)
    where pub_year is not null and taxon is not null
),
per_cell as (
    select year, cell, count(*) as n
    from combos
    group by year, cell
)
select
    year,
    sum(n)::bigint as i_p,
    count(*) as n_cells,
    stddev_samp(n) / avg(n) as cv
from per_cell
group by year
order by year;
