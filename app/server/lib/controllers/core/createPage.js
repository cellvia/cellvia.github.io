var conf = require('confify'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(conf.paths.root + conf.paths.sharedHtml+'/'+displayType+'/page.html');

module.exports = function(req, res, next){
	req.html.page = hyperglue(html, {
		// '#page': { _html: "This is the page" }
	}).innerHTML;
	next();
}