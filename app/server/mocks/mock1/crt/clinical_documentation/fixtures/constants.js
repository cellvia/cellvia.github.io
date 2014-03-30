module.exports = {
	success: {
		case_status: [{
			id: 1,
			label: 'Follow Up'
		},{
			id: 2,
			label: 'Open Query'
		},{
			id: 3,
			label: 'Completed'
		},{
			id: 4,
			label: 'Not Reviewed'
		},{
			id: 5,
			label: 'Pass'
		}],
		diagnosis_confirmation_status: [{
			id: 1,
			label: 'Suspected'
		},{
			id: 2,
			label: 'Confirmed'
		}],
		diagnosis_priority: [{
			id: 1,
			label: 'Principal',
			code: 'principal'
		},{
			id: 2,
			label: 'Secondary',
			code: 'secondary'
		}],
		poa: [{
			id: 1,
			code: 'e',
			label: 'Not Applicable'
		},{
			id: 2,
			code: 'n',
			label: 'Not present on admission'
		},{
			id: 5,
			code: 'y',
			label: 'Present on Admission'
		}]
	},
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
};