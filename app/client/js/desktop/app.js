var router = require('../shared/Router'),
    foldify = require('foldify');

var routes = foldify(__dirname + '/routes'),
    LayoutView = require('./views/layout');

//grab global collections
Backbone.collections = foldify(__dirname + '/../shared/collections');

//initiate main view
new LayoutView();

//attach routes
routes(router);

//attach global collections
['blog', 'code', 'music', 'art', 'thoughts', 'projects'].forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({identifier: "~"+type+"~"});
});
Backbone.collections.html = Backbone.collections.Html();

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});