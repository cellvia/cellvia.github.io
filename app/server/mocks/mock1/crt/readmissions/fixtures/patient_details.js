module.exports = {
	success: {
		"patient_mrn" : "000234114",
		"first_name" : "John",
		"last_name" : "Black",
		"prediction" : "57.3",
		"date_admitted" : '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
		"location" : "6A",
		"discharge_date" : null,  
		"unit_contracted" : "Oncology",
		"visit_category" : "Urgent",
		"status" : "Checked in",
		"payer" : "Medicare",
		"risks" : [{ 
			"Description" : "Number of prior ED visits",
			"Notification" : "(> 3)"
		},{ 
			"Description" : "Comorbidities count",
			"Notification" : "(> 3)"
		}]
   },
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
};