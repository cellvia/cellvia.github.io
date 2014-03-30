module.exports = {
	success: {
		discharge_statuses: [{
			id: 'inpatient',
			description: 'In-Patient'
		}, {
			id: 'discharged',
			description: 'Discharged'
		}],
		statuses: [{
			id: 0,
			description: 'Newly Admitted'
		},{
			id: 1,
			description: 'Under Review'
		}],
		predicted_dxs: [{
			id: 23,
			description: 'PNE'
		},{
			id: 27,
			description: 'CHF'
		}],
		payers: [{
			id: 12,
			description: 'Medicare'
		},{
			id: 63,
			description: 'HMO'
		}],
    locations: [{
      id: 'Floor2',
      description: 'Floor2'
    }]
	},
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
};
