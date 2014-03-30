module.exports = {
    _destroyViews: function(group, options, subview){
      options = options || {};
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        view.destroy(undefined, true);
        view.stopListening();
        if(options.replace === false) return
        var el;        
        if(!subview) 
          el = view.$el;
        if(el && el.length)
          el.replaceWith("<div id="+el.attr('id')+">");          
      });
      delete this._views[group];
    },
    view: function(View, options){
      options = options || {};
      options.group = options.group || "global";
      if(this._views && this._views[options.group]){
        if( options.resetAll === true )
          this.destroy(null, options);
        else if( options.reset !== false )
          this.destroy(null, options);
        if(!this._views) this._views = {};
        if(!this._views[options.group]) this._views[options.group] = [];
        this._views[options.group].push(new View(options))          
      }else{
        this._views = {};
        this._views[options.group] = [new View(options)];
      }
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
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+String(resp.status) });
    }    
}