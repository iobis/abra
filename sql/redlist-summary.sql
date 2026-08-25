select
    coalesce(interpreted.redlist_category, 'NE') as redlist_category,
    count(distinct interpreted.species) as n_species,
    count(*) as n_records
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by redlist_category
order by n_records desc;
