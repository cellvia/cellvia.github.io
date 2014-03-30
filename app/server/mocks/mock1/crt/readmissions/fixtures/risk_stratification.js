module.exports = {
	success: {
		date_last_loaded: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
		total: 240,
		admissions: [{
      risk_value : 85.82,
			risk : 'high', 
			patient: {
				last_name: 'Gibbons',
				first_name: 'Peter',
				mrn: '102030',
				gender: {id: 1, description: 'Male'},
				age: 58,
				phone_number: '(512) 394-1214'
			} ,
			admitted_date: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			current_los: 5,
			readmission: false,
			key_penalty_category: false,
			estimated_los: {
				value: 5 ,
				units: 'days'
			},
			payer: {
				description: 'Medicare'
			},
			physician: {
				id: 12 ,
				last_name: 'Jonathon' ,
				first_name: 'Swift' 
			},
			location: {
				room: '207'
			},
			risk_indicators: [{
				id: 12 ,
				description: 'Age 78 years old.'
			},{
				id: 17 ,
				description: '6 Prior Hospitalizations'
			}],
		},{
			risk_value: 55.82,
            risk : 'high',
			patient: {
				mrn: '776563',
				last_name: 'Kordona',
				first_name: 'Diana',
				gender: {id: 2, description: 'Female'},
				age: 83,
				phone_number: '(512) 328-3811'
			} ,
			admitted_date: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()-1)+' 10:00:00',
			current_los: 3,
			readmission: false,
			key_penalty_category: true,
			estimated_los: {
				value: 1 ,
				units: 'days'
			},
			payer: {
				description: 'Medicare'
			},
			physician: {
				id: 12 ,
				last_name: 'Jonathon' ,
				first_name: 'Swift' 
			},
			location: {
				room: '117'
			},
			risk_indicators: [{
				id: 14,
				description: '7 ED Visits'
			}]
		},{
			risk_value : 45.82,
            risk : 'high',  
			patient: {
				last_name: 'Roberts',
				first_name: 'Michael',
				mrn: '776563',
				gender: {id: 1, description: 'Male'},
				age: 38,
				phone_number: '(512) 394-1214'
			} ,
			admitted_date: '2012-03-04 10:00:00',
			current_los: 4,
			readmission: true,
			key_penalty_category: true,
			estimated_los: {
				value: 1 ,
				units: 'days'
			},
			payer: {
				description: 'Medicare'
			},
			physician: {
				id: 12 ,
				last_name: 'Jonathon' ,
				first_name: 'Swift' 
			},
			location: {
				room: '117'
			},
			risk_indicators: [{
				id: 7,
				description: '2 Comorbidity Count'
			}]
		},{
			risk_value : 15.82,
            risk : 'moderate',  
			patient: {
				last_name: 'Hamm',
				first_name: 'Julia',
				mrn: '858201',
				gender: {id: 1, description: 'Female'},
				age: 43,
				phone_number: '(512) 300-1214'
			} ,
			admitted_date: '2012-03-02 10:00:00',
			current_los: 4,
			readmission: true,
			key_penalty_category: true,
			estimated_los: {
				value: 1 ,
				units: 'days'
			},
			payer: {
				description: 'Medicare'
			},
			physician: {
				id: 12 ,
				last_name: 'Jonathon' ,
				first_name: 'Swift' 
			},
			location: {
				room: '117'
			},
			risk_indicators: [{
				id: 17 ,
				description: '6 Prior Hospitalizations'
			}]
		}]
	},
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
}