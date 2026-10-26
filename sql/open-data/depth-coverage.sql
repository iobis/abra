-- version: 0.1 2026-10-14
-- target: open-data
-- objective: records with minimum/maximum depth information (global)
with coverage as (
    select
        case
            when interpreted.minimumDepthInMeters is not null
                and interpreted.maximumDepthInMeters is not null then 'Both'
            when interpreted.minimumDepthInMeters is not null then 'Minimum depth only'
            when interpreted.maximumDepthInMeters is not null then 'Maximum depth only'
            else 'None'
        end as depth_coverage,
        count(*) as total
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
    group by depth_coverage
)
select
    depth_coverage,
    total,
    round(total * 100.0 / sum(total) over (), 2) as total_perc
from coverage
order by depth_coverage;
