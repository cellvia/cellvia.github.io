var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	events: {
	},
	render: function(){
		if(this.rendered) return
		var precursor = !Backbone.pushState ? "#" : "";
		this.html.render("post.html", 
			{
				'.link': { href: "/"+ precursor + this.type+"/"+this.slug},
				'.title': this.post.get("title"),
				'.created': this.post.get("created"),
				'.content': { _html: this.post.get("content") }
			}
		).appendTo( this.$el );
		this.rendered = true;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
	
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});

		this.listenToOnce( this.post, "fetched", this.render );
		this.post.fetch();
		this.fetched = true;
	},
	initialize: function(opts){
		this.slug = opts.slug;
		this.type = opts.type;

		this.posts = Backbone.collections[this.type];
		this.listenToOnce( this.posts, "fetched", this.fetchPost );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.listenToOnce( this.html, "fetched", this.fetchPost );
		this.html.fetch();
	}
});