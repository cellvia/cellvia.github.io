var View = require('../../shared/View');

module.exports = View.extend({
	className: 'posts',
	render: function(){
		if(!this.posts.fetched || this.checkIfPage() || !this.html.fetched ) return
		if(!this.rendered){
			var rendered = this.html.render("content.html", {
				'.goback a': { href: this.type ? "/" : "/tags" },
				'.page-title span': this.type || this.tag,
				'.page-content .menu li': this.posts.map(function(post){
					return { 'a': {href: "/article/" + post.get("type") + "/" + post.get("slug"), 
									_text: post.get("title") }
							}
				})
			});
			this.$el.html( rendered );
	        this.iscroll = Backbone.iScroll( this.$el.find(".topcoat-list__container") );
			this.rendered = true;
		}
		Backbone.transition( this.$el );
	},
	compileByTag: function(coll, models){
		this.posts = coll;
		models.forEach(function(model){
			if(!this.posts.get({id: model.get("id")}))
				this.posts.add(model);
		}.bind(this));
		this.posts.fetched = true;
		console.log(this.posts)
		this.render();
	},
	checkIfPage: function(){
		if(this.hasOwnProperty('pageChecked')) return !this.pageChecked;
		if(this.posts.length === 1){
			var post = this.posts.models[0];
			Backbone.trigger("go", {href: "/article/" + post.get('type') + "/" + post.get("slug")});
			return (this.pageChecked = true);
		}
		return (this.pageChecked = false);
	},
	initialize: function(options){
		delete this.pageChecked;
		this.options = options || {};
		this.counter = 0;
		this.type = this.options.type;

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