-- version: 0.1 2026-10-14
-- target: speciesgrids
-- objective: richness at species, genus, family, order, class and phylum level, and number of records (by grid cell)
-- speciesgrids has one row per (cell, species) with a record count: records are
-- OBIS + GBIF occurrences identified to species, so rows cannot be split by year.
with base as (
    select
        species, genus, family, "order", class, phylum,
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
    count(distinct species) as n_species,
    count(distinct genus) as n_genus,
    count(distinct family) as n_family,
    count(distinct "order") as n_order,
    count(distinct class) as n_class,
    count(distinct phylum) as n_phylum,
    sum(records)::bigint as n_records,
    cell
from base
group by cell
order by cell;
