var nconf = require('nconf'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(nconf.get('HTMLPath')+'/'+displayType+'/page.html');

module.exports = function(req, res, next){
	req.html.page = hyperglue(html, {
		'#page': { _html: "This is the page" }
	}).innerHTML;
	next();
}