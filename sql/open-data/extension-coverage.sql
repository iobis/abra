-- version: 0.1 2026-10-14
-- target: open-data
-- objective: share of records with an extendedMeasurementOrFact or DNA extension (global)
select
    count(*) as n_records,
    count(case when len(extensions."http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact") > 0 then 1 end) as n_records_emof,
    count(case when len(extensions."http://rs.gbif.org/terms/1.0/DNADerivedData") > 0 then 1 end) as n_records_dna,
    round(100.0 * count(case when len(extensions."http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact") > 0 then 1 end) / count(*), 2) as pct_records_emof,
    round(100.0 * count(case when len(extensions."http://rs.gbif.org/terms/1.0/DNADerivedData") > 0 then 1 end) / count(*), 2) as pct_records_dna,
    count(distinct case when len(extensions."http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact") > 0 then dataset_id end) as n_datasets_emof,
    count(distinct case when len(extensions."http://rs.gbif.org/terms/1.0/DNADerivedData") > 0 then dataset_id end) as n_datasets_dna
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
;
