-- version: 0.1 2026-10-14
-- target: open-data
-- objective: Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using records per species as abundance (by grid cell)
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
),
props as (
    select cell, n, n * 1.0 / sum(n) over (partition by cell) as p
    from counts
)
select
    cell, count(*) as n_species,
    sum(n)::bigint as n_records,
    -sum(p * ln(p)) as shannon,
    1 - sum(p * p) as simpson,
    -sum(p * ln(p)) / nullif(ln(greatest(count(*), 1)), 0) as pielou
from props
group by cell
order by cell;
