var InitView = require('../views/init');

module.exports = function(router){
	router.init = function(){
		router.destroy();
    	router.view( new InitView() );
	}
}