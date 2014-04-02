var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return			
		var self = this;

		var postsMap = this.posts.map(function(post){
			var tags = post.get("tags");
			if(tags) tags = tags.join(", ");
			return { 
				'.link': { href: "/article/" + post.get("type") + "/" + post.get("slug") },
				'.title': post.get("title"),
				'.created': post.get("created"),
				'.tags': tags
			}
		});
		this.html.render("posts.html", { ".posts": postsMap }).appendTo(this.$el);
		this.rendered = true;
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
	counter: 0,
	initialize: function(options){
		this.type = options.type;
		if(options.tag){
			this.posts = {};
			var models = [];
			for(var coll in Backbone.collections){
				if(coll === "html") continue;
				this.counter++;
				this.listenToOnce( Backbone.collections[coll], "fetched", function(coll){
					models = models.concat( Backbone.collections[coll].filter(function(item){
						var tags = item.get('tags');
						return tags && ~tags.indexOf(options.tag); 
					}) );
					if(!--this.counter) this.compileByTag(Backbone.collections[coll], models);	
				}.bind(this, coll));
				Backbone.collections[coll].fetch();
			}
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