var ErrorView = require('../views/error');

module.exports = function(router){
	router.error = function(status){
    	router.view( new ErrorView(status), {group: "errors"} );
  	};
}