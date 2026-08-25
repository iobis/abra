select
    interpreted.date_year as year,
    count(*) as n_records,
    count(distinct dataset_id) as n_datasets
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by year
order by year;
