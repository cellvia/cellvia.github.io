(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var router = require('../shared/Router'),
    foldify = require('foldify'),
    conf = require('confify');

conf({displayType: "desktop"});

var routes = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["error"] = require("/home/anthropos/work/personal/cellvia.github.io/client/js/desktop/routes/error.js");returnMe["posts"] = require("/home/anthropos/work/personal/cellvia.github.io/client/js/desktop/routes/posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})()),
    LayoutView = require('./views/layout');

//grab global collections
Backbone.collections = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["Html"] = require("/home/anthropos/work/personal/cellvia.github.io/client/js/shared/collections/Html.js");returnMe["Posts"] = require("/home/anthropos/work/personal/cellvia.github.io/client/js/shared/collections/Posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})());

//attach routes
routes(router);

//attach global collections
Backbone.sections = ['code', 'music', 'art', 'thoughts', 'projects'];
Backbone.sections.forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({identifier: "~"+type+"~"});
});
Backbone.collections.html = Backbone.collections.Html();

//transitioner
Backbone.transition = function(){
	Backbone.transition = function(container, rendered){
		container.html( rendered );
	};
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
}

//initiate main view
new LayoutView();

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});

},{"../shared/Router":8,"./views/layout":5,"/home/anthropos/work/personal/cellvia.github.io/client/js/desktop/routes/error.js":2,"/home/anthropos/work/personal/cellvia.github.io/client/js/desktop/routes/posts.js":3,"/home/anthropos/work/personal/cellvia.github.io/client/js/shared/collections/Html.js":13,"/home/anthropos/work/personal/cellvia.github.io/client/js/shared/collections/Posts.js":14,"confify":16,"foldify":19}],2:[function(require,module,exports){
var ErrorView = require('../views/error');

module.exports = function(router){

	router.error = function(status){
    	router.view( ErrorView, {errorCode: status, group: "errors"} );
  	};

	router.route('500', 'error', router.error.bind(router, 500) );
	router.route('404', 'error', router.error.bind(router, 404) );
	router.route('403', 'error', router.error.bind(router, 403) );

}
},{"../views/error":4}],3:[function(require,module,exports){
var PostsView = require('../views/posts');
var PostView = require('../views/post');

module.exports = function(router){

	router.route('', 'blog', function(type){
    	// router.destroy(null, {replace: true});
	});

	router.route('tag/:tag', 'taggedPosts', function(tag){
    	router.view( PostsView, {"tag": tag} );
	});

	router.route('articles/:type', 'posts', function(type){
    	router.view( PostsView, {"type": type} );
	});

	router.route('article/:type/:slug', 'post', function(type, slug){
    	router.view( PostView, {"slug": slug, "type": type} );
	});
	
}

},{"../views/post":6,"../views/posts":7}],4:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	initialize: function(opts){
		alert("error!"+opts.errorCode);		
	}
})

},{"../../shared/View":9}],5:[function(require,module,exports){
var View = require('../../shared/View');
// var insertCss = require('insert-css');
// var foldify = require('foldify');
// var grid = foldify("topcoat-grid/css", {whitelist: "grid.min.css"});
// var topcoatCss = foldify("topcoat/css", {whitelist: "topcoat-desktop-light.css"});
// var topcoatFonts = foldify("topcoat/font", {encoding: "base64"});
// var conf = require('confify');

// insertCss(grid["grid.min.css"]);

// insertCss(
// 	topcoatCss["topcoat-desktop-light.css"]
// 		.replace(/..\/font\/(.*?)\.otf/g, 
// 			function(match, p1){
// 				p1 = p1 + ".otf";
// 				return "data:application/octet-stream;base64,"+topcoatFonts[p1];
// 			}
// 		)
// );

module.exports = View.extend({
	el: "body",
	render: function(){
		var map = { 
			'#title a': { href: "/", _text: "Brandon's Blog" },
			'#menu': Backbone.sections.map(function(section){
				return {'a': {
					href: '/articles/'+section,
					_text: section
				}}
			})
		}
		var rendered = this.html.render("body.html", map);
		Backbone.transition( this.$el, rendered );
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();

		//updates gist cache
		Backbone.collections[Backbone.sections[0]].fetch();
	}
});

},{"../../shared/View":9}],6:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		if(this.rendered) return
		var rendered = this.html.render("post.html", 
			{
				'.link': { href: "/article/"+this.type+"/"+this.slug},
				'.title': this.post.get("title"),
				'.created': this.post.get("created"),
				'.content': { _html: this.post.get("content") }
			}
		);
		Backbone.transition( this.$el, rendered );

		this.rendered = true;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
	
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});

		this.listenToOnce( this.post, "fetched", this.render );
		this.post.fetch();
		this.fetched = true;
	},
	initialize: function(opts){

		this.slug = opts.slug;
		this.type = opts.type;

		this.posts = Backbone.collections[this.type];
		this.listenToOnce( this.posts, "fetched", this.fetchPost );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.listenToOnce( this.html, "fetched", this.fetchPost );
		this.html.fetch();
	}
});
},{"../../shared/View":9}],7:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return			
		var self = this;

		var postsMap = this.posts.map(function(post){
			var tags = post.get("tags");
			if(tags) tags = tags.join(", ");
			return { 
				'.link': { href: "/article/" + post.get("type") + "/" + post.get("slug") },
				'.title': post.get("title"),
				'.created': post.get("created"),
				'.tags': tags
			}
		});
		var rendered = this.html.render("posts.html", { ".title": this.type, ".post": postsMap });
		Backbone.transition( this.$el, rendered );
		this.rendered = true;
	},
	compileByTag: function(coll, models){
		this.posts = coll;
		models.forEach(function(model){
			if(!this.posts.get({id: model.get("id")}))
				this.posts.add(model);
		}.bind(this));
		this.posts.fetched = true;
		this.render();
	},
	initialize: function(options){
		this.counter = 0;

		this.type = options.type;
		if(options.tag){
			this.posts = {};
			var models = [];
			for(var coll in Backbone.collections){
				if(coll === "html") continue;
				this.counter++;
				this.listenToOnce( Backbone.collections[coll], "fetched", function(coll){
					models = models.concat( Backbone.collections[coll].filter(function(item){
						var tags = item.get('tags');
						return tags && ~tags.indexOf(options.tag); 
					}) );
					if(!--this.counter) this.compileByTag(Backbone.collections[coll], models);	
				}.bind(this, coll));
				Backbone.collections[coll].fetch();
			}
		}else{
			this.posts = Backbone.collections[this.type];
			this.listenToOnce(this.posts, "fetched", this.render );
			this.posts.fetch();			
		}

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
},{"../../shared/View":9}],8:[function(require,module,exports){
var ViewCore = require('./ViewCore');

var Router = Backbone.Router.extend({
    go: function(data){
      this.navigate(data.href, {
        trigger: (data.trigger === false) ? false : true, 
        replace: (data.replace === true) ? true : false 
      });
    },
    initialize: function(){
      $.ajaxSetup({ cache: false });
      Backbone.on('go', this.go.bind(this));
    }
});

Router = Router.extend(ViewCore);

module.exports = new Router();
},{"./ViewCore":10}],9:[function(require,module,exports){
var ViewCore = require('./ViewCore');
// var ViewEventsCore = require('./ViewEventsCore');
// var viewCore = Backbone.View.extend(ViewCore);
module.exports = Backbone.View.extend(ViewCore);
},{"./ViewCore":10}],10:[function(require,module,exports){
(function (process){
var viewCache = [];
window.viewCache = viewCache

var conf = require('confify');
var MAXCACHE = 8;

module.exports = {
    _destroyViews: function(group, options, subview){
      options = options || {};
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        view.destroy(undefined, {}, true);
        view.stopListening();
        view.undelegateEvents();
        if(view.iscroll){
          view.iscroll.destroy();
          delete view.iscroll;
        } 
        if(options.replace !== true || Backbone.isMobile || subview) return
        var el = view.$el;
        if(el && el.length)
            el.replaceWith("<div id="+el.attr('id')+">");        
      });
      if(options.replace !== true || Backbone.isMobile) return
      delete this._views[group];
    },
    manageCache: function(view){
      if(viewCache.length+1 > MAXCACHE){
        var removeView = viewCache.pop().destroy();
        removeView = null;
      }
      viewCache.push(view);
    },
    exists: function(type){
      return this._views && this._views[type] && this._views[type].length; 
    },
    view: function(View, options){      
      options = options || {};
      options.group = options.group || "global";
      if( options.resetAll !== false )
        this.destroy(null, options);
      if(!this._views) this._views = {};
      if(!this._views[options.group])
        this._views[options.group] = [];
      else if( options.reset !== false )
        this.destroy(options.group, options);        

      var opts = { parent: this, hits: 1 };      
      _.extend(View, options, opts);
      this._views[options.group].push(View);
      this.manageCache(View);
    },
    destroy: function(group, options, subview){
      if(group && this._views[group]){
        this._destroyViews(group, options, subview)
      }
      else{
        for(var group in this._views){
          this._destroyViews(group, options, subview);
        }
      }
      return this;
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+resp.status });
    },
    reinitialize: function(){
      this.hits++;
      process.nextTick(function(){
        viewCache.sort(function(prev, next){
          if(next.hits === prev.hits) return 0;
          return next.hits >= prev.hits ? 1 : -1;
        });
      });
      this.delegateEvents();
      var options = this.options || {};
      options.cached = true;
      this.initialize(options);
    }
}
}).call(this,require("q+64fw"))
},{"confify":16,"q+64fw":28}],11:[function(require,module,exports){
(function (process){
var store = require('./store');
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var useAdapter = !indexedDB || Backbone.isIE && Backbone.isIE < 10;

module.exports = function(options, force){
	return useAdapter || force
		? newstore(options)
		: new IDBStore(options);
}

function newstore(options){
	
	if(options.onStoreReady){
		process.nextTick(function(){
			options.onStoreReady();		
		});		
	}

	return {
		putBatch: function(arr, cb){
			arr.forEach(this.put);
			return cb();
		},
		get: function(id, cb){
			return cb(store.get(""+id));
		},
		getAll: function(cb){	
			return cb( _.values(store.getAll()) );
		},
		put: function(item){
			return store.set(""+item.id, item);
		},
		clear: function(cb){
			store.clear();
			cb();
		}
	}
}

}).call(this,require("q+64fw"))
},{"./store":12,"q+64fw":28}],12:[function(require,module,exports){
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")())

},{}],13:[function(require,module,exports){
(function (process){
var foldify = require('foldify'),
	hyperglue = require('hyperglue'),
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
			if(true){
				this.fetched = true;
				var self = this;
				var htmls = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["body.html"] = "<body>\n\n\t<div id=\"header\">\n\t\t<h1 id=\"title\"><a></a><span></span></h1>\n\t\t<div id=\"menu\">\n\t\t\t<a></a>\n\t\t</div>\n\t</div>\n\t<div id=\"page\"></div>\n\t<div id=\"footer\"></div>\n</body>";returnMe["post.html"] = "<div class=\"post\">\n\t<a class=\"link\"><h1 class=\"title\"></h1><span class=\"created\"></span></a>\n\t<div class=\"content\">\n\n\t</div>\n</div>";returnMe["posts.html"] = "<div class=\"posts\">\n\t<h1><a class=\"title\"></a></h1>\n\t<div class=\"post\">\n\t\t<a class=\"link\"><span class=\"title\"></span> (<span class=\"created\"></span>)</a>\n\t</div>\n</div>";for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})());
				for(var name in htmls)
					self.add({id: name, template: htmls[name]});
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
}).call(this,require("q+64fw"))
},{"confify":16,"foldify":19,"hyperglue":23,"q+64fw":28}],14:[function(require,module,exports){
(function (process){
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
}).call(this,require("q+64fw"))
},{"../adapters/dbAdapter.js":11,"../models/Post":15,"digistify":17,"q+64fw":28}],15:[function(require,module,exports){
(function (process){
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
			digistify.getFiles(self.get("gistId"), {}, function(err, data){
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
				Backbone.db.put(self.toJSON());
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
}).call(this,require("q+64fw"))
},{"digistify":17,"hyperglue":23,"marked":25,"q+64fw":28}],16:[function(require,module,exports){
function merge(a, b){
    for(var prop in b){
        a[prop] = b[prop];
    }
}

module.exports = function browser(srcObj){
    merge(browser, srcObj);
};

},{}],17:[function(require,module,exports){
(function (process){
var request = require('request');

var exportObj = {
	defaults: {},
	setDefault: function(prop, val){
		if(typeof prop === "object")
			merge(exportObj.defaults, prop);
		else
			exportObj.defaults[prop] = val;		
	},
	getGists: function (user, options, cb){
		if(!isNaN(user)) return exportObj.getFiles.apply(exportObj, arguments);
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		options = merge(options, exportObj.defaults);
		var gists = [];
		var counter = 0;
		var limit = options.limit || 0;
		var offset = options.offset || 0;
		var identifier = options.identifier || "";
		var transform;

		switch(options.transform){
			case "article":
				transform = function(gist){
					return { id: +gist.id,
							 title: gist.description.replace(identifier, ""),
							 created: gist.created_at,
							 modified: gist.updated_at }
				}
			break;
			default:
				transform = typeof options.transform === "function" ? options.transform : false;
			break;
		}

		var opts = {json: true, headers: {} };
		if(options.etag){
			opts.headers['If-None-Match'] = options.etag;
			delete options.etag; 
		}
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		var etag;

		function recurs(){
			opts.url = get_gists_url(user, {per_page: 100, page: ++counter});
			request( opts, function(err, resp, newgists){
				if(resp.statusCode == 304) return cb(null, "unmodified");
				if(err) return cb(err);
				if(resp.statusCode != 200) return cb(new Error("invalid url: "+ opts.url));
				if(!etag) etag = resp.headers ? resp.headers['ETag'] : resp.getResponseHeader('ETag');
				if(typeof newgists !== "object" || typeof newgists.length === "undefined" || newgists.message) return cb(new Error("error: "+ newgists));
				if(!newgists.length) return finalize();

				newgists = newgists.filter(function(gist){
					var test = gist.public 
						&& gist.description 
						&& gist.files
						&& (!options.identifier || ~gist.description.indexOf(options.identifier))
						&& (!options.search || ~gist.description.toLowerCase().indexOf(options.search.toLowerCase()))
						&& (!options.filter || !~gist.description.toLowerCase().indexOf(options.filter.toLowerCase()));

					if (!test) return false;

					if(options.language){
						for( var file in gist.files ){
							if( test = gist.files[file].language.toLowerCase() === options.language.toLowerCase() )
								return test
						}				
					}
					return test
				});

				gists = gists.concat(newgists);
				if(newgists.length < 100 || limit && limit <= gists.length) return finalize();

				recurs();

			});
		}
		recurs();

		function finalize(){
			if(offset || limit) gists = gists.slice(offset, limit);
			if( transform ) gists = gists.map(transform);
			cb(null, { data: gists, etag: etag });
		}
	},

	getFiles: function(id, options, cb){
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		merge(options, exportObj.defaults);
		var contents = [];
		var transform;

		switch(options.fileTransform){
			case "article":
				transform = function(file){
					return file.content
				}
			break;
			default:
				transform = typeof options.fileTransform === "function" ? options.fileTransform : false;
			break;
		}

		var opts = {json: true, headers: {}, url: get_gist_url(id) };
		if(options.etag){
			opts.headers['If-None-Match'] = options.etag;
			delete options.etag; 
		}
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		request( opts, function(err, resp, gist){
			if(resp.statusCode == 304) return cb(null, "unmodified");
			if(err) return cb(err);
			if(resp.statusCode != 200) return cb(new Error("invalid url? "+ opts.url));
			var etag = resp.headers ? resp.headers['ETag'] : resp.getResponseHeader('ETag');
			for(var file in gist.files){
				if(options.language && gist.files[file].language.toLowerCase() !== options.language.toLowerCase()) continue
				contents.push(gist.files[file]);
			}
			if(transform) contents = contents.map(transform);
			cb(null, { data: contents, etag: etag });
		});
	}
}

function get_gists_url(user, options){ return "https://api.github.com/users/"+user+"/gists?per_page="+options.per_page+"&page="+options.page; };
function get_gist_url(id){ return "https://api.github.com/gists/"+id; };
function merge(a, b){ a = a || {}; for (var x in b){ if(typeof a[x] !== "undefined") continue; a[x] = b[x]; } return a; };

module.exports = exportObj.getGists;
module.exports.getFiles = exportObj.getFiles;
module.exports.setDefault = exportObj.setDefault;

}).call(this,require("q+64fw"))
},{"q+64fw":28,"request":18}],18:[function(require,module,exports){
// Browser Request
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var XHR = XMLHttpRequest
if (!XHR) throw new Error('missing XMLHttpRequest')

module.exports = request
request.log = {
  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
}

var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

//
// request
//

function request(options, callback) {
  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
  if(typeof callback !== 'function')
    throw new Error('Bad callback given: ' + callback)

  if(!options)
    throw new Error('No options given')

  var options_onResponse = options.onResponse; // Save this for later.

  if(typeof options === 'string')
    options = {'uri':options};
  else
    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

  options.onResponse = options_onResponse // And put it back.

  if (options.verbose) request.log = getLogger();

  if(options.url) {
    options.uri = options.url;
    delete options.url;
  }

  if(!options.uri && options.uri !== "")
    throw new Error("options.uri is a required argument");

  if(typeof options.uri != "string")
    throw new Error("options.uri must be a string");

  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
  for (var i = 0; i < unsupported_options.length; i++)
    if(options[ unsupported_options[i] ])
      throw new Error("options." + unsupported_options[i] + " is not supported")

  options.callback = callback
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  options.body    = options.body || null
  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

  if(options.headers.host)
    throw new Error("Options.headers.host is not supported");

  if(options.json) {
    options.headers.accept = options.headers.accept || 'application/json'
    if(options.method !== 'GET')
      options.headers['content-type'] = 'application/json'

    if(typeof options.json !== 'boolean')
      options.body = JSON.stringify(options.json)
    else if(typeof options.body !== 'string')
      options.body = JSON.stringify(options.body)
  }

  // If onResponse is boolean true, call back immediately when the response is known,
  // not when the full request is complete.
  options.onResponse = options.onResponse || noop
  if(options.onResponse === true) {
    options.onResponse = callback
    options.callback = noop
  }

  // XXX Browsers do not like this.
  //if(options.body)
  //  options.headers['content-length'] = options.body.length;

  // HTTP basic authentication
  if(!options.headers.authorization && options.auth)
    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

  return run_xhr(options)
}

var req_seq = 0
function run_xhr(options) {
  var xhr = new XHR
    , timed_out = false
    , is_cors = is_crossDomain(options.uri)
    , supports_cors = ('withCredentials' in xhr)

  req_seq += 1
  xhr.seq_id = req_seq
  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

  if(is_cors && !supports_cors) {
    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
    cors_err.cors = 'unsupported'
    return options.callback(cors_err, xhr)
  }

  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
  function too_late() {
    timed_out = true
    var er = new Error('ETIMEDOUT')
    er.code = 'ETIMEDOUT'
    er.duration = options.timeout

    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
    return options.callback(er, xhr)
  }

  // Some states can be skipped over, so remember what is still incomplete.
  var did = {'response':false, 'loading':false, 'end':false}

  xhr.onreadystatechange = on_state_change
  xhr.open(options.method, options.uri, true) // asynchronous
  if(is_cors)
    xhr.withCredentials = !! options.withCredentials
  xhr.send(options.body)
  return xhr

  function on_state_change(event) {
    if(timed_out)
      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

    if(xhr.readyState === XHR.OPENED) {
      request.log.debug('Request started', {'id':xhr.id})
      for (var key in options.headers)
        xhr.setRequestHeader(key, options.headers[key])
    }

    else if(xhr.readyState === XHR.HEADERS_RECEIVED)
      on_response()

    else if(xhr.readyState === XHR.LOADING) {
      on_response()
      on_loading()
    }

    else if(xhr.readyState === XHR.DONE) {
      on_response()
      on_loading()
      on_end()
    }
  }

  function on_response() {
    if(did.response)
      return

    did.response = true
    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
    clearTimeout(xhr.timeoutTimer)
    xhr.statusCode = xhr.status // Node request compatibility

    // Detect failed CORS requests.
    if(is_cors && xhr.statusCode == 0) {
      var cors_err = new Error('CORS request rejected: ' + options.uri)
      cors_err.cors = 'rejected'

      // Do not process this request further.
      did.loading = true
      did.end = true

      return options.callback(cors_err, xhr)
    }

    options.onResponse(null, xhr)
  }

  function on_loading() {
    if(did.loading)
      return

    did.loading = true
    request.log.debug('Response body loading', {'id':xhr.id})
    // TODO: Maybe simulate "data" events by watching xhr.responseText
  }

  function on_end() {
    if(did.end)
      return

    did.end = true
    request.log.debug('Request done', {'id':xhr.id})

    xhr.body = xhr.responseText
    if(options.json) {
      try        { xhr.body = JSON.parse(xhr.responseText) }
      catch (er) { return options.callback(er, xhr)        }
    }

    options.callback(null, xhr, xhr.body)
  }

} // request

request.withCredentials = false;
request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

//
// defaults
//

request.defaults = function(options, requester) {
  var def = function (method) {
    var d = function (params, callback) {
      if(typeof params === 'string')
        params = {'uri': params};
      else {
        params = JSON.parse(JSON.stringify(params));
      }
      for (var i in options) {
        if (params[i] === undefined) params[i] = options[i]
      }
      return method(params, callback)
    }
    return d
  }
  var de = def(request)
  de.get = def(request.get)
  de.post = def(request.post)
  de.put = def(request.put)
  de.head = def(request.head)
  return de
}

//
// HTTP method shortcuts
//

var shortcuts = [ 'get', 'put', 'post', 'head' ];
shortcuts.forEach(function(shortcut) {
  var method = shortcut.toUpperCase();
  var func   = shortcut.toLowerCase();

  request[func] = function(opts) {
    if(typeof opts === 'string')
      opts = {'method':method, 'uri':opts};
    else {
      opts = JSON.parse(JSON.stringify(opts));
      opts.method = method;
    }

    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
    return request.apply(this, args);
  }
})

//
// CouchDB shortcut
//

request.couch = function(options, callback) {
  if(typeof options === 'string')
    options = {'uri':options}

  // Just use the request API to do JSON.
  options.json = true
  if(options.body)
    options.json = options.body
  delete options.body

  callback = callback || noop

  var xhr = request(options, couch_handler)
  return xhr

  function couch_handler(er, resp, body) {
    if(er)
      return callback(er, resp, body)

    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
      // The body is a Couch JSON object indicating the error.
      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
      for (var key in body)
        er[key] = body[key]
      return callback(er, resp, body);
    }

    return callback(er, resp, body);
  }
}

//
// Utility
//

function noop() {}

function getLogger() {
  var logger = {}
    , levels = ['trace', 'debug', 'info', 'warn', 'error']
    , level, i

  for(i = 0; i < levels.length; i++) {
    level = levels[i]

    logger[level] = noop
    if(typeof console !== 'undefined' && console && console[level])
      logger[level] = formatted(console, level)
  }

  return logger
}

function formatted(obj, method) {
  return formatted_logger

  function formatted_logger(str, context) {
    if(typeof context === 'object')
      str += ' ' + JSON.stringify(context)

    return obj[method].call(obj, str)
  }
}

// Return whether a URL is a cross-domain request.
function is_crossDomain(url) {
  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

  // jQuery #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  var ajaxLocation
  try { ajaxLocation = location.href }
  catch (e) {
    // Use the href attribute of an A element since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    , parts = rurl.exec(url.toLowerCase() )

  var result = !!(
    parts &&
    (  parts[1] != ajaxLocParts[1]
    || parts[2] != ajaxLocParts[2]
    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
    )
  )

  //console.debug('is_crossDomain('+url+') -> ' + result)
  return result
}

// MIT License from http://phpjs.org/functions/base64_encode:358
function b64_enc (data) {
    // Encodes string using MIME base64 algorithm
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    // assume utf8 data
    // data = this.utf8_encode(data+'');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}

},{}],19:[function(require,module,exports){
(function (process){
var fs = require('fs'),
	path = require('path'),
	minimatch = require('minimatchify'),
    callsite = require('callsite');

module.exports = fold;

function fold(toBeFolded){
	if(!toBeFolded) return false;
	var moreArgs = [].slice.call(arguments, 1),
		mergeToMe = {},
		options,
		individual,
		originalFullPath,
		stack;
	   
	if(isArray(toBeFolded)){
		options = moreArgs[0];
		originalFullPath = options.fullPath;
		toBeFolded.forEach(function(toFold){
			individual = fold.call(this, toFold, options)
			for(var prop in individual){
				if(mergeToMe[prop]){
					options.fullPath = true;
					individual = fold.call(this, toFold, options);
					options.fullPath = originalFullPath;
					break;
				}
			}
			for (var prop in individual) {
	          mergeToMe[prop] = individual[prop];
	        }
		});
		return bind( fold, {foldStatus: true}, mergeToMe );
	}

	var	beingFolded = this && this.foldStatus,
		isObj = typeof toBeFolded === "object" && !beingFolded,
		isFoldObj = typeof toBeFolded === "object" && beingFolded,
		isDir = typeof toBeFolded === "string",
		args,
		output,
		combined;
	
	switch(false){
		case !isDir:
			options = moreArgs[0] || {};
			if(!process.browser){
				stack = callsite();				
				options.requester = stack[1].getFileName();
			}
			output = populate.apply(this, [toBeFolded, options]);
		break;
		case !isFoldObj:
			args = moreArgs[0] || [];
			args = isArray(args, true) ? args : [args]
			if(this.foldStatus === "foldOnly"){
				args2 = moreArgs[1] || [];
				args2 = isArray(args2) ? args2 : [args2]
				args = args.concat(args2);
				options = moreArgs[2] || {};				
			}else{
				options = moreArgs[1] || {};
			}			
			output = evaluate.apply(this, [toBeFolded, args, options]);
		break;
		case !isObj:
			options = moreArgs[0] || {};
			for(var name in toBeFolded){
				if( (options.whitelist && !checkList(options.whitelist, name))
				  || (options.blacklist && checkList(options.blacklist, name)) )
					continue
				fold[name] = toBeFolded[name];
			}
			output = bind( fold, {foldStatus: true}, fold );
		break;
	}

	return output;

};

function populate(dirname, options){
	if(process.browser) throw "you must run the foldify browserify transform (foldify/transform.js) for foldify to work in the browser!";
	var proxy = {},
		toString = options.output && options.output.toLowerCase() === "string",
		toArray = options.output && options.output.toLowerCase() === "array",
		encoding = options.encoding || options.enc || "utf-8",
		returnMe,
		existingProps = [],
		newdirname,
		separator,
		parts,
		map = options.tree ? {} : false,
		files = [],
		matches;

	if(toString){
		returnMe = "";
	}else if(toArray){
		returnMe = [];
	}else{
		returnMe = bind( fold, { foldStatus: true, map: map }, proxy );
	}

    try{
    	if(options.requester && /(^\.\/)|(^\.\.\/)/.test(dirname)){
    		dirname = dirname
                    .replace(/^\.\//, path.dirname(options.requester)+"/")
                    .replace(/^\.\.\//, path.dirname(options.requester)+"/../");
            throw "done";
    	}
	    if(~dirname.indexOf("/"))
	        separator = "/";
	    if(~dirname.indexOf("\\"))
	        separator = "\\";
	    parts = dirname.split(separator);
        newdirname = path.dirname( require.resolve( parts[0] ) );
    	if(!~newdirname.indexOf("node_modules")) throw "not a node module";
        dirname = newdirname + path.sep + parts.slice(1).join(path.sep);
    }catch(err){}


    function recurs(thisDir){
        fs.readdirSync(thisDir).forEach(function(file){
            var filepath = path.join( thisDir, file);
            if(path.extname(file) === ''){
              if(options.recursive || options.tree) recurs(filepath);
              return  
            } 
            files.push(filepath);        		
        });
    }
    recurs(dirname);

    if(options.whitelist) files = whitelist(options.whitelist, files, dirname)
    if(options.blacklist) files = blacklist(options.blacklist, files, dirname)

	files.forEach(function(filepath){
		var ext = path.extname(filepath),
			name = path.basename(filepath, ext),
			filename = name + ext,
			isJs = (ext === ".js" || ext === ".json"),
			isDir = ext === '',
			propname,
			add,
			last = false;

		if( toString ){
			returnMe += fs.readFileSync(filepath, encoding);					
			return
		}

		if( toArray ){
			returnMe.push( fs.readFileSync(filepath, encoding) );
			return
		}

		if(!options.includeExt && (isJs || options.includeExt === false) )
			propname = name;
		else
			propname = filename;

		if(!options.tree){
	        if(options.fullPath || ~existingProps.indexOf(propname) )
	            propname = path.relative(dirname, filepath);
	        else
	            existingProps.push(propname);			
		}

		if((isJs && options.jsToString) || !isJs )
			add = fs.readFileSync(filepath, encoding);
		else
			add = require(filepath);

		if(map){
			var paths = path.relative(dirname, filepath).split(path.sep);
			var last, thismap;
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnMe[ paths[x] ] )
						returnMe[ paths[x] ] = {};
					last = returnMe[ paths[x] ]
					if(!map[ paths[x] ] )
						map[ paths[x] ] = {};
					thismap = map[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
					if(!thismap[ paths[x] ] )
						thismap[ paths[x] ] = {};
					thismap = thismap[ paths[x] ];
				}else{
					last[ propname ] = add;
					thismap[ propname ] = true;
				}
			}
		}else{
			returnMe[propname] = add;
		}
		
	});

	for(var p in returnMe) proxy[p] = returnMe[p];
	return returnMe;
}	

function evaluate(srcObj, args, options){
	var proxy = {}, returnObj;
	if(options.evaluate === false){
		this.foldStatus = "foldOnly";
		returnObj = bind( fold, this, proxy, args );
	}
	else
		returnObj = bind( fold, this, proxy );

	var objpaths = flatten.call(this.map, srcObj);

	for(var objpath in objpaths){
		var isWhitelisted = false,
			isBlacklisted = false,
			skip = false,
			add = false,
			node = false,
			last = false;

		if(options.whitelist && checkList(options.whitelist, objpath))
			isWhitelisted = true;

		if(options.blacklist && checkList(options.blacklist, objpath))
			isBlacklisted = true;

		skip = (options.whitelist && !isWhitelisted) || isBlacklisted;

		if(skip && options.trim) continue;

		add = node = objpaths[objpath];

		if(!skip && typeof node === "function")
			add = options.evaluate !== false ? node.apply( srcObj, args) : bind.apply( bind, [node, srcObj].concat(args) );
		
		if(typeof add === "undefined" && options.allowUndefined !== true && options.trim)
			continue

		if(typeof add === "undefined" && options.allowUndefined !== true)
			add = node

		if(this.map){
			paths = objpath.split(path.sep);
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnObj[ paths[x] ] )
						returnObj[ paths[x] ] = {};
					last = returnObj[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
				}else{
					last[ paths[x] ] = add;
				}
			}			
		}else{
			returnObj[objpath] = add;
		}
	}

	for(var p in returnObj) proxy[p] = returnObj[p];
	return returnObj;
}

function checkList(list, name){
	list = isArray(list) ? list : [list];
	return list.some(function(rule){
		return minimatch(name, path.normalize(rule));
	});
}

function whitelist(whitelist, files, rootdir){
    if(!whitelist || !files) return
    rootdir = rootdir || "";
    var output = [];
    whitelist = isArray(whitelist) ? whitelist : [whitelist];
    whitelist.forEach(function(rule){
        rule = path.join( rootdir, rule );
        files.forEach( function(name){
            if(~output.indexOf(name)) return
            if( minimatch(name, rule) )
                output.push(name);
        }) 
    });
    return output;
}

function blacklist(blacklist, files, rootdir){
    if(!blacklist || !files) return
    rootdir = rootdir || "";
    blacklist = isArray(blacklist) ? blacklist : [blacklist];

    return files.filter(function(name){
        return !blacklist.some(function(rule){
            rule = path.join( rootdir, rule );
            return minimatch(name, rule)
        });
    });
}

function flatten(obj, _path, result) {
  if(!this) return obj;
  var key, val, __path;
  _path = _path || [];
  result = result || {};
  for (key in obj) {
    val = obj[key];
    __path = _path.concat([key]);
    if (this[key] && this[key] !== true) {
      flatten.call(this[key], val, __path, result);
    } else {
      result[__path.join(path.sep)] = val;
    }
  }
  return result;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg */)
  {
    'use strict';

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function')
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisArg, t[i], i, t))
        return true;
    }

    return false;
  };
};

function bind(fn){
	var args = Array.prototype.slice.call(arguments, 1);
	if (!Function.prototype.bind) {
	     return function(){
			var onearg = args.shift();
			var newargs = args.concat(Array.prototype.slice.call(arguments,0));
			var returnme = fn.apply(onearg, newargs );
	        return returnme;
	     };
	}else{
		return fn.bind.apply(fn, args);
	};
}

function isArray(obj){
	return ~Object.prototype.toString.call(obj).toLowerCase().indexOf("array");
}
}).call(this,require("q+64fw"))
},{"callsite":20,"fs":26,"minimatchify":21,"path":27,"q+64fw":28}],20:[function(require,module,exports){

module.exports = function(){
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
};

},{}],21:[function(require,module,exports){
(function (process){
if(typeof JSON === "undefined"){

/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}

if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      // At the moment all modern browsers, that support strict mode, have
      // native implementation of Array.prototype.reduce. For instance, IE8
      // does not support strict mode, so this check is actually useless.
      throw new TypeError(
          'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index, value,
        length = this.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
      value = opt_initialValue;
      isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
      if (this.hasOwnProperty(index)) {
        if (isValueSet) {
          value = callback(value, this[index], index, this);
        }
        else {
          value = this[index];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t)
        res[i] = fun.call(thisArg, t[i], i, t);
    }

    return res;
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/,'').replace(/\s+$/, '');
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

;(function (require, exports, module, platform) {

if (module) module.exports = minimatch
else exports.minimatch = minimatch

minimatch.Minimatch = Minimatch

var LRU = function LRUCache () {
        // not quite an LRU, but still space-limited.
        var cache = {}
        var cnt = 0
        this.set = function (k, v) {
          cnt ++
          if (cnt >= 100) cache = {}
          cache[k] = v
        }
        this.get = function (k) { return cache[k] }
      }
  , cache = minimatch.cache = new LRU({max: 100})
  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
  , sigmund = process.browser ? function sigmund (obj) {
        return JSON.stringify(obj)
      } : require("sigmund")

var path = require("path")
  // any single thing other than /
  // don't need to escape / when using new RegExp()
  , qmark = "[^/]"

  // * => any number of characters
  , star = qmark + "*?"

  // ** when dots are allowed.  Anything goes, except .. and .
  // not (^ or / followed by one or two dots followed by $ or /),
  // followed by anything, any number of times.
  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

  // not a ^ or / followed by a dot,
  // followed by anything, any number of times.
  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

  // characters that need to be escaped in RegExp.
  , reSpecials = charSet("().*{}+?[]^$\\!")

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split("").reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}


function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === "") return p === ""

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options, cache)
  }

  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    pattern = pattern.split("\\").join("/")
  }

  // lru storage.
  // these things aren't particularly big, but walking down the string
  // and turning it into a regexp can get pretty costly.
  var cacheKey = pattern + "\n" + sigmund(options)
  var cached = minimatch.cache.get(cacheKey)
  if (cached) return cached
  minimatch.cache.set(cacheKey, this)

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function() {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return -1 === s.indexOf(false)
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
    , negate = false
    , options = this.options
    , negateOffset = 0

  if (options.nonegate) return

  for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
    negate = !negate
    negateOffset ++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return new Minimatch(pattern, options).braceExpand()
}

Minimatch.prototype.braceExpand = braceExpand
function braceExpand (pattern, options) {
  options = options || this.options
  pattern = typeof pattern === "undefined"
    ? this.pattern : pattern

  if (typeof pattern === "undefined") {
    throw new Error("undefined pattern")
  }

  if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  var escaping = false

  // examples and comments refer to this crazy pattern:
  // a{b,c{d,e},{f,g}h}x{y,z}
  // expected:
  // abxy
  // abxz
  // acdxy
  // acdxz
  // acexy
  // acexz
  // afhxy
  // afhxz
  // aghxy
  // aghxz

  // everything before the first \{ is just a prefix.
  // So, we pluck that off, and work with the rest,
  // and then prepend it to everything we find.
  if (pattern.charAt(0) !== "{") {
    this.debug(pattern)
    var prefix = null
    for (var i = 0, l = pattern.length; i < l; i ++) {
      var c = pattern.charAt(i)
      this.debug(i, c)
      if (c === "\\") {
        escaping = !escaping
      } else if (c === "{" && !escaping) {
        prefix = pattern.substr(0, i)
        break
      }
    }

    // actually no sets, all { were escaped.
    if (prefix === null) {
      this.debug("no sets")
      return [pattern]
    }

   var tail = braceExpand.call(this, pattern.substr(i), options)
    return tail.map(function (t) {
      return prefix + t
    })
  }

  // now we have something like:
  // {b,c{d,e},{f,g}h}x{y,z}
  // walk through the set, expanding each part, until
  // the set ends.  then, we'll expand the suffix.
  // If the set only has a single member, then'll put the {} back

  // first, handle numeric sets, since they're easier
  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
  if (numset) {
    this.debug("numset", numset[1], numset[2])
    var suf = braceExpand.call(this, pattern.substr(numset[0].length), options)
      , start = +numset[1]
      , end = +numset[2]
      , inc = start > end ? -1 : 1
      , set = []
    for (var i = start; i != (end + inc); i += inc) {
      // append all the suffixes
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        set.push(i + suf[ii])
      }
    }
    return set
  }

  // ok, walk through the set
  // We hope, somewhat optimistically, that there
  // will be a } at the end.
  // If the closing brace isn't found, then the pattern is
  // interpreted as braceExpand("\\" + pattern) so that
  // the leading \{ will be interpreted literally.
  var i = 1 // skip the \{
    , depth = 1
    , set = []
    , member = ""
    , sawEnd = false
    , escaping = false

  function addMember () {
    set.push(member)
    member = ""
  }

  this.debug("Entering for")
  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
    var c = pattern.charAt(i)
    this.debug("", i, c)

    if (escaping) {
      escaping = false
      member += "\\" + c
    } else {
      switch (c) {
        case "\\":
          escaping = true
          continue

        case "{":
          depth ++
          member += "{"
          continue

        case "}":
          depth --
          // if this closes the actual set, then we're done
          if (depth === 0) {
            addMember()
            // pluck off the close-brace
            i ++
            break FOR
          } else {
            member += c
            continue
          }

        case ",":
          if (depth === 1) {
            addMember()
          } else {
            member += c
          }
          continue

        default:
          member += c
          continue
      } // switch
    } // else
  } // for

  // now we've either finished the set, and the suffix is
  // pattern.substr(i), or we have *not* closed the set,
  // and need to escape the leading brace
  if (depth !== 0) {
    this.debug("didn't close", pattern)
    return braceExpand.call(this, "\\" + pattern, options)
  }

  // x{y,z} -> ["xy", "xz"]
  this.debug("set", set)
  this.debug("suffix", pattern.substr(i))
  var suf = braceExpand.call(this, pattern.substr(i), options)
  // ["b", "c{d,e}","{f,g}h"] ->
  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
  var addBraces = set.length === 1
  this.debug("set pre-expanded", set)
  set = set.map(function (p) {
    return braceExpand.call(this, p, options)
  }, this)
  this.debug("set expanded", set)


  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
  //   ["b", "cd", "ce", "fh", "gh"]
  set = set.reduce(function (l, r) {
    return l.concat(r)
  })

  if (addBraces) {
    set = set.map(function (s) {
      return "{" + s + "}"
    })
  }

  // now attach the suffixes.
  var ret = []
  for (var i = 0, l = set.length; i < l; i ++) {
    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
      ret.push(set[i] + suf[ii])
    }
  }
  return ret
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === "**") return GLOBSTAR
  if (pattern === "") return ""

  var re = ""
    , hasMagic = !!options.nocase
    , escaping = false
    // ? => one single character
    , patternListStack = []
    , plType
    , stateChar
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    , patternStart = pattern.charAt(0) === "." ? "" // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
      : "(?!\\.)"
    , self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += star
          hasMagic = true
          break
        case "?":
          re += qmark
          hasMagic = true
          break
        default:
          re += "\\"+stateChar
          break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    this.debug("%s\t%s %s %j", pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += "\\" + c
      escaping = false
      continue
    }

    SWITCH: switch (c) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case "\\":
        clearStateChar()
        escaping = true
        continue

      // the various stateChar values
      // for the "extglob" stuff.
      case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === "!" && i === classStart + 1) c = "^"
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
        continue

      case "(":
        if (inClass) {
          re += "("
          continue
        }

        if (!stateChar) {
          re += "\\("
          continue
        }

        plType = stateChar
        patternListStack.push({ type: plType
                              , start: i - 1
                              , reStart: re.length })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === "!" ? "(?:(?!" : "(?:"
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
        continue

      case ")":
        if (inClass || !patternListStack.length) {
          re += "\\)"
          continue
        }

        clearStateChar()
        hasMagic = true
        re += ")"
        plType = patternListStack.pop().type
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        switch (plType) {
          case "!":
            re += "[^/]*?)"
            break
          case "?":
          case "+":
          case "*": re += plType
          case "@": break // the default anyway
        }
        continue

      case "|":
        if (inClass || !patternListStack.length || escaping) {
          re += "\\|"
          escaping = false
          continue
        }

        clearStateChar()
        re += "|"
        continue

      // these are mostly the same in regexp and glob
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += "\\" + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += "\\" + c
          escaping = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch
  } // for


  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = pattern.substr(classStart + 1)
      , sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + "\\[" + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  var pl
  while (pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + 3)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = "\\"
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + "|"
    })

    this.debug("tail=%j\n   %s", tail, tail)
    var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
          : "\\" + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart)
       + t + "\\("
       + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += "\\\\"
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case ".":
    case "[":
    case "(": addPatternStart = true
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== "" && hasMagic) re = "(?=.)" + re

  if (addPatternStart) re = patternStart + re

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [ re, hasMagic ]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? "i" : ""
    , regExp = new RegExp("^" + re + "$", flags)

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) return this.regexp = false
  var options = this.options

  var twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    , flags = options.nocase ? "i" : ""

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
           : (typeof p === "string") ? regExpEscape(p)
           : p._src
    }).join("\\\/")
  }).join("|")

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^(?:" + re + ")$"

  // can match anything, as long as it's not this.
  if (this.negate) re = "^(?!" + re + ").*$"

  try {
    return this.regexp = new RegExp(re, flags)
  } catch (ex) {
    return this.regexp = false
  }
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug("match", f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ""

  if (f === "/" && partial) return true

  var options = this.options

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    f = f.split("\\").join("/")
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, "split", f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, "set", set)

  var splitFile = path.basename(f.join("/")).split("/")

  for (var i = 0, l = set.length; i < l; i ++) {
    var pattern = set[i], file = f
    if (options.matchBase && pattern.length === 1) {
      file = splitFile
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug("matchOne",
              { "this": this
              , file: file
              , pattern: pattern })

  this.debug("matchOne", file.length, pattern.length)

  for ( var fi = 0
          , pi = 0
          , fl = file.length
          , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

    this.debug("matchOne loop")
    var p = pattern[pi]
      , f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
        , pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for ( ; fi < fl; fi ++) {
          if (file[fi] === "." || file[fi] === ".." ||
              (!options.dot && file[fi].charAt(0) === ".")) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      WHILE: while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while',
                    file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
            this.debug("dot detected!", file, fr, pattern, pr)
            break WHILE
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr ++
        }
      }
      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then 
      if (partial) {
        // ran out of file
        this.debug("\n>>> no match, partial?", file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === "string") {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug("string match", p, f, hit)
    } else {
      hit = f.match(p)
      this.debug("pattern match", p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error("wtf?")
}


// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, "$1")
}


function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

})( typeof require === "function" ? require : null,
    this,
    typeof module === "object" ? module : null,
    typeof process === "object" ? process.platform : "win32"
  )




}).call(this,require("q+64fw"))
},{"path":27,"q+64fw":28,"sigmund":22}],22:[function(require,module,exports){
module.exports = sigmund
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

},{}],23:[function(require,module,exports){
var domify = require('domify');

module.exports = hyperglue;
function hyperglue (src, updates) {
    if (!updates) updates = {};
    
    var ob = typeof src === 'object';
    var dom = ob
            ? [ src ]
            : domify("<div>"+src+"</div>");
    var returnDom = [];
    var html = "";

    forEach(objectKeys(updates), function (selector) {
        var value = updates[selector];
        if (selector === ':first') {
            bind(ob ? dom[0] : dom[0].firstChild, value);
        }
        else if (/:first$/.test(selector)) {
            var k = selector.replace(/:first$/, '');
            var elem = dom[0].querySelector(k);
            if (elem) bind(elem, value);
        }
        else{
            var nodes = dom[0].querySelectorAll(selector);
            if (nodes.length === 0) return;
            for (var i = 0; i < nodes.length; i++) {
                bind(nodes[i], value);
            }
        }
    });

    if( ob ){
        return dom.length === 1 ? dom[0] : dom;
    }else{
        if (dom[0].childElementCount === 1){
            returnDom = dom[0].removeChild(dom[0].firstChild);
        }else{
            returnDom.innerHTML = returnDom.outerHTML = "";

            while(dom[0].firstChild){
                returnDom.innerHTML += returnDom.outerHTML += dom[0].firstChild.outerHTML;
                returnDom.push(dom[0].removeChild(dom[0].firstChild));
            }            
        }
        returnDom.appendTo = appendTo;
        return returnDom;
    }
}

function bind (node, value) {
    if (isElement(value)) {
        node.innerHTML = '';
        node.appendChild(value);
    }
    else if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            var e = hyperglue(node.cloneNode(true), value[i]);
            node.parentNode.insertBefore(e, node);
        }
        node.parentNode.removeChild(node);
    }
    else if (value && typeof value === 'object') {
        forEach(objectKeys(value), function (key) {
            if (key === '_text') {
                setText(node, value[key]);
            }
            else if (key === '_html' && isElement(value[key])) {
                node.innerHTML = '';
                node.appendChild(value[key]);
            }
            else if (key === '_html') {
                node.innerHTML = value[key];
            }
            else node.setAttribute(key, value[key]);
        });
    }
    else setText(node, value);
}

function forEach(xs, f) {
    if (xs.forEach) return xs.forEach(f);
    for (var i = 0; i < xs.length; i++) f(xs[i], i)
}

var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

function isElement (e) {
    return e && typeof e === 'object' && e.childNodes
        && (typeof e.appendChild === 'function'
        || typeof e.appendChild === 'object')
    ;
}

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

function setText (e, s) {
    e.innerHTML = '';
    var txt = document.createTextNode(String(s));
    e.appendChild(txt);
}

function appendTo(dest) {
    var self = this;
    if(!isArray(self)) self = [self];
    forEach(self, function(src){ 
        if(dest.appendChild) dest.appendChild( src ) 
        else if (dest.append) dest.append ( src )
    } ); 
    return this;
}
},{"domify":24}],24:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

},{}],25:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){

},{}],27:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("q+64fw"))
},{"q+64fw":28}],28:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3AvYXBwLmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avcm91dGVzL2Vycm9yLmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avcm91dGVzL3Bvc3RzLmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avdmlld3MvZXJyb3IuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvZGVza3RvcC92aWV3cy9sYXlvdXQuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvZGVza3RvcC92aWV3cy9wb3N0LmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avdmlld3MvcG9zdHMuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvc2hhcmVkL1JvdXRlci5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL2NsaWVudC9qcy9zaGFyZWQvVmlldy5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL2NsaWVudC9qcy9zaGFyZWQvVmlld0NvcmUuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvc2hhcmVkL2FkYXB0ZXJzL2RiQWRhcHRlci5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL2NsaWVudC9qcy9zaGFyZWQvYWRhcHRlcnMvc3RvcmUuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvc2hhcmVkL2NvbGxlY3Rpb25zL0h0bWwuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9jbGllbnQvanMvc2hhcmVkL2NvbGxlY3Rpb25zL1Bvc3RzLmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL3NoYXJlZC9tb2RlbHMvUG9zdC5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9jb25maWZ5L2Jyb3dzZXIuanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvZGlnaXN0aWZ5L2luZGV4LmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL2RpZ2lzdGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXF1ZXN0L2luZGV4LmpzIiwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL2ZvbGRpZnkvaW5kZXguanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvZm9sZGlmeS9ub2RlX21vZHVsZXMvY2FsbHNpdGUvaW5kZXguanMiLCIvaG9tZS9hbnRocm9wb3Mvd29yay9wZXJzb25hbC9jZWxsdmlhLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvZm9sZGlmeS9ub2RlX21vZHVsZXMvbWluaW1hdGNoaWZ5L21pbmltYXRjaC5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9mb2xkaWZ5L25vZGVfbW9kdWxlcy9taW5pbWF0Y2hpZnkvbm9kZV9tb2R1bGVzL3NpZ211bmQvc2lnbXVuZC5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9oeXBlcmdsdWUvYnJvd3Nlci5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9oeXBlcmdsdWUvbm9kZV9tb2R1bGVzL2RvbWlmeS9pbmRleC5qcyIsIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9tYXJrZWQvbGliL21hcmtlZC5qcyIsIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiLCIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwiL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B2Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByb3V0ZXIgPSByZXF1aXJlKCcuLi9zaGFyZWQvUm91dGVyJyksXG4gICAgZm9sZGlmeSA9IHJlcXVpcmUoJ2ZvbGRpZnknKSxcbiAgICBjb25mID0gcmVxdWlyZSgnY29uZmlmeScpO1xuXG5jb25mKHtkaXNwbGF5VHlwZTogXCJkZXNrdG9wXCJ9KTtcblxudmFyIHJvdXRlcyA9ICgoZnVuY3Rpb24oKXsgdmFyIGJpbmQgPSBmdW5jdGlvbiBiaW5kKGZuKXsgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyByZXR1cm4gZnVuY3Rpb24oKXsgdmFyIG9uZWFyZyA9IGFyZ3Muc2hpZnQoKTsgdmFyIG5ld2FyZ3MgPSBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCkpOyB2YXIgcmV0dXJubWUgPSBmbi5hcHBseShvbmVhcmcsIG5ld2FyZ3MgKTsgcmV0dXJuIHJldHVybm1lOyB9OyAgfTt2YXIgZm9sZCA9IHJlcXVpcmUoJ2ZvbGRpZnknKSwgcHJveHkgPSB7fSwgbWFwID0gZmFsc2U7dmFyIHJldHVybk1lID0gYmluZCggZm9sZCwge2ZvbGRTdGF0dXM6IHRydWUsIG1hcDogbWFwfSwgcHJveHkpO3JldHVybk1lW1wiZXJyb3JcIl0gPSByZXF1aXJlKFwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avcm91dGVzL2Vycm9yLmpzXCIpO3JldHVybk1lW1wicG9zdHNcIl0gPSByZXF1aXJlKFwiL2hvbWUvYW50aHJvcG9zL3dvcmsvcGVyc29uYWwvY2VsbHZpYS5naXRodWIuaW8vY2xpZW50L2pzL2Rlc2t0b3Avcm91dGVzL3Bvc3RzLmpzXCIpO2Zvcih2YXIgcCBpbiByZXR1cm5NZSl7IHByb3h5W3BdID0gcmV0dXJuTWVbcF07IH1yZXR1cm4gcmV0dXJuTWU7fSkoKSksXG4gICAgTGF5b3V0VmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbGF5b3V0Jyk7XG5cbi8vZ3JhYiBnbG9iYWwgY29sbGVjdGlvbnNcbkJhY2tib25lLmNvbGxlY3Rpb25zID0gKChmdW5jdGlvbigpeyB2YXIgYmluZCA9IGZ1bmN0aW9uIGJpbmQoZm4peyB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7IHJldHVybiBmdW5jdGlvbigpeyB2YXIgb25lYXJnID0gYXJncy5zaGlmdCgpOyB2YXIgbmV3YXJncyA9IGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKSk7IHZhciByZXR1cm5tZSA9IGZuLmFwcGx5KG9uZWFyZywgbmV3YXJncyApOyByZXR1cm4gcmV0dXJubWU7IH07ICB9O3ZhciBmb2xkID0gcmVxdWlyZSgnZm9sZGlmeScpLCBwcm94eSA9IHt9LCBtYXAgPSBmYWxzZTt2YXIgcmV0dXJuTWUgPSBiaW5kKCBmb2xkLCB7Zm9sZFN0YXR1czogdHJ1ZSwgbWFwOiBtYXB9LCBwcm94eSk7cmV0dXJuTWVbXCJIdG1sXCJdID0gcmVxdWlyZShcIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL2NsaWVudC9qcy9zaGFyZWQvY29sbGVjdGlvbnMvSHRtbC5qc1wiKTtyZXR1cm5NZVtcIlBvc3RzXCJdID0gcmVxdWlyZShcIi9ob21lL2FudGhyb3Bvcy93b3JrL3BlcnNvbmFsL2NlbGx2aWEuZ2l0aHViLmlvL2NsaWVudC9qcy9zaGFyZWQvY29sbGVjdGlvbnMvUG9zdHMuanNcIik7Zm9yKHZhciBwIGluIHJldHVybk1lKXsgcHJveHlbcF0gPSByZXR1cm5NZVtwXTsgfXJldHVybiByZXR1cm5NZTt9KSgpKTtcblxuLy9hdHRhY2ggcm91dGVzXG5yb3V0ZXMocm91dGVyKTtcblxuLy9hdHRhY2ggZ2xvYmFsIGNvbGxlY3Rpb25zXG5CYWNrYm9uZS5zZWN0aW9ucyA9IFsnY29kZScsICdtdXNpYycsICdhcnQnLCAndGhvdWdodHMnLCAncHJvamVjdHMnXTtcbkJhY2tib25lLnNlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24odHlwZSl7XG5cdEJhY2tib25lLmNvbGxlY3Rpb25zW3R5cGVdID0gQmFja2JvbmUuY29sbGVjdGlvbnMuUG9zdHMoe2lkZW50aWZpZXI6IFwiflwiK3R5cGUrXCJ+XCJ9KTtcbn0pO1xuQmFja2JvbmUuY29sbGVjdGlvbnMuaHRtbCA9IEJhY2tib25lLmNvbGxlY3Rpb25zLkh0bWwoKTtcblxuLy90cmFuc2l0aW9uZXJcbkJhY2tib25lLnRyYW5zaXRpb24gPSBmdW5jdGlvbigpe1xuXHRCYWNrYm9uZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oY29udGFpbmVyLCByZW5kZXJlZCl7XG5cdFx0Y29udGFpbmVyLmh0bWwoIHJlbmRlcmVkICk7XG5cdH07XG5cdEJhY2tib25lLnRyYW5zaXRpb24uYXBwbHkoQmFja2JvbmUudHJhbnNpdGlvbiwgW10uc2xpY2UuYXBwbHkoYXJndW1lbnRzKSk7XG59XG5cbi8vaW5pdGlhdGUgbWFpbiB2aWV3XG5uZXcgTGF5b3V0VmlldygpO1xuXG4vL3N0YXJ0IGhpc3RvcnlcbkJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe1xuICBwdXNoU3RhdGU6ICEhIX53aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZ2l0aHViLmlvXCIpXG59KTtcbiIsInZhciBFcnJvclZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvdXRlcil7XG5cblx0cm91dGVyLmVycm9yID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgICBcdHJvdXRlci52aWV3KCBFcnJvclZpZXcsIHtlcnJvckNvZGU6IHN0YXR1cywgZ3JvdXA6IFwiZXJyb3JzXCJ9ICk7XG4gIFx0fTtcblxuXHRyb3V0ZXIucm91dGUoJzUwMCcsICdlcnJvcicsIHJvdXRlci5lcnJvci5iaW5kKHJvdXRlciwgNTAwKSApO1xuXHRyb3V0ZXIucm91dGUoJzQwNCcsICdlcnJvcicsIHJvdXRlci5lcnJvci5iaW5kKHJvdXRlciwgNDA0KSApO1xuXHRyb3V0ZXIucm91dGUoJzQwMycsICdlcnJvcicsIHJvdXRlci5lcnJvci5iaW5kKHJvdXRlciwgNDAzKSApO1xuXG59IiwidmFyIFBvc3RzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3Bvc3RzJyk7XG52YXIgUG9zdFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9wb3N0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm91dGVyKXtcblxuXHRyb3V0ZXIucm91dGUoJycsICdibG9nJywgZnVuY3Rpb24odHlwZSl7XG4gICAgXHQvLyByb3V0ZXIuZGVzdHJveShudWxsLCB7cmVwbGFjZTogdHJ1ZX0pO1xuXHR9KTtcblxuXHRyb3V0ZXIucm91dGUoJ3RhZy86dGFnJywgJ3RhZ2dlZFBvc3RzJywgZnVuY3Rpb24odGFnKXtcbiAgICBcdHJvdXRlci52aWV3KCBQb3N0c1ZpZXcsIHtcInRhZ1wiOiB0YWd9ICk7XG5cdH0pO1xuXG5cdHJvdXRlci5yb3V0ZSgnYXJ0aWNsZXMvOnR5cGUnLCAncG9zdHMnLCBmdW5jdGlvbih0eXBlKXtcbiAgICBcdHJvdXRlci52aWV3KCBQb3N0c1ZpZXcsIHtcInR5cGVcIjogdHlwZX0gKTtcblx0fSk7XG5cblx0cm91dGVyLnJvdXRlKCdhcnRpY2xlLzp0eXBlLzpzbHVnJywgJ3Bvc3QnLCBmdW5jdGlvbih0eXBlLCBzbHVnKXtcbiAgICBcdHJvdXRlci52aWV3KCBQb3N0Vmlldywge1wic2x1Z1wiOiBzbHVnLCBcInR5cGVcIjogdHlwZX0gKTtcblx0fSk7XG5cdFxufVxuIiwidmFyIFZpZXcgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcblx0ZWw6IFwiYm9keVwiLFxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRzKXtcblx0XHRhbGVydChcImVycm9yIVwiK29wdHMuZXJyb3JDb2RlKTtcdFx0XG5cdH1cbn0pXG4iLCJ2YXIgVmlldyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9WaWV3Jyk7XG4vLyB2YXIgaW5zZXJ0Q3NzID0gcmVxdWlyZSgnaW5zZXJ0LWNzcycpO1xuLy8gdmFyIGZvbGRpZnkgPSByZXF1aXJlKCdmb2xkaWZ5Jyk7XG4vLyB2YXIgZ3JpZCA9IGZvbGRpZnkoXCJ0b3Bjb2F0LWdyaWQvY3NzXCIsIHt3aGl0ZWxpc3Q6IFwiZ3JpZC5taW4uY3NzXCJ9KTtcbi8vIHZhciB0b3Bjb2F0Q3NzID0gZm9sZGlmeShcInRvcGNvYXQvY3NzXCIsIHt3aGl0ZWxpc3Q6IFwidG9wY29hdC1kZXNrdG9wLWxpZ2h0LmNzc1wifSk7XG4vLyB2YXIgdG9wY29hdEZvbnRzID0gZm9sZGlmeShcInRvcGNvYXQvZm9udFwiLCB7ZW5jb2Rpbmc6IFwiYmFzZTY0XCJ9KTtcbi8vIHZhciBjb25mID0gcmVxdWlyZSgnY29uZmlmeScpO1xuXG4vLyBpbnNlcnRDc3MoZ3JpZFtcImdyaWQubWluLmNzc1wiXSk7XG5cbi8vIGluc2VydENzcyhcbi8vIFx0dG9wY29hdENzc1tcInRvcGNvYXQtZGVza3RvcC1saWdodC5jc3NcIl1cbi8vIFx0XHQucmVwbGFjZSgvLi5cXC9mb250XFwvKC4qPylcXC5vdGYvZywgXG4vLyBcdFx0XHRmdW5jdGlvbihtYXRjaCwgcDEpe1xuLy8gXHRcdFx0XHRwMSA9IHAxICsgXCIub3RmXCI7XG4vLyBcdFx0XHRcdHJldHVybiBcImRhdGE6YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtO2Jhc2U2NCxcIit0b3Bjb2F0Rm9udHNbcDFdO1xuLy8gXHRcdFx0fVxuLy8gXHRcdClcbi8vICk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuXHRlbDogXCJib2R5XCIsXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgbWFwID0geyBcblx0XHRcdCcjdGl0bGUgYSc6IHsgaHJlZjogXCIvXCIsIF90ZXh0OiBcIkJyYW5kb24ncyBCbG9nXCIgfSxcblx0XHRcdCcjbWVudSc6IEJhY2tib25lLnNlY3Rpb25zLm1hcChmdW5jdGlvbihzZWN0aW9uKXtcblx0XHRcdFx0cmV0dXJuIHsnYSc6IHtcblx0XHRcdFx0XHRocmVmOiAnL2FydGljbGVzLycrc2VjdGlvbixcblx0XHRcdFx0XHRfdGV4dDogc2VjdGlvblxuXHRcdFx0XHR9fVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0dmFyIHJlbmRlcmVkID0gdGhpcy5odG1sLnJlbmRlcihcImJvZHkuaHRtbFwiLCBtYXApO1xuXHRcdEJhY2tib25lLnRyYW5zaXRpb24oIHRoaXMuJGVsLCByZW5kZXJlZCApO1xuXHR9LFxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuaHRtbCA9IEJhY2tib25lLmNvbGxlY3Rpb25zLmh0bWw7XG5cdFx0dGhpcy5saXN0ZW5Ub09uY2UodGhpcy5odG1sLCBcImZldGNoZWRcIiwgdGhpcy5yZW5kZXIgKTtcblx0XHR0aGlzLmh0bWwuZmV0Y2goKTtcblxuXHRcdC8vdXBkYXRlcyBnaXN0IGNhY2hlXG5cdFx0QmFja2JvbmUuY29sbGVjdGlvbnNbQmFja2JvbmUuc2VjdGlvbnNbMF1dLmZldGNoKCk7XG5cdH1cbn0pO1xuIiwidmFyIFZpZXcgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcblx0ZWw6IFwiI3BhZ2VcIixcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdGlmKHRoaXMucmVuZGVyZWQpIHJldHVyblxuXHRcdHZhciByZW5kZXJlZCA9IHRoaXMuaHRtbC5yZW5kZXIoXCJwb3N0Lmh0bWxcIiwgXG5cdFx0XHR7XG5cdFx0XHRcdCcubGluayc6IHsgaHJlZjogXCIvYXJ0aWNsZS9cIit0aGlzLnR5cGUrXCIvXCIrdGhpcy5zbHVnfSxcblx0XHRcdFx0Jy50aXRsZSc6IHRoaXMucG9zdC5nZXQoXCJ0aXRsZVwiKSxcblx0XHRcdFx0Jy5jcmVhdGVkJzogdGhpcy5wb3N0LmdldChcImNyZWF0ZWRcIiksXG5cdFx0XHRcdCcuY29udGVudCc6IHsgX2h0bWw6IHRoaXMucG9zdC5nZXQoXCJjb250ZW50XCIpIH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdEJhY2tib25lLnRyYW5zaXRpb24oIHRoaXMuJGVsLCByZW5kZXJlZCApO1xuXG5cdFx0dGhpcy5yZW5kZXJlZCA9IHRydWU7XG5cdH0sXG5cdGZldGNoUG9zdDogZnVuY3Rpb24oKXtcblx0XHRpZih0aGlzLmZldGNoZWQgfHwgIXRoaXMucG9zdHMuZmV0Y2hlZCB8fCAhdGhpcy5odG1sLmZldGNoZWQpIHJldHVyblxuXHRcdHRoaXMucG9zdCA9IHRoaXMucG9zdHMuZmluZFdoZXJlKHtcInNsdWdcIjogdGhpcy5zbHVnfSk7XG5cdFxuXHRcdGlmKCF0aGlzLnBvc3QpIHJldHVybiBCYWNrYm9uZS50cmlnZ2VyKFwiZ29cIiwge2hyZWY6IFwiLzQwM1wiLCBtZXNzYWdlOiBcIlBvc3QgZG9lcyBub3QgZXhpc3QhXCJ9KTtcblxuXHRcdHRoaXMubGlzdGVuVG9PbmNlKCB0aGlzLnBvc3QsIFwiZmV0Y2hlZFwiLCB0aGlzLnJlbmRlciApO1xuXHRcdHRoaXMucG9zdC5mZXRjaCgpO1xuXHRcdHRoaXMuZmV0Y2hlZCA9IHRydWU7XG5cdH0sXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdHMpe1xuXG5cdFx0dGhpcy5zbHVnID0gb3B0cy5zbHVnO1xuXHRcdHRoaXMudHlwZSA9IG9wdHMudHlwZTtcblxuXHRcdHRoaXMucG9zdHMgPSBCYWNrYm9uZS5jb2xsZWN0aW9uc1t0aGlzLnR5cGVdO1xuXHRcdHRoaXMubGlzdGVuVG9PbmNlKCB0aGlzLnBvc3RzLCBcImZldGNoZWRcIiwgdGhpcy5mZXRjaFBvc3QgKTtcblx0XHR0aGlzLnBvc3RzLmZldGNoKCk7XG5cblx0XHR0aGlzLmh0bWwgPSBCYWNrYm9uZS5jb2xsZWN0aW9ucy5odG1sO1xuXHRcdHRoaXMubGlzdGVuVG9PbmNlKCB0aGlzLmh0bWwsIFwiZmV0Y2hlZFwiLCB0aGlzLmZldGNoUG9zdCApO1xuXHRcdHRoaXMuaHRtbC5mZXRjaCgpO1xuXHR9XG59KTsiLCJ2YXIgVmlldyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9WaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuXHRlbDogXCIjcGFnZVwiLFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0aWYodGhpcy5yZW5kZXJlZCB8fCAhdGhpcy5wb3N0cy5mZXRjaGVkIHx8ICF0aGlzLmh0bWwuZmV0Y2hlZCApIHJldHVyblx0XHRcdFxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHZhciBwb3N0c01hcCA9IHRoaXMucG9zdHMubWFwKGZ1bmN0aW9uKHBvc3Qpe1xuXHRcdFx0dmFyIHRhZ3MgPSBwb3N0LmdldChcInRhZ3NcIik7XG5cdFx0XHRpZih0YWdzKSB0YWdzID0gdGFncy5qb2luKFwiLCBcIik7XG5cdFx0XHRyZXR1cm4geyBcblx0XHRcdFx0Jy5saW5rJzogeyBocmVmOiBcIi9hcnRpY2xlL1wiICsgcG9zdC5nZXQoXCJ0eXBlXCIpICsgXCIvXCIgKyBwb3N0LmdldChcInNsdWdcIikgfSxcblx0XHRcdFx0Jy50aXRsZSc6IHBvc3QuZ2V0KFwidGl0bGVcIiksXG5cdFx0XHRcdCcuY3JlYXRlZCc6IHBvc3QuZ2V0KFwiY3JlYXRlZFwiKSxcblx0XHRcdFx0Jy50YWdzJzogdGFnc1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciByZW5kZXJlZCA9IHRoaXMuaHRtbC5yZW5kZXIoXCJwb3N0cy5odG1sXCIsIHsgXCIudGl0bGVcIjogdGhpcy50eXBlLCBcIi5wb3N0XCI6IHBvc3RzTWFwIH0pO1xuXHRcdEJhY2tib25lLnRyYW5zaXRpb24oIHRoaXMuJGVsLCByZW5kZXJlZCApO1xuXHRcdHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuXHR9LFxuXHRjb21waWxlQnlUYWc6IGZ1bmN0aW9uKGNvbGwsIG1vZGVscyl7XG5cdFx0dGhpcy5wb3N0cyA9IGNvbGw7XG5cdFx0bW9kZWxzLmZvckVhY2goZnVuY3Rpb24obW9kZWwpe1xuXHRcdFx0aWYoIXRoaXMucG9zdHMuZ2V0KHtpZDogbW9kZWwuZ2V0KFwiaWRcIil9KSlcblx0XHRcdFx0dGhpcy5wb3N0cy5hZGQobW9kZWwpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5wb3N0cy5mZXRjaGVkID0gdHJ1ZTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHR0aGlzLmNvdW50ZXIgPSAwO1xuXG5cdFx0dGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXHRcdGlmKG9wdGlvbnMudGFnKXtcblx0XHRcdHRoaXMucG9zdHMgPSB7fTtcblx0XHRcdHZhciBtb2RlbHMgPSBbXTtcblx0XHRcdGZvcih2YXIgY29sbCBpbiBCYWNrYm9uZS5jb2xsZWN0aW9ucyl7XG5cdFx0XHRcdGlmKGNvbGwgPT09IFwiaHRtbFwiKSBjb250aW51ZTtcblx0XHRcdFx0dGhpcy5jb3VudGVyKys7XG5cdFx0XHRcdHRoaXMubGlzdGVuVG9PbmNlKCBCYWNrYm9uZS5jb2xsZWN0aW9uc1tjb2xsXSwgXCJmZXRjaGVkXCIsIGZ1bmN0aW9uKGNvbGwpe1xuXHRcdFx0XHRcdG1vZGVscyA9IG1vZGVscy5jb25jYXQoIEJhY2tib25lLmNvbGxlY3Rpb25zW2NvbGxdLmZpbHRlcihmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0XHRcdHZhciB0YWdzID0gaXRlbS5nZXQoJ3RhZ3MnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0YWdzICYmIH50YWdzLmluZGV4T2Yob3B0aW9ucy50YWcpOyBcblx0XHRcdFx0XHR9KSApO1xuXHRcdFx0XHRcdGlmKCEtLXRoaXMuY291bnRlcikgdGhpcy5jb21waWxlQnlUYWcoQmFja2JvbmUuY29sbGVjdGlvbnNbY29sbF0sIG1vZGVscyk7XHRcblx0XHRcdFx0fS5iaW5kKHRoaXMsIGNvbGwpKTtcblx0XHRcdFx0QmFja2JvbmUuY29sbGVjdGlvbnNbY29sbF0uZmV0Y2goKTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMucG9zdHMgPSBCYWNrYm9uZS5jb2xsZWN0aW9uc1t0aGlzLnR5cGVdO1xuXHRcdFx0dGhpcy5saXN0ZW5Ub09uY2UodGhpcy5wb3N0cywgXCJmZXRjaGVkXCIsIHRoaXMucmVuZGVyICk7XG5cdFx0XHR0aGlzLnBvc3RzLmZldGNoKCk7XHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5odG1sID0gQmFja2JvbmUuY29sbGVjdGlvbnMuaHRtbDtcblx0XHR0aGlzLmxpc3RlblRvT25jZSh0aGlzLmh0bWwsIFwiZmV0Y2hlZFwiLCB0aGlzLnJlbmRlciApO1xuXHRcdHRoaXMuaHRtbC5mZXRjaCgpO1xuXHR9XG59KTsiLCJ2YXIgVmlld0NvcmUgPSByZXF1aXJlKCcuL1ZpZXdDb3JlJyk7XG5cbnZhciBSb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcbiAgICBnbzogZnVuY3Rpb24oZGF0YSl7XG4gICAgICB0aGlzLm5hdmlnYXRlKGRhdGEuaHJlZiwge1xuICAgICAgICB0cmlnZ2VyOiAoZGF0YS50cmlnZ2VyID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsIFxuICAgICAgICByZXBsYWNlOiAoZGF0YS5yZXBsYWNlID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSBcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICAgICQuYWpheFNldHVwKHsgY2FjaGU6IGZhbHNlIH0pO1xuICAgICAgQmFja2JvbmUub24oJ2dvJywgdGhpcy5nby5iaW5kKHRoaXMpKTtcbiAgICB9XG59KTtcblxuUm91dGVyID0gUm91dGVyLmV4dGVuZChWaWV3Q29yZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFJvdXRlcigpOyIsInZhciBWaWV3Q29yZSA9IHJlcXVpcmUoJy4vVmlld0NvcmUnKTtcbi8vIHZhciBWaWV3RXZlbnRzQ29yZSA9IHJlcXVpcmUoJy4vVmlld0V2ZW50c0NvcmUnKTtcbi8vIHZhciB2aWV3Q29yZSA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKFZpZXdDb3JlKTtcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoVmlld0NvcmUpOyIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG52YXIgdmlld0NhY2hlID0gW107XG53aW5kb3cudmlld0NhY2hlID0gdmlld0NhY2hlXG5cbnZhciBjb25mID0gcmVxdWlyZSgnY29uZmlmeScpO1xudmFyIE1BWENBQ0hFID0gODtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgX2Rlc3Ryb3lWaWV3czogZnVuY3Rpb24oZ3JvdXAsIG9wdGlvbnMsIHN1YnZpZXcpe1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZighdGhpcy5fdmlld3MuaGFzT3duUHJvcGVydHkoZ3JvdXApKSByZXR1cm47XG4gICAgICB0aGlzLl92aWV3c1tncm91cF0uZm9yRWFjaCggZnVuY3Rpb24odmlldyl7XG4gICAgICAgIHZpZXcuZGVzdHJveSh1bmRlZmluZWQsIHt9LCB0cnVlKTtcbiAgICAgICAgdmlldy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgICAgIHZpZXcudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgICBpZih2aWV3LmlzY3JvbGwpe1xuICAgICAgICAgIHZpZXcuaXNjcm9sbC5kZXN0cm95KCk7XG4gICAgICAgICAgZGVsZXRlIHZpZXcuaXNjcm9sbDtcbiAgICAgICAgfSBcbiAgICAgICAgaWYob3B0aW9ucy5yZXBsYWNlICE9PSB0cnVlIHx8IEJhY2tib25lLmlzTW9iaWxlIHx8IHN1YnZpZXcpIHJldHVyblxuICAgICAgICB2YXIgZWwgPSB2aWV3LiRlbDtcbiAgICAgICAgaWYoZWwgJiYgZWwubGVuZ3RoKVxuICAgICAgICAgICAgZWwucmVwbGFjZVdpdGgoXCI8ZGl2IGlkPVwiK2VsLmF0dHIoJ2lkJykrXCI+XCIpOyAgICAgICAgXG4gICAgICB9KTtcbiAgICAgIGlmKG9wdGlvbnMucmVwbGFjZSAhPT0gdHJ1ZSB8fCBCYWNrYm9uZS5pc01vYmlsZSkgcmV0dXJuXG4gICAgICBkZWxldGUgdGhpcy5fdmlld3NbZ3JvdXBdO1xuICAgIH0sXG4gICAgbWFuYWdlQ2FjaGU6IGZ1bmN0aW9uKHZpZXcpe1xuICAgICAgaWYodmlld0NhY2hlLmxlbmd0aCsxID4gTUFYQ0FDSEUpe1xuICAgICAgICB2YXIgcmVtb3ZlVmlldyA9IHZpZXdDYWNoZS5wb3AoKS5kZXN0cm95KCk7XG4gICAgICAgIHJlbW92ZVZpZXcgPSBudWxsO1xuICAgICAgfVxuICAgICAgdmlld0NhY2hlLnB1c2godmlldyk7XG4gICAgfSxcbiAgICBleGlzdHM6IGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdzICYmIHRoaXMuX3ZpZXdzW3R5cGVdICYmIHRoaXMuX3ZpZXdzW3R5cGVdLmxlbmd0aDsgXG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbihWaWV3LCBvcHRpb25zKXsgICAgICBcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgb3B0aW9ucy5ncm91cCA9IG9wdGlvbnMuZ3JvdXAgfHwgXCJnbG9iYWxcIjtcbiAgICAgIGlmKCBvcHRpb25zLnJlc2V0QWxsICE9PSBmYWxzZSApXG4gICAgICAgIHRoaXMuZGVzdHJveShudWxsLCBvcHRpb25zKTtcbiAgICAgIGlmKCF0aGlzLl92aWV3cykgdGhpcy5fdmlld3MgPSB7fTtcbiAgICAgIGlmKCF0aGlzLl92aWV3c1tvcHRpb25zLmdyb3VwXSlcbiAgICAgICAgdGhpcy5fdmlld3Nbb3B0aW9ucy5ncm91cF0gPSBbXTtcbiAgICAgIGVsc2UgaWYoIG9wdGlvbnMucmVzZXQgIT09IGZhbHNlIClcbiAgICAgICAgdGhpcy5kZXN0cm95KG9wdGlvbnMuZ3JvdXAsIG9wdGlvbnMpOyAgICAgICAgXG5cbiAgICAgIHZhciBvcHRzID0geyBwYXJlbnQ6IHRoaXMsIGhpdHM6IDEgfTsgICAgICBcbiAgICAgIF8uZXh0ZW5kKFZpZXcsIG9wdGlvbnMsIG9wdHMpO1xuICAgICAgdGhpcy5fdmlld3Nbb3B0aW9ucy5ncm91cF0ucHVzaChWaWV3KTtcbiAgICAgIHRoaXMubWFuYWdlQ2FjaGUoVmlldyk7XG4gICAgfSxcbiAgICBkZXN0cm95OiBmdW5jdGlvbihncm91cCwgb3B0aW9ucywgc3Vidmlldyl7XG4gICAgICBpZihncm91cCAmJiB0aGlzLl92aWV3c1tncm91cF0pe1xuICAgICAgICB0aGlzLl9kZXN0cm95Vmlld3MoZ3JvdXAsIG9wdGlvbnMsIHN1YnZpZXcpXG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBmb3IodmFyIGdyb3VwIGluIHRoaXMuX3ZpZXdzKXtcbiAgICAgICAgICB0aGlzLl9kZXN0cm95Vmlld3MoZ3JvdXAsIG9wdGlvbnMsIHN1YnZpZXcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHBhZ2VfZXJyb3I6IGZ1bmN0aW9uKG1vZGVsLCByZXNwKXtcbiAgICAgICAgaWYoTnVtYmVyKHJlc3Auc3RhdHVzKSA9PT0gNDAxKXtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvc2lnbi1vdXQnO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBCYWNrYm9uZS50cmlnZ2VyKCdnbycsIHsgaHJlZjogJy8nK3Jlc3Auc3RhdHVzIH0pO1xuICAgIH0sXG4gICAgcmVpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgICAgdGhpcy5oaXRzKys7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZpZXdDYWNoZS5zb3J0KGZ1bmN0aW9uKHByZXYsIG5leHQpe1xuICAgICAgICAgIGlmKG5leHQuaGl0cyA9PT0gcHJldi5oaXRzKSByZXR1cm4gMDtcbiAgICAgICAgICByZXR1cm4gbmV4dC5oaXRzID49IHByZXYuaGl0cyA/IDEgOiAtMTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuICAgICAgb3B0aW9ucy5jYWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgIH1cbn1cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicSs2NGZ3XCIpKSIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgaW5kZXhlZERCID0gd2luZG93LmluZGV4ZWREQiB8fCB3aW5kb3cud2Via2l0SW5kZXhlZERCIHx8IHdpbmRvdy5tb3pJbmRleGVkREIgfHwgd2luZG93Lm1zSW5kZXhlZERCO1xudmFyIHVzZUFkYXB0ZXIgPSAhaW5kZXhlZERCIHx8IEJhY2tib25lLmlzSUUgJiYgQmFja2JvbmUuaXNJRSA8IDEwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGZvcmNlKXtcblx0cmV0dXJuIHVzZUFkYXB0ZXIgfHwgZm9yY2Vcblx0XHQ/IG5ld3N0b3JlKG9wdGlvbnMpXG5cdFx0OiBuZXcgSURCU3RvcmUob3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIG5ld3N0b3JlKG9wdGlvbnMpe1xuXHRcblx0aWYob3B0aW9ucy5vblN0b3JlUmVhZHkpe1xuXHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtcblx0XHRcdG9wdGlvbnMub25TdG9yZVJlYWR5KCk7XHRcdFxuXHRcdH0pO1x0XHRcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cHV0QmF0Y2g6IGZ1bmN0aW9uKGFyciwgY2Ipe1xuXHRcdFx0YXJyLmZvckVhY2godGhpcy5wdXQpO1xuXHRcdFx0cmV0dXJuIGNiKCk7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKGlkLCBjYil7XG5cdFx0XHRyZXR1cm4gY2Ioc3RvcmUuZ2V0KFwiXCIraWQpKTtcblx0XHR9LFxuXHRcdGdldEFsbDogZnVuY3Rpb24oY2Ipe1x0XG5cdFx0XHRyZXR1cm4gY2IoIF8udmFsdWVzKHN0b3JlLmdldEFsbCgpKSApO1xuXHRcdH0sXG5cdFx0cHV0OiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdHJldHVybiBzdG9yZS5zZXQoXCJcIitpdGVtLmlkLCBpdGVtKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBmdW5jdGlvbihjYil7XG5cdFx0XHRzdG9yZS5jbGVhcigpO1xuXHRcdFx0Y2IoKTtcblx0XHR9XG5cdH1cbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxKzY0ZndcIikpIiwiLyogQ29weXJpZ2h0IChjKSAyMDEwLTIwMTMgTWFyY3VzIFdlc3RpbiAqL1xuKGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8oKXt0cnl7cmV0dXJuIHIgaW4gZSYmZVtyXX1jYXRjaCh0KXtyZXR1cm4hMX19dmFyIHQ9e30sbj1lLmRvY3VtZW50LHI9XCJsb2NhbFN0b3JhZ2VcIixpPVwic2NyaXB0XCIsczt0LmRpc2FibGVkPSExLHQuc2V0PWZ1bmN0aW9uKGUsdCl7fSx0LmdldD1mdW5jdGlvbihlKXt9LHQucmVtb3ZlPWZ1bmN0aW9uKGUpe30sdC5jbGVhcj1mdW5jdGlvbigpe30sdC50cmFuc2FjdD1mdW5jdGlvbihlLG4scil7dmFyIGk9dC5nZXQoZSk7cj09bnVsbCYmKHI9bixuPW51bGwpLHR5cGVvZiBpPT1cInVuZGVmaW5lZFwiJiYoaT1ufHx7fSkscihpKSx0LnNldChlLGkpfSx0LmdldEFsbD1mdW5jdGlvbigpe30sdC5mb3JFYWNoPWZ1bmN0aW9uKCl7fSx0LnNlcmlhbGl6ZT1mdW5jdGlvbihlKXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSl9LHQuZGVzZXJpYWxpemU9ZnVuY3Rpb24oZSl7aWYodHlwZW9mIGUhPVwic3RyaW5nXCIpcmV0dXJuIHVuZGVmaW5lZDt0cnl7cmV0dXJuIEpTT04ucGFyc2UoZSl9Y2F0Y2godCl7cmV0dXJuIGV8fHVuZGVmaW5lZH19O2lmKG8oKSlzPWVbcl0sdC5zZXQ9ZnVuY3Rpb24oZSxuKXtyZXR1cm4gbj09PXVuZGVmaW5lZD90LnJlbW92ZShlKToocy5zZXRJdGVtKGUsdC5zZXJpYWxpemUobikpLG4pfSx0LmdldD1mdW5jdGlvbihlKXtyZXR1cm4gdC5kZXNlcmlhbGl6ZShzLmdldEl0ZW0oZSkpfSx0LnJlbW92ZT1mdW5jdGlvbihlKXtzLnJlbW92ZUl0ZW0oZSl9LHQuY2xlYXI9ZnVuY3Rpb24oKXtzLmNsZWFyKCl9LHQuZ2V0QWxsPWZ1bmN0aW9uKCl7dmFyIGU9e307cmV0dXJuIHQuZm9yRWFjaChmdW5jdGlvbih0LG4pe2VbdF09bn0pLGV9LHQuZm9yRWFjaD1mdW5jdGlvbihlKXtmb3IodmFyIG49MDtuPHMubGVuZ3RoO24rKyl7dmFyIHI9cy5rZXkobik7ZShyLHQuZ2V0KHIpKX19O2Vsc2UgaWYobi5kb2N1bWVudEVsZW1lbnQuYWRkQmVoYXZpb3Ipe3ZhciB1LGE7dHJ5e2E9bmV3IEFjdGl2ZVhPYmplY3QoXCJodG1sZmlsZVwiKSxhLm9wZW4oKSxhLndyaXRlKFwiPFwiK2krXCI+ZG9jdW1lbnQudz13aW5kb3c8L1wiK2krJz48aWZyYW1lIHNyYz1cIi9mYXZpY29uLmljb1wiPjwvaWZyYW1lPicpLGEuY2xvc2UoKSx1PWEudy5mcmFtZXNbMF0uZG9jdW1lbnQscz11LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIil9Y2F0Y2goZil7cz1uLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdT1uLmJvZHl9ZnVuY3Rpb24gbChlKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7bi51bnNoaWZ0KHMpLHUuYXBwZW5kQ2hpbGQocykscy5hZGRCZWhhdmlvcihcIiNkZWZhdWx0I3VzZXJEYXRhXCIpLHMubG9hZChyKTt2YXIgaT1lLmFwcGx5KHQsbik7cmV0dXJuIHUucmVtb3ZlQ2hpbGQocyksaX19dmFyIGM9bmV3IFJlZ0V4cChcIlshXFxcIiMkJSYnKCkqKywvXFxcXFxcXFw6Ozw9Pj9AW1xcXFxdXmB7fH1+XVwiLFwiZ1wiKTtmdW5jdGlvbiBoKGUpe3JldHVybiBlLnJlcGxhY2UoL15kLyxcIl9fXyQmXCIpLnJlcGxhY2UoYyxcIl9fX1wiKX10LnNldD1sKGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbj1oKG4pLGk9PT11bmRlZmluZWQ/dC5yZW1vdmUobik6KGUuc2V0QXR0cmlidXRlKG4sdC5zZXJpYWxpemUoaSkpLGUuc2F2ZShyKSxpKX0pLHQuZ2V0PWwoZnVuY3Rpb24oZSxuKXtyZXR1cm4gbj1oKG4pLHQuZGVzZXJpYWxpemUoZS5nZXRBdHRyaWJ1dGUobikpfSksdC5yZW1vdmU9bChmdW5jdGlvbihlLHQpe3Q9aCh0KSxlLnJlbW92ZUF0dHJpYnV0ZSh0KSxlLnNhdmUocil9KSx0LmNsZWFyPWwoZnVuY3Rpb24oZSl7dmFyIHQ9ZS5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlcztlLmxvYWQocik7Zm9yKHZhciBuPTAsaTtpPXRbbl07bisrKWUucmVtb3ZlQXR0cmlidXRlKGkubmFtZSk7ZS5zYXZlKHIpfSksdC5nZXRBbGw9ZnVuY3Rpb24oZSl7dmFyIG49e307cmV0dXJuIHQuZm9yRWFjaChmdW5jdGlvbihlLHQpe25bZV09dH0pLG59LHQuZm9yRWFjaD1sKGZ1bmN0aW9uKGUsbil7dmFyIHI9ZS5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlcztmb3IodmFyIGk9MCxzO3M9cltpXTsrK2kpbihzLm5hbWUsdC5kZXNlcmlhbGl6ZShlLmdldEF0dHJpYnV0ZShzLm5hbWUpKSl9KX10cnl7dmFyIHA9XCJfX3N0b3JlanNfX1wiO3Quc2V0KHAscCksdC5nZXQocCkhPXAmJih0LmRpc2FibGVkPSEwKSx0LnJlbW92ZShwKX1jYXRjaChmKXt0LmRpc2FibGVkPSEwfXQuZW5hYmxlZD0hdC5kaXNhYmxlZCx0eXBlb2YgbW9kdWxlIT1cInVuZGVmaW5lZFwiJiZtb2R1bGUuZXhwb3J0cyYmdGhpcy5tb2R1bGUhPT1tb2R1bGU/bW9kdWxlLmV4cG9ydHM9dDp0eXBlb2YgZGVmaW5lPT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQ/ZGVmaW5lKHQpOmUuc3RvcmU9dH0pKEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSlcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG52YXIgZm9sZGlmeSA9IHJlcXVpcmUoJ2ZvbGRpZnknKSxcblx0aHlwZXJnbHVlID0gcmVxdWlyZSgnaHlwZXJnbHVlJyksXG5cdGNvbmYgPSByZXF1aXJlKCdjb25maWZ5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cdHZhciBIVE1MQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblx0XHRtb2RlbDogQmFja2JvbmUuTW9kZWwsXG5cdFx0dXJsOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICcvSFRNTENvbGxlY3Rpb24vJyArIHRoaXMuaWQ7XG5cdFx0fSxcblx0XHRwYXJzZTogZnVuY3Rpb24ocmVzcCl7XG5cdFx0XHRwcm9jZXNzLm5leHRUaWNrKCQucHJveHkoIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoaXMudHJpZ2dlcihcImZldGNoZWRcIik7XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR0aGlzLmZldGNoZWQgPSB0cnVlO1xuXHRcdFx0dmFyIG91dHB1dCA9IFtdO1xuXHRcdFx0Zm9yKHZhciBuYW1lIGluIHJlc3Ape1xuXHRcdFx0XHRvdXRwdXQucHVzaCh7aWQ6IG5hbWUsIHRlbXBsYXRlOiByZXNwW25hbWVdfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0sXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKXtcblx0XHRcdHRoaXMub3B0aW9ucyB8fCAodGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fSk7XG5cdFx0XHR0aGlzLmlkID0gdGhpcy5vcHRpb25zLmlkIHx8IDA7XG5cdFx0fSxcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKHRlbXBsYXRlLCBtYXApe1xuXHRcdFx0aWYoKHRlbXBsYXRlID0gdGhpcy5nZXQodGVtcGxhdGUpKSAmJiAodGVtcGxhdGUgPSB0ZW1wbGF0ZS5nZXQoXCJ0ZW1wbGF0ZVwiKSkgKXtcblx0XHRcdFx0cmV0dXJuIGh5cGVyZ2x1ZSh0ZW1wbGF0ZSwgbWFwKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGZldGNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0cnVlKXtcblx0XHRcdFx0dGhpcy5mZXRjaGVkID0gdHJ1ZTtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHR2YXIgaHRtbHMgPSAoKGZ1bmN0aW9uKCl7IHZhciBiaW5kID0gZnVuY3Rpb24gYmluZChmbil7IHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgcmV0dXJuIGZ1bmN0aW9uKCl7IHZhciBvbmVhcmcgPSBhcmdzLnNoaWZ0KCk7IHZhciBuZXdhcmdzID0gYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApKTsgdmFyIHJldHVybm1lID0gZm4uYXBwbHkob25lYXJnLCBuZXdhcmdzICk7IHJldHVybiByZXR1cm5tZTsgfTsgIH07dmFyIGZvbGQgPSByZXF1aXJlKCdmb2xkaWZ5JyksIHByb3h5ID0ge30sIG1hcCA9IGZhbHNlO3ZhciByZXR1cm5NZSA9IGJpbmQoIGZvbGQsIHtmb2xkU3RhdHVzOiB0cnVlLCBtYXA6IG1hcH0sIHByb3h5KTtyZXR1cm5NZVtcImJvZHkuaHRtbFwiXSA9IFwiPGJvZHk+XFxuXFxuXFx0PGRpdiBpZD1cXFwiaGVhZGVyXFxcIj5cXG5cXHRcXHQ8aDEgaWQ9XFxcInRpdGxlXFxcIj48YT48L2E+PHNwYW4+PC9zcGFuPjwvaDE+XFxuXFx0XFx0PGRpdiBpZD1cXFwibWVudVxcXCI+XFxuXFx0XFx0XFx0PGE+PC9hPlxcblxcdFxcdDwvZGl2PlxcblxcdDwvZGl2PlxcblxcdDxkaXYgaWQ9XFxcInBhZ2VcXFwiPjwvZGl2PlxcblxcdDxkaXYgaWQ9XFxcImZvb3RlclxcXCI+PC9kaXY+XFxuPC9ib2R5PlwiO3JldHVybk1lW1wicG9zdC5odG1sXCJdID0gXCI8ZGl2IGNsYXNzPVxcXCJwb3N0XFxcIj5cXG5cXHQ8YSBjbGFzcz1cXFwibGlua1xcXCI+PGgxIGNsYXNzPVxcXCJ0aXRsZVxcXCI+PC9oMT48c3BhbiBjbGFzcz1cXFwiY3JlYXRlZFxcXCI+PC9zcGFuPjwvYT5cXG5cXHQ8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG5cXG5cXHQ8L2Rpdj5cXG48L2Rpdj5cIjtyZXR1cm5NZVtcInBvc3RzLmh0bWxcIl0gPSBcIjxkaXYgY2xhc3M9XFxcInBvc3RzXFxcIj5cXG5cXHQ8aDE+PGEgY2xhc3M9XFxcInRpdGxlXFxcIj48L2E+PC9oMT5cXG5cXHQ8ZGl2IGNsYXNzPVxcXCJwb3N0XFxcIj5cXG5cXHRcXHQ8YSBjbGFzcz1cXFwibGlua1xcXCI+PHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj48L3NwYW4+ICg8c3BhbiBjbGFzcz1cXFwiY3JlYXRlZFxcXCI+PC9zcGFuPik8L2E+XFxuXFx0PC9kaXY+XFxuPC9kaXY+XCI7Zm9yKHZhciBwIGluIHJldHVybk1lKXsgcHJveHlbcF0gPSByZXR1cm5NZVtwXTsgfXJldHVybiByZXR1cm5NZTt9KSgpKTtcblx0XHRcdFx0Zm9yKHZhciBuYW1lIGluIGh0bWxzKVxuXHRcdFx0XHRcdHNlbGYuYWRkKHtpZDogbmFtZSwgdGVtcGxhdGU6IGh0bWxzW25hbWVdfSk7XG5cdFx0XHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRzZWxmLnRyaWdnZXIoJ2ZldGNoZWQnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0cmV0dXJuIEJhY2tib25lLmZldGNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHRcdFx0XG5cdFx0XHR9XG5cdCAgICB9ICAgICBcblx0fSk7XG5cblx0cmV0dXJuIG5ldyBIVE1MQ29sbGVjdGlvbihbXSwgb3B0aW9ucyk7XG59O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxKzY0ZndcIikpIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbnZhciBkaWdpc3RpZnkgPSByZXF1aXJlKCdkaWdpc3RpZnknKSxcblx0ZGJBZGFwdGVyID0gcmVxdWlyZSgnLi4vYWRhcHRlcnMvZGJBZGFwdGVyLmpzJyk7XG5cbnZhciBQb3N0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL1Bvc3QnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHR2YXIgdHlwZSA9IGZpcnN0TGV0dGVyVXBwZXIob3B0aW9ucy50eXBlKTtcblx0dmFyIEZpbmFsQ29sbGVjdGlvbiA9IEJhY2tib25lLmNvbGxlY3Rpb25zW3R5cGVdIFxuXHRcdD8gR2lzdENvbGxlY3Rpb24uZXh0ZW5kKEJhY2tib25lLmNvbGxlY3Rpb25zW3R5cGVdKVxuXHRcdDogR2lzdENvbGxlY3Rpb247XG5cdHJldHVybiBuZXcgRmluYWxDb2xsZWN0aW9uKFtdLCBvcHRpb25zKTtcbn07XG5cbnZhciBHaXN0Q29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblx0bW9kZWw6IFBvc3QsXG5cdHRvQ29sbGVjdGlvbjogZnVuY3Rpb24oKXtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0aWYoIUJhY2tib25lLmdpc3RDYWNoZSl7XG5cdFx0XHRCYWNrYm9uZS5kYi5nZXRBbGwoZnVuY3Rpb24oZ2lzdHMpe1xuXHRcdFx0XHRCYWNrYm9uZS5naXN0Q2FjaGUgPSBnaXN0cztcblx0XHRcdFx0c2VsZi50b0NvbGxlY3Rpb24oKTtcblx0XHRcdH0sIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdEJhY2tib25lLmdpc3RDYWNoZSA9IFtdO1xuXHRcdFx0XHRzZWxmLnRvQ29sbGVjdGlvbigpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHJlYWR5LCBpID0gMDtcblx0XHR2YXIgZ2lzdHMgPSBCYWNrYm9uZS5naXN0Q2FjaGUuZmlsdGVyKGZ1bmN0aW9uKGdpc3QsIGluZGV4KXtcblx0XHRcdGlmKH5naXN0LmRlc2NyaXB0aW9uLmluZGV4T2Yoc2VsZi5vcHRpb25zLmlkZW50aWZpZXIpKVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdC8qIHNvbWUgY3JhenkgdjggYXJyYXkgcHJlZmlsbCB0cmlja2VyeSAqL1xuXHRcdFx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoIXJlYWR5KXtcblx0XHRcdFx0XHRcdEJhY2tib25lLmdpc3RDYWNoZSA9IG5ldyBBcnJheShCYWNrYm9uZS5naXN0Q2FjaGUubGVuZ3RoIC0gZ2lzdHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdHJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0QmFja2JvbmUuZ2lzdENhY2hlW2krK10gPSBnaXN0O1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0pLm1hcChmdW5jdGlvbihnaXN0KXtcblx0XHRcdGlmKCFnaXN0LnR5cGUpIGdpc3QudHlwZSA9IHNlbGYub3B0aW9ucy5pZGVudGlmaWVyLnNwbGl0KFwiflwiKS5qb2luKFwiXCIpO1xuXHRcdFx0aWYoIWdpc3QudGl0bGUpIGdpc3QudGl0bGUgPSBnaXN0LmRlc2NyaXB0aW9uLnJlcGxhY2Uoc2VsZi5vcHRpb25zLmlkZW50aWZpZXIsICcnKTtcblx0XHRcdGlmKCFnaXN0LnNsdWcpIGdpc3Quc2x1ZyA9IHNsdWcoZ2lzdC50aXRsZSk7XG5cdFx0XHRyZXR1cm4gZ2lzdDtcblx0XHR9KTtcblxuXHRcdHNlbGYuYWRkKGdpc3RzKTtcbiAgICBcdHNlbGYuZmV0Y2hlZCA9IHRydWU7XG4gICAgXHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7XHRcdCAgICBcdFx0XG5cdFx0XHRzZWxmLnRyaWdnZXIoJ2ZldGNoZWQnKTtcbiAgICBcdH0pO1xuXHR9LFxuXHRhZGRHaXN0czogZnVuY3Rpb24oY2FjaGVFeGlzdHMsIGVyciwgZGF0YSl7XG5cdFx0aWYoZGF0YSA9PT0gXCJ1bm1vZGlmaWVkXCIgfHwgY2FjaGVFeGlzdHMgJiYgZXJyICl7XG5cdFx0XHRCYWNrYm9uZS5kYi51cGRhdGVkID0gdHJ1ZTtcblx0XHRcdHJldHVybiBCYWNrYm9uZS50cmlnZ2VyKFwiZ2lzdHNVcGRhdGVkXCIpO1x0XHRcdFx0XHRcblx0XHR9ZWxzZSBpZiAoIWNhY2hlRXhpc3RzICYmIGVycil7XG5cdFx0XHQkKFwiYm9keVwiKS5odG1sKFwieW91IGFyZSBvZmZsaW5lIGFuZCBoYXZlIG5vIGNhY2hlIVwiKTtcblx0XHR9XG5cblx0XHR2YXIgZ2lzdHMgPSBkYXRhLmRhdGE7XG5cdFx0dmFyIGxlbiA9IGdpc3RzLmxlbmd0aDtcblx0XHRnaXN0cyA9IGdpc3RzLm1hcChmdW5jdGlvbihnaXN0LCBpbmRleCl7XG5cdFx0XHR2YXIgdGFncztcblx0XHRcdGZvcih2YXIgZmlsZSBpbiBnaXN0LmZpbGVzKXtcblx0XHRcdFx0aWYoIX5maWxlLmluZGV4T2YoXCJ0YWdzOlwiKSkgY29udGludWU7XG5cdFx0XHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoXCJ0YWdzOlwiLCBcIlwiKTtcblx0XHRcdFx0dGFncyA9IGZpbGUuc3BsaXQoLywgKi8pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJldCA9IHsgXG5cdFx0XHRcdFx0IGlkOiBpbmRleCxcblx0XHRcdFx0XHQgZXRhZzogZGF0YS5ldGFnLFxuXHRcdFx0XHRcdCBnaXN0SWQ6IGdpc3QuaWQsXG5cdFx0XHRcdFx0IGRlc2NyaXB0aW9uOiBnaXN0LmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdCBjcmVhdGVkOiBnaXN0LmNyZWF0ZWRfYXQsXG5cdFx0XHRcdFx0IG1vZGlmaWVkOiBnaXN0LnVwZGF0ZWRfYXQsXG5cdFx0XHRcdFx0IHRhZ3M6IHRhZ3MgfHwgW10sXG5cdFx0XHRcdFx0IHR5cGU6IGZhbHNlLFxuXHRcdFx0XHRcdCB0aXRsZTogZmFsc2UsXG5cdFx0XHRcdFx0IHNsdWc6IGZhbHNlIH1cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSk7XG5cblx0XHR2YXIgY2IgPSBCYWNrYm9uZS5kYi5wdXRCYXRjaC5iaW5kKEJhY2tib25lLmRiLCBnaXN0cywgZnVuY3Rpb24oKXtcblx0XHRcdEJhY2tib25lLmRiLnVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0QmFja2JvbmUudHJpZ2dlcihcImdpc3RzVXBkYXRlZFwiKTtcblx0XHR9KTtcblxuXHRcdEJhY2tib25lLmRiLmNsZWFyKGNiLCBjYik7XG5cdH0sXG5cdGRpZ2lzdGlmeTogZnVuY3Rpb24oY2hlY2tEYXRhKXtcblx0XHRkaWdpc3RpZnkoXCJjZWxsdmlhXCIsIGNoZWNrRGF0YSwgdGhpcy5hZGRHaXN0cy5iaW5kKHRoaXMsICEhY2hlY2tEYXRhKSApO1xuXHR9LFxuXHRjaGVja0dpc3RzOiBmdW5jdGlvbigpe1xuXHRcdGlmKEJhY2tib25lLmRiLnVwZGF0aW5nKSByZXR1cm5cblx0XHRCYWNrYm9uZS5kYi51cGRhdGluZyA9IHRydWU7XG5cdFx0QmFja2JvbmUuZGIuZ2V0KDAsIHRoaXMuZGlnaXN0aWZ5LmJpbmQodGhpcyksIHRoaXMuZGlnaXN0aWZ5LmJpbmQodGhpcykgKTtcblx0fSxcblx0ZmV0Y2g6IGZ1bmN0aW9uICh3aG8pIHtcblx0XHRpZighdGhpcy5mZXRjaGVkKXtcblxuXHRcdFx0aWYoIUJhY2tib25lLmRiLmluaXRpYWxpemVkKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5saXN0ZW5Ub09uY2UoIEJhY2tib25lLCBcImRiXCIsIHRoaXMuZmV0Y2guYmluZCh0aGlzLCBcImRiXCIpICk7XG5cblx0XHRcdGlmKCFCYWNrYm9uZS5kYi51cGRhdGVkKXtcblx0XHRcdFx0dGhpcy5saXN0ZW5Ub09uY2UoIEJhY2tib25lLCBcImdpc3RzVXBkYXRlZFwiLCB0aGlzLmZldGNoICk7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrR2lzdHMoKTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnRvQ29sbGVjdGlvbigpO1xuXHRcdH1lbHNle1xuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJmZXRjaGVkXCIpO1x0XHRcdFx0XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdH1cbiAgICB9LFxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihtb2RlbHMsIG9wdGlvbnMpe1xuXHRcdGlmKCFvcHRpb25zLmlkZW50aWZpZXIpIHRocm93IG5ldyBFcnJvcihcIm11c3Qgc3VwcGx5IG9wdGlvbnMuaWRlbnRpZmllciFcIik7XG5cdFx0dGhpcy5vcHRpb25zIHx8ICh0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9KTtcblx0XHRpZighQmFja2JvbmUuZGIpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHNldHRpbmdzID0ge1xuXHRcdFx0ICBkYlZlcnNpb246IDEsXG5cdFx0XHQgIHN0b3JlTmFtZTogXCJnaXN0c1wiLFxuXHRcdFx0ICBrZXlQYXRoOiAnaWQnLFxuXHRcdFx0ICBhdXRvSW5jcmVtZW50OiBmYWxzZSxcblx0XHRcdCAgb25TdG9yZVJlYWR5OiBmdW5jdGlvbigpe1xuXHRcdFx0ICBcdEJhY2tib25lLmRiLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdCAgICBCYWNrYm9uZS50cmlnZ2VyKFwiZGJcIik7XG5cdFx0XHQgIH0sXG5cdFx0XHQgIG9uRXJyb3I6IGZ1bmN0aW9uKCl7XG5cdFx0XHQgIFx0QmFja2JvbmUuZGIgPSBkYkFkYXB0ZXIoc2V0dGluZ3MsIHRydWUpXG5cdFx0XHQgIH1cblx0XHRcdH07XG5cdFx0XHRCYWNrYm9uZS5kYiA9IGRiQWRhcHRlcihzZXR0aW5ncyk7XG5cdFx0fVxuXHR9XG59KTtcblxuXG5mdW5jdGlvbiBzbHVnKGlucHV0LCBpZGVudGlmaWVyKVxue1xuXHRpZihpZGVudGlmaWVyKSBpbnB1dCA9IGlucHV0LnJlcGxhY2UoaWRlbnRpZmllciwgJycpIC8vIFRyaW0gaWRlbnRpZmllclxuICAgIHJldHVybiBpbnB1dFxuICAgICAgICAucmVwbGFjZSgvXlxcc1xccyovLCAnJykgLy8gVHJpbSBzdGFydFxuICAgICAgICAucmVwbGFjZSgvXFxzXFxzKiQvLCAnJykgLy8gVHJpbSBlbmRcbiAgICAgICAgLnRvTG93ZXJDYXNlKCkgLy8gQ2FtZWwgY2FzZSBpcyBiYWRcbiAgICAgICAgLnJlcGxhY2UoL1teYS16MC05X1xcLX4hXFwrXFxzXSsvZywgJycpIC8vIEV4Y2hhbmdlIGludmFsaWQgY2hhcnNcbiAgICAgICAgLnJlcGxhY2UoL1tcXHNdKy9nLCAnLScpOyAvLyBTd2FwIHdoaXRlc3BhY2UgZm9yIHNpbmdsZSBoeXBoZW5cbn1cblxuZnVuY3Rpb24gZmlyc3RMZXR0ZXJVcHBlcihzdHJpbmcpXG57XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGFyciwgaW5kZXgpIHtcbiAgICB2YXIgbGVuPWFyci5sZW5ndGg7XG4gICAgaWYgKCFsZW4pIHJldHVyblxuICAgIHdoaWxlIChpbmRleDxsZW4pIHsgXG4gICAgXHRhcnJbaW5kZXhdID0gYXJyW2luZGV4KzFdOyBcbiAgICBcdGluZGV4Kys7IFxuICAgIH1cbiAgICBhcnIubGVuZ3RoLS07XG59XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInErNjRmd1wiKSkiLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xudmFyIGRpZ2lzdGlmeSA9IHJlcXVpcmUoJ2RpZ2lzdGlmeScpO1xudmFyIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xudmFyIGh5cGVyZ2x1ZSA9IHJlcXVpcmUoJ2h5cGVyZ2x1ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGdldEdpc3Q6IGZ1bmN0aW9uKCl7XG5cdFx0aWYodGhpcy5nZXQoJ2NvbnRlbnQnKSl7XG5cdFx0XHR0aGlzLmZldGNoZWQgPSB0cnVlO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoXCJmZXRjaGVkXCIpO1x0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdGRpZ2lzdGlmeS5nZXRGaWxlcyhzZWxmLmdldChcImdpc3RJZFwiKSwge30sIGZ1bmN0aW9uKGVyciwgZGF0YSl7XG5cdFx0XHRcdHZhciBjb250ZW50cyA9IGRhdGEuZGF0YTtcblx0XHRcdFx0dmFyIG1hcCA9IHtcblx0XHRcdFx0XHRcdCdoMycgOnsgY2xhc3M6IFwidG9wY29hdC1saXN0X19oZWFkZXJcIiB9LFxuXHRcdFx0XHRcdFx0J3VsJzogeyBjbGFzczogXCJ0b3Bjb2F0LWxpc3QgbGlzdFwiIH0sXG5cdFx0XHRcdFx0XHQnbGknOiB7IGNsYXNzOiBcInRvcGNvYXQtbGlzdF9faXRlbSBsaXN0aXRlbVwiIH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRpZihjb250ZW50cy5sZW5ndGggPT09IDEpe1xuXHRcdFx0XHRcdHZhciBtZCA9IG1hcmtlZChjb250ZW50c1swXS5jb250ZW50KTtcblx0XHRcdFx0XHR2YXIgY29udGVudCA9IGh5cGVyZ2x1ZShtZCwgbWFwKTtcblx0XHRcdFx0XHRpZighY29udGVudC5sZW5ndGgpe1xuXHRcdFx0XHRcdFx0Y29udGVudCA9IGNvbnRlbnQub3V0ZXJIVE1MO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0Y29udGVudCA9IFtdLnJlZHVjZS5jYWxsKGNvbnRlbnQsIGZ1bmN0aW9uKHByZXYsIG5leHQpe1xuXHRcdFx0XHRcdFx0XHRpZiAoIG5leHQubm9kZVR5cGUgPT09IDMgfHwgdHlwZW9mIG5leHQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG5leHQgPT09IFwiZnVuY3Rpb25cIiApIFxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwcmV2O1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHByZXYgKyAobmV4dC5vdXRlckhUTUwgfHwgbmV4dC5pbm5lckhUTUwpO1xuXHRcdFx0XHRcdFx0fSwgXCJcIik7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNlbGYuc2V0KFwiY29udGVudFwiLCBjb250ZW50ICk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHZhciBtZCA9IG1hcmtlZChjb250ZW50cy5maWx0ZXIoZnVuY3Rpb24oZmlsZSl7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAhfmZpbGUuZmlsZW5hbWUuaW5kZXhPZihcInRhZ3M6XCIpO1xuXHRcdFx0XHRcdFx0fSlbMF0uY29udGVudCk7XG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSBoeXBlcmdsdWUobWQsIG1hcCk7XG5cdFx0XHRcdFx0aWYoIWNvbnRlbnQubGVuZ3RoKXtcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBjb250ZW50Lm91dGVySFRNTDtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBbXS5yZWR1Y2UuY2FsbChjb250ZW50LCBmdW5jdGlvbihwcmV2LCBuZXh0KXtcblx0XHRcdFx0XHRcdFx0aWYgKCBuZXh0Lm5vZGVUeXBlID09PSAzIHx8IHR5cGVvZiBuZXh0ID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBuZXh0ID09PSBcImZ1bmN0aW9uXCIgKSBcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJldjtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwcmV2ICsgKG5leHQub3V0ZXJIVE1MIHx8IG5leHQuaW5uZXJIVE1MKTtcblx0XHRcdFx0XHRcdH0sIFwiXCIpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZWxmLnNldChcImNvbnRlbnRcIiwgY29udGVudCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdEJhY2tib25lLmRiLnB1dChzZWxmLnRvSlNPTigpKTtcblx0XHRcdFx0c2VsZi5mZXRjaGVkID0gdHJ1ZTtcblx0XHRcdFx0c2VsZi50cmlnZ2VyKCdmZXRjaGVkJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdGZldGNoOiBmdW5jdGlvbigpe1x0XG5cdFx0aWYoIXRoaXMuZmV0Y2hlZCl7XG5cdFx0XHR0aGlzLmdldEdpc3QoKTtcblx0XHR9ZWxzZXtcblx0XHRcdHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKFwiZmV0Y2hlZFwiKTtcdFx0XHRcdFxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH1cbn0pXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInErNjRmd1wiKSkiLCJmdW5jdGlvbiBtZXJnZShhLCBiKXtcclxuICAgIGZvcih2YXIgcHJvcCBpbiBiKXtcclxuICAgICAgICBhW3Byb3BdID0gYltwcm9wXTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBicm93c2VyKHNyY09iail7XHJcbiAgICBtZXJnZShicm93c2VyLCBzcmNPYmopO1xyXG59O1xyXG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcblxyXG52YXIgZXhwb3J0T2JqID0ge1xyXG5cdGRlZmF1bHRzOiB7fSxcclxuXHRzZXREZWZhdWx0OiBmdW5jdGlvbihwcm9wLCB2YWwpe1xyXG5cdFx0aWYodHlwZW9mIHByb3AgPT09IFwib2JqZWN0XCIpXHJcblx0XHRcdG1lcmdlKGV4cG9ydE9iai5kZWZhdWx0cywgcHJvcCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdGV4cG9ydE9iai5kZWZhdWx0c1twcm9wXSA9IHZhbDtcdFx0XHJcblx0fSxcclxuXHRnZXRHaXN0czogZnVuY3Rpb24gKHVzZXIsIG9wdGlvbnMsIGNiKXtcclxuXHRcdGlmKCFpc05hTih1c2VyKSkgcmV0dXJuIGV4cG9ydE9iai5nZXRGaWxlcy5hcHBseShleHBvcnRPYmosIGFyZ3VtZW50cyk7XHJcblx0XHRpZih0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0Y2IgPSBvcHRpb25zO1xyXG5cdFx0XHRvcHRpb25zID0ge307XHJcblx0XHR9O1xyXG5cdFx0b3B0aW9ucyA9IG1lcmdlKG9wdGlvbnMsIGV4cG9ydE9iai5kZWZhdWx0cyk7XHJcblx0XHR2YXIgZ2lzdHMgPSBbXTtcclxuXHRcdHZhciBjb3VudGVyID0gMDtcclxuXHRcdHZhciBsaW1pdCA9IG9wdGlvbnMubGltaXQgfHwgMDtcclxuXHRcdHZhciBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xyXG5cdFx0dmFyIGlkZW50aWZpZXIgPSBvcHRpb25zLmlkZW50aWZpZXIgfHwgXCJcIjtcclxuXHRcdHZhciB0cmFuc2Zvcm07XHJcblxyXG5cdFx0c3dpdGNoKG9wdGlvbnMudHJhbnNmb3JtKXtcclxuXHRcdFx0Y2FzZSBcImFydGljbGVcIjpcclxuXHRcdFx0XHR0cmFuc2Zvcm0gPSBmdW5jdGlvbihnaXN0KXtcclxuXHRcdFx0XHRcdHJldHVybiB7IGlkOiArZ2lzdC5pZCxcclxuXHRcdFx0XHRcdFx0XHQgdGl0bGU6IGdpc3QuZGVzY3JpcHRpb24ucmVwbGFjZShpZGVudGlmaWVyLCBcIlwiKSxcclxuXHRcdFx0XHRcdFx0XHQgY3JlYXRlZDogZ2lzdC5jcmVhdGVkX2F0LFxyXG5cdFx0XHRcdFx0XHRcdCBtb2RpZmllZDogZ2lzdC51cGRhdGVkX2F0IH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRyYW5zZm9ybSA9IHR5cGVvZiBvcHRpb25zLnRyYW5zZm9ybSA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy50cmFuc2Zvcm0gOiBmYWxzZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9wdHMgPSB7anNvbjogdHJ1ZSwgaGVhZGVyczoge30gfTtcclxuXHRcdGlmKG9wdGlvbnMuZXRhZyl7XHJcblx0XHRcdG9wdHMuaGVhZGVyc1snSWYtTm9uZS1NYXRjaCddID0gb3B0aW9ucy5ldGFnO1xyXG5cdFx0XHRkZWxldGUgb3B0aW9ucy5ldGFnOyBcclxuXHRcdH1cclxuXHRcdGlmKHR5cGVvZiBvcHRpb25zLmhlYWRlcnMgPT09IFwib2JqZWN0XCIpIG1lcmdlKG9wdHMuaGVhZGVycywgb3B0aW9ucy5oZWFkZXJzKTtcclxuXHRcdGlmKHR5cGVvZiBleHBvcnRPYmouZGVmYXVsdHMuaGVhZGVycyA9PT0gXCJvYmplY3RcIikgbWVyZ2Uob3B0cy5oZWFkZXJzLCBleHBvcnRPYmouZGVmYXVsdHMuaGVhZGVycyk7XHJcblx0XHRpZighcHJvY2Vzcy5icm93c2VyICYmICFvcHRzLmhlYWRlcnNbJ1VzZXItQWdlbnQnXSkgb3B0cy5oZWFkZXJzWydVc2VyLUFnZW50J10gPSBvcHRpb25zLnVzZXJBZ2VudCB8fCAnbm9kZS5qcyc7XHJcblxyXG5cdFx0dmFyIGV0YWc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVjdXJzKCl7XHJcblx0XHRcdG9wdHMudXJsID0gZ2V0X2dpc3RzX3VybCh1c2VyLCB7cGVyX3BhZ2U6IDEwMCwgcGFnZTogKytjb3VudGVyfSk7XHJcblx0XHRcdHJlcXVlc3QoIG9wdHMsIGZ1bmN0aW9uKGVyciwgcmVzcCwgbmV3Z2lzdHMpe1xyXG5cdFx0XHRcdGlmKHJlc3Auc3RhdHVzQ29kZSA9PSAzMDQpIHJldHVybiBjYihudWxsLCBcInVubW9kaWZpZWRcIik7XHJcblx0XHRcdFx0aWYoZXJyKSByZXR1cm4gY2IoZXJyKTtcclxuXHRcdFx0XHRpZihyZXNwLnN0YXR1c0NvZGUgIT0gMjAwKSByZXR1cm4gY2IobmV3IEVycm9yKFwiaW52YWxpZCB1cmw6IFwiKyBvcHRzLnVybCkpO1xyXG5cdFx0XHRcdGlmKCFldGFnKSBldGFnID0gcmVzcC5oZWFkZXJzID8gcmVzcC5oZWFkZXJzWydFVGFnJ10gOiByZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdFVGFnJyk7XHJcblx0XHRcdFx0aWYodHlwZW9mIG5ld2dpc3RzICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBuZXdnaXN0cy5sZW5ndGggPT09IFwidW5kZWZpbmVkXCIgfHwgbmV3Z2lzdHMubWVzc2FnZSkgcmV0dXJuIGNiKG5ldyBFcnJvcihcImVycm9yOiBcIisgbmV3Z2lzdHMpKTtcclxuXHRcdFx0XHRpZighbmV3Z2lzdHMubGVuZ3RoKSByZXR1cm4gZmluYWxpemUoKTtcclxuXHJcblx0XHRcdFx0bmV3Z2lzdHMgPSBuZXdnaXN0cy5maWx0ZXIoZnVuY3Rpb24oZ2lzdCl7XHJcblx0XHRcdFx0XHR2YXIgdGVzdCA9IGdpc3QucHVibGljIFxyXG5cdFx0XHRcdFx0XHQmJiBnaXN0LmRlc2NyaXB0aW9uIFxyXG5cdFx0XHRcdFx0XHQmJiBnaXN0LmZpbGVzXHJcblx0XHRcdFx0XHRcdCYmICghb3B0aW9ucy5pZGVudGlmaWVyIHx8IH5naXN0LmRlc2NyaXB0aW9uLmluZGV4T2Yob3B0aW9ucy5pZGVudGlmaWVyKSlcclxuXHRcdFx0XHRcdFx0JiYgKCFvcHRpb25zLnNlYXJjaCB8fCB+Z2lzdC5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluZGV4T2Yob3B0aW9ucy5zZWFyY2gudG9Mb3dlckNhc2UoKSkpXHJcblx0XHRcdFx0XHRcdCYmICghb3B0aW9ucy5maWx0ZXIgfHwgIX5naXN0LmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihvcHRpb25zLmZpbHRlci50b0xvd2VyQ2FzZSgpKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCF0ZXN0KSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0aWYob3B0aW9ucy5sYW5ndWFnZSl7XHJcblx0XHRcdFx0XHRcdGZvciggdmFyIGZpbGUgaW4gZ2lzdC5maWxlcyApe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCB0ZXN0ID0gZ2lzdC5maWxlc1tmaWxlXS5sYW5ndWFnZS50b0xvd2VyQ2FzZSgpID09PSBvcHRpb25zLmxhbmd1YWdlLnRvTG93ZXJDYXNlKCkgKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRlc3RcclxuXHRcdFx0XHRcdFx0fVx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdGVzdFxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRnaXN0cyA9IGdpc3RzLmNvbmNhdChuZXdnaXN0cyk7XHJcblx0XHRcdFx0aWYobmV3Z2lzdHMubGVuZ3RoIDwgMTAwIHx8IGxpbWl0ICYmIGxpbWl0IDw9IGdpc3RzLmxlbmd0aCkgcmV0dXJuIGZpbmFsaXplKCk7XHJcblxyXG5cdFx0XHRcdHJlY3VycygpO1xyXG5cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZWN1cnMoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5hbGl6ZSgpe1xyXG5cdFx0XHRpZihvZmZzZXQgfHwgbGltaXQpIGdpc3RzID0gZ2lzdHMuc2xpY2Uob2Zmc2V0LCBsaW1pdCk7XHJcblx0XHRcdGlmKCB0cmFuc2Zvcm0gKSBnaXN0cyA9IGdpc3RzLm1hcCh0cmFuc2Zvcm0pO1xyXG5cdFx0XHRjYihudWxsLCB7IGRhdGE6IGdpc3RzLCBldGFnOiBldGFnIH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdGdldEZpbGVzOiBmdW5jdGlvbihpZCwgb3B0aW9ucywgY2Ipe1xyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMgPT09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdGNiID0gb3B0aW9ucztcclxuXHRcdFx0b3B0aW9ucyA9IHt9O1xyXG5cdFx0fTtcclxuXHRcdG1lcmdlKG9wdGlvbnMsIGV4cG9ydE9iai5kZWZhdWx0cyk7XHJcblx0XHR2YXIgY29udGVudHMgPSBbXTtcclxuXHRcdHZhciB0cmFuc2Zvcm07XHJcblxyXG5cdFx0c3dpdGNoKG9wdGlvbnMuZmlsZVRyYW5zZm9ybSl7XHJcblx0XHRcdGNhc2UgXCJhcnRpY2xlXCI6XHJcblx0XHRcdFx0dHJhbnNmb3JtID0gZnVuY3Rpb24oZmlsZSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmlsZS5jb250ZW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0cmFuc2Zvcm0gPSB0eXBlb2Ygb3B0aW9ucy5maWxlVHJhbnNmb3JtID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmZpbGVUcmFuc2Zvcm0gOiBmYWxzZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9wdHMgPSB7anNvbjogdHJ1ZSwgaGVhZGVyczoge30sIHVybDogZ2V0X2dpc3RfdXJsKGlkKSB9O1xyXG5cdFx0aWYob3B0aW9ucy5ldGFnKXtcclxuXHRcdFx0b3B0cy5oZWFkZXJzWydJZi1Ob25lLU1hdGNoJ10gPSBvcHRpb25zLmV0YWc7XHJcblx0XHRcdGRlbGV0ZSBvcHRpb25zLmV0YWc7IFxyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIG9wdGlvbnMuaGVhZGVycyA9PT0gXCJvYmplY3RcIikgbWVyZ2Uob3B0cy5oZWFkZXJzLCBvcHRpb25zLmhlYWRlcnMpO1xyXG5cdFx0aWYodHlwZW9mIGV4cG9ydE9iai5kZWZhdWx0cy5oZWFkZXJzID09PSBcIm9iamVjdFwiKSBtZXJnZShvcHRzLmhlYWRlcnMsIGV4cG9ydE9iai5kZWZhdWx0cy5oZWFkZXJzKTtcclxuXHRcdGlmKCFwcm9jZXNzLmJyb3dzZXIgJiYgIW9wdHMuaGVhZGVyc1snVXNlci1BZ2VudCddKSBvcHRzLmhlYWRlcnNbJ1VzZXItQWdlbnQnXSA9IG9wdGlvbnMudXNlckFnZW50IHx8ICdub2RlLmpzJztcclxuXHJcblx0XHRyZXF1ZXN0KCBvcHRzLCBmdW5jdGlvbihlcnIsIHJlc3AsIGdpc3Qpe1xyXG5cdFx0XHRpZihyZXNwLnN0YXR1c0NvZGUgPT0gMzA0KSByZXR1cm4gY2IobnVsbCwgXCJ1bm1vZGlmaWVkXCIpO1xyXG5cdFx0XHRpZihlcnIpIHJldHVybiBjYihlcnIpO1xyXG5cdFx0XHRpZihyZXNwLnN0YXR1c0NvZGUgIT0gMjAwKSByZXR1cm4gY2IobmV3IEVycm9yKFwiaW52YWxpZCB1cmw/IFwiKyBvcHRzLnVybCkpO1xyXG5cdFx0XHR2YXIgZXRhZyA9IHJlc3AuaGVhZGVycyA/IHJlc3AuaGVhZGVyc1snRVRhZyddIDogcmVzcC5nZXRSZXNwb25zZUhlYWRlcignRVRhZycpO1xyXG5cdFx0XHRmb3IodmFyIGZpbGUgaW4gZ2lzdC5maWxlcyl7XHJcblx0XHRcdFx0aWYob3B0aW9ucy5sYW5ndWFnZSAmJiBnaXN0LmZpbGVzW2ZpbGVdLmxhbmd1YWdlLnRvTG93ZXJDYXNlKCkgIT09IG9wdGlvbnMubGFuZ3VhZ2UudG9Mb3dlckNhc2UoKSkgY29udGludWVcclxuXHRcdFx0XHRjb250ZW50cy5wdXNoKGdpc3QuZmlsZXNbZmlsZV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRyYW5zZm9ybSkgY29udGVudHMgPSBjb250ZW50cy5tYXAodHJhbnNmb3JtKTtcclxuXHRcdFx0Y2IobnVsbCwgeyBkYXRhOiBjb250ZW50cywgZXRhZzogZXRhZyB9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0X2dpc3RzX3VybCh1c2VyLCBvcHRpb25zKXsgcmV0dXJuIFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy9cIit1c2VyK1wiL2dpc3RzP3Blcl9wYWdlPVwiK29wdGlvbnMucGVyX3BhZ2UrXCImcGFnZT1cIitvcHRpb25zLnBhZ2U7IH07XHJcbmZ1bmN0aW9uIGdldF9naXN0X3VybChpZCl7IHJldHVybiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvXCIraWQ7IH07XHJcbmZ1bmN0aW9uIG1lcmdlKGEsIGIpeyBhID0gYSB8fCB7fTsgZm9yICh2YXIgeCBpbiBiKXsgaWYodHlwZW9mIGFbeF0gIT09IFwidW5kZWZpbmVkXCIpIGNvbnRpbnVlOyBhW3hdID0gYlt4XTsgfSByZXR1cm4gYTsgfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0T2JqLmdldEdpc3RzO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRGaWxlcyA9IGV4cG9ydE9iai5nZXRGaWxlcztcclxubW9kdWxlLmV4cG9ydHMuc2V0RGVmYXVsdCA9IGV4cG9ydE9iai5zZXREZWZhdWx0O1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicSs2NGZ3XCIpKSIsIi8vIEJyb3dzZXIgUmVxdWVzdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxudmFyIFhIUiA9IFhNTEh0dHBSZXF1ZXN0XG5pZiAoIVhIUikgdGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIFhNTEh0dHBSZXF1ZXN0JylcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0XG5yZXF1ZXN0LmxvZyA9IHtcbiAgJ3RyYWNlJzogbm9vcCwgJ2RlYnVnJzogbm9vcCwgJ2luZm8nOiBub29wLCAnd2Fybic6IG5vb3AsICdlcnJvcic6IG5vb3Bcbn1cblxudmFyIERFRkFVTFRfVElNRU9VVCA9IDMgKiA2MCAqIDEwMDAgLy8gMyBtaW51dGVzXG5cbi8vXG4vLyByZXF1ZXN0XG4vL1xuXG5mdW5jdGlvbiByZXF1ZXN0KG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIC8vIFRoZSBlbnRyeS1wb2ludCB0byB0aGUgQVBJOiBwcmVwIHRoZSBvcHRpb25zIG9iamVjdCBhbmQgcGFzcyB0aGUgcmVhbCB3b3JrIHRvIHJ1bl94aHIuXG4gIGlmKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBjYWxsYmFjayBnaXZlbjogJyArIGNhbGxiYWNrKVxuXG4gIGlmKCFvcHRpb25zKVxuICAgIHRocm93IG5ldyBFcnJvcignTm8gb3B0aW9ucyBnaXZlbicpXG5cbiAgdmFyIG9wdGlvbnNfb25SZXNwb25zZSA9IG9wdGlvbnMub25SZXNwb25zZTsgLy8gU2F2ZSB0aGlzIGZvciBsYXRlci5cblxuICBpZih0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpXG4gICAgb3B0aW9ucyA9IHsndXJpJzpvcHRpb25zfTtcbiAgZWxzZVxuICAgIG9wdGlvbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTsgLy8gVXNlIGEgZHVwbGljYXRlIGZvciBtdXRhdGluZy5cblxuICBvcHRpb25zLm9uUmVzcG9uc2UgPSBvcHRpb25zX29uUmVzcG9uc2UgLy8gQW5kIHB1dCBpdCBiYWNrLlxuXG4gIGlmIChvcHRpb25zLnZlcmJvc2UpIHJlcXVlc3QubG9nID0gZ2V0TG9nZ2VyKCk7XG5cbiAgaWYob3B0aW9ucy51cmwpIHtcbiAgICBvcHRpb25zLnVyaSA9IG9wdGlvbnMudXJsO1xuICAgIGRlbGV0ZSBvcHRpb25zLnVybDtcbiAgfVxuXG4gIGlmKCFvcHRpb25zLnVyaSAmJiBvcHRpb25zLnVyaSAhPT0gXCJcIilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcHRpb25zLnVyaSBpcyBhIHJlcXVpcmVkIGFyZ3VtZW50XCIpO1xuXG4gIGlmKHR5cGVvZiBvcHRpb25zLnVyaSAhPSBcInN0cmluZ1wiKVxuICAgIHRocm93IG5ldyBFcnJvcihcIm9wdGlvbnMudXJpIG11c3QgYmUgYSBzdHJpbmdcIik7XG5cbiAgdmFyIHVuc3VwcG9ydGVkX29wdGlvbnMgPSBbJ3Byb3h5JywgJ19yZWRpcmVjdHNGb2xsb3dlZCcsICdtYXhSZWRpcmVjdHMnLCAnZm9sbG93UmVkaXJlY3QnXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHVuc3VwcG9ydGVkX29wdGlvbnMubGVuZ3RoOyBpKyspXG4gICAgaWYob3B0aW9uc1sgdW5zdXBwb3J0ZWRfb3B0aW9uc1tpXSBdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib3B0aW9ucy5cIiArIHVuc3VwcG9ydGVkX29wdGlvbnNbaV0gKyBcIiBpcyBub3Qgc3VwcG9ydGVkXCIpXG5cbiAgb3B0aW9ucy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gIG9wdGlvbnMubWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCc7XG4gIG9wdGlvbnMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgb3B0aW9ucy5ib2R5ICAgID0gb3B0aW9ucy5ib2R5IHx8IG51bGxcbiAgb3B0aW9ucy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0IHx8IHJlcXVlc3QuREVGQVVMVF9USU1FT1VUXG5cbiAgaWYob3B0aW9ucy5oZWFkZXJzLmhvc3QpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT3B0aW9ucy5oZWFkZXJzLmhvc3QgaXMgbm90IHN1cHBvcnRlZFwiKTtcblxuICBpZihvcHRpb25zLmpzb24pIHtcbiAgICBvcHRpb25zLmhlYWRlcnMuYWNjZXB0ID0gb3B0aW9ucy5oZWFkZXJzLmFjY2VwdCB8fCAnYXBwbGljYXRpb24vanNvbidcbiAgICBpZihvcHRpb25zLm1ldGhvZCAhPT0gJ0dFVCcpXG4gICAgICBvcHRpb25zLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nXG5cbiAgICBpZih0eXBlb2Ygb3B0aW9ucy5qc29uICE9PSAnYm9vbGVhbicpXG4gICAgICBvcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24pXG4gICAgZWxzZSBpZih0eXBlb2Ygb3B0aW9ucy5ib2R5ICE9PSAnc3RyaW5nJylcbiAgICAgIG9wdGlvbnMuYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9keSlcbiAgfVxuXG4gIC8vIElmIG9uUmVzcG9uc2UgaXMgYm9vbGVhbiB0cnVlLCBjYWxsIGJhY2sgaW1tZWRpYXRlbHkgd2hlbiB0aGUgcmVzcG9uc2UgaXMga25vd24sXG4gIC8vIG5vdCB3aGVuIHRoZSBmdWxsIHJlcXVlc3QgaXMgY29tcGxldGUuXG4gIG9wdGlvbnMub25SZXNwb25zZSA9IG9wdGlvbnMub25SZXNwb25zZSB8fCBub29wXG4gIGlmKG9wdGlvbnMub25SZXNwb25zZSA9PT0gdHJ1ZSkge1xuICAgIG9wdGlvbnMub25SZXNwb25zZSA9IGNhbGxiYWNrXG4gICAgb3B0aW9ucy5jYWxsYmFjayA9IG5vb3BcbiAgfVxuXG4gIC8vIFhYWCBCcm93c2VycyBkbyBub3QgbGlrZSB0aGlzLlxuICAvL2lmKG9wdGlvbnMuYm9keSlcbiAgLy8gIG9wdGlvbnMuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSA9IG9wdGlvbnMuYm9keS5sZW5ndGg7XG5cbiAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBpZighb3B0aW9ucy5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgb3B0aW9ucy5hdXRoKVxuICAgIG9wdGlvbnMuaGVhZGVycy5hdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBiNjRfZW5jKG9wdGlvbnMuYXV0aC51c2VybmFtZSArICc6JyArIG9wdGlvbnMuYXV0aC5wYXNzd29yZCk7XG5cbiAgcmV0dXJuIHJ1bl94aHIob3B0aW9ucylcbn1cblxudmFyIHJlcV9zZXEgPSAwXG5mdW5jdGlvbiBydW5feGhyKG9wdGlvbnMpIHtcbiAgdmFyIHhociA9IG5ldyBYSFJcbiAgICAsIHRpbWVkX291dCA9IGZhbHNlXG4gICAgLCBpc19jb3JzID0gaXNfY3Jvc3NEb21haW4ob3B0aW9ucy51cmkpXG4gICAgLCBzdXBwb3J0c19jb3JzID0gKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocilcblxuICByZXFfc2VxICs9IDFcbiAgeGhyLnNlcV9pZCA9IHJlcV9zZXFcbiAgeGhyLmlkID0gcmVxX3NlcSArICc6ICcgKyBvcHRpb25zLm1ldGhvZCArICcgJyArIG9wdGlvbnMudXJpXG4gIHhoci5faWQgPSB4aHIuaWQgLy8gSSBrbm93IEkgd2lsbCB0eXBlIFwiX2lkXCIgZnJvbSBoYWJpdCBhbGwgdGhlIHRpbWUuXG5cbiAgaWYoaXNfY29ycyAmJiAhc3VwcG9ydHNfY29ycykge1xuICAgIHZhciBjb3JzX2VyciA9IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0OiAnICsgb3B0aW9ucy51cmkpXG4gICAgY29yc19lcnIuY29ycyA9ICd1bnN1cHBvcnRlZCdcbiAgICByZXR1cm4gb3B0aW9ucy5jYWxsYmFjayhjb3JzX2VyciwgeGhyKVxuICB9XG5cbiAgeGhyLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQodG9vX2xhdGUsIG9wdGlvbnMudGltZW91dClcbiAgZnVuY3Rpb24gdG9vX2xhdGUoKSB7XG4gICAgdGltZWRfb3V0ID0gdHJ1ZVxuICAgIHZhciBlciA9IG5ldyBFcnJvcignRVRJTUVET1VUJylcbiAgICBlci5jb2RlID0gJ0VUSU1FRE9VVCdcbiAgICBlci5kdXJhdGlvbiA9IG9wdGlvbnMudGltZW91dFxuXG4gICAgcmVxdWVzdC5sb2cuZXJyb3IoJ1RpbWVvdXQnLCB7ICdpZCc6eGhyLl9pZCwgJ21pbGxpc2Vjb25kcyc6b3B0aW9ucy50aW1lb3V0IH0pXG4gICAgcmV0dXJuIG9wdGlvbnMuY2FsbGJhY2soZXIsIHhocilcbiAgfVxuXG4gIC8vIFNvbWUgc3RhdGVzIGNhbiBiZSBza2lwcGVkIG92ZXIsIHNvIHJlbWVtYmVyIHdoYXQgaXMgc3RpbGwgaW5jb21wbGV0ZS5cbiAgdmFyIGRpZCA9IHsncmVzcG9uc2UnOmZhbHNlLCAnbG9hZGluZyc6ZmFsc2UsICdlbmQnOmZhbHNlfVxuXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBvbl9zdGF0ZV9jaGFuZ2VcbiAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJpLCB0cnVlKSAvLyBhc3luY2hyb25vdXNcbiAgaWYoaXNfY29ycylcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISEgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHNcbiAgeGhyLnNlbmQob3B0aW9ucy5ib2R5KVxuICByZXR1cm4geGhyXG5cbiAgZnVuY3Rpb24gb25fc3RhdGVfY2hhbmdlKGV2ZW50KSB7XG4gICAgaWYodGltZWRfb3V0KVxuICAgICAgcmV0dXJuIHJlcXVlc3QubG9nLmRlYnVnKCdJZ25vcmluZyB0aW1lZCBvdXQgc3RhdGUgY2hhbmdlJywgeydzdGF0ZSc6eGhyLnJlYWR5U3RhdGUsICdpZCc6eGhyLmlkfSlcblxuICAgIHJlcXVlc3QubG9nLmRlYnVnKCdTdGF0ZSBjaGFuZ2UnLCB7J3N0YXRlJzp4aHIucmVhZHlTdGF0ZSwgJ2lkJzp4aHIuaWQsICd0aW1lZF9vdXQnOnRpbWVkX291dH0pXG5cbiAgICBpZih4aHIucmVhZHlTdGF0ZSA9PT0gWEhSLk9QRU5FRCkge1xuICAgICAgcmVxdWVzdC5sb2cuZGVidWcoJ1JlcXVlc3Qgc3RhcnRlZCcsIHsnaWQnOnhoci5pZH0pXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucy5oZWFkZXJzKVxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIG9wdGlvbnMuaGVhZGVyc1trZXldKVxuICAgIH1cblxuICAgIGVsc2UgaWYoeGhyLnJlYWR5U3RhdGUgPT09IFhIUi5IRUFERVJTX1JFQ0VJVkVEKVxuICAgICAgb25fcmVzcG9uc2UoKVxuXG4gICAgZWxzZSBpZih4aHIucmVhZHlTdGF0ZSA9PT0gWEhSLkxPQURJTkcpIHtcbiAgICAgIG9uX3Jlc3BvbnNlKClcbiAgICAgIG9uX2xvYWRpbmcoKVxuICAgIH1cblxuICAgIGVsc2UgaWYoeGhyLnJlYWR5U3RhdGUgPT09IFhIUi5ET05FKSB7XG4gICAgICBvbl9yZXNwb25zZSgpXG4gICAgICBvbl9sb2FkaW5nKClcbiAgICAgIG9uX2VuZCgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcmVzcG9uc2UoKSB7XG4gICAgaWYoZGlkLnJlc3BvbnNlKVxuICAgICAgcmV0dXJuXG5cbiAgICBkaWQucmVzcG9uc2UgPSB0cnVlXG4gICAgcmVxdWVzdC5sb2cuZGVidWcoJ0dvdCByZXNwb25zZScsIHsnaWQnOnhoci5pZCwgJ3N0YXR1cyc6eGhyLnN0YXR1c30pXG4gICAgY2xlYXJUaW1lb3V0KHhoci50aW1lb3V0VGltZXIpXG4gICAgeGhyLnN0YXR1c0NvZGUgPSB4aHIuc3RhdHVzIC8vIE5vZGUgcmVxdWVzdCBjb21wYXRpYmlsaXR5XG5cbiAgICAvLyBEZXRlY3QgZmFpbGVkIENPUlMgcmVxdWVzdHMuXG4gICAgaWYoaXNfY29ycyAmJiB4aHIuc3RhdHVzQ29kZSA9PSAwKSB7XG4gICAgICB2YXIgY29yc19lcnIgPSBuZXcgRXJyb3IoJ0NPUlMgcmVxdWVzdCByZWplY3RlZDogJyArIG9wdGlvbnMudXJpKVxuICAgICAgY29yc19lcnIuY29ycyA9ICdyZWplY3RlZCdcblxuICAgICAgLy8gRG8gbm90IHByb2Nlc3MgdGhpcyByZXF1ZXN0IGZ1cnRoZXIuXG4gICAgICBkaWQubG9hZGluZyA9IHRydWVcbiAgICAgIGRpZC5lbmQgPSB0cnVlXG5cbiAgICAgIHJldHVybiBvcHRpb25zLmNhbGxiYWNrKGNvcnNfZXJyLCB4aHIpXG4gICAgfVxuXG4gICAgb3B0aW9ucy5vblJlc3BvbnNlKG51bGwsIHhocilcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2xvYWRpbmcoKSB7XG4gICAgaWYoZGlkLmxvYWRpbmcpXG4gICAgICByZXR1cm5cblxuICAgIGRpZC5sb2FkaW5nID0gdHJ1ZVxuICAgIHJlcXVlc3QubG9nLmRlYnVnKCdSZXNwb25zZSBib2R5IGxvYWRpbmcnLCB7J2lkJzp4aHIuaWR9KVxuICAgIC8vIFRPRE86IE1heWJlIHNpbXVsYXRlIFwiZGF0YVwiIGV2ZW50cyBieSB3YXRjaGluZyB4aHIucmVzcG9uc2VUZXh0XG4gIH1cblxuICBmdW5jdGlvbiBvbl9lbmQoKSB7XG4gICAgaWYoZGlkLmVuZClcbiAgICAgIHJldHVyblxuXG4gICAgZGlkLmVuZCA9IHRydWVcbiAgICByZXF1ZXN0LmxvZy5kZWJ1ZygnUmVxdWVzdCBkb25lJywgeydpZCc6eGhyLmlkfSlcblxuICAgIHhoci5ib2R5ID0geGhyLnJlc3BvbnNlVGV4dFxuICAgIGlmKG9wdGlvbnMuanNvbikge1xuICAgICAgdHJ5ICAgICAgICB7IHhoci5ib2R5ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSB9XG4gICAgICBjYXRjaCAoZXIpIHsgcmV0dXJuIG9wdGlvbnMuY2FsbGJhY2soZXIsIHhocikgICAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zLmNhbGxiYWNrKG51bGwsIHhociwgeGhyLmJvZHkpXG4gIH1cblxufSAvLyByZXF1ZXN0XG5cbnJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG5yZXF1ZXN0LkRFRkFVTFRfVElNRU9VVCA9IERFRkFVTFRfVElNRU9VVDtcblxuLy9cbi8vIGRlZmF1bHRzXG4vL1xuXG5yZXF1ZXN0LmRlZmF1bHRzID0gZnVuY3Rpb24ob3B0aW9ucywgcmVxdWVzdGVyKSB7XG4gIHZhciBkZWYgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGQgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgaWYodHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIHBhcmFtcyA9IHsndXJpJzogcGFyYW1zfTtcbiAgICAgIGVsc2Uge1xuICAgICAgICBwYXJhbXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGlmIChwYXJhbXNbaV0gPT09IHVuZGVmaW5lZCkgcGFyYW1zW2ldID0gb3B0aW9uc1tpXVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1ldGhvZChwYXJhbXMsIGNhbGxiYWNrKVxuICAgIH1cbiAgICByZXR1cm4gZFxuICB9XG4gIHZhciBkZSA9IGRlZihyZXF1ZXN0KVxuICBkZS5nZXQgPSBkZWYocmVxdWVzdC5nZXQpXG4gIGRlLnBvc3QgPSBkZWYocmVxdWVzdC5wb3N0KVxuICBkZS5wdXQgPSBkZWYocmVxdWVzdC5wdXQpXG4gIGRlLmhlYWQgPSBkZWYocmVxdWVzdC5oZWFkKVxuICByZXR1cm4gZGVcbn1cblxuLy9cbi8vIEhUVFAgbWV0aG9kIHNob3J0Y3V0c1xuLy9cblxudmFyIHNob3J0Y3V0cyA9IFsgJ2dldCcsICdwdXQnLCAncG9zdCcsICdoZWFkJyBdO1xuc2hvcnRjdXRzLmZvckVhY2goZnVuY3Rpb24oc2hvcnRjdXQpIHtcbiAgdmFyIG1ldGhvZCA9IHNob3J0Y3V0LnRvVXBwZXJDYXNlKCk7XG4gIHZhciBmdW5jICAgPSBzaG9ydGN1dC50b0xvd2VyQ2FzZSgpO1xuXG4gIHJlcXVlc3RbZnVuY10gPSBmdW5jdGlvbihvcHRzKSB7XG4gICAgaWYodHlwZW9mIG9wdHMgPT09ICdzdHJpbmcnKVxuICAgICAgb3B0cyA9IHsnbWV0aG9kJzptZXRob2QsICd1cmknOm9wdHN9O1xuICAgIGVsc2Uge1xuICAgICAgb3B0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3B0cykpO1xuICAgICAgb3B0cy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBbb3B0c10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMsIFsxXSkpO1xuICAgIHJldHVybiByZXF1ZXN0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG59KVxuXG4vL1xuLy8gQ291Y2hEQiBzaG9ydGN1dFxuLy9cblxucmVxdWVzdC5jb3VjaCA9IGZ1bmN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJylcbiAgICBvcHRpb25zID0geyd1cmknOm9wdGlvbnN9XG5cbiAgLy8gSnVzdCB1c2UgdGhlIHJlcXVlc3QgQVBJIHRvIGRvIEpTT04uXG4gIG9wdGlvbnMuanNvbiA9IHRydWVcbiAgaWYob3B0aW9ucy5ib2R5KVxuICAgIG9wdGlvbnMuanNvbiA9IG9wdGlvbnMuYm9keVxuICBkZWxldGUgb3B0aW9ucy5ib2R5XG5cbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wXG5cbiAgdmFyIHhociA9IHJlcXVlc3Qob3B0aW9ucywgY291Y2hfaGFuZGxlcilcbiAgcmV0dXJuIHhoclxuXG4gIGZ1bmN0aW9uIGNvdWNoX2hhbmRsZXIoZXIsIHJlc3AsIGJvZHkpIHtcbiAgICBpZihlcilcbiAgICAgIHJldHVybiBjYWxsYmFjayhlciwgcmVzcCwgYm9keSlcblxuICAgIGlmKChyZXNwLnN0YXR1c0NvZGUgPCAyMDAgfHwgcmVzcC5zdGF0dXNDb2RlID4gMjk5KSAmJiBib2R5LmVycm9yKSB7XG4gICAgICAvLyBUaGUgYm9keSBpcyBhIENvdWNoIEpTT04gb2JqZWN0IGluZGljYXRpbmcgdGhlIGVycm9yLlxuICAgICAgZXIgPSBuZXcgRXJyb3IoJ0NvdWNoREIgZXJyb3I6ICcgKyAoYm9keS5lcnJvci5yZWFzb24gfHwgYm9keS5lcnJvci5lcnJvcikpXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYm9keSlcbiAgICAgICAgZXJba2V5XSA9IGJvZHlba2V5XVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyLCByZXNwLCBib2R5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FsbGJhY2soZXIsIHJlc3AsIGJvZHkpO1xuICB9XG59XG5cbi8vXG4vLyBVdGlsaXR5XG4vL1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZ2V0TG9nZ2VyKCkge1xuICB2YXIgbG9nZ2VyID0ge31cbiAgICAsIGxldmVscyA9IFsndHJhY2UnLCAnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ11cbiAgICAsIGxldmVsLCBpXG5cbiAgZm9yKGkgPSAwOyBpIDwgbGV2ZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV2ZWwgPSBsZXZlbHNbaV1cblxuICAgIGxvZ2dlcltsZXZlbF0gPSBub29wXG4gICAgaWYodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUgJiYgY29uc29sZVtsZXZlbF0pXG4gICAgICBsb2dnZXJbbGV2ZWxdID0gZm9ybWF0dGVkKGNvbnNvbGUsIGxldmVsKVxuICB9XG5cbiAgcmV0dXJuIGxvZ2dlclxufVxuXG5mdW5jdGlvbiBmb3JtYXR0ZWQob2JqLCBtZXRob2QpIHtcbiAgcmV0dXJuIGZvcm1hdHRlZF9sb2dnZXJcblxuICBmdW5jdGlvbiBmb3JtYXR0ZWRfbG9nZ2VyKHN0ciwgY29udGV4dCkge1xuICAgIGlmKHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0JylcbiAgICAgIHN0ciArPSAnICcgKyBKU09OLnN0cmluZ2lmeShjb250ZXh0KVxuXG4gICAgcmV0dXJuIG9ialttZXRob2RdLmNhbGwob2JqLCBzdHIpXG4gIH1cbn1cblxuLy8gUmV0dXJuIHdoZXRoZXIgYSBVUkwgaXMgYSBjcm9zcy1kb21haW4gcmVxdWVzdC5cbmZ1bmN0aW9uIGlzX2Nyb3NzRG9tYWluKHVybCkge1xuICB2YXIgcnVybCA9IC9eKFtcXHdcXCtcXC5cXC1dKzopKD86XFwvXFwvKFteXFwvPyM6XSopKD86OihcXGQrKSk/KT8vXG5cbiAgLy8galF1ZXJ5ICM4MTM4LCBJRSBtYXkgdGhyb3cgYW4gZXhjZXB0aW9uIHdoZW4gYWNjZXNzaW5nXG4gIC8vIGEgZmllbGQgZnJvbSB3aW5kb3cubG9jYXRpb24gaWYgZG9jdW1lbnQuZG9tYWluIGhhcyBiZWVuIHNldFxuICB2YXIgYWpheExvY2F0aW9uXG4gIHRyeSB7IGFqYXhMb2NhdGlvbiA9IGxvY2F0aW9uLmhyZWYgfVxuICBjYXRjaCAoZSkge1xuICAgIC8vIFVzZSB0aGUgaHJlZiBhdHRyaWJ1dGUgb2YgYW4gQSBlbGVtZW50IHNpbmNlIElFIHdpbGwgbW9kaWZ5IGl0IGdpdmVuIGRvY3VtZW50LmxvY2F0aW9uXG4gICAgYWpheExvY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcbiAgICBhamF4TG9jYXRpb24uaHJlZiA9IFwiXCI7XG4gICAgYWpheExvY2F0aW9uID0gYWpheExvY2F0aW9uLmhyZWY7XG4gIH1cblxuICB2YXIgYWpheExvY1BhcnRzID0gcnVybC5leGVjKGFqYXhMb2NhdGlvbi50b0xvd2VyQ2FzZSgpKSB8fCBbXVxuICAgICwgcGFydHMgPSBydXJsLmV4ZWModXJsLnRvTG93ZXJDYXNlKCkgKVxuXG4gIHZhciByZXN1bHQgPSAhIShcbiAgICBwYXJ0cyAmJlxuICAgICggIHBhcnRzWzFdICE9IGFqYXhMb2NQYXJ0c1sxXVxuICAgIHx8IHBhcnRzWzJdICE9IGFqYXhMb2NQYXJ0c1syXVxuICAgIHx8IChwYXJ0c1szXSB8fCAocGFydHNbMV0gPT09IFwiaHR0cDpcIiA/IDgwIDogNDQzKSkgIT0gKGFqYXhMb2NQYXJ0c1szXSB8fCAoYWpheExvY1BhcnRzWzFdID09PSBcImh0dHA6XCIgPyA4MCA6IDQ0MykpXG4gICAgKVxuICApXG5cbiAgLy9jb25zb2xlLmRlYnVnKCdpc19jcm9zc0RvbWFpbignK3VybCsnKSAtPiAnICsgcmVzdWx0KVxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8vIE1JVCBMaWNlbnNlIGZyb20gaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYmFzZTY0X2VuY29kZTozNThcbmZ1bmN0aW9uIGI2NF9lbmMgKGRhdGEpIHtcbiAgICAvLyBFbmNvZGVzIHN0cmluZyB1c2luZyBNSU1FIGJhc2U2NCBhbGdvcml0aG1cbiAgICB2YXIgYjY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xuICAgIHZhciBvMSwgbzIsIG8zLCBoMSwgaDIsIGgzLCBoNCwgYml0cywgaSA9IDAsIGFjID0gMCwgZW5jPVwiXCIsIHRtcF9hcnIgPSBbXTtcblxuICAgIGlmICghZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLyBhc3N1bWUgdXRmOCBkYXRhXG4gICAgLy8gZGF0YSA9IHRoaXMudXRmOF9lbmNvZGUoZGF0YSsnJyk7XG5cbiAgICBkbyB7IC8vIHBhY2sgdGhyZWUgb2N0ZXRzIGludG8gZm91ciBoZXhldHNcbiAgICAgICAgbzEgPSBkYXRhLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgbzIgPSBkYXRhLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgbzMgPSBkYXRhLmNoYXJDb2RlQXQoaSsrKTtcblxuICAgICAgICBiaXRzID0gbzE8PDE2IHwgbzI8PDggfCBvMztcblxuICAgICAgICBoMSA9IGJpdHM+PjE4ICYgMHgzZjtcbiAgICAgICAgaDIgPSBiaXRzPj4xMiAmIDB4M2Y7XG4gICAgICAgIGgzID0gYml0cz4+NiAmIDB4M2Y7XG4gICAgICAgIGg0ID0gYml0cyAmIDB4M2Y7XG5cbiAgICAgICAgLy8gdXNlIGhleGV0cyB0byBpbmRleCBpbnRvIGI2NCwgYW5kIGFwcGVuZCByZXN1bHQgdG8gZW5jb2RlZCBzdHJpbmdcbiAgICAgICAgdG1wX2FyclthYysrXSA9IGI2NC5jaGFyQXQoaDEpICsgYjY0LmNoYXJBdChoMikgKyBiNjQuY2hhckF0KGgzKSArIGI2NC5jaGFyQXQoaDQpO1xuICAgIH0gd2hpbGUgKGkgPCBkYXRhLmxlbmd0aCk7XG5cbiAgICBlbmMgPSB0bXBfYXJyLmpvaW4oJycpO1xuXG4gICAgc3dpdGNoIChkYXRhLmxlbmd0aCAlIDMpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgZW5jID0gZW5jLnNsaWNlKDAsIC0yKSArICc9PSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBlbmMgPSBlbmMuc2xpY2UoMCwgLTEpICsgJz0nO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZW5jO1xufVxuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyksXG5cdHBhdGggPSByZXF1aXJlKCdwYXRoJyksXG5cdG1pbmltYXRjaCA9IHJlcXVpcmUoJ21pbmltYXRjaGlmeScpLFxuICAgIGNhbGxzaXRlID0gcmVxdWlyZSgnY2FsbHNpdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb2xkO1xuXG5mdW5jdGlvbiBmb2xkKHRvQmVGb2xkZWQpe1xuXHRpZighdG9CZUZvbGRlZCkgcmV0dXJuIGZhbHNlO1xuXHR2YXIgbW9yZUFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG5cdFx0bWVyZ2VUb01lID0ge30sXG5cdFx0b3B0aW9ucyxcblx0XHRpbmRpdmlkdWFsLFxuXHRcdG9yaWdpbmFsRnVsbFBhdGgsXG5cdFx0c3RhY2s7XG5cdCAgIFxuXHRpZihpc0FycmF5KHRvQmVGb2xkZWQpKXtcblx0XHRvcHRpb25zID0gbW9yZUFyZ3NbMF07XG5cdFx0b3JpZ2luYWxGdWxsUGF0aCA9IG9wdGlvbnMuZnVsbFBhdGg7XG5cdFx0dG9CZUZvbGRlZC5mb3JFYWNoKGZ1bmN0aW9uKHRvRm9sZCl7XG5cdFx0XHRpbmRpdmlkdWFsID0gZm9sZC5jYWxsKHRoaXMsIHRvRm9sZCwgb3B0aW9ucylcblx0XHRcdGZvcih2YXIgcHJvcCBpbiBpbmRpdmlkdWFsKXtcblx0XHRcdFx0aWYobWVyZ2VUb01lW3Byb3BdKXtcblx0XHRcdFx0XHRvcHRpb25zLmZ1bGxQYXRoID0gdHJ1ZTtcblx0XHRcdFx0XHRpbmRpdmlkdWFsID0gZm9sZC5jYWxsKHRoaXMsIHRvRm9sZCwgb3B0aW9ucyk7XG5cdFx0XHRcdFx0b3B0aW9ucy5mdWxsUGF0aCA9IG9yaWdpbmFsRnVsbFBhdGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvciAodmFyIHByb3AgaW4gaW5kaXZpZHVhbCkge1xuXHQgICAgICAgICAgbWVyZ2VUb01lW3Byb3BdID0gaW5kaXZpZHVhbFtwcm9wXTtcblx0ICAgICAgICB9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGJpbmQoIGZvbGQsIHtmb2xkU3RhdHVzOiB0cnVlfSwgbWVyZ2VUb01lICk7XG5cdH1cblxuXHR2YXJcdGJlaW5nRm9sZGVkID0gdGhpcyAmJiB0aGlzLmZvbGRTdGF0dXMsXG5cdFx0aXNPYmogPSB0eXBlb2YgdG9CZUZvbGRlZCA9PT0gXCJvYmplY3RcIiAmJiAhYmVpbmdGb2xkZWQsXG5cdFx0aXNGb2xkT2JqID0gdHlwZW9mIHRvQmVGb2xkZWQgPT09IFwib2JqZWN0XCIgJiYgYmVpbmdGb2xkZWQsXG5cdFx0aXNEaXIgPSB0eXBlb2YgdG9CZUZvbGRlZCA9PT0gXCJzdHJpbmdcIixcblx0XHRhcmdzLFxuXHRcdG91dHB1dCxcblx0XHRjb21iaW5lZDtcblx0XG5cdHN3aXRjaChmYWxzZSl7XG5cdFx0Y2FzZSAhaXNEaXI6XG5cdFx0XHRvcHRpb25zID0gbW9yZUFyZ3NbMF0gfHwge307XG5cdFx0XHRpZighcHJvY2Vzcy5icm93c2VyKXtcblx0XHRcdFx0c3RhY2sgPSBjYWxsc2l0ZSgpO1x0XHRcdFx0XG5cdFx0XHRcdG9wdGlvbnMucmVxdWVzdGVyID0gc3RhY2tbMV0uZ2V0RmlsZU5hbWUoKTtcblx0XHRcdH1cblx0XHRcdG91dHB1dCA9IHBvcHVsYXRlLmFwcGx5KHRoaXMsIFt0b0JlRm9sZGVkLCBvcHRpb25zXSk7XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSAhaXNGb2xkT2JqOlxuXHRcdFx0YXJncyA9IG1vcmVBcmdzWzBdIHx8IFtdO1xuXHRcdFx0YXJncyA9IGlzQXJyYXkoYXJncywgdHJ1ZSkgPyBhcmdzIDogW2FyZ3NdXG5cdFx0XHRpZih0aGlzLmZvbGRTdGF0dXMgPT09IFwiZm9sZE9ubHlcIil7XG5cdFx0XHRcdGFyZ3MyID0gbW9yZUFyZ3NbMV0gfHwgW107XG5cdFx0XHRcdGFyZ3MyID0gaXNBcnJheShhcmdzMikgPyBhcmdzMiA6IFthcmdzMl1cblx0XHRcdFx0YXJncyA9IGFyZ3MuY29uY2F0KGFyZ3MyKTtcblx0XHRcdFx0b3B0aW9ucyA9IG1vcmVBcmdzWzJdIHx8IHt9O1x0XHRcdFx0XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0b3B0aW9ucyA9IG1vcmVBcmdzWzFdIHx8IHt9O1xuXHRcdFx0fVx0XHRcdFxuXHRcdFx0b3V0cHV0ID0gZXZhbHVhdGUuYXBwbHkodGhpcywgW3RvQmVGb2xkZWQsIGFyZ3MsIG9wdGlvbnNdKTtcblx0XHRicmVhaztcblx0XHRjYXNlICFpc09iajpcblx0XHRcdG9wdGlvbnMgPSBtb3JlQXJnc1swXSB8fCB7fTtcblx0XHRcdGZvcih2YXIgbmFtZSBpbiB0b0JlRm9sZGVkKXtcblx0XHRcdFx0aWYoIChvcHRpb25zLndoaXRlbGlzdCAmJiAhY2hlY2tMaXN0KG9wdGlvbnMud2hpdGVsaXN0LCBuYW1lKSlcblx0XHRcdFx0ICB8fCAob3B0aW9ucy5ibGFja2xpc3QgJiYgY2hlY2tMaXN0KG9wdGlvbnMuYmxhY2tsaXN0LCBuYW1lKSkgKVxuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdGZvbGRbbmFtZV0gPSB0b0JlRm9sZGVkW25hbWVdO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0ID0gYmluZCggZm9sZCwge2ZvbGRTdGF0dXM6IHRydWV9LCBmb2xkICk7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gb3V0cHV0O1xuXG59O1xuXG5mdW5jdGlvbiBwb3B1bGF0ZShkaXJuYW1lLCBvcHRpb25zKXtcblx0aWYocHJvY2Vzcy5icm93c2VyKSB0aHJvdyBcInlvdSBtdXN0IHJ1biB0aGUgZm9sZGlmeSBicm93c2VyaWZ5IHRyYW5zZm9ybSAoZm9sZGlmeS90cmFuc2Zvcm0uanMpIGZvciBmb2xkaWZ5IHRvIHdvcmsgaW4gdGhlIGJyb3dzZXIhXCI7XG5cdHZhciBwcm94eSA9IHt9LFxuXHRcdHRvU3RyaW5nID0gb3B0aW9ucy5vdXRwdXQgJiYgb3B0aW9ucy5vdXRwdXQudG9Mb3dlckNhc2UoKSA9PT0gXCJzdHJpbmdcIixcblx0XHR0b0FycmF5ID0gb3B0aW9ucy5vdXRwdXQgJiYgb3B0aW9ucy5vdXRwdXQudG9Mb3dlckNhc2UoKSA9PT0gXCJhcnJheVwiLFxuXHRcdGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZyB8fCBvcHRpb25zLmVuYyB8fCBcInV0Zi04XCIsXG5cdFx0cmV0dXJuTWUsXG5cdFx0ZXhpc3RpbmdQcm9wcyA9IFtdLFxuXHRcdG5ld2Rpcm5hbWUsXG5cdFx0c2VwYXJhdG9yLFxuXHRcdHBhcnRzLFxuXHRcdG1hcCA9IG9wdGlvbnMudHJlZSA/IHt9IDogZmFsc2UsXG5cdFx0ZmlsZXMgPSBbXSxcblx0XHRtYXRjaGVzO1xuXG5cdGlmKHRvU3RyaW5nKXtcblx0XHRyZXR1cm5NZSA9IFwiXCI7XG5cdH1lbHNlIGlmKHRvQXJyYXkpe1xuXHRcdHJldHVybk1lID0gW107XG5cdH1lbHNle1xuXHRcdHJldHVybk1lID0gYmluZCggZm9sZCwgeyBmb2xkU3RhdHVzOiB0cnVlLCBtYXA6IG1hcCB9LCBwcm94eSApO1xuXHR9XG5cbiAgICB0cnl7XG4gICAgXHRpZihvcHRpb25zLnJlcXVlc3RlciAmJiAvKF5cXC5cXC8pfCheXFwuXFwuXFwvKS8udGVzdChkaXJuYW1lKSl7XG4gICAgXHRcdGRpcm5hbWUgPSBkaXJuYW1lXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuXFwvLywgcGF0aC5kaXJuYW1lKG9wdGlvbnMucmVxdWVzdGVyKStcIi9cIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC5cXC5cXC8vLCBwYXRoLmRpcm5hbWUob3B0aW9ucy5yZXF1ZXN0ZXIpK1wiLy4uL1wiKTtcbiAgICAgICAgICAgIHRocm93IFwiZG9uZVwiO1xuICAgIFx0fVxuXHQgICAgaWYofmRpcm5hbWUuaW5kZXhPZihcIi9cIikpXG5cdCAgICAgICAgc2VwYXJhdG9yID0gXCIvXCI7XG5cdCAgICBpZih+ZGlybmFtZS5pbmRleE9mKFwiXFxcXFwiKSlcblx0ICAgICAgICBzZXBhcmF0b3IgPSBcIlxcXFxcIjtcblx0ICAgIHBhcnRzID0gZGlybmFtZS5zcGxpdChzZXBhcmF0b3IpO1xuICAgICAgICBuZXdkaXJuYW1lID0gcGF0aC5kaXJuYW1lKCByZXF1aXJlLnJlc29sdmUoIHBhcnRzWzBdICkgKTtcbiAgICBcdGlmKCF+bmV3ZGlybmFtZS5pbmRleE9mKFwibm9kZV9tb2R1bGVzXCIpKSB0aHJvdyBcIm5vdCBhIG5vZGUgbW9kdWxlXCI7XG4gICAgICAgIGRpcm5hbWUgPSBuZXdkaXJuYW1lICsgcGF0aC5zZXAgKyBwYXJ0cy5zbGljZSgxKS5qb2luKHBhdGguc2VwKTtcbiAgICB9Y2F0Y2goZXJyKXt9XG5cblxuICAgIGZ1bmN0aW9uIHJlY3Vycyh0aGlzRGlyKXtcbiAgICAgICAgZnMucmVhZGRpclN5bmModGhpc0RpcikuZm9yRWFjaChmdW5jdGlvbihmaWxlKXtcbiAgICAgICAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbiggdGhpc0RpciwgZmlsZSk7XG4gICAgICAgICAgICBpZihwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcnKXtcbiAgICAgICAgICAgICAgaWYob3B0aW9ucy5yZWN1cnNpdmUgfHwgb3B0aW9ucy50cmVlKSByZWN1cnMoZmlsZXBhdGgpO1xuICAgICAgICAgICAgICByZXR1cm4gIFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGZpbGVzLnB1c2goZmlsZXBhdGgpOyAgICAgICAgXHRcdFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVjdXJzKGRpcm5hbWUpO1xuXG4gICAgaWYob3B0aW9ucy53aGl0ZWxpc3QpIGZpbGVzID0gd2hpdGVsaXN0KG9wdGlvbnMud2hpdGVsaXN0LCBmaWxlcywgZGlybmFtZSlcbiAgICBpZihvcHRpb25zLmJsYWNrbGlzdCkgZmlsZXMgPSBibGFja2xpc3Qob3B0aW9ucy5ibGFja2xpc3QsIGZpbGVzLCBkaXJuYW1lKVxuXG5cdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZXBhdGgpe1xuXHRcdHZhciBleHQgPSBwYXRoLmV4dG5hbWUoZmlsZXBhdGgpLFxuXHRcdFx0bmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZXBhdGgsIGV4dCksXG5cdFx0XHRmaWxlbmFtZSA9IG5hbWUgKyBleHQsXG5cdFx0XHRpc0pzID0gKGV4dCA9PT0gXCIuanNcIiB8fCBleHQgPT09IFwiLmpzb25cIiksXG5cdFx0XHRpc0RpciA9IGV4dCA9PT0gJycsXG5cdFx0XHRwcm9wbmFtZSxcblx0XHRcdGFkZCxcblx0XHRcdGxhc3QgPSBmYWxzZTtcblxuXHRcdGlmKCB0b1N0cmluZyApe1xuXHRcdFx0cmV0dXJuTWUgKz0gZnMucmVhZEZpbGVTeW5jKGZpbGVwYXRoLCBlbmNvZGluZyk7XHRcdFx0XHRcdFxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYoIHRvQXJyYXkgKXtcblx0XHRcdHJldHVybk1lLnB1c2goIGZzLnJlYWRGaWxlU3luYyhmaWxlcGF0aCwgZW5jb2RpbmcpICk7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRpZighb3B0aW9ucy5pbmNsdWRlRXh0ICYmIChpc0pzIHx8IG9wdGlvbnMuaW5jbHVkZUV4dCA9PT0gZmFsc2UpIClcblx0XHRcdHByb3BuYW1lID0gbmFtZTtcblx0XHRlbHNlXG5cdFx0XHRwcm9wbmFtZSA9IGZpbGVuYW1lO1xuXG5cdFx0aWYoIW9wdGlvbnMudHJlZSl7XG5cdCAgICAgICAgaWYob3B0aW9ucy5mdWxsUGF0aCB8fCB+ZXhpc3RpbmdQcm9wcy5pbmRleE9mKHByb3BuYW1lKSApXG5cdCAgICAgICAgICAgIHByb3BuYW1lID0gcGF0aC5yZWxhdGl2ZShkaXJuYW1lLCBmaWxlcGF0aCk7XG5cdCAgICAgICAgZWxzZVxuXHQgICAgICAgICAgICBleGlzdGluZ1Byb3BzLnB1c2gocHJvcG5hbWUpO1x0XHRcdFxuXHRcdH1cblxuXHRcdGlmKChpc0pzICYmIG9wdGlvbnMuanNUb1N0cmluZykgfHwgIWlzSnMgKVxuXHRcdFx0YWRkID0gZnMucmVhZEZpbGVTeW5jKGZpbGVwYXRoLCBlbmNvZGluZyk7XG5cdFx0ZWxzZVxuXHRcdFx0YWRkID0gcmVxdWlyZShmaWxlcGF0aCk7XG5cblx0XHRpZihtYXApe1xuXHRcdFx0dmFyIHBhdGhzID0gcGF0aC5yZWxhdGl2ZShkaXJuYW1lLCBmaWxlcGF0aCkuc3BsaXQocGF0aC5zZXApO1xuXHRcdFx0dmFyIGxhc3QsIHRoaXNtYXA7XG5cdFx0XHRmb3IodmFyIHggPSAwLCBsZW4gPSBwYXRocy5sZW5ndGg7IHg8bGVuOyB4Kyspe1xuXHRcdFx0XHRpZih4PT09MCl7XG5cdFx0XHRcdFx0aWYoIXJldHVybk1lWyBwYXRoc1t4XSBdIClcblx0XHRcdFx0XHRcdHJldHVybk1lWyBwYXRoc1t4XSBdID0ge307XG5cdFx0XHRcdFx0bGFzdCA9IHJldHVybk1lWyBwYXRoc1t4XSBdXG5cdFx0XHRcdFx0aWYoIW1hcFsgcGF0aHNbeF0gXSApXG5cdFx0XHRcdFx0XHRtYXBbIHBhdGhzW3hdIF0gPSB7fTtcblx0XHRcdFx0XHR0aGlzbWFwID0gbWFwWyBwYXRoc1t4XSBdXG5cdFx0XHRcdH1lbHNlIGlmKHggPCAobGVuLTEpKXtcblx0XHRcdFx0XHRpZighbGFzdFsgcGF0aHNbeF0gXSApXG5cdFx0XHRcdFx0XHRsYXN0WyBwYXRoc1t4XSBdID0ge307XG5cdFx0XHRcdFx0bGFzdCA9IGxhc3RbcGF0aHNbeF1dO1xuXHRcdFx0XHRcdGlmKCF0aGlzbWFwWyBwYXRoc1t4XSBdIClcblx0XHRcdFx0XHRcdHRoaXNtYXBbIHBhdGhzW3hdIF0gPSB7fTtcblx0XHRcdFx0XHR0aGlzbWFwID0gdGhpc21hcFsgcGF0aHNbeF0gXTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0bGFzdFsgcHJvcG5hbWUgXSA9IGFkZDtcblx0XHRcdFx0XHR0aGlzbWFwWyBwcm9wbmFtZSBdID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuTWVbcHJvcG5hbWVdID0gYWRkO1xuXHRcdH1cblx0XHRcblx0fSk7XG5cblx0Zm9yKHZhciBwIGluIHJldHVybk1lKSBwcm94eVtwXSA9IHJldHVybk1lW3BdO1xuXHRyZXR1cm4gcmV0dXJuTWU7XG59XHRcblxuZnVuY3Rpb24gZXZhbHVhdGUoc3JjT2JqLCBhcmdzLCBvcHRpb25zKXtcblx0dmFyIHByb3h5ID0ge30sIHJldHVybk9iajtcblx0aWYob3B0aW9ucy5ldmFsdWF0ZSA9PT0gZmFsc2Upe1xuXHRcdHRoaXMuZm9sZFN0YXR1cyA9IFwiZm9sZE9ubHlcIjtcblx0XHRyZXR1cm5PYmogPSBiaW5kKCBmb2xkLCB0aGlzLCBwcm94eSwgYXJncyApO1xuXHR9XG5cdGVsc2Vcblx0XHRyZXR1cm5PYmogPSBiaW5kKCBmb2xkLCB0aGlzLCBwcm94eSApO1xuXG5cdHZhciBvYmpwYXRocyA9IGZsYXR0ZW4uY2FsbCh0aGlzLm1hcCwgc3JjT2JqKTtcblxuXHRmb3IodmFyIG9ianBhdGggaW4gb2JqcGF0aHMpe1xuXHRcdHZhciBpc1doaXRlbGlzdGVkID0gZmFsc2UsXG5cdFx0XHRpc0JsYWNrbGlzdGVkID0gZmFsc2UsXG5cdFx0XHRza2lwID0gZmFsc2UsXG5cdFx0XHRhZGQgPSBmYWxzZSxcblx0XHRcdG5vZGUgPSBmYWxzZSxcblx0XHRcdGxhc3QgPSBmYWxzZTtcblxuXHRcdGlmKG9wdGlvbnMud2hpdGVsaXN0ICYmIGNoZWNrTGlzdChvcHRpb25zLndoaXRlbGlzdCwgb2JqcGF0aCkpXG5cdFx0XHRpc1doaXRlbGlzdGVkID0gdHJ1ZTtcblxuXHRcdGlmKG9wdGlvbnMuYmxhY2tsaXN0ICYmIGNoZWNrTGlzdChvcHRpb25zLmJsYWNrbGlzdCwgb2JqcGF0aCkpXG5cdFx0XHRpc0JsYWNrbGlzdGVkID0gdHJ1ZTtcblxuXHRcdHNraXAgPSAob3B0aW9ucy53aGl0ZWxpc3QgJiYgIWlzV2hpdGVsaXN0ZWQpIHx8IGlzQmxhY2tsaXN0ZWQ7XG5cblx0XHRpZihza2lwICYmIG9wdGlvbnMudHJpbSkgY29udGludWU7XG5cblx0XHRhZGQgPSBub2RlID0gb2JqcGF0aHNbb2JqcGF0aF07XG5cblx0XHRpZighc2tpcCAmJiB0eXBlb2Ygbm9kZSA9PT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0YWRkID0gb3B0aW9ucy5ldmFsdWF0ZSAhPT0gZmFsc2UgPyBub2RlLmFwcGx5KCBzcmNPYmosIGFyZ3MpIDogYmluZC5hcHBseSggYmluZCwgW25vZGUsIHNyY09ial0uY29uY2F0KGFyZ3MpICk7XG5cdFx0XG5cdFx0aWYodHlwZW9mIGFkZCA9PT0gXCJ1bmRlZmluZWRcIiAmJiBvcHRpb25zLmFsbG93VW5kZWZpbmVkICE9PSB0cnVlICYmIG9wdGlvbnMudHJpbSlcblx0XHRcdGNvbnRpbnVlXG5cblx0XHRpZih0eXBlb2YgYWRkID09PSBcInVuZGVmaW5lZFwiICYmIG9wdGlvbnMuYWxsb3dVbmRlZmluZWQgIT09IHRydWUpXG5cdFx0XHRhZGQgPSBub2RlXG5cblx0XHRpZih0aGlzLm1hcCl7XG5cdFx0XHRwYXRocyA9IG9ianBhdGguc3BsaXQocGF0aC5zZXApO1xuXHRcdFx0Zm9yKHZhciB4ID0gMCwgbGVuID0gcGF0aHMubGVuZ3RoOyB4PGxlbjsgeCsrKXtcblx0XHRcdFx0aWYoeD09PTApe1xuXHRcdFx0XHRcdGlmKCFyZXR1cm5PYmpbIHBhdGhzW3hdIF0gKVxuXHRcdFx0XHRcdFx0cmV0dXJuT2JqWyBwYXRoc1t4XSBdID0ge307XG5cdFx0XHRcdFx0bGFzdCA9IHJldHVybk9ialsgcGF0aHNbeF0gXVxuXHRcdFx0XHR9ZWxzZSBpZih4IDwgKGxlbi0xKSl7XG5cdFx0XHRcdFx0aWYoIWxhc3RbIHBhdGhzW3hdIF0gKVxuXHRcdFx0XHRcdFx0bGFzdFsgcGF0aHNbeF0gXSA9IHt9O1xuXHRcdFx0XHRcdGxhc3QgPSBsYXN0W3BhdGhzW3hdXTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0bGFzdFsgcGF0aHNbeF0gXSA9IGFkZDtcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuT2JqW29ianBhdGhdID0gYWRkO1xuXHRcdH1cblx0fVxuXG5cdGZvcih2YXIgcCBpbiByZXR1cm5PYmopIHByb3h5W3BdID0gcmV0dXJuT2JqW3BdO1xuXHRyZXR1cm4gcmV0dXJuT2JqO1xufVxuXG5mdW5jdGlvbiBjaGVja0xpc3QobGlzdCwgbmFtZSl7XG5cdGxpc3QgPSBpc0FycmF5KGxpc3QpID8gbGlzdCA6IFtsaXN0XTtcblx0cmV0dXJuIGxpc3Quc29tZShmdW5jdGlvbihydWxlKXtcblx0XHRyZXR1cm4gbWluaW1hdGNoKG5hbWUsIHBhdGgubm9ybWFsaXplKHJ1bGUpKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHdoaXRlbGlzdCh3aGl0ZWxpc3QsIGZpbGVzLCByb290ZGlyKXtcbiAgICBpZighd2hpdGVsaXN0IHx8ICFmaWxlcykgcmV0dXJuXG4gICAgcm9vdGRpciA9IHJvb3RkaXIgfHwgXCJcIjtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgd2hpdGVsaXN0ID0gaXNBcnJheSh3aGl0ZWxpc3QpID8gd2hpdGVsaXN0IDogW3doaXRlbGlzdF07XG4gICAgd2hpdGVsaXN0LmZvckVhY2goZnVuY3Rpb24ocnVsZSl7XG4gICAgICAgIHJ1bGUgPSBwYXRoLmpvaW4oIHJvb3RkaXIsIHJ1bGUgKTtcbiAgICAgICAgZmlsZXMuZm9yRWFjaCggZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgICBpZih+b3V0cHV0LmluZGV4T2YobmFtZSkpIHJldHVyblxuICAgICAgICAgICAgaWYoIG1pbmltYXRjaChuYW1lLCBydWxlKSApXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gobmFtZSk7XG4gICAgICAgIH0pIFxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbmZ1bmN0aW9uIGJsYWNrbGlzdChibGFja2xpc3QsIGZpbGVzLCByb290ZGlyKXtcbiAgICBpZighYmxhY2tsaXN0IHx8ICFmaWxlcykgcmV0dXJuXG4gICAgcm9vdGRpciA9IHJvb3RkaXIgfHwgXCJcIjtcbiAgICBibGFja2xpc3QgPSBpc0FycmF5KGJsYWNrbGlzdCkgPyBibGFja2xpc3QgOiBbYmxhY2tsaXN0XTtcblxuICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZnVuY3Rpb24obmFtZSl7XG4gICAgICAgIHJldHVybiAhYmxhY2tsaXN0LnNvbWUoZnVuY3Rpb24ocnVsZSl7XG4gICAgICAgICAgICBydWxlID0gcGF0aC5qb2luKCByb290ZGlyLCBydWxlICk7XG4gICAgICAgICAgICByZXR1cm4gbWluaW1hdGNoKG5hbWUsIHJ1bGUpXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuKG9iaiwgX3BhdGgsIHJlc3VsdCkge1xuICBpZighdGhpcykgcmV0dXJuIG9iajtcbiAgdmFyIGtleSwgdmFsLCBfX3BhdGg7XG4gIF9wYXRoID0gX3BhdGggfHwgW107XG4gIHJlc3VsdCA9IHJlc3VsdCB8fCB7fTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgdmFsID0gb2JqW2tleV07XG4gICAgX19wYXRoID0gX3BhdGguY29uY2F0KFtrZXldKTtcbiAgICBpZiAodGhpc1trZXldICYmIHRoaXNba2V5XSAhPT0gdHJ1ZSkge1xuICAgICAgZmxhdHRlbi5jYWxsKHRoaXNba2V5XSwgdmFsLCBfX3BhdGgsIHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtfX3BhdGguam9pbihwYXRoLnNlcCldID0gdmFsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xuICAgICAgaWYgKCB0aGlzID09PSB1bmRlZmluZWQgfHwgdGhpcyA9PT0gbnVsbCApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnICk7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCA+Pj4gMDsgLy8gSGFjayB0byBjb252ZXJ0IG9iamVjdC5sZW5ndGggdG8gYSBVSW50MzJcblxuICAgICAgZnJvbUluZGV4ID0gK2Zyb21JbmRleCB8fCAwO1xuXG4gICAgICBpZiAoTWF0aC5hYnMoZnJvbUluZGV4KSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgZnJvbUluZGV4ID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZyb21JbmRleCA8IDApIHtcbiAgICAgICAgZnJvbUluZGV4ICs9IGxlbmd0aDtcbiAgICAgICAgaWYgKGZyb21JbmRleCA8IDApIHtcbiAgICAgICAgICBmcm9tSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoO2Zyb21JbmRleCA8IGxlbmd0aDsgZnJvbUluZGV4KyspIHtcbiAgICAgICAgaWYgKHRoaXNbZnJvbUluZGV4XSA9PT0gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBmcm9tSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihmdW4gLyosIHRoaXNBcmcgKi8pXG4gIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcbiAgICBpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICB7XG4gICAgICBpZiAoaSBpbiB0KVxuICAgICAgICBmdW4uY2FsbCh0aGlzQXJnLCB0W2ldLCBpLCB0KTtcbiAgICB9XG4gIH07XG59XG5pZiAoIUFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zb21lID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzQXJnICovKVxuICB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgaWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG4gICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuICAgIGlmICh0eXBlb2YgZnVuICE9PSAnZnVuY3Rpb24nKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICB7XG4gICAgICBpZiAoaSBpbiB0ICYmIGZ1bi5jYWxsKHRoaXNBcmcsIHRbaV0sIGksIHQpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBiaW5kKGZuKXtcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXHRpZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG5cdCAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgb25lYXJnID0gYXJncy5zaGlmdCgpO1xuXHRcdFx0dmFyIG5ld2FyZ3MgPSBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCkpO1xuXHRcdFx0dmFyIHJldHVybm1lID0gZm4uYXBwbHkob25lYXJnLCBuZXdhcmdzICk7XG5cdCAgICAgICAgcmV0dXJuIHJldHVybm1lO1xuXHQgICAgIH07XG5cdH1lbHNle1xuXHRcdHJldHVybiBmbi5iaW5kLmFwcGx5KGZuLCBhcmdzKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheShvYmope1xuXHRyZXR1cm4gfk9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImFycmF5XCIpO1xufVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxKzY0ZndcIikpIiwiXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBvcmlnID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7XG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oXywgc3RhY2speyByZXR1cm4gc3RhY2s7IH07XG4gIHZhciBlcnIgPSBuZXcgRXJyb3I7XG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGVyciwgYXJndW1lbnRzLmNhbGxlZSk7XG4gIHZhciBzdGFjayA9IGVyci5zdGFjaztcbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBvcmlnO1xuICByZXR1cm4gc3RhY2s7XG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbmlmKHR5cGVvZiBKU09OID09PSBcInVuZGVmaW5lZFwiKXtcclxuXHJcbi8qXHJcbiAgICBqc29uMi5qc1xyXG4gICAgMjAxNC0wMi0wNFxyXG5cclxuICAgIFB1YmxpYyBEb21haW4uXHJcblxyXG4gICAgTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxyXG5cclxuICAgIFNlZSBodHRwOi8vd3d3LkpTT04ub3JnL2pzLmh0bWxcclxuXHJcblxyXG4gICAgVGhpcyBjb2RlIHNob3VsZCBiZSBtaW5pZmllZCBiZWZvcmUgZGVwbG95bWVudC5cclxuICAgIFNlZSBodHRwOi8vamF2YXNjcmlwdC5jcm9ja2ZvcmQuY29tL2pzbWluLmh0bWxcclxuXHJcbiAgICBVU0UgWU9VUiBPV04gQ09QWS4gSVQgSVMgRVhUUkVNRUxZIFVOV0lTRSBUTyBMT0FEIENPREUgRlJPTSBTRVJWRVJTIFlPVSBET1xyXG4gICAgTk9UIENPTlRST0wuXHJcblxyXG5cclxuICAgIFRoaXMgZmlsZSBjcmVhdGVzIGEgZ2xvYmFsIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgdHdvIG1ldGhvZHM6IHN0cmluZ2lmeVxyXG4gICAgYW5kIHBhcnNlLlxyXG5cclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlKVxyXG4gICAgICAgICAgICB2YWx1ZSAgICAgICBhbnkgSmF2YVNjcmlwdCB2YWx1ZSwgdXN1YWxseSBhbiBvYmplY3Qgb3IgYXJyYXkuXHJcblxyXG4gICAgICAgICAgICByZXBsYWNlciAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBkZXRlcm1pbmVzIGhvdyBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzIGFyZSBzdHJpbmdpZmllZCBmb3Igb2JqZWN0cy4gSXQgY2FuIGJlIGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cclxuXHJcbiAgICAgICAgICAgIHNwYWNlICAgICAgIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IHNwZWNpZmllcyB0aGUgaW5kZW50YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsIHRoZSB0ZXh0IHdpbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYSBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0IHdpbGwgc3BlY2lmeSB0aGUgbnVtYmVyIG9mIHNwYWNlcyB0byBpbmRlbnQgYXQgZWFjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgJ1xcdCcgb3IgJyZuYnNwOycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdCBjb250YWlucyB0aGUgY2hhcmFjdGVycyB1c2VkIHRvIGluZGVudCBhdCBlYWNoIGxldmVsLlxyXG5cclxuICAgICAgICAgICAgVGhpcyBtZXRob2QgcHJvZHVjZXMgYSBKU09OIHRleHQgZnJvbSBhIEphdmFTY3JpcHQgdmFsdWUuXHJcblxyXG4gICAgICAgICAgICBXaGVuIGFuIG9iamVjdCB2YWx1ZSBpcyBmb3VuZCwgaWYgdGhlIG9iamVjdCBjb250YWlucyBhIHRvSlNPTlxyXG4gICAgICAgICAgICBtZXRob2QsIGl0cyB0b0pTT04gbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGFuZCB0aGUgcmVzdWx0IHdpbGwgYmVcclxuICAgICAgICAgICAgc3RyaW5naWZpZWQuIEEgdG9KU09OIG1ldGhvZCBkb2VzIG5vdCBzZXJpYWxpemU6IGl0IHJldHVybnMgdGhlXHJcbiAgICAgICAgICAgIHZhbHVlIHJlcHJlc2VudGVkIGJ5IHRoZSBuYW1lL3ZhbHVlIHBhaXIgdGhhdCBzaG91bGQgYmUgc2VyaWFsaXplZCxcclxuICAgICAgICAgICAgb3IgdW5kZWZpbmVkIGlmIG5vdGhpbmcgc2hvdWxkIGJlIHNlcmlhbGl6ZWQuIFRoZSB0b0pTT04gbWV0aG9kXHJcbiAgICAgICAgICAgIHdpbGwgYmUgcGFzc2VkIHRoZSBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoZSB2YWx1ZSwgYW5kIHRoaXMgd2lsbCBiZVxyXG4gICAgICAgICAgICBib3VuZCB0byB0aGUgdmFsdWVcclxuXHJcbiAgICAgICAgICAgIEZvciBleGFtcGxlLCB0aGlzIHdvdWxkIHNlcmlhbGl6ZSBEYXRlcyBhcyBJU08gc3RyaW5ncy5cclxuXHJcbiAgICAgICAgICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZihuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgICArICctJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICAgICAgKyAnVCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSAgICsgJzonICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICAgKyAnWic7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsIHJlcGxhY2VyIG1ldGhvZC4gSXQgd2lsbCBiZSBwYXNzZWQgdGhlXHJcbiAgICAgICAgICAgIGtleSBhbmQgdmFsdWUgb2YgZWFjaCBtZW1iZXIsIHdpdGggdGhpcyBib3VuZCB0byB0aGUgY29udGFpbmluZ1xyXG4gICAgICAgICAgICBvYmplY3QuIFRoZSB2YWx1ZSB0aGF0IGlzIHJldHVybmVkIGZyb20geW91ciBtZXRob2Qgd2lsbCBiZVxyXG4gICAgICAgICAgICBzZXJpYWxpemVkLiBJZiB5b3VyIG1ldGhvZCByZXR1cm5zIHVuZGVmaW5lZCwgdGhlbiB0aGUgbWVtYmVyIHdpbGxcclxuICAgICAgICAgICAgYmUgZXhjbHVkZWQgZnJvbSB0aGUgc2VyaWFsaXphdGlvbi5cclxuXHJcbiAgICAgICAgICAgIElmIHRoZSByZXBsYWNlciBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgdGhlbiBpdCB3aWxsIGJlXHJcbiAgICAgICAgICAgIHVzZWQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHNlcmlhbGl6ZWQuIEl0IGZpbHRlcnMgdGhlIHJlc3VsdHNcclxuICAgICAgICAgICAgc3VjaCB0aGF0IG9ubHkgbWVtYmVycyB3aXRoIGtleXMgbGlzdGVkIGluIHRoZSByZXBsYWNlciBhcnJheSBhcmVcclxuICAgICAgICAgICAgc3RyaW5naWZpZWQuXHJcblxyXG4gICAgICAgICAgICBWYWx1ZXMgdGhhdCBkbyBub3QgaGF2ZSBKU09OIHJlcHJlc2VudGF0aW9ucywgc3VjaCBhcyB1bmRlZmluZWQgb3JcclxuICAgICAgICAgICAgZnVuY3Rpb25zLCB3aWxsIG5vdCBiZSBzZXJpYWxpemVkLiBTdWNoIHZhbHVlcyBpbiBvYmplY3RzIHdpbGwgYmVcclxuICAgICAgICAgICAgZHJvcHBlZDsgaW4gYXJyYXlzIHRoZXkgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bGwuIFlvdSBjYW4gdXNlXHJcbiAgICAgICAgICAgIGEgcmVwbGFjZXIgZnVuY3Rpb24gdG8gcmVwbGFjZSB0aG9zZSB3aXRoIEpTT04gdmFsdWVzLlxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh1bmRlZmluZWQpIHJldHVybnMgdW5kZWZpbmVkLlxyXG5cclxuICAgICAgICAgICAgVGhlIG9wdGlvbmFsIHNwYWNlIHBhcmFtZXRlciBwcm9kdWNlcyBhIHN0cmluZ2lmaWNhdGlvbiBvZiB0aGVcclxuICAgICAgICAgICAgdmFsdWUgdGhhdCBpcyBmaWxsZWQgd2l0aCBsaW5lIGJyZWFrcyBhbmQgaW5kZW50YXRpb24gdG8gbWFrZSBpdFxyXG4gICAgICAgICAgICBlYXNpZXIgdG8gcmVhZC5cclxuXHJcbiAgICAgICAgICAgIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBub24tZW1wdHkgc3RyaW5nLCB0aGVuIHRoYXQgc3RyaW5nIHdpbGxcclxuICAgICAgICAgICAgYmUgdXNlZCBmb3IgaW5kZW50YXRpb24uIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIHRoZW5cclxuICAgICAgICAgICAgdGhlIGluZGVudGF0aW9uIHdpbGwgYmUgdGhhdCBtYW55IHNwYWNlcy5cclxuXHJcbiAgICAgICAgICAgIEV4YW1wbGU6XHJcblxyXG4gICAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoWydlJywge3BsdXJpYnVzOiAndW51bSd9XSk7XHJcbiAgICAgICAgICAgIC8vIHRleHQgaXMgJ1tcImVcIix7XCJwbHVyaWJ1c1wiOlwidW51bVwifV0nXHJcblxyXG5cclxuICAgICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFsnZScsIHtwbHVyaWJ1czogJ3VudW0nfV0sIG51bGwsICdcXHQnKTtcclxuICAgICAgICAgICAgLy8gdGV4dCBpcyAnW1xcblxcdFwiZVwiLFxcblxcdHtcXG5cXHRcXHRcInBsdXJpYnVzXCI6IFwidW51bVwiXFxuXFx0fVxcbl0nXHJcblxyXG4gICAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW25ldyBEYXRlKCldLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNba2V5XSBpbnN0YW5jZW9mIERhdGUgP1xyXG4gICAgICAgICAgICAgICAgICAgICdEYXRlKCcgKyB0aGlzW2tleV0gKyAnKScgOiB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHRleHQgaXMgJ1tcIkRhdGUoLS0tY3VycmVudCB0aW1lLS0tKVwiXSdcclxuXHJcblxyXG4gICAgICAgIEpTT04ucGFyc2UodGV4dCwgcmV2aXZlcilcclxuICAgICAgICAgICAgVGhpcyBtZXRob2QgcGFyc2VzIGEgSlNPTiB0ZXh0IHRvIHByb2R1Y2UgYW4gb2JqZWN0IG9yIGFycmF5LlxyXG4gICAgICAgICAgICBJdCBjYW4gdGhyb3cgYSBTeW50YXhFcnJvciBleGNlcHRpb24uXHJcblxyXG4gICAgICAgICAgICBUaGUgb3B0aW9uYWwgcmV2aXZlciBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiB0aGF0IGNhbiBmaWx0ZXIgYW5kXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy4gSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLFxyXG4gICAgICAgICAgICBhbmQgaXRzIHJldHVybiB2YWx1ZSBpcyB1c2VkIGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIHZhbHVlLlxyXG4gICAgICAgICAgICBJZiBpdCByZXR1cm5zIHdoYXQgaXQgcmVjZWl2ZWQsIHRoZW4gdGhlIHN0cnVjdHVyZSBpcyBub3QgbW9kaWZpZWQuXHJcbiAgICAgICAgICAgIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpcyBkZWxldGVkLlxyXG5cclxuICAgICAgICAgICAgRXhhbXBsZTpcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIHRoZSB0ZXh0LiBWYWx1ZXMgdGhhdCBsb29rIGxpa2UgSVNPIGRhdGUgc3RyaW5ncyB3aWxsXHJcbiAgICAgICAgICAgIC8vIGJlIGNvbnZlcnRlZCB0byBEYXRlIG9iamVjdHMuXHJcblxyXG4gICAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKHRleHQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYSA9XHJcbi9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSg/OlxcLlxcZCopPylaJC8uZXhlYyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKCthWzFdLCArYVsyXSAtIDEsICthWzNdLCArYVs0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICthWzVdLCArYVs2XSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKCdbXCJEYXRlKDA5LzA5LzIwMDEpXCJdJywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoMCwgNSkgPT09ICdEYXRlKCcgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoLTEpID09PSAnKScpIHtcclxuICAgICAgICAgICAgICAgICAgICBkID0gbmV3IERhdGUodmFsdWUuc2xpY2UoNSwgLTEpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICBUaGlzIGlzIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLiBZb3UgYXJlIGZyZWUgdG8gY29weSwgbW9kaWZ5LCBvclxyXG4gICAgcmVkaXN0cmlidXRlLlxyXG4qL1xyXG5cclxuLypqc2xpbnQgZXZpbDogdHJ1ZSwgcmVnZXhwOiB0cnVlICovXHJcblxyXG4vKm1lbWJlcnMgXCJcIiwgXCJcXGJcIiwgXCJcXHRcIiwgXCJcXG5cIiwgXCJcXGZcIiwgXCJcXHJcIiwgXCJcXFwiXCIsIEpTT04sIFwiXFxcXFwiLCBhcHBseSxcclxuICAgIGNhbGwsIGNoYXJDb2RlQXQsIGdldFVUQ0RhdGUsIGdldFVUQ0Z1bGxZZWFyLCBnZXRVVENIb3VycyxcclxuICAgIGdldFVUQ01pbnV0ZXMsIGdldFVUQ01vbnRoLCBnZXRVVENTZWNvbmRzLCBoYXNPd25Qcm9wZXJ0eSwgam9pbixcclxuICAgIGxhc3RJbmRleCwgbGVuZ3RoLCBwYXJzZSwgcHJvdG90eXBlLCBwdXNoLCByZXBsYWNlLCBzbGljZSwgc3RyaW5naWZ5LFxyXG4gICAgdGVzdCwgdG9KU09OLCB0b1N0cmluZywgdmFsdWVPZlxyXG4qL1xyXG5cclxuXHJcbi8vIENyZWF0ZSBhIEpTT04gb2JqZWN0IG9ubHkgaWYgb25lIGRvZXMgbm90IGFscmVhZHkgZXhpc3QuIFdlIGNyZWF0ZSB0aGVcclxuLy8gbWV0aG9kcyBpbiBhIGNsb3N1cmUgdG8gYXZvaWQgY3JlYXRpbmcgZ2xvYmFsIHZhcmlhYmxlcy5cclxuXHJcbmlmICh0eXBlb2YgSlNPTiAhPT0gJ29iamVjdCcpIHtcclxuICAgIEpTT04gPSB7fTtcclxufVxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmdW5jdGlvbiBmKG4pIHtcclxuICAgICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxyXG4gICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAhPT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodGhpcy52YWx1ZU9mKCkpXHJcbiAgICAgICAgICAgICAgICA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSAgICAgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICAgICAgKyAnVCcgK1xyXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSAgICAgKyAnOicgK1xyXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICAgKyAnOicgK1xyXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICAgKyAnWidcclxuICAgICAgICAgICAgICAgIDogbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnRvSlNPTiAgICAgID1cclxuICAgICAgICAgICAgTnVtYmVyLnByb3RvdHlwZS50b0pTT04gID1cclxuICAgICAgICAgICAgQm9vbGVhbi5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjeCxcclxuICAgICAgICBlc2NhcGFibGUsXHJcbiAgICAgICAgZ2FwLFxyXG4gICAgICAgIGluZGVudCxcclxuICAgICAgICBtZXRhLFxyXG4gICAgICAgIHJlcDtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XHJcblxyXG4vLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXHJcbi8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXHJcbi8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxyXG4vLyBzZXF1ZW5jZXMuXHJcblxyXG4gICAgICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xyXG4gICAgICAgIHJldHVybiBlc2NhcGFibGUudGVzdChzdHJpbmcpID8gJ1wiJyArIHN0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgdmFyIGMgPSBtZXRhW2FdO1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IGNcclxuICAgICAgICAgICAgICAgIDogJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XHJcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0cmluZyArICdcIic7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHN0cihrZXksIGhvbGRlcikge1xyXG5cclxuLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxyXG5cclxuICAgICAgICB2YXIgaSwgICAgICAgICAgLy8gVGhlIGxvb3AgY291bnRlci5cclxuICAgICAgICAgICAgaywgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXHJcbiAgICAgICAgICAgIHYsICAgICAgICAgIC8vIFRoZSBtZW1iZXIgdmFsdWUuXHJcbiAgICAgICAgICAgIGxlbmd0aCxcclxuICAgICAgICAgICAgbWluZCA9IGdhcCxcclxuICAgICAgICAgICAgcGFydGlhbCxcclxuICAgICAgICAgICAgdmFsdWUgPSBob2xkZXJba2V5XTtcclxuXHJcbi8vIElmIHRoZSB2YWx1ZSBoYXMgYSB0b0pTT04gbWV0aG9kLCBjYWxsIGl0IHRvIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxyXG5cclxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTihrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbi8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xyXG4vLyBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSByZXAuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbi8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcclxuICAgICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgICAgICByZXR1cm4gcXVvdGUodmFsdWUpO1xyXG5cclxuICAgICAgICBjYXNlICdudW1iZXInOlxyXG5cclxuLy8gSlNPTiBudW1iZXJzIG11c3QgYmUgZmluaXRlLiBFbmNvZGUgbm9uLWZpbml0ZSBudW1iZXJzIGFzIG51bGwuXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6ICdudWxsJztcclxuXHJcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgY2FzZSAnbnVsbCc6XHJcblxyXG4vLyBJZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuIG9yIG51bGwsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcuIE5vdGU6XHJcbi8vIHR5cGVvZiBudWxsIGRvZXMgbm90IHByb2R1Y2UgJ251bGwnLiBUaGUgY2FzZSBpcyBpbmNsdWRlZCBoZXJlIGluXHJcbi8vIHRoZSByZW1vdGUgY2hhbmNlIHRoYXQgdGhpcyBnZXRzIGZpeGVkIHNvbWVkYXkuXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuXHJcbi8vIElmIHRoZSB0eXBlIGlzICdvYmplY3QnLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXHJcbi8vIG51bGwuXHJcblxyXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XHJcblxyXG4vLyBEdWUgdG8gYSBzcGVjaWZpY2F0aW9uIGJsdW5kZXIgaW4gRUNNQVNjcmlwdCwgdHlwZW9mIG51bGwgaXMgJ29iamVjdCcsXHJcbi8vIHNvIHdhdGNoIG91dCBmb3IgdGhhdCBjYXNlLlxyXG5cclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdudWxsJztcclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcclxuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xyXG5cclxuLy8gSXMgdGhlIHZhbHVlIGFuIGFycmF5P1xyXG5cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nKSB7XHJcblxyXG4vLyBUaGUgdmFsdWUgaXMgYW4gYXJyYXkuIFN0cmluZ2lmeSBldmVyeSBlbGVtZW50LiBVc2UgbnVsbCBhcyBhIHBsYWNlaG9sZGVyXHJcbi8vIGZvciBub24tSlNPTiB2YWx1ZXMuXHJcblxyXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGlhbFtpXSA9IHN0cihpLCB2YWx1ZSkgfHwgJ251bGwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuLy8gSm9pbiBhbGwgb2YgdGhlIGVsZW1lbnRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsIGFuZCB3cmFwIHRoZW0gaW5cclxuLy8gYnJhY2tldHMuXHJcblxyXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnW10nXHJcbiAgICAgICAgICAgICAgICAgICAgOiBnYXBcclxuICAgICAgICAgICAgICAgICAgICA/ICdbXFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ10nXHJcbiAgICAgICAgICAgICAgICAgICAgOiAnWycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICddJztcclxuICAgICAgICAgICAgICAgIGdhcCA9IG1pbmQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcCAmJiB0eXBlb2YgcmVwID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVwLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwW2ldID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gcmVwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuLy8gT3RoZXJ3aXNlLCBpdGVyYXRlIHRocm91Z2ggYWxsIG9mIHRoZSBrZXlzIGluIHRoZSBvYmplY3QuXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoZ2FwID8gJzogJyA6ICc6JykgKyB2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxyXG4vLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cclxuXHJcbiAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICAgICAgPyAne30nXHJcbiAgICAgICAgICAgICAgICA6IGdhcFxyXG4gICAgICAgICAgICAgICAgPyAne1xcbicgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oJyxcXG4nICsgZ2FwKSArICdcXG4nICsgbWluZCArICd9J1xyXG4gICAgICAgICAgICAgICAgOiAneycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICd9JztcclxuICAgICAgICAgICAgZ2FwID0gbWluZDtcclxuICAgICAgICAgICAgcmV0dXJuIHY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgc3RyaW5naWZ5IG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXHJcblxyXG4gICAgaWYgKHR5cGVvZiBKU09OLnN0cmluZ2lmeSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XHJcbiAgICAgICAgbWV0YSA9IHsgICAgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcclxuICAgICAgICAgICAgJ1xcYic6ICdcXFxcYicsXHJcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxyXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcclxuICAgICAgICAgICAgJ1xcZic6ICdcXFxcZicsXHJcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxyXG4gICAgICAgICAgICAnXCInIDogJ1xcXFxcIicsXHJcbiAgICAgICAgICAgICdcXFxcJzogJ1xcXFxcXFxcJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xyXG5cclxuLy8gVGhlIHN0cmluZ2lmeSBtZXRob2QgdGFrZXMgYSB2YWx1ZSBhbmQgYW4gb3B0aW9uYWwgcmVwbGFjZXIsIGFuZCBhbiBvcHRpb25hbFxyXG4vLyBzcGFjZSBwYXJhbWV0ZXIsIGFuZCByZXR1cm5zIGEgSlNPTiB0ZXh0LiBUaGUgcmVwbGFjZXIgY2FuIGJlIGEgZnVuY3Rpb25cclxuLy8gdGhhdCBjYW4gcmVwbGFjZSB2YWx1ZXMsIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCB3aWxsIHNlbGVjdCB0aGUga2V5cy5cclxuLy8gQSBkZWZhdWx0IHJlcGxhY2VyIG1ldGhvZCBjYW4gYmUgcHJvdmlkZWQuIFVzZSBvZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGNhblxyXG4vLyBwcm9kdWNlIHRleHQgdGhhdCBpcyBtb3JlIGVhc2lseSByZWFkYWJsZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBnYXAgPSAnJztcclxuICAgICAgICAgICAgaW5kZW50ID0gJyc7XHJcblxyXG4vLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XHJcbi8vIG1hbnkgc3BhY2VzLlxyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ICs9ICcgJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbi8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbi8vIElmIHRoZXJlIGlzIGEgcmVwbGFjZXIsIGl0IG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheS5cclxuLy8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvci5cclxuXHJcbiAgICAgICAgICAgIHJlcCA9IHJlcGxhY2VyO1xyXG4gICAgICAgICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSAnZnVuY3Rpb24nICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gJ29iamVjdCcgfHxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSAnbnVtYmVyJykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTi5zdHJpbmdpZnknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cclxuLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHIoJycsIHsnJzogdmFsdWV9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbi8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHBhcnNlIG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXHJcblxyXG4gICAgaWYgKHR5cGVvZiBKU09OLnBhcnNlICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcclxuICAgICAgICBKU09OLnBhcnNlID0gZnVuY3Rpb24gKHRleHQsIHJldml2ZXIpIHtcclxuXHJcbi8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xyXG4vLyBhIEphdmFTY3JpcHQgdmFsdWUgaWYgdGhlIHRleHQgaXMgYSB2YWxpZCBKU09OIHRleHQuXHJcblxyXG4gICAgICAgICAgICB2YXIgajtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcclxuXHJcbi8vIFRoZSB3YWxrIG1ldGhvZCBpcyB1c2VkIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgc29cclxuLy8gdGhhdCBtb2RpZmljYXRpb25zIGNhbiBiZSBtYWRlLlxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbi8vIFBhcnNpbmcgaGFwcGVucyBpbiBmb3VyIHN0YWdlcy4gSW4gdGhlIGZpcnN0IHN0YWdlLCB3ZSByZXBsYWNlIGNlcnRhaW5cclxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xyXG4vLyBpbmNvcnJlY3RseSwgZWl0aGVyIHNpbGVudGx5IGRlbGV0aW5nIHRoZW0sIG9yIHRyZWF0aW5nIHRoZW0gYXMgbGluZSBlbmRpbmdzLlxyXG5cclxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcclxuICAgICAgICAgICAgY3gubGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgaWYgKGN4LnRlc3QodGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoY3gsIGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcdScgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbi8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXHJcbi8vIGZvciBub24tSlNPTiBwYXR0ZXJucy4gV2UgYXJlIGVzcGVjaWFsbHkgY29uY2VybmVkIHdpdGggJygpJyBhbmQgJ25ldydcclxuLy8gYmVjYXVzZSB0aGV5IGNhbiBjYXVzZSBpbnZvY2F0aW9uLCBhbmQgJz0nIGJlY2F1c2UgaXQgY2FuIGNhdXNlIG11dGF0aW9uLlxyXG4vLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cclxuXHJcbi8vIFdlIHNwbGl0IHRoZSBzZWNvbmQgc3RhZ2UgaW50byA0IHJlZ2V4cCBvcGVyYXRpb25zIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kXHJcbi8vIGNyaXBwbGluZyBpbmVmZmljaWVuY2llcyBpbiBJRSdzIGFuZCBTYWZhcmkncyByZWdleHAgZW5naW5lcy4gRmlyc3Qgd2VcclxuLy8gcmVwbGFjZSB0aGUgSlNPTiBiYWNrc2xhc2ggcGFpcnMgd2l0aCAnQCcgKGEgbm9uLUpTT04gY2hhcmFjdGVyKS4gU2Vjb25kLCB3ZVxyXG4vLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggJ10nIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXHJcbi8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxyXG4vLyB3ZSBsb29rIHRvIHNlZSB0aGF0IHRoZSByZW1haW5pbmcgY2hhcmFjdGVycyBhcmUgb25seSB3aGl0ZXNwYWNlIG9yICddJyBvclxyXG4vLyAnLCcgb3IgJzonIG9yICd7JyBvciAnfScuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cclxuXHJcbiAgICAgICAgICAgIGlmICgvXltcXF0sOnt9XFxzXSokL1xyXG4gICAgICAgICAgICAgICAgICAgIC50ZXN0KHRleHQucmVwbGFjZSgvXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nLCAnQCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZywgJ10nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86Xnw6fCwpKD86XFxzKlxcWykrL2csICcnKSkpIHtcclxuXHJcbi8vIEluIHRoZSB0aGlyZCBzdGFnZSB3ZSB1c2UgdGhlIGV2YWwgZnVuY3Rpb24gdG8gY29tcGlsZSB0aGUgdGV4dCBpbnRvIGFcclxuLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSAneycgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcclxuLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcclxuLy8gaW4gcGFyZW5zIHRvIGVsaW1pbmF0ZSB0aGUgYW1iaWd1aXR5LlxyXG5cclxuICAgICAgICAgICAgICAgIGogPSBldmFsKCcoJyArIHRleHQgKyAnKScpO1xyXG5cclxuLy8gSW4gdGhlIG9wdGlvbmFsIGZvdXJ0aCBzdGFnZSwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSwgcGFzc2luZ1xyXG4vLyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byBhIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlIHRyYW5zZm9ybWF0aW9uLlxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gd2Fsayh7Jyc6IGp9LCAnJylcclxuICAgICAgICAgICAgICAgICAgICA6IGo7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbi8vIElmIHRoZSB0ZXh0IGlzIG5vdCBKU09OIHBhcnNlYWJsZSwgdGhlbiBhIFN5bnRheEVycm9yIGlzIHRocm93bi5cclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignSlNPTi5wYXJzZScpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7XHJcblxyXG59XHJcblxyXG5pZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcclxuICBBcnJheS5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24oY2FsbGJhY2ssIG9wdF9pbml0aWFsVmFsdWUpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgaWYgKG51bGwgPT09IHRoaXMgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0aGlzKSB7XHJcbiAgICAgIC8vIEF0IHRoZSBtb21lbnQgYWxsIG1vZGVybiBicm93c2VycywgdGhhdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBoYXZlXHJcbiAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlLiBGb3IgaW5zdGFuY2UsIElFOFxyXG4gICAgICAvLyBkb2VzIG5vdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBzbyB0aGlzIGNoZWNrIGlzIGFjdHVhbGx5IHVzZWxlc3MuXHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXHJcbiAgICAgICAgICAnQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICAgIH1cclxuICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2FsbGJhY2spIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcclxuICAgIH1cclxuICAgIHZhciBpbmRleCwgdmFsdWUsXHJcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDAsXHJcbiAgICAgICAgaXNWYWx1ZVNldCA9IGZhbHNlO1xyXG4gICAgaWYgKDEgPCBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhbHVlID0gb3B0X2luaXRpYWxWYWx1ZTtcclxuICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBmb3IgKGluZGV4ID0gMDsgbGVuZ3RoID4gaW5kZXg7ICsraW5kZXgpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XHJcbiAgICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcclxuICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzW2luZGV4XTtcclxuICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFpc1ZhbHVlU2V0KSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5tYXApXHJcbntcclxuICBBcnJheS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzQXJnICovKVxyXG4gIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbClcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcclxuICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyID8gYXJndW1lbnRzWzFdIDogdm9pZCAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgIHtcclxuICAgICAgLy8gTk9URTogQWJzb2x1dGUgY29ycmVjdG5lc3Mgd291bGQgZGVtYW5kIE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxyXG4gICAgICAvLyAgICAgICBiZSB1c2VkLiAgQnV0IHRoaXMgbWV0aG9kIGlzIGZhaXJseSBuZXcsIGFuZCBmYWlsdXJlIGlzXHJcbiAgICAgIC8vICAgICAgIHBvc3NpYmxlIG9ubHkgaWYgT2JqZWN0LnByb3RvdHlwZSBvciBBcnJheS5wcm90b3R5cGVcclxuICAgICAgLy8gICAgICAgaGFzIGEgcHJvcGVydHkgfGl8ICh2ZXJ5IHVubGlrZWx5KSwgc28gdXNlIGEgbGVzcy1jb3JyZWN0XHJcbiAgICAgIC8vICAgICAgIGJ1dCBtb3JlIHBvcnRhYmxlIGFsdGVybmF0aXZlLlxyXG4gICAgICBpZiAoaSBpbiB0KVxyXG4gICAgICAgIHJlc1tpXSA9IGZ1bi5jYWxsKHRoaXNBcmcsIHRbaV0sIGksIHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXM7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3Qva2V5c1xyXG5pZiAoIU9iamVjdC5rZXlzKSB7XHJcbiAgT2JqZWN0LmtleXMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcclxuICAgICAgICBoYXNEb250RW51bUJ1ZyA9ICEoe3RvU3RyaW5nOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyksXHJcbiAgICAgICAgZG9udEVudW1zID0gW1xyXG4gICAgICAgICAgJ3RvU3RyaW5nJyxcclxuICAgICAgICAgICd0b0xvY2FsZVN0cmluZycsXHJcbiAgICAgICAgICAndmFsdWVPZicsXHJcbiAgICAgICAgICAnaGFzT3duUHJvcGVydHknLFxyXG4gICAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxyXG4gICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcclxuICAgICAgICAgICdjb25zdHJ1Y3RvcidcclxuICAgICAgICBdLFxyXG4gICAgICAgIGRvbnRFbnVtc0xlbmd0aCA9IGRvbnRFbnVtcy5sZW5ndGg7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gbm9uLW9iamVjdCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0gW10sIHByb3AsIGk7XHJcblxyXG4gICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xyXG4gICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICB9KCkpO1xyXG59XHJcblxyXG5pZighU3RyaW5nLnByb3RvdHlwZS50cmltKSB7XHJcbiAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccysvLCcnKS5yZXBsYWNlKC9cXHMrJC8sICcnKTtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maWx0ZXIpXHJcbntcclxuICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzQXJnICovKVxyXG4gIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbClcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgaWYgKHR5cGVvZiBmdW4gIT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG4gICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxyXG4gICAge1xyXG4gICAgICBpZiAoaSBpbiB0KVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRbaV07XHJcblxyXG4gICAgICAgIC8vIE5PVEU6IFRlY2huaWNhbGx5IHRoaXMgc2hvdWxkIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBhdFxyXG4gICAgICAgIC8vICAgICAgIHRoZSBuZXh0IGluZGV4LCBhcyBwdXNoIGNhbiBiZSBhZmZlY3RlZCBieVxyXG4gICAgICAgIC8vICAgICAgIHByb3BlcnRpZXMgb24gT2JqZWN0LnByb3RvdHlwZSBhbmQgQXJyYXkucHJvdG90eXBlLlxyXG4gICAgICAgIC8vICAgICAgIEJ1dCB0aGF0IG1ldGhvZCdzIG5ldywgYW5kIGNvbGxpc2lvbnMgc2hvdWxkIGJlXHJcbiAgICAgICAgLy8gICAgICAgcmFyZSwgc28gdXNlIHRoZSBtb3JlLWNvbXBhdGlibGUgYWx0ZXJuYXRpdmUuXHJcbiAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgdCkpXHJcbiAgICAgICAgICByZXMucHVzaCh2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcztcclxuICB9O1xyXG59XHJcblxyXG47KGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUsIHBsYXRmb3JtKSB7XHJcblxyXG5pZiAobW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1pbmltYXRjaFxyXG5lbHNlIGV4cG9ydHMubWluaW1hdGNoID0gbWluaW1hdGNoXHJcblxyXG5taW5pbWF0Y2guTWluaW1hdGNoID0gTWluaW1hdGNoXHJcblxyXG52YXIgTFJVID0gZnVuY3Rpb24gTFJVQ2FjaGUgKCkge1xyXG4gICAgICAgIC8vIG5vdCBxdWl0ZSBhbiBMUlUsIGJ1dCBzdGlsbCBzcGFjZS1saW1pdGVkLlxyXG4gICAgICAgIHZhciBjYWNoZSA9IHt9XHJcbiAgICAgICAgdmFyIGNudCA9IDBcclxuICAgICAgICB0aGlzLnNldCA9IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICAgICAgICBjbnQgKytcclxuICAgICAgICAgIGlmIChjbnQgPj0gMTAwKSBjYWNoZSA9IHt9XHJcbiAgICAgICAgICBjYWNoZVtrXSA9IHZcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoaykgeyByZXR1cm4gY2FjaGVba10gfVxyXG4gICAgICB9XHJcbiAgLCBjYWNoZSA9IG1pbmltYXRjaC5jYWNoZSA9IG5ldyBMUlUoe21heDogMTAwfSlcclxuICAsIEdMT0JTVEFSID0gbWluaW1hdGNoLkdMT0JTVEFSID0gTWluaW1hdGNoLkdMT0JTVEFSID0ge31cclxuICAsIHNpZ211bmQgPSBwcm9jZXNzLmJyb3dzZXIgPyBmdW5jdGlvbiBzaWdtdW5kIChvYmopIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKVxyXG4gICAgICB9IDogcmVxdWlyZShcInNpZ211bmRcIilcclxuXHJcbnZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcclxuICAvLyBhbnkgc2luZ2xlIHRoaW5nIG90aGVyIHRoYW4gL1xyXG4gIC8vIGRvbid0IG5lZWQgdG8gZXNjYXBlIC8gd2hlbiB1c2luZyBuZXcgUmVnRXhwKClcclxuICAsIHFtYXJrID0gXCJbXi9dXCJcclxuXHJcbiAgLy8gKiA9PiBhbnkgbnVtYmVyIG9mIGNoYXJhY3RlcnNcclxuICAsIHN0YXIgPSBxbWFyayArIFwiKj9cIlxyXG5cclxuICAvLyAqKiB3aGVuIGRvdHMgYXJlIGFsbG93ZWQuICBBbnl0aGluZyBnb2VzLCBleGNlcHQgLi4gYW5kIC5cclxuICAvLyBub3QgKF4gb3IgLyBmb2xsb3dlZCBieSBvbmUgb3IgdHdvIGRvdHMgZm9sbG93ZWQgYnkgJCBvciAvKSxcclxuICAvLyBmb2xsb3dlZCBieSBhbnl0aGluZywgYW55IG51bWJlciBvZiB0aW1lcy5cclxuICAsIHR3b1N0YXJEb3QgPSBcIig/Oig/ISg/OlxcXFxcXC98XikoPzpcXFxcLnsxLDJ9KSgkfFxcXFxcXC8pKS4pKj9cIlxyXG5cclxuICAvLyBub3QgYSBeIG9yIC8gZm9sbG93ZWQgYnkgYSBkb3QsXHJcbiAgLy8gZm9sbG93ZWQgYnkgYW55dGhpbmcsIGFueSBudW1iZXIgb2YgdGltZXMuXHJcbiAgLCB0d29TdGFyTm9Eb3QgPSBcIig/Oig/ISg/OlxcXFxcXC98XilcXFxcLikuKSo/XCJcclxuXHJcbiAgLy8gY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZCBpbiBSZWdFeHAuXHJcbiAgLCByZVNwZWNpYWxzID0gY2hhclNldChcIigpLip7fSs/W11eJFxcXFwhXCIpXHJcblxyXG4vLyBcImFiY1wiIC0+IHsgYTp0cnVlLCBiOnRydWUsIGM6dHJ1ZSB9XHJcbmZ1bmN0aW9uIGNoYXJTZXQgKHMpIHtcclxuICByZXR1cm4gcy5zcGxpdChcIlwiKS5yZWR1Y2UoZnVuY3Rpb24gKHNldCwgYykge1xyXG4gICAgc2V0W2NdID0gdHJ1ZVxyXG4gICAgcmV0dXJuIHNldFxyXG4gIH0sIHt9KVxyXG59XHJcblxyXG4vLyBub3JtYWxpemVzIHNsYXNoZXMuXHJcbnZhciBzbGFzaFNwbGl0ID0gL1xcLysvXHJcblxyXG5taW5pbWF0Y2guZmlsdGVyID0gZmlsdGVyXHJcbmZ1bmN0aW9uIGZpbHRlciAocGF0dGVybiwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwLCBpLCBsaXN0KSB7XHJcbiAgICByZXR1cm4gbWluaW1hdGNoKHAsIHBhdHRlcm4sIG9wdGlvbnMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBleHQgKGEsIGIpIHtcclxuICBhID0gYSB8fCB7fVxyXG4gIGIgPSBiIHx8IHt9XHJcbiAgdmFyIHQgPSB7fVxyXG4gIE9iamVjdC5rZXlzKGIpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcclxuICAgIHRba10gPSBiW2tdXHJcbiAgfSlcclxuICBPYmplY3Qua2V5cyhhKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XHJcbiAgICB0W2tdID0gYVtrXVxyXG4gIH0pXHJcbiAgcmV0dXJuIHRcclxufVxyXG5cclxubWluaW1hdGNoLmRlZmF1bHRzID0gZnVuY3Rpb24gKGRlZikge1xyXG4gIGlmICghZGVmIHx8ICFPYmplY3Qua2V5cyhkZWYpLmxlbmd0aCkgcmV0dXJuIG1pbmltYXRjaFxyXG5cclxuICB2YXIgb3JpZyA9IG1pbmltYXRjaFxyXG5cclxuICB2YXIgbSA9IGZ1bmN0aW9uIG1pbmltYXRjaCAocCwgcGF0dGVybiwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG9yaWcubWluaW1hdGNoKHAsIHBhdHRlcm4sIGV4dChkZWYsIG9wdGlvbnMpKVxyXG4gIH1cclxuXHJcbiAgbS5NaW5pbWF0Y2ggPSBmdW5jdGlvbiBNaW5pbWF0Y2ggKHBhdHRlcm4sIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgb3JpZy5NaW5pbWF0Y2gocGF0dGVybiwgZXh0KGRlZiwgb3B0aW9ucykpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gbVxyXG59XHJcblxyXG5NaW5pbWF0Y2guZGVmYXVsdHMgPSBmdW5jdGlvbiAoZGVmKSB7XHJcbiAgaWYgKCFkZWYgfHwgIU9iamVjdC5rZXlzKGRlZikubGVuZ3RoKSByZXR1cm4gTWluaW1hdGNoXHJcbiAgcmV0dXJuIG1pbmltYXRjaC5kZWZhdWx0cyhkZWYpLk1pbmltYXRjaFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbWluaW1hdGNoIChwLCBwYXR0ZXJuLCBvcHRpb25zKSB7XHJcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZ2xvYiBwYXR0ZXJuIHN0cmluZyByZXF1aXJlZFwiKVxyXG4gIH1cclxuXHJcbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge31cclxuXHJcbiAgLy8gc2hvcnRjdXQ6IGNvbW1lbnRzIG1hdGNoIG5vdGhpbmcuXHJcbiAgaWYgKCFvcHRpb25zLm5vY29tbWVudCAmJiBwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gXCIjXCIpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gXCJcIiBvbmx5IG1hdGNoZXMgXCJcIlxyXG4gIGlmIChwYXR0ZXJuLnRyaW0oKSA9PT0gXCJcIikgcmV0dXJuIHAgPT09IFwiXCJcclxuXHJcbiAgcmV0dXJuIG5ldyBNaW5pbWF0Y2gocGF0dGVybiwgb3B0aW9ucykubWF0Y2gocClcclxufVxyXG5cclxuZnVuY3Rpb24gTWluaW1hdGNoIChwYXR0ZXJuLCBvcHRpb25zKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1pbmltYXRjaCkpIHtcclxuICAgIHJldHVybiBuZXcgTWluaW1hdGNoKHBhdHRlcm4sIG9wdGlvbnMsIGNhY2hlKVxyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZ2xvYiBwYXR0ZXJuIHN0cmluZyByZXF1aXJlZFwiKVxyXG4gIH1cclxuXHJcbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge31cclxuICBwYXR0ZXJuID0gcGF0dGVybi50cmltKClcclxuXHJcbiAgLy8gd2luZG93czogbmVlZCB0byB1c2UgLywgbm90IFxcXHJcbiAgLy8gT24gb3RoZXIgcGxhdGZvcm1zLCBcXCBpcyBhIHZhbGlkIChhbGJlaXQgYmFkKSBmaWxlbmFtZSBjaGFyLlxyXG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XHJcbiAgICBwYXR0ZXJuID0gcGF0dGVybi5zcGxpdChcIlxcXFxcIikuam9pbihcIi9cIilcclxuICB9XHJcblxyXG4gIC8vIGxydSBzdG9yYWdlLlxyXG4gIC8vIHRoZXNlIHRoaW5ncyBhcmVuJ3QgcGFydGljdWxhcmx5IGJpZywgYnV0IHdhbGtpbmcgZG93biB0aGUgc3RyaW5nXHJcbiAgLy8gYW5kIHR1cm5pbmcgaXQgaW50byBhIHJlZ2V4cCBjYW4gZ2V0IHByZXR0eSBjb3N0bHkuXHJcbiAgdmFyIGNhY2hlS2V5ID0gcGF0dGVybiArIFwiXFxuXCIgKyBzaWdtdW5kKG9wdGlvbnMpXHJcbiAgdmFyIGNhY2hlZCA9IG1pbmltYXRjaC5jYWNoZS5nZXQoY2FjaGVLZXkpXHJcbiAgaWYgKGNhY2hlZCkgcmV0dXJuIGNhY2hlZFxyXG4gIG1pbmltYXRjaC5jYWNoZS5zZXQoY2FjaGVLZXksIHRoaXMpXHJcblxyXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcclxuICB0aGlzLnNldCA9IFtdXHJcbiAgdGhpcy5wYXR0ZXJuID0gcGF0dGVyblxyXG4gIHRoaXMucmVnZXhwID0gbnVsbFxyXG4gIHRoaXMubmVnYXRlID0gZmFsc2VcclxuICB0aGlzLmNvbW1lbnQgPSBmYWxzZVxyXG4gIHRoaXMuZW1wdHkgPSBmYWxzZVxyXG5cclxuICAvLyBtYWtlIHRoZSBzZXQgb2YgcmVnZXhwcyBldGMuXHJcbiAgdGhpcy5tYWtlKClcclxufVxyXG5cclxuTWluaW1hdGNoLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKCkge31cclxuXHJcbk1pbmltYXRjaC5wcm90b3R5cGUubWFrZSA9IG1ha2VcclxuZnVuY3Rpb24gbWFrZSAoKSB7XHJcbiAgLy8gZG9uJ3QgZG8gaXQgbW9yZSB0aGFuIG9uY2UuXHJcbiAgaWYgKHRoaXMuX21hZGUpIHJldHVyblxyXG5cclxuICB2YXIgcGF0dGVybiA9IHRoaXMucGF0dGVyblxyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zXHJcblxyXG4gIC8vIGVtcHR5IHBhdHRlcm5zIGFuZCBjb21tZW50cyBtYXRjaCBub3RoaW5nLlxyXG4gIGlmICghb3B0aW9ucy5ub2NvbW1lbnQgJiYgcGF0dGVybi5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XHJcbiAgICB0aGlzLmNvbW1lbnQgPSB0cnVlXHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgaWYgKCFwYXR0ZXJuKSB7XHJcbiAgICB0aGlzLmVtcHR5ID0gdHJ1ZVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICAvLyBzdGVwIDE6IGZpZ3VyZSBvdXQgbmVnYXRpb24sIGV0Yy5cclxuICB0aGlzLnBhcnNlTmVnYXRlKClcclxuXHJcbiAgLy8gc3RlcCAyOiBleHBhbmQgYnJhY2VzXHJcbiAgdmFyIHNldCA9IHRoaXMuZ2xvYlNldCA9IHRoaXMuYnJhY2VFeHBhbmQoKVxyXG5cclxuICBpZiAob3B0aW9ucy5kZWJ1ZykgdGhpcy5kZWJ1ZyA9IGNvbnNvbGUuZXJyb3JcclxuXHJcbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sIHNldClcclxuXHJcbiAgLy8gc3RlcCAzOiBub3cgd2UgaGF2ZSBhIHNldCwgc28gdHVybiBlYWNoIG9uZSBpbnRvIGEgc2VyaWVzIG9mIHBhdGgtcG9ydGlvblxyXG4gIC8vIG1hdGNoaW5nIHBhdHRlcm5zLlxyXG4gIC8vIFRoZXNlIHdpbGwgYmUgcmVnZXhwcywgZXhjZXB0IGluIHRoZSBjYXNlIG9mIFwiKipcIiwgd2hpY2ggaXNcclxuICAvLyBzZXQgdG8gdGhlIEdMT0JTVEFSIG9iamVjdCBmb3IgZ2xvYnN0YXIgYmVoYXZpb3IsXHJcbiAgLy8gYW5kIHdpbGwgbm90IGNvbnRhaW4gYW55IC8gY2hhcmFjdGVyc1xyXG4gIHNldCA9IHRoaXMuZ2xvYlBhcnRzID0gc2V0Lm1hcChmdW5jdGlvbiAocykge1xyXG4gICAgcmV0dXJuIHMuc3BsaXQoc2xhc2hTcGxpdClcclxuICB9KVxyXG5cclxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgc2V0KVxyXG5cclxuICAvLyBnbG9iIC0tPiByZWdleHBzXHJcbiAgc2V0ID0gc2V0Lm1hcChmdW5jdGlvbiAocywgc2ksIHNldCkge1xyXG4gICAgcmV0dXJuIHMubWFwKHRoaXMucGFyc2UsIHRoaXMpXHJcbiAgfSwgdGhpcylcclxuXHJcbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sIHNldClcclxuXHJcbiAgLy8gZmlsdGVyIG91dCBldmVyeXRoaW5nIHRoYXQgZGlkbid0IGNvbXBpbGUgcHJvcGVybHkuXHJcbiAgc2V0ID0gc2V0LmZpbHRlcihmdW5jdGlvbiAocykge1xyXG4gICAgcmV0dXJuIC0xID09PSBzLmluZGV4T2YoZmFsc2UpXHJcbiAgfSlcclxuXHJcbiAgdGhpcy5kZWJ1Zyh0aGlzLnBhdHRlcm4sIHNldClcclxuXHJcbiAgdGhpcy5zZXQgPSBzZXRcclxufVxyXG5cclxuTWluaW1hdGNoLnByb3RvdHlwZS5wYXJzZU5lZ2F0ZSA9IHBhcnNlTmVnYXRlXHJcbmZ1bmN0aW9uIHBhcnNlTmVnYXRlICgpIHtcclxuICB2YXIgcGF0dGVybiA9IHRoaXMucGF0dGVyblxyXG4gICAgLCBuZWdhdGUgPSBmYWxzZVxyXG4gICAgLCBvcHRpb25zID0gdGhpcy5vcHRpb25zXHJcbiAgICAsIG5lZ2F0ZU9mZnNldCA9IDBcclxuXHJcbiAgaWYgKG9wdGlvbnMubm9uZWdhdGUpIHJldHVyblxyXG5cclxuICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBwYXR0ZXJuLmxlbmd0aFxyXG4gICAgICA7IGkgPCBsICYmIHBhdHRlcm4uY2hhckF0KGkpID09PSBcIiFcIlxyXG4gICAgICA7IGkgKyspIHtcclxuICAgIG5lZ2F0ZSA9ICFuZWdhdGVcclxuICAgIG5lZ2F0ZU9mZnNldCArK1xyXG4gIH1cclxuXHJcbiAgaWYgKG5lZ2F0ZU9mZnNldCkgdGhpcy5wYXR0ZXJuID0gcGF0dGVybi5zdWJzdHIobmVnYXRlT2Zmc2V0KVxyXG4gIHRoaXMubmVnYXRlID0gbmVnYXRlXHJcbn1cclxuXHJcbi8vIEJyYWNlIGV4cGFuc2lvbjpcclxuLy8gYXtiLGN9ZCAtPiBhYmQgYWNkXHJcbi8vIGF7Yix9YyAtPiBhYmMgYWNcclxuLy8gYXswLi4zfWQgLT4gYTBkIGExZCBhMmQgYTNkXHJcbi8vIGF7Yixje2QsZX1mfWcgLT4gYWJnIGFjZGZnIGFjZWZnXHJcbi8vIGF7YixjfWR7ZSxmfWcgLT4gYWJkZWcgYWNkZWcgYWJkZWcgYWJkZmdcclxuLy9cclxuLy8gSW52YWxpZCBzZXRzIGFyZSBub3QgZXhwYW5kZWQuXHJcbi8vIGF7Mi4ufWIgLT4gYXsyLi59YlxyXG4vLyBhe2J9YyAtPiBhe2J9Y1xyXG5taW5pbWF0Y2guYnJhY2VFeHBhbmQgPSBmdW5jdGlvbiAocGF0dGVybiwgb3B0aW9ucykge1xyXG4gIHJldHVybiBuZXcgTWluaW1hdGNoKHBhdHRlcm4sIG9wdGlvbnMpLmJyYWNlRXhwYW5kKClcclxufVxyXG5cclxuTWluaW1hdGNoLnByb3RvdHlwZS5icmFjZUV4cGFuZCA9IGJyYWNlRXhwYW5kXHJcbmZ1bmN0aW9uIGJyYWNlRXhwYW5kIChwYXR0ZXJuLCBvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zXHJcbiAgcGF0dGVybiA9IHR5cGVvZiBwYXR0ZXJuID09PSBcInVuZGVmaW5lZFwiXHJcbiAgICA/IHRoaXMucGF0dGVybiA6IHBhdHRlcm5cclxuXHJcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmRlZmluZWQgcGF0dGVyblwiKVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMubm9icmFjZSB8fFxyXG4gICAgICAhcGF0dGVybi5tYXRjaCgvXFx7LipcXH0vKSkge1xyXG4gICAgLy8gc2hvcnRjdXQuIG5vIG5lZWQgdG8gZXhwYW5kLlxyXG4gICAgcmV0dXJuIFtwYXR0ZXJuXVxyXG4gIH1cclxuXHJcbiAgdmFyIGVzY2FwaW5nID0gZmFsc2VcclxuXHJcbiAgLy8gZXhhbXBsZXMgYW5kIGNvbW1lbnRzIHJlZmVyIHRvIHRoaXMgY3JhenkgcGF0dGVybjpcclxuICAvLyBhe2IsY3tkLGV9LHtmLGd9aH14e3ksen1cclxuICAvLyBleHBlY3RlZDpcclxuICAvLyBhYnh5XHJcbiAgLy8gYWJ4elxyXG4gIC8vIGFjZHh5XHJcbiAgLy8gYWNkeHpcclxuICAvLyBhY2V4eVxyXG4gIC8vIGFjZXh6XHJcbiAgLy8gYWZoeHlcclxuICAvLyBhZmh4elxyXG4gIC8vIGFnaHh5XHJcbiAgLy8gYWdoeHpcclxuXHJcbiAgLy8gZXZlcnl0aGluZyBiZWZvcmUgdGhlIGZpcnN0IFxceyBpcyBqdXN0IGEgcHJlZml4LlxyXG4gIC8vIFNvLCB3ZSBwbHVjayB0aGF0IG9mZiwgYW5kIHdvcmsgd2l0aCB0aGUgcmVzdCxcclxuICAvLyBhbmQgdGhlbiBwcmVwZW5kIGl0IHRvIGV2ZXJ5dGhpbmcgd2UgZmluZC5cclxuICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09IFwie1wiKSB7XHJcbiAgICB0aGlzLmRlYnVnKHBhdHRlcm4pXHJcbiAgICB2YXIgcHJlZml4ID0gbnVsbFxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXR0ZXJuLmxlbmd0aDsgaSA8IGw7IGkgKyspIHtcclxuICAgICAgdmFyIGMgPSBwYXR0ZXJuLmNoYXJBdChpKVxyXG4gICAgICB0aGlzLmRlYnVnKGksIGMpXHJcbiAgICAgIGlmIChjID09PSBcIlxcXFxcIikge1xyXG4gICAgICAgIGVzY2FwaW5nID0gIWVzY2FwaW5nXHJcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJ7XCIgJiYgIWVzY2FwaW5nKSB7XHJcbiAgICAgICAgcHJlZml4ID0gcGF0dGVybi5zdWJzdHIoMCwgaSlcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWN0dWFsbHkgbm8gc2V0cywgYWxsIHsgd2VyZSBlc2NhcGVkLlxyXG4gICAgaWYgKHByZWZpeCA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRlYnVnKFwibm8gc2V0c1wiKVxyXG4gICAgICByZXR1cm4gW3BhdHRlcm5dXHJcbiAgICB9XHJcblxyXG4gICB2YXIgdGFpbCA9IGJyYWNlRXhwYW5kLmNhbGwodGhpcywgcGF0dGVybi5zdWJzdHIoaSksIG9wdGlvbnMpXHJcbiAgICByZXR1cm4gdGFpbC5tYXAoZnVuY3Rpb24gKHQpIHtcclxuICAgICAgcmV0dXJuIHByZWZpeCArIHRcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvLyBub3cgd2UgaGF2ZSBzb21ldGhpbmcgbGlrZTpcclxuICAvLyB7Yixje2QsZX0se2YsZ31ofXh7eSx6fVxyXG4gIC8vIHdhbGsgdGhyb3VnaCB0aGUgc2V0LCBleHBhbmRpbmcgZWFjaCBwYXJ0LCB1bnRpbFxyXG4gIC8vIHRoZSBzZXQgZW5kcy4gIHRoZW4sIHdlJ2xsIGV4cGFuZCB0aGUgc3VmZml4LlxyXG4gIC8vIElmIHRoZSBzZXQgb25seSBoYXMgYSBzaW5nbGUgbWVtYmVyLCB0aGVuJ2xsIHB1dCB0aGUge30gYmFja1xyXG5cclxuICAvLyBmaXJzdCwgaGFuZGxlIG51bWVyaWMgc2V0cywgc2luY2UgdGhleSdyZSBlYXNpZXJcclxuICB2YXIgbnVtc2V0ID0gcGF0dGVybi5tYXRjaCgvXlxceygtP1swLTldKylcXC5cXC4oLT9bMC05XSspXFx9LylcclxuICBpZiAobnVtc2V0KSB7XHJcbiAgICB0aGlzLmRlYnVnKFwibnVtc2V0XCIsIG51bXNldFsxXSwgbnVtc2V0WzJdKVxyXG4gICAgdmFyIHN1ZiA9IGJyYWNlRXhwYW5kLmNhbGwodGhpcywgcGF0dGVybi5zdWJzdHIobnVtc2V0WzBdLmxlbmd0aCksIG9wdGlvbnMpXHJcbiAgICAgICwgc3RhcnQgPSArbnVtc2V0WzFdXHJcbiAgICAgICwgZW5kID0gK251bXNldFsyXVxyXG4gICAgICAsIGluYyA9IHN0YXJ0ID4gZW5kID8gLTEgOiAxXHJcbiAgICAgICwgc2V0ID0gW11cclxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSAhPSAoZW5kICsgaW5jKTsgaSArPSBpbmMpIHtcclxuICAgICAgLy8gYXBwZW5kIGFsbCB0aGUgc3VmZml4ZXNcclxuICAgICAgZm9yICh2YXIgaWkgPSAwLCBsbCA9IHN1Zi5sZW5ndGg7IGlpIDwgbGw7IGlpICsrKSB7XHJcbiAgICAgICAgc2V0LnB1c2goaSArIHN1ZltpaV0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzZXRcclxuICB9XHJcblxyXG4gIC8vIG9rLCB3YWxrIHRocm91Z2ggdGhlIHNldFxyXG4gIC8vIFdlIGhvcGUsIHNvbWV3aGF0IG9wdGltaXN0aWNhbGx5LCB0aGF0IHRoZXJlXHJcbiAgLy8gd2lsbCBiZSBhIH0gYXQgdGhlIGVuZC5cclxuICAvLyBJZiB0aGUgY2xvc2luZyBicmFjZSBpc24ndCBmb3VuZCwgdGhlbiB0aGUgcGF0dGVybiBpc1xyXG4gIC8vIGludGVycHJldGVkIGFzIGJyYWNlRXhwYW5kKFwiXFxcXFwiICsgcGF0dGVybikgc28gdGhhdFxyXG4gIC8vIHRoZSBsZWFkaW5nIFxceyB3aWxsIGJlIGludGVycHJldGVkIGxpdGVyYWxseS5cclxuICB2YXIgaSA9IDEgLy8gc2tpcCB0aGUgXFx7XHJcbiAgICAsIGRlcHRoID0gMVxyXG4gICAgLCBzZXQgPSBbXVxyXG4gICAgLCBtZW1iZXIgPSBcIlwiXHJcbiAgICAsIHNhd0VuZCA9IGZhbHNlXHJcbiAgICAsIGVzY2FwaW5nID0gZmFsc2VcclxuXHJcbiAgZnVuY3Rpb24gYWRkTWVtYmVyICgpIHtcclxuICAgIHNldC5wdXNoKG1lbWJlcilcclxuICAgIG1lbWJlciA9IFwiXCJcclxuICB9XHJcblxyXG4gIHRoaXMuZGVidWcoXCJFbnRlcmluZyBmb3JcIilcclxuICBGT1I6IGZvciAoaSA9IDEsIGwgPSBwYXR0ZXJuLmxlbmd0aDsgaSA8IGw7IGkgKyspIHtcclxuICAgIHZhciBjID0gcGF0dGVybi5jaGFyQXQoaSlcclxuICAgIHRoaXMuZGVidWcoXCJcIiwgaSwgYylcclxuXHJcbiAgICBpZiAoZXNjYXBpbmcpIHtcclxuICAgICAgZXNjYXBpbmcgPSBmYWxzZVxyXG4gICAgICBtZW1iZXIgKz0gXCJcXFxcXCIgKyBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICBjYXNlIFwiXFxcXFwiOlxyXG4gICAgICAgICAgZXNjYXBpbmcgPSB0cnVlXHJcbiAgICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgICBjYXNlIFwie1wiOlxyXG4gICAgICAgICAgZGVwdGggKytcclxuICAgICAgICAgIG1lbWJlciArPSBcIntcIlxyXG4gICAgICAgICAgY29udGludWVcclxuXHJcbiAgICAgICAgY2FzZSBcIn1cIjpcclxuICAgICAgICAgIGRlcHRoIC0tXHJcbiAgICAgICAgICAvLyBpZiB0aGlzIGNsb3NlcyB0aGUgYWN0dWFsIHNldCwgdGhlbiB3ZSdyZSBkb25lXHJcbiAgICAgICAgICBpZiAoZGVwdGggPT09IDApIHtcclxuICAgICAgICAgICAgYWRkTWVtYmVyKClcclxuICAgICAgICAgICAgLy8gcGx1Y2sgb2ZmIHRoZSBjbG9zZS1icmFjZVxyXG4gICAgICAgICAgICBpICsrXHJcbiAgICAgICAgICAgIGJyZWFrIEZPUlxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWVtYmVyICs9IGNcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FzZSBcIixcIjpcclxuICAgICAgICAgIGlmIChkZXB0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBhZGRNZW1iZXIoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWVtYmVyICs9IGNcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRpbnVlXHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBtZW1iZXIgKz0gY1xyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgfSAvLyBzd2l0Y2hcclxuICAgIH0gLy8gZWxzZVxyXG4gIH0gLy8gZm9yXHJcblxyXG4gIC8vIG5vdyB3ZSd2ZSBlaXRoZXIgZmluaXNoZWQgdGhlIHNldCwgYW5kIHRoZSBzdWZmaXggaXNcclxuICAvLyBwYXR0ZXJuLnN1YnN0cihpKSwgb3Igd2UgaGF2ZSAqbm90KiBjbG9zZWQgdGhlIHNldCxcclxuICAvLyBhbmQgbmVlZCB0byBlc2NhcGUgdGhlIGxlYWRpbmcgYnJhY2VcclxuICBpZiAoZGVwdGggIT09IDApIHtcclxuICAgIHRoaXMuZGVidWcoXCJkaWRuJ3QgY2xvc2VcIiwgcGF0dGVybilcclxuICAgIHJldHVybiBicmFjZUV4cGFuZC5jYWxsKHRoaXMsIFwiXFxcXFwiICsgcGF0dGVybiwgb3B0aW9ucylcclxuICB9XHJcblxyXG4gIC8vIHh7eSx6fSAtPiBbXCJ4eVwiLCBcInh6XCJdXHJcbiAgdGhpcy5kZWJ1ZyhcInNldFwiLCBzZXQpXHJcbiAgdGhpcy5kZWJ1ZyhcInN1ZmZpeFwiLCBwYXR0ZXJuLnN1YnN0cihpKSlcclxuICB2YXIgc3VmID0gYnJhY2VFeHBhbmQuY2FsbCh0aGlzLCBwYXR0ZXJuLnN1YnN0cihpKSwgb3B0aW9ucylcclxuICAvLyBbXCJiXCIsIFwiY3tkLGV9XCIsXCJ7ZixnfWhcIl0gLT5cclxuICAvLyAgIFtbXCJiXCJdLCBbXCJjZFwiLCBcImNlXCJdLCBbXCJmaFwiLCBcImdoXCJdXVxyXG4gIHZhciBhZGRCcmFjZXMgPSBzZXQubGVuZ3RoID09PSAxXHJcbiAgdGhpcy5kZWJ1ZyhcInNldCBwcmUtZXhwYW5kZWRcIiwgc2V0KVxyXG4gIHNldCA9IHNldC5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgIHJldHVybiBicmFjZUV4cGFuZC5jYWxsKHRoaXMsIHAsIG9wdGlvbnMpXHJcbiAgfSwgdGhpcylcclxuICB0aGlzLmRlYnVnKFwic2V0IGV4cGFuZGVkXCIsIHNldClcclxuXHJcblxyXG4gIC8vIFtbXCJiXCJdLCBbXCJjZFwiLCBcImNlXCJdLCBbXCJmaFwiLCBcImdoXCJdXSAtPlxyXG4gIC8vICAgW1wiYlwiLCBcImNkXCIsIFwiY2VcIiwgXCJmaFwiLCBcImdoXCJdXHJcbiAgc2V0ID0gc2V0LnJlZHVjZShmdW5jdGlvbiAobCwgcikge1xyXG4gICAgcmV0dXJuIGwuY29uY2F0KHIpXHJcbiAgfSlcclxuXHJcbiAgaWYgKGFkZEJyYWNlcykge1xyXG4gICAgc2V0ID0gc2V0Lm1hcChmdW5jdGlvbiAocykge1xyXG4gICAgICByZXR1cm4gXCJ7XCIgKyBzICsgXCJ9XCJcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvLyBub3cgYXR0YWNoIHRoZSBzdWZmaXhlcy5cclxuICB2YXIgcmV0ID0gW11cclxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNldC5sZW5ndGg7IGkgPCBsOyBpICsrKSB7XHJcbiAgICBmb3IgKHZhciBpaSA9IDAsIGxsID0gc3VmLmxlbmd0aDsgaWkgPCBsbDsgaWkgKyspIHtcclxuICAgICAgcmV0LnB1c2goc2V0W2ldICsgc3VmW2lpXSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4vLyBwYXJzZSBhIGNvbXBvbmVudCBvZiB0aGUgZXhwYW5kZWQgc2V0LlxyXG4vLyBBdCB0aGlzIHBvaW50LCBubyBwYXR0ZXJuIG1heSBjb250YWluIFwiL1wiIGluIGl0XHJcbi8vIHNvIHdlJ3JlIGdvaW5nIHRvIHJldHVybiBhIDJkIGFycmF5LCB3aGVyZSBlYWNoIGVudHJ5IGlzIHRoZSBmdWxsXHJcbi8vIHBhdHRlcm4sIHNwbGl0IG9uICcvJywgYW5kIHRoZW4gdHVybmVkIGludG8gYSByZWd1bGFyIGV4cHJlc3Npb24uXHJcbi8vIEEgcmVnZXhwIGlzIG1hZGUgYXQgdGhlIGVuZCB3aGljaCBqb2lucyBlYWNoIGFycmF5IHdpdGggYW5cclxuLy8gZXNjYXBlZCAvLCBhbmQgYW5vdGhlciBmdWxsIG9uZSB3aGljaCBqb2lucyBlYWNoIHJlZ2V4cCB3aXRoIHwuXHJcbi8vXHJcbi8vIEZvbGxvd2luZyB0aGUgbGVhZCBvZiBCYXNoIDQuMSwgbm90ZSB0aGF0IFwiKipcIiBvbmx5IGhhcyBzcGVjaWFsIG1lYW5pbmdcclxuLy8gd2hlbiBpdCBpcyB0aGUgKm9ubHkqIHRoaW5nIGluIGEgcGF0aCBwb3J0aW9uLiAgT3RoZXJ3aXNlLCBhbnkgc2VyaWVzXHJcbi8vIG9mICogaXMgZXF1aXZhbGVudCB0byBhIHNpbmdsZSAqLiAgR2xvYnN0YXIgYmVoYXZpb3IgaXMgZW5hYmxlZCBieVxyXG4vLyBkZWZhdWx0LCBhbmQgY2FuIGJlIGRpc2FibGVkIGJ5IHNldHRpbmcgb3B0aW9ucy5ub2dsb2JzdGFyLlxyXG5NaW5pbWF0Y2gucHJvdG90eXBlLnBhcnNlID0gcGFyc2VcclxudmFyIFNVQlBBUlNFID0ge31cclxuZnVuY3Rpb24gcGFyc2UgKHBhdHRlcm4sIGlzU3ViKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcclxuXHJcbiAgLy8gc2hvcnRjdXRzXHJcbiAgaWYgKCFvcHRpb25zLm5vZ2xvYnN0YXIgJiYgcGF0dGVybiA9PT0gXCIqKlwiKSByZXR1cm4gR0xPQlNUQVJcclxuICBpZiAocGF0dGVybiA9PT0gXCJcIikgcmV0dXJuIFwiXCJcclxuXHJcbiAgdmFyIHJlID0gXCJcIlxyXG4gICAgLCBoYXNNYWdpYyA9ICEhb3B0aW9ucy5ub2Nhc2VcclxuICAgICwgZXNjYXBpbmcgPSBmYWxzZVxyXG4gICAgLy8gPyA9PiBvbmUgc2luZ2xlIGNoYXJhY3RlclxyXG4gICAgLCBwYXR0ZXJuTGlzdFN0YWNrID0gW11cclxuICAgICwgcGxUeXBlXHJcbiAgICAsIHN0YXRlQ2hhclxyXG4gICAgLCBpbkNsYXNzID0gZmFsc2VcclxuICAgICwgcmVDbGFzc1N0YXJ0ID0gLTFcclxuICAgICwgY2xhc3NTdGFydCA9IC0xXHJcbiAgICAvLyAuIGFuZCAuLiBuZXZlciBtYXRjaCBhbnl0aGluZyB0aGF0IGRvZXNuJ3Qgc3RhcnQgd2l0aCAuLFxyXG4gICAgLy8gZXZlbiB3aGVuIG9wdGlvbnMuZG90IGlzIHNldC5cclxuICAgICwgcGF0dGVyblN0YXJ0ID0gcGF0dGVybi5jaGFyQXQoMCkgPT09IFwiLlwiID8gXCJcIiAvLyBhbnl0aGluZ1xyXG4gICAgICAvLyBub3QgKHN0YXJ0IG9yIC8gZm9sbG93ZWQgYnkgLiBvciAuLiBmb2xsb3dlZCBieSAvIG9yIGVuZClcclxuICAgICAgOiBvcHRpb25zLmRvdCA/IFwiKD8hKD86XnxcXFxcXFwvKVxcXFwuezEsMn0oPzokfFxcXFxcXC8pKVwiXHJcbiAgICAgIDogXCIoPyFcXFxcLilcIlxyXG4gICAgLCBzZWxmID0gdGhpc1xyXG5cclxuICBmdW5jdGlvbiBjbGVhclN0YXRlQ2hhciAoKSB7XHJcbiAgICBpZiAoc3RhdGVDaGFyKSB7XHJcbiAgICAgIC8vIHdlIGhhZCBzb21lIHN0YXRlLXRyYWNraW5nIGNoYXJhY3RlclxyXG4gICAgICAvLyB0aGF0IHdhc24ndCBjb25zdW1lZCBieSB0aGlzIHBhc3MuXHJcbiAgICAgIHN3aXRjaCAoc3RhdGVDaGFyKSB7XHJcbiAgICAgICAgY2FzZSBcIipcIjpcclxuICAgICAgICAgIHJlICs9IHN0YXJcclxuICAgICAgICAgIGhhc01hZ2ljID0gdHJ1ZVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIFwiP1wiOlxyXG4gICAgICAgICAgcmUgKz0gcW1hcmtcclxuICAgICAgICAgIGhhc01hZ2ljID0gdHJ1ZVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcmUgKz0gXCJcXFxcXCIrc3RhdGVDaGFyXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGYuZGVidWcoJ2NsZWFyU3RhdGVDaGFyICVqICVqJywgc3RhdGVDaGFyLCByZSlcclxuICAgICAgc3RhdGVDaGFyID0gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAoIHZhciBpID0gMCwgbGVuID0gcGF0dGVybi5sZW5ndGgsIGNcclxuICAgICAgOyAoaSA8IGxlbikgJiYgKGMgPSBwYXR0ZXJuLmNoYXJBdChpKSlcclxuICAgICAgOyBpICsrICkge1xyXG5cclxuICAgIHRoaXMuZGVidWcoXCIlc1xcdCVzICVzICVqXCIsIHBhdHRlcm4sIGksIHJlLCBjKVxyXG5cclxuICAgIC8vIHNraXAgb3ZlciBhbnkgdGhhdCBhcmUgZXNjYXBlZC5cclxuICAgIGlmIChlc2NhcGluZyAmJiByZVNwZWNpYWxzW2NdKSB7XHJcbiAgICAgIHJlICs9IFwiXFxcXFwiICsgY1xyXG4gICAgICBlc2NhcGluZyA9IGZhbHNlXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgU1dJVENIOiBzd2l0Y2ggKGMpIHtcclxuICAgICAgY2FzZSBcIi9cIjpcclxuICAgICAgICAvLyBjb21wbGV0ZWx5IG5vdCBhbGxvd2VkLCBldmVuIGVzY2FwZWQuXHJcbiAgICAgICAgLy8gU2hvdWxkIGFscmVhZHkgYmUgcGF0aC1zcGxpdCBieSBub3cuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICBjYXNlIFwiXFxcXFwiOlxyXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcclxuICAgICAgICBlc2NhcGluZyA9IHRydWVcclxuICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgLy8gdGhlIHZhcmlvdXMgc3RhdGVDaGFyIHZhbHVlc1xyXG4gICAgICAvLyBmb3IgdGhlIFwiZXh0Z2xvYlwiIHN0dWZmLlxyXG4gICAgICBjYXNlIFwiP1wiOlxyXG4gICAgICBjYXNlIFwiKlwiOlxyXG4gICAgICBjYXNlIFwiK1wiOlxyXG4gICAgICBjYXNlIFwiQFwiOlxyXG4gICAgICBjYXNlIFwiIVwiOlxyXG4gICAgICAgIHRoaXMuZGVidWcoXCIlc1xcdCVzICVzICVqIDwtLSBzdGF0ZUNoYXJcIiwgcGF0dGVybiwgaSwgcmUsIGMpXHJcblxyXG4gICAgICAgIC8vIGFsbCBvZiB0aG9zZSBhcmUgbGl0ZXJhbHMgaW5zaWRlIGEgY2xhc3MsIGV4Y2VwdCB0aGF0XHJcbiAgICAgICAgLy8gdGhlIGdsb2IgWyFhXSBtZWFucyBbXmFdIGluIHJlZ2V4cFxyXG4gICAgICAgIGlmIChpbkNsYXNzKSB7XHJcbiAgICAgICAgICB0aGlzLmRlYnVnKCcgIGluIGNsYXNzJylcclxuICAgICAgICAgIGlmIChjID09PSBcIiFcIiAmJiBpID09PSBjbGFzc1N0YXJ0ICsgMSkgYyA9IFwiXlwiXHJcbiAgICAgICAgICByZSArPSBjXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgd2UgYWxyZWFkeSBoYXZlIGEgc3RhdGVDaGFyLCB0aGVuIGl0IG1lYW5zXHJcbiAgICAgICAgLy8gdGhhdCB0aGVyZSB3YXMgc29tZXRoaW5nIGxpa2UgKiogb3IgKz8gaW4gdGhlcmUuXHJcbiAgICAgICAgLy8gSGFuZGxlIHRoZSBzdGF0ZUNoYXIsIHRoZW4gcHJvY2VlZCB3aXRoIHRoaXMgb25lLlxyXG4gICAgICAgIHNlbGYuZGVidWcoJ2NhbGwgY2xlYXJTdGF0ZUNoYXIgJWonLCBzdGF0ZUNoYXIpXHJcbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxyXG4gICAgICAgIHN0YXRlQ2hhciA9IGNcclxuICAgICAgICAvLyBpZiBleHRnbG9iIGlzIGRpc2FibGVkLCB0aGVuICsoYXNkZnxmb28pIGlzbid0IGEgdGhpbmcuXHJcbiAgICAgICAgLy8ganVzdCBjbGVhciB0aGUgc3RhdGVjaGFyICpub3cqLCByYXRoZXIgdGhhbiBldmVuIGRpdmluZyBpbnRvXHJcbiAgICAgICAgLy8gdGhlIHBhdHRlcm5MaXN0IHN0dWZmLlxyXG4gICAgICAgIGlmIChvcHRpb25zLm5vZXh0KSBjbGVhclN0YXRlQ2hhcigpXHJcbiAgICAgICAgY29udGludWVcclxuXHJcbiAgICAgIGNhc2UgXCIoXCI6XHJcbiAgICAgICAgaWYgKGluQ2xhc3MpIHtcclxuICAgICAgICAgIHJlICs9IFwiKFwiXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZUNoYXIpIHtcclxuICAgICAgICAgIHJlICs9IFwiXFxcXChcIlxyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBsVHlwZSA9IHN0YXRlQ2hhclxyXG4gICAgICAgIHBhdHRlcm5MaXN0U3RhY2sucHVzaCh7IHR5cGU6IHBsVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIHN0YXJ0OiBpIC0gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIHJlU3RhcnQ6IHJlLmxlbmd0aCB9KVxyXG4gICAgICAgIC8vIG5lZ2F0aW9uIGlzICg/Oig/IWpzKVteL10qKVxyXG4gICAgICAgIHJlICs9IHN0YXRlQ2hhciA9PT0gXCIhXCIgPyBcIig/Oig/IVwiIDogXCIoPzpcIlxyXG4gICAgICAgIHRoaXMuZGVidWcoJ3BsVHlwZSAlaiAlaicsIHN0YXRlQ2hhciwgcmUpXHJcbiAgICAgICAgc3RhdGVDaGFyID0gZmFsc2VcclxuICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgY2FzZSBcIilcIjpcclxuICAgICAgICBpZiAoaW5DbGFzcyB8fCAhcGF0dGVybkxpc3RTdGFjay5sZW5ndGgpIHtcclxuICAgICAgICAgIHJlICs9IFwiXFxcXClcIlxyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcclxuICAgICAgICBoYXNNYWdpYyA9IHRydWVcclxuICAgICAgICByZSArPSBcIilcIlxyXG4gICAgICAgIHBsVHlwZSA9IHBhdHRlcm5MaXN0U3RhY2sucG9wKCkudHlwZVxyXG4gICAgICAgIC8vIG5lZ2F0aW9uIGlzICg/Oig/IWpzKVteL10qKVxyXG4gICAgICAgIC8vIFRoZSBvdGhlcnMgYXJlICg/OjxwYXR0ZXJuPik8dHlwZT5cclxuICAgICAgICBzd2l0Y2ggKHBsVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSBcIiFcIjpcclxuICAgICAgICAgICAgcmUgKz0gXCJbXi9dKj8pXCJcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgXCI/XCI6XHJcbiAgICAgICAgICBjYXNlIFwiK1wiOlxyXG4gICAgICAgICAgY2FzZSBcIipcIjogcmUgKz0gcGxUeXBlXHJcbiAgICAgICAgICBjYXNlIFwiQFwiOiBicmVhayAvLyB0aGUgZGVmYXVsdCBhbnl3YXlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGludWVcclxuXHJcbiAgICAgIGNhc2UgXCJ8XCI6XHJcbiAgICAgICAgaWYgKGluQ2xhc3MgfHwgIXBhdHRlcm5MaXN0U3RhY2subGVuZ3RoIHx8IGVzY2FwaW5nKSB7XHJcbiAgICAgICAgICByZSArPSBcIlxcXFx8XCJcclxuICAgICAgICAgIGVzY2FwaW5nID0gZmFsc2VcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGVhclN0YXRlQ2hhcigpXHJcbiAgICAgICAgcmUgKz0gXCJ8XCJcclxuICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgLy8gdGhlc2UgYXJlIG1vc3RseSB0aGUgc2FtZSBpbiByZWdleHAgYW5kIGdsb2JcclxuICAgICAgY2FzZSBcIltcIjpcclxuICAgICAgICAvLyBzd2FsbG93IGFueSBzdGF0ZS10cmFja2luZyBjaGFyIGJlZm9yZSB0aGUgW1xyXG4gICAgICAgIGNsZWFyU3RhdGVDaGFyKClcclxuXHJcbiAgICAgICAgaWYgKGluQ2xhc3MpIHtcclxuICAgICAgICAgIHJlICs9IFwiXFxcXFwiICsgY1xyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluQ2xhc3MgPSB0cnVlXHJcbiAgICAgICAgY2xhc3NTdGFydCA9IGlcclxuICAgICAgICByZUNsYXNzU3RhcnQgPSByZS5sZW5ndGhcclxuICAgICAgICByZSArPSBjXHJcbiAgICAgICAgY29udGludWVcclxuXHJcbiAgICAgIGNhc2UgXCJdXCI6XHJcbiAgICAgICAgLy8gIGEgcmlnaHQgYnJhY2tldCBzaGFsbCBsb3NlIGl0cyBzcGVjaWFsXHJcbiAgICAgICAgLy8gIG1lYW5pbmcgYW5kIHJlcHJlc2VudCBpdHNlbGYgaW5cclxuICAgICAgICAvLyAgYSBicmFja2V0IGV4cHJlc3Npb24gaWYgaXQgb2NjdXJzXHJcbiAgICAgICAgLy8gIGZpcnN0IGluIHRoZSBsaXN0LiAgLS0gUE9TSVguMiAyLjguMy4yXHJcbiAgICAgICAgaWYgKGkgPT09IGNsYXNzU3RhcnQgKyAxIHx8ICFpbkNsYXNzKSB7XHJcbiAgICAgICAgICByZSArPSBcIlxcXFxcIiArIGNcclxuICAgICAgICAgIGVzY2FwaW5nID0gZmFsc2VcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaW5pc2ggdXAgdGhlIGNsYXNzLlxyXG4gICAgICAgIGhhc01hZ2ljID0gdHJ1ZVxyXG4gICAgICAgIGluQ2xhc3MgPSBmYWxzZVxyXG4gICAgICAgIHJlICs9IGNcclxuICAgICAgICBjb250aW51ZVxyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvLyBzd2FsbG93IGFueSBzdGF0ZSBjaGFyIHRoYXQgd2Fzbid0IGNvbnN1bWVkXHJcbiAgICAgICAgY2xlYXJTdGF0ZUNoYXIoKVxyXG5cclxuICAgICAgICBpZiAoZXNjYXBpbmcpIHtcclxuICAgICAgICAgIC8vIG5vIG5lZWRcclxuICAgICAgICAgIGVzY2FwaW5nID0gZmFsc2VcclxuICAgICAgICB9IGVsc2UgaWYgKHJlU3BlY2lhbHNbY11cclxuICAgICAgICAgICAgICAgICAgICYmICEoYyA9PT0gXCJeXCIgJiYgaW5DbGFzcykpIHtcclxuICAgICAgICAgIHJlICs9IFwiXFxcXFwiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZSArPSBjXHJcblxyXG4gICAgfSAvLyBzd2l0Y2hcclxuICB9IC8vIGZvclxyXG5cclxuXHJcbiAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGxlZnQgYSBjbGFzcyBvcGVuLlxyXG4gIC8vIFwiW2FiY1wiIGlzIHZhbGlkLCBlcXVpdmFsZW50IHRvIFwiXFxbYWJjXCJcclxuICBpZiAoaW5DbGFzcykge1xyXG4gICAgLy8gc3BsaXQgd2hlcmUgdGhlIGxhc3QgWyB3YXMsIGFuZCBlc2NhcGUgaXRcclxuICAgIC8vIHRoaXMgaXMgYSBodWdlIHBpdGEuICBXZSBub3cgaGF2ZSB0byByZS13YWxrXHJcbiAgICAvLyB0aGUgY29udGVudHMgb2YgdGhlIHdvdWxkLWJlIGNsYXNzIHRvIHJlLXRyYW5zbGF0ZVxyXG4gICAgLy8gYW55IGNoYXJhY3RlcnMgdGhhdCB3ZXJlIHBhc3NlZCB0aHJvdWdoIGFzLWlzXHJcbiAgICB2YXIgY3MgPSBwYXR0ZXJuLnN1YnN0cihjbGFzc1N0YXJ0ICsgMSlcclxuICAgICAgLCBzcCA9IHRoaXMucGFyc2UoY3MsIFNVQlBBUlNFKVxyXG4gICAgcmUgPSByZS5zdWJzdHIoMCwgcmVDbGFzc1N0YXJ0KSArIFwiXFxcXFtcIiArIHNwWzBdXHJcbiAgICBoYXNNYWdpYyA9IGhhc01hZ2ljIHx8IHNwWzFdXHJcbiAgfVxyXG5cclxuICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgaGFkIGEgKyggdGhpbmcgYXQgdGhlICplbmQqXHJcbiAgLy8gb2YgdGhlIHBhdHRlcm4uXHJcbiAgLy8gZWFjaCBwYXR0ZXJuIGxpc3Qgc3RhY2sgYWRkcyAzIGNoYXJzLCBhbmQgd2UgbmVlZCB0byBnbyB0aHJvdWdoXHJcbiAgLy8gYW5kIGVzY2FwZSBhbnkgfCBjaGFycyB0aGF0IHdlcmUgcGFzc2VkIHRocm91Z2ggYXMtaXMgZm9yIHRoZSByZWdleHAuXHJcbiAgLy8gR28gdGhyb3VnaCBhbmQgZXNjYXBlIHRoZW0sIHRha2luZyBjYXJlIG5vdCB0byBkb3VibGUtZXNjYXBlIGFueVxyXG4gIC8vIHwgY2hhcnMgdGhhdCB3ZXJlIGFscmVhZHkgZXNjYXBlZC5cclxuICB2YXIgcGxcclxuICB3aGlsZSAocGwgPSBwYXR0ZXJuTGlzdFN0YWNrLnBvcCgpKSB7XHJcbiAgICB2YXIgdGFpbCA9IHJlLnNsaWNlKHBsLnJlU3RhcnQgKyAzKVxyXG4gICAgLy8gbWF5YmUgc29tZSBldmVuIG51bWJlciBvZiBcXCwgdGhlbiBtYXliZSAxIFxcLCBmb2xsb3dlZCBieSBhIHxcclxuICAgIHRhaWwgPSB0YWlsLnJlcGxhY2UoLygoPzpcXFxcezJ9KSopKFxcXFw/KVxcfC9nLCBmdW5jdGlvbiAoXywgJDEsICQyKSB7XHJcbiAgICAgIGlmICghJDIpIHtcclxuICAgICAgICAvLyB0aGUgfCBpc24ndCBhbHJlYWR5IGVzY2FwZWQsIHNvIGVzY2FwZSBpdC5cclxuICAgICAgICAkMiA9IFwiXFxcXFwiXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG5lZWQgdG8gZXNjYXBlIGFsbCB0aG9zZSBzbGFzaGVzICphZ2FpbiosIHdpdGhvdXQgZXNjYXBpbmcgdGhlXHJcbiAgICAgIC8vIG9uZSB0aGF0IHdlIG5lZWQgZm9yIGVzY2FwaW5nIHRoZSB8IGNoYXJhY3Rlci4gIEFzIGl0IHdvcmtzIG91dCxcclxuICAgICAgLy8gZXNjYXBpbmcgYW4gZXZlbiBudW1iZXIgb2Ygc2xhc2hlcyBjYW4gYmUgZG9uZSBieSBzaW1wbHkgcmVwZWF0aW5nXHJcbiAgICAgIC8vIGl0IGV4YWN0bHkgYWZ0ZXIgaXRzZWxmLiAgVGhhdCdzIHdoeSB0aGlzIHRyaWNrIHdvcmtzLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBJIGFtIHNvcnJ5IHRoYXQgeW91IGhhdmUgdG8gc2VlIHRoaXMuXHJcbiAgICAgIHJldHVybiAkMSArICQxICsgJDIgKyBcInxcIlxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmRlYnVnKFwidGFpbD0lalxcbiAgICVzXCIsIHRhaWwsIHRhaWwpXHJcbiAgICB2YXIgdCA9IHBsLnR5cGUgPT09IFwiKlwiID8gc3RhclxyXG4gICAgICAgICAgOiBwbC50eXBlID09PSBcIj9cIiA/IHFtYXJrXHJcbiAgICAgICAgICA6IFwiXFxcXFwiICsgcGwudHlwZVxyXG5cclxuICAgIGhhc01hZ2ljID0gdHJ1ZVxyXG4gICAgcmUgPSByZS5zbGljZSgwLCBwbC5yZVN0YXJ0KVxyXG4gICAgICAgKyB0ICsgXCJcXFxcKFwiXHJcbiAgICAgICArIHRhaWxcclxuICB9XHJcblxyXG4gIC8vIGhhbmRsZSB0cmFpbGluZyB0aGluZ3MgdGhhdCBvbmx5IG1hdHRlciBhdCB0aGUgdmVyeSBlbmQuXHJcbiAgY2xlYXJTdGF0ZUNoYXIoKVxyXG4gIGlmIChlc2NhcGluZykge1xyXG4gICAgLy8gdHJhaWxpbmcgXFxcXFxyXG4gICAgcmUgKz0gXCJcXFxcXFxcXFwiXHJcbiAgfVxyXG5cclxuICAvLyBvbmx5IG5lZWQgdG8gYXBwbHkgdGhlIG5vZG90IHN0YXJ0IGlmIHRoZSByZSBzdGFydHMgd2l0aFxyXG4gIC8vIHNvbWV0aGluZyB0aGF0IGNvdWxkIGNvbmNlaXZhYmx5IGNhcHR1cmUgYSBkb3RcclxuICB2YXIgYWRkUGF0dGVyblN0YXJ0ID0gZmFsc2VcclxuICBzd2l0Y2ggKHJlLmNoYXJBdCgwKSkge1xyXG4gICAgY2FzZSBcIi5cIjpcclxuICAgIGNhc2UgXCJbXCI6XHJcbiAgICBjYXNlIFwiKFwiOiBhZGRQYXR0ZXJuU3RhcnQgPSB0cnVlXHJcbiAgfVxyXG5cclxuICAvLyBpZiB0aGUgcmUgaXMgbm90IFwiXCIgYXQgdGhpcyBwb2ludCwgdGhlbiB3ZSBuZWVkIHRvIG1ha2Ugc3VyZVxyXG4gIC8vIGl0IGRvZXNuJ3QgbWF0Y2ggYWdhaW5zdCBhbiBlbXB0eSBwYXRoIHBhcnQuXHJcbiAgLy8gT3RoZXJ3aXNlIGEvKiB3aWxsIG1hdGNoIGEvLCB3aGljaCBpdCBzaG91bGQgbm90LlxyXG4gIGlmIChyZSAhPT0gXCJcIiAmJiBoYXNNYWdpYykgcmUgPSBcIig/PS4pXCIgKyByZVxyXG5cclxuICBpZiAoYWRkUGF0dGVyblN0YXJ0KSByZSA9IHBhdHRlcm5TdGFydCArIHJlXHJcblxyXG4gIC8vIHBhcnNpbmcganVzdCBhIHBpZWNlIG9mIGEgbGFyZ2VyIHBhdHRlcm4uXHJcbiAgaWYgKGlzU3ViID09PSBTVUJQQVJTRSkge1xyXG4gICAgcmV0dXJuIFsgcmUsIGhhc01hZ2ljIF1cclxuICB9XHJcblxyXG4gIC8vIHNraXAgdGhlIHJlZ2V4cCBmb3Igbm9uLW1hZ2ljYWwgcGF0dGVybnNcclxuICAvLyB1bmVzY2FwZSBhbnl0aGluZyBpbiBpdCwgdGhvdWdoLCBzbyB0aGF0IGl0J2xsIGJlXHJcbiAgLy8gYW4gZXhhY3QgbWF0Y2ggYWdhaW5zdCBhIGZpbGUgZXRjLlxyXG4gIGlmICghaGFzTWFnaWMpIHtcclxuICAgIHJldHVybiBnbG9iVW5lc2NhcGUocGF0dGVybilcclxuICB9XHJcblxyXG4gIHZhciBmbGFncyA9IG9wdGlvbnMubm9jYXNlID8gXCJpXCIgOiBcIlwiXHJcbiAgICAsIHJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyByZSArIFwiJFwiLCBmbGFncylcclxuXHJcbiAgcmVnRXhwLl9nbG9iID0gcGF0dGVyblxyXG4gIHJlZ0V4cC5fc3JjID0gcmVcclxuXHJcbiAgcmV0dXJuIHJlZ0V4cFxyXG59XHJcblxyXG5taW5pbWF0Y2gubWFrZVJlID0gZnVuY3Rpb24gKHBhdHRlcm4sIG9wdGlvbnMpIHtcclxuICByZXR1cm4gbmV3IE1pbmltYXRjaChwYXR0ZXJuLCBvcHRpb25zIHx8IHt9KS5tYWtlUmUoKVxyXG59XHJcblxyXG5NaW5pbWF0Y2gucHJvdG90eXBlLm1ha2VSZSA9IG1ha2VSZVxyXG5mdW5jdGlvbiBtYWtlUmUgKCkge1xyXG4gIGlmICh0aGlzLnJlZ2V4cCB8fCB0aGlzLnJlZ2V4cCA9PT0gZmFsc2UpIHJldHVybiB0aGlzLnJlZ2V4cFxyXG5cclxuICAvLyBhdCB0aGlzIHBvaW50LCB0aGlzLnNldCBpcyBhIDJkIGFycmF5IG9mIHBhcnRpYWxcclxuICAvLyBwYXR0ZXJuIHN0cmluZ3MsIG9yIFwiKipcIi5cclxuICAvL1xyXG4gIC8vIEl0J3MgYmV0dGVyIHRvIHVzZSAubWF0Y2goKS4gIFRoaXMgZnVuY3Rpb24gc2hvdWxkbid0XHJcbiAgLy8gYmUgdXNlZCwgcmVhbGx5LCBidXQgaXQncyBwcmV0dHkgY29udmVuaWVudCBzb21ldGltZXMsXHJcbiAgLy8gd2hlbiB5b3UganVzdCB3YW50IHRvIHdvcmsgd2l0aCBhIHJlZ2V4LlxyXG4gIHZhciBzZXQgPSB0aGlzLnNldFxyXG5cclxuICBpZiAoIXNldC5sZW5ndGgpIHJldHVybiB0aGlzLnJlZ2V4cCA9IGZhbHNlXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcclxuXHJcbiAgdmFyIHR3b1N0YXIgPSBvcHRpb25zLm5vZ2xvYnN0YXIgPyBzdGFyXHJcbiAgICAgIDogb3B0aW9ucy5kb3QgPyB0d29TdGFyRG90XHJcbiAgICAgIDogdHdvU3Rhck5vRG90XHJcbiAgICAsIGZsYWdzID0gb3B0aW9ucy5ub2Nhc2UgPyBcImlcIiA6IFwiXCJcclxuXHJcbiAgdmFyIHJlID0gc2V0Lm1hcChmdW5jdGlvbiAocGF0dGVybikge1xyXG4gICAgcmV0dXJuIHBhdHRlcm4ubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgIHJldHVybiAocCA9PT0gR0xPQlNUQVIpID8gdHdvU3RhclxyXG4gICAgICAgICAgIDogKHR5cGVvZiBwID09PSBcInN0cmluZ1wiKSA/IHJlZ0V4cEVzY2FwZShwKVxyXG4gICAgICAgICAgIDogcC5fc3JjXHJcbiAgICB9KS5qb2luKFwiXFxcXFxcL1wiKVxyXG4gIH0pLmpvaW4oXCJ8XCIpXHJcblxyXG4gIC8vIG11c3QgbWF0Y2ggZW50aXJlIHBhdHRlcm5cclxuICAvLyBlbmRpbmcgaW4gYSAqIG9yICoqIHdpbGwgbWFrZSBpdCBsZXNzIHN0cmljdC5cclxuICByZSA9IFwiXig/OlwiICsgcmUgKyBcIikkXCJcclxuXHJcbiAgLy8gY2FuIG1hdGNoIGFueXRoaW5nLCBhcyBsb25nIGFzIGl0J3Mgbm90IHRoaXMuXHJcbiAgaWYgKHRoaXMubmVnYXRlKSByZSA9IFwiXig/IVwiICsgcmUgKyBcIikuKiRcIlxyXG5cclxuICB0cnkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVnZXhwID0gbmV3IFJlZ0V4cChyZSwgZmxhZ3MpXHJcbiAgfSBjYXRjaCAoZXgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlZ2V4cCA9IGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG5taW5pbWF0Y2gubWF0Y2ggPSBmdW5jdGlvbiAobGlzdCwgcGF0dGVybiwgb3B0aW9ucykge1xyXG4gIHZhciBtbSA9IG5ldyBNaW5pbWF0Y2gocGF0dGVybiwgb3B0aW9ucylcclxuICBsaXN0ID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKGYpIHtcclxuICAgIHJldHVybiBtbS5tYXRjaChmKVxyXG4gIH0pXHJcbiAgaWYgKG9wdGlvbnMubm9udWxsICYmICFsaXN0Lmxlbmd0aCkge1xyXG4gICAgbGlzdC5wdXNoKHBhdHRlcm4pXHJcbiAgfVxyXG4gIHJldHVybiBsaXN0XHJcbn1cclxuXHJcbk1pbmltYXRjaC5wcm90b3R5cGUubWF0Y2ggPSBtYXRjaFxyXG5mdW5jdGlvbiBtYXRjaCAoZiwgcGFydGlhbCkge1xyXG4gIHRoaXMuZGVidWcoXCJtYXRjaFwiLCBmLCB0aGlzLnBhdHRlcm4pXHJcbiAgLy8gc2hvcnQtY2lyY3VpdCBpbiB0aGUgY2FzZSBvZiBidXN0ZWQgdGhpbmdzLlxyXG4gIC8vIGNvbW1lbnRzLCBldGMuXHJcbiAgaWYgKHRoaXMuY29tbWVudCkgcmV0dXJuIGZhbHNlXHJcbiAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiBmID09PSBcIlwiXHJcblxyXG4gIGlmIChmID09PSBcIi9cIiAmJiBwYXJ0aWFsKSByZXR1cm4gdHJ1ZVxyXG5cclxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xyXG5cclxuICAvLyB3aW5kb3dzOiBuZWVkIHRvIHVzZSAvLCBub3QgXFxcclxuICAvLyBPbiBvdGhlciBwbGF0Zm9ybXMsIFxcIGlzIGEgdmFsaWQgKGFsYmVpdCBiYWQpIGZpbGVuYW1lIGNoYXIuXHJcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcclxuICAgIGYgPSBmLnNwbGl0KFwiXFxcXFwiKS5qb2luKFwiL1wiKVxyXG4gIH1cclxuXHJcbiAgLy8gdHJlYXQgdGhlIHRlc3QgcGF0aCBhcyBhIHNldCBvZiBwYXRocGFydHMuXHJcbiAgZiA9IGYuc3BsaXQoc2xhc2hTcGxpdClcclxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgXCJzcGxpdFwiLCBmKVxyXG5cclxuICAvLyBqdXN0IE9ORSBvZiB0aGUgcGF0dGVybiBzZXRzIGluIHRoaXMuc2V0IG5lZWRzIHRvIG1hdGNoXHJcbiAgLy8gaW4gb3JkZXIgZm9yIGl0IHRvIGJlIHZhbGlkLiAgSWYgbmVnYXRpbmcsIHRoZW4ganVzdCBvbmVcclxuICAvLyBtYXRjaCBtZWFucyB0aGF0IHdlIGhhdmUgZmFpbGVkLlxyXG4gIC8vIEVpdGhlciB3YXksIHJldHVybiBvbiB0aGUgZmlyc3QgaGl0LlxyXG5cclxuICB2YXIgc2V0ID0gdGhpcy5zZXRcclxuICB0aGlzLmRlYnVnKHRoaXMucGF0dGVybiwgXCJzZXRcIiwgc2V0KVxyXG5cclxuICB2YXIgc3BsaXRGaWxlID0gcGF0aC5iYXNlbmFtZShmLmpvaW4oXCIvXCIpKS5zcGxpdChcIi9cIilcclxuXHJcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzZXQubGVuZ3RoOyBpIDwgbDsgaSArKykge1xyXG4gICAgdmFyIHBhdHRlcm4gPSBzZXRbaV0sIGZpbGUgPSBmXHJcbiAgICBpZiAob3B0aW9ucy5tYXRjaEJhc2UgJiYgcGF0dGVybi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgZmlsZSA9IHNwbGl0RmlsZVxyXG4gICAgfVxyXG4gICAgdmFyIGhpdCA9IHRoaXMubWF0Y2hPbmUoZmlsZSwgcGF0dGVybiwgcGFydGlhbClcclxuICAgIGlmIChoaXQpIHtcclxuICAgICAgaWYgKG9wdGlvbnMuZmxpcE5lZ2F0ZSkgcmV0dXJuIHRydWVcclxuICAgICAgcmV0dXJuICF0aGlzLm5lZ2F0ZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZGlkbid0IGdldCBhbnkgaGl0cy4gIHRoaXMgaXMgc3VjY2VzcyBpZiBpdCdzIGEgbmVnYXRpdmVcclxuICAvLyBwYXR0ZXJuLCBmYWlsdXJlIG90aGVyd2lzZS5cclxuICBpZiAob3B0aW9ucy5mbGlwTmVnYXRlKSByZXR1cm4gZmFsc2VcclxuICByZXR1cm4gdGhpcy5uZWdhdGVcclxufVxyXG5cclxuLy8gc2V0IHBhcnRpYWwgdG8gdHJ1ZSB0byB0ZXN0IGlmLCBmb3IgZXhhbXBsZSxcclxuLy8gXCIvYS9iXCIgbWF0Y2hlcyB0aGUgc3RhcnQgb2YgXCIvKi9iLyovZFwiXHJcbi8vIFBhcnRpYWwgbWVhbnMsIGlmIHlvdSBydW4gb3V0IG9mIGZpbGUgYmVmb3JlIHlvdSBydW5cclxuLy8gb3V0IG9mIHBhdHRlcm4sIHRoZW4gdGhhdCdzIGZpbmUsIGFzIGxvbmcgYXMgYWxsXHJcbi8vIHRoZSBwYXJ0cyBtYXRjaC5cclxuTWluaW1hdGNoLnByb3RvdHlwZS5tYXRjaE9uZSA9IGZ1bmN0aW9uIChmaWxlLCBwYXR0ZXJuLCBwYXJ0aWFsKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcclxuXHJcbiAgdGhpcy5kZWJ1ZyhcIm1hdGNoT25lXCIsXHJcbiAgICAgICAgICAgICAgeyBcInRoaXNcIjogdGhpc1xyXG4gICAgICAgICAgICAgICwgZmlsZTogZmlsZVxyXG4gICAgICAgICAgICAgICwgcGF0dGVybjogcGF0dGVybiB9KVxyXG5cclxuICB0aGlzLmRlYnVnKFwibWF0Y2hPbmVcIiwgZmlsZS5sZW5ndGgsIHBhdHRlcm4ubGVuZ3RoKVxyXG5cclxuICBmb3IgKCB2YXIgZmkgPSAwXHJcbiAgICAgICAgICAsIHBpID0gMFxyXG4gICAgICAgICAgLCBmbCA9IGZpbGUubGVuZ3RoXHJcbiAgICAgICAgICAsIHBsID0gcGF0dGVybi5sZW5ndGhcclxuICAgICAgOyAoZmkgPCBmbCkgJiYgKHBpIDwgcGwpXHJcbiAgICAgIDsgZmkgKyssIHBpICsrICkge1xyXG5cclxuICAgIHRoaXMuZGVidWcoXCJtYXRjaE9uZSBsb29wXCIpXHJcbiAgICB2YXIgcCA9IHBhdHRlcm5bcGldXHJcbiAgICAgICwgZiA9IGZpbGVbZmldXHJcblxyXG4gICAgdGhpcy5kZWJ1ZyhwYXR0ZXJuLCBwLCBmKVxyXG5cclxuICAgIC8vIHNob3VsZCBiZSBpbXBvc3NpYmxlLlxyXG4gICAgLy8gc29tZSBpbnZhbGlkIHJlZ2V4cCBzdHVmZiBpbiB0aGUgc2V0LlxyXG4gICAgaWYgKHAgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiAocCA9PT0gR0xPQlNUQVIpIHtcclxuICAgICAgdGhpcy5kZWJ1ZygnR0xPQlNUQVInLCBbcGF0dGVybiwgcCwgZl0pXHJcblxyXG4gICAgICAvLyBcIioqXCJcclxuICAgICAgLy8gYS8qKi9iLyoqL2Mgd291bGQgbWF0Y2ggdGhlIGZvbGxvd2luZzpcclxuICAgICAgLy8gYS9iL3gveS96L2NcclxuICAgICAgLy8gYS94L3kvei9iL2NcclxuICAgICAgLy8gYS9iL3gvYi94L2NcclxuICAgICAgLy8gYS9iL2NcclxuICAgICAgLy8gVG8gZG8gdGhpcywgdGFrZSB0aGUgcmVzdCBvZiB0aGUgcGF0dGVybiBhZnRlclxyXG4gICAgICAvLyB0aGUgKiosIGFuZCBzZWUgaWYgaXQgd291bGQgbWF0Y2ggdGhlIGZpbGUgcmVtYWluZGVyLlxyXG4gICAgICAvLyBJZiBzbywgcmV0dXJuIHN1Y2Nlc3MuXHJcbiAgICAgIC8vIElmIG5vdCwgdGhlICoqIFwic3dhbGxvd3NcIiBhIHNlZ21lbnQsIGFuZCB0cnkgYWdhaW4uXHJcbiAgICAgIC8vIFRoaXMgaXMgcmVjdXJzaXZlbHkgYXdmdWwuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIGEvKiovYi8qKi9jIG1hdGNoaW5nIGEvYi94L3kvei9jXHJcbiAgICAgIC8vIC0gYSBtYXRjaGVzIGFcclxuICAgICAgLy8gLSBkb3VibGVzdGFyXHJcbiAgICAgIC8vICAgLSBtYXRjaE9uZShiL3gveS96L2MsIGIvKiovYylcclxuICAgICAgLy8gICAgIC0gYiBtYXRjaGVzIGJcclxuICAgICAgLy8gICAgIC0gZG91Ymxlc3RhclxyXG4gICAgICAvLyAgICAgICAtIG1hdGNoT25lKHgveS96L2MsIGMpIC0+IG5vXHJcbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoeS96L2MsIGMpIC0+IG5vXHJcbiAgICAgIC8vICAgICAgIC0gbWF0Y2hPbmUoei9jLCBjKSAtPiBub1xyXG4gICAgICAvLyAgICAgICAtIG1hdGNoT25lKGMsIGMpIHllcywgaGl0XHJcbiAgICAgIHZhciBmciA9IGZpXHJcbiAgICAgICAgLCBwciA9IHBpICsgMVxyXG4gICAgICBpZiAocHIgPT09IHBsKSB7XHJcbiAgICAgICAgdGhpcy5kZWJ1ZygnKiogYXQgdGhlIGVuZCcpXHJcbiAgICAgICAgLy8gYSAqKiBhdCB0aGUgZW5kIHdpbGwganVzdCBzd2FsbG93IHRoZSByZXN0LlxyXG4gICAgICAgIC8vIFdlIGhhdmUgZm91bmQgYSBtYXRjaC5cclxuICAgICAgICAvLyBob3dldmVyLCBpdCB3aWxsIG5vdCBzd2FsbG93IC8ueCwgdW5sZXNzXHJcbiAgICAgICAgLy8gb3B0aW9ucy5kb3QgaXMgc2V0LlxyXG4gICAgICAgIC8vIC4gYW5kIC4uIGFyZSAqbmV2ZXIqIG1hdGNoZWQgYnkgKiosIGZvciBleHBsb3NpdmVseVxyXG4gICAgICAgIC8vIGV4cG9uZW50aWFsIHJlYXNvbnMuXHJcbiAgICAgICAgZm9yICggOyBmaSA8IGZsOyBmaSArKykge1xyXG4gICAgICAgICAgaWYgKGZpbGVbZmldID09PSBcIi5cIiB8fCBmaWxlW2ZpXSA9PT0gXCIuLlwiIHx8XHJcbiAgICAgICAgICAgICAgKCFvcHRpb25zLmRvdCAmJiBmaWxlW2ZpXS5jaGFyQXQoMCkgPT09IFwiLlwiKSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG9rLCBsZXQncyBzZWUgaWYgd2UgY2FuIHN3YWxsb3cgd2hhdGV2ZXIgd2UgY2FuLlxyXG4gICAgICBXSElMRTogd2hpbGUgKGZyIDwgZmwpIHtcclxuICAgICAgICB2YXIgc3dhbGxvd2VlID0gZmlsZVtmcl1cclxuXHJcbiAgICAgICAgdGhpcy5kZWJ1ZygnXFxuZ2xvYnN0YXIgd2hpbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUsIGZyLCBwYXR0ZXJuLCBwciwgc3dhbGxvd2VlKVxyXG5cclxuICAgICAgICAvLyBYWFggcmVtb3ZlIHRoaXMgc2xpY2UuICBKdXN0IHBhc3MgdGhlIHN0YXJ0IGluZGV4LlxyXG4gICAgICAgIGlmICh0aGlzLm1hdGNoT25lKGZpbGUuc2xpY2UoZnIpLCBwYXR0ZXJuLnNsaWNlKHByKSwgcGFydGlhbCkpIHtcclxuICAgICAgICAgIHRoaXMuZGVidWcoJ2dsb2JzdGFyIGZvdW5kIG1hdGNoIScsIGZyLCBmbCwgc3dhbGxvd2VlKVxyXG4gICAgICAgICAgLy8gZm91bmQgYSBtYXRjaC5cclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGNhbid0IHN3YWxsb3cgXCIuXCIgb3IgXCIuLlwiIGV2ZXIuXHJcbiAgICAgICAgICAvLyBjYW4gb25seSBzd2FsbG93IFwiLmZvb1wiIHdoZW4gZXhwbGljaXRseSBhc2tlZC5cclxuICAgICAgICAgIGlmIChzd2FsbG93ZWUgPT09IFwiLlwiIHx8IHN3YWxsb3dlZSA9PT0gXCIuLlwiIHx8XHJcbiAgICAgICAgICAgICAgKCFvcHRpb25zLmRvdCAmJiBzd2FsbG93ZWUuY2hhckF0KDApID09PSBcIi5cIikpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhcImRvdCBkZXRlY3RlZCFcIiwgZmlsZSwgZnIsIHBhdHRlcm4sIHByKVxyXG4gICAgICAgICAgICBicmVhayBXSElMRVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICoqIHN3YWxsb3dzIGEgc2VnbWVudCwgYW5kIGNvbnRpbnVlLlxyXG4gICAgICAgICAgdGhpcy5kZWJ1ZygnZ2xvYnN0YXIgc3dhbGxvdyBhIHNlZ21lbnQsIGFuZCBjb250aW51ZScpXHJcbiAgICAgICAgICBmciArK1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBubyBtYXRjaCB3YXMgZm91bmQuXHJcbiAgICAgIC8vIEhvd2V2ZXIsIGluIHBhcnRpYWwgbW9kZSwgd2UgY2FuJ3Qgc2F5IHRoaXMgaXMgbmVjZXNzYXJpbHkgb3Zlci5cclxuICAgICAgLy8gSWYgdGhlcmUncyBtb3JlICpwYXR0ZXJuKiBsZWZ0LCB0aGVuIFxyXG4gICAgICBpZiAocGFydGlhbCkge1xyXG4gICAgICAgIC8vIHJhbiBvdXQgb2YgZmlsZVxyXG4gICAgICAgIHRoaXMuZGVidWcoXCJcXG4+Pj4gbm8gbWF0Y2gsIHBhcnRpYWw/XCIsIGZpbGUsIGZyLCBwYXR0ZXJuLCBwcilcclxuICAgICAgICBpZiAoZnIgPT09IGZsKSByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNvbWV0aGluZyBvdGhlciB0aGFuICoqXHJcbiAgICAvLyBub24tbWFnaWMgcGF0dGVybnMganVzdCBoYXZlIHRvIG1hdGNoIGV4YWN0bHlcclxuICAgIC8vIHBhdHRlcm5zIHdpdGggbWFnaWMgaGF2ZSBiZWVuIHR1cm5lZCBpbnRvIHJlZ2V4cHMuXHJcbiAgICB2YXIgaGl0XHJcbiAgICBpZiAodHlwZW9mIHAgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgaWYgKG9wdGlvbnMubm9jYXNlKSB7XHJcbiAgICAgICAgaGl0ID0gZi50b0xvd2VyQ2FzZSgpID09PSBwLnRvTG93ZXJDYXNlKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBoaXQgPSBmID09PSBwXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kZWJ1ZyhcInN0cmluZyBtYXRjaFwiLCBwLCBmLCBoaXQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaXQgPSBmLm1hdGNoKHApXHJcbiAgICAgIHRoaXMuZGVidWcoXCJwYXR0ZXJuIG1hdGNoXCIsIHAsIGYsIGhpdClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWhpdCkgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvLyBOb3RlOiBlbmRpbmcgaW4gLyBtZWFucyB0aGF0IHdlJ2xsIGdldCBhIGZpbmFsIFwiXCJcclxuICAvLyBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuLiAgVGhpcyBjYW4gb25seSBtYXRjaCBhXHJcbiAgLy8gY29ycmVzcG9uZGluZyBcIlwiIGF0IHRoZSBlbmQgb2YgdGhlIGZpbGUuXHJcbiAgLy8gSWYgdGhlIGZpbGUgZW5kcyBpbiAvLCB0aGVuIGl0IGNhbiBvbmx5IG1hdGNoIGFcclxuICAvLyBhIHBhdHRlcm4gdGhhdCBlbmRzIGluIC8sIHVubGVzcyB0aGUgcGF0dGVybiBqdXN0XHJcbiAgLy8gZG9lc24ndCBoYXZlIGFueSBtb3JlIGZvciBpdC4gQnV0LCBhL2IvIHNob3VsZCAqbm90KlxyXG4gIC8vIG1hdGNoIFwiYS9iLypcIiwgZXZlbiB0aG91Z2ggXCJcIiBtYXRjaGVzIGFnYWluc3QgdGhlXHJcbiAgLy8gW14vXSo/IHBhdHRlcm4sIGV4Y2VwdCBpbiBwYXJ0aWFsIG1vZGUsIHdoZXJlIGl0IG1pZ2h0XHJcbiAgLy8gc2ltcGx5IG5vdCBiZSByZWFjaGVkIHlldC5cclxuICAvLyBIb3dldmVyLCBhL2IvIHNob3VsZCBzdGlsbCBzYXRpc2Z5IGEvKlxyXG5cclxuICAvLyBub3cgZWl0aGVyIHdlIGZlbGwgb2ZmIHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4sIG9yIHdlJ3JlIGRvbmUuXHJcbiAgaWYgKGZpID09PSBmbCAmJiBwaSA9PT0gcGwpIHtcclxuICAgIC8vIHJhbiBvdXQgb2YgcGF0dGVybiBhbmQgZmlsZW5hbWUgYXQgdGhlIHNhbWUgdGltZS5cclxuICAgIC8vIGFuIGV4YWN0IGhpdCFcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfSBlbHNlIGlmIChmaSA9PT0gZmwpIHtcclxuICAgIC8vIHJhbiBvdXQgb2YgZmlsZSwgYnV0IHN0aWxsIGhhZCBwYXR0ZXJuIGxlZnQuXHJcbiAgICAvLyB0aGlzIGlzIG9rIGlmIHdlJ3JlIGRvaW5nIHRoZSBtYXRjaCBhcyBwYXJ0IG9mXHJcbiAgICAvLyBhIGdsb2IgZnMgdHJhdmVyc2FsLlxyXG4gICAgcmV0dXJuIHBhcnRpYWxcclxuICB9IGVsc2UgaWYgKHBpID09PSBwbCkge1xyXG4gICAgLy8gcmFuIG91dCBvZiBwYXR0ZXJuLCBzdGlsbCBoYXZlIGZpbGUgbGVmdC5cclxuICAgIC8vIHRoaXMgaXMgb25seSBhY2NlcHRhYmxlIGlmIHdlJ3JlIG9uIHRoZSB2ZXJ5IGxhc3RcclxuICAgIC8vIGVtcHR5IHNlZ21lbnQgb2YgYSBmaWxlIHdpdGggYSB0cmFpbGluZyBzbGFzaC5cclxuICAgIC8vIGEvKiBzaG91bGQgbWF0Y2ggYS9iL1xyXG4gICAgdmFyIGVtcHR5RmlsZUVuZCA9IChmaSA9PT0gZmwgLSAxKSAmJiAoZmlsZVtmaV0gPT09IFwiXCIpXHJcbiAgICByZXR1cm4gZW1wdHlGaWxlRW5kXHJcbiAgfVxyXG5cclxuICAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGUuXHJcbiAgdGhyb3cgbmV3IEVycm9yKFwid3RmP1wiKVxyXG59XHJcblxyXG5cclxuLy8gcmVwbGFjZSBzdHVmZiBsaWtlIFxcKiB3aXRoICpcclxuZnVuY3Rpb24gZ2xvYlVuZXNjYXBlIChzKSB7XHJcbiAgcmV0dXJuIHMucmVwbGFjZSgvXFxcXCguKS9nLCBcIiQxXCIpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWdFeHBFc2NhcGUgKHMpIHtcclxuICByZXR1cm4gcy5yZXBsYWNlKC9bLVtcXF17fSgpKis/LixcXFxcXiR8I1xcc10vZywgXCJcXFxcJCZcIilcclxufVxyXG5cclxufSkoIHR5cGVvZiByZXF1aXJlID09PSBcImZ1bmN0aW9uXCIgPyByZXF1aXJlIDogbnVsbCxcclxuICAgIHRoaXMsXHJcbiAgICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlIDogbnVsbCxcclxuICAgIHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiID8gcHJvY2Vzcy5wbGF0Zm9ybSA6IFwid2luMzJcIlxyXG4gIClcclxuXHJcblxyXG5cclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInErNjRmd1wiKSkiLCJtb2R1bGUuZXhwb3J0cyA9IHNpZ211bmRcbmZ1bmN0aW9uIHNpZ211bmQgKHN1YmplY3QsIG1heFNlc3Npb25zKSB7XG4gICAgbWF4U2Vzc2lvbnMgPSBtYXhTZXNzaW9ucyB8fCAxMDtcbiAgICB2YXIgbm90ZXMgPSBbXTtcbiAgICB2YXIgYW5hbHlzaXMgPSAnJztcbiAgICB2YXIgUkUgPSBSZWdFeHA7XG5cbiAgICBmdW5jdGlvbiBwc3ljaG9BbmFseXplIChzdWJqZWN0LCBzZXNzaW9uKSB7XG4gICAgICAgIGlmIChzZXNzaW9uID4gbWF4U2Vzc2lvbnMpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIHN1YmplY3QgPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgICAgIHR5cGVvZiBzdWJqZWN0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWJqZWN0ICE9PSAnb2JqZWN0JyB8fCAhc3ViamVjdCB8fFxuICAgICAgICAgICAgKHN1YmplY3QgaW5zdGFuY2VvZiBSRSkpIHtcbiAgICAgICAgICAgIGFuYWx5c2lzICs9IHN1YmplY3Q7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm90ZXMuaW5kZXhPZihzdWJqZWN0KSAhPT0gLTEgfHwgc2Vzc2lvbiA9PT0gbWF4U2Vzc2lvbnMpIHJldHVybjtcblxuICAgICAgICBub3Rlcy5wdXNoKHN1YmplY3QpO1xuICAgICAgICBhbmFseXNpcyArPSAneyc7XG4gICAgICAgIE9iamVjdC5rZXlzKHN1YmplY3QpLmZvckVhY2goZnVuY3Rpb24gKGlzc3VlLCBfLCBfXykge1xuICAgICAgICAgICAgLy8gcHNldWRvLXByaXZhdGUgdmFsdWVzLiAgc2tpcCB0aG9zZS5cbiAgICAgICAgICAgIGlmIChpc3N1ZS5jaGFyQXQoMCkgPT09ICdfJykgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHRvID0gdHlwZW9mIHN1YmplY3RbaXNzdWVdO1xuICAgICAgICAgICAgaWYgKHRvID09PSAnZnVuY3Rpb24nIHx8IHRvID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuICAgICAgICAgICAgYW5hbHlzaXMgKz0gaXNzdWU7XG4gICAgICAgICAgICBwc3ljaG9BbmFseXplKHN1YmplY3RbaXNzdWVdLCBzZXNzaW9uICsgMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwc3ljaG9BbmFseXplKHN1YmplY3QsIDApO1xuICAgIHJldHVybiBhbmFseXNpcztcbn1cblxuLy8gdmltOiBzZXQgc29mdHRhYnN0b3A9NCBzaGlmdHdpZHRoPTQ6XG4iLCJ2YXIgZG9taWZ5ID0gcmVxdWlyZSgnZG9taWZ5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJnbHVlO1xuZnVuY3Rpb24gaHlwZXJnbHVlIChzcmMsIHVwZGF0ZXMpIHtcbiAgICBpZiAoIXVwZGF0ZXMpIHVwZGF0ZXMgPSB7fTtcbiAgICBcbiAgICB2YXIgb2IgPSB0eXBlb2Ygc3JjID09PSAnb2JqZWN0JztcbiAgICB2YXIgZG9tID0gb2JcbiAgICAgICAgICAgID8gWyBzcmMgXVxuICAgICAgICAgICAgOiBkb21pZnkoXCI8ZGl2PlwiK3NyYytcIjwvZGl2PlwiKTtcbiAgICB2YXIgcmV0dXJuRG9tID0gW107XG4gICAgdmFyIGh0bWwgPSBcIlwiO1xuXG4gICAgZm9yRWFjaChvYmplY3RLZXlzKHVwZGF0ZXMpLCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdXBkYXRlc1tzZWxlY3Rvcl07XG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gJzpmaXJzdCcpIHtcbiAgICAgICAgICAgIGJpbmQob2IgPyBkb21bMF0gOiBkb21bMF0uZmlyc3RDaGlsZCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKC86Zmlyc3QkLy50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgdmFyIGsgPSBzZWxlY3Rvci5yZXBsYWNlKC86Zmlyc3QkLywgJycpO1xuICAgICAgICAgICAgdmFyIGVsZW0gPSBkb21bMF0ucXVlcnlTZWxlY3RvcihrKTtcbiAgICAgICAgICAgIGlmIChlbGVtKSBiaW5kKGVsZW0sIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIG5vZGVzID0gZG9tWzBdLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJpbmQobm9kZXNbaV0sIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYoIG9iICl7XG4gICAgICAgIHJldHVybiBkb20ubGVuZ3RoID09PSAxID8gZG9tWzBdIDogZG9tO1xuICAgIH1lbHNle1xuICAgICAgICBpZiAoZG9tWzBdLmNoaWxkRWxlbWVudENvdW50ID09PSAxKXtcbiAgICAgICAgICAgIHJldHVybkRvbSA9IGRvbVswXS5yZW1vdmVDaGlsZChkb21bMF0uZmlyc3RDaGlsZCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuRG9tLmlubmVySFRNTCA9IHJldHVybkRvbS5vdXRlckhUTUwgPSBcIlwiO1xuXG4gICAgICAgICAgICB3aGlsZShkb21bMF0uZmlyc3RDaGlsZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuRG9tLmlubmVySFRNTCArPSByZXR1cm5Eb20ub3V0ZXJIVE1MICs9IGRvbVswXS5maXJzdENoaWxkLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICByZXR1cm5Eb20ucHVzaChkb21bMF0ucmVtb3ZlQ2hpbGQoZG9tWzBdLmZpcnN0Q2hpbGQpKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5Eb20uYXBwZW5kVG8gPSBhcHBlbmRUbztcbiAgICAgICAgcmV0dXJuIHJldHVybkRvbTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJpbmQgKG5vZGUsIHZhbHVlKSB7XG4gICAgaWYgKGlzRWxlbWVudCh2YWx1ZSkpIHtcbiAgICAgICAgbm9kZS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlID0gaHlwZXJnbHVlKG5vZGUuY2xvbmVOb2RlKHRydWUpLCB2YWx1ZVtpXSk7XG4gICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3JFYWNoKG9iamVjdEtleXModmFsdWUpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnX3RleHQnKSB7XG4gICAgICAgICAgICAgICAgc2V0VGV4dChub2RlLCB2YWx1ZVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ19odG1sJyAmJiBpc0VsZW1lbnQodmFsdWVba2V5XSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQodmFsdWVba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdfaHRtbCcpIHtcbiAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHZhbHVlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGtleSwgdmFsdWVba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHNldFRleHQobm9kZSwgdmFsdWUpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZvckVhY2gpIHJldHVybiB4cy5mb3JFYWNoKGYpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIGYoeHNbaV0sIGkpXG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSByZXMucHVzaChrZXkpO1xuICAgIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQgKGUpIHtcbiAgICByZXR1cm4gZSAmJiB0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiYgZS5jaGlsZE5vZGVzXG4gICAgICAgICYmICh0eXBlb2YgZS5hcHBlbmRDaGlsZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICB8fCB0eXBlb2YgZS5hcHBlbmRDaGlsZCA9PT0gJ29iamVjdCcpXG4gICAgO1xufVxuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBzZXRUZXh0IChlLCBzKSB7XG4gICAgZS5pbm5lckhUTUwgPSAnJztcbiAgICB2YXIgdHh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKHMpKTtcbiAgICBlLmFwcGVuZENoaWxkKHR4dCk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRvKGRlc3QpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYoIWlzQXJyYXkoc2VsZikpIHNlbGYgPSBbc2VsZl07XG4gICAgZm9yRWFjaChzZWxmLCBmdW5jdGlvbihzcmMpeyBcbiAgICAgICAgaWYoZGVzdC5hcHBlbmRDaGlsZCkgZGVzdC5hcHBlbmRDaGlsZCggc3JjICkgXG4gICAgICAgIGVsc2UgaWYgKGRlc3QuYXBwZW5kKSBkZXN0LmFwcGVuZCAoIHNyYyApXG4gICAgfSApOyBcbiAgICByZXR1cm4gdGhpcztcbn0iLCJcbi8qKlxuICogRXhwb3NlIGBwYXJzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcblxuLyoqXG4gKiBXcmFwIG1hcCBmcm9tIGpxdWVyeS5cbiAqL1xuXG52YXIgbWFwID0ge1xuICBvcHRpb246IFsxLCAnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JywgJzwvc2VsZWN0PiddLFxuICBvcHRncm91cDogWzEsICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLCAnPC9zZWxlY3Q+J10sXG4gIGxlZ2VuZDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRoZWFkOiBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXSxcbiAgdGJvZHk6IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddLFxuICB0Zm9vdDogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gIGNvbGdyb3VwOiBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXSxcbiAgY2FwdGlvbjogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gIHRyOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgdGQ6IFszLCAnPHRhYmxlPjx0Ym9keT48dHI+JywgJzwvdHI+PC90Ym9keT48L3RhYmxlPiddLFxuICB0aDogWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J10sXG4gIGNvbDogWzIsICc8dGFibGU+PHRib2R5PjwvdGJvZHk+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+J10sXG4gIF9kZWZhdWx0OiBbMCwgJycsICcnXVxufTtcblxuLyoqXG4gKiBQYXJzZSBgaHRtbGAgYW5kIHJldHVybiB0aGUgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2UoaHRtbCkge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIGh0bWwpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N0cmluZyBleHBlY3RlZCcpO1xuICBcbiAgLy8gdGFnIG5hbWVcbiAgdmFyIG0gPSAvPChbXFx3Ol0rKS8uZXhlYyhodG1sKTtcbiAgaWYgKCFtKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnRzIHdlcmUgZ2VuZXJhdGVkLicpO1xuICB2YXIgdGFnID0gbVsxXTtcbiAgXG4gIC8vIGJvZHkgc3VwcG9ydFxuICBpZiAodGFnID09ICdib2R5Jykge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiBbZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKV07XG4gIH1cbiAgXG4gIC8vIHdyYXAgbWFwXG4gIHZhciB3cmFwID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0O1xuICB2YXIgZGVwdGggPSB3cmFwWzBdO1xuICB2YXIgcHJlZml4ID0gd3JhcFsxXTtcbiAgdmFyIHN1ZmZpeCA9IHdyYXBbMl07XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBlbC5pbm5lckhUTUwgPSBwcmVmaXggKyBodG1sICsgc3VmZml4O1xuICB3aGlsZSAoZGVwdGgtLSkgZWwgPSBlbC5sYXN0Q2hpbGQ7XG5cbiAgcmV0dXJuIG9ycGhhbihlbC5jaGlsZHJlbik7XG59XG5cbi8qKlxuICogT3JwaGFuIGBlbHNgIGFuZCByZXR1cm4gYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gZWxzXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG9ycGhhbihlbHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuXG4gIHdoaWxlIChlbHMubGVuZ3RoKSB7XG4gICAgcmV0LnB1c2goZWxzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxzWzBdKSk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqXG4gKiBtYXJrZWQgLSBhIG1hcmtkb3duIHBhcnNlclxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqL1xuXG47KGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgYmxvY2sgPSB7XG4gIG5ld2xpbmU6IC9eXFxuKy8sXG4gIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgZmVuY2VzOiBub29wLFxuICBocjogL14oICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpLyxcbiAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gIG5wdGFibGU6IG5vb3AsXG4gIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Mix9ICooPzpcXG4rfCQpLyxcbiAgYmxvY2txdW90ZTogL14oICo+W15cXG5dKyhcXG4oPyFkZWYpW15cXG5dKykqXFxuKikrLyxcbiAgbGlzdDogL14oICopKGJ1bGwpIFtcXHNcXFNdKz8oPzpocnxkZWZ8XFxuezIsfSg/ISApKD8hXFwxYnVsbCApXFxuKnxcXHMqJCkvLFxuICBodG1sOiAvXiAqKD86Y29tbWVudHxjbG9zZWR8Y2xvc2luZykgKig/OlxcbnsyLH18XFxzKiQpLyxcbiAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogK1tcIihdKFteXFxuXSspW1wiKV0pPyAqKD86XFxuK3wkKS8sXG4gIHRhYmxlOiBub29wLFxuICBwYXJhZ3JhcGg6IC9eKCg/OlteXFxuXStcXG4/KD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfHRhZ3xkZWYpKSspXFxuKi8sXG4gIHRleHQ6IC9eW15cXG5dKy9cbn07XG5cbmJsb2NrLmJ1bGxldCA9IC8oPzpbKistXXxcXGQrXFwuKS87XG5ibG9jay5pdGVtID0gL14oICopKGJ1bGwpIFteXFxuXSooPzpcXG4oPyFcXDFidWxsIClbXlxcbl0qKSovO1xuYmxvY2suaXRlbSA9IHJlcGxhY2UoYmxvY2suaXRlbSwgJ2dtJylcbiAgKC9idWxsL2csIGJsb2NrLmJ1bGxldClcbiAgKCk7XG5cbmJsb2NrLmxpc3QgPSByZXBsYWNlKGJsb2NrLmxpc3QpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgnaHInLCAnXFxcXG4rKD89XFxcXDE/KD86Wy0qX10gKil7Myx9KD86XFxcXG4rfCQpKScpXG4gICgnZGVmJywgJ1xcXFxuKyg/PScgKyBibG9jay5kZWYuc291cmNlICsgJyknKVxuICAoKTtcblxuYmxvY2suYmxvY2txdW90ZSA9IHJlcGxhY2UoYmxvY2suYmxvY2txdW90ZSlcbiAgKCdkZWYnLCBibG9jay5kZWYpXG4gICgpO1xuXG5ibG9jay5fdGFnID0gJyg/ISg/OidcbiAgKyAnYXxlbXxzdHJvbmd8c21hbGx8c3xjaXRlfHF8ZGZufGFiYnJ8ZGF0YXx0aW1lfGNvZGUnXG4gICsgJ3x2YXJ8c2FtcHxrYmR8c3VifHN1cHxpfGJ8dXxtYXJrfHJ1Ynl8cnR8cnB8YmRpfGJkbydcbiAgKyAnfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKVxcXFxiKVxcXFx3Kyg/ITovfFteXFxcXHdcXFxcc0BdKkApXFxcXGInO1xuXG5ibG9jay5odG1sID0gcmVwbGFjZShibG9jay5odG1sKVxuICAoJ2NvbW1lbnQnLCAvPCEtLVtcXHNcXFNdKj8tLT4vKVxuICAoJ2Nsb3NlZCcsIC88KHRhZylbXFxzXFxTXSs/PFxcL1xcMT4vKVxuICAoJ2Nsb3NpbmcnLCAvPHRhZyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8pXG4gICgvdGFnL2csIGJsb2NrLl90YWcpXG4gICgpO1xuXG5ibG9jay5wYXJhZ3JhcGggPSByZXBsYWNlKGJsb2NrLnBhcmFncmFwaClcbiAgKCdocicsIGJsb2NrLmhyKVxuICAoJ2hlYWRpbmcnLCBibG9jay5oZWFkaW5nKVxuICAoJ2xoZWFkaW5nJywgYmxvY2subGhlYWRpbmcpXG4gICgnYmxvY2txdW90ZScsIGJsb2NrLmJsb2NrcXVvdGUpXG4gICgndGFnJywgJzwnICsgYmxvY2suX3RhZylcbiAgKCdkZWYnLCBibG9jay5kZWYpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2subm9ybWFsID0gbWVyZ2Uoe30sIGJsb2NrKTtcblxuLyoqXG4gKiBHRk0gQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLmdmbSA9IG1lcmdlKHt9LCBibG9jay5ub3JtYWwsIHtcbiAgZmVuY2VzOiAvXiAqKGB7Myx9fH57Myx9KSAqKFxcUyspPyAqXFxuKFtcXHNcXFNdKz8pXFxzKlxcMSAqKD86XFxuK3wkKS8sXG4gIHBhcmFncmFwaDogL14vXG59KTtcblxuYmxvY2suZ2ZtLnBhcmFncmFwaCA9IHJlcGxhY2UoYmxvY2sucGFyYWdyYXBoKVxuICAoJyg/IScsICcoPyEnXG4gICAgKyBibG9jay5nZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpICsgJ3wnXG4gICAgKyBibG9jay5saXN0LnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMycpICsgJ3wnKVxuICAoKTtcblxuLyoqXG4gKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLnRhYmxlcyA9IG1lcmdlKHt9LCBibG9jay5nZm0sIHtcbiAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi9cbn0pO1xuXG4vKipcbiAqIEJsb2NrIExleGVyXG4gKi9cblxuZnVuY3Rpb24gTGV4ZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2Vucy5saW5rcyA9IHt9O1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5ydWxlcyA9IGJsb2NrLm5vcm1hbDtcblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudGFibGVzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2sudGFibGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2suZ2ZtO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBCbG9jayBSdWxlc1xuICovXG5cbkxleGVyLnJ1bGVzID0gYmxvY2s7XG5cbi8qKlxuICogU3RhdGljIExleCBNZXRob2RcbiAqL1xuXG5MZXhlci5sZXggPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMpIHtcbiAgdmFyIGxleGVyID0gbmV3IExleGVyKG9wdGlvbnMpO1xuICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG59O1xuXG4vKipcbiAqIFByZXByb2Nlc3NpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24oc3JjKSB7XG4gIHNyYyA9IHNyY1xuICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csICcgJylcbiAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJyk7XG5cbiAgcmV0dXJuIHRoaXMudG9rZW4oc3JjLCB0cnVlKTtcbn07XG5cbi8qKlxuICogTGV4aW5nXG4gKi9cblxuTGV4ZXIucHJvdG90eXBlLnRva2VuID0gZnVuY3Rpb24oc3JjLCB0b3AsIGJxKSB7XG4gIHZhciBzcmMgPSBzcmMucmVwbGFjZSgvXiArJC9nbSwgJycpXG4gICAgLCBuZXh0XG4gICAgLCBsb29zZVxuICAgICwgY2FwXG4gICAgLCBidWxsXG4gICAgLCBiXG4gICAgLCBpdGVtXG4gICAgLCBzcGFjZVxuICAgICwgaVxuICAgICwgbDtcblxuICB3aGlsZSAoc3JjKSB7XG4gICAgLy8gbmV3bGluZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLm5ld2xpbmUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgaWYgKGNhcFswXS5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdzcGFjZSdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29kZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgY2FwID0gY2FwWzBdLnJlcGxhY2UoL14gezR9L2dtLCAnJyk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICB0ZXh0OiAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgPyBjYXAucmVwbGFjZSgvXFxuKyQvLCAnJylcbiAgICAgICAgICA6IGNhcFxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBmZW5jZXMgKGdmbSlcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5mZW5jZXMuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgbGFuZzogY2FwWzJdLFxuICAgICAgICB0ZXh0OiBjYXBbM11cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaGVhZGluZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmhlYWRpbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgZGVwdGg6IGNhcFsxXS5sZW5ndGgsXG4gICAgICAgIHRleHQ6IGNhcFsyXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSBubyBsZWFkaW5nIHBpcGUgKGdmbSlcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLm5wdGFibGUuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgaXRlbSA9IHtcbiAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgaGVhZGVyOiBjYXBbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBhbGlnbjogY2FwWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGNlbGxzOiBjYXBbM10ucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJylcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbS5jZWxsc1tpXSA9IGl0ZW0uY2VsbHNbaV0uc3BsaXQoLyAqXFx8ICovKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50b2tlbnMucHVzaChpdGVtKTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGhlYWRpbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5saGVhZGluZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICBkZXB0aDogY2FwWzJdID09PSAnPScgPyAxIDogMixcbiAgICAgICAgdGV4dDogY2FwWzFdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGhyXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaHIuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdocidcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYmxvY2txdW90ZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrcXVvdGUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Jsb2NrcXVvdGVfc3RhcnQnXG4gICAgICB9KTtcblxuICAgICAgY2FwID0gY2FwWzBdLnJlcGxhY2UoL14gKj4gPy9nbSwgJycpO1xuXG4gICAgICAvLyBQYXNzIGB0b3BgIHRvIGtlZXAgdGhlIGN1cnJlbnRcbiAgICAgIC8vIFwidG9wbGV2ZWxcIiBzdGF0ZS4gVGhpcyBpcyBleGFjdGx5XG4gICAgICAvLyBob3cgbWFya2Rvd24ucGwgd29ya3MuXG4gICAgICB0aGlzLnRva2VuKGNhcCwgdG9wLCB0cnVlKTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdibG9ja3F1b3RlX2VuZCdcbiAgICAgIH0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaXN0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGlzdC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBidWxsID0gY2FwWzJdO1xuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2xpc3Rfc3RhcnQnLFxuICAgICAgICBvcmRlcmVkOiBidWxsLmxlbmd0aCA+IDFcbiAgICAgIH0pO1xuXG4gICAgICAvLyBHZXQgZWFjaCB0b3AtbGV2ZWwgaXRlbS5cbiAgICAgIGNhcCA9IGNhcFswXS5tYXRjaCh0aGlzLnJ1bGVzLml0ZW0pO1xuXG4gICAgICBuZXh0ID0gZmFsc2U7XG4gICAgICBsID0gY2FwLmxlbmd0aDtcbiAgICAgIGkgPSAwO1xuXG4gICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpdGVtID0gY2FwW2ldO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpdGVtJ3MgYnVsbGV0XG4gICAgICAgIC8vIHNvIGl0IGlzIHNlZW4gYXMgdGhlIG5leHQgdG9rZW4uXG4gICAgICAgIHNwYWNlID0gaXRlbS5sZW5ndGg7XG4gICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL14gKihbKistXXxcXGQrXFwuKSArLywgJycpO1xuXG4gICAgICAgIC8vIE91dGRlbnQgd2hhdGV2ZXIgdGhlXG4gICAgICAgIC8vIGxpc3QgaXRlbSBjb250YWlucy4gSGFja3kuXG4gICAgICAgIGlmICh+aXRlbS5pbmRleE9mKCdcXG4gJykpIHtcbiAgICAgICAgICBzcGFjZSAtPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgICBpdGVtID0gIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgICAgPyBpdGVtLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiB7MSwnICsgc3BhY2UgKyAnfScsICdnbScpLCAnJylcbiAgICAgICAgICAgIDogaXRlbS5yZXBsYWNlKC9eIHsxLDR9L2dtLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgbmV4dCBsaXN0IGl0ZW0gYmVsb25ncyBoZXJlLlxuICAgICAgICAvLyBCYWNrcGVkYWwgaWYgaXQgZG9lcyBub3QgYmVsb25nIGluIHRoaXMgbGlzdC5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydExpc3RzICYmIGkgIT09IGwgLSAxKSB7XG4gICAgICAgICAgYiA9IGJsb2NrLmJ1bGxldC5leGVjKGNhcFtpICsgMV0pWzBdO1xuICAgICAgICAgIGlmIChidWxsICE9PSBiICYmICEoYnVsbC5sZW5ndGggPiAxICYmIGIubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcC5zbGljZShpICsgMSkuam9pbignXFxuJykgKyBzcmM7XG4gICAgICAgICAgICBpID0gbCAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaXRlbSBpcyBsb29zZSBvciBub3QuXG4gICAgICAgIC8vIFVzZTogLyhefFxcbikoPyEgKVteXFxuXStcXG5cXG4oPyFcXHMqJCkvXG4gICAgICAgIC8vIGZvciBkaXNjb3VudCBiZWhhdmlvci5cbiAgICAgICAgbG9vc2UgPSBuZXh0IHx8IC9cXG5cXG4oPyFcXHMqJCkvLnRlc3QoaXRlbSk7XG4gICAgICAgIGlmIChpICE9PSBsIC0gMSkge1xuICAgICAgICAgIG5leHQgPSBpdGVtLmNoYXJBdChpdGVtLmxlbmd0aCAtIDEpID09PSAnXFxuJztcbiAgICAgICAgICBpZiAoIWxvb3NlKSBsb29zZSA9IG5leHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBsb29zZVxuICAgICAgICAgICAgPyAnbG9vc2VfaXRlbV9zdGFydCdcbiAgICAgICAgICAgIDogJ2xpc3RfaXRlbV9zdGFydCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVjdXJzZS5cbiAgICAgICAgdGhpcy50b2tlbihpdGVtLCBmYWxzZSwgYnEpO1xuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdsaXN0X2l0ZW1fZW5kJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaXN0X2VuZCdcbiAgICAgIH0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBodG1sXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaHRtbC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnNhbml0aXplXG4gICAgICAgICAgPyAncGFyYWdyYXBoJ1xuICAgICAgICAgIDogJ2h0bWwnLFxuICAgICAgICBwcmU6IGNhcFsxXSA9PT0gJ3ByZScgfHwgY2FwWzFdID09PSAnc2NyaXB0JyB8fCBjYXBbMV0gPT09ICdzdHlsZScsXG4gICAgICAgIHRleHQ6IGNhcFswXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBkZWZcbiAgICBpZiAoKCFicSAmJiB0b3ApICYmIChjYXAgPSB0aGlzLnJ1bGVzLmRlZi5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMubGlua3NbY2FwWzFdLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMudGFibGUuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgaXRlbSA9IHtcbiAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgaGVhZGVyOiBjYXBbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBhbGlnbjogY2FwWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGNlbGxzOiBjYXBbM10ucmVwbGFjZSgvKD86ICpcXHwgKik/XFxuJC8sICcnKS5zcGxpdCgnXFxuJylcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbS5jZWxsc1tpXSA9IGl0ZW0uY2VsbHNbaV1cbiAgICAgICAgICAucmVwbGFjZSgvXiAqXFx8ICp8ICpcXHwgKiQvZywgJycpXG4gICAgICAgICAgLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnBhcmFncmFwaC5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICB0ZXh0OiBjYXBbMV0uY2hhckF0KGNhcFsxXS5sZW5ndGggLSAxKSA9PT0gJ1xcbidcbiAgICAgICAgICA/IGNhcFsxXS5zbGljZSgwLCAtMSlcbiAgICAgICAgICA6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGV4dC5leGVjKHNyYykpIHtcbiAgICAgIC8vIFRvcC1sZXZlbCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZS5cbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMudG9rZW5zO1xufTtcblxuLyoqXG4gKiBJbmxpbmUtTGV2ZWwgR3JhbW1hclxuICovXG5cbnZhciBpbmxpbmUgPSB7XG4gIGVzY2FwZTogL15cXFxcKFtcXFxcYCp7fVxcW1xcXSgpIytcXC0uIV8+XSkvLFxuICBhdXRvbGluazogL148KFteID5dKyhAfDpcXC8pW14gPl0rKT4vLFxuICB1cmw6IG5vb3AsXG4gIHRhZzogL148IS0tW1xcc1xcU10qPy0tPnxePFxcLz9cXHcrKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LyxcbiAgbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFwoaHJlZlxcKS8sXG4gIHJlZmxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxccypcXFsoW15cXF1dKilcXF0vLFxuICBub2xpbms6IC9eIT9cXFsoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKilcXF0vLFxuICBzdHJvbmc6IC9eX18oW1xcc1xcU10rPylfXyg/IV8pfF5cXCpcXCooW1xcc1xcU10rPylcXCpcXCooPyFcXCopLyxcbiAgZW06IC9eXFxiXygoPzpfX3xbXFxzXFxTXSkrPylfXFxifF5cXCooKD86XFwqXFwqfFtcXHNcXFNdKSs/KVxcKig/IVxcKikvLFxuICBjb2RlOiAvXihgKylcXHMqKFtcXHNcXFNdKj9bXmBdKVxccypcXDEoPyFgKS8sXG4gIGJyOiAvXiB7Mix9XFxuKD8hXFxzKiQpLyxcbiAgZGVsOiBub29wLFxuICB0ZXh0OiAvXltcXHNcXFNdKz8oPz1bXFxcXDwhXFxbXypgXXwgezIsfVxcbnwkKS9cbn07XG5cbmlubGluZS5faW5zaWRlID0gLyg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dfFxcXSg/PVteXFxbXSpcXF0pKSovO1xuaW5saW5lLl9ocmVmID0gL1xccyo8PyhbXFxzXFxTXSo/KT4/KD86XFxzK1snXCJdKFtcXHNcXFNdKj8pWydcIl0pP1xccyovO1xuXG5pbmxpbmUubGluayA9IHJlcGxhY2UoaW5saW5lLmxpbmspXG4gICgnaW5zaWRlJywgaW5saW5lLl9pbnNpZGUpXG4gICgnaHJlZicsIGlubGluZS5faHJlZilcbiAgKCk7XG5cbmlubGluZS5yZWZsaW5rID0gcmVwbGFjZShpbmxpbmUucmVmbGluaylcbiAgKCdpbnNpZGUnLCBpbmxpbmUuX2luc2lkZSlcbiAgKCk7XG5cbi8qKlxuICogTm9ybWFsIElubGluZSBHcmFtbWFyXG4gKi9cblxuaW5saW5lLm5vcm1hbCA9IG1lcmdlKHt9LCBpbmxpbmUpO1xuXG4vKipcbiAqIFBlZGFudGljIElubGluZSBHcmFtbWFyXG4gKi9cblxuaW5saW5lLnBlZGFudGljID0gbWVyZ2Uoe30sIGlubGluZS5ub3JtYWwsIHtcbiAgc3Ryb25nOiAvXl9fKD89XFxTKShbXFxzXFxTXSo/XFxTKV9fKD8hXyl8XlxcKlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCpcXCooPyFcXCopLyxcbiAgZW06IC9eXyg/PVxcUykoW1xcc1xcU10qP1xcUylfKD8hXyl8XlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCooPyFcXCopL1xufSk7XG5cbi8qKlxuICogR0ZNIElubGluZSBHcmFtbWFyXG4gKi9cblxuaW5saW5lLmdmbSA9IG1lcmdlKHt9LCBpbmxpbmUubm9ybWFsLCB7XG4gIGVzY2FwZTogcmVwbGFjZShpbmxpbmUuZXNjYXBlKSgnXSknLCAnfnxdKScpKCksXG4gIHVybDogL14oaHR0cHM/OlxcL1xcL1teXFxzPF0rW148Liw6O1wiJylcXF1cXHNdKS8sXG4gIGRlbDogL15+fig/PVxcUykoW1xcc1xcU10qP1xcUyl+fi8sXG4gIHRleHQ6IHJlcGxhY2UoaW5saW5lLnRleHQpXG4gICAgKCddfCcsICd+XXwnKVxuICAgICgnfCcsICd8aHR0cHM/Oi8vfCcpXG4gICAgKClcbn0pO1xuXG4vKipcbiAqIEdGTSArIExpbmUgQnJlYWtzIElubGluZSBHcmFtbWFyXG4gKi9cblxuaW5saW5lLmJyZWFrcyA9IG1lcmdlKHt9LCBpbmxpbmUuZ2ZtLCB7XG4gIGJyOiByZXBsYWNlKGlubGluZS5icikoJ3syLH0nLCAnKicpKCksXG4gIHRleHQ6IHJlcGxhY2UoaW5saW5lLmdmbS50ZXh0KSgnezIsfScsICcqJykoKVxufSk7XG5cbi8qKlxuICogSW5saW5lIExleGVyICYgQ29tcGlsZXJcbiAqL1xuXG5mdW5jdGlvbiBJbmxpbmVMZXhlcihsaW5rcywgb3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5saW5rcyA9IGxpbmtzO1xuICB0aGlzLnJ1bGVzID0gaW5saW5lLm5vcm1hbDtcbiAgdGhpcy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlciB8fCBuZXcgUmVuZGVyZXI7XG4gIHRoaXMucmVuZGVyZXIub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICBpZiAoIXRoaXMubGlua3MpIHtcbiAgICB0aHJvdyBuZXdcbiAgICAgIEVycm9yKCdUb2tlbnMgYXJyYXkgcmVxdWlyZXMgYSBgbGlua3NgIHByb3BlcnR5LicpO1xuICB9XG5cbiAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmJyZWFrcykge1xuICAgICAgdGhpcy5ydWxlcyA9IGlubGluZS5icmVha3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSBpbmxpbmUuZ2ZtO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICB0aGlzLnJ1bGVzID0gaW5saW5lLnBlZGFudGljO1xuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIElubGluZSBSdWxlc1xuICovXG5cbklubGluZUxleGVyLnJ1bGVzID0gaW5saW5lO1xuXG4vKipcbiAqIFN0YXRpYyBMZXhpbmcvQ29tcGlsaW5nIE1ldGhvZFxuICovXG5cbklubGluZUxleGVyLm91dHB1dCA9IGZ1bmN0aW9uKHNyYywgbGlua3MsIG9wdGlvbnMpIHtcbiAgdmFyIGlubGluZSA9IG5ldyBJbmxpbmVMZXhlcihsaW5rcywgb3B0aW9ucyk7XG4gIHJldHVybiBpbmxpbmUub3V0cHV0KHNyYyk7XG59O1xuXG4vKipcbiAqIExleGluZy9Db21waWxpbmdcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUub3V0cHV0ID0gZnVuY3Rpb24oc3JjKSB7XG4gIHZhciBvdXQgPSAnJ1xuICAgICwgbGlua1xuICAgICwgdGV4dFxuICAgICwgaHJlZlxuICAgICwgY2FwO1xuXG4gIHdoaWxlIChzcmMpIHtcbiAgICAvLyBlc2NhcGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5lc2NhcGUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IGNhcFsxXTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGF1dG9saW5rXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYXV0b2xpbmsuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgaWYgKGNhcFsyXSA9PT0gJ0AnKSB7XG4gICAgICAgIHRleHQgPSBjYXBbMV0uY2hhckF0KDYpID09PSAnOidcbiAgICAgICAgICA/IHRoaXMubWFuZ2xlKGNhcFsxXS5zdWJzdHJpbmcoNykpXG4gICAgICAgICAgOiB0aGlzLm1hbmdsZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGhpcy5tYW5nbGUoJ21haWx0bzonKSArIHRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gZXNjYXBlKGNhcFsxXSk7XG4gICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIubGluayhocmVmLCBudWxsLCB0ZXh0KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHVybCAoZ2ZtKVxuICAgIGlmICghdGhpcy5pbkxpbmsgJiYgKGNhcCA9IHRoaXMucnVsZXMudXJsLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0ZXh0ID0gZXNjYXBlKGNhcFsxXSk7XG4gICAgICBocmVmID0gdGV4dDtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpbmsoaHJlZiwgbnVsbCwgdGV4dCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50YWcuZXhlYyhzcmMpKSB7XG4gICAgICBpZiAoIXRoaXMuaW5MaW5rICYmIC9ePGEgL2kudGVzdChjYXBbMF0pKSB7XG4gICAgICAgIHRoaXMuaW5MaW5rID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkxpbmsgJiYgL148XFwvYT4vaS50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnNhbml0aXplXG4gICAgICAgID8gZXNjYXBlKGNhcFswXSlcbiAgICAgICAgOiBjYXBbMF07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaW5rXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGluay5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGNhcCwge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH0pO1xuICAgICAgdGhpcy5pbkxpbmsgPSBmYWxzZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHJlZmxpbmssIG5vbGlua1xuICAgIGlmICgoY2FwID0gdGhpcy5ydWxlcy5yZWZsaW5rLmV4ZWMoc3JjKSlcbiAgICAgICAgfHwgKGNhcCA9IHRoaXMucnVsZXMubm9saW5rLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBsaW5rID0gKGNhcFsyXSB8fCBjYXBbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgIGxpbmsgPSB0aGlzLmxpbmtzW2xpbmsudG9Mb3dlckNhc2UoKV07XG4gICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICBvdXQgKz0gY2FwWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgc3JjID0gY2FwWzBdLnN1YnN0cmluZygxKSArIHNyYztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0aGlzLmluTGluayA9IHRydWU7XG4gICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGNhcCwgbGluayk7XG4gICAgICB0aGlzLmluTGluayA9IGZhbHNlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gc3Ryb25nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuc3Ryb25nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnN0cm9uZyh0aGlzLm91dHB1dChjYXBbMl0gfHwgY2FwWzFdKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBlbVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmVtLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmVtKHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmNvZGVzcGFuKGVzY2FwZShjYXBbMl0sIHRydWUpKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJyXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYnIuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuYnIoKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGRlbCAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmRlbC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5kZWwodGhpcy5vdXRwdXQoY2FwWzFdKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGV4dC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gZXNjYXBlKHRoaXMuc21hcnR5cGFudHMoY2FwWzBdKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICB0aHJvdyBuZXdcbiAgICAgICAgRXJyb3IoJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb21waWxlIExpbmtcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUub3V0cHV0TGluayA9IGZ1bmN0aW9uKGNhcCwgbGluaykge1xuICB2YXIgaHJlZiA9IGVzY2FwZShsaW5rLmhyZWYpXG4gICAgLCB0aXRsZSA9IGxpbmsudGl0bGUgPyBlc2NhcGUobGluay50aXRsZSkgOiBudWxsO1xuXG4gIHJldHVybiBjYXBbMF0uY2hhckF0KDApICE9PSAnISdcbiAgICA/IHRoaXMucmVuZGVyZXIubGluayhocmVmLCB0aXRsZSwgdGhpcy5vdXRwdXQoY2FwWzFdKSlcbiAgICA6IHRoaXMucmVuZGVyZXIuaW1hZ2UoaHJlZiwgdGl0bGUsIGVzY2FwZShjYXBbMV0pKTtcbn07XG5cbi8qKlxuICogU21hcnR5cGFudHMgVHJhbnNmb3JtYXRpb25zXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLnNtYXJ0eXBhbnRzID0gZnVuY3Rpb24odGV4dCkge1xuICBpZiAoIXRoaXMub3B0aW9ucy5zbWFydHlwYW50cykgcmV0dXJuIHRleHQ7XG4gIHJldHVybiB0ZXh0XG4gICAgLy8gZW0tZGFzaGVzXG4gICAgLnJlcGxhY2UoLy0tL2csICdcXHUyMDE0JylcbiAgICAvLyBvcGVuaW5nIHNpbmdsZXNcbiAgICAucmVwbGFjZSgvKF58Wy1cXHUyMDE0LyhcXFt7XCJcXHNdKScvZywgJyQxXFx1MjAxOCcpXG4gICAgLy8gY2xvc2luZyBzaW5nbGVzICYgYXBvc3Ryb3BoZXNcbiAgICAucmVwbGFjZSgvJy9nLCAnXFx1MjAxOScpXG4gICAgLy8gb3BlbmluZyBkb3VibGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1xcdTIwMThcXHNdKVwiL2csICckMVxcdTIwMWMnKVxuICAgIC8vIGNsb3NpbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC9cIi9nLCAnXFx1MjAxZCcpXG4gICAgLy8gZWxsaXBzZXNcbiAgICAucmVwbGFjZSgvXFwuezN9L2csICdcXHUyMDI2Jyk7XG59O1xuXG4vKipcbiAqIE1hbmdsZSBMaW5rc1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5tYW5nbGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gIHZhciBvdXQgPSAnJ1xuICAgICwgbCA9IHRleHQubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgY2g7XG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBjaCA9IHRleHQuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgY2ggPSAneCcgKyBjaC50b1N0cmluZygxNik7XG4gICAgfVxuICAgIG91dCArPSAnJiMnICsgY2ggKyAnOyc7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZW5kZXJlclxuICovXG5cbmZ1bmN0aW9uIFJlbmRlcmVyKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbn1cblxuUmVuZGVyZXIucHJvdG90eXBlLmNvZGUgPSBmdW5jdGlvbihjb2RlLCBsYW5nLCBlc2NhcGVkKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgdmFyIG91dCA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHQoY29kZSwgbGFuZyk7XG4gICAgaWYgKG91dCAhPSBudWxsICYmIG91dCAhPT0gY29kZSkge1xuICAgICAgZXNjYXBlZCA9IHRydWU7XG4gICAgICBjb2RlID0gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGlmICghbGFuZykge1xuICAgIHJldHVybiAnPHByZT48Y29kZT4nXG4gICAgICArIChlc2NhcGVkID8gY29kZSA6IGVzY2FwZShjb2RlLCB0cnVlKSlcbiAgICAgICsgJ1xcbjwvY29kZT48L3ByZT4nO1xuICB9XG5cbiAgcmV0dXJuICc8cHJlPjxjb2RlIGNsYXNzPVwiJ1xuICAgICsgdGhpcy5vcHRpb25zLmxhbmdQcmVmaXhcbiAgICArIGVzY2FwZShsYW5nLCB0cnVlKVxuICAgICsgJ1wiPidcbiAgICArIChlc2NhcGVkID8gY29kZSA6IGVzY2FwZShjb2RlLCB0cnVlKSlcbiAgICArICdcXG48L2NvZGU+PC9wcmU+XFxuJztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5ibG9ja3F1b3RlID0gZnVuY3Rpb24ocXVvdGUpIHtcbiAgcmV0dXJuICc8YmxvY2txdW90ZT5cXG4nICsgcXVvdGUgKyAnPC9ibG9ja3F1b3RlPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuaHRtbCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuaGVhZGluZyA9IGZ1bmN0aW9uKHRleHQsIGxldmVsLCByYXcpIHtcbiAgcmV0dXJuICc8aCdcbiAgICArIGxldmVsXG4gICAgKyAnIGlkPVwiJ1xuICAgICsgdGhpcy5vcHRpb25zLmhlYWRlclByZWZpeFxuICAgICsgcmF3LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15cXHddKy9nLCAnLScpXG4gICAgKyAnXCI+J1xuICAgICsgdGV4dFxuICAgICsgJzwvaCdcbiAgICArIGxldmVsXG4gICAgKyAnPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuaHIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8aHIvPlxcbicgOiAnPGhyPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKGJvZHksIG9yZGVyZWQpIHtcbiAgdmFyIHR5cGUgPSBvcmRlcmVkID8gJ29sJyA6ICd1bCc7XG4gIHJldHVybiAnPCcgKyB0eXBlICsgJz5cXG4nICsgYm9keSArICc8LycgKyB0eXBlICsgJz5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmxpc3RpdGVtID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxsaT4nICsgdGV4dCArICc8L2xpPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUucGFyYWdyYXBoID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxwPicgKyB0ZXh0ICsgJzwvcD5cXG4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLnRhYmxlID0gZnVuY3Rpb24oaGVhZGVyLCBib2R5KSB7XG4gIHJldHVybiAnPHRhYmxlPlxcbidcbiAgICArICc8dGhlYWQ+XFxuJ1xuICAgICsgaGVhZGVyXG4gICAgKyAnPC90aGVhZD5cXG4nXG4gICAgKyAnPHRib2R5PlxcbidcbiAgICArIGJvZHlcbiAgICArICc8L3Rib2R5PlxcbidcbiAgICArICc8L3RhYmxlPlxcbic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUudGFibGVyb3cgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiAnPHRyPlxcbicgKyBjb250ZW50ICsgJzwvdHI+XFxuJztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS50YWJsZWNlbGwgPSBmdW5jdGlvbihjb250ZW50LCBmbGFncykge1xuICB2YXIgdHlwZSA9IGZsYWdzLmhlYWRlciA/ICd0aCcgOiAndGQnO1xuICB2YXIgdGFnID0gZmxhZ3MuYWxpZ25cbiAgICA/ICc8JyArIHR5cGUgKyAnIHN0eWxlPVwidGV4dC1hbGlnbjonICsgZmxhZ3MuYWxpZ24gKyAnXCI+J1xuICAgIDogJzwnICsgdHlwZSArICc+JztcbiAgcmV0dXJuIHRhZyArIGNvbnRlbnQgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbn07XG5cbi8vIHNwYW4gbGV2ZWwgcmVuZGVyZXJcblJlbmRlcmVyLnByb3RvdHlwZS5zdHJvbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gIHJldHVybiAnPHN0cm9uZz4nICsgdGV4dCArICc8L3N0cm9uZz4nO1xufTtcblxuUmVuZGVyZXIucHJvdG90eXBlLmVtID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxlbT4nICsgdGV4dCArICc8L2VtPic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuY29kZXNwYW4gPSBmdW5jdGlvbih0ZXh0KSB7XG4gIHJldHVybiAnPGNvZGU+JyArIHRleHQgKyAnPC9jb2RlPic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuYnIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8YnIvPicgOiAnPGJyPic7XG59O1xuXG5SZW5kZXJlci5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24odGV4dCkge1xuICByZXR1cm4gJzxkZWw+JyArIHRleHQgKyAnPC9kZWw+Jztcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5saW5rID0gZnVuY3Rpb24oaHJlZiwgdGl0bGUsIHRleHQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgcHJvdCA9IGRlY29kZVVSSUNvbXBvbmVudCh1bmVzY2FwZShocmVmKSlcbiAgICAgICAgLnJlcGxhY2UoL1teXFx3Ol0vZywgJycpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHByb3QuaW5kZXhPZignamF2YXNjcmlwdDonKSA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuICB2YXIgb3V0ID0gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIic7XG4gIGlmICh0aXRsZSkge1xuICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgfVxuICBvdXQgKz0gJz4nICsgdGV4dCArICc8L2E+JztcbiAgcmV0dXJuIG91dDtcbn07XG5cblJlbmRlcmVyLnByb3RvdHlwZS5pbWFnZSA9IGZ1bmN0aW9uKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gIHZhciBvdXQgPSAnPGltZyBzcmM9XCInICsgaHJlZiArICdcIiBhbHQ9XCInICsgdGV4dCArICdcIic7XG4gIGlmICh0aXRsZSkge1xuICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgfVxuICBvdXQgKz0gdGhpcy5vcHRpb25zLnhodG1sID8gJy8+JyA6ICc+JztcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZ1xuICovXG5cbmZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW4gPSBudWxsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5vcHRpb25zLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcjtcbiAgdGhpcy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlcjtcbiAgdGhpcy5yZW5kZXJlci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xufVxuXG4vKipcbiAqIFN0YXRpYyBQYXJzZSBNZXRob2RcbiAqL1xuXG5QYXJzZXIucGFyc2UgPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMsIHJlbmRlcmVyKSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMsIHJlbmRlcmVyKTtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZShzcmMpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBMb29wXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHNyYykge1xuICB0aGlzLmlubGluZSA9IG5ldyBJbmxpbmVMZXhlcihzcmMubGlua3MsIHRoaXMub3B0aW9ucywgdGhpcy5yZW5kZXJlcik7XG4gIHRoaXMudG9rZW5zID0gc3JjLnJldmVyc2UoKTtcblxuICB2YXIgb3V0ID0gJyc7XG4gIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgIG91dCArPSB0aGlzLnRvaygpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpO1xufTtcblxuLyoqXG4gKiBQcmV2aWV3IE5leHQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aCAtIDFdIHx8IDA7XG59O1xuXG4vKipcbiAqIFBhcnNlIFRleHQgVG9rZW5zXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJvZHkgPSB0aGlzLnRva2VuLnRleHQ7XG5cbiAgd2hpbGUgKHRoaXMucGVlaygpLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLm5leHQoKS50ZXh0O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5saW5lLm91dHB1dChib2R5KTtcbn07XG5cbi8qKlxuICogUGFyc2UgQ3VycmVudCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUudG9rID0gZnVuY3Rpb24oKSB7XG4gIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgY2FzZSAnc3BhY2UnOiB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNhc2UgJ2hyJzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaHIoKTtcbiAgICB9XG4gICAgY2FzZSAnaGVhZGluZyc6IHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlYWRpbmcoXG4gICAgICAgIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpLFxuICAgICAgICB0aGlzLnRva2VuLmRlcHRoLFxuICAgICAgICB0aGlzLnRva2VuLnRleHQpO1xuICAgIH1cbiAgICBjYXNlICdjb2RlJzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuY29kZSh0aGlzLnRva2VuLnRleHQsXG4gICAgICAgIHRoaXMudG9rZW4ubGFuZyxcbiAgICAgICAgdGhpcy50b2tlbi5lc2NhcGVkKTtcbiAgICB9XG4gICAgY2FzZSAndGFibGUnOiB7XG4gICAgICB2YXIgaGVhZGVyID0gJydcbiAgICAgICAgLCBib2R5ID0gJydcbiAgICAgICAgLCBpXG4gICAgICAgICwgcm93XG4gICAgICAgICwgY2VsbFxuICAgICAgICAsIGZsYWdzXG4gICAgICAgICwgajtcblxuICAgICAgLy8gaGVhZGVyXG4gICAgICBjZWxsID0gJyc7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy50b2tlbi5oZWFkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmxhZ3MgPSB7IGhlYWRlcjogdHJ1ZSwgYWxpZ246IHRoaXMudG9rZW4uYWxpZ25baV0gfTtcbiAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbChcbiAgICAgICAgICB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pLFxuICAgICAgICAgIHsgaGVhZGVyOiB0cnVlLCBhbGlnbjogdGhpcy50b2tlbi5hbGlnbltpXSB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBoZWFkZXIgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm93ID0gdGhpcy50b2tlbi5jZWxsc1tpXTtcblxuICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjZWxsICs9IHRoaXMucmVuZGVyZXIudGFibGVjZWxsKFxuICAgICAgICAgICAgdGhpcy5pbmxpbmUub3V0cHV0KHJvd1tqXSksXG4gICAgICAgICAgICB7IGhlYWRlcjogZmFsc2UsIGFsaWduOiB0aGlzLnRva2VuLmFsaWduW2pdIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIudGFibGUoaGVhZGVyLCBib2R5KTtcbiAgICB9XG4gICAgY2FzZSAnYmxvY2txdW90ZV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnYmxvY2txdW90ZV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZShib2R5KTtcbiAgICB9XG4gICAgY2FzZSAnbGlzdF9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJydcbiAgICAgICAgLCBvcmRlcmVkID0gdGhpcy50b2tlbi5vcmRlcmVkO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3QoYm9keSwgb3JkZXJlZCk7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3RfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT09ICd0ZXh0J1xuICAgICAgICAgID8gdGhpcy5wYXJzZVRleHQoKVxuICAgICAgICAgIDogdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgfVxuICAgIGNhc2UgJ2xvb3NlX2l0ZW1fc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfaXRlbV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIubGlzdGl0ZW0oYm9keSk7XG4gICAgfVxuICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICB2YXIgaHRtbCA9ICF0aGlzLnRva2VuLnByZSAmJiAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgID8gdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dClcbiAgICAgICAgOiB0aGlzLnRva2VuLnRleHQ7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5odG1sKGh0bWwpO1xuICAgIH1cbiAgICBjYXNlICdwYXJhZ3JhcGgnOiB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgodGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dCkpO1xuICAgIH1cbiAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMucGFyc2VUZXh0KCkpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGh0bWwsIGVuY29kZSkge1xuICByZXR1cm4gaHRtbFxuICAgIC5yZXBsYWNlKCFlbmNvZGUgPyAvJig/ISM/XFx3KzspL2cgOiAvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShodG1sKSB7XG4gIHJldHVybiBodG1sLnJlcGxhY2UoLyYoWyNcXHddKyk7L2csIGZ1bmN0aW9uKF8sIG4pIHtcbiAgICBuID0gbi50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChuID09PSAnY29sb24nKSByZXR1cm4gJzonO1xuICAgIGlmIChuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICByZXR1cm4gbi5jaGFyQXQoMSkgPT09ICd4J1xuICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobi5zdWJzdHJpbmcoMiksIDE2KSlcbiAgICAgICAgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKCtuLnN1YnN0cmluZygxKSk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIG9wdCkge1xuICByZWdleCA9IHJlZ2V4LnNvdXJjZTtcbiAgb3B0ID0gb3B0IHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb24gc2VsZihuYW1lLCB2YWwpIHtcbiAgICBpZiAoIW5hbWUpIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4LCBvcHQpO1xuICAgIHZhbCA9IHZhbC5zb3VyY2UgfHwgdmFsO1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuICAgIHJlZ2V4ID0gcmVnZXgucmVwbGFjZShuYW1lLCB2YWwpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cbm5vb3AuZXhlYyA9IG5vb3A7XG5cbmZ1bmN0aW9uIG1lcmdlKG9iaikge1xuICB2YXIgaSA9IDFcbiAgICAsIHRhcmdldFxuICAgICwga2V5O1xuXG4gIGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5cbi8qKlxuICogTWFya2VkXG4gKi9cblxuZnVuY3Rpb24gbWFya2VkKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAoY2FsbGJhY2sgfHwgdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0O1xuICAgICAgb3B0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQgfHwge30pO1xuXG4gICAgdmFyIGhpZ2hsaWdodCA9IG9wdC5oaWdobGlnaHRcbiAgICAgICwgdG9rZW5zXG4gICAgICAsIHBlbmRpbmdcbiAgICAgICwgaSA9IDA7XG5cbiAgICB0cnkge1xuICAgICAgdG9rZW5zID0gTGV4ZXIubGV4KHNyYywgb3B0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICB9XG5cbiAgICBwZW5kaW5nID0gdG9rZW5zLmxlbmd0aDtcblxuICAgIHZhciBkb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0LCBlcnI7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIG91dCA9IFBhcnNlci5wYXJzZSh0b2tlbnMsIG9wdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVyciA9IGU7XG4gICAgICB9XG5cbiAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG5cbiAgICAgIHJldHVybiBlcnJcbiAgICAgICAgPyBjYWxsYmFjayhlcnIpXG4gICAgICAgIDogY2FsbGJhY2sobnVsbCwgb3V0KTtcbiAgICB9O1xuXG4gICAgaWYgKCFoaWdobGlnaHQgfHwgaGlnaGxpZ2h0Lmxlbmd0aCA8IDMpIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuXG4gICAgZGVsZXRlIG9wdC5oaWdobGlnaHQ7XG5cbiAgICBpZiAoIXBlbmRpbmcpIHJldHVybiBkb25lKCk7XG5cbiAgICBmb3IgKDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgKGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgIGlmICh0b2tlbi50eXBlICE9PSAnY29kZScpIHtcbiAgICAgICAgICByZXR1cm4gLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGlnaGxpZ2h0KHRva2VuLnRleHQsIHRva2VuLmxhbmcsIGZ1bmN0aW9uKGVyciwgY29kZSkge1xuICAgICAgICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZSA9PT0gdG9rZW4udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRva2VuLnRleHQgPSBjb2RlO1xuICAgICAgICAgIHRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkodG9rZW5zW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBpZiAob3B0KSBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICAgIHJldHVybiBQYXJzZXIucGFyc2UoTGV4ZXIubGV4KHNyYywgb3B0KSwgb3B0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGUubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZC4nO1xuICAgIGlmICgob3B0IHx8IG1hcmtlZC5kZWZhdWx0cykuc2lsZW50KSB7XG4gICAgICByZXR1cm4gJzxwPkFuIGVycm9yIG9jY3VyZWQ6PC9wPjxwcmU+J1xuICAgICAgICArIGVzY2FwZShlLm1lc3NhZ2UgKyAnJywgdHJ1ZSlcbiAgICAgICAgKyAnPC9wcmU+JztcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnNcbiAqL1xuXG5tYXJrZWQub3B0aW9ucyA9XG5tYXJrZWQuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdCkge1xuICBtZXJnZShtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gIHJldHVybiBtYXJrZWQ7XG59O1xuXG5tYXJrZWQuZGVmYXVsdHMgPSB7XG4gIGdmbTogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBicmVha3M6IGZhbHNlLFxuICBwZWRhbnRpYzogZmFsc2UsXG4gIHNhbml0aXplOiBmYWxzZSxcbiAgc21hcnRMaXN0czogZmFsc2UsXG4gIHNpbGVudDogZmFsc2UsXG4gIGhpZ2hsaWdodDogbnVsbCxcbiAgbGFuZ1ByZWZpeDogJ2xhbmctJyxcbiAgc21hcnR5cGFudHM6IGZhbHNlLFxuICBoZWFkZXJQcmVmaXg6ICcnLFxuICByZW5kZXJlcjogbmV3IFJlbmRlcmVyLFxuICB4aHRtbDogZmFsc2Vcbn07XG5cbi8qKlxuICogRXhwb3NlXG4gKi9cblxubWFya2VkLlBhcnNlciA9IFBhcnNlcjtcbm1hcmtlZC5wYXJzZXIgPSBQYXJzZXIucGFyc2U7XG5cbm1hcmtlZC5SZW5kZXJlciA9IFJlbmRlcmVyO1xuXG5tYXJrZWQuTGV4ZXIgPSBMZXhlcjtcbm1hcmtlZC5sZXhlciA9IExleGVyLmxleDtcblxubWFya2VkLklubGluZUxleGVyID0gSW5saW5lTGV4ZXI7XG5tYXJrZWQuaW5saW5lTGV4ZXIgPSBJbmxpbmVMZXhlci5vdXRwdXQ7XG5cbm1hcmtlZC5wYXJzZSA9IG1hcmtlZDtcblxuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IG1hcmtlZDtcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG1hcmtlZDsgfSk7XG59IGVsc2Uge1xuICB0aGlzLm1hcmtlZCA9IG1hcmtlZDtcbn1cblxufSkuY2FsbChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMgfHwgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKTtcbn0oKSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIixudWxsLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicSs2NGZ3XCIpKSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl19
