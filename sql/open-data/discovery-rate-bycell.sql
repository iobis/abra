-- version: 0.1 2026-10-14
-- target: open-data
-- objective: new species per year and per 1000 records, to show saturation (by grid cell)
with sp_year as (
    select
        interpreted.species as species,
        interpreted.date_year as year,
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
        and interpreted.date_year is not null
    group by cell, interpreted.species, interpreted.date_year
),
recs as (
    select cell, year, sum(n)::bigint as n_records
    from sp_year
    group by cell, year
),
new_sp as (
    select cell, first_year as year, count(*) as new_species
    from (select cell, species, min(year) as first_year from sp_year group by cell, species)
    group by cell, first_year
)
select
    cell, year,
    coalesce(new_species, 0) as new_species,
    sum(coalesce(new_species, 0)) over (partition by cell order by year) as cumulative_species,
    n_records,
    sum(n_records) over (partition by cell order by year) as cumulative_records,
    1000.0 * coalesce(new_species, 0) / n_records as new_species_per_1000_records
from recs
left join new_sp using (cell, year)
order by cell, year;
