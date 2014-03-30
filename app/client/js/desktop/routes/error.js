var ErrorView = require('../views/error');

module.exports = function(router){

	router.error = function(status){
    	router.view( ErrorView, {errorCode: status, group: "errors"} );
  	};

	router.route('500', 'error', $.proxy(function(){ this.error(500); }, router) );
	router.route('404', 'error', $.proxy(function(){ this.error(404); }, router) );
	router.route('403', 'error', $.proxy(function(){ this.error(403); }, router) );

}