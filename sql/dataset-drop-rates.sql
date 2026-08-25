-- intentionally not filtering on dropped/absence here, since the point is to measure their rates
select
    dataset_id,
    count(*) as n_records,
    count(case when dropped is true then 1 end) as n_dropped,
    count(case when absence is true then 1 end) as n_absence,
    round(100.0 * count(case when dropped is true then 1 end) / count(*), 2) as pct_dropped,
    round(100.0 * count(case when absence is true then 1 end) / count(*), 2) as pct_absence
from obis
group by dataset_id
order by pct_dropped desc;
