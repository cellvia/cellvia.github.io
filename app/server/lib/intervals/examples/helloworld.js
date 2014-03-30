module.exports = function(iEmitter){
	iEmitter.interval("5 s", function(){ console.log("hello world!"); });
}