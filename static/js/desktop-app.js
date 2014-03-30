;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var path = require('path'),
	util = require('util'),
    router = require('../shared/Router'),
    foldify = require('foldify'),
    insertCss = require('insert-css'),
    LayoutView = require('./views/layout');

var routes = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require("foldify"), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["error"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\routes\\error.js");returnMe["posts"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\routes\\posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})()),
    controllers = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require("foldify"), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["error"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\controllers\\error.js");returnMe["posts"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\controllers\\posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})()), 
    globalCollections = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require("foldify"), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["global"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\global.js");returnMe["html"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\html.js");returnMe["posts"] = require("C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})()),
    bootstrapLess = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var returnMe = '';returnMe += "//\n// Variables\n// --------------------------------------------------\n\n\n// Global values\n// --------------------------------------------------\n\n// Grays\n// -------------------------\n\n@gray-darker:            lighten(#000, 13.5%); // #222\n@gray-dark:              lighten(#000, 20%);   // #333\n@gray:                   lighten(#000, 33.5%); // #555\n@gray-light:             lighten(#000, 60%);   // #999\n@gray-lighter:           lighten(#000, 93.5%); // #eee\n\n// Brand colors\n// -------------------------\n\n@brand-primary:         #428bca;\n@brand-success:         #5cb85c;\n@brand-warning:         #f0ad4e;\n@brand-danger:          #d9534f;\n@brand-info:            #5bc0de;\n\n// Scaffolding\n// -------------------------\n\n@body-bg:               #fff;\n@text-color:            @gray-dark;\n\n// Links\n// -------------------------\n\n@link-color:            @brand-primary;\n@link-hover-color:      darken(@link-color, 15%);\n\n// Typography\n// -------------------------\n\n@font-family-sans-serif:  \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n@font-family-serif:       Georgia, \"Times New Roman\", Times, serif;\n@font-family-monospace:   Monaco, Menlo, Consolas, \"Courier New\", monospace;\n@font-family-base:        @font-family-sans-serif;\n\n@font-size-base:          14px;\n@font-size-large:         ceil(@font-size-base * 1.25); // ~18px\n@font-size-small:         ceil(@font-size-base * 0.85); // ~12px\n\n@font-size-h1:            floor(@font-size-base * 2.60); // ~36px\n@font-size-h2:            floor(@font-size-base * 2.15); // ~30px\n@font-size-h3:            ceil(@font-size-base * 1.70); // ~24px\n@font-size-h4:            ceil(@font-size-base * 1.25); // ~18px\n@font-size-h5:            @font-size-base;\n@font-size-h6:            ceil(@font-size-base * 0.85); // ~12px\n\n@line-height-base:        1.428571429; // 20/14\n@line-height-computed:    floor(@font-size-base * @line-height-base); // ~20px\n\n@headings-font-family:    @font-family-base;\n@headings-font-weight:    500;\n@headings-line-height:    1.1;\n@headings-color:          inherit;\n\n\n// Iconography\n// -------------------------\n\n@icon-font-path:          \"../fonts/\";\n@icon-font-name:          \"glyphicons-halflings-regular\";\n\n\n// Components\n// -------------------------\n// Based on 14px font-size and 1.428 line-height (~20px to start)\n\n@padding-base-vertical:          6px;\n@padding-base-horizontal:        12px;\n\n@padding-large-vertical:         10px;\n@padding-large-horizontal:       16px;\n\n@padding-small-vertical:         5px;\n@padding-small-horizontal:       10px;\n\n@line-height-large:              1.33;\n@line-height-small:              1.5;\n\n@border-radius-base:             4px;\n@border-radius-large:            6px;\n@border-radius-small:            3px;\n\n@component-active-color:         #fff;\n@component-active-bg:            @brand-primary;\n\n@caret-width-base:               4px;\n@caret-width-large:              5px;\n\n// Tables\n// -------------------------\n\n@table-cell-padding:                 8px;\n@table-condensed-cell-padding:       5px;\n\n@table-bg:                           transparent; // overall background-color\n@table-bg-accent:                    #f9f9f9; // for striping\n@table-bg-hover:                     #f5f5f5;\n@table-bg-active:                    @table-bg-hover;\n\n@table-border-color:                 #ddd; // table and cell border\n\n\n// Buttons\n// -------------------------\n\n@btn-font-weight:                normal;\n\n@btn-default-color:              #333;\n@btn-default-bg:                 #fff;\n@btn-default-border:             #ccc;\n\n@btn-primary-color:              #fff;\n@btn-primary-bg:                 @brand-primary;\n@btn-primary-border:             darken(@btn-primary-bg, 5%);\n\n@btn-success-color:              #fff;\n@btn-success-bg:                 @brand-success;\n@btn-success-border:             darken(@btn-success-bg, 5%);\n\n@btn-warning-color:              #fff;\n@btn-warning-bg:                 @brand-warning;\n@btn-warning-border:             darken(@btn-warning-bg, 5%);\n\n@btn-danger-color:               #fff;\n@btn-danger-bg:                  @brand-danger;\n@btn-danger-border:              darken(@btn-danger-bg, 5%);\n\n@btn-info-color:                 #fff;\n@btn-info-bg:                    @brand-info;\n@btn-info-border:                darken(@btn-info-bg, 5%);\n\n@btn-link-disabled-color:        @gray-light;\n\n\n// Forms\n// -------------------------\n\n@input-bg:                       #fff;\n@input-bg-disabled:              @gray-lighter;\n\n@input-color:                    @gray;\n@input-border:                   #ccc;\n@input-border-radius:            @border-radius-base;\n@input-border-focus:             #66afe9;\n\n@input-color-placeholder:        @gray-light;\n\n@input-height-base:              (@line-height-computed + (@padding-base-vertical * 2) + 2);\n@input-height-large:             (floor(@font-size-large * @line-height-large) + (@padding-large-vertical * 2) + 2);\n@input-height-small:             (floor(@font-size-small * @line-height-small) + (@padding-small-vertical * 2) + 2);\n\n@legend-color:                   @gray-dark;\n@legend-border-color:            #e5e5e5;\n\n@input-group-addon-bg:           @gray-lighter;\n@input-group-addon-border-color: @input-border;\n\n\n// Dropdowns\n// -------------------------\n\n@dropdown-bg:                    #fff;\n@dropdown-border:                rgba(0,0,0,.15);\n@dropdown-fallback-border:       #ccc;\n@dropdown-divider-bg:            #e5e5e5;\n\n@dropdown-link-color:            @gray-dark;\n@dropdown-link-hover-color:      darken(@gray-dark, 5%);\n@dropdown-link-hover-bg:         #f5f5f5;\n\n@dropdown-link-active-color:     @component-active-color;\n@dropdown-link-active-bg:        @component-active-bg;\n\n@dropdown-link-disabled-color:   @gray-light;\n\n@dropdown-header-color:          @gray-light;\n\n@dropdown-caret-color:           #000;\n\n\n// COMPONENT VARIABLES\n// --------------------------------------------------\n\n\n// Z-index master list\n// -------------------------\n// Used for a bird's eye view of components dependent on the z-axis\n// Try to avoid customizing these :)\n\n@zindex-navbar:            1000;\n@zindex-dropdown:          1000;\n@zindex-popover:           1010;\n@zindex-tooltip:           1030;\n@zindex-navbar-fixed:      1030;\n@zindex-modal-background:  1040;\n@zindex-modal:             1050;\n\n// Media queries breakpoints\n// --------------------------------------------------\n\n// Extra small screen / phone\n// Note: Deprecated @screen-xs and @screen-phone as of v3.0.1\n@screen-xs:                  480px;\n@screen-xs-min:              @screen-xs;\n@screen-phone:               @screen-xs-min;\n\n// Small screen / tablet\n// Note: Deprecated @screen-sm and @screen-tablet as of v3.0.1\n@screen-sm:                  768px;\n@screen-sm-min:              @screen-sm;\n@screen-tablet:              @screen-sm-min;\n\n// Medium screen / desktop\n// Note: Deprecated @screen-md and @screen-desktop as of v3.0.1\n@screen-md:                  992px;\n@screen-md-min:              @screen-md;\n@screen-desktop:             @screen-md-min;\n\n// Large screen / wide desktop\n// Note: Deprecated @screen-lg and @screen-lg-desktop as of v3.0.1\n@screen-lg:                  1200px;\n@screen-lg-min:              @screen-lg;\n@screen-lg-desktop:          @screen-lg-min;\n\n// So media queries don't overlap when required, provide a maximum\n@screen-xs-max:              (@screen-sm-min - 1);\n@screen-sm-max:              (@screen-md-min - 1);\n@screen-md-max:              (@screen-lg-min - 1);\n\n\n// Grid system\n// --------------------------------------------------\n\n// Number of columns in the grid system\n@grid-columns:              12;\n// Padding, to be divided by two and applied to the left and right of all columns\n@grid-gutter-width:         30px;\n// Point at which the navbar stops collapsing\n@grid-float-breakpoint:     @screen-sm;\n\n\n// Navbar\n// -------------------------\n\n// Basics of a navbar\n@navbar-height:                    50px;\n@navbar-margin-bottom:             @line-height-computed;\n@navbar-default-color:             #777;\n@navbar-default-bg:                #f8f8f8;\n@navbar-default-border:            darken(@navbar-default-bg, 6.5%);\n@navbar-border-radius:             @border-radius-base;\n@navbar-padding-horizontal:        floor(@grid-gutter-width / 2);\n@navbar-padding-vertical:          ((@navbar-height - @line-height-computed) / 2);\n\n// Navbar links\n@navbar-default-link-color:                #777;\n@navbar-default-link-hover-color:          #333;\n@navbar-default-link-hover-bg:             transparent;\n@navbar-default-link-active-color:         #555;\n@navbar-default-link-active-bg:            darken(@navbar-default-bg, 6.5%);\n@navbar-default-link-disabled-color:       #ccc;\n@navbar-default-link-disabled-bg:          transparent;\n\n// Navbar brand label\n@navbar-default-brand-color:               @navbar-default-link-color;\n@navbar-default-brand-hover-color:         darken(@navbar-default-brand-color, 10%);\n@navbar-default-brand-hover-bg:            transparent;\n\n// Navbar toggle\n@navbar-default-toggle-hover-bg:           #ddd;\n@navbar-default-toggle-icon-bar-bg:        #ccc;\n@navbar-default-toggle-border-color:       #ddd;\n\n\n// Inverted navbar\n//\n// Reset inverted navbar basics\n@navbar-inverse-color:                      @gray-light;\n@navbar-inverse-bg:                         #222;\n@navbar-inverse-border:                     darken(@navbar-inverse-bg, 10%);\n\n// Inverted navbar links\n@navbar-inverse-link-color:                 @gray-light;\n@navbar-inverse-link-hover-color:           #fff;\n@navbar-inverse-link-hover-bg:              transparent;\n@navbar-inverse-link-active-color:          @navbar-inverse-link-hover-color;\n@navbar-inverse-link-active-bg:             darken(@navbar-inverse-bg, 10%);\n@navbar-inverse-link-disabled-color:        #444;\n@navbar-inverse-link-disabled-bg:           transparent;\n\n// Inverted navbar brand label\n@navbar-inverse-brand-color:                @navbar-inverse-link-color;\n@navbar-inverse-brand-hover-color:          #fff;\n@navbar-inverse-brand-hover-bg:             transparent;\n\n// Inverted navbar toggle\n@navbar-inverse-toggle-hover-bg:            #333;\n@navbar-inverse-toggle-icon-bar-bg:         #fff;\n@navbar-inverse-toggle-border-color:        #333;\n\n\n// Navs\n// -------------------------\n\n@nav-link-padding:                          10px 15px;\n@nav-link-hover-bg:                         @gray-lighter;\n\n@nav-disabled-link-color:                   @gray-light;\n@nav-disabled-link-hover-color:             @gray-light;\n\n@nav-open-link-hover-color:                 #fff;\n@nav-open-caret-border-color:               #fff;\n\n// Tabs\n@nav-tabs-border-color:                     #ddd;\n\n@nav-tabs-link-hover-border-color:          @gray-lighter;\n\n@nav-tabs-active-link-hover-bg:             @body-bg;\n@nav-tabs-active-link-hover-color:          @gray;\n@nav-tabs-active-link-hover-border-color:   #ddd;\n\n@nav-tabs-justified-link-border-color:            #ddd;\n@nav-tabs-justified-active-link-border-color:     @body-bg;\n\n// Pills\n@nav-pills-active-link-hover-bg:            @component-active-bg;\n@nav-pills-active-link-hover-color:         @component-active-color;\n\n\n// Pagination\n// -------------------------\n\n@pagination-bg:                        #fff;\n@pagination-border:                    #ddd;\n\n@pagination-hover-bg:                  @gray-lighter;\n\n@pagination-active-bg:                 @brand-primary;\n@pagination-active-color:              #fff;\n\n@pagination-disabled-color:            @gray-light;\n\n\n// Pager\n// -------------------------\n\n@pager-border-radius:                  15px;\n@pager-disabled-color:                 @gray-light;\n\n\n// Jumbotron\n// -------------------------\n\n@jumbotron-padding:              30px;\n@jumbotron-color:                inherit;\n@jumbotron-bg:                   @gray-lighter;\n\n@jumbotron-heading-color:        inherit;\n\n\n// Form states and alerts\n// -------------------------\n\n@state-success-text:             #468847;\n@state-success-bg:               #dff0d8;\n@state-success-border:           darken(spin(@state-success-bg, -10), 5%);\n\n@state-info-text:                #3a87ad;\n@state-info-bg:                  #d9edf7;\n@state-info-border:              darken(spin(@state-info-bg, -10), 7%);\n\n@state-warning-text:             #c09853;\n@state-warning-bg:               #fcf8e3;\n@state-warning-border:           darken(spin(@state-warning-bg, -10), 5%);\n\n@state-danger-text:              #b94a48;\n@state-danger-bg:                #f2dede;\n@state-danger-border:            darken(spin(@state-danger-bg, -10), 5%);\n\n\n// Tooltips\n// -------------------------\n@tooltip-max-width:           200px;\n@tooltip-color:               #fff;\n@tooltip-bg:                  #000;\n\n@tooltip-arrow-width:         5px;\n@tooltip-arrow-color:         @tooltip-bg;\n\n\n// Popovers\n// -------------------------\n@popover-bg:                          #fff;\n@popover-max-width:                   276px;\n@popover-border-color:                rgba(0,0,0,.2);\n@popover-fallback-border-color:       #ccc;\n\n@popover-title-bg:                    darken(@popover-bg, 3%);\n\n@popover-arrow-width:                 10px;\n@popover-arrow-color:                 #fff;\n\n@popover-arrow-outer-width:           (@popover-arrow-width + 1);\n@popover-arrow-outer-color:           rgba(0,0,0,.25);\n@popover-arrow-outer-fallback-color:  #999;\n\n\n// Labels\n// -------------------------\n\n@label-default-bg:            @gray-light;\n@label-primary-bg:            @brand-primary;\n@label-success-bg:            @brand-success;\n@label-info-bg:               @brand-info;\n@label-warning-bg:            @brand-warning;\n@label-danger-bg:             @brand-danger;\n\n@label-color:                 #fff;\n@label-link-hover-color:      #fff;\n\n\n// Modals\n// -------------------------\n@modal-inner-padding:         20px;\n\n@modal-title-padding:         15px;\n@modal-title-line-height:     @line-height-base;\n\n@modal-content-bg:                             #fff;\n@modal-content-border-color:                   rgba(0,0,0,.2);\n@modal-content-fallback-border-color:          #999;\n\n@modal-backdrop-bg:           #000;\n@modal-header-border-color:   #e5e5e5;\n@modal-footer-border-color:   @modal-header-border-color;\n\n\n// Alerts\n// -------------------------\n@alert-padding:               15px;\n@alert-border-radius:         @border-radius-base;\n@alert-link-font-weight:      bold;\n\n@alert-success-bg:            @state-success-bg;\n@alert-success-text:          @state-success-text;\n@alert-success-border:        @state-success-border;\n\n@alert-info-bg:               @state-info-bg;\n@alert-info-text:             @state-info-text;\n@alert-info-border:           @state-info-border;\n\n@alert-warning-bg:            @state-warning-bg;\n@alert-warning-text:          @state-warning-text;\n@alert-warning-border:        @state-warning-border;\n\n@alert-danger-bg:             @state-danger-bg;\n@alert-danger-text:           @state-danger-text;\n@alert-danger-border:         @state-danger-border;\n\n\n// Progress bars\n// -------------------------\n@progress-bg:                 #f5f5f5;\n@progress-bar-color:          #fff;\n\n@progress-bar-bg:             @brand-primary;\n@progress-bar-success-bg:     @brand-success;\n@progress-bar-warning-bg:     @brand-warning;\n@progress-bar-danger-bg:      @brand-danger;\n@progress-bar-info-bg:        @brand-info;\n\n\n// List group\n// -------------------------\n@list-group-bg:               #fff;\n@list-group-border:           #ddd;\n@list-group-border-radius:    @border-radius-base;\n\n@list-group-hover-bg:         #f5f5f5;\n@list-group-active-color:     @component-active-color;\n@list-group-active-bg:        @component-active-bg;\n@list-group-active-border:    @list-group-active-bg;\n\n@list-group-link-color:          #555;\n@list-group-link-heading-color:  #333;\n\n\n// Panels\n// -------------------------\n@panel-bg:                    #fff;\n@panel-inner-border:          #ddd;\n@panel-border-radius:         @border-radius-base;\n@panel-footer-bg:             #f5f5f5;\n\n@panel-default-text:          @gray-dark;\n@panel-default-border:        #ddd;\n@panel-default-heading-bg:    #f5f5f5;\n\n@panel-primary-text:          #fff;\n@panel-primary-border:        @brand-primary;\n@panel-primary-heading-bg:    @brand-primary;\n\n@panel-success-text:          @state-success-text;\n@panel-success-border:        @state-success-border;\n@panel-success-heading-bg:    @state-success-bg;\n\n@panel-warning-text:          @state-warning-text;\n@panel-warning-border:        @state-warning-border;\n@panel-warning-heading-bg:    @state-warning-bg;\n\n@panel-danger-text:           @state-danger-text;\n@panel-danger-border:         @state-danger-border;\n@panel-danger-heading-bg:     @state-danger-bg;\n\n@panel-info-text:             @state-info-text;\n@panel-info-border:           @state-info-border;\n@panel-info-heading-bg:       @state-info-bg;\n\n\n// Thumbnails\n// -------------------------\n@thumbnail-padding:           4px;\n@thumbnail-bg:                @body-bg;\n@thumbnail-border:            #ddd;\n@thumbnail-border-radius:     @border-radius-base;\n\n@thumbnail-caption-color:     @text-color;\n@thumbnail-caption-padding:   9px;\n\n\n// Wells\n// -------------------------\n@well-bg:                     #f5f5f5;\n\n\n// Badges\n// -------------------------\n@badge-color:                 #fff;\n@badge-link-hover-color:      #fff;\n@badge-bg:                    @gray-light;\n\n@badge-active-color:          @link-color;\n@badge-active-bg:             #fff;\n\n@badge-font-weight:           bold;\n@badge-line-height:           1;\n@badge-border-radius:         10px;\n\n\n// Breadcrumbs\n// -------------------------\n@breadcrumb-bg:               #f5f5f5;\n@breadcrumb-color:            #ccc;\n@breadcrumb-active-color:     @gray-light;\n@breadcrumb-separator:        \"/\";\n\n\n// Carousel\n// ------------------------\n\n@carousel-text-shadow:                        0 1px 2px rgba(0,0,0,.6);\n\n@carousel-control-color:                      #fff;\n@carousel-control-width:                      15%;\n@carousel-control-opacity:                    .5;\n@carousel-control-font-size:                  20px;\n\n@carousel-indicator-active-bg:                #fff;\n@carousel-indicator-border-color:             #fff;\n\n@carousel-caption-color:                      #fff;\n\n\n// Close\n// ------------------------\n@close-color:                 #000;\n@close-font-weight:           bold;\n@close-text-shadow:           0 1px 0 #fff;\n\n\n// Code\n// ------------------------\n@code-color:                  #c7254e;\n@code-bg:                     #f9f2f4;\n\n@pre-bg:                      #f5f5f5;\n@pre-color:                   @gray-dark;\n@pre-border-color:            #ccc;\n@pre-scrollable-max-height:   340px;\n\n// Type\n// ------------------------\n@text-muted:                  @gray-light;\n@abbr-border-color:           @gray-light;\n@headings-small-color:        @gray-light;\n@blockquote-small-color:      @gray-light;\n@blockquote-border-color:     @gray-lighter;\n@page-header-border-color:    @gray-lighter;\n\n// Miscellaneous\n// -------------------------\n\n// Hr border color\n@hr-border:                   @gray-lighter;\n\n// Horizontal forms & lists\n@component-offset-horizontal: 180px;\n\n\n// Container sizes\n// --------------------------------------------------\n\n// Small screen / tablet\n@container-tablet:             ((720px + @grid-gutter-width));\n@container-sm:                 @container-tablet;\n\n// Medium screen / desktop\n@container-desktop:            ((940px + @grid-gutter-width));\n@container-md:                 @container-desktop;\n\n// Large screen / wide desktop\n@container-large-desktop:      ((1140px + @grid-gutter-width));\n@container-lg:                 @container-large-desktop;\n";returnMe += "//\n// Mixins\n// --------------------------------------------------\n\n\n// Utilities\n// -------------------------\n\n// Clearfix\n// Source: http://nicolasgallagher.com/micro-clearfix-hack/\n//\n// For modern browsers\n// 1. The space content is one way to avoid an Opera bug when the\n//    contenteditable attribute is included anywhere else in the document.\n//    Otherwise it causes space to appear at the top and bottom of elements\n//    that are clearfixed.\n// 2. The use of `table` rather than `block` is only necessary if using\n//    `:before` to contain the top-margins of child elements.\n.clearfix() {\n  &:before,\n  &:after {\n    content: \" \"; /* 1 */\n    display: table; /* 2 */\n  }\n  &:after {\n    clear: both;\n  }\n}\n\n// Webkit-style focus\n.tab-focus() {\n  // Default\n  outline: thin dotted #333;\n  // Webkit\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\n// Center-align a block level element\n.center-block() {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n// Sizing shortcuts\n.size(@width; @height) {\n  width: @width;\n  height: @height;\n}\n.square(@size) {\n  .size(@size; @size);\n}\n\n// Placeholder text\n.placeholder(@color: @input-color-placeholder) {\n  &:-moz-placeholder            { color: @color; } // Firefox 4-18\n  &::-moz-placeholder           { color: @color; } // Firefox 19+\n  &:-ms-input-placeholder       { color: @color; } // Internet Explorer 10+\n  &::-webkit-input-placeholder  { color: @color; } // Safari and Chrome\n}\n\n// Text overflow\n// Requires inline-block or block for proper styling\n.text-overflow() {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n// CSS image replacement\n//\n// Heads up! v3 launched with with only `.hide-text()`, but per our pattern for\n// mixins being reused as classes with the same name, this doesn't hold up. As\n// of v3.0.1 we have added `.text-hide()` and deprecated `.hide-text()`. Note\n// that we cannot chain the mixins together in Less, so they are repeated.\n//\n// Source: https://github.com/h5bp/html5-boilerplate/commit/aa0396eae757\n\n// Deprecated as of v3.0.1 (will be removed in v4)\n.hide-text() {\n  font: ~\"0/0\" a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n// New mixin to use as of v3.0.1\n.text-hide() {\n  font: ~\"0/0\" a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n\n\n\n// CSS3 PROPERTIES\n// --------------------------------------------------\n\n// Single side border-radius\n.border-top-radius(@radius) {\n  border-top-right-radius: @radius;\n   border-top-left-radius: @radius;\n}\n.border-right-radius(@radius) {\n  border-bottom-right-radius: @radius;\n     border-top-right-radius: @radius;\n}\n.border-bottom-radius(@radius) {\n  border-bottom-right-radius: @radius;\n   border-bottom-left-radius: @radius;\n}\n.border-left-radius(@radius) {\n  border-bottom-left-radius: @radius;\n     border-top-left-radius: @radius;\n}\n\n// Drop shadows\n.box-shadow(@shadow) {\n  -webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1\n          box-shadow: @shadow;\n}\n\n// Transitions\n.transition(@transition) {\n  -webkit-transition: @transition;\n          transition: @transition;\n}\n.transition-property(@transition-property) {\n  -webkit-transition-property: @transition-property;\n          transition-property: @transition-property;\n}\n.transition-delay(@transition-delay) {\n  -webkit-transition-delay: @transition-delay;\n          transition-delay: @transition-delay;\n}\n.transition-duration(@transition-duration) {\n  -webkit-transition-duration: @transition-duration;\n          transition-duration: @transition-duration;\n}\n.transition-transform(@transition) {\n  -webkit-transition: -webkit-transform @transition;\n     -moz-transition: -moz-transform @transition;\n       -o-transition: -o-transform @transition;\n          transition: transform @transition;\n}\n\n// Transformations\n.rotate(@degrees) {\n  -webkit-transform: rotate(@degrees);\n      -ms-transform: rotate(@degrees); // IE9+\n          transform: rotate(@degrees);\n}\n.scale(@ratio) {\n  -webkit-transform: scale(@ratio);\n      -ms-transform: scale(@ratio); // IE9+\n          transform: scale(@ratio);\n}\n.translate(@x; @y) {\n  -webkit-transform: translate(@x, @y);\n      -ms-transform: translate(@x, @y); // IE9+\n          transform: translate(@x, @y);\n}\n.skew(@x; @y) {\n  -webkit-transform: skew(@x, @y);\n      -ms-transform: skewX(@x) skewY(@y); // See https://github.com/twbs/bootstrap/issues/4885; IE9+\n          transform: skew(@x, @y);\n}\n.translate3d(@x; @y; @z) {\n  -webkit-transform: translate3d(@x, @y, @z);\n          transform: translate3d(@x, @y, @z);\n}\n\n.rotateX(@degrees) {\n  -webkit-transform: rotateX(@degrees);\n      -ms-transform: rotateX(@degrees); // IE9+\n          transform: rotateX(@degrees);\n}\n.rotateY(@degrees) {\n  -webkit-transform: rotateY(@degrees);\n      -ms-transform: rotateY(@degrees); // IE9+\n          transform: rotateY(@degrees);\n}\n.perspective(@perspective) {\n  -webkit-perspective: @perspective;\n     -moz-perspective: @perspective;\n          perspective: @perspective;\n}\n.perspective-origin(@perspective) {\n  -webkit-perspective-origin: @perspective;\n     -moz-perspective-origin: @perspective;\n          perspective-origin: @perspective;\n}\n.transform-origin(@origin){\n  -webkit-transform-origin: @origin;\n     -moz-transform-origin: @origin;\n          transform-origin: @origin;\n}\n\n\n// Backface visibility\n// Prevent browsers from flickering when using CSS 3D transforms.\n// Default value is `visible`, but can be changed to `hidden`\n// See git pull https://github.com/dannykeane/bootstrap.git backface-visibility for examples\n.backface-visibility(@visibility){\n  -webkit-backface-visibility: @visibility;\n     -moz-backface-visibility: @visibility;\n          backface-visibility: @visibility;\n}\n\n// Box sizing\n.box-sizing(@boxmodel) {\n  -webkit-box-sizing: @boxmodel;\n     -moz-box-sizing: @boxmodel;\n          box-sizing: @boxmodel;\n}\n\n// User select\n// For selecting text on the page\n.user-select(@select) {\n  -webkit-user-select: @select;\n     -moz-user-select: @select;\n      -ms-user-select: @select; // IE10+\n       -o-user-select: @select;\n          user-select: @select;\n}\n\n// Resize anything\n.resizable(@direction) {\n  resize: @direction; // Options: horizontal, vertical, both\n  overflow: auto; // Safari fix\n}\n\n// CSS3 Content Columns\n.content-columns(@column-count; @column-gap: @grid-gutter-width) {\n  -webkit-column-count: @column-count;\n     -moz-column-count: @column-count;\n          column-count: @column-count;\n  -webkit-column-gap: @column-gap;\n     -moz-column-gap: @column-gap;\n          column-gap: @column-gap;\n}\n\n// Optional hyphenation\n.hyphens(@mode: auto) {\n  word-wrap: break-word;\n  -webkit-hyphens: @mode;\n     -moz-hyphens: @mode;\n      -ms-hyphens: @mode; // IE10+\n       -o-hyphens: @mode;\n          hyphens: @mode;\n}\n\n// Opacity\n.opacity(@opacity) {\n  opacity: @opacity;\n  // IE8 filter\n  @opacity-ie: (@opacity * 100);\n  filter: ~\"alpha(opacity=@{opacity-ie})\";\n}\n\n\n\n// GRADIENTS\n// --------------------------------------------------\n\n#gradient {\n\n  // Horizontal gradient, from left to right\n  //\n  // Creates two color stops, start and end, by specifying a color and position for each color stop.\n  // Color stops are not available in IE9 and below.\n  .horizontal(@start-color: #555; @end-color: #333; @start-percent: 0%; @end-percent: 100%) {\n    background-image: -webkit-gradient(linear, @start-percent top, @end-percent top, from(@start-color), to(@end-color)); // Safari 4+, Chrome 2+\n    background-image: -webkit-linear-gradient(left, color-stop(@start-color @start-percent), color-stop(@end-color @end-percent)); // Safari 5.1+, Chrome 10+\n    background-image: -moz-linear-gradient(left, @start-color @start-percent, @end-color @end-percent); // FF 3.6+\n    background-image:  linear-gradient(to right, @start-color @start-percent, @end-color @end-percent); // Standard, IE10\n    background-repeat: repeat-x;\n    filter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=1)\",argb(@start-color),argb(@end-color))); // IE9 and down\n  }\n\n  // Vertical gradient, from top to bottom\n  //\n  // Creates two color stops, start and end, by specifying a color and position for each color stop.\n  // Color stops are not available in IE9 and below.\n  .vertical(@start-color: #555; @end-color: #333; @start-percent: 0%; @end-percent: 100%) {\n    background-image: -webkit-gradient(linear, left @start-percent, left @end-percent, from(@start-color), to(@end-color)); // Safari 4+, Chrome 2+\n    background-image: -webkit-linear-gradient(top, @start-color, @start-percent, @end-color, @end-percent); // Safari 5.1+, Chrome 10+\n    background-image:  -moz-linear-gradient(top, @start-color @start-percent, @end-color @end-percent); // FF 3.6+\n    background-image: linear-gradient(to bottom, @start-color @start-percent, @end-color @end-percent); // Standard, IE10\n    background-repeat: repeat-x;\n    filter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=0)\",argb(@start-color),argb(@end-color))); // IE9 and down\n  }\n\n  .directional(@start-color: #555; @end-color: #333; @deg: 45deg) {\n    background-repeat: repeat-x;\n    background-image: -webkit-linear-gradient(@deg, @start-color, @end-color); // Safari 5.1+, Chrome 10+\n    background-image: -moz-linear-gradient(@deg, @start-color, @end-color); // FF 3.6+\n    background-image: linear-gradient(@deg, @start-color, @end-color); // Standard, IE10\n  }\n  .horizontal-three-colors(@start-color: #00b3ee; @mid-color: #7a43b6; @color-stop: 50%; @end-color: #c3325f) {\n    background-image: -webkit-gradient(left, linear, 0 0, 0 100%, from(@start-color), color-stop(@color-stop, @mid-color), to(@end-color));\n    background-image: -webkit-linear-gradient(left, @start-color, @mid-color @color-stop, @end-color);\n    background-image: -moz-linear-gradient(left, @start-color, @mid-color @color-stop, @end-color);\n    background-image: linear-gradient(to right, @start-color, @mid-color @color-stop, @end-color);\n    background-repeat: no-repeat;\n    filter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=1)\",argb(@start-color),argb(@end-color))); // IE9 and down, gets no color-stop at all for proper fallback\n  }\n  .vertical-three-colors(@start-color: #00b3ee; @mid-color: #7a43b6; @color-stop: 50%; @end-color: #c3325f) {\n    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(@start-color), color-stop(@color-stop, @mid-color), to(@end-color));\n    background-image: -webkit-linear-gradient(@start-color, @mid-color @color-stop, @end-color);\n    background-image: -moz-linear-gradient(top, @start-color, @mid-color @color-stop, @end-color);\n    background-image: linear-gradient(@start-color, @mid-color @color-stop, @end-color);\n    background-repeat: no-repeat;\n    filter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=0)\",argb(@start-color),argb(@end-color))); // IE9 and down, gets no color-stop at all for proper fallback\n  }\n  .radial(@inner-color: #555; @outer-color: #333) {\n    background-image: -webkit-gradient(radial, center center, 0, center center, 460, from(@inner-color), to(@outer-color));\n    background-image: -webkit-radial-gradient(circle, @inner-color, @outer-color);\n    background-image: -moz-radial-gradient(circle, @inner-color, @outer-color);\n    background-image: radial-gradient(circle, @inner-color, @outer-color);\n    background-repeat: no-repeat;\n  }\n  .striped(@color: rgba(255,255,255,.15); @angle: 45deg) {\n    background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, @color), color-stop(.25, transparent), color-stop(.5, transparent), color-stop(.5, @color), color-stop(.75, @color), color-stop(.75, transparent), to(transparent));\n    background-image: -webkit-linear-gradient(@angle, @color 25%, transparent 25%, transparent 50%, @color 50%, @color 75%, transparent 75%, transparent);\n    background-image: -moz-linear-gradient(@angle, @color 25%, transparent 25%, transparent 50%, @color 50%, @color 75%, transparent 75%, transparent);\n    background-image: linear-gradient(@angle, @color 25%, transparent 25%, transparent 50%, @color 50%, @color 75%, transparent 75%, transparent);\n  }\n}\n\n// Reset filters for IE\n//\n// When you need to remove a gradient background, do not forget to use this to reset\n// the IE filter for IE9 and below.\n.reset-filter() {\n  filter: e(%(\"progid:DXImageTransform.Microsoft.gradient(enabled = false)\"));\n}\n\n\n\n// Retina images\n//\n// Short retina mixin for setting background-image and -size\n\n.img-retina(@file-1x; @file-2x; @width-1x; @height-1x) {\n  background-image: url(\"@{file-1x}\");\n\n  @media\n  only screen and (-webkit-min-device-pixel-ratio: 2),\n  only screen and (   min--moz-device-pixel-ratio: 2),\n  only screen and (     -o-min-device-pixel-ratio: 2/1),\n  only screen and (        min-device-pixel-ratio: 2),\n  only screen and (                min-resolution: 192dpi),\n  only screen and (                min-resolution: 2dppx) {\n    background-image: url(\"@{file-2x}\");\n    background-size: @width-1x @height-1x;\n  }\n}\n\n\n// Responsive image\n//\n// Keep images from scaling beyond the width of their parents.\n\n.img-responsive(@display: block;) {\n  display: @display;\n  max-width: 100%; // Part 1: Set a maximum relative to the parent\n  height: auto; // Part 2: Scale the height according to the width, otherwise you get stretching\n}\n\n\n// COMPONENT MIXINS\n// --------------------------------------------------\n\n// Horizontal dividers\n// -------------------------\n// Dividers (basically an hr) within dropdowns and nav lists\n.nav-divider(@color: #e5e5e5) {\n  height: 1px;\n  margin: ((@line-height-computed / 2) - 1) 0;\n  overflow: hidden;\n  background-color: @color;\n}\n\n// Panels\n// -------------------------\n.panel-variant(@border; @heading-text-color; @heading-bg-color; @heading-border;) {\n  border-color: @border;\n  & > .panel-heading {\n    color: @heading-text-color;\n    background-color: @heading-bg-color;\n    border-color: @heading-border;\n    + .panel-collapse .panel-body {\n      border-top-color: @border;\n    }\n  }\n  & > .panel-footer {\n    + .panel-collapse .panel-body {\n      border-bottom-color: @border;\n    }\n  }\n}\n\n// Alerts\n// -------------------------\n.alert-variant(@background; @border; @text-color) {\n  background-color: @background;\n  border-color: @border;\n  color: @text-color;\n  hr {\n    border-top-color: darken(@border, 5%);\n  }\n  .alert-link {\n    color: darken(@text-color, 10%);\n  }\n}\n\n// Tables\n// -------------------------\n.table-row-variant(@state; @background; @border) {\n  // Exact selectors below required to override `.table-striped` and prevent\n  // inheritance to nested tables.\n  .table > thead > tr,\n  .table > tbody > tr,\n  .table > tfoot > tr {\n    > td.@{state},\n    > th.@{state},\n    &.@{state} > td,\n    &.@{state} > th {\n      background-color: @background;\n      border-color: @border;\n    }\n  }\n\n  // Hover states for `.table-hover`\n  // Note: this is not available for cells or rows within `thead` or `tfoot`.\n  .table-hover > tbody > tr {\n    > td.@{state}:hover,\n    > th.@{state}:hover,\n    &.@{state}:hover > td,\n    &.@{state}:hover > th {\n      background-color: darken(@background, 5%);\n      border-color: darken(@border, 5%);\n    }\n  }\n}\n\n// Button variants\n// -------------------------\n// Easily pump out default styles, as well as :hover, :focus, :active,\n// and disabled options for all buttons\n.button-variant(@color; @background; @border) {\n  color: @color;\n  background-color: @background;\n  border-color: @border;\n\n  &:hover,\n  &:focus,\n  &:active,\n  &.active,\n  .open .dropdown-toggle& {\n    color: @color;\n    background-color: darken(@background, 8%);\n        border-color: darken(@border, 12%);\n  }\n  &:active,\n  &.active,\n  .open .dropdown-toggle& {\n    background-image: none;\n  }\n  &.disabled,\n  &[disabled],\n  fieldset[disabled] & {\n    &,\n    &:hover,\n    &:focus,\n    &:active,\n    &.active {\n      background-color: @background;\n          border-color: @border;\n    }\n  }\n}\n\n// Button sizes\n// -------------------------\n.button-size(@padding-vertical; @padding-horizontal; @font-size; @line-height; @border-radius) {\n  padding: @padding-vertical @padding-horizontal;\n  font-size: @font-size;\n  line-height: @line-height;\n  border-radius: @border-radius;\n}\n\n// Pagination\n// -------------------------\n.pagination-size(@padding-vertical; @padding-horizontal; @font-size; @border-radius) {\n  > li {\n    > a,\n    > span {\n      padding: @padding-vertical @padding-horizontal;\n      font-size: @font-size;\n    }\n    &:first-child {\n      > a,\n      > span {\n        .border-left-radius(@border-radius);\n      }\n    }\n    &:last-child {\n      > a,\n      > span {\n        .border-right-radius(@border-radius);\n      }\n    }\n  }\n}\n\n// Labels\n// -------------------------\n.label-variant(@color) {\n  background-color: @color;\n  &[href] {\n    &:hover,\n    &:focus {\n      background-color: darken(@color, 10%);\n    }\n  }\n}\n\n// Navbar vertical align\n// -------------------------\n// Vertically center elements in the navbar.\n// Example: an element has a height of 30px, so write out `.navbar-vertical-align(30px);` to calculate the appropriate top margin.\n.navbar-vertical-align(@element-height) {\n  margin-top: ((@navbar-height - @element-height) / 2);\n  margin-bottom: ((@navbar-height - @element-height) / 2);\n}\n\n// Progress bars\n// -------------------------\n.progress-bar-variant(@color) {\n  background-color: @color;\n  .progress-striped & {\n    #gradient > .striped();\n  }\n}\n\n// Responsive utilities\n// -------------------------\n// More easily include all the states for responsive-utilities.less.\n.responsive-visibility() {\n  display: block !important;\n  tr& { display: table-row !important; }\n  th&,\n  td& { display: table-cell !important; }\n}\n\n.responsive-invisibility() {\n  display: none !important;\n  tr& { display: none !important; }\n  th&,\n  td& { display: none !important; }\n}\n\n// Grid System\n// -----------\n\n// Centered container element\n.container-fixed() {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left:  (@grid-gutter-width / 2);\n  padding-right: (@grid-gutter-width / 2);\n  .clearfix();\n}\n\n// Creates a wrapper for a series of columns\n.make-row(@gutter: @grid-gutter-width) {\n  margin-left:  (@gutter / -2);\n  margin-right: (@gutter / -2);\n  .clearfix();\n}\n\n// Generate the extra small columns\n.make-xs-column(@columns; @gutter: @grid-gutter-width) {\n  position: relative;\n  float: left;\n  width: percentage((@columns / @grid-columns));\n  // Prevent columns from collapsing when empty\n  min-height: 1px;\n  // Inner gutter via padding\n  padding-left:  (@gutter / 2);\n  padding-right: (@gutter / 2);\n}\n\n// Generate the small columns\n.make-sm-column(@columns; @gutter: @grid-gutter-width) {\n  position: relative;\n  // Prevent columns from collapsing when empty\n  min-height: 1px;\n  // Inner gutter via padding\n  padding-left:  (@gutter / 2);\n  padding-right: (@gutter / 2);\n\n  // Calculate width based on number of columns available\n  @media (min-width: @screen-sm-min) {\n    float: left;\n    width: percentage((@columns / @grid-columns));\n  }\n}\n\n// Generate the small column offsets\n.make-sm-column-offset(@columns) {\n  @media (min-width: @screen-sm-min) {\n    margin-left: percentage((@columns / @grid-columns));\n  }\n}\n.make-sm-column-push(@columns) {\n  @media (min-width: @screen-sm-min) {\n    left: percentage((@columns / @grid-columns));\n  }\n}\n.make-sm-column-pull(@columns) {\n  @media (min-width: @screen-sm-min) {\n    right: percentage((@columns / @grid-columns));\n  }\n}\n\n// Generate the medium columns\n.make-md-column(@columns; @gutter: @grid-gutter-width) {\n  position: relative;\n  // Prevent columns from collapsing when empty\n  min-height: 1px;\n  // Inner gutter via padding\n  padding-left:  (@gutter / 2);\n  padding-right: (@gutter / 2);\n\n  // Calculate width based on number of columns available\n  @media (min-width: @screen-md-min) {\n    float: left;\n    width: percentage((@columns / @grid-columns));\n  }\n}\n\n// Generate the medium column offsets\n.make-md-column-offset(@columns) {\n  @media (min-width: @screen-md-min) {\n    margin-left: percentage((@columns / @grid-columns));\n  }\n}\n.make-md-column-push(@columns) {\n  @media (min-width: @screen-md) {\n    left: percentage((@columns / @grid-columns));\n  }\n}\n.make-md-column-pull(@columns) {\n  @media (min-width: @screen-md-min) {\n    right: percentage((@columns / @grid-columns));\n  }\n}\n\n// Generate the large columns\n.make-lg-column(@columns; @gutter: @grid-gutter-width) {\n  position: relative;\n  // Prevent columns from collapsing when empty\n  min-height: 1px;\n  // Inner gutter via padding\n  padding-left:  (@gutter / 2);\n  padding-right: (@gutter / 2);\n\n  // Calculate width based on number of columns available\n  @media (min-width: @screen-lg-min) {\n    float: left;\n    width: percentage((@columns / @grid-columns));\n  }\n}\n\n// Generate the large column offsets\n.make-lg-column-offset(@columns) {\n  @media (min-width: @screen-lg-min) {\n    margin-left: percentage((@columns / @grid-columns));\n  }\n}\n.make-lg-column-push(@columns) {\n  @media (min-width: @screen-lg-min) {\n    left: percentage((@columns / @grid-columns));\n  }\n}\n.make-lg-column-pull(@columns) {\n  @media (min-width: @screen-lg-min) {\n    right: percentage((@columns / @grid-columns));\n  }\n}\n\n\n// Form validation states\n//\n// Used in forms.less to generate the form validation CSS for warnings, errors,\n// and successes.\n\n.form-control-validation(@text-color: #555; @border-color: #ccc; @background-color: #f5f5f5) {\n  // Color the label and help text\n  .help-block,\n  .control-label {\n    color: @text-color;\n  }\n  // Set the border and box shadow on specific inputs to match\n  .form-control {\n    border-color: @border-color;\n    .box-shadow(inset 0 1px 1px rgba(0,0,0,.075)); // Redeclare so transitions work\n    &:focus {\n      border-color: darken(@border-color, 10%);\n      @shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px lighten(@border-color, 20%);\n      .box-shadow(@shadow);\n    }\n  }\n  // Set validation states also for addons\n  .input-group-addon {\n    color: @text-color;\n    border-color: @border-color;\n    background-color: @background-color;\n  }\n}\n\n// Form control focus state\n//\n// Generate a customized focus state and for any input with the specified color,\n// which defaults to the `@input-focus-border` variable.\n//\n// We highly encourage you to not customize the default value, but instead use\n// this to tweak colors on an as-needed basis. This aesthetic change is based on\n// WebKit's default styles, but applicable to a wider range of browsers. Its\n// usability and accessibility should be taken into account with any change.\n//\n// Example usage: change the default blue border and shadow to white for better\n// contrast against a dark gray background.\n\n.form-control-focus(@color: @input-border-focus) {\n  @color-rgba: rgba(red(@color), green(@color), blue(@color), .6);\n  &:focus {\n    border-color: @color;\n    outline: 0;\n    .box-shadow(~\"inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px @{color-rgba}\");\n  }\n}\n\n// Form control sizing\n//\n// Relative text size, padding, and border-radii changes for form controls. For\n// horizontal sizing, wrap controls in the predefined grid classes. `<select>`\n// element gets special love because it's special, and that's a fact!\n\n.input-size(@input-height; @padding-vertical; @padding-horizontal; @font-size; @line-height; @border-radius) {\n  height: @input-height;\n  padding: @padding-vertical @padding-horizontal;\n  font-size: @font-size;\n  line-height: @line-height;\n  border-radius: @border-radius;\n\n  select& {\n    height: @input-height;\n    line-height: @input-height;\n  }\n\n  textarea& {\n    height: auto;\n  }\n}\n";returnMe += "//\n// Grid system\n// --------------------------------------------------\n\n\n// Set the container width, and override it for fixed navbars in media queries\n.container {\n  .container-fixed();\n}\n\n// mobile first defaults\n.row {\n  .make-row();\n}\n\n// Common styles for small and large grid columns\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-sm-1,\n.col-sm-2,\n.col-sm-3,\n.col-sm-4,\n.col-sm-5,\n.col-sm-6,\n.col-sm-7,\n.col-sm-8,\n.col-sm-9,\n.col-sm-10,\n.col-sm-11,\n.col-sm-12,\n.col-md-1,\n.col-md-2,\n.col-md-3,\n.col-md-4,\n.col-md-5,\n.col-md-6,\n.col-md-7,\n.col-md-8,\n.col-md-9,\n.col-md-10,\n.col-md-11,\n.col-md-12,\n.col-lg-1,\n.col-lg-2,\n.col-lg-3,\n.col-lg-4,\n.col-lg-5,\n.col-lg-6,\n.col-lg-7,\n.col-lg-8,\n.col-lg-9,\n.col-lg-10,\n.col-lg-11,\n.col-lg-12 {\n  position: relative;\n  // Prevent columns from collapsing when empty\n  min-height: 1px;\n  // Inner gutter via padding\n  padding-left:  (@grid-gutter-width / 2);\n  padding-right: (@grid-gutter-width / 2);\n}\n\n\n// Extra small grid\n//\n// Grid classes for extra small devices like smartphones. No offset, push, or\n// pull classes are present here due to the size of the target.\n//\n// Note that `.col-xs-12` doesn't get floated on purpose--there's no need since\n// it's full-width.\n\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11 {\n  float: left;\n}\n.col-xs-1  { width: percentage((1 / @grid-columns)); }\n.col-xs-2  { width: percentage((2 / @grid-columns)); }\n.col-xs-3  { width: percentage((3 / @grid-columns)); }\n.col-xs-4  { width: percentage((4 / @grid-columns)); }\n.col-xs-5  { width: percentage((5 / @grid-columns)); }\n.col-xs-6  { width: percentage((6 / @grid-columns)); }\n.col-xs-7  { width: percentage((7 / @grid-columns)); }\n.col-xs-8  { width: percentage((8 / @grid-columns)); }\n.col-xs-9  { width: percentage((9 / @grid-columns)); }\n.col-xs-10 { width: percentage((10/ @grid-columns)); }\n.col-xs-11 { width: percentage((11/ @grid-columns)); }\n.col-xs-12 { width: 100%; }\n\n\n// Small grid\n//\n// Columns, offsets, pushes, and pulls for the small device range, from phones\n// to tablets.\n//\n// Note that `.col-sm-12` doesn't get floated on purpose--there's no need since\n// it's full-width.\n\n@media (min-width: @screen-sm) {\n  .container {\n    width: @container-sm;\n  }\n\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11 {\n    float: left;\n  }\n  .col-sm-1  { width: percentage((1 / @grid-columns)); }\n  .col-sm-2  { width: percentage((2 / @grid-columns)); }\n  .col-sm-3  { width: percentage((3 / @grid-columns)); }\n  .col-sm-4  { width: percentage((4 / @grid-columns)); }\n  .col-sm-5  { width: percentage((5 / @grid-columns)); }\n  .col-sm-6  { width: percentage((6 / @grid-columns)); }\n  .col-sm-7  { width: percentage((7 / @grid-columns)); }\n  .col-sm-8  { width: percentage((8 / @grid-columns)); }\n  .col-sm-9  { width: percentage((9 / @grid-columns)); }\n  .col-sm-10 { width: percentage((10/ @grid-columns)); }\n  .col-sm-11 { width: percentage((11/ @grid-columns)); }\n  .col-sm-12 { width: 100%; }\n\n  // Push and pull columns for source order changes\n  .col-sm-push-1  { left: percentage((1 / @grid-columns)); }\n  .col-sm-push-2  { left: percentage((2 / @grid-columns)); }\n  .col-sm-push-3  { left: percentage((3 / @grid-columns)); }\n  .col-sm-push-4  { left: percentage((4 / @grid-columns)); }\n  .col-sm-push-5  { left: percentage((5 / @grid-columns)); }\n  .col-sm-push-6  { left: percentage((6 / @grid-columns)); }\n  .col-sm-push-7  { left: percentage((7 / @grid-columns)); }\n  .col-sm-push-8  { left: percentage((8 / @grid-columns)); }\n  .col-sm-push-9  { left: percentage((9 / @grid-columns)); }\n  .col-sm-push-10 { left: percentage((10/ @grid-columns)); }\n  .col-sm-push-11 { left: percentage((11/ @grid-columns)); }\n\n  .col-sm-pull-1  { right: percentage((1 / @grid-columns)); }\n  .col-sm-pull-2  { right: percentage((2 / @grid-columns)); }\n  .col-sm-pull-3  { right: percentage((3 / @grid-columns)); }\n  .col-sm-pull-4  { right: percentage((4 / @grid-columns)); }\n  .col-sm-pull-5  { right: percentage((5 / @grid-columns)); }\n  .col-sm-pull-6  { right: percentage((6 / @grid-columns)); }\n  .col-sm-pull-7  { right: percentage((7 / @grid-columns)); }\n  .col-sm-pull-8  { right: percentage((8 / @grid-columns)); }\n  .col-sm-pull-9  { right: percentage((9 / @grid-columns)); }\n  .col-sm-pull-10 { right: percentage((10/ @grid-columns)); }\n  .col-sm-pull-11 { right: percentage((11/ @grid-columns)); }\n\n  // Offsets\n  .col-sm-offset-1  { margin-left: percentage((1 / @grid-columns)); }\n  .col-sm-offset-2  { margin-left: percentage((2 / @grid-columns)); }\n  .col-sm-offset-3  { margin-left: percentage((3 / @grid-columns)); }\n  .col-sm-offset-4  { margin-left: percentage((4 / @grid-columns)); }\n  .col-sm-offset-5  { margin-left: percentage((5 / @grid-columns)); }\n  .col-sm-offset-6  { margin-left: percentage((6 / @grid-columns)); }\n  .col-sm-offset-7  { margin-left: percentage((7 / @grid-columns)); }\n  .col-sm-offset-8  { margin-left: percentage((8 / @grid-columns)); }\n  .col-sm-offset-9  { margin-left: percentage((9 / @grid-columns)); }\n  .col-sm-offset-10 { margin-left: percentage((10/ @grid-columns)); }\n  .col-sm-offset-11 { margin-left: percentage((11/ @grid-columns)); }\n}\n\n\n// Medium grid\n//\n// Columns, offsets, pushes, and pulls for the desktop device range.\n//\n// Note that `.col-md-12` doesn't get floated on purpose--there's no need since\n// it's full-width.\n\n@media (min-width: @screen-md) {\n  .container {\n    width: @container-md;\n  }\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11 {\n    float: left;\n  }\n  .col-md-1  { width: percentage((1 / @grid-columns)); }\n  .col-md-2  { width: percentage((2 / @grid-columns)); }\n  .col-md-3  { width: percentage((3 / @grid-columns)); }\n  .col-md-4  { width: percentage((4 / @grid-columns)); }\n  .col-md-5  { width: percentage((5 / @grid-columns)); }\n  .col-md-6  { width: percentage((6 / @grid-columns)); }\n  .col-md-7  { width: percentage((7 / @grid-columns)); }\n  .col-md-8  { width: percentage((8 / @grid-columns)); }\n  .col-md-9  { width: percentage((9 / @grid-columns)); }\n  .col-md-10 { width: percentage((10/ @grid-columns)); }\n  .col-md-11 { width: percentage((11/ @grid-columns)); }\n  .col-md-12 { width: 100%; }\n\n  // Push and pull columns for source order changes\n  .col-md-push-0  { left: auto; }\n  .col-md-push-1  { left: percentage((1 / @grid-columns)); }\n  .col-md-push-2  { left: percentage((2 / @grid-columns)); }\n  .col-md-push-3  { left: percentage((3 / @grid-columns)); }\n  .col-md-push-4  { left: percentage((4 / @grid-columns)); }\n  .col-md-push-5  { left: percentage((5 / @grid-columns)); }\n  .col-md-push-6  { left: percentage((6 / @grid-columns)); }\n  .col-md-push-7  { left: percentage((7 / @grid-columns)); }\n  .col-md-push-8  { left: percentage((8 / @grid-columns)); }\n  .col-md-push-9  { left: percentage((9 / @grid-columns)); }\n  .col-md-push-10 { left: percentage((10/ @grid-columns)); }\n  .col-md-push-11 { left: percentage((11/ @grid-columns)); }\n\n  .col-md-pull-0  { right: auto; }\n  .col-md-pull-1  { right: percentage((1 / @grid-columns)); }\n  .col-md-pull-2  { right: percentage((2 / @grid-columns)); }\n  .col-md-pull-3  { right: percentage((3 / @grid-columns)); }\n  .col-md-pull-4  { right: percentage((4 / @grid-columns)); }\n  .col-md-pull-5  { right: percentage((5 / @grid-columns)); }\n  .col-md-pull-6  { right: percentage((6 / @grid-columns)); }\n  .col-md-pull-7  { right: percentage((7 / @grid-columns)); }\n  .col-md-pull-8  { right: percentage((8 / @grid-columns)); }\n  .col-md-pull-9  { right: percentage((9 / @grid-columns)); }\n  .col-md-pull-10 { right: percentage((10/ @grid-columns)); }\n  .col-md-pull-11 { right: percentage((11/ @grid-columns)); }\n\n  // Offsets\n  .col-md-offset-0  { margin-left: 0; }\n  .col-md-offset-1  { margin-left: percentage((1 / @grid-columns)); }\n  .col-md-offset-2  { margin-left: percentage((2 / @grid-columns)); }\n  .col-md-offset-3  { margin-left: percentage((3 / @grid-columns)); }\n  .col-md-offset-4  { margin-left: percentage((4 / @grid-columns)); }\n  .col-md-offset-5  { margin-left: percentage((5 / @grid-columns)); }\n  .col-md-offset-6  { margin-left: percentage((6 / @grid-columns)); }\n  .col-md-offset-7  { margin-left: percentage((7 / @grid-columns)); }\n  .col-md-offset-8  { margin-left: percentage((8 / @grid-columns)); }\n  .col-md-offset-9  { margin-left: percentage((9 / @grid-columns)); }\n  .col-md-offset-10 { margin-left: percentage((10/ @grid-columns)); }\n  .col-md-offset-11 { margin-left: percentage((11/ @grid-columns)); }\n}\n\n\n// Large grid\n//\n// Columns, offsets, pushes, and pulls for the large desktop device range.\n//\n// Note that `.col-lg-12` doesn't get floated on purpose--there's no need since\n// it's full-width.\n\n@media (min-width: @screen-lg-min) {\n  .container {\n    width: @container-lg;\n  }\n\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11 {\n    float: left;\n  }\n  .col-lg-1  { width: percentage((1 / @grid-columns)); }\n  .col-lg-2  { width: percentage((2 / @grid-columns)); }\n  .col-lg-3  { width: percentage((3 / @grid-columns)); }\n  .col-lg-4  { width: percentage((4 / @grid-columns)); }\n  .col-lg-5  { width: percentage((5 / @grid-columns)); }\n  .col-lg-6  { width: percentage((6 / @grid-columns)); }\n  .col-lg-7  { width: percentage((7 / @grid-columns)); }\n  .col-lg-8  { width: percentage((8 / @grid-columns)); }\n  .col-lg-9  { width: percentage((9 / @grid-columns)); }\n  .col-lg-10 { width: percentage((10/ @grid-columns)); }\n  .col-lg-11 { width: percentage((11/ @grid-columns)); }\n  .col-lg-12 { width: 100%; }\n\n  // Push and pull columns for source order changes\n  .col-lg-push-0  { left: auto; }\n  .col-lg-push-1  { left: percentage((1 / @grid-columns)); }\n  .col-lg-push-2  { left: percentage((2 / @grid-columns)); }\n  .col-lg-push-3  { left: percentage((3 / @grid-columns)); }\n  .col-lg-push-4  { left: percentage((4 / @grid-columns)); }\n  .col-lg-push-5  { left: percentage((5 / @grid-columns)); }\n  .col-lg-push-6  { left: percentage((6 / @grid-columns)); }\n  .col-lg-push-7  { left: percentage((7 / @grid-columns)); }\n  .col-lg-push-8  { left: percentage((8 / @grid-columns)); }\n  .col-lg-push-9  { left: percentage((9 / @grid-columns)); }\n  .col-lg-push-10 { left: percentage((10/ @grid-columns)); }\n  .col-lg-push-11 { left: percentage((11/ @grid-columns)); }\n\n  .col-lg-pull-0  { right: auto; }\n  .col-lg-pull-1  { right: percentage((1 / @grid-columns)); }\n  .col-lg-pull-2  { right: percentage((2 / @grid-columns)); }\n  .col-lg-pull-3  { right: percentage((3 / @grid-columns)); }\n  .col-lg-pull-4  { right: percentage((4 / @grid-columns)); }\n  .col-lg-pull-5  { right: percentage((5 / @grid-columns)); }\n  .col-lg-pull-6  { right: percentage((6 / @grid-columns)); }\n  .col-lg-pull-7  { right: percentage((7 / @grid-columns)); }\n  .col-lg-pull-8  { right: percentage((8 / @grid-columns)); }\n  .col-lg-pull-9  { right: percentage((9 / @grid-columns)); }\n  .col-lg-pull-10 { right: percentage((10/ @grid-columns)); }\n  .col-lg-pull-11 { right: percentage((11/ @grid-columns)); }\n\n  // Offsets\n  .col-lg-offset-0  { margin-left: 0; }\n  .col-lg-offset-1  { margin-left: percentage((1 / @grid-columns)); }\n  .col-lg-offset-2  { margin-left: percentage((2 / @grid-columns)); }\n  .col-lg-offset-3  { margin-left: percentage((3 / @grid-columns)); }\n  .col-lg-offset-4  { margin-left: percentage((4 / @grid-columns)); }\n  .col-lg-offset-5  { margin-left: percentage((5 / @grid-columns)); }\n  .col-lg-offset-6  { margin-left: percentage((6 / @grid-columns)); }\n  .col-lg-offset-7  { margin-left: percentage((7 / @grid-columns)); }\n  .col-lg-offset-8  { margin-left: percentage((8 / @grid-columns)); }\n  .col-lg-offset-9  { margin-left: percentage((9 / @grid-columns)); }\n  .col-lg-offset-10 { margin-left: percentage((10/ @grid-columns)); }\n  .col-lg-offset-11 { margin-left: percentage((11/ @grid-columns)); }\n}\n";return returnMe;})());

//attach controllers
controllers(router);

//attach routes
routes(router);

var parser = new less.Parser();
parser.parse(bootstrapLess, function(e,r){
	insertCss(r.toCSS());
});

Backbone.clientOnly = true;

//attach global collections
Backbone.collections = globalCollections({identifier: "~blog~"});

new LayoutView();

Backbone.history.start({
  pushState: true
});


},{"../shared/Router":14,"./views/layout":11,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\global.js":2,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\html.js":3,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\collections\\global\\posts.js":4,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\controllers\\error.js":5,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\controllers\\posts.js":6,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\routes\\error.js":8,"C:\\node\\work\\personal\\cellvia.github.io\\private\\client\\js\\app\\desktop\\routes\\posts.js":9,"foldify":24,"insert-css":29,"path":19,"util":20}],2:[function(require,module,exports){
var process=require("__browserify_process");module.exports = function(options){
	var GlobalCollection = Backbone.Collection.extend({
		model: Backbone.Model,
		url: function(){
			return '/globalCollection/' + this.id;
		},
		parse: function(resp){
			this.fetched = true;
			process.nextTick($.proxy( function(){
				this.trigger("fetched");
			}, this));
			return resp;
		},
		initialize: function(models, options){
			this.options || (this.options = options || {});
			this.id = this.options.id || 0;
		}
	});

	return new GlobalCollection([], options);
};
},{"__browserify_process":21}],3:[function(require,module,exports){
var process=require("__browserify_process"),__dirname="/desktop\\collections\\global";var foldify = require('foldify'),
	hyperglue = require('hyperglue');

module.exports = function(options){
	var HTMLCollection = Backbone.Collection.extend({
		model: Backbone.Model,
		url: function(){
			return '/HTMLCollection/' + this.id;
		},
		parse: function(resp){
			process.nextTick($.proxy( function(){
				this.trigger("fetched");
			}, this));
			this.fetched = true;
			var output = [];
			for(var name in resp){
				output.push({id: name, template: resp[name]});
			}
			return output;
		},
		initialize: function(models, options){
			this.options || (this.options = options || {});
			this.id = this.options.id || 0;
		},
		render: function(template, map){
			if((template = this.get(template)) && (template = template.get("template")) ){
				return hyperglue(template, map);
			}
		},
		sync: function () {
			if(Backbone.clientOnly){
				this.fetched = true;
				var pathToDir = '../../../../../../html/desktop';
				var htmls = foldify(__dirname + pathToDir);
				for(var name in htmls){
					this.add({id: name, template: htmls[name]});
				}
				this.trigger('fetched');
			}else{
				return Backbone.sync.apply(this, arguments);			
			}
	    }     
	});

	return new HTMLCollection([], options);
};
},{"__browserify_process":21,"foldify":24,"hyperglue":27}],4:[function(require,module,exports){
var process=require("__browserify_process");var foldify = require('foldify'),
	digistify = require('digistify');

var Post = require('../../models/Post')

module.exports = function(options){
	var GistCollection = Backbone.Collection.extend({
		model: Post,
		initialize: function(models, options){
			this.options || (this.options = options || {});			
			this.options.identifier = options.identifier;
		},
		sync: function () {
			var self = this;
			if(!self.fetched){
				digistify("cellvia", {transform: "article", identifier: this.options.identifier}, function(err, gists){
					self.fetched = true;
					gists.map(function(gist){
						gist.slug = slug(gist.title);
						return gist;
					});
					console.log(gists)
					self.add(gists);
					self.trigger('fetched');
				});				
			}else{
				process.nextTick(function(){
					self.trigger("fetched");				
				});
			}
	    }
	});

	return new GistCollection([], options);
};

function slug(input)
{
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}
},{"../../models/Post":7,"__browserify_process":21,"digistify":22,"foldify":24}],5:[function(require,module,exports){
var ErrorView = require('../views/error');

module.exports = function(router){
	router.error = function(status){
    	router.view( new ErrorView(status), {group: "errors"} );
  	};
}
},{"../views/error":10}],6:[function(require,module,exports){
var PostsView = require('../views/posts');
var PostView = require('../views/post');

module.exports = function(router){
	router.posts = function(){
    	router.view( PostsView );
	}

	router.post = function(slug){
    	router.view( PostView.bind(PostView, {"slug":slug}) );
	}
}
},{"../views/post":12,"../views/posts":13}],7:[function(require,module,exports){
var process=require("__browserify_process");var digistify = require('digistify');

module.exports = Backbone.Model.extend({
	sync: function(){	
		var self = this;
		if(!self.fetched){
			digistify(this.id, {contentTransform: "article"}, function(err, content){
				self.set("content", content);
				self.fetched = true;
				self.trigger("fetched");
			});			
		}else{
			process.nextTick(function(){
				self.trigger("fetched");				
			});
		}
	}
})
},{"__browserify_process":21,"digistify":22}],8:[function(require,module,exports){
module.exports = function(router){
	router.route('500'                                , 'error'                , $.proxy(function(){ this.error(500); }, router) );
	router.route('404'                                , 'error'                , $.proxy(function(){ this.error(404); }, router) );
	router.route('403'                                , 'error'                , $.proxy(function(){ this.error(403); }, router) );
}
},{}],9:[function(require,module,exports){
module.exports = function(router){

	router.route('', 'posts' );
	router.route('posts', 'posts' );

	router.route('article/:slug', 'post' );

}
},{}],10:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	initialize: function(){
		alert("error!");		
	}
})

},{"../../shared/View":15}],11:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	events: {
		"click a": "link"
	},
	link: function(e){
		e.preventDefault();
		var href = e.currentTarget.getAttribute('href');
		alert(href);
		Backbone.trigger("go", {href: href});
	},
	initialize: function(){
	}
})

},{"../../shared/View":15}],12:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	events: {
	},
	setup: function(){
		if(!this.posts.fetched || !this.html.fetched) return

		this.post = this.posts.findWhere({"slug": this.slug});
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});

		this.post.once("fetched", $.proxy(this.render, this) );
		this.post.fetch();
	},
	render: function(){
		this.$el.html("");
		this.html.render("post.html", 
			{
				'.link': { href: "/article/"+this.post.get("slug")},
				'.title': this.post.get("title"),
				'.created': this.post.get("created"),
				'.content': this.post.get("content")
			}
		).appendTo( this.$el );

		// setTimeout(function(){ Backbone.trigger("go", {href: "/init"}); }, 2000);
	},
	initialize: function(opts){
		this.slug = opts.slug;

		this.posts = Backbone.collections.posts;
		this.posts.once("fetched", $.proxy(this.setup, this) );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.html.once("fetched", $.proxy(this.setup, this) );
		this.html.fetch();
	}
});
},{"../../shared/View":15}],13:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "#page",
	render: function(){
		this.$el.html("");
		var postsMap = this.posts.map(function(post){
			return { 
				'.link': { href: "/article/"+post.get("slug")},
				'.title': post.get("title"),
				'.created': post.get("created")
			}
		});
		this.$el.html( this.html.render("posts.html", { ".posts": postsMap }) );

		// setTimeout(function(){ Backbone.trigger("go", {href: "/init"}); }, 2000);
	},
	initialize: function(){

		this.posts = Backbone.collections.posts;
		this.posts.once("fetched", $.proxy(this.render, this) );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.html.once("fetched", $.proxy(this.render, this) );
		this.html.fetch();
	}
});
},{"../../shared/View":15}],14:[function(require,module,exports){
var ViewCore = require('./ViewCore');

var Router = Backbone.Router.extend({
    go: function(data){
      this.navigate(data.href, {
        trigger: (data.trigger === false) ? false : true 
      });
    },
    initialize: function(){
      $.ajaxSetup({ cache: false });
      Backbone.on('go', $.proxy(this.go, this));
    }
});

Router = Router.extend(ViewCore);

module.exports = new Router();
},{"./ViewCore":16}],15:[function(require,module,exports){
var ViewCore = require('./ViewCore');
module.exports = Backbone.View.extend(ViewCore);
},{"./ViewCore":16}],16:[function(require,module,exports){
module.exports = {
	_views: {},
    _destroyViews: function(group, subview){
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        console.log("group"+group)
        view.destroy(undefined, true);
        view.stopListening();
        var el;
        if(!subview) 
          el = view.$el;
        if(el && el.length)
          el.replaceWith("<div id="+el.attr('id')+">");
      });
      delete this._views[group];
    },
    view: function(View, options){
      options = options || {};
      options.group = options.group || "global";
      if( options.reset === true )
        this.destroy();
      if(this._views[options.group]){
        if( options.reset !== true && options.replace !== false )
          this._views[options.group].destroy(options.group);
        this._views[options.group].push(new View())          
      }else{
        this._views[options.group] = [new View()];
      }
    },
    destroy: function(group, subview){
      if(group){
        console.log("destroy "+group+" views")
        this._destroyViews(group, subview)
      }else{
        console.log("destroy all views")
        for(var group in this._views){
          this._destroyViews(group, subview);
        }
      }
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+String(resp.status) });
    }    
}
},{}],17:[function(require,module,exports){


//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
function isArray(xs) {
  return toString.call(xs) === '[object Array]';
}
exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
exports.indexOf = function indexOf(xs, x) {
  if (xs.indexOf) return xs.indexOf(x);
  for (var i = 0; i < xs.length; i++) {
    if (x === xs[i]) return i;
  }
  return -1;
};

// Array.prototype.filter is supported in IE9
exports.filter = function filter(xs, fn) {
  if (xs.filter) return xs.filter(fn);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (fn(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
};

// Array.prototype.forEach is supported in IE9
exports.forEach = function forEach(xs, fn, self) {
  if (xs.forEach) return xs.forEach(fn, self);
  for (var i = 0; i < xs.length; i++) {
    fn.call(self, xs[i], i, xs);
  }
};

// Array.prototype.map is supported in IE9
exports.map = function map(xs, fn) {
  if (xs.map) return xs.map(fn);
  var out = new Array(xs.length);
  for (var i = 0; i < xs.length; i++) {
    out[i] = fn(xs[i], i, xs);
  }
  return out;
};

// Array.prototype.reduce is supported in IE9
exports.reduce = function reduce(array, callback, opt_initialValue) {
  if (array.reduce) return array.reduce(callback, opt_initialValue);
  var value, isValueSet = false;

  if (2 < arguments.length) {
    value = opt_initialValue;
    isValueSet = true;
  }
  for (var i = 0, l = array.length; l > i; ++i) {
    if (array.hasOwnProperty(i)) {
      if (isValueSet) {
        value = callback(value, array[i], i, array);
      }
      else {
        value = array[i];
        isValueSet = true;
      }
    }
  }

  return value;
};

// String.prototype.substr - negative index don't work in IE8
if ('ab'.substr(-1) !== 'b') {
  exports.substr = function (str, start, length) {
    // did we get a negative start, calculate how much it is from the beginning of the string
    if (start < 0) start = str.length + start;

    // call the original function
    return str.substr(start, length);
  };
} else {
  exports.substr = function (str, start, length) {
    return str.substr(start, length);
  };
}

// String.prototype.trim is supported in IE9
exports.trim = function (str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
};

// Function.prototype.bind is supported in IE9
exports.bind = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  if (fn.bind) return fn.bind.apply(fn, args);
  var self = args.shift();
  return function () {
    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
  };
};

// Object.create is supported in IE9
function create(prototype, properties) {
  var object;
  if (prototype === null) {
    object = { '__proto__' : null };
  }
  else {
    if (typeof prototype !== 'object') {
      throw new TypeError(
        'typeof prototype[' + (typeof prototype) + '] != \'object\''
      );
    }
    var Type = function () {};
    Type.prototype = prototype;
    object = new Type();
    object.__proto__ = prototype;
  }
  if (typeof properties !== 'undefined' && Object.defineProperties) {
    Object.defineProperties(object, properties);
  }
  return object;
}
exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
function notObject(object) {
  return ((typeof object != "object" && typeof object != "function") || object === null);
}

function keysShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.keys called on a non-object");
  }

  var result = [];
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
function propertyShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
  }

  var result = keysShim(object);
  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
    result.push('length');
  }
  return result;
}

var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
  Object.getOwnPropertyNames : propertyShim;

if (new Error().hasOwnProperty('description')) {
  var ERROR_PROPERTY_FILTER = function (obj, array) {
    if (toString.call(obj) === '[object Error]') {
      array = exports.filter(array, function (name) {
        return name !== 'description' && name !== 'number' && name !== 'message';
      });
    }
    return array;
  };

  exports.keys = function (object) {
    return ERROR_PROPERTY_FILTER(object, keys(object));
  };
  exports.getOwnPropertyNames = function (object) {
    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
  };
} else {
  exports.keys = keys;
  exports.getOwnPropertyNames = getOwnPropertyNames;
}

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
function valueObject(value, key) {
  return { value: value[key] };
}

if (typeof Object.getOwnPropertyDescriptor === 'function') {
  try {
    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  } catch (e) {
    // IE8 dom element issue - use a try catch and default to valueObject
    exports.getOwnPropertyDescriptor = function (value, key) {
      try {
        return Object.getOwnPropertyDescriptor(value, key);
      } catch (e) {
        return valueObject(value, key);
      }
    };
  }
} else {
  exports.getOwnPropertyDescriptor = valueObject;
}

},{}],18:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],19:[function(require,module,exports){
var process=require("__browserify_process");// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util');
var shims = require('_shims');

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(shims.filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = shims.substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(shims.filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(shims.filter(paths, function(p, index) {
    if (!util.isString(p)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

},{"__browserify_process":21,"_shims":17,"util":20}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var shims = require('_shims');

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  shims.forEach(array, function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = shims.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = shims.getOwnPropertyNames(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }

  shims.forEach(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (shims.indexOf(ctx.seen, desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = shims.reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return shims.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && objectToString(e) === '[object Error]';
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.binarySlice === 'function'
  ;
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = shims.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = shims.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"_shims":17}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
var process=require("__browserify_process");var request = require('request');

var exportObj = {
	defaults: {},
	setDefault: function(prop, val){
		if(typeof prop === "object")
			merge(exportObj.defaults, prop);
		else
			exportObj.defaults[prop] = val;		
	},
	getGists: function (user, options, cb){
		if(!isNaN(user)) return exportObj.getContent.apply(exportObj, arguments);
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		options = merge(options, exportObj.defaults);
		var gists = [];
		var counter = 0;
		var limit = options.limit || 0;
		var offset = options.offset || 0;
		var identifier = options.identifier || "";
		var transform;

		switch(options.transform){
			case "article":
				transform = function(gist){
					return { id: +gist.id,
							 title: gist.description.replace(identifier, ""),
							 created: gist.created_at,
							 modified: gist.updated_at }
				}
			break;
			default:
				transform = typeof options.transform === "function" ? options.transform : false;
			break;
		}

		var opts = {json: true, headers: {} };
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		function finalize(){
			if(offset || limit) gists = gists.slice(offset, limit);
			if( transform ) gists = gists.map(transform);
			cb(null, gists);
		}

		function recurs(){
			opts.url = get_gists_url(user, {per_page: 100, page: ++counter});
			request( opts, function(err, resp, newgists){
				if(err) return cb(err);
				if(resp.statusCode != 200) return cb(new Error("invalid url: "+ opts.url));
				if(typeof newgists !== "object" || typeof newgists.length === "undefined" || newgists.message) return cb(new Error("error: "+ newgists));
				if(!newgists.length) return finalize();

				newgists = newgists.filter(function(gist){
					var test = gist.public 
						&& gist.description 
						&& gist.files
						&& (!options.identifier || ~gist.description.indexOf(options.identifier))
						&& (!options.search || ~gist.description.toLowerCase().indexOf(options.search.toLowerCase()))
						&& (!options.filter || !~gist.description.toLowerCase().indexOf(options.filter.toLowerCase()));

					if (!test) return false;

					if(options.language){
						for( var file in gist.files ){
							if( test = gist.files[file].language.toLowerCase() === options.language.toLowerCase() )
								return test
						}				
					}
					return test
				});

				gists = gists.concat(newgists);
				if(newgists.length < 100 || limit && limit <= gists.length) return finalize();

				recurs();

			});
		}
		recurs();
	},

	getContent: function(id, options, cb){
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		merge(options, exportObj.defaults);
		var contents = [];
		var transform;

		switch(options.contentTransform){
			case "article":
				transform = function(file){
					return file.content
				}
			break;
			default:
				transform = typeof options.contentTransform === "function" ? options.contentTransform : false;
			break;
		}

		var opts = {json: true, headers: {}, url: get_gist_url(id) };
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		request( opts, function(err, resp, gist){
			if(err) return cb(err);
			if(resp.statusCode != 200) return cb(new Error("invalid url? "+ opts.url));
			for(var file in gist.files){
				if(options.language && gist.files[file].language.toLowerCase() !== options.language.toLowerCase()) continue
				contents.push(gist.files[file]);
			}
			if(transform) contents = contents.map(transform);
			if(contents.length === 1){
				cb(null, contents[0]);
			}else{
				cb(null, contents);
			}
		});
	}
}

function get_gists_url(user, options){ return "https://api.github.com/users/"+user+"/gists?per_page="+options.per_page+"&page="+options.page; };
function get_gist_url(id){ return "https://api.github.com/gists/"+id; };
function merge(a, b){ a = a || {}; for (var x in b){ if(typeof a[x] !== "undefined") continue; a[x] = b[x]; } return a; };

module.exports = exportObj.getGists;
module.exports.setDefault = exportObj.setDefault;

},{"__browserify_process":21,"request":23}],23:[function(require,module,exports){
// Browser Request
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var XHR = XMLHttpRequest
if (!XHR) throw new Error('missing XMLHttpRequest')

module.exports = request
request.log = {
  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
}

var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

//
// request
//

function request(options, callback) {
  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
  if(typeof callback !== 'function')
    throw new Error('Bad callback given: ' + callback)

  if(!options)
    throw new Error('No options given')

  var options_onResponse = options.onResponse; // Save this for later.

  if(typeof options === 'string')
    options = {'uri':options};
  else
    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

  options.onResponse = options_onResponse // And put it back.

  if (options.verbose) request.log = getLogger();

  if(options.url) {
    options.uri = options.url;
    delete options.url;
  }

  if(!options.uri && options.uri !== "")
    throw new Error("options.uri is a required argument");

  if(typeof options.uri != "string")
    throw new Error("options.uri must be a string");

  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
  for (var i = 0; i < unsupported_options.length; i++)
    if(options[ unsupported_options[i] ])
      throw new Error("options." + unsupported_options[i] + " is not supported")

  options.callback = callback
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  options.body    = options.body || null
  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

  if(options.headers.host)
    throw new Error("Options.headers.host is not supported");

  if(options.json) {
    options.headers.accept = options.headers.accept || 'application/json'
    if(options.method !== 'GET')
      options.headers['content-type'] = 'application/json'

    if(typeof options.json !== 'boolean')
      options.body = JSON.stringify(options.json)
    else if(typeof options.body !== 'string')
      options.body = JSON.stringify(options.body)
  }

  // If onResponse is boolean true, call back immediately when the response is known,
  // not when the full request is complete.
  options.onResponse = options.onResponse || noop
  if(options.onResponse === true) {
    options.onResponse = callback
    options.callback = noop
  }

  // XXX Browsers do not like this.
  //if(options.body)
  //  options.headers['content-length'] = options.body.length;

  // HTTP basic authentication
  if(!options.headers.authorization && options.auth)
    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

  return run_xhr(options)
}

var req_seq = 0
function run_xhr(options) {
  var xhr = new XHR
    , timed_out = false
    , is_cors = is_crossDomain(options.uri)
    , supports_cors = ('withCredentials' in xhr)

  req_seq += 1
  xhr.seq_id = req_seq
  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

  if(is_cors && !supports_cors) {
    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
    cors_err.cors = 'unsupported'
    return options.callback(cors_err, xhr)
  }

  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
  function too_late() {
    timed_out = true
    var er = new Error('ETIMEDOUT')
    er.code = 'ETIMEDOUT'
    er.duration = options.timeout

    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
    return options.callback(er, xhr)
  }

  // Some states can be skipped over, so remember what is still incomplete.
  var did = {'response':false, 'loading':false, 'end':false}

  xhr.onreadystatechange = on_state_change
  xhr.open(options.method, options.uri, true) // asynchronous
  if(is_cors)
    xhr.withCredentials = !! options.withCredentials
  xhr.send(options.body)
  return xhr

  function on_state_change(event) {
    if(timed_out)
      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

    if(xhr.readyState === XHR.OPENED) {
      request.log.debug('Request started', {'id':xhr.id})
      for (var key in options.headers)
        xhr.setRequestHeader(key, options.headers[key])
    }

    else if(xhr.readyState === XHR.HEADERS_RECEIVED)
      on_response()

    else if(xhr.readyState === XHR.LOADING) {
      on_response()
      on_loading()
    }

    else if(xhr.readyState === XHR.DONE) {
      on_response()
      on_loading()
      on_end()
    }
  }

  function on_response() {
    if(did.response)
      return

    did.response = true
    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
    clearTimeout(xhr.timeoutTimer)
    xhr.statusCode = xhr.status // Node request compatibility

    // Detect failed CORS requests.
    if(is_cors && xhr.statusCode == 0) {
      var cors_err = new Error('CORS request rejected: ' + options.uri)
      cors_err.cors = 'rejected'

      // Do not process this request further.
      did.loading = true
      did.end = true

      return options.callback(cors_err, xhr)
    }

    options.onResponse(null, xhr)
  }

  function on_loading() {
    if(did.loading)
      return

    did.loading = true
    request.log.debug('Response body loading', {'id':xhr.id})
    // TODO: Maybe simulate "data" events by watching xhr.responseText
  }

  function on_end() {
    if(did.end)
      return

    did.end = true
    request.log.debug('Request done', {'id':xhr.id})

    xhr.body = xhr.responseText
    if(options.json) {
      try        { xhr.body = JSON.parse(xhr.responseText) }
      catch (er) { return options.callback(er, xhr)        }
    }

    options.callback(null, xhr, xhr.body)
  }

} // request

request.withCredentials = false;
request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

//
// defaults
//

request.defaults = function(options, requester) {
  var def = function (method) {
    var d = function (params, callback) {
      if(typeof params === 'string')
        params = {'uri': params};
      else {
        params = JSON.parse(JSON.stringify(params));
      }
      for (var i in options) {
        if (params[i] === undefined) params[i] = options[i]
      }
      return method(params, callback)
    }
    return d
  }
  var de = def(request)
  de.get = def(request.get)
  de.post = def(request.post)
  de.put = def(request.put)
  de.head = def(request.head)
  return de
}

//
// HTTP method shortcuts
//

var shortcuts = [ 'get', 'put', 'post', 'head' ];
shortcuts.forEach(function(shortcut) {
  var method = shortcut.toUpperCase();
  var func   = shortcut.toLowerCase();

  request[func] = function(opts) {
    if(typeof opts === 'string')
      opts = {'method':method, 'uri':opts};
    else {
      opts = JSON.parse(JSON.stringify(opts));
      opts.method = method;
    }

    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
    return request.apply(this, args);
  }
})

//
// CouchDB shortcut
//

request.couch = function(options, callback) {
  if(typeof options === 'string')
    options = {'uri':options}

  // Just use the request API to do JSON.
  options.json = true
  if(options.body)
    options.json = options.body
  delete options.body

  callback = callback || noop

  var xhr = request(options, couch_handler)
  return xhr

  function couch_handler(er, resp, body) {
    if(er)
      return callback(er, resp, body)

    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
      // The body is a Couch JSON object indicating the error.
      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
      for (var key in body)
        er[key] = body[key]
      return callback(er, resp, body);
    }

    return callback(er, resp, body);
  }
}

//
// Utility
//

function noop() {}

function getLogger() {
  var logger = {}
    , levels = ['trace', 'debug', 'info', 'warn', 'error']
    , level, i

  for(i = 0; i < levels.length; i++) {
    level = levels[i]

    logger[level] = noop
    if(typeof console !== 'undefined' && console && console[level])
      logger[level] = formatted(console, level)
  }

  return logger
}

function formatted(obj, method) {
  return formatted_logger

  function formatted_logger(str, context) {
    if(typeof context === 'object')
      str += ' ' + JSON.stringify(context)

    return obj[method].call(obj, str)
  }
}

// Return whether a URL is a cross-domain request.
function is_crossDomain(url) {
  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

  // jQuery #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  var ajaxLocation
  try { ajaxLocation = location.href }
  catch (e) {
    // Use the href attribute of an A element since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    , parts = rurl.exec(url.toLowerCase() )

  var result = !!(
    parts &&
    (  parts[1] != ajaxLocParts[1]
    || parts[2] != ajaxLocParts[2]
    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
    )
  )

  //console.debug('is_crossDomain('+url+') -> ' + result)
  return result
}

// MIT License from http://phpjs.org/functions/base64_encode:358
function b64_enc (data) {
    // Encodes string using MIME base64 algorithm
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    // assume utf8 data
    // data = this.utf8_encode(data+'');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}

},{}],24:[function(require,module,exports){
var fs = require('fs'),
	path = require('path'),
	minimatch = require('minimatchify');

module.exports = fold;

function fold(toBeFolded){
	if(!toBeFolded) return false;
	var moreArgs = [].slice.call(arguments, 1),
		mergeToMe = {},
		options,
		individual,
		originalFullPath;

	if(isArray(toBeFolded)){
		options = moreArgs[0];
		originalFullPath = options.fullPath;
		toBeFolded.forEach(function(toFold){
			individual = fold.call(this, toFold, options)
			for(var prop in individual){
				if(mergeToMe[prop]){
					options.fullPath = true;
					individual = fold.call(this, toFold, options);
					options.fullPath = originalFullPath;
					break;
				}
			}
			for (var prop in individual) {
	          mergeToMe[prop] = individual[prop];
	        }
		});
		return bind( fold, {foldStatus: true}, mergeToMe );
	}

	var	beingFolded = this && this.foldStatus,
		isObj = typeof toBeFolded === "object" && !beingFolded,
		isFoldObj = typeof toBeFolded === "object" && beingFolded,
		isDir = typeof toBeFolded === "string",
		args,
		output,
		combined;
	
	switch(false){
		case !isDir:
			options = moreArgs[0] || {};
			output = populate.apply(this, [toBeFolded, options]);
		break;
		case !isFoldObj:
			args = moreArgs[0] || [];
			args = isArray(args, true) ? args : [args]
			if(this.foldStatus === "foldOnly"){
				args2 = moreArgs[1] || [];
				args2 = isArray(args2) ? args2 : [args2]
				args = args.concat(args2);
				options = moreArgs[2] || {};				
			}else{
				options = moreArgs[1] || {};
			}			
			output = evaluate.apply(this, [toBeFolded, args, options]);
		break;
		case !isObj:
			options = moreArgs[0] || {};
			for(var name in toBeFolded){
				if( (options.whitelist && !checkList(options.whitelist, name))
				  || (options.blacklist && checkList(options.blacklist, name)) )
					continue
				fold[name] = toBeFolded[name];
			}
			output = bind( fold, {foldStatus: true}, fold );
		break;
	}

	return output;

};

function populate(dirname, options){
	if(!fs.readdirSync) throw "you must run the foldify browserify transform (foldify/transform.js) for foldify to work in the browser!";
	var proxy = {},
		toString = options.output && options.output.toLowerCase() === "string",
		toArray = options.output && options.output.toLowerCase() === "array",
		returnMe,
		existingProps = [],
		newdirname,
		separator,
		parts,
		map = options.tree ? {} : false,
		files = [];

	if(toString){
		returnMe = "";
	}else if(toArray){
		returnMe = [];
	}else{
		returnMe = bind( fold, { foldStatus: true, map: map }, proxy );
	}

    try{
	    if(~dirname.indexOf("/"))
	        separator = "/";
	    if(~dirname.indexOf("\\"))
	        separator = "\\";
	    parts = dirname.split(separator);
        newdirname = path.dirname( require.resolve( parts[0] ) );
    	if(!~newdirname.indexOf("node_modules")) throw "not a node module";
        dirname = newdirname + path.sep + parts.slice(1).join(path.sep);
    }catch(err){}


    function recurs(thisDir){
        fs.readdirSync(thisDir).forEach(function(file){
            var filepath = path.join( thisDir, file);
            if(path.extname(file) === ''){
              if(options.recursive || options.tree) recurs(filepath);
              return  
            } 
            files.push(filepath);        		
        });
    }
    recurs(dirname);

    if(options.whitelist) files = whitelist(options.whitelist, files, dirname)
    if(options.blacklist) files = blacklist(options.blacklist, files, dirname)

	files.forEach(function(filepath){
		var ext = path.extname(filepath),
			name = path.basename(filepath, ext),
			filename = name + ext,
			isJs = (ext === ".js" || ext === ".json"),
			isDir = ext === '',
			propname,
			add,
			last = false;

		if( toString ){
			returnMe += fs.readFileSync(filepath, "utf-8");					
			return
		}

		if( toArray ){
			returnMe.push( fs.readFileSync(filepath, "utf-8") );
			return
		}

		if(!options.includeExt && (isJs || options.includeExt === false) )
			propname = name;
		else
			propname = filename;

		if(!options.tree){
	        if(options.fullPath || ~existingProps.indexOf(propname) )
	            propname = path.relative(dirname, filepath);
	        else
	            existingProps.push(propname);			
		}

		if((isJs && options.jsToString) || !isJs )
			add = fs.readFileSync(filepath, "utf-8");
		else
			add = require(filepath);

		if(map){
			var paths = path.relative(dirname, filepath).split(path.sep);
			var last, thismap;
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnMe[ paths[x] ] )
						returnMe[ paths[x] ] = {};
					last = returnMe[ paths[x] ]
					if(!map[ paths[x] ] )
						map[ paths[x] ] = {};
					thismap = map[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
					if(!thismap[ paths[x] ] )
						thismap[ paths[x] ] = {};
					thismap = thismap[ paths[x] ];
				}else{
					last[ propname ] = add;
					thismap[ propname ] = true;
				}
			}
		}else{
			returnMe[propname] = add;
		}
		
	});

	for(var p in returnMe) proxy[p] = returnMe[p];
	return returnMe;
}	

function evaluate(srcObj, args, options){
	var proxy = {}, returnObj;
	if(options.evaluate === false){
		this.foldStatus = "foldOnly";
		returnObj = bind( fold, this, proxy, args );
	}
	else
		returnObj = bind( fold, this, proxy );

	var objpaths = flatten.call(this.map, srcObj);

	for(var objpath in objpaths){
		var isWhitelisted = false,
			isBlacklisted = false,
			skip = false,
			add = false,
			node = false,
			last = false;

		if(options.whitelist && checkList(options.whitelist, objpath))
			isWhitelisted = true;

		if(options.blacklist && checkList(options.blacklist, objpath))
			isBlacklisted = true;

		skip = (options.whitelist && !isWhitelisted) || isBlacklisted;

		if(skip && options.trim) continue;

		add = node = objpaths[objpath];

		if(!skip && typeof node === "function")
			add = options.evaluate !== false ? node.apply( srcObj, args) : bind.apply( bind, [node, srcObj].concat(args) );
		
		if(typeof add === "undefined" && options.allowUndefined !== true && options.trim)
			continue

		if(typeof add === "undefined" && options.allowUndefined !== true)
			add = node

		if(this.map){
			paths = objpath.split(path.sep);
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnObj[ paths[x] ] )
						returnObj[ paths[x] ] = {};
					last = returnObj[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
				}else{
					last[ paths[x] ] = add;
				}
			}			
		}else{
			returnObj[objpath] = add;
		}
	}

	for(var p in returnObj) proxy[p] = returnObj[p];
	return returnObj;
}

function checkList(list, name){
	list = isArray(list) ? list : [list];
	return list.some(function(rule){
		return minimatch(name, path.normalize(rule));
	});
}

function whitelist(whitelist, files, rootdir){
    if(!whitelist || !files) return
    rootdir = rootdir || "";
    var output = [];
    whitelist = isArray(whitelist) ? whitelist : [whitelist];
    whitelist.forEach(function(rule){
        rule = path.join( rootdir, rule );
        files.forEach( function(name){
            if(~output.indexOf(name)) return
            if( minimatch(name, rule) )
                output.push(name);
        }) 
    });
    return output;
}

function blacklist(blacklist, files, rootdir){
    if(!blacklist || !files) return
    rootdir = rootdir || "";
    blacklist = isArray(blacklist) ? blacklist : [blacklist];

    return files.filter(function(name){
        return !blacklist.some(function(rule){
            rule = path.join( rootdir, rule );
            return minimatch(name, rule)
        });
    });
}

function flatten(obj, _path, result) {
  if(!this) return obj;
  var key, val, __path;
  _path = _path || [];
  result = result || {};
  for (key in obj) {
    val = obj[key];
    __path = _path.concat([key]);
    if (this[key] && this[key] !== true) {
      flatten.call(this[key], val, __path, result);
    } else {
      result[__path.join(path.sep)] = val;
    }
  }
  return result;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg */)
  {
    'use strict';

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function')
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisArg, t[i], i, t))
        return true;
    }

    return false;
  };
};

function bind(fn){
	var args = Array.prototype.slice.call(arguments, 1);
	if (!Function.prototype.bind) {
	     return function(){
			var onearg = args.shift();
			var newargs = args.concat(Array.prototype.slice.call(arguments,0));
			var returnme = fn.apply(onearg, newargs );
	        return returnme;
	     };
	}else{
		return fn.bind.apply(fn, args);
	};
}

function isArray(obj){
	return ~Object.prototype.toString.call(obj).toLowerCase().indexOf("array");
}
},{"fs":18,"minimatchify":25,"path":19}],25:[function(require,module,exports){
var process=require("__browserify_process");if(typeof JSON === "undefined"){

/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}

if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      // At the moment all modern browsers, that support strict mode, have
      // native implementation of Array.prototype.reduce. For instance, IE8
      // does not support strict mode, so this check is actually useless.
      throw new TypeError(
          'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index, value,
        length = this.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
      value = opt_initialValue;
      isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
      if (this.hasOwnProperty(index)) {
        if (isValueSet) {
          value = callback(value, this[index], index, this);
        }
        else {
          value = this[index];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t)
        res[i] = fun.call(thisArg, t[i], i, t);
    }

    return res;
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/,'').replace(/\s+$/, '');
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

;(function (require, exports, module, platform) {

if (module) module.exports = minimatch
else exports.minimatch = minimatch

minimatch.Minimatch = Minimatch

var LRU = function LRUCache () {
        // not quite an LRU, but still space-limited.
        var cache = {}
        var cnt = 0
        this.set = function (k, v) {
          cnt ++
          if (cnt >= 100) cache = {}
          cache[k] = v
        }
        this.get = function (k) { return cache[k] }
      }
  , cache = minimatch.cache = new LRU({max: 100})
  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
  , sigmund = process.browser ? function sigmund (obj) {
        return JSON.stringify(obj)
      } : require("sigmund")

var path = require("path")
  // any single thing other than /
  // don't need to escape / when using new RegExp()
  , qmark = "[^/]"

  // * => any number of characters
  , star = qmark + "*?"

  // ** when dots are allowed.  Anything goes, except .. and .
  // not (^ or / followed by one or two dots followed by $ or /),
  // followed by anything, any number of times.
  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

  // not a ^ or / followed by a dot,
  // followed by anything, any number of times.
  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

  // characters that need to be escaped in RegExp.
  , reSpecials = charSet("().*{}+?[]^$\\!")

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split("").reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}


function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === "") return p === ""

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options, cache)
  }

  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    pattern = pattern.split("\\").join("/")
  }

  // lru storage.
  // these things aren't particularly big, but walking down the string
  // and turning it into a regexp can get pretty costly.
  var cacheKey = pattern + "\n" + sigmund(options)
  var cached = minimatch.cache.get(cacheKey)
  if (cached) return cached
  minimatch.cache.set(cacheKey, this)

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function() {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return -1 === s.indexOf(false)
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
    , negate = false
    , options = this.options
    , negateOffset = 0

  if (options.nonegate) return

  for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
    negate = !negate
    negateOffset ++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return new Minimatch(pattern, options).braceExpand()
}

Minimatch.prototype.braceExpand = braceExpand
function braceExpand (pattern, options) {
  options = options || this.options
  pattern = typeof pattern === "undefined"
    ? this.pattern : pattern

  if (typeof pattern === "undefined") {
    throw new Error("undefined pattern")
  }

  if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  var escaping = false

  // examples and comments refer to this crazy pattern:
  // a{b,c{d,e},{f,g}h}x{y,z}
  // expected:
  // abxy
  // abxz
  // acdxy
  // acdxz
  // acexy
  // acexz
  // afhxy
  // afhxz
  // aghxy
  // aghxz

  // everything before the first \{ is just a prefix.
  // So, we pluck that off, and work with the rest,
  // and then prepend it to everything we find.
  if (pattern.charAt(0) !== "{") {
    this.debug(pattern)
    var prefix = null
    for (var i = 0, l = pattern.length; i < l; i ++) {
      var c = pattern.charAt(i)
      this.debug(i, c)
      if (c === "\\") {
        escaping = !escaping
      } else if (c === "{" && !escaping) {
        prefix = pattern.substr(0, i)
        break
      }
    }

    // actually no sets, all { were escaped.
    if (prefix === null) {
      this.debug("no sets")
      return [pattern]
    }

   var tail = braceExpand.call(this, pattern.substr(i), options)
    return tail.map(function (t) {
      return prefix + t
    })
  }

  // now we have something like:
  // {b,c{d,e},{f,g}h}x{y,z}
  // walk through the set, expanding each part, until
  // the set ends.  then, we'll expand the suffix.
  // If the set only has a single member, then'll put the {} back

  // first, handle numeric sets, since they're easier
  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
  if (numset) {
    this.debug("numset", numset[1], numset[2])
    var suf = braceExpand.call(this, pattern.substr(numset[0].length), options)
      , start = +numset[1]
      , end = +numset[2]
      , inc = start > end ? -1 : 1
      , set = []
    for (var i = start; i != (end + inc); i += inc) {
      // append all the suffixes
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        set.push(i + suf[ii])
      }
    }
    return set
  }

  // ok, walk through the set
  // We hope, somewhat optimistically, that there
  // will be a } at the end.
  // If the closing brace isn't found, then the pattern is
  // interpreted as braceExpand("\\" + pattern) so that
  // the leading \{ will be interpreted literally.
  var i = 1 // skip the \{
    , depth = 1
    , set = []
    , member = ""
    , sawEnd = false
    , escaping = false

  function addMember () {
    set.push(member)
    member = ""
  }

  this.debug("Entering for")
  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
    var c = pattern.charAt(i)
    this.debug("", i, c)

    if (escaping) {
      escaping = false
      member += "\\" + c
    } else {
      switch (c) {
        case "\\":
          escaping = true
          continue

        case "{":
          depth ++
          member += "{"
          continue

        case "}":
          depth --
          // if this closes the actual set, then we're done
          if (depth === 0) {
            addMember()
            // pluck off the close-brace
            i ++
            break FOR
          } else {
            member += c
            continue
          }

        case ",":
          if (depth === 1) {
            addMember()
          } else {
            member += c
          }
          continue

        default:
          member += c
          continue
      } // switch
    } // else
  } // for

  // now we've either finished the set, and the suffix is
  // pattern.substr(i), or we have *not* closed the set,
  // and need to escape the leading brace
  if (depth !== 0) {
    this.debug("didn't close", pattern)
    return braceExpand.call(this, "\\" + pattern, options)
  }

  // x{y,z} -> ["xy", "xz"]
  this.debug("set", set)
  this.debug("suffix", pattern.substr(i))
  var suf = braceExpand.call(this, pattern.substr(i), options)
  // ["b", "c{d,e}","{f,g}h"] ->
  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
  var addBraces = set.length === 1
  this.debug("set pre-expanded", set)
  set = set.map(function (p) {
    return braceExpand.call(this, p, options)
  }, this)
  this.debug("set expanded", set)


  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
  //   ["b", "cd", "ce", "fh", "gh"]
  set = set.reduce(function (l, r) {
    return l.concat(r)
  })

  if (addBraces) {
    set = set.map(function (s) {
      return "{" + s + "}"
    })
  }

  // now attach the suffixes.
  var ret = []
  for (var i = 0, l = set.length; i < l; i ++) {
    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
      ret.push(set[i] + suf[ii])
    }
  }
  return ret
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === "**") return GLOBSTAR
  if (pattern === "") return ""

  var re = ""
    , hasMagic = !!options.nocase
    , escaping = false
    // ? => one single character
    , patternListStack = []
    , plType
    , stateChar
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    , patternStart = pattern.charAt(0) === "." ? "" // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
      : "(?!\\.)"
    , self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += star
          hasMagic = true
          break
        case "?":
          re += qmark
          hasMagic = true
          break
        default:
          re += "\\"+stateChar
          break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    this.debug("%s\t%s %s %j", pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += "\\" + c
      escaping = false
      continue
    }

    SWITCH: switch (c) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case "\\":
        clearStateChar()
        escaping = true
        continue

      // the various stateChar values
      // for the "extglob" stuff.
      case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === "!" && i === classStart + 1) c = "^"
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
        continue

      case "(":
        if (inClass) {
          re += "("
          continue
        }

        if (!stateChar) {
          re += "\\("
          continue
        }

        plType = stateChar
        patternListStack.push({ type: plType
                              , start: i - 1
                              , reStart: re.length })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === "!" ? "(?:(?!" : "(?:"
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
        continue

      case ")":
        if (inClass || !patternListStack.length) {
          re += "\\)"
          continue
        }

        clearStateChar()
        hasMagic = true
        re += ")"
        plType = patternListStack.pop().type
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        switch (plType) {
          case "!":
            re += "[^/]*?)"
            break
          case "?":
          case "+":
          case "*": re += plType
          case "@": break // the default anyway
        }
        continue

      case "|":
        if (inClass || !patternListStack.length || escaping) {
          re += "\\|"
          escaping = false
          continue
        }

        clearStateChar()
        re += "|"
        continue

      // these are mostly the same in regexp and glob
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += "\\" + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += "\\" + c
          escaping = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch
  } // for


  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = pattern.substr(classStart + 1)
      , sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + "\\[" + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  var pl
  while (pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + 3)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = "\\"
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + "|"
    })

    this.debug("tail=%j\n   %s", tail, tail)
    var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
          : "\\" + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart)
       + t + "\\("
       + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += "\\\\"
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case ".":
    case "[":
    case "(": addPatternStart = true
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== "" && hasMagic) re = "(?=.)" + re

  if (addPatternStart) re = patternStart + re

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [ re, hasMagic ]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? "i" : ""
    , regExp = new RegExp("^" + re + "$", flags)

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) return this.regexp = false
  var options = this.options

  var twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    , flags = options.nocase ? "i" : ""

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
           : (typeof p === "string") ? regExpEscape(p)
           : p._src
    }).join("\\\/")
  }).join("|")

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^(?:" + re + ")$"

  // can match anything, as long as it's not this.
  if (this.negate) re = "^(?!" + re + ").*$"

  try {
    return this.regexp = new RegExp(re, flags)
  } catch (ex) {
    return this.regexp = false
  }
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug("match", f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ""

  if (f === "/" && partial) return true

  var options = this.options

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    f = f.split("\\").join("/")
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, "split", f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, "set", set)

  var splitFile = path.basename(f.join("/")).split("/")

  for (var i = 0, l = set.length; i < l; i ++) {
    var pattern = set[i], file = f
    if (options.matchBase && pattern.length === 1) {
      file = splitFile
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug("matchOne",
              { "this": this
              , file: file
              , pattern: pattern })

  this.debug("matchOne", file.length, pattern.length)

  for ( var fi = 0
          , pi = 0
          , fl = file.length
          , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

    this.debug("matchOne loop")
    var p = pattern[pi]
      , f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
        , pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for ( ; fi < fl; fi ++) {
          if (file[fi] === "." || file[fi] === ".." ||
              (!options.dot && file[fi].charAt(0) === ".")) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      WHILE: while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while',
                    file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
            this.debug("dot detected!", file, fr, pattern, pr)
            break WHILE
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr ++
        }
      }
      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then 
      if (partial) {
        // ran out of file
        this.debug("\n>>> no match, partial?", file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === "string") {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug("string match", p, f, hit)
    } else {
      hit = f.match(p)
      this.debug("pattern match", p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error("wtf?")
}


// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, "$1")
}


function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

})( typeof require === "function" ? require : null,
    this,
    typeof module === "object" ? module : null,
    typeof process === "object" ? process.platform : "win32"
  )




},{"__browserify_process":21,"path":19,"sigmund":26}],26:[function(require,module,exports){
module.exports = sigmund
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

},{}],27:[function(require,module,exports){
var domify = require('domify');

module.exports = hyperglue;
function hyperglue (src, updates) {
    if (!updates) updates = {};
    
    var ob = typeof src === 'object';
    var dom = ob
            ? [ src ]
            : domify("<div>"+src+"</div>");
    var returnDom = [];
    var html = "";

    forEach(objectKeys(updates), function (selector) {
        var value = updates[selector];
        if (selector === ':first') {
            bind(ob ? dom[0] : dom[0].firstChild, value);
        }
        else if (/:first$/.test(selector)) {
            var k = selector.replace(/:first$/, '');
            var elem = dom[0].querySelector(k);
            if (elem) bind(elem, value);
        }
        else{
            var nodes = dom[0].querySelectorAll(selector);
            if (nodes.length === 0) return;
            for (var i = 0; i < nodes.length; i++) {
                bind(nodes[i], value);
            }
        }
    });

    if( ob ){
        return dom.length === 1 ? dom[0] : dom;
    }else{
        if (dom[0].childElementCount === 1){
            returnDom = dom[0].removeChild(dom[0].firstChild);
        }else{
            returnDom.innerHTML = returnDom.outerHTML = "";

            while(dom[0].firstChild){
                returnDom.innerHTML += returnDom.outerHTML += dom[0].firstChild.outerHTML;
                returnDom.push(dom[0].removeChild(dom[0].firstChild));
            }            
        }
        returnDom.appendTo = appendTo;
        return returnDom;
    }
}

function bind (node, value) {
    if (isElement(value)) {
        node.innerHTML = '';
        node.appendChild(value);
    }
    else if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            var e = hyperglue(node.cloneNode(true), value[i]);
            node.parentNode.insertBefore(e, node);
        }
        node.parentNode.removeChild(node);
    }
    else if (value && typeof value === 'object') {
        forEach(objectKeys(value), function (key) {
            if (key === '_text') {
                setText(node, value[key]);
            }
            else if (key === '_html' && isElement(value[key])) {
                node.innerHTML = '';
                node.appendChild(value[key]);
            }
            else if (key === '_html') {
                node.innerHTML = value[key];
            }
            else node.setAttribute(key, value[key]);
        });
    }
    else setText(node, value);
}

function forEach(xs, f) {
    if (xs.forEach) return xs.forEach(f);
    for (var i = 0; i < xs.length; i++) f(xs[i], i)
}

var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

function isElement (e) {
    return e && typeof e === 'object' && e.childNodes
        && (typeof e.appendChild === 'function'
        || typeof e.appendChild === 'object')
    ;
}

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

function setText (e, s) {
    e.innerHTML = '';
    var txt = document.createTextNode(String(s));
    e.appendChild(txt);
}

function appendTo(dest) {
    var self = this;
    if(!isArray(self)) self = [self];
    forEach(self, function(src){ 
        if(dest.appendChild) dest.appendChild( src ) 
        else if (dest.append) dest.append ( src )
    } ); 
    return this;
}
},{"domify":28}],28:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

},{}],29:[function(require,module,exports){
var inserted = {};

module.exports = function (css) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(elem);
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])
;