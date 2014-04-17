var meta =  '<meta charset="utf-8" />';
meta += '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />';
$('head').append(meta);

require('fastclick')(document.body);

var router = require('../shared/Router'),
    foldify = require('foldify'),
	insertCss = require("insert-css"),
    conf = require('confify');

conf({displayType: "mobile"});

var	routes = foldify(__dirname + '/routes'),
    LayoutView = require('./views/layout');

//grab global collections
Backbone.collections = foldify(__dirname + '/../shared/collections');

//attach global collections
Backbone.sections = conf.sections.concat(conf.sections).concat(conf.sections);
Backbone.sections.forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({identifier: "~"+type+"~"});
});
Backbone.collections.html = Backbone.collections.Html();

Backbone.footers = conf.footers;

//transitioner
Backbone.transition = function(container, opts){
	var mobileTransition = require(conf.mobileTransitionModule);
	Backbone.transition = mobileTransition( $("body"), {useHash: !!~window.location.href.indexOf("github.io")} );
	Backbone.transition._isset = true;
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
}

// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
Backbone.iScroll = function(container){
    return !!conf.useIScroll === false ? false : new IScroll( container[0], {click: true});
}

//attach routes
routes(router);

new LayoutView();

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io") && window.history && history.pushState
});