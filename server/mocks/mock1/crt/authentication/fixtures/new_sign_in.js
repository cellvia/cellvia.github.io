module.exports = {
	success: {
		result: true, 
		user: 
		{ 
			id: 1,
			tenant_id: 4,
			first_name: "Admin", 
			last_name: "Admin", 
			username: "admin",
			tenants: [{
				id: 3,
				description: 'Lancaster',
				applications: [{
					code: 'cdi',
					to: 'http://127.0.0.1:3000/auth/',
					description: 'Clinical Documentation',
					permission_map: {}
				},{
					code: 'readmissions',
					to: 'http://127.0.0.1:3000/auth/',
					description: 'Readmissions',
					permission_map: {}
				}]
			},{
				id: 4,
				description: 'Virginia Hospital Center',
				applications: [{
					code: 'readmissions',
					to: 'http://127.0.0.1:3000/auth/',
					description: 'Readmissions',
					permission_map: {}
				}]
			}]
		},
		token: "12345678-1234-1234-123456789ABC",
		caged: false,
		super: true
	},
	caged: {
		result: true,
		caged: true,
		user: 
		{ 
			id: 1,
			tenant_id: 4,
			first_name: "Admin", 
			last_name: "Admin", 
			username: "admin",
			tenants: [{
				id: 4,
				description: 'Virginia Hospital Center',
				applications: [{
					code: 'readmissions',
					to: 'http://127.0.0.1:3000/auth/',
					description: 'Readmissions',
					permission_map: {}
				}]
			}]
		},
		token: "12345678-1234-1234-123456789ABC",
		super: true
	},
	locked: {
		result: false,
		attempts: 0,
		locked: true
	},
	failure: {
		result: false,
		attempts: 4,
		locked: false
	}
};