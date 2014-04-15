var View = require('../../shared/View');

module.exports = View.extend({
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return
		var map = { 
			'#title a': { href: "/", _text: this.type },
			'#menu': this.posts.map(function(post){
				return { 'a': { href: "/article/" + post.get("type") + "/" + post.get("slug"), 
								_text: post.get("title") } 
						}
			})
		}
		var rendered = this.html.render("body.html", map);		
		Backbone.transition( this.$el.html( rendered ) );
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
	initialize: function(options){
		this.counter = 0;

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