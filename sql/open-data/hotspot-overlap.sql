-- version: 0.1 2026-10-14
-- target: open-data
-- objective: overlap between richness hotspots and threatened-species hotspots (top decile of cells) (global)
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
select
    count(*) as n_cells,
    count(case when richness_hotspot then 1 end) as n_richness_hotspots,
    count(case when threatened_hotspot then 1 end) as n_threatened_hotspots,
    count(case when richness_hotspot and threatened_hotspot then 1 end) as n_overlap,
    round(100.0 * count(case when richness_hotspot and threatened_hotspot then 1 end)
        / nullif(count(case when threatened_hotspot then 1 end), 0), 2) as pct_threatened_hotspots_in_richness_hotspots
from flagged;
