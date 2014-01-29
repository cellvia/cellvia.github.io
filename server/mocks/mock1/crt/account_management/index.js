module.exports = {
	definition: {
		description: 'Account Management',
		module_prefix: 'account_management',
		url_prefix: '/account-management',
		requests: [{
			uri: '/account-management/principals',
			title: 'Get All Principals',
			method: 'GET',
			body: [],
			responses: [{
				type: 'JSON',
				description: 'Gets all of the active applications.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/get_all_principals').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/get_all_principals').failure
				}]
			}]
		},{
			uri: '/account-management/secret-questions',
			title: 'Get All Secret Questions',
			method: 'GET',
			body: [],
			responses: [{
				type: 'JSON',
				description: 'Gets all of the active secret questions.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/get_all_secret_questions').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/get_all_secret_questions').failure
				}]
			}]
		},{
			uri: '/account-management/principal/:id',
			title: 'Get Principal By ID',
			method: 'POST',
			body: [],
			responses: [{
				type: 'JSON',
				description: 'Get a principal by id.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/get_principal_by_id').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/get_principal_by_id').failure
				}]
			}]
		},{
			uri: '/account-management/get-user/:id',
			title: 'Get User by ID',
			method: 'POST',
			body: [],
			responses: [{
				type: 'JSON',
				description: 'Get a user by id.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/get_user_by_id').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/get_user_by_id').failure
				}]
			}]
		},{
			uri: '/account-management/get-users',
			title: 'Get Users',
			method: 'GET',
			body: [{
				name: 'tenant_id',
				type: 'int',
				description: "Id of the user's tenant.",
				notes: '',
				required: false
			}],
			responses: [{
				type: 'JSON',
				description: 'Get users.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/get_users').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/get_users').failure
				}]
			}]
		},{
			uri: '/account-management/save-user/:id',
			title: 'Save Users',
			method: 'POST',
			body: [{
				name: 'username',
				type: 'string',
				description: "Must be unique across tenants.",
				notes: '',
				required: true
			},{
				name: 'email',
				type: 'string',
				description: "Must be unique across tenants.",
				notes: '',
				required: true
			},{
				name: 'principal:id:roles',
				type: 'comma delimited list',
				description: 'A list of all of the roles the user belonds to in a specific principal.',
				notes: "A valid name would is 'principal:1:roles' where 1 is the id of the application.  There may be several of these keys passed.",
				required: false
			},{
				name: 'deleted',
				type: 'int',
				description: '1/0 flag of whether or not the user is soft-deleted',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: 'Inserts or updates a user',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/save_user').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/save_user').failure
				}]
			}]
		}]
	}
};