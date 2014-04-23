var ViewCore = require('./ViewCore');
var ViewEventsCore = require('./ViewEventsCore');
var viewCore = Backbone.View.extend(ViewCore);
module.exports = viewCore.extend(ViewEventsCore);