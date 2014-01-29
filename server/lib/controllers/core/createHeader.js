var nconf = require('nconf'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(nconf.get('HTMLPath')+'/'+displayType+'/header.html');

module.exports = function(req, res, next){
	// function createHeader(){
	// 	return hyperglue()
	// }

	req.html.header = hyperglue(html, {
		'#header': { _html: "the header" }
	}).innerHTML;

	next();
}
