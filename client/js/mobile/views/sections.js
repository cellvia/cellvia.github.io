var View = require('../../shared/View');
var conf = require('confify');

module.exports = function(options){
	return new BaseView(options);
}

var BaseView = View.extend({
	className: "sections",
	events: {
		"click h1.topcoat-navigation-bar__title span": "resume" 
	},
	resume: function(){
		window.open(conf.pathnames.images + "/BrandonSelway_resume.pdf");
	},
	render: function(){
		if(this.rendered) return Backbone.transition( this.$el, {level: 0} );
		var menu = this.html.render("list.html", {
			'li.topcoat-list__item': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+Backbone.collections[section].typeSlug, class: "section listitem" },
						 'a span.item-content': section
				}
			})
		});		
		var rendered = this.html.render("content.html", { 
			'.goback': { _html: "" },
			'.page-title span': "Brandon Selway",
			'.page-content': { _html: menu }
		});
		Backbone.transition( this.$el.html( rendered ), {level: 0} );
    	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
		this.rendered = true;
	},
	initialize: function(options){
		this.options = options || {};
		if(options.cached) return Backbone.transition( this.$el, {level: 0} );

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
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
