var PostsView = require('../views/posts');
var PostView = require('../views/post');

module.exports = function(router){

	router.posts = function(type){
    	router.view( PostsView, {"type": type || 'posts'} );
	}
	router.post = function(type, slug){
    	router.view( PostView, {"slug": slug, "type": type || 'posts'} );
	}

	router.route('', 'posts');
	router.route(':type', 'posts' );
	router.route(':type/:slug', 'post' );
	
}
