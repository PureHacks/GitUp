

//DEPENDANCIES
var express = require('express')
  , path = require('path')
  , engine = require('ejs-locals')
  , io = require('socket.io')
  , serialport = require('serialport')
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
	app.set('port', process.env.PORT || 8080);
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


//ROUTS
app.get('/', function(req, res) {
  res.render('index', { locals : { title: 'Smart Ass' }})
});



//when new socket is connected
io.sockets.on('connection', function (socket){
	console.log("New socket connection made");

	socket.emit('arduino', {type : "init", value:  aduinoState.lastData, isConnected : aduinoState.isConnected});
});



//SERIAL I/O

var detectArduinoOnRaspberryPI = function() {
	var port;
	console.log('* attempting to detect arduino on raspberry pi *');

	serialport.list(function (e, ports) {
		ports.forEach(function(obj) {
			// FTDI captures the duemilanove
			// Arduino captures the leonardo 
			if (obj.hasOwnProperty('pnpId') && (obj.pnpId.search('FTDI') != -1 || obj.pnpId.search('Arduino') != -1)){
				port = obj.comName;
			}
		});
		if(port){
			attemptConnection(port);
		}else{
			console.log('* failed to find arduino : please check your connections *');
		}
	});
};

var attemptConnection = function(port) {
	console.log('* attempting to connect to arduino at :', port, ' *');

	arduino = new serialport.SerialPort(port, { baudrate: 9600, parser: serialport.parsers.readline("\n") });
	arduino.on("open", function (){
		console.log('* connection to arduino successful ! *');
		aduinoState.isConnected = true;	

		arduino.on('data', function(data){
			data = data.replace("\r", "");
			console.log('Arduino: ' + data);
			aduinoState.lastData = data;
			io.sockets.emit('arduino', {type : "update", value:  data, isConnected : aduinoState.isConnected});
		});
		arduino.on('close', function(){
			console.log("* connection to Arduino lost *");
			aduinoState.isConnected = false;
			io.sockets.emit('arduino', {type : "disconnect", isConnected : aduinoState.isConnected});
		});

		//force init data connection
		setTimeout(function(){
			arduino.write('init');
			//io.sockets.emit('arduino', {type : "connected", value:  aduinoState.lastData, isConnected : aduinoState.isConnected});
		}, 500);
	});
};

detectArduinoOnRaspberryPI();