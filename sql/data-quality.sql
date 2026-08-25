select
    count(case when len(flags) > 0 then 1 end) as n_records_flagged,
    count(case when len(missing) > 0 then 1 end) as n_records_missing,
    count(case when len(invalid) > 0 then 1 end) as n_records_invalid,
    round(avg(interpreted.coordinateUncertaintyInMeters), 1) as avg_coordinate_uncertainty,
    count(*) as n_records,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by cell;
