module.exports = {
    events: function(options) {
      var events = this.options && this.options.parent && this.options.parent === Backbone.router ? { 'click a': '_link' } : {};
      return _.extend({},events,this.viewEvents);
    },
    _link: function(e){
      console.log("clicked")
        e.preventDefault();
        process.nextTick(function(){
          if(e.isPropagationStopped()) return false
          var href = e.currentTarget.getAttribute('href');
          if( !~href.indexOf(".") || ~href.indexOf(document.location.hostname) )
            Backbone.trigger("go", {href: href});          
          else
            window.open(href);
          return false;
        });
    }
}