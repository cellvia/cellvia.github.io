var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	initialize: function(opts){
		console.log("error!"+opts.errorCode);		
	}
})
