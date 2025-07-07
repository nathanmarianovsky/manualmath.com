// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	fs = require("fs"),
	os = require("os"),
	recursive = require("recursive-readdir"),
	{ mkdirp } = require("mkdirp"),
	compressor = require("@node-minify/core"),
	compression = require("compression"),
	favicon = require("serve-favicon"),
	minify = require("html-minifier").minify,
	client_routes = require("./scripts/back-end/gui_routes"),
	api_routes = require("./scripts/back-end/api_routes"),
	config = require("./scripts/back-end/config"),
	minifier = require("./scripts/back-end/minifier"),
	app = express(),
	pool = config.add_connections(mysql),
	bodyParser = require("body-parser"),
	cluster = require("cluster"),
	numCPUs = require("os").cpus().length;
	// morgan = require("morgan");

// app.use(morgan("dev"));

// Tells the app use to compress files whenever possible
app.use(compression());

// // Tells the app where to locate the favicon
app.use(favicon("./favicon.ico", {"maxAge": 2592000000 }));

// Tells the app to use the current directory as the default path
app.use(express.static(__dirname, {"maxAge": 864000000 }));

// Tells the app to use json data parsing
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

// Adds all of the routes
client_routes.add_gui_routes(app);
api_routes.add_api_routes(app, pool);

if(cluster.isMaster) {
	minifier.driver(mkdirp, compressor, minify, fs, app, () => {});
	for(var i = 0; i < numCPUs; i++) { cluster.fork(); }
	cluster.on("exit", (worker, code, signal) => { cluster.fork(); });
} 
else {
  	app.listen(80, () => {
		console.log("The server is now listening!");
	});
}