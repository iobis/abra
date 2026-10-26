-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: cells in the top decile of richness and of threatened species, and whether both coincide (by grid cell)
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
),
per_cell as (
    select
        cell,
        count(distinct species) as n_species,
        count(distinct case when category in ('CR', 'EN', 'VU') then species end) as n_threatened_species
    from base
    group by cell
),
flagged as (
    select
        *,
        n_species >= quantile_cont(n_species, 0.9) over () as richness_hotspot,
        n_threatened_species > 0
            and n_threatened_species >= quantile_cont(n_threatened_species, 0.9) over () as threatened_hotspot
    from per_cell
)
select *, (richness_hotspot and threatened_hotspot) as overlap
from flagged
order by cell;
