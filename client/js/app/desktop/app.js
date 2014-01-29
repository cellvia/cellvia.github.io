var path = require('path'),
    router = require('../shared/Router'),
    curryFolder = require('curryFolder'),
    routes = curryFolder(__dirname + '/routes', {recursive: true}), 
    controllers = curryFolder(__dirname + '/controllers', {recursive: true}), 
    globalCollections = curryFolder(__dirname + '/collections/global', {recursive: true}),
    mockApi = curryFolder('mockApi/public/css'),
    LayoutView = require('./views/layout');

//attach controllers
controllers(router);

//attach routes
routes(router);

window.mock = mockApi;

//attach global collections
Backbone.collections = globalCollections();

Backbone.history.start({
  pushState: true
});