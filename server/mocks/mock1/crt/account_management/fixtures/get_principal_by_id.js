module.exports = {
	success: { result: true, principal: { id: 5, description: 'readmissions', roles: [{ description: 'administrator', permissions: ['view_readmissions_stratification', 'create_user'] }, {description: 'case_manager', permissions: ['view_readmissions_stratification']}]}} ,
	failure: {result: false}
};