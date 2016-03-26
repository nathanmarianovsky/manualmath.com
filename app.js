// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	fs = require("fs"),
	os = require("os"),
	recursive = require("recursive-readdir"),
	mkdirp = require("mkdirp"),
	compressor = require("node-minify"),
	compression = require("compression"),
	favicon = require("serve-favicon"),
	minify = require("html-minifier").minify,
	client_routes = require("./scripts/back-end/client_routes"),
	api_routes = require("./scripts/back-end/api_routes"),
	config = require("./scripts/back-end/config"),
	minifier = require("./scripts/back-end/minifier"),
	app = express(),
	pool = config.add_connections(mysql);

// Tells the app use to compress files whenever possible
app.use(compression());

// Tells the app where to locate the favicon
app.use(favicon("./favicon.ico", {"maxAge": 2592000000 }));

// Tells the app to use the current directory as the default path
app.use(express.static(__dirname, {"maxAge": 864000000 }));

// Adds all of the routes
client_routes.add_client_routes(app);
api_routes.add_api_routes(app, pool, fs);

// Minifies all html files in /client, CSS filles in /styles/dev, and RequireJS
minifier.minify_all_but_content(mkdirp, compressor, minify, fs);

// Tells the server to listen now that everything has been taken care of
app.listen(8080, () => {
	console.log("The server is now listening!");
});