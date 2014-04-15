var ErrorView = require('../views/error');

module.exports = function(router){

	router.error = function(status){
    	router.view( ErrorView, {errorCode: status, group: "errors"} );
  	};

	router.route('500', 'error', router.error.bind(router, 500) );
	router.route('404', 'error', router.error.bind(router, 404) );
	router.route('403', 'error', router.error.bind(router, 403) );

}