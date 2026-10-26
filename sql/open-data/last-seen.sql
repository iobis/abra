-- version: 0.1 2026-10-14
-- target: open-data
-- objective: first and last year each species was recorded (filter on last_year to flag species not recorded recently) (global)
select
    interpreted.species as species,
    min(interpreted.date_year) as first_year,
    max(interpreted.date_year) as last_year,
    count(*) as n_records
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
    and interpreted.species is not null
    and interpreted.date_year is not null
group by interpreted.species
order by max(interpreted.date_year), interpreted.species;
