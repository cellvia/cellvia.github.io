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
						'h3' :{ class: "topcoat-list__header" },
						'ul': { class: "topcoat-list list" },
						'li': { class: "topcoat-list__item listitem" }
					};
				if(contents.length === 1){
					var md = marked(contents[0].content);
					var content = hyperglue(md, map);
					if(!content.length){
						content = content.outerHTML;
					}else{
						content = [].reduce.call(content, function(prev, next){
							if ( next.nodeType === 3 || typeof next === "string" || typeof next === "function" ) 
								return prev;
							else
								return prev + (next.outerHTML || next.innerHTML);
						}, "");						
					}
					self.set("content", content );
				}else{
					var md = marked(contents.filter(function(file){
							return !~file.filename.indexOf("tags:");
						})[0].content);
					var content = hyperglue(md, map);
					if(!content.length){
						content = content.outerHTML;
					}else{
						content = [].reduce.call(content, function(prev, next){
							if ( next.nodeType === 3 || typeof next === "string" || typeof next === "function" ) 
								return prev;
							else
								return prev + (next.outerHTML || next.innerHTML);
						}, "");						
					}
					self.set("content", content );
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