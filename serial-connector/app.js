
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , socket;
  
var app = express();

app.configure(function(){
	app.use(express.compress());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	//app.use(express.favicon(path.join(__dirname + '/public/favicon.ico'))); 
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));  
});

var io = require('socket.io').listen(app.listen(process.env.PORT || 3000));


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


app.get('/', function(req, res) {
  res.render('index', { title: 'The index page!' })
});


io.sockets.on('connection', function (sock){
	socket = sock;
	console.log("Socket connection made");
})



//************ ///ARDUINO SERIALPORT LOGIC\\\ ***********************

var serialport = require('serialport')
  , exec = require('child_process').exec
  , arduino
  , arduinoPortIsOpen = false;


var onDataFromArduino = function(data) {
	console.log('Arduino: ' + data);

	//write data to text file
	// socket.emit('news', { hello: 'KITTY1' });
}



/*
	Utility functions for managing serial connection w/ Arduino
*/

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty-usbserial1", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n") 
}, false);


serialPort.on('error', function(err) {
console.log("oups"); 
  console.log(err); // THIS SHOULD WORK!
});

//list what's on the serial port
serialport.list(function (err, ports) {
	console.log('list');
	ports.forEach(function(port) {
		console.log(port.comName);
		console.log(port.pnpId);
		console.log(port.manufacturer);
	});
});

serialPort.open(function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });  
  serialPort.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });  
});


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
		}   else{
			detectArduinoOnRaspberryPI();
		}
	});
}

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
}

var attemptConnection = function(port) {
	console.log('* attempting to connect to arduino at :', port, ' *');
	arduino = new serialport.SerialPort(port, { baudrate: 9600, parser: serialport.parsers.readline("\n") });
	arduino.on("open", function () {
		console.log('* connection to arduino successful ! *');
		arduinoPortIsOpen = true;
		arduino.on('data', onDataFromArduino);
		//arduino.on('close', closedConnection)
		//setTimeout(doHandShake, 1500);
	});
}

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
}


//detectArduinoOnOSX();
//detectArduinoOnRaspberryPI();

