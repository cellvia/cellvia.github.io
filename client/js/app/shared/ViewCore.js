module.exports = {
	_views: {},
    _destroyViews: function(group){
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        view.destroy();
        view.stopListening();
        var el = $(view.$el),
            id = el.attr('id');
        el.replaceWith("<div id="+id+">");        
      });
      delete this._views[group];
    },
    view: function(view, options){
      options = options || {};
      options.group = options.group || "global";
      if( options.reset === true )
        this.destroy();
      if(this._views[options.group]){
        if( options.reset !== true && options.replace !== false )
          this._views[options.group].destroy(options.group);
        this._views[options.group].push(view)          
      }else{
        this._views[options.group] = [view];
      }
    },
    destroy: function(group){
      if(group){
        destroyViews(group)
      }else{
        for(var group in this._views){
          destroyViews(group);
        }
      }
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+String(resp.status) });
    }    
}