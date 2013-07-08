//DEPENDANCIES
var express = require('express')
  , path = require('path')
  , engine = require('ejs-locals')
  , io = require('socket.io')
  , exec = require('child_process').exec
  , app = express()
  , events = require('events')  
  , arduino
  , aduinoEventEmitter = new events.EventEmitter()
  ,	aduinoState = {
		isConnected : false
		,lastData : undefined
	}


//CONFIG
app.configure(function(){
	app.use(express.compress());
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	//app.use(express.favicon(path.join(__dirname + '/public/favicon.ico'))); 
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


//start socket IO
io = io.listen(app.listen(app.get('port')), function(){
	console.log("Express server listening on port " + app.get('port'));
});


//ROUTES
app.get('/', function(req, res) {
  res.render('index', { locals : { title: 'Smart Ass' }})
});

app.get('/chair-status', function(req, res) {
	io.sockets.emit('chair', {type : "update", value:  data, isConnected : chairState.isConnected});
})


//io.sockets.emit('chair', {type : "disconnect", isConnected : chairState.isConnected});


//when new socket is connected
io.sockets.on('connection', function (socket){
	console.log("New socket connection made");
	socket.emit('chair', {type : "init", value:  chairState.lastData, isConnected : chairState.isConnected});
});