module.exports = {
    definition: {
        description: 'Readmissions',
        module_prefix: 'readmissions',
        url_prefix: '/readmissions',

        requests: [{
            uri: '/readmissions/application-status',
            title: 'Application Status',
            method: 'GET',
            body: [],
            responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/application_status').success
                },{
                    title: 'SQL Server Failure',
                    conditional: 'body.sabotage==="sql_server_failure"',
                    json: require('./fixtures/application_status').sql_server_failure
                },{
                    title: 'Data Load Failure',
                    conditional: 'body.sabotage==="data_load_falure"',
                    json: require('./fixtures/application_status').data_load_falure
                },{
                    title: 'Critical Error Logged',
                    conditional: 'body.sabotage==="critical_error_logged"',
                    json: require('./fixtures/application_status').critical_error_logged
                }]
            }],
            notes: [{
                title: 'Critical Error Logged',
                author: 'Jordan',
                when: 'Sept 4',
                note: 'This is intended to be a general failure status.  Check if any critical issues are in the log, if they are - report them until they are addressed.'
            }]
        },{
            uri: '/readmissions/risk-stratification',
            title: 'Risk Stratification',
            method: 'POST',
            body: [{
                name: 'location',
                type: 'string',
                description: 'matches anything that starts with this string, case insensitive',
                notes: '',
                required: false
            },{
                name: 'risk',
                type: 'string',
                description: 'high, moderate, low are all acceptable strings to pass',
                notes: '',
                required: false
            }, {
                name: 'payer',
                type: 'string',
                description: '',
                notes: '',
                required: false
            }, {
                name: 'age',
                type: 'list',
                description: 'Low boundary, High Boundary.  ex: [50,90]',
                notes: '',
                required: false
            }, {
                name: 'sort',
                type: 'string',
                description: 'ex: last_name:asc,first_name:desc,age:asc',
                notes: '',
                required: false
            }, {
                name: 'offset',
                type: 'int',
                description: '',
                notes: '',
                required: true
            }, {
                name: 'limit',
                type: 'int',
                description: '',
                notes: '',
                required: true
            }],

            responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/risk_stratification').success
                }, {
                    title: 'Failure',
                    conditional: 'body.sabotage===true',
                    json: require('./fixtures/risk_stratification').failure
                }]
            }],
            notes: [{
                title: 'Possible Risk Indicators',
                author: 'Karoline',
                when: '5/16/2012',
                note: "<ol><li>Age – would be good to list age if greater than 70 years</li><li>Number of prior hospitalizations - expressed as either a count or exceeding a threshold value (c.f. with Cody)</li><li>Number of prior ED visits - expressed as either a count or exceeding a threshold value (c.f. with Cody)</li><li>Admission Source – specify if from nursing home, skilled nursing facility, or other post-acute care setting</li><li>Key Comorbidities – specify CHF, AMI, PN, COPD, Diabetes, Renal Failure, Obesity in prior history or via the ADT feed</li><li>Comorbidity Count – express as a count or exceeding a threshold value (c.f. with Cody)</li><li>Polypharmacy – Cody, what is the threshold number of meds here? (NB: we could show this for those without PMH if we took in pharmacy or order data)</li><li>Psychiatric history/Psychiatric issue</li><li>History of alcohol use/Alcohol use</li><li>History of substance use/Substance use</li></ol>"
            }]
        },
        {
            uri: '/readmissions/patient-details',
            title: 'Patient Details',
            method: 'POST',
            body: [{
                name: 'patientMrn',
                type: 'string',
                description: 'pass the patient mrn for the full details of the patient',
                notes: '',
                required: true
            }],
            responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/patient_details').success
                }, {
                    title: 'Failure',
                    conditional: 'body.sabotage===true',
                    json: require('./fixtures/patient_details').failure
                }]
            }]
        },

        {
            uri: '/readmissions/payers',
            title: 'Payers',
            method: 'GET',
            responses: [{
                type: 'JSON',
                description: '',
                examples: [{
                    title: 'Success',
                    conditional: 'default',
                    json: require('./fixtures/payers_by_day').success
                }, {
                    title: 'Failure',
                    conditional: 'body.sabotage===true',
                    json: require('./fixtures/payers_by_day').failure
                }]
            }]
        }]
    }
};