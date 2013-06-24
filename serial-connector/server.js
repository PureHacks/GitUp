

//DEPENDANCIES
var express = require('express')
  , http = require('http')
  , path = require('path')
  ,	fs = require('fs')
  , engine = require('ejs-locals')
  , io = require('socket.io')
  , serialport = require('serialport')
  , exec = require('child_process').exec
  , app = express()
  ,arduino, socket;


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


io.sockets.on('connection', function (sock){
	socket = sock;
	console.log("Socket connection made");
})






//SERIAL SEND


var onDataFromArduino = function(data) {
	console.log('Arduino: ' + data);
	fs.appendFile(__dirname + "/output.txt", "\r\n" + data, { 
		flags: 'a'
	}, function (err) {
		if (err) throw err;
	});
	//write data to text file
	if(socket){
		socket.emit('arduino', { value:  data});
	}
};

//just for debugging
var detectArduinoOnOSX = function() {
	var port;
	console.log('* attempting to detect arduino on mac osx *');
	exec('ls /dev/tty.*', function(error, stdout, stderr){
		if (stdout){
			var ports = stdout.split('\n');
			for (var i = ports.length - 1; i >= 0; i--){
				if (ports[i].search('usbmodem') != -1 || ports[i].search('usbserial') != -1) port = ports[i];
			}
		}
		if (port){
			attemptConnection(port);
		}else{
			detectArduinoOnRaspberryPI();
		}
	});
};

var detectArduinoOnRaspberryPI = function() {
	var port;
	console.log('* attempting to detect arduino on raspberry pi *');
	serialport.list(function (e, ports) {
		ports.forEach(function(obj) {
			if (obj.hasOwnProperty('pnpId')){
		// FTDI captures the duemilanove //
		// Arduino captures the leonardo //
				if (obj.pnpId.search('FTDI') != -1 || obj.pnpId.search('Arduino') != -1) {
					port = obj.comName;
				}
			}
		});
		if (port){
			attemptConnection(port);
		}   else{
			console.log('* failed to find arduino : please check your connections *');
		}
	});
};

var attemptConnection = function(port) {
	console.log('* attempting to connect to arduino at :', port, ' *');
	arduino = new serialport.SerialPort(port, { baudrate: 9600, parser: serialport.parsers.readline("\n") });
	arduino.on("open", function () {
		console.log('* connection to arduino successful ! *');
		arduinoPortIsOpen = true;
		arduino.on('data', onDataFromArduino);
		

		
		arduino.on('close', function(){
			console.log("* connection to Arduino lost *");
		})
		setTimeout(function(){
			sendDataToArduino('init');
		}, 1500);
	});
};

var sendDataToArduino = function(buffer) {
// calling write if an arduino is not connected will crash the server! //
	if (arduino){
		arduino.write(buffer, function(e, results) {
			if (e) {
				console.log('error :: ' + e);
			}   else{
				//console.log('message successfully sent');
			}
		});
		arduino.flush();
	}
};


detectArduinoOnOSX();
//detectArduinoOnRaspberryPI();

