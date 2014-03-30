var View = require('../../shared/View');
var insertCss = require('insert-css');
var foldify = require('foldify');
var grid = foldify("topcoat-grid/css", {whitelist: "grid.min.css"});
var topcoat = foldify("topcoat/css", {whitelist: "topcoat-desktop-light.css"})

insertCss(grid["grid.min.css"]);
insertCss(topcoat["topcoat-desktop-light.css"]);

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
