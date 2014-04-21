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