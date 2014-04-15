module.exports = {
    _destroyViews: function(group, options, subview){
      options = options || {};
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        view.destroy(undefined, {}, true);
        view.stopListening();
        view.undelegateEvents();
        if(options.replace !== true || Backbone.isMobile || subview) return
        var el = view.$el;
        if(el && el.length)
            el.replaceWith("<div id="+el.attr('id')+">");        
      });
      delete this._views[group];
    },
    view: function(View, options){
      options = options || {};
      options.group = options.group || "global";
      if(!this._views) this._views = {};
      if(!this._views[options.group]){
        this._views[options.group] = [];
      }else{
        if( options.resetAll === true )
          this.destroy(null, options);
        else if( options.reset !== false )
          this.destroy(options.group, options);        
      }
      this._views[options.group] = [];
      process.nextTick(function(){          
        var newview = new View(options);
        newview.parent = this;
        newview.group = options.group;
        newview.label = options.label;
        this._views[options.group].push(newview);
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
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+resp.status });
    }    
}