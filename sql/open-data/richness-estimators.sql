-- version: 0.1 2026-10-14
-- target: open-data
-- objective: Chao1 richness estimate, sampling completeness (observed / Chao1) and records per species (global)
-- records are used as the abundance of each species; f1/f2 are the number of
-- species with exactly one/two records. chao1 is the bias-corrected estimator.
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
stats as (
    select
        count(*) as n_species,
        sum(n)::bigint as n_records,
        count(case when n = 1 then 1 end) as f1,
        count(case when n = 2 then 1 end) as f2
    from counts
)
select
    n_species,
    n_records,
    f1,
    f2,
    n_species + f1 * (f1 - 1) / (2.0 * (f2 + 1)) as chao1,
    n_species / (n_species + f1 * (f1 - 1) / (2.0 * (f2 + 1))) as completeness,
    n_records * 1.0 / n_species as records_per_species
from stats;
