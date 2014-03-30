module.exports = {
	success:  { 
		result: true, 
		total: 3,
		users: [
			{id: 5, tenant_id: 4, email: 'admin@site.com', username: 'admin', first_name: 'admin', last_name: 'admin', is_super_user: false, principals: [{ id: 1, code: 'readmissions', permissions_map: { view_readmissions_stratification: true, save_user: false } }] },
			{id: 4, tenant_id: 4, email: 'jpopper@site.com', username: 'jpopper', first_name: 'james', last_name: 'popper', is_super_user: false, principals: [{ id: 1, code: 'readmissions', permissions_map: { view_readmissions_stratification: true, save_user: false } }] },
			{id: 3, tenant_id: 4, email: 'fpopper@site.com', username: 'fpopper', first_name: 'frankie', last_name: 'popper', is_super_user: true, principals: [{ id: 1, code: 'readmissions', permissions_map: { view_readmissions_stratification: true, save_user: true } },{ id: 1, code: 'clinical_documentation', permissions_map: { view_readmissions_stratification: true, save_user: true } }] }
	]},
	failure: {result: false}
};