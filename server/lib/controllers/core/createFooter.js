var nconf = require('nconf'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(nconf.get('HTMLPath')+'/'+displayType+'/footer.html');

module.exports = function(req, res, next){
	req.html.footer = hyperglue(html, {
		'#footer': { _html: "This is the footer" }
	}).innerHTML;
	next();
}