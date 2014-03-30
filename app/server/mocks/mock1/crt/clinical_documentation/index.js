module.exports = {
	definition: {
		description: 'Clinical Documentation',
		module_prefix: 'clinical_documentation',
		url_prefix: '/clinical-documentation',

		requests: [{
			uri: '/clinical-documentation/case/:id/',
			title: 'Change Case Status',
			method: 'PUT',
			triggers: [{
				trigger: 'cache:clinical-documentation:case:status',
				data: [{
					name: 'tenant_id',
					type: 'int',
					description: ''
				}, {
					name: 'user',
					type: 'object',
					description: 'This is the user that committed the change - {first_name, last_name, id}'
				},{
					name: '_case',
					type: 'object',
					description: 'Case details DTO'
				}],
			}],
			body: [{
				name: 'id',
				type: 'int',
				description: 'ID of the new case status',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/case_status').success
				}]
			}],
		},{
			uri: '/clinical-documentation/case/:id/comment',
			title: 'Comment on a Case',
			method: 'POST',
			triggers: [{
				trigger: 'cache:clinical-documentation:case:comment',
				data: [{
					name: 'tenant_id',
					type: 'int',
					description: ''
				}, {
					name: 'user',
					type: 'object',
					description: 'This is the user that committed the change - {first_name, last_name, id}'
				},{
					name: '_case',
					type: 'object',
					description: 'Case details DTO'
				},{
					name: 'comment',
					type: 'object',
					description: 'Comment DTO'
				}],
			}],
			body: [{
				name: 'id',
				type: 'int',
				description: 'ID of the case/encounter has code join.',
				notes: 'Update if the id is present; otherwise, insert.  Probably will not be used.',
				required: false
			},{
				name: 'comment',
				type: 'string',
				description: 'The author of the comment is determined by the x-crt-authorization header',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/comment_code').success
				}]
			}],
		},{
			uri: '/clinical-documentation/constants',
			title: 'Constants',
			method: 'GET',
			body: [],
			responses: [{
				type: 'JSON',
				description: 'Returns a collection of constants used in reference data (usually including some form of id or value combined with descriptive text).',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/constants').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/constants').failure
				}]
			}]
		},{
			uri: '/clinical-documentation/case/:id/assign_code',
			title: 'Assign Code',
			method: 'POST',
			triggers: [{
				trigger: 'cache:clinical-documentation:chc:status',
				data: [{
					name: 'tenant_id',
					type: 'int',
					description: ''
				},{
					name: 'user',
					type: 'object',
					description: 'This is the user that committed the change - {first_name, last_name, id}'
				},{
					name: 'code',
					type: 'object',
					description: 'Code that was assigned {label, code, code_type}'
				},{
					name: 'messages',
					type: 'list',
					description: 'Additional messages to be displayed - ("Ac Inf Fol Trans (999.34) is now a secondary dx)'
				},{
					name: '_case',
					type: 'object',
					description: 'Case details DTO'
				}]
			}],
			body: [{
				name: 'id',
				type: 'int',
				description: 'ID of the case/encounter has code join.',
				notes: 'Update if the id is present; otherwise, insert',
				required: false
			},{
				name: 'poa',
				type: 'int',
				description: 'ID given from the constants of the chosen POA',
				notes: 'Is required for ICD9 Dxs, not required for ICD9 Pxs or MSDRGs',
				required: false
			},{
				name: 'code_type',
				type: 'string',
				description: 'The type of the code being assigned.',
				notes: '',
				required: true
			},{
				name: 'code_id',
				type: 'int',
				description: 'ID of the code, same as the id from the icd9 or msdrg searches in reference-data',
				notes: '',
				required: true
			},{
				name: 'comment',
				type: 'string',
				description: 'The author of the comment is determined by the x-crt-authorization header',
				notes: 'The comment will be retrieved in when referencing the specific code in the context of the case, and also the case as a whole.',
				required: false
			},{
				name: 'dx_priority',
				type: 'int',
				description: 'Diagnosis Priority ID from reference data constants',
				notes: 'Required for ICD9dx and ICD9px, not required for MSDRGs',
				required: false
			},{
				name: 'dx_confirmation_status',
				type: 'int',
				description: 'Diagnosis Confirmation ID from the reference data constants',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/assign_code').success
				}]
			}],
			notes: [{
				title: 'Assign Rules',
				author: 'Jordan',
				when: '07/12/2012',
				note: '<ul><li>ICD9Dxs and ICD9Pxs have confirmation statuses (confirmed, suspected) and priorities (primary, secondary)</li><li>There can be only 1 confirmed/primary ICD9Dx or ICD9Px</li><li>There can be 25 confirmed/secondary ICD9Dx or ICD9Px</li><li>There can be 25 suspected/primary ICD9Dx or ICD9Px</li><li>There can be 25 suspected/secondary ICD9Dx or ICD9Px</li><li>When an ICD9Dx or ICD9Px is set to confirmed/primary, all other confirmed/primary ICD9Dxs or ICD9Pxs are moved to confirmed/secondary.  A message for each code turned this way should be generated and sent along with the trigger</li><li>When an confirmed MS-DRG is assigned, all other confirmed MS-DRGs are removed</li></ul>'
			}]
		},{
			uri: '/clinical-documentation/case/:id/dismiss_code',
			title: 'Dismiss Code',
			method: 'POST',
			triggers: [{
				trigger: 'cache:clinical-documentation:chc:dismiss',
				data: [{
					name: 'tenant_id',
					type: 'int',
					description: ''
				}, {
					name: 'user',
					type: 'object',
					description: 'This is the user that committed the change - {first_name, last_name, id}'
				},{
					name: 'code',
					type: 'object',
					description: 'Code that was ignored {label, code}'
				},{
					name: 'messages',
					type: 'list',
					description: 'Additional messages to be displayed - ("Ac Inf Fol Trans (999.34) is now a secondary dx)'
				},{
					name: '_case',
					type: 'object',
					description: 'Case details DTO'
				}]
			}],
			body: [{
				name: 'id',
				type: 'int',
				description: 'ID of the case/encounter has code join.',
				notes: 'Update if the id is present; otherwise, insert',
				required: false
			},{
				name: 'code_type',
				type: 'string',
				description: 'The type of the code being dismissed.',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/dismiss_code').success
				}]
			}]
		},{
			uri: '/clinical-documentation/case/:id',
			title: 'Case Details',
			method: 'GET',
			body: [],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/case').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage === true',
					json: require('./fixtures/case').failure
				}]
			}]
		},{
			uri: '/clinical-documentation/new-cases',
			title: 'New Cases',
			method: 'POST',
			body: [{
				name: 'filters.statuses',
				type: 'int[]',
				description: 'Status codes to restrict results to.',
				notes: '',
				required: false
			},{
				name: 'filters.possible_diagnosis_diagnosis_ids',
				type: 'int[]',
				description: 'Diagnosis ids of possible diagnoses to restrict results to',
				notes: '',
				required: false
			},{
				name: 'filters.payers',
				type: 'string[]',
				description: 'Payers to restrict results to.',
				notes: '',
				required: false
			},{
				name: 'filters.locations',
				type: 'string[]',
				description: 'Patient location string that all results must contain.',
				notes: '',
				required: false
			},{
				name: 'filters.discharge_statuses',
				type: 'string[]',
				description: 'Discharge status identifiers that define what the discharge status of all results should be.',
				notes: '',
				required: false
			},{
				name: 'filters.start_admission_date',
				type: 'string',
				description: 'Earliest admission date for results.',
				notes: 'format: yyyy-mm-dd hh:mm:ss',
				required: true
			},{
				name: 'filters.end_admission_date',
				type: 'string',
				description: 'Latest admission date for results.',
				notes: 'format: yyyy-mm-dd hh:mm:ss',
				required: true
			},{
				name: 'sort.sort_on',
				type: 'string',
				description: 'What to sort the results list on.',
				notes: 'possible values: patient, status, admit_date, payer, possible_dx, confirmed_drg, location',
				required: true
			},{
				name: 'sort.descending',
				type: 'bool',
				description: 'Whether results should be sorted descending.',
				notes: '"true" or "false"',
				required: true
			},{
				name: 'offset',
				type: 'int',
				description: '',
				notes: '',
				required: true
			},{
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
					json: require('./fixtures/new_cases').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage === true',
					json: require('./fixtures/new_cases').failure
				}]
			}]
		},{
			uri: '/clinical-documentation/new-cases/filter-values',
			title: 'New Cases Filter Values',
			method: 'POST',
			body: [{
				name: 'start_date',
				type: 'string',
				description: "Earliest admission date for encounters.",
				notes: 'format: yyyy-mm-dd hh:mm:ss',
				required: true
			},{
				name: 'end_date',
				type: 'string',
				description: "Latest admission date for encounters.",
				notes: 'format: yyyy-mm-dd hh:mm:ss',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/filter_values').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage === true',
					json: require('./fixtures/filter_values').failure
				}]
			}]
		}]
	}
};