var View = require('../../shared/View');
var insertCss = require('insert-css');
var foldify = require('foldify');
var topcoatCss = foldify("topcoat/css", {whitelist: "topcoat-mobile-light.css"});
var topcoatFonts = foldify("topcoat/font", {encoding: "base64"});

insertCss(
	topcoatCss["topcoat-mobile-light.css"]
		.replace(/..\/font\/(.*?)\.otf/g, 
			function(match, p1){
				p1 = p1 + ".otf";
				return "data:application/octet-stream;base64,"+topcoatFonts[p1];
			}
		)
);

module.exports = View.extend({
	events: {
		"click a": "link"
	},
	link: function(e){
		e.preventDefault();
		Backbone.trigger("go", {href: e.currentTarget.getAttribute('href')});
	},
	render: function(){
		if(this.rendered) return
		var map = { 
			'#title a': { href: "/", _text: "Brandon's Blog" },
			'#menu': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, _text: section } }
			})
		}
		var rendered = this.html.render("body.html", map);		
		Backbone.transition( this.$el.html( rendered ) );
		this.rendered = true;
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
