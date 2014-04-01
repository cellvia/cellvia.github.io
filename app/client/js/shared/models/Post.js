var digistify = require('digistify');
var marked = require('marked');

module.exports = Backbone.Model.extend({
	getGist: function(){
		var self = this;
		var opts = {
			fileTransform: function(file){
				return marked(file.content);
			}
		};
		if(this.content){
			self.fetched = true;
			process.nextTick(function(){
				self.trigger("fetched");				
			});
		}else{
			digistify(self.id, opts, function(err, data){
				var contents = data.data;
				self.set("content", contents.length === 1 ? contents[0] : contents );
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