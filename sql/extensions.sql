select
    count(distinct case when len(extensions."http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact") > 0 then dataset_id end) as n_datasets_emof,
    count(distinct case when len(extensions."http://rs.gbif.org/terms/1.0/DNADerivedData") > 0 then dataset_id end) as n_datasets_dna,
    count(case when len(extensions."http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact") > 0 then 1 end) as n_records_emof,
    count(case when len(extensions."http://rs.gbif.org/terms/1.0/DNADerivedData") > 0 then 1 end) as n_records_dna,
    -- [start cell block]
    h3_latlng_to_cell_string(interpreted.decimalLatitude, interpreted.decimalLongitude, 6) as cell
    -- [end cell block]
from obis
where 
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by cell;