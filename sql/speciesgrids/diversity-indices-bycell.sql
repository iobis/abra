-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using records per species as abundance (by grid cell)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with base as (
    select
        species,
        records,
        -- [start cell block]
        cell as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
),
counts as (
    select
        species,
        sum(records)::bigint as n,
        cell
    from base
    where species is not null
    group by cell, species
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
