module.exports = function(app){ 
	app.get('/globalCollection/:id', function(req, res){
	  res.send([{test:"collectionObject1", id: req.params.id}, {test:"collectionObject2", id: 100}]);
	});
}