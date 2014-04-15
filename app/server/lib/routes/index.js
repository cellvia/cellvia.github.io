var	fs = require('fs');
var html = fs.readFileSync(__dirname + '/../../public/index.html');

module.exports = function(app){ 
	process.nextTick(function(){ //make sure this catch all route is added last
		app.get(/^((?!(\/css|\/js|\/images)).)*$/, function(req, res, next){
			res.end( html );
		});	
	})
}