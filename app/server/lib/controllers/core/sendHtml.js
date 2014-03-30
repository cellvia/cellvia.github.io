var hyperglue = require('hyperglue');
module.exports = function(req, res){
		var rendered = hyperglue(req.html.layout, {
			'body': { _html: req.html.header+req.html.page+req.html.footer }
		}).innerHTML;
		res.end(rendered);
	}