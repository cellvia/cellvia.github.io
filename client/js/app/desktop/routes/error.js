module.exports = function(router){
	router.route('500'                                , 'error'                , $.proxy(function(){ this.error(500); }, router) );
	router.route('404'                                , 'error'                , $.proxy(function(){ this.error(404); }, router) );
	router.route('403'                                , 'error'                , $.proxy(function(){ this.error(403); }, router) );
}