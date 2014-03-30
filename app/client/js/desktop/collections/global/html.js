var foldify = require('foldify'),
	hyperglue = require('hyperglue'),
	util = require('util'),
	conf = require('confify');

module.exports = function(options){
	var HTMLCollection = Backbone.Collection.extend({
		model: Backbone.Model,
		url: function(){
			return '/HTMLCollection/' + this.id;
		},
		parse: function(resp){
			process.nextTick($.proxy( function(){
				this.trigger("fetched");
			}, this));
			this.fetched = true;
			var output = [];
			for(var name in resp){
				output.push({id: name, template: resp[name]});
			}
			return output;
		},
		initialize: function(models, options){
			this.options || (this.options = options || {});
			this.id = this.options.id || 0;
		},
		render: function(template, map){
			if((template = this.get(template)) && (template = template.get("template")) ){
				return hyperglue(template, map);
			}
		},
		fetch: function () {
			if(conf.clientOnly){
				this.fetched = true;
				var self = this;
				var htmls = foldify(conf.paths.root + conf.paths.html);
				for(var name in htmls){
					self.add({id: name, template: htmls[name]});
				}
				process.nextTick(function(){
					self.trigger('fetched');
				});
			}else{
				return Backbone.fetch.apply(this, arguments);			
			}
	    }     
	});

	return new HTMLCollection([], options);
};