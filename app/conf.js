var root = "C:\\node\\work\\personal\\cellvia.github.io\\app";

module.exports = {
	"paths": {
		"root": root,
		"html": root + "/client/html",
		"sharedHtml": root + "/shared/html"
	},
	"desktopTransitionModule": false,
	"mobileTransitionModule": "pageslide",
	"useIScroll": false,
	"clientOnly": true,
	"sections": ['about', 'résumé', 'code', 'sound&vision', 'reflections'],
	"footers": [
		["email", "mailto:brandon.selway@gmail.com"], 
		["linkedin", "http://www.linkedin.com/pub/brandon-selway/55/100/395"], 
		["github", "http://github.com/cellvia"], ["twitter", "http://twitter.com/djchairboy"]
	]
};