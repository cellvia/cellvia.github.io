var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	initialize: function(opts){
		alert("error!"+opts.errorCode);		
	}
})
