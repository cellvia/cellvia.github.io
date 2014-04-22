var View = require('../../shared/View');
var conf = require('confify');

module.exports = View.extend({
	className: "sections",
	viewEvents: {
		"click h1.topcoat-navigation-bar__title span": "resume" 
	},
	resume: function(){
		window.open(conf.pathnames.images + "/BrandonSelway_resume.pdf");
	},
	render: function(){
		if(this.rendered) return Backbone.transition( this.$el, {level: 0} );
		var menu = this.html.render("list.html", {
			'li.topcoat-list__item': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, class: "section listitem" },
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
		if(options.cached) return Backbone.transition( this.$el, {level: 0} );

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
