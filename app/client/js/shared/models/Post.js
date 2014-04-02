var digistify = require('digistify');
var marked = require('marked');

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
				if(contents.length === 1){
					self.set("content", marked(contents[0].content) );
				}else{
					self.set("content",marked(contents.filter(function(file){
							return !~file.filename.indexOf("tags:");
						})[0].content)
					);
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