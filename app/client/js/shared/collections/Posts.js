var foldify = require('foldify'),
	digistify = require('digistify'),
	dbAdapter = require('../adapters/dbAdapter.js');

var Post = require('../models/Post')

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
				if(!gist.type) gist.type = self.options.identifier.split("~").join("");
				if(!gist.title) gist.title = gist.description.replace(self.options.identifier, '');
				if(!gist.slug) gist.slug = slug(gist.title);
				gists.push(gist);
			}, {onEnd: onEnd});

			function onEnd(){
				self.add(gists);
		    	self.fetched = true;
		    	process.nextTick(function(){		    		
					self.trigger('fetched');
		    	});
			}
		},
		addGists: function(cacheExists, err, data){
			if(data === "unmodified" || cacheExists && err ){
				Backbone.gists.updated = true;
				return Backbone.trigger("gistsUpdated");					
			}else if (!cacheExists && err){
				alert("you are offline and have no cache!")
			}

			var gists = data.data;
			gists = gists.map(function(gist){
				var tags;
				for(var file in gist.files){
					if(!~file.indexOf("tags:")) continue;
					file = file.replace("tags:", "");
					tags = file.split(/, */);
				}
				var ret = { id: +gist.id,	
						 description: gist.description,
						 created: gist.created_at,
						 modified: gist.updated_at }
				if(tags) ret.tags = tags;
				return ret;
			});
			gists.push({id:1, etag: data.etag, description: "etag"});
			Backbone.gists.putBatch(gists, function(){
				Backbone.gists.updated = true;
				Backbone.trigger("gistsUpdated");
			});
		},
		digistify: function(checkData){
			digistify("cellvia", checkData, this.addGists.bind(this, !!checkData) );
		},
		checkGists: function(){
			if(Backbone.gists.updating) return
			Backbone.gists.updating = true;
			Backbone.gists.get(1, this.digistify.bind(this), this.digistify.bind(this) );
		},
		fetch: function () {
			if(!this.fetched){

				if(!Backbone.gists.initialized)
					return this.listenToOnce( Backbone, "db", this.fetch );

				/* if IE load manually
					var conf = require('confify');
					var gists = foldify(conf.paths.root, {whitelist: "gists.json"});
					this.addGists(false, {data: gists})
					return this.toCollection();
				*/

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
				Backbone.gists = dbAdapter({
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