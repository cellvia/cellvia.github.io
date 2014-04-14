var lazyloader = require('lazyloader');
var isIe = isIE();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var jsprefix = ~window.location.href.indexOf("github.io") ? "/static/js/" : "/js/";
var cssprefix = ~window.location.href.indexOf("github.io") ? "/static/css/" : "/css/";
var now = +new Date();

if( isMobile ){
	// loadscript(prefix + 'mobile-app.js?_=' + now , noop);
	Backbone.isMobile = true;
	lazyloader(jsprefix + 'desktop-app.js?_=' + now);
	lazyloader.css(cssprefix + 'mobile.css?_=' + now);

}else if( !isIe || isIe > 9){

	lazyloader(jsprefix + 'desktop-app.js?_=' + now);
	lazyloader.css(cssprefix + 'desktop.css?_=' + now);

}else if( isIe && isIe <= 9 ){

	lazyloader(jsprefix + 'ie-app.js?_=' + now);

}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}