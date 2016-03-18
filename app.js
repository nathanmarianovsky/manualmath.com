// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	path = require("path"),
	app = express();


// Define the connection and its associated parameters
var connection = mysql.createConnection({
	"host": host,
	"user": user,
	"password": password,
	"database": database
});


// Open the connection and check if any errors pop up
connection.connect(err => {
	if(err) {
		console.error("Error Connecting: " + err.stack);
		return;
	}
});


// Tell the server to listen on the port
app.listen(port, () => {});


// Default url will redirect to /client/about
app.get("/", (request, response) => {
	response.redirect("/client/about");
});


// This will load the template file where the rest is handled by the front-end
app.get("/client/about", (request, response) => {
	response.sendFile(__dirname + "/client/template.html");
});


// Any url going to the client folder will automatically all redirect to /client/about
app.get("/client/*", (request, response) => {
	response.redirect("/client/about");
});


// The API methods to get all subjects, topics, sections, or examples
app.get("/api/:objects", (request, response) => {
	var objects = request.params.objects;
	if(objects == "subjects") {
		connection.query("SELECT sid,sname,`order` FROM subject ORDER BY `order` ASC", (err, results) => {
			if(err) {
				console.error("Error Connecting: " + err.stack);
				return;
			}
			response.send(JSON.stringify(results));
		});
	}
	else if(objects == "topics") {
		connection.query("SELECT sid,tid,tname,`order` FROM topic", (err, results) => {
			if(err) {
				console.error("Error Connecting: " + err.stack);
				return;
			}
			response.send(JSON.stringify(results));
		});
	}
	else if(objects == "sections") {
		connection.query("SELECT section_id,tid,section_name,`order` FROM section", (err, results) => {
			if(err) {
				console.error("Error Connecting: " + err.stack);
				return;
			}
			response.send(JSON.stringify(results));
		});
	}
	else if(objects == "examples") {
		connection.query("SELECT eid,ename,section_id,`order` FROM example", (err, results) => {
			if(err) {
				console.error("Error Connecting: " + err.stack);
				return;
			}
			response.send(JSON.stringify(results));
		});
	}
});

app.get("/api/:want/:provider/:param_type/:param", (request, response) => {
	var want = request.params.want,
		provider = request.params.provider,
		param_type = request.params.param_type,
		param = request.params.param;

	if(want.slice(0,-1) == provider) {
		var holder = "";
		if(param_type == "name") { 
			provider == "section" ? holder = provider.slice(0,1) + "name" : holder = "section_name";
		}
		else if(param_type == "id") { 
			provider != "section" ? holder = provider.slice(0,1) + "name" : holder = "section_id";
		}
		if(provider == "subject") {
			connection.query("SELECT sid,sname,`order` FROM subject WHERE ?=?", [holder, param], (err, results) => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					return;
				}
				response.send(JSON.stringify(results));
			});
		}
		else if(provider == "topic") {
			connection.query("SELECT tid,sid,tname,`order` FROM topic WHERE ?=?", [holder, param], (err, results) => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					return;
				}
				response.send(JSON.stringify(results));
			});
		}
		else if(provider == "section") {
			connection.query("SELECT section_id,tid,section_name,`order` FROM section WHERE ?=?", [holder, param], (err, results) => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					return;
				}
				response.send(JSON.stringify(results));
			});
		}
		else if(provider == "example") {
			connection.query("SELECT eid,section_id,ename,`order` FROM example WHERE ?=?", [holder, param], (err, results) => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					return;
				}
				response.send(JSON.stringify(results));
			});
		}
		else {
			response.send("No such object exists in the database!");
		}
	}
});










