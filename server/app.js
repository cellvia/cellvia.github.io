/**
 * Module dependencies.
 */

//config
var path = require('path')
	, env = process.env.NODE_ENV || 'development'
	, nconf = require('nconf')
	, configPath = path.join(__dirname, 'configurations', (nconf.get('env') || env) + '.json' );

nconf
	.argv()
  	.env()
  	.file({ file: configPath });

nconf.set('HTMLPath', path.join(__dirname, '..', 'shared', 'html'));

var util = require('util')
	, express = require('express')
	, app = express()
	, http = require('http')
	, mockAPI = require('mockAPI')
	, curryFolder = require('curryFolder')
	, routes = curryFolder(path.join(__dirname, 'lib', 'routes'), {recursive: true})
	, intervalEmitter = require('intervalEmitter')
	, intervals = curryFolder(path.join(__dirname, 'lib', 'intervals'), {recursive: true})
	, MongoStore = require('connect-mongo')(express)

//run mocks
var mocks = nconf.get('mocks')
if(mocks && mocks.length){
	mocks.forEach(function(mock){
		if(mock.on){ 
			mock.definition_path = path.join(__dirname, 'mocks', mock.definition_path);
			mockAPI(mock);
		}
	})	
}

// all environments
app.set('port', process.env.PORT || nconf.get('port') || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

app.use(express.session({
    cookie: { maxAge: nconf.get('session-timeout') || 3600000 },
    key: nconf.get('cookie-name'),
    secret: nconf.get('secret'),
    store: new MongoStore({
      db: nconf.get('db')
    })
  })
);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if (nconf.get('error-handler')) {
	app.use(express.errorHandler());
}

//attach routes
routes([app]);

//instantiate intervals
intervals([intervalEmitter]);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
