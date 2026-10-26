-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of records (identified to species) per year (global)
select
    interpreted.date_year as date_year,
    count(interpreted.species) as total
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
        and interpreted.date_year is not null
group by interpreted.date_year
order by date_year;
