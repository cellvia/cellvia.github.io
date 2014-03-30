var View = require('../../shared/View');

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



    // insertCss = require('insert-css'),
// var parser = new less.Parser();
// parser.parse(bootstrapLess, function(e,r){
// 	insertCss(r.toCSS());
// });
