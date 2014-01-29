module.exports = {
	success: {result: true},
	failure: {result: false, errors: [
		{attribute: 'email', type: 'unique', data: null},
		{attribute: 'username', type: 'unique', data: null}
	]}
};