-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using records per species as abundance (global)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with counts as (
    select
        species,
        sum(records)::bigint as n
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
        and species is not null
    group by species
),
props as (
    select n, n * 1.0 / sum(n) over () as p
    from counts
)
select
    count(*) as n_species,
    sum(n)::bigint as n_records,
    -sum(p * ln(p)) as shannon,
    1 - sum(p * p) as simpson,
    -sum(p * ln(p)) / nullif(ln(greatest(count(*), 1)), 0) as pielou
from props;
