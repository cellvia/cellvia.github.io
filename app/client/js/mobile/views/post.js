var View = require('../../shared/View');

module.exports = View.extend({
	className: 'post',
	prerender: function(){
		if(!this.cached){
			var rendered = this.html.render("content.html", { 
				'.goback a': { href: this.post.collection.length === 1 ? "/" : "/articles/"+this.type },
				'.page-title span': this.post.get('title')
			});
			this.$el.html( rendered );
		}
		Backbone.transition( this.$el );
    	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
	},
	render: function(){
		if(this.cached) return
		var rendered = this.html.render("post.html", {
				'.created': this.post.get("created"),
				'.post-content': { _html: this.post.get("content") }
		});
		this.$el.find('.page-content').html( rendered );
		this.cached = true;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});
		this.prerender();
	
		this.listenToOnce( this.post, "fetched", this.render );
		this.post.fetch();
		this.fetched = true;
	},
	initialize: function(opts){

		this.slug = opts.slug;
		this.type = opts.type;

		this.html = Backbone.collections.html;
		this.listenToOnce( this.html, "fetched", this.fetchPost );
		this.html.fetch();

		this.posts = Backbone.collections[this.type];
		this.listenToOnce( this.posts, "fetched", this.fetchPost );
		this.posts.fetch();

	}
});