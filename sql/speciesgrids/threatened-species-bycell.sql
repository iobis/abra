-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: number of threatened species (CR, EN, VU) and their records (category is only filled for threatened or extinct species) (by grid cell)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with base as (
    select
        species,
        category,
        records,
        -- [start cell block]
        cell as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        true
        -- [end conditions]
)
select
    count(distinct case when category in ('CR', 'EN', 'VU') then species end) as n_threatened_species,
    count(distinct case when category = 'CR' then species end) as n_cr_species,
    count(distinct case when category = 'EN' then species end) as n_en_species,
    count(distinct case when category = 'VU' then species end) as n_vu_species,
    count(distinct species) as n_species,
    sum(case when category in ('CR', 'EN', 'VU') then records else 0 end)::bigint as n_records_threatened,
    sum(records)::bigint as n_records,
    cell
from base
group by cell
order by cell;
