var path = require('path'),
    router = require('../shared/Router'),
    foldify = require('foldify');

var routes = foldify(__dirname + '/routes'),
    globalCollections = foldify(__dirname + '/../shared/collections/global'),
    LayoutView = require('./views/layout');

new LayoutView();

//attach routes
routes(router);

//attach global collections
Backbone.collections = {};
Backbone.collections.posts = globalCollections["posts"]({identifier: "~blog~"});
Backbone.collections.code = globalCollections["posts"]({identifier: "~code~"});
Backbone.collections.music = globalCollections["posts"]({identifier: "~music~"});
Backbone.collections.art = globalCollections["posts"]({identifier: "~art~"});
Backbone.collections.thoughts = globalCollections["posts"]({identifier: "~thoughts~"});

Backbone.collections.html = globalCollections["html"]();

Backbone.history.start({
  pushState: true
});
