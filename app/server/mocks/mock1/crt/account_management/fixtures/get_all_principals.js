module.exports.success = { 
	result: true,
	principals: 
	[{ 
		id: 5,
		description: 'readmissions',
		roles: 
		[{ 
			description: 'administrator',
			permissions: [ 'view_readmissions_stratification','create_user']
		},{ 
			description: 'case_manager',
	    	permissions: [ 'view_readmissions_stratification'] 
	    }]
	 }] 
};
module.exports.failure = {result: false};