var digistify = require('digistify');
var marked = require('marked');
var hyperglue = require('hyperglue');

module.exports = Backbone.Model.extend({
	getGist: function(){
		if(this.get('content')){
			this.fetched = true;
			var self = this;
			process.nextTick(function(){
				self.trigger("fetched");				
			});
		}else{
			var self = this;
			digistify(self.id, {}, function(err, data){
				var contents = data.data;
				var map = {
						'ul': { class: "topcoat-list list" },
						'li': { class: "topcoat-list__item" },
					};
				if(contents.length === 1){
					var md = marked(contents[0].content).replace("\r", "");
					var content = hyperglue(md, map).outerHTML;
					console.log(md)
					console.log(hyperglue(md, map))
					console.log(content)
					self.set("content", content );
				}else{
					var md = marked(contents.filter(function(file){
							return !~file.filename.indexOf("tags:");
						})[0].content).replace("\r", "");
					console.log(md)
					console.log(hyperglue(md, map))
					console.log(content)
					self.set("content", hyperglue(md, map).outerHTML );
				}
				Backbone.gists.put(self.toJSON());
				self.fetched = true;
				self.trigger('fetched');
			});
		}
	},
	fetch: function(){	
		if(!this.fetched){
			this.getGist();
		}else{
			process.nextTick(function(){
				this.trigger("fetched");				
			}.bind(this));
		}
	}
})