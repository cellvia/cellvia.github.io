var PostsView = require('../views/posts');
var SectionsView = require('../views/sections');
var PostView = require('../views/post');

module.exports = function(router){

	router.route('', 'blog', function(type){
		if(!router.exists("sections"))
	    	router.view( SectionsView(), {group: "sections"} );
	    else
	    	router._views.sections[0].reinitialize();
	});

	router.route('articles/:type', 'posts', function(type){
		if(!router.exists(type))
	    	router.view( PostsView({type: type}), {group: type} );
	    else
	    	router._views[type][0].reinitialize();
	});

	router.route('article/:type/:slug', 'post', function(type, slug){
		if(!router.exists(type+slug))
	    	router.view( PostView({slug: slug, type: type}), {group: type+slug} );
	    else
	    	router._views[type+slug][0].reinitialize();
	});

	router.route('tag/:tag', 'taggedPosts', function(tag){
    	router.view( PostsView({"tag": tag}) );
	});
	
}
