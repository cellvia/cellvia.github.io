var View = require('../../shared/View');
var insertCss = require('insert-css');
var foldify = require('foldify');
var grid = foldify("topcoat-grid/css", {whitelist: "grid.min.css"});
var topcoatCss = foldify("topcoat/css", {whitelist: "topcoat-desktop-light.css"});
var topcoatFonts = foldify("topcoat/font", {encoding: "base64"});

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
	events: {
		"click a": "link"
	},
	link: function(e){
		e.preventDefault();
		var href = e.currentTarget.getAttribute('href');
		Backbone.trigger("go", {href: href});			
	},
	initialize: function(){
	}
})
