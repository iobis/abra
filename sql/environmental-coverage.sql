select
    count(interpreted.sst) as n_records_sst,
    count(interpreted.sss) as n_records_sss,
    count(case when interpreted.depth is not null and interpreted.bathymetry is not null
        and abs(interpreted.depth - interpreted.bathymetry) > 500 then 1 end) as n_records_depth_mismatch,
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
