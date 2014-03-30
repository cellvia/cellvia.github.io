var digistify = require('digistify');
var marked = require('marked');

module.exports = Backbone.Model.extend({
	getGist: function(etag){
		var self = this;
		var opts = {
			fileTransform: function(file){
				return marked(file.content);
			}
		};
		if(etag) opts.etag = etag;
		digistify(self.id, opts, function(err, data){
			if(data === "unmodified"){
				self.fetched = true;
				self.trigger("fetched");
			}else{
				var contents = data.data;
				self.set("content", contents.length === 1 ? contents[0] : contents );
				self.set("etag", data.etag);
				self.collection.gists.put(self.toJSON());
				self.fetched = true;
				self.trigger('fetched');
			}
		});
	},
	fetch: function(){	
		var self = this;
		var etag;
		if(!self.fetched){
			this.getGist(this.get("etag"));
		}else{
			process.nextTick(function(){
				self.trigger("fetched");				
			});
		}
	}
})