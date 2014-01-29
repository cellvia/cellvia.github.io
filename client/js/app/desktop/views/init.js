var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		this.$el.text( JSON.stringify(this.globalCollection.toJSON()) );
	},
	initialize: function(){
		this.globalCollection = Backbone.collections.global;
		if(!this.globalCollection.fetched){
			this.listenTo(this.globalCollection, "fetched", $.proxy(this.render, this) );
			this.globalCollection.fetch();
		}else{
			this.render();
		}
	}
});