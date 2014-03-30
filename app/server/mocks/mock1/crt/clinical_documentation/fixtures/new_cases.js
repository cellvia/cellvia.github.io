module.exports = {
	success: {
		total: 4,
		encounters: [{
			id: 11,
			confirmed_drg: 'pneumonia',
			status: 'Newly Admitted',
			admitted_date: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			patient: {
				last_name: 'Gibbons',
				first_name: 'Peter',
				gender: 'Male',
				age: 58,
				mrn: '123175'
			},
			payer: 'Medicare',
			location: 'R207',
			predicted_dxs: ['PNE', 'HTN']
		},{
			id: 13,
			confirmed_drg: '',
			status: 'Recently Admitted',
			admitted_date: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()-1)+' 10:00:00',
			patient: {
				last_name: 'Franklin',
				first_name: 'Timmy',
				gender: 'Female',
				age: 76,
				mrn: '847201'
			},
			payer: 'Medicaid',
			location: 'R209',
			predicted_dxs: ['CHF']
		},{
			id: 27,
			confirmed_drg: 'common cold',
			status: 'Recently Admitted',
			admitted_date: '2012-03-04 10:00:00',
			patient: {
				last_name: 'Becker',
				first_name: 'Jim',
				gender: 'Male',
				age: 30,
				mrn: '920817'
			},
			payer: 'Medicare',
			location: 'R156',
			predicted_dxs: []
		}]
	},
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
}