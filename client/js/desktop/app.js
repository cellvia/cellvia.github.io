var router = require('../shared/Router'),
    foldify = require('foldify'),
    conf = require('confify');

conf({displayType: "desktop"});

var routes = foldify(__dirname + '/routes'),
    LayoutView = require('./views/layout');

//grab global collections
Backbone.collections = foldify(__dirname + '/../shared/collections');

//attach routes
routes(router);

//attach global collections
Backbone.sections = ['code', 'music', 'art', 'thoughts', 'projects'];
Backbone.sections.forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({identifier: "~"+type+"~"});
});
Backbone.collections.html = Backbone.collections.Html();

//transitioner
Backbone.transition = function(){
	Backbone.transition = function(container, rendered){
		container.html( rendered );
	};
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
}

//initiate main view
new LayoutView();

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});