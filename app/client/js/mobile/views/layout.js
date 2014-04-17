var View = require('../../shared/View');
// var insertCss = require('insert-css');
// var foldify = require('foldify');
// var conf = require('confify');
// var topcoatCss = foldify("topcoat/css", {whitelist: "topcoat-mobile-light.css"});
// var topcoatFonts = foldify("topcoat/font", {encoding: "base64", whitelist: ["SourceSansPro-Semibold.otf", "SourceSansPro-Light.otf", "SourceSansPro-Regular.otf"]});
// var css = foldify(conf.paths.root + '/server/public/css', {whitelist: "mobile.css"});


// //hack to inline base64 font from node_modules/topcoat
// insertCss(
// 	topcoatCss["topcoat-mobile-light.css"]
// 		.replace(/..\/font\/(.*?)\.otf/g, 
// 			function(match, p1){
// 				p1 = p1 + ".otf";
// 				return "data:application/octet-stream;base64,"+topcoatFonts[p1];
// 			}
// 		)
// );

// insertCss(css['mobile.css']);

module.exports = View.extend({
	el: "body",
	render: function(){
		var rendered = this.html.render("footer.html", {
			".topcoat-navigation-bar__item": Backbone.footers.map(function(item){
				return { 'a': { href: item[1], class: "topcoat-icon topcoat-icon--"+item[0] } }
			})
		});
		this.$el.append(rendered);
	},
	initialize: function(){

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();

		//updates gist cache quickly
		Backbone.collections[Backbone.sections[0]].fetch();
	}
});
