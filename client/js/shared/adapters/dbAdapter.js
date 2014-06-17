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
