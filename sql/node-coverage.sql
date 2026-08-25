select
    node_id,
    count(*) as n_records,
    count(distinct dataset_id) as n_datasets
from obis, unnest(node_ids) as t(node_id)
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by node_id
order by n_records desc;
