-- version: 0.1 2026-10-14
-- target: open-data
-- objective: WRiMS-flagged species (e.g. introduced or invasive) and records over time (global)
select
    interpreted.date_year as year,
    count(distinct case when interpreted.wrims is true then interpreted.species end) as n_species_wrims,
    count(case when interpreted.wrims is true then 1 end) as n_records_wrims,
    count(distinct interpreted.species) as n_species,
    count(*) as n_records
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
    and interpreted.date_year is not null
group by interpreted.date_year
order by year;
