var nconf = require('nconf'),
	fs = require('fs'),
	hyperglue = require('hyperglue'),
	html = fs.readFileSync(nconf.get('HTMLPath')+'/shared/index.html'),
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