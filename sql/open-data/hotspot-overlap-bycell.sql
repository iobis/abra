-- version: 0.1 2026-10-14
-- target: open-data
-- objective: cells in the top decile of richness and of threatened species, and whether both coincide (by grid cell)
with per_cell as (
    select
        count(distinct interpreted.species) as n_species,
        count(distinct case when interpreted.redlist_category in ('CR', 'EN', 'VU') then interpreted.species end) as n_threatened_species,
        -- [start cell block]
        h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
        -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
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
