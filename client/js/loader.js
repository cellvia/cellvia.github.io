var lazyloader = require('lazyloader');
var fastclick = require('fastclick');
var conf = require('confify');
var isIe = isIE();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
var now = +new Date();

if( isMobile ){
	//browser frame to webapp
	loadMeta()

	//avoid click delay in iphone
	if(isIphone) fastclick(document.body);

	loadCss('/public/css/topcoat-mobile-light.min.css');
	loadCss('/public/css/mobile.css?_=' + now);
	lazyloader('/public/js/desktop-vendor.js', function(){
		//for iscroll support
		if(!!conf.useIScroll) $(document).on('touchmove', function (e) { e.preventDefault(); });
		//load app
		lazyloader('/public/js/mobile-app.js?_=' + now);
	});	
}else if( !isIe || isIe > 9){
	//browser frame to webapp
	loadMeta()

	//avoid click delay in iphone
	fastclick(document.body);

	loadCss('/public/css/topcoat-mobile-light.min.css');
	loadCss('/public/css/mobile.css?_=' + now);
	lazyloader('/public/js/desktop-vendor.js', function(){
		//for iscroll support
		if(!!conf.useIScroll) $(document).on('touchmove', function (e) { e.preventDefault(); });
		//load app
		lazyloader('/public/js/mobile-app.js?_=' + now);
	});	
}else if( isIe && isIe <= 9 ){
	lazyloader('/public/js/ie-app.js?_=' + now);
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function loadMeta(){
	var meta1 = document.createElement('meta');
	meta1.charset = "utf-8";
	document.getElementsByTagName('head')[0].appendChild( meta1 );
	var meta2 = document.createElement('meta');
	meta2.name = "viewport";
	meta2.content = "width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0";
	document.getElementsByTagName('head')[0].appendChild( meta2 );
}

function loadCss(href){
	var link = document.createElement('link');
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = href;
	document.getElementsByTagName('head')[0].appendChild( link );
}