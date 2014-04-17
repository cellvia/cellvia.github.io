var View = require('../../shared/View');

module.exports = View.extend({
	className: "sections",
	render: function(){
		if(this.rendered) return Backbone.transition( this.$el, {reset: true} );
		var rendered = this.html.render("content.html", { 
			'.goback': { _html: "" },
			'.page-title span': "Brandon's Blog",
			'.menu li.section': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, _text: section } }
			})
		});
		Backbone.transition( this.$el.html( rendered ), {reset: true} );

        // setTimeout( function(){ 
        // 	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
        // }.bind(this), 300 );
		this.rendered = true;
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
