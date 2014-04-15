/**
 * Module dependencies.
 */

var path = require('path')
	, util = require('util')
	, express = require('express')
	, app = express()
	, http = require('http')
	, foldify = require('foldify')
	, routes = foldify(path.join(__dirname, 'lib', 'routes'));

// all environments
app.set('port', 8085);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//attach routes
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
