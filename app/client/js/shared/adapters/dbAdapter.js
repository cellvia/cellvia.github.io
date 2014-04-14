var store = require('./store');
var useAdapter = Backbone.isIE && Backbone.isIE < 10;

module.exports = function(options){
	return useAdapter 
		? newstore(options)
		: new IDBStore(options);
}

function newstore(options){
	
	process.nextTick(function(){
		if(options.onStoreReady)
			options.onStoreReady();		
	});

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
		iterate: function(iter, obj){
			var all = store.getAll();
			all.forEach(iter);
			return obj.onEnd ? obj.onEnd() : false;
		}
	}
}
