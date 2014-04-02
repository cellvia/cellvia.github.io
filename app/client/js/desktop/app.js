var path = require('path'),
    router = require('../shared/Router'),
    foldify = require('foldify');

var routes = foldify(__dirname + '/routes'),
    Posts = require('../shared/collections/Posts'),
    Html = require('../shared/collections/Html'),
    LayoutView = require('./views/layout');

new LayoutView();

//attach routes
routes(router);

//attach global collections
Backbone.collections = {};
Backbone.collections.blog = Posts({identifier: "~blog~"});
Backbone.collections.code = Posts({identifier: "~code~"});
Backbone.collections.music = Posts({identifier: "~music~"});
Backbone.collections.art = Posts({identifier: "~art~"});
Backbone.collections.thoughts = Posts({identifier: "~thoughts~"});
Backbone.collections.projects = Posts({identifier: "~projects~"});

Backbone.collections.html = Html();

Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});
