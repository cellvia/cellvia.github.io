var View = require('../../shared/View');

module.exports = View.extend({
	className: "sections",
	render: function(){
		if(this.rendered) return Backbone.transition( this.$el, {reset: true} );
		var rendered = this.html.render("content.html", { 
			'.goback': { _html: "" },
			'.page-title span': "Brandon Selway",
			'.menu li': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, class: "section listitem" },
						 'a span.item-content': section
				}
			})
		});
		Backbone.transition( this.$el.html( rendered ), {reset: true} );
    	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
		this.rendered = true;
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
