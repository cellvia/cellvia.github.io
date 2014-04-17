var View = require('../../shared/View');
var insertCss = require('insert-css');
var foldify = require('foldify');
var grid = foldify("topcoat-grid/css", {whitelist: "grid.min.css"});
var topcoatCss = foldify("topcoat/css", {whitelist: "topcoat-desktop-light.css"});
var topcoatFonts = foldify("topcoat/font", {encoding: "base64"});
var conf = require('confify');

insertCss(grid["grid.min.css"]);

insertCss(
	topcoatCss["topcoat-desktop-light.css"]
		.replace(/..\/font\/(.*?)\.otf/g, 
			function(match, p1){
				p1 = p1 + ".otf";
				return "data:application/octet-stream;base64,"+topcoatFonts[p1];
			}
		)
);

module.exports = View.extend({
	el: "body",
	render: function(){
		var map = { 
			'#title a': { href: "/", _text: "Brandon's Blog" },
			'#menu': Backbone.sections.map(function(section){
				return {'a': {
					href: '/articles/'+section,
					_text: section
				}}
			})
		}
		var rendered = this.html.render("body.html", map);
		console.log(rendered)
		Backbone.transition( this.$el, rendered );
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();

		//updates gist cache
		Backbone.collections[Backbone.sections[0]].fetch();
	}
});
