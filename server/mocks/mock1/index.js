module.exports = {
	code: 'crt',
	title: 'Crimson Real Time',
	description: 'Webservices API For all applications in the Crimson Real Time (CRT) Platform',
	sections: {
		account_management: require('./crt/account_management').definition,
		authentication: require('./crt/authentication').definition,
		clinical_documentation: require('./crt/clinical_documentation').definition,
		readmissions: require('./crt/readmissions').definition,
		reference_data: require('./crt/reference_data').definition,
		platform: require('./crt/platform').definition
	}
};