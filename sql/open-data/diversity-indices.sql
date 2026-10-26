-- version: 0.1 2026-10-14
-- target: open-data
-- objective: Shannon, Gini-Simpson (1 - sum p^2) and Pielou evenness, using records per species as abundance (global)
with counts as (
    select
        interpreted.species as species,
        count(*) as n
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
        and interpreted.species is not null
    group by interpreted.species
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
