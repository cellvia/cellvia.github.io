module.exports = function(options){
	var GlobalCollection = Backbone.Collection.extend({
		model: Backbone.Model,
		url: function(){
			return '/globalCollection/' + this.id;
		},
		parse: function(resp){
			this.fetched = true;
			process.nextTick($.proxy( function(){
				this.trigger("fetched");
			}, this));
			return resp;
		},
		initialize: function(models, options){
			this.options || (this.options = options || {});
			this.id = this.options.id || 0;
		}
	});

	return new GlobalCollection([], options);
};