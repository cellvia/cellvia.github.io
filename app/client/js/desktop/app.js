var path = require('path'),
    router = require('../shared/Router'),
    foldify = require('foldify');

var routes = foldify(__dirname + '/routes'),
    globalCollections = foldify(__dirname + '/../shared/collections/global'),
    LayoutView = require('./views/layout');

//attach routes
routes(router);

//attach global collections
Backbone.collections = globalCollections({identifier: "~blog~"});

new LayoutView();

Backbone.history.start({
  pushState: true
});
