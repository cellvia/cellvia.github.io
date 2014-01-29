module.exports = {
	success: {
		id: '1',
		account_number: '965580012-003',
		status: {
			id: 0,
			label: 'Follow Up'
		},
		patient: {
			last_name: 'Gill',
			first_name: 'Irene',
			gender: 'Female',
			age: 58,
      dob: '2012-1-1 10:00:00Z',
			mrn: '965580012-003'
		},
		payer: 'Medicare',
		history: [{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()+3)+' 10:00:00Z',
      action_type: 'update', // 'update' or 'create' or 'delete'
      entity: {
        type: 'status'
      },
      property_changes: [{
        property_name: '', // confirmation_status, poa, priority, 
        old_value: {
          id: 5,
          description: 'FOLLOW UP'
        },
        new_value: {
          id: 1,
          description: 'CONFIRMED'
        }
      }],
			author: {
				id: 6,
        first_name: 'Danny',
        last_name: 'Boy'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()+2)+' 10:00:00Z',
      action_type: 'create', // 'update' or 'create' or 'delete'
      entity: {
        type: 'comment'
      },
      property_changes: [],
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder',
				signature: 'Susan CaseWorker'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()+1)+' 10:00:00Z',
      action_type: 'create', // 'update' or 'create' or 'delete'
      entity: {
        type: 'encounter_icd9dx',
        data: 322 
      },
      property_changes: [{
        property_name: 'confirmation_status', // confirmation_status, poa, priority, 
        old_value: {
          id: 5,
          description: 'QUERIED'
        },
        new_value: {
          id: 1,
          description: 'CONFIRMED'
        }
      },{
        property_name: 'priority', // confirmation_status, poa, priority, 
        old_value: {
          id: 5,
          description: 'PRIMARY'
        },
        new_value: {
          id: 1,
          description: 'SECONDARY'
        }
      },{
        property_name: 'poa',
        old_value: {
          id: 5,
          description: 'NO'
        },
        new_value: {
          id: 1,
          description: 'YES'
        }
      }],
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()+1)+' 10:00:00Z',
      action_type: 'delete', // 'update' or 'create' or 'delete'
      entity: {
        type: 'encounter_icd9px',
        data: 320 
      },
      property_changes: [{
        property_name: 'confirmation_status', // confirmation_status, poa, priority, 
        old_value: {
          id: 5,
          description: 'QUERIED'
        }
      }],
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
      action_type: 'create', // 'update' or 'create' or 'delete'
      entity: {
        type: 'comment'
      },
      property_changes: [],
			author: {
				id: 6,
        first_name: 'Mike',
        last_name: 'Wilson'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
      action_type: 'update', //or 'create' or 'delete'
      entity: {
        type: 'encounter_icd9dx',
        data: 342 
      },
      property_changes: [{
        property_name: 'confirmation_status', // poa, priority, 
        old_value: {
          id: 5,
          description: 'CONFIRMED'
        },
        new_value: {
          id: 1,
          description: 'QUERIED'
        }
      },{
        property_name: 'priority', // confirmation_status, poa, priority, 
        old_value: {
          id: 5,
          description: 'SECONDARY'
        },
        new_value: {
          id: 1,
          description: 'PRIMARY'
        }
      },{
        property_name: 'poa',
        old_value: {
          id: 5,
          description: 'NO'
        },
        new_value: {
          id: 1,
          description: 'UNKNOWN'
        }
      }],
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
      action_type: 'create', // 'update' or 'create' or 'delete'
      entity: {
        type: 'comment'
      },
      property_changes: [],
			author: {
				id: 6,
        first_name: 'Mike',
        last_name: 'Wilson'
			}
		}],
		comments: [{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			comment: 'Dismissed 3 predicted dx.',
			system: true,
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder',
				signature: 'Susan CaseWorker'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()-1)+' 14:48:00Z',
			comment: '2 queries issued to Dr. Peters',
			system: false,
			author: {
				id: 6,
        first_name: 'Susan',
        last_name: 'CaseWorkder',
				signature: 'Susan CaseWorker'
			}
		},{
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate()-2)+' 12:30:00Z',
			comment: 'Assigned case to Susan CaseWorker',
			system: true,
			author: {
				id: 5,
				signature: 'Jane Admin'
			}
		}],
		dismissed_dxs: [],
		predicted_dxs: [{
			id: 14,
			code: 'A-900',
			label: 'Pneumonia',
			short_name: 'PN',

			clinical_indicators: [{
				id: 1,
				indicator: 'Chief Complaint',
				value: 'Persistent Cough',
				ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			},{
				id: 2,
				indicator: 'Chest X-ray',
				value: 'Infiltrate',
				ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
				notes: 'Ordering MD: Dr. James Mathis'
			},{
				id: 3,
				indicator: 'BUN',
				value: '> 19 mg/dl',
				ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
				notes: 'Ordering MD: Dr. James Mathis'
			},{
				id: 4,
				indicator: 'Admitting DX',
				value: 'Chest Pain',
				ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
				notes: 'Ordering MD: Dr. Robert Harris'
			},{
				id: 5,
				indicator: 'Blood Culture',
				value: 'Pneumoniae',
				ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
				notes: 'Ordering MD: Dr. James Mathis'
			}]
		}],

		common_indicators: [{
			id: 1,
			indicator: 'Chief Complaint',
			value: 'Persistent Cough',
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
		},{
			id: 2,
			indicator: 'Chest X-ray',
			value: 'Infiltrate',
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			notes: 'Ordering MD: Dr. James Mathis'
		},{
			id: 3,
			indicator: 'BUN',
			value: '> 19 mg/dl',
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			notes: 'Ordering MD: Dr. James Mathis'
		},{
			id: 4,
			indicator: 'Admitting DX',
			value: 'Chest Pain',
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			notes: 'Ordering MD: Dr. Robert Harris'
		},{
			id: 5,
			indicator: 'Blood Culture',
			value: 'Pneumoniae',
			ts: '2012-'+String(new Date().getMonth()+1)+'-'+String(new Date().getDate())+' 10:00:00Z',
			notes: 'Ordering MD: Dr. James Mathis'
		}],
		
		icd9dxs: [{
			id: '1',
			code_id: '1234',
			label: "\"Ac Inf Fol Trans",
			code: "999.34",
			comments: [],
			status: {
				code: "suspected",
				label: "Suspected",
				id: 3
			},
			priority: {
				code: "principal",
				label: "Principal Dx"
			},
			poa: {
				"code": "yes",
				"label": "Yes"
			}
		}],

		icd9pxs: [{
			id: '2',
			code_id: '12345',
			label: "Outside State Ambulance Serv",
			code: "A0021",
			comments: [],
			status: {
				code: "suspected",
				label: "Suspected"
			},
			priority: {
				code: "primary",
				label: "Primary"
			}
		}],

		msdrgs: [{
			id: '3',
			code_id: '1334',
			label: "HEART TRANSPLANT OR IMPLANT OF HEART ASSIST SYSTEM W MCC",
			code: "001",
			status: {
				code: "suspected",
				label: "Suspected",
				id: 3
			}
		}]
	},
	failure: {
		errors: [{
			type: 'Anomaly',
			data: []
		}]
	}
}
