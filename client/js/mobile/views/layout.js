var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	events: {
		'click a': 'link'
	},
	link: function(e){
		console.log("click")
        e.preventDefault();
        process.nextTick(function(){
          if(e.isPropagationStopped()) return
          var href = e.currentTarget.getAttribute('href');
          if( !~href.indexOf(".") || ~href.indexOf(document.location.hostname) ){
          	console.log("going")
            Backbone.trigger("go", {href: href});
          }
          else
            window.open(href);
        });
	},
	render: function(){
		var rendered = this.html.render("footer.html", {
			".topcoat-navigation-bar__item": Backbone.footers.map(function(item){
				return { 'a': { href: item[1], class: "topcoat-icon topcoat-icon--"+item[0] } }
			})
		});
		rendered = $(rendered).add("<div class=\"bg\"><img src=\"http://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Shrivatsa.JPG/220px-Shrivatsa.JPG\" /></div>");
		this.$el.append(rendered);
	},
	initialize: function(){

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();

		//immediately invoke in order to update gist cache quickly 
		Backbone.collections[Backbone.sections[0]].fetch();
	}
});
