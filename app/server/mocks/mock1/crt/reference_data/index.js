module.exports = {
	definition: {
		description: 'Reference Data',
		module_prefix: 'reference_data',
		url_prefix: '/reference-data',

		requests: [{
			uri: '/reference-data/search/icd9dx',
			title: 'Search ICD9 Dx Codes',
			method: 'GET',
			body: [{
				name: 'term',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: 'Returns icd9 diagnosis codes that have a match with the search term, either by code or from description',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/icd9dx').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/icd9dx').failure
				}]
			}]
		},{
			uri: '/reference-data/search/icd9px',
			title: 'Search ICD9 Px Codes',
			method: 'GET',
			body: [{
				name: 'term',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: 'Returns icd9 procedure codes that have a match with the search term, either by code or from description',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/icd9px').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/icd9px').failure
				}]
			}]
		},{
			uri: '/reference-data/search/ms-drg',
			title: 'Search MS Drg Codes',
			method: 'GET',
			body: [{
				name: 'keywords',
				type: 'string',
				description: 'A string the user types in to hone down the list',
				notes: '',
				required: false
			},{
				name: 'term',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: 'Returns ms-drg codes that have a match with the search term, either by code or from description',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/ms_drg').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/ms_drg').failure
				}]
			}]
		}]
	}
};