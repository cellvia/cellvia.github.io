var PostsView = require('../views/posts');
var SectionsView = require('../views/sections');
var PostView = require('../views/post');

module.exports = function(router){

	router.route('', 'blog', function(type){
		if(!router._views || !router._views.sections)
	    	router.view( SectionsView, {group: "sections"} );
	    else
	    	router._views.sections[0].reinitialize();
	});

	router.route('articles/:type', 'posts', function(type){
		if(!router._views || !router._views[type])
	    	router.view( PostsView, {type: type, group: type} );
	    else
	    	router._views[type][0].reinitialize();
	});

	router.route('article/:type/:slug', 'post', function(type, slug){
    	router.view( PostView, {"slug": slug, "type": type} );
	});

	router.route('tag/:tag', 'taggedPosts', function(tag){
    	router.view( PostsView, {"tag": tag} );
	});
	
}
