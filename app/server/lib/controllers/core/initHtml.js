var conf = require('confify'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	html = fs.readFileSync(conf.paths.root + conf.paths.sharedHtml+'/shared/index.html'),
	displayType = 'desktop';

module.exports = function(req, res, next){
	req.html || (req.html = {});
	req.html.layout = hyperglue(html, {
		'#cssLink': { src: '/css/' + displayType + '.css' },
		'#appScript': { src: '/js/' + displayType + '-app.js' },
		'#vendorScript': { src: '/js/' + displayType + '-vendor.js' }
	}).innerHTML;
	next();
}