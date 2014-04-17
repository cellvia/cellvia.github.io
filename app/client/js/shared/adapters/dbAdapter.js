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
		put: function(item){
			return store.set(""+item.id, item);
		},
		iterate: function(iter, opts){
			var all = store.getAll();
			var n = 0;
			for(var p in all)
				if(iter(all[p], n++) === false) break;			
			return opts.onEnd ? opts.onEnd() : false;
		}
	}
}
