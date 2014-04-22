/**
 * Module dependencies.
 */

var path = require('path')
	, util = require('util')
	, express = require('express')
	, app = express()
	, http = require('http')
	, fs = require('fs')
	, html = fs.readFileSync(__dirname + '/index.html');

// all environments
app.set('port', 8085);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

app.use(app.router);
app.use(express.static(path.join(__dirname)));

app.get(/^((?!(\/public\/css|\/public\/js|\/public\/font|\/public\/images)).)*$/, function(req, res, next){
	res.end( html );
});	

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




