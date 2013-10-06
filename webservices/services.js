var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , querystring = require('querystring');
  
var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'password',
	database: "gitup"
});

var splitter = require('./splitter.js');
var url = require('url');

app.listen(80);

function handler (req, res) {
    var path = req.url;
    var qs = "";
    var qsOffset = req.url.indexOf("?");

    if (qsOffset > -1) {
        path = req.url.substring(0, qsOffset);
        qs = req.url.substring(qsOffset + 1);
    }

    if (path == "/") {
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
    }
    else if (path == "/api") {
        res.writeHead(200);
        return res.end('API is up and running');
    }
    else if (path == "/user/all-users") {
         connection.query('select * from users;', function (error, rows, fields) { 
         //console.log(error);
         res.writeHead(200, {'Content-Type': 'text/html'});
		 str='';
		 for(i=0;i<rows.length;i++)
			str = str + '<a href="http://localhost/user/details?userId=' + rows[i].user_id + '">' + rows[i].email +'</a><br>';
		 res.end( str);
      	 });
    }
    else if (path == "/user/add-user-form") {
        fs.readFile(__dirname + '/adduser.html', function (err, data) {
		if (err) {
		 	//console.log(err);
	        	res.writeHead(500);
	                return res.end('Error loading adduser.html');
	        }
	
	        res.writeHead(200);
	        res.end(data);
        });
    }
    else if (path == "/user/add-chair-form") {
        fs.readFile(__dirname + '/addchair.html', function (err, data) {
		if (err) {
		 	//console.log(err);
	        	res.writeHead(500);
	                return res.end('Error loading addchair.html');
	        }
	
	        res.writeHead(200);
	        res.end(data);
        });
    }
    else if (path == "/user/insert-user") {
	if (req.method == 'POST') {
        	var body = '';
       		req.on('data', function (chunk) {
            		body += chunk;
        	});
        	req.on('end', function () {
            		if (body != '')
			{
	    			var hash = splitter.formValues(body);

				connection.query('insert into users ( email, firstname, lastname, password, chair_id) values (' + "'" + hash["email"] +"'" +',' + "'"+ hash["fname"] +"'" +','
				+ "'"+ hash["lname"] +"'"+','+ "'"+ hash["pwd"] +"'" +',' + "'"+ hash["chairid"] +"'" +');', function (error, rows, fields) { 
				console.log(error);
         				res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end( 'record inserted...');
				});
			}
        	});
    	}

    }
    else if (path == "/user/details") { 
    		var querystr = url.parse(req.url,true).query; 
    		//console.log(querystr);
        	var userid = querystr.userId;
        	//console.log(userid);
       		if (userid!= '')
		{
			connection.query('select * from users where user_id=' + userid, function (error, rows, fields) { 
				//console.log(error);
         			res.writeHead(200, {'Content-Type': 'text/html'});
         			str = 'Here is the record<br>';
         			str = str + rows[0].email + '<br>' + rows[0].firstname + '<br>' + rows[0].lastname + '<br>' + rows[0].password + '<br>' + rows[0].chair_id;
				res.end(str);
			});
		}
    }
    else if (path == "/user/insert-chair") {
	if (req.method == 'POST') {
        	var body = '';
       		req.on('data', function (chunk) {
            		body += chunk;
        	});
        	req.on('end', function () {
            		if (body != '')
			{
	    			var hash = splitter.formValues(body);

				connection.query('insert into chairs ( chair_name ) values (' + "'" + hash["chairname"] +"'" +');', function (error, rows, fields) { 
				//console.log(error);
         				res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end( 'record inserted...');
				});
			}
        	});
    	}

    }
    else if (path == "/user/activity/set") {
    		var querystr = url.parse(req.url,true).query; 
    		//console.log(querystr);
        	var userid = querystr.userId;
        	var isSitting = 0;
        	if (isSitting == 'true'){
        		isSitting = 1;
        	}
        	if (userid!= '')
		{
				connection.query('insert into activity ( user_id, is_sitting ) values (' + userid + ',' + isSitting + ');', function (error, rows, fields) { 
				//console.log(error);
         				res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end( 'activity inserted...');
				});
		}
    }
}

//TO BE DONE

//user/edit [POST -> all fields]
//user/activity/current-sitting-duration [userID]
//user/activity/sitting-duration-per-period [userID, start, end]
//select * from activity  where user_id=1 and is_sitting=1 order by timestamp desc limit 1
