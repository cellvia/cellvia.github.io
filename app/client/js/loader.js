var lazyloader = require('lazyloader');
var isIe = isIE();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var now = +new Date();

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

if( isMobile ){
	lazyloader(['/js/desktop-vendor.js', '/js/mobile-app.js?_=' + now]);
	lazyloader.css('/css/topcoat-mobile-light.min.css', function(){
		lazyloader.css('/css/mobile.css?_=' + now);
	});	
}else if( !isIe || isIe > 9){
	lazyloader(['/js/desktop-vendor.js', '/js/mobile-app.js?_=' + now]);
	lazyloader.css('/css/topcoat-mobile-light.min.css', function(){
		lazyloader.css('/css/mobile.css?_=' + now);
	});	
}else if( isIe && isIe <= 9 ){
	lazyloader('/js/ie-app.js?_=' + now);
}
