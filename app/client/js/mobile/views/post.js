var View = require('../../shared/View');

module.exports = View.extend({
	className: 'post',
	prerender: function(){
		if(this.prerendered) return		
		if(!this.rendered){
			var rendered = this.html.render("content.html", { 
				'.goback a': { href: this.post.collection.length === 1 ? "/" : "/articles/"+this.type },
				'.page-title span': this.post.get('title')
			});
			this.$el.html( rendered );
		}
		this.prerendered = true;
		if(this.post.fetched) return Backbone.transition( this.render().$el, {level:2} ); 

		this.prerendering = true;
		//add some kind of spinner?
		var init = Backbone.transition( this.$el, {level:2} );
		function signal(){ 
			this.prerendering = false;
			this.trigger("prerendered");
		};
		if(init)
			signal.call(this);
		else
			this.$el.one( "webkitTransitionEnd", signal.bind(this) );
	},
	render: function(){
		if(!this.prerendered) return this.prerender();
		if(this.rendered) return;
		var rendered = this.html.render("post.html", {
				'.created': this.post.get("created"),
				'.post-content': { _html: this.post.get("content") }
		});
		function renderContent(){
			this.$el.find('.page-content').html( rendered );
			this.rendered = true;			
	    	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
		}
		if(this.prerendering)
			this.once( "prerendered", renderContent.bind(this) );
		else
			renderContent.call(this);
		return this;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});
	
		this.listenToOnce( this.post, "fetched", this.render );
		this.post.fetch();
		this.fetched = true;

		process.nextTick(this.prerender.bind(this));
	},
	initialize: function(options){
		if(options.cached) return Backbone.transition( this.$el, {level:2} );

		this.options = options || {};
		this.slug = this.options.slug;
		this.type = this.options.type;
		this.$el.addClass("section-"+slug(this.type));
		this.$el.addClass("article-"+this.slug);

		this.html = Backbone.collections.html;
		this.listenToOnce( this.html, "fetched", this.fetchPost );
		this.html.fetch();

		this.posts = Backbone.collections[this.type];
		this.listenToOnce( this.posts, "fetched", this.fetchPost );
		this.posts.fetch();

	}
});

function slug(input, identifier)
{
	if(!input) return
	if(identifier) input = input.replace(identifier, '') // Trim identifier
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}