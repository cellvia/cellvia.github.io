var foldify = require('foldify'),
	digistify = require('digistify');

var Post = require('../../models/Post')

module.exports = function(options){
	var GistCollection = Backbone.Collection.extend({
		model: Post,
		comparator: function(gist){
			return -gist.get("id");
		},
		toCollection: function(){
			var self = this;
			var gists = [];
			Backbone.gists.iterate(function(gist){
				if(!~gist.description.indexOf(self.options.identifier)) return
				if(!gist.identifier) gist.identifier = self.options.identifier;
				if(!gist.title) gist.title = gist.description.replace(self.options.identifier, '');
				if(!gist.slug) gist.slug = slug(gist.title);
				gists.push(gist);
			}, {onEnd: onEnd});

			function onEnd(){
				self.add(gists);
		    	self.fetched = true;
				self.trigger('fetched');
			}
		},
		digistify: function(checkData){
			var self = this;
			digistify("cellvia", checkData, function(err, data){
				if(data === "unmodified"){
					Backbone.gists.updated = true;
					return Backbone.trigger("gistsUpdated");					
				}

				var gists = data.data;
				gists = gists.map(function(gist){
					return { id: +gist.id,	
							 description: gist.description,
							 created: gist.created_at,
							 modified: gist.updated_at }
				});
				gists.push({id:1, etag: data.etag, description: "etag"});
				Backbone.gists.putBatch(gists, function(){
					Backbone.gists.updated = true;
					Backbone.trigger("gistsUpdated");
				});
			});
		},
		checkGists: function(etag){
			if(Backbone.gists.updating) return
			Backbone.gists.updating = true;
			Backbone.gists.get(1, this.digistify, this.digistify);
		},
		fetch: function () {
			if(!this.fetched){
				if(!Backbone.gists.initialized)
					return this.listenToOnce( Backbone, "db", this.fetch );
				if(!Backbone.gists.updated){
					this.listenToOnce( Backbone, "gistsUpdated", this.fetch );
					return this.checkGists();					
				}
				this.toCollection();
			}else{
				process.nextTick(function(){
					this.trigger("fetched");				
				}.bind(this));
			}
	    },
		initialize: function(models, options){
			if(!options.identifier) throw new Error("must supply options.identifier!");
			this.options || (this.options = options || {});
			if(!Backbone.gists){
				var self = this;
				Backbone.gists = new IDBStore({
				  dbVersion: 1,
				  storeName: "gists",
				  keyPath: 'id',
				  autoIncrement: false,
				  onStoreReady: function(){
				  	Backbone.gists.initialized = true;
				    Backbone.trigger("db");
				  }
				});				
			}
		}
	});

	return new GistCollection([], options);
};

function slug(input, identifier)
{
	if(identifier) input = input.replace(identifier, '') // Trim identifier
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}