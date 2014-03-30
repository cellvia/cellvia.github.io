/**
 * Module dependencies.
 */

//config
var path = require('path')
	, env = process.env.NODE_ENV || 'development'
	, conf = require('confify');

conf(__dirname + "/configurations/" + env);

var util = require('util')
	, express = require('express')
	, app = express()
	, http = require('http')
	// , mockAPI = require('mockAPI')
	, foldify = require('foldify')
	, routes = foldify(path.join(__dirname, 'lib', 'routes'), {recursive: true})
	, intervalEmitter = require('intervalEmitter')
	, intervals = foldify(path.join(__dirname, 'lib', 'intervals'), {recursive: true})

//run mocks
// var mocks = nconf.get('mocks')
// if(mocks && mocks.length){
// 	mocks.forEach(function(mock){
// 		if(mock.on){ 
// 			mock.definition_path = path.join(__dirname, 'mocks', mock.definition_path);
// 			mockAPI(mock);
// 		}
// 	})	
// }

// all environments
app.set('port', process.env.PORT || conf.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

app.use(express.session({
    cookie: { maxAge: conf['session-timeout'] || 3600000 },
    key: conf['cookie-name'],
    secret: conf.secret
  })
);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if (conf['error-handler']) {
	app.use(express.errorHandler());
}

//attach routes
routes(app);

//instantiate intervals
intervals(intervalEmitter);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
