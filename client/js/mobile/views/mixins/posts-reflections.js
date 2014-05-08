var View = require('../../../shared/View');

module.exports = {
	renderGatekeeper: function(){
		if(this.shouldSkipPage() || !this.posts.fetched || !this.html.fetched ) return true;
	},
	initialize: function(options){
		this.options = options || {};

		this.counter = 0;
		this.type = this.options.type;
		this.typeSlug = Backbone.collections[this.type].typeSlug;
		this.typeTitle = Backbone.collections[this.type].typeTitle;
		this.$el.addClass("section-"+this.typeSlug);

		this.posts = Backbone.collections[this.type];
		this.listenToOnce(this.posts, "fetched", this.filterOut );
		this.listenToOnce(this.posts, "fetched", this.render );
		this.posts.fetch();							

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	},
	filterOut: function(){
		var rand = _.random(0, this.posts.length-1);
		var model = this.posts.filter(function(p,index){ return index === rand; }).slice(0)[0];
		if(!model) return
		this.posts = new Backbone.Collection(model, this.options);
		this.posts.fetched = true;
		model.collection = this.posts;
	}
};
