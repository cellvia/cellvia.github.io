var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return			
		var postsMap = this.posts.map(function(post){
			return { 
				'.link': { href: "/article/"+post.get("slug")},
				'.title': post.get("title"),
				'.created': post.get("created")
			}
		});
		this.html.render("posts.html", { ".posts": postsMap }).appendTo(this.$el);
		this.rendered = true;
	},
	initialize: function(){
		this.posts = Backbone.collections.posts;
		if(!this.posts.initialized)
			return this.posts.once("initialized", $.proxy(this.initialize, this));

		this.posts.once("fetched", $.proxy(this.render, this) );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.html.once("fetched", $.proxy(this.render, this) );
		this.html.fetch();
	}
});