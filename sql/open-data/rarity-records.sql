-- version: 0.1 2026-10-14
-- target: open-data
-- objective: share of species with 1 to 5 records (global)
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
)
select
    count(*) as n_species,
    count(case when n = 1 then 1 end) as n_singletons,
    count(case when n <= 5 then 1 end) as n_rare_species,
    round(100.0 * count(case when n <= 5 then 1 end) / count(*), 2) as pct_rare_species
from counts;
