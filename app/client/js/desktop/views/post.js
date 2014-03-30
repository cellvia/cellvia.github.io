var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	events: {
	},
	render: function(){
		if(this.rendered) return
		this.html.render("post.html", 
			{
				'.link': { href: "/article/"+this.post.get("slug")},
				'.title': this.post.get("title"),
				'.created': this.post.get("created"),
				'.content': this.post.get("content")
			}
		).appendTo( this.$el );
		this.rendered = true;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});

		this.post.once("fetched", $.proxy(this.render, this) );
		this.post.fetch();
		this.fetched = true;
	},
	initialize: function(opts){
		this.slug = opts.slug;

		this.posts = Backbone.collections.posts;
		this.posts.once("fetched", $.proxy(this.fetchPost, this) );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.html.once("fetched", $.proxy(this.fetchPost, this) );
		this.html.fetch();
	}
});