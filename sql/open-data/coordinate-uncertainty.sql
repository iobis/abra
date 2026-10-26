-- version: 0.1 2026-10-14
-- target: open-data
-- objective: distribution of coordinate uncertainty (meters) and share of records without it (global)
select
    count(*) as n_records,
    count(interpreted.coordinateUncertaintyInMeters) as n_with_uncertainty,
    round(100.0 * (count(*) - count(interpreted.coordinateUncertaintyInMeters)) / count(*), 2) as pct_missing,
    min(interpreted.coordinateUncertaintyInMeters) as min_uncertainty,
    quantile_cont(interpreted.coordinateUncertaintyInMeters, 0.5) as median_uncertainty,
    quantile_cont(interpreted.coordinateUncertaintyInMeters, 0.9) as p90_uncertainty,
    max(interpreted.coordinateUncertaintyInMeters) as max_uncertainty,
    count(case when interpreted.coordinateUncertaintyInMeters <= 100 then 1 end) as n_le_100m,
    count(case when interpreted.coordinateUncertaintyInMeters > 100 and interpreted.coordinateUncertaintyInMeters <= 1000 then 1 end) as n_100m_1km,
    count(case when interpreted.coordinateUncertaintyInMeters > 1000 and interpreted.coordinateUncertaintyInMeters <= 10000 then 1 end) as n_1km_10km,
    count(case when interpreted.coordinateUncertaintyInMeters > 10000 then 1 end) as n_gt_10km
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
;
