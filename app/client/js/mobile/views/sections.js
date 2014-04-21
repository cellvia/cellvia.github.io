var View = require('../../shared/View');

module.exports = View.extend({
	className: "sections",
	viewEvents: {
		"click h1.topcoat-navigation-bar__title span": "resume" 
	},
	resume: function(){
		window.open("/images/BrandonSelway_resume.pdf");
	},
	render: function(){
		if(this.rendered) return Backbone.transition( this.$el, {level: 0} );
		var rendered = this.html.render("content.html", { 
			'.goback': { _html: "" },
			'.page-title span': "Brandon Selway",
			'.menu li': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, class: "section listitem" },
						 'a span.item-content': section
				}
			})
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
