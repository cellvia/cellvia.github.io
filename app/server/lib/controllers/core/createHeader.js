var conf = require('confify'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(conf.paths.root + conf.paths.sharedHtml+'/'+displayType+'/header.html');

module.exports = function(req, res, next){
	// function createHeader(){
	// 	return hyperglue()
	// }

	req.html.header = hyperglue(html, {
		// '#header': { _html: "the header" }
	}).innerHTML;

	next();
}
