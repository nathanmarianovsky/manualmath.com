// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	client_routes = require("./scripts/back-end/client_routes"),
	api_routes = require("./scripts/back-end/api_routes"),
	config = require("./scripts/back-end/config"),
	app = express(),
	pool = config.add_connections(mysql);


// Add all of the routes
client_routes.add_client_routes(app);
api_routes.add_api_routes(app, pool);

// Tell the server to listen on the port
app.listen(8080);