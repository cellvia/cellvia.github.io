/**
 * Module dependencies.
 */

var path = require('path')
	, http = require('http')
	, exec = require('child_process').exec
	, util = require('util')
	, express = require('express')
	, app = express()
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

var n = 8080, server;
function recurs(e){
	if(n > 9000 || e && e.code !== "EADDRINUSE"){
		console.log(e);
		return;
	};
	var msg = 'Listening on port '+n+'...';
	var url = 'http://localhost:'+n;
	server = http.createServer(app).listen(n++);
	server.on("error", recurs);	
	server.on("listening", function(){
		var command = ~process.platform.indexOf("linux") ? "xdg-" : "";
		exec(command += "open "+url+" > /dev/null");
		console.log(msg);	
	});
}
recurs();
