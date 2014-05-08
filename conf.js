var root = "C:\\node\\work\\personal\\cellvia.github.io";

module.exports = {
	"paths": {
		"root": root,
		"html": root + "/client/html"
	},
	"pathnames": {
		"images": "/public/images"
	},
	"desktopTransitionModule": "pageslide",
	"mobileTransitionModule": "pageslide",
	"useIScroll": true,
	"clientOnly": true,
	"maxViewCache": 8,
	"sections": ['about', 'résumé', 'code', 'sound&vision', 'reflections'],
	"footers": [
		["email", "mailto:brandon.selway@gmail.com"], 
		["linkedin", "https://www.linkedin.com/in/brandonselway"], 
		["github", "http://github.com/cellvia"],
		["twitter", "http://twitter.com/djchairboy"]
	]
};