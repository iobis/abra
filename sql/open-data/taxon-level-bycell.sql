-- version: 0.1 2026-10-14
-- target: open-data
-- objective: taxonomic level to which each distinct taxon is resolved (by grid cell)
with species_list as (
    select distinct
        interpreted.species, interpreted.genus, interpreted.family,
        interpreted.order, interpreted.class, interpreted.phylum, interpreted.kingdom,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
),
ranked as (
    select
        cell, case
            when species is not null then 'Species'
            when genus is not null then 'Genus'
            when family is not null then 'Family'
            when "order" is not null then 'Order'
            when class is not null then 'Class'
            when phylum is not null then 'Phylum'
            when kingdom is not null then 'Kingdom'
            else 'Other'
        end as higher_level
    from species_list
)
select
    cell, higher_level,
    count(*) as total,
    count(*) * 100.0 / sum(count(*)) over (partition by cell) as total_perc
from ranked
group by cell, higher_level
order by cell, case higher_level
    when 'Species' then 1 when 'Genus' then 2 when 'Family' then 3
    when 'Order' then 4 when 'Class' then 5 when 'Phylum' then 6
    when 'Kingdom' then 7 else 8 end;
