-- version: 0.1 2026-10-14
-- target: open-data
-- objective: records with minimum/maximum depth information (by grid cell)
with coverage as (
    select
        case
            when interpreted.minimumDepthInMeters is not null
                and interpreted.maximumDepthInMeters is not null then 'Both'
            when interpreted.minimumDepthInMeters is not null then 'Minimum depth only'
            when interpreted.maximumDepthInMeters is not null then 'Maximum depth only'
            else 'None'
        end as depth_coverage,
        count(*) as total,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
    group by cell, depth_coverage
)
select
    cell, depth_coverage,
    total,
    round(total * 100.0 / sum(total) over (partition by cell), 2) as total_perc
from coverage
order by cell, depth_coverage;
