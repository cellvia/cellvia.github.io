var path = require('path'),
	util = require('util'),
    router = require('../shared/Router'),
    foldify = require('foldify');

var routes = foldify(__dirname + '/routes'),
    globalCollections = foldify(__dirname + '/collections/global'),
    LayoutView = require('./views/layout');

//attach routes
routes(router);

//attach global collections
Backbone.collections = globalCollections({identifier: "~blog~"});

new LayoutView();

Backbone.history.start({
  pushState: true
});

