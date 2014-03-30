var PostsView = require('../views/posts');
var PostView = require('../views/post');

module.exports = function(router){

	router.posts = function(){
    	router.view( PostsView );
	}
	router.route('', 'posts' );
	router.route('posts', 'posts' );

	router.post = function(slug){
    	router.view( PostView, {"slug": slug} );
	}
	router.route('article/:slug', 'post' );
	
}
