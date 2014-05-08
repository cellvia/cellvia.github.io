var View = require('../../shared/View');
var foldify = require('foldify');
var mixins = foldify('./mixins');

module.exports = function(options){
	var FinalView = mixins["posts-"+options.type]
		? BaseView.extend(mixins["posts-"+options.type])
		: BaseView;
	return new FinalView(options);
}

var BaseView = View.extend({
	className: 'posts',
	renderGatekeeper: function(){
		if(this.shouldSkipPage() || !this.posts.fetched || !this.html.fetched || this.rendered) return true;
	},
	render: function(){
		if(this.renderGatekeeper()) return;
		this.rendered = true;
		var self = this;
		var postsMap = this.posts.map(function(post){
				return {'a': {
							href: "/article/" + self.typeSlug + "/" + post.get("slug"), 
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
			'.page-title span': this.typeTitle || this.tag,
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
			var url = "/article/" + this.typeSlug + "/" + post.get("slug");
			process.nextTick(function(){
				Backbone.trigger("go", {href: url, replace: true});
			});
		}
		return this.skipPage;
	},
	initialize: function(options){
		this.options = options || {};
		if(this.skipPage) return this.shouldSkipPage();
		if(this.options.cached) return Backbone.transition( this.$el, {level: 1} );

		this.counter = 0;
		this.type = this.options.type;
		this.typeSlug = Backbone.collections[this.type].typeSlug;
		this.typeTitle = Backbone.collections[this.type].typeTitle;
		this.$el.addClass("section-"+this.typeSlug);

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
