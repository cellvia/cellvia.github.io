var View = require('../../shared/View');

module.exports = View.extend({
	className: 'posts',
	render: function(){
		console.log("render posts")
		if(this.shouldSkipPage()) return
		if(!this.posts.fetched || !this.html.fetched || this.rendered) return;
		console.log("actually render posts")
		this.rendered = true;
		var postsMap = this.posts.map(function(post){
				return {'a': {
							href: "/article/" + post.get("type") + "/" + post.get("slug"), 
							class: "post listitem" 
						},
						'a span.item-content': post.get("title"),
						'a span.action-icon': { class: "action-icon topcoat-icon--next" }
					}
			});
		var menu = this.html.render( "list.html", {
			'li': this.posts.length ? postsMap : {},
			'li a': !this.posts.length ? {href: "/", class: "listitem", _text: "No posts yet, please come back soon!"} : {}
		});
		var map = {
			'.goback a': { href: this.type ? "/" : "/tags" },
			'.page-title span': this.type || this.tag,
			'.page-content': { _html: menu }
		}
		var rendered = this.html.render("content.html", map);
		Backbone.transition( this.$el.html( rendered ), {level: 1} );
    	this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
	},
	compileByTag: function(coll, models){
		this.posts = coll;
		models.forEach(function(model){
			if(!this.posts.get({id: model.get("id")}))
				this.posts.add(model);
		}.bind(this));
		this.posts.fetched = true;
		this.render();
	},
	shouldSkipPage: function(){
		if(this.posts.fetched && (this.skipPage || (this.skipPage = this.posts.length === 1))){
			var post = this.posts.models[0];
			var url = "/article/" + post.get('type') + "/" + post.get("slug");
			process.nextTick(function(){
				Backbone.trigger("go", {href: url, replace: true});
			});
		}
		return this.skipPage;
	},
	initialize: function(options){
		console.log("init posts")
		if(this.skipPage) return this.shouldSkipPage();
		if(options.cached) return Backbone.transition( this.$el, {level: 1} );

		this.options = options || {};
		this.counter = 0;
		this.type = this.options.type;
		this.$el.addClass("section-"+slug(this.type));

		if(options.tag){
			this.tag = this.options.tag;
			this.posts = {};
			var models = [];
			Backbone.sections.forEach(function(coll){
				this.counter++;
				this.listenToOnce( Backbone.collections[coll], "fetched", function(coll){
					models = models.concat( Backbone.collections[coll].filter(function(item){
						var tags = item.get('tags');
						return tags && ~tags.indexOf(options.tag); 
					}) );
					if(!--this.counter) this.compileByTag(Backbone.collections[coll], models);	
				}.bind(this, coll));
				Backbone.collections[coll].fetch();
			}.bind(this));
		}else{
			this.posts = Backbone.collections[this.type];
			this.listenToOnce(this.posts, "fetched", this.render );
			this.posts.fetch();							
		}

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();

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