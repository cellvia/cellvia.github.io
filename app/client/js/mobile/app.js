var meta =  '<meta charset="utf-8" />';
meta += '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />';
$('head').append(meta);

var router = require('../shared/Router'),
    foldify = require('foldify'),
    conf = require('confify');
conf({displayType: "mobile"});

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
	var mobileTransition = require(conf.mobileTransitionModule);
	Backbone.transition = mobileTransition( $("body") );
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
}

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});
