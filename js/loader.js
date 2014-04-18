(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
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

	loadCss('/css/topcoat-mobile-light.min.css');
	loadCss('/css/mobile.css?_=' + now);
	lazyloader('/js/desktop-vendor.js', function(){
		//for iscroll support
		if(!!conf.useIScroll) $(document).on('touchmove', function (e) { e.preventDefault(); });
		//load app
		lazyloader('/js/mobile-app.js?_=' + now);
	});	
}else if( !isIe || isIe > 9){
	//browser frame to webapp
	loadMeta()

	//avoid click delay in iphone
	fastclick(document.body);

	loadCss('/css/topcoat-mobile-light.min.css');
	loadCss('/css/mobile.css?_=' + now);
	lazyloader('/js/desktop-vendor.js', function(){
		//for iscroll support
		if(!!conf.useIScroll) $(document).on('touchmove', function (e) { e.preventDefault(); });
		//load app
		lazyloader('/js/mobile-app.js?_=' + now);
	});	
}else if( isIe && isIe <= 9 ){
	lazyloader('/js/ie-app.js?_=' + now);
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
},{"confify":3,"fastclick":4,"lazyloader":5}],3:[function(require,module,exports){
(function (process){
function merge(a, b){
    for(var prop in b){
        a[prop] = b[prop];
    }
}

module.exports = function browser(srcObj){
	if(!process.browser && typeof srcObj === "string") srcObj = require(srcObj);
    merge(browser, srcObj);
};

}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":1}],4:[function(require,module,exports){
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.1
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
	'use strict';
	var oldOnClick;

	options = options || {};

	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = options.touchBoundary || 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	/**
	 * The minimum time between tap(touchstart and touchend) events
	 *
	 * @type number
	 */
	this.tapDelay = options.tapDelay || 200;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}


	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
	'use strict';
	return new FastClick(layer, options);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

},{}],5:[function(require,module,exports){
/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/**
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
*/

// -- Private Variables ------------------------------------------------------
// User agent and feature test information.
var env,

doc = window.document,

// Reference to the <head> element (populated lazily).
head,

// Requests currently in progress, if any.
pending = {},

// Number of times we've polled to check whether a pending stylesheet has
// finished loading. If this gets too high, we're probably stalled.
pollCount = 0,

// Queued requests.
queue = {css: [], js: []},

// Reference to the browser's list of stylesheets.
styleSheets = doc.styleSheets;

// -- Private Methods --------------------------------------------------------

/**
Creates and returns an HTML element with the specified name and attributes.

@method createNode
@param {String} name element name
@param {Object} attrs name/value mapping of element attributes
@return {HTMLElement}
@private
*/
function createNode(name, attrs) {
  var node = doc.createElement(name), attr;

  for (attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      node.setAttribute(attr, attrs[attr]);
    }
  }

  return node;
}

/**
Called when the current pending resource of the specified type has finished
loading. Executes the associated callback (if any) and loads the next
resource in the queue.

@method finish
@param {String} type resource type ('css' or 'js')
@private
*/
function finish(type) {
  var p = pending[type],
      callback,
      urls;

  if (p) {
    callback = p.callback;
    urls     = p.urls;

    urls.shift();
    pollCount = 0;

    // If this is the last of the pending URLs, execute the callback and
    // start the next request in the queue (if any).
    if (!urls.length) {
      callback && callback.call(p.context, p.obj);
      pending[type] = null;
      queue[type].length && load(type);
    }
  }
}

/**
Populates the <code>env</code> variable with user agent and feature test
information.

@method getEnv
@private
*/
function getEnv() {
  var ua = navigator.userAgent;

  env = {
    // True if this browser supports disabling async mode on dynamically
    // created script nodes. See
    // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    async: doc.createElement('script').async === true
  };

  (env.webkit = /AppleWebKit\//.test(ua))
    || (env.ie = /MSIE|Trident/.test(ua))
    || (env.opera = /Opera/.test(ua))
    || (env.gecko = /Gecko\//.test(ua))
    || (env.unknown = true);
}

/**
Loads the specified resources, or the next resource of the specified type
in the queue if no resources are specified. If a resource of the specified
type is already being loaded, the new request will be queued until the
first request has been finished.

When an array of resource URLs is specified, those URLs will be loaded in
parallel if it is possible to do so while preserving execution order. All
browsers support parallel loading of CSS, but only Firefox and Opera
support parallel loading of scripts. In other browsers, scripts will be
queued and loaded one at a time to ensure correct execution order.

@method load
@param {String} type resource type ('css' or 'js')
@param {String|Array} urls (optional) URL or array of URLs to load
@param {Function} callback (optional) callback function to execute when the
  resource is loaded
@param {Object} obj (optional) object to pass to the callback function
@param {Object} context (optional) if provided, the callback function will
  be executed in this object's context
@private
*/
function load(type, urls, callback, obj, context) {
  var _finish = function () { finish(type); },
      isCSS   = type === 'css',
      nodes   = [],
      i, len, node, p, pendingUrls, url;

  env || getEnv();

  if (urls) {
    // If urls is a string, wrap it in an array. Otherwise assume it's an
    // array and create a copy of it so modifications won't be made to the
    // original.
    urls = typeof urls === 'string' ? [urls] : urls.concat();

    // Create a request object for each URL. If multiple URLs are specified,
    // the callback will only be executed after all URLs have been loaded.
    //
    // Sadly, Firefox and Opera are the only browsers capable of loading
    // scripts in parallel while preserving execution order. In all other
    // browsers, scripts must be loaded sequentially.
    //
    // All browsers respect CSS specificity based on the order of the link
    // elements in the DOM, regardless of the order in which the stylesheets
    // are actually downloaded.
    if (isCSS || env.async || env.gecko || env.opera) {
      // Load in parallel.
      queue[type].push({
        urls    : urls,
        callback: callback,
        obj     : obj,
        context : context
      });
    } else {
      // Load sequentially.
      for (i = 0, len = urls.length; i < len; ++i) {
        queue[type].push({
          urls    : [urls[i]],
          callback: i === len - 1 ? callback : null, // callback is only added to the last URL
          obj     : obj,
          context : context
        });
      }
    }
  }

  // If a previous load request of this type is currently in progress, we'll
  // wait our turn. Otherwise, grab the next item in the queue.
  if (pending[type] || !(p = pending[type] = queue[type].shift())) {
    return;
  }

  head || (head = doc.head || doc.getElementsByTagName('head')[0]);
  pendingUrls = p.urls.concat();

  for (i = 0, len = pendingUrls.length; i < len; ++i) {
    url = pendingUrls[i];

    if (isCSS) {
        node = env.gecko ? createNode('style') : createNode('link', {
          href: url,
          rel : 'stylesheet'
        });
    } else {
      node = createNode('script', {src: url});
      node.async = false;
    }

    node.className = 'lazyload';
    node.setAttribute('charset', 'utf-8');

    if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
      node.onreadystatechange = function () {
        if (/loaded|complete/.test(node.readyState)) {
          node.onreadystatechange = null;
          _finish();
        }
      };
    } else if (isCSS && (env.gecko || env.webkit)) {
      // Gecko and WebKit don't support the onload event on link nodes.
      if (env.webkit) {
        // In WebKit, we can poll for changes to document.styleSheets to
        // figure out when stylesheets have loaded.
        p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
        pollWebKit();
      } else {
        // In Gecko, we can import the requested URL into a <style> node and
        // poll for the existence of node.sheet.cssRules. Props to Zach
        // Leatherman for calling my attention to this technique.
        node.innerHTML = '@import "' + url + '";';
        pollGecko(node);
      }
    } else {
      node.onload = node.onerror = _finish;
    }

    nodes.push(node);
  }

  for (i = 0, len = nodes.length; i < len; ++i) {
    head.appendChild(nodes[i]);
  }
}

/**
Begins polling to determine when the specified stylesheet has finished loading
in Gecko. Polling stops when all pending stylesheets have loaded or after 10
seconds (to prevent stalls).

Thanks to Zach Leatherman for calling my attention to the @import-based
cross-domain technique used here, and to Oleg Slobodskoi for an earlier
same-domain implementation. See Zach's blog for more details:
http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

@method pollGecko
@param {HTMLElement} node Style node to poll.
@private
*/
function pollGecko(node) {
  var hasRules;

  try {
    // We don't really need to store this value or ever refer to it again, but
    // if we don't store it, Closure Compiler assumes the code is useless and
    // removes it.
    hasRules = !!node.sheet.cssRules;
  } catch (ex) {
    // An exception means the stylesheet is still loading.
    pollCount += 1;

    if (pollCount < 200) {
      setTimeout(function () { pollGecko(node); }, 50);
    } else {
      // We've been polling for 10 seconds and nothing's happened. Stop
      // polling and finish the pending requests to avoid blocking further
      // requests.
      hasRules && finish('css');
    }

    return;
  }

  // If we get here, the stylesheet has loaded.
  finish('css');
}

/**
Begins polling to determine when pending stylesheets have finished loading
in WebKit. Polling stops when all pending stylesheets have loaded or after 10
seconds (to prevent stalls).

@method pollWebKit
@private
*/
function pollWebKit() {
  var css = pending.css, i;

  if (css) {
    i = styleSheets.length;

    // Look for a stylesheet matching the pending URL.
    while (--i >= 0) {
      if (styleSheets[i].href === css.urls[0]) {
        finish('css');
        break;
      }
    }

    pollCount += 1;

    if (css) {
      if (pollCount < 200) {
        setTimeout(pollWebKit, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened, which may
        // indicate that the stylesheet has been removed from the document
        // before it had a chance to load. Stop polling and finish the pending
        // request to prevent blocking further requests.
        finish('css');
      }
    }
  }
}

var returnObj = {

  /**
  Requests the specified CSS URL or URLs and executes the specified
  callback (if any) when they have finished loading. If an array of URLs is
  specified, the stylesheets will be loaded in parallel and the callback
  will be executed after all stylesheets have finished loading.

  @method css
  @param {String|Array} urls CSS URL or array of CSS URLs to load
  @param {Function} callback (optional) callback function to execute when
    the specified stylesheets are loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function
    will be executed in this object's context
  @static
  */
  css: function (urls, callback, obj, context) {
    load('css', urls, callback, obj, context);
  },

  /**
  Requests the specified JavaScript URL or URLs and executes the specified
  callback (if any) when they have finished loading. If an array of URLs is
  specified and the browser supports it, the scripts will be loaded in
  parallel and the callback will be executed after all scripts have
  finished loading.

  Currently, only Firefox and Opera support parallel loading of scripts while
  preserving execution order. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method js
  @param {String|Array} urls JS URL or array of JS URLs to load
  @param {Function} callback (optional) callback function to execute when
    the specified scripts are loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function
    will be executed in this object's context
  @static
  */
  js: function (urls, callback, obj, context) {
    load('js', urls, callback, obj, context);
  }

};

var LazyLoad = returnObj.js;
LazyLoad.css = returnObj.css;
LazyLoad.js = returnObj.js;

module.exports = LazyLoad;
},{}]},{},[2])