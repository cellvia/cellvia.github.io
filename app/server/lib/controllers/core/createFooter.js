var conf = require('confify'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	displayType = 'desktop',
	html = fs.readFileSync(conf.paths.root + conf.paths.sharedHtml+'/'+displayType+'/footer.html');

module.exports = function(req, res, next){
	req.html.footer = hyperglue(html, {
		// '#footer': { _html: "This is the footer" }
	}).innerHTML;
	next();
}