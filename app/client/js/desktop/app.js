var path = require('path'),
	util = require('util'),
    router = require('../shared/Router'),
    foldify = require('foldify'),
    // insertCss = require('insert-css'),
    conf = require('confify');

var routes = foldify(__dirname + '/routes'),
    globalCollections = foldify(__dirname + '/collections/global'),
    // bootstrapLess = foldify('twitter-bootstrap-3.0.0/less', {whitelist: ["variables.less", "mixins.less", "grid.less"], output: "string"} ),
    LayoutView = require('./views/layout');

//attach routes
routes(router);

// var parser = new less.Parser();
// parser.parse(bootstrapLess, function(e,r){
// 	insertCss(r.toCSS());
// });

Backbone.clientOnly = true;

//attach global collections
Backbone.collections = globalCollections({identifier: "~blog~"});

new LayoutView();

Backbone.history.start({
  pushState: true
});

