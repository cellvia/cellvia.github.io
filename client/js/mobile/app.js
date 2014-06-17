var foldify = require('foldify'),
	insertCss = require("insert-css"),
	fastclick = require('fastclick'),
    conf = require('confify');

//set config
conf({displayType: "mobile"});

var	routes = foldify('./routes'),
    LayoutView = require('./views/layout');

//attach routes
Backbone.router = require('../shared/Router');
routes(Backbone.router);

//grab global collections
Backbone.collections = foldify('../shared/collections');

//attach global collections
Backbone.sections = conf.sections;
Backbone.sections.forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({type: type, identifier: "~"+type+"~"});
	Backbone.collections[type].typeSlug = slug(type);
	Backbone.collections[type].typeTitle = type;
	Backbone.collections[slug(type)] = Backbone.collections[type];	
});

//html template collection
Backbone.collections.html = Backbone.collections.Html();

//mobile footer icons ([[type, link]])
Backbone.footers = conf.footers;

//setup pageslider
Backbone.transition = function(container, opts){
	var mobileTransition = require(conf.mobileTransitionModule);
	Backbone.transition = mobileTransition( $("body"), {useHash: !!(~window.location.href.indexOf("github.io") || ~window.location.href.indexOf("brandonselway.com") )} );
	Backbone.transition._isset = true;
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
	return "init";
}

Backbone.iScroll = function(container){
    return !!conf.useIScroll === false ? false : new IScroll( container[0], {click: true} );
}

//instantiate base page
new LayoutView();

//start app!
Backbone.history.start({
  pushState: !!(!~window.location.href.indexOf("github.io") && !~window.location.href.indexOf("brandonselway.com") && Modernizr.history)
});

function slug(input, identifier)
{
	if(!input) return
	if(identifier) input = input.replace(identifier, '') // Trim identifier
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}
