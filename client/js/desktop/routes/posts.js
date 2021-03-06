var PostsView = require('../views/posts');
var PostView = require('../views/post');

module.exports = function(router){

	router.route('', 'blog', function(type){
    	// router.destroy(null, {replace: true});
	});

	router.route('tag/:tag', 'taggedPosts', function(tag){
    	router.view( PostsView, {"tag": tag} );
	});

	router.route('articles/:type', 'posts', function(type){
    	router.view( PostsView, {"type": type} );
	});

	router.route('article/:type/:slug', 'post', function(type, slug){
    	router.view( PostView, {"slug": slug, "type": type} );
	});
	
}
