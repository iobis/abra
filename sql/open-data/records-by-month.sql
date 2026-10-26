-- version: 0.1 2026-10-14
-- target: open-data
-- objective: number of records (identified to species) per month (global)
with monthly as (
    select
        extract(month from to_timestamp(interpreted.date_mid / 1000))::int as month,
        count(interpreted.species) as total
    from obis
    where
        -- [start conditions]
        dropped is not true and absence is not true
        -- [end conditions]
            and interpreted.date_mid is not null
    group by month
)
select
    month,
    total,
    extract(quarter from make_date(2000, month, 1)) as quarter
from monthly
order by month;
