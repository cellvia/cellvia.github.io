var digistify = require('digistify'),
	dbAdapter = require('../adapters/dbAdapter.js');

var Post = require('../models/Post')

module.exports = function(options){
	var type = firstLetterUpper(options.type);
	var FinalCollection = Backbone.collections[type] 
		? GistCollection.extend(Backbone.collections[type])
		: GistCollection;
	return new FinalCollection([], options);
};

var GistCollection = Backbone.Collection.extend({
	model: Post,
	toCollection: function(){
		var self = this;
		if(!Backbone.gistCache){
			Backbone.db.getAll(function(gists){
				Backbone.gistCache = gists;
				self.toCollection();
			}, function(){
				Backbone.gistCache = [];
				self.toCollection();
			});
			return;
		}

		var ready, i = 0;
		var gists = Backbone.gistCache.filter(function(gist, index){
			if(~gist.description.indexOf(self.options.identifier))
				return true;
			else{
				/* some crazy v8 array prefill trickery */
				process.nextTick(function(){
					if(!ready){
						Backbone.gistCache = new Array(Backbone.gistCache.length - gists.length);
						ready = true;
					}
					Backbone.gistCache[i++] = gist;
				})
			}
		}).map(function(gist){
			if(!gist.type) gist.type = self.options.identifier.split("~").join("");
			if(!gist.title) gist.title = gist.description.replace(self.options.identifier, '');
			if(!gist.slug) gist.slug = slug(gist.title);
			return gist;
		});

		self.add(gists);
    	self.fetched = true;
    	process.nextTick(function(){		    		
			self.trigger('fetched');
    	});
	},
	addGists: function(cacheExists, err, data){
		if(data === "unmodified" || cacheExists && err ){
			Backbone.db.updated = true;
			return Backbone.trigger("gistsUpdated");					
		}else if (!cacheExists && err){
			$("body").html("you are offline and have no cache!");
		}

		var gists = data.data;
		var len = gists.length;
		gists = gists.map(function(gist, index){
			var tags;
			for(var file in gist.files){
				if(!~file.indexOf("tags:")) continue;
				file = file.replace("tags:", "");
				tags = file.split(/, */);
			}
			var ret = { 
					 id: index,
					 etag: data.etag,
					 gistId: gist.id,
					 description: gist.description,
					 created: gist.created_at,
					 modified: gist.updated_at,
					 tags: tags || [],
					 type: false,
					 title: false,
					 slug: false }
			return ret;
		});

		var cb = Backbone.db.putBatch.bind(Backbone.db, gists, function(){
			Backbone.db.updated = true;
			Backbone.trigger("gistsUpdated");
		});

		Backbone.db.clear(cb, cb);
	},
	digistify: function(checkData){
		digistify("cellvia", checkData, this.addGists.bind(this, !!checkData) );
	},
	checkGists: function(){
		if(Backbone.db.updating) return
		Backbone.db.updating = true;
		Backbone.db.get(0, this.digistify.bind(this), this.digistify.bind(this) );
	},
	fetch: function (who) {
		if(!this.fetched){

			if(!Backbone.db.initialized)
				return this.listenToOnce( Backbone, "db", this.fetch.bind(this, "db") );

			if(!Backbone.db.updated){
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
		if(!Backbone.db){
			var self = this;
			var settings = {
			  dbVersion: 1,
			  storeName: "gists",
			  keyPath: 'id',
			  autoIncrement: false,
			  onStoreReady: function(){
			  	Backbone.db.initialized = true;
			    Backbone.trigger("db");
			  },
			  onError: function(){
			  	Backbone.db = dbAdapter(settings, true)
			  }
			};
			Backbone.db = dbAdapter(settings);
		}
	}
});


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

function firstLetterUpper(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function spliceOne(arr, index) {
    var len=arr.length;
    if (!len) return
    while (index<len) { 
    	arr[index] = arr[index+1]; 
    	index++; 
    }
    arr.length--;
}