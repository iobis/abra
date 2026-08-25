-- basisOfRecord is inconsistently cased/coded across datasets, so values are normalized here
select
    case
        when lower(interpreted.basisOfRecord) like '%human%' then 'HumanObservation'
        when lower(interpreted.basisOfRecord) like '%machine%' then 'MachineObservation'
        when lower(interpreted.basisOfRecord) like '%preserved%' then 'PreservedSpecimen'
        when lower(interpreted.basisOfRecord) like '%material_sample%'
            or lower(interpreted.basisOfRecord) like '%materialsample%' then 'MaterialSample'
        when lower(interpreted.basisOfRecord) like '%living%' then 'LivingSpecimen'
        when lower(interpreted.basisOfRecord) like '%fossil%' then 'FossilSpecimen'
        when lower(interpreted.basisOfRecord) like '%citation%' then 'MaterialCitation'
        when lower(interpreted.basisOfRecord) = 'occurrence' then 'Occurrence'
        when interpreted.basisOfRecord is null then 'Unknown'
        else 'Other'
    end as basis_of_record,
    count(*) as n_records
from obis
where
    -- [start conditions]
    dropped is not true and absence is not true
    -- [end conditions]
group by basis_of_record
order by n_records desc;
