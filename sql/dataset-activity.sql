select
    dataset_id,
    interpreted.date_year as year,
    count(*) as n_records
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by dataset_id, year
order by dataset_id, year;
