var	curryFolder = require('curryFolder'),
	core = curryFolder(__dirname + '/../controllers/core');

module.exports = function(app){ 
	process.nextTick(function(){ //make sure this catch all route is added last
		app.get(/^((?!(\/css|\/js|\/images)).)*$/, core.initHtml, core.createHeader, core.createFooter, core.createPage, core.sendHtml);	
	})
}