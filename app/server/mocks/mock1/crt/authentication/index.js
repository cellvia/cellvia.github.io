module.exports = {
	definition: {
		description: 'Authentication',
		module_prefix: 'authentication',
		url_prefix: '/authentication',

		requests: [{
			uri: '/authentication/check-token',
			title: 'Check Token',
			method: 'POST',
			body: [{
				name: 'token',
				type: 'string',
				description: "Must be unique across tenants.  Expires after 24 hours.",
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: 'Check to see if the token is still valid.  True if it is, false otherwise.',
				examples: [{
					title: 'Success',
					conditional: 'default',
					json: require('./fixtures/check_token').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/check_token').failure
				}]
			}]
		},{
			uri: '/authentication/new-sign-in',
			title: 'New Sign In',
			method: 'POST',
			body: [{
				name: 'username',
				type: 'string',
				description: '',
				notes: '',
				required: true
			},{
				name: 'password',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'body.username.toLowerCase()==="admin" && body.password==="admin"',
					json: require('./fixtures/new_sign_in').success
				},{
					title: 'Caged',
					conditional: 'body.username.toLowerCase()==="caged"',
					json: require('./fixtures/new_sign_in').caged
				},{
					title: 'Locked',
					conditional: 'body.username.toLowerCase()==="locked"',
					json: require('./fixtures/new_sign_in').locked
				},{
					title: 'Failure',
					conditional: 'default',
					json: require('./fixtures/new_sign_in').failure
				}]
			}]
		},{
			uri: '/authentication/sign-in',
			title: 'Sign In',
			method: 'POST',
			body: [{
				name: 'username',
				type: 'string',
				description: '',
				notes: '',
				required: true
			},{
				name: 'password',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'body.username.toLowerCase()==="admin" && body.password==="admin"',
					json: require('./fixtures/sign_in').success
				},{
					title: 'Jordan',
					conditional: 'body.username.toLowerCase()==="jordan" && body.password==="jordan"',
					json: require('./fixtures/sign_in').jordan
				},{
					title: 'Erin',
					conditional: 'body.username.toLowerCase()==="erin" && body.password==="erin"',
					json: require('./fixtures/sign_in').erin
				},{
					title: 'Quentin',
					conditional: 'body.username.toLowerCase()==="quentin" && body.password==="quentin"',
					json: require('./fixtures/sign_in').quentin
				},{
					title: 'Nick',
					conditional: 'body.username.toLowerCase()==="nick" && body.password==="nick"',
					json: require('./fixtures/sign_in').nick
				},{
					title: 'Faqir',
					conditional: 'body.username.toLowerCase()==="faqir" && body.password==="faqir"',
					json: require('./fixtures/sign_in').faqir
				},{
					title: 'Allison',
					conditional: 'body.username.toLowerCase()==="allison" && body.password==="allison"',
					json: require('./fixtures/sign_in').allison
				},{
					title: 'Failure',
					conditional: 'default',
					json: require('./fixtures/sign_in').failure
				}]
			}]
		},{
			uri: '/authentication/sign-out',
			title: 'Sign Out',
			method: 'POST',
			body: [{
				name: 'user_id',
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
					json: require('./fixtures/sign_out').success
				},{
					title: 'Failure',
					conditional: 'body.sabotage===true',
					json: require('./fixtures/sign_out').failure
				}]
			}]
		},{
			uri: '/authentication/secret-question',
			title: 'Secret Question',
			method: 'POST',
			body: [{
				name: 'username',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'body.username==="admin"',
					json: require('./fixtures/secret_question').success
				},{
					title: 'Failure',
					conditional: 'default',
					json: require('./fixtures/secret_question').failure
				}]
			}]
		},{
			uri: '/authentication/answer-secret-question',
			title: 'Answer Secret Question',
			method: 'POST',
			body: [{
				name: 'username',
				type: 'string',
				description: '',
				notes: '',
				required: true
			},{
				name: 'answer',
				type: 'string',
				description: '',
				notes: '',
				required: true
			}],
			responses: [{
				type: 'JSON',
				description: '',
				examples: [{
					title: 'Success',
					conditional: 'body.answer==="admin"',
					json: require('./fixtures/answer_secret_question').success
				},{
					title: 'Failure',
					conditional: 'default',
					json: require('./fixtures/answer_secret_question').failure
				}]
			}],
			notes: [{
				title: 'Email',
				author: 'Jordan',
				when: '07/24/2012',
				note: '<div>The following email will be sent on successful responses</div><div>(to be written)</div>'
			}]
		},{
			uri: '/authentication/reset-password',
			title: 'Reset Password',
			method: 'POST',
			body: [{
				name: 'token',
				type: 'string',
				description: '',
				notes: '',
				required: true
			},{
				name: 'password',
				type: 'string',
				description: '',
				notes: '',
				required: true
			},{
				name: 'confirm_password',
				type: 'string',
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
					json: require('./fixtures/reset_password').success
				},{
					title: 'Complexity Failure',
					conditional: "body.password==='complexity'",
					json: require('./fixtures/reset_password').failure_complexity
				},{
					title: 'Confirm Failure',
					conditional: "body.password==='confirm'",
					json: require('./fixtures/reset_password').failure_complexity
				},{
					title: 'Confirm Token',
					conditional: "body.password==='token'",
					json: require('./fixtures/reset_password').failure_token
				}]
			}]
		}]
	}
};