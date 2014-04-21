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
	"maxViewCache": 8,
	"sections": ['about', 'résumé', 'code', 'sound&vision', 'reflections'],
	"footers": [
		["email", "mailto:brandon.selway@gmail.com"], 
		["linkedin", "https://www.linkedin.com/in/brandonselway"], 
		["github", "http://github.com/cellvia"], ["twitter", "http://twitter.com/djchairboy"]
	]
};