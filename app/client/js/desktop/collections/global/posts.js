var foldify = require('foldify'),
	digistify = require('digistify');

var Post = require('../../models/Post')

module.exports = function(options){
	var GistCollection = Backbone.Collection.extend({
		model: Post,
		comparator: function(gist){
			return -gist.get("id");
		},
		initialize: function(models, options){
			var self = this;
			this.options || (this.options = options || {});			
			this.options.identifier = options.identifier;
			this.gists = new IDBStore({
			  dbVersion: 1,
			  storeName: options.identifier,
			  keyPath: 'id',
			  autoIncrement: false,
			  onStoreReady: function(){
			  	self.initialized = true;
			    self.trigger("initialized");
			  }
			});
		},
		getGists: function(etag){
			var self = this;
			var opts = {
				transform: "article",
				identifier: this.options.identifier
			};
			if(etag) opts.etag = etag;
			digistify("cellvia", opts, function(err, data){
				if(data === "unmodified"){
					self.gists.getAll(function(gists){
						self.add(gists)
						self.fetched = true;
						self.trigger('fetched');
					}, {order: 'DESC'} );
				}else{
					var gists = data.data;
					gists.map(function(gist){
						gist.slug = slug(gist.title);
						gist.getAllEtag = data.etag;
						return gist;
					});
					self.gists.putBatch( gists );
					self.fetched = true;
					self.add( gists );
					self.trigger('fetched');
				}
			});
		},
		fetch: function () {
			var self = this;
			if(!self.fetched){
				if(!self.initialized)
					return self.once("initialized", self.fetch);
				var opts = {
					autoContinue: false
				};
				this.gists.iterate(function(data){
					self.getGists(data.getAllEtag);
				}, opts);
			}else{
				process.nextTick(function(){
					self.trigger("fetched");				
				});
			}
	    }
	});

	return new GistCollection([], options);
};

function slug(input)
{
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}