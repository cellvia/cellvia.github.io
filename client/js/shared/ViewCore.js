var viewCache = [];
window.viewCache = viewCache

var conf = require('confify');
var MAXCACHE = conf.maxViewCache;

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
      
      process.nextTick(function(){
        var opts = { parent: this, hits: 1 };
        var returnOpts = _.extend(options, opts);
        var newview = new View(returnOpts);
        _.extend(newview, returnOpts);
        
        this._views[options.group].push(newview);
        this.manageCache(newview);
      }.bind(this));
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