var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return			
		var self = this;
		var precursor = !Backbone.pushState ? "#" : "";
		var postsMap = this.posts.map(function(post){
			return { 
				'.link': { href: "/"+precursor+self.type+"/"+post.get("slug")},
				'.title': post.get("title"),
				'.created': post.get("created")
			}
		});
		this.html.render("posts.html", { ".posts": postsMap }).appendTo(this.$el);
		this.rendered = true;
	},
	initialize: function(options){
		this.type = options.type;

		this.posts = Backbone.collections[this.type];
		this.listenToOnce(this.posts, "fetched", this.render );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});