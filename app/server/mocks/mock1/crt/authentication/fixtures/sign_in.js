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
			principal_map: {
				crimson: { access: true },
				readmissions: { access: true },
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	jordan: {
		result: true, 
		user: 
		{ 
			id: 2,
			tenant_id: 4,
			first_name: "Jordan", 
			last_name: "Washburn", 
			username: "Jordan",
			principal_map: {
				crimson: { access: true },
				readmissions: { access: true },
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	erin: {
		result: true, 
		user: 
		{ 
			id: 3,
			tenant_id: 4,
			first_name: "Erin", 
			last_name: "Ammon", 
			username: "Erin",
			principal_map: {
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	quentin: {
		result: true, 
		user: 
		{ 
			id: 4,
			tenant_id: 4,
			first_name: "Quentin", 
			last_name: "Conner", 
			username: "Quentin",
			principal_map: {
				crimson: { access: true },
				readmissions: { access: true },
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	nick: {
		result: true, 
		user: 
		{ 
			id: 5,
			tenant_id: 4,
			first_name: "Nicholas", 
			last_name: "Becker", 
			username: "nick",
			principal_map: {
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	faqir: {
		result: true, 
		user: 
		{ 
			id: 6,
			tenant_id: 4,
			first_name: "Faqir", 
			last_name: "Ahmed", 
			username: "faqir",
			principal_map: {
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	allison: {
		result: true, 
		user: 
		{ 
			id: 7,
			tenant_id: 4,
			first_name: "Allison", 
			last_name: "Novick", 
			username: "allison",
			principal_map: {
				clinical_documentation: { access: true }
			}
		},
		token: "12345678-1234-1234-123456789ABC"
	},
	failure: {result: false}
}