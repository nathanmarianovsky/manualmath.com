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
	app = express(),
	pool = config.add_connections(mysql),
	container = [],
	splitting = [],
	name = [],
	tmp = [],
	devpath = "./",
	distpath = "./",
	newpath = "./",
	wait = 0;

// Tells the app use to compress files whenever possible
app.use(compression());

// Tells the app where to locate the favicon
app.use(favicon("./favicon.ico", {"maxAge": 2592000000 }));

// Tells the app to use the current directory as the default path
// app.use(express.static(__dirname, {"maxAge": 864000000 }));
app.use(express.static(__dirname));

// Adds all of the routes
client_routes.add_client_routes(app);
api_routes.add_api_routes(app, pool, fs);

// Reads the directory of all the styles and minifies them all
fs.readdir("./styles/dev", (err, files) => {
	if(err) { console.log("Reading the directory hit an issue: " + err.stack); }
	wait = files.length;
	files.forEach(file => {
		var name = file.split("."),
			devpath = "./styles/dev/" + file,
			distpath = "./styles/dist/" + name[0] + "-min.css";
		new compressor.minify({
			"type": "yui-css",
			"fileIn": devpath,
			"fileOut": distpath,
			"callback": (err, result) => {
				if(err) { console.log("Minifying the css file " + file + " threw an error: " + err.stack); }
			}
		});
		wait--;
		if(wait == 0) {
			// Minifies requirejs 
			new compressor.minify({
				"type": "yui-js",
				"fileIn": "./node_modules/requirejs/require.js",
				"fileOut": "./scripts/dist/require-min.js",
				"callback": (err, result) => {
					if(err) { console.log("Minifying the requirejs file threw an error: " + err.stack); }
					// Minifies the html files in /client
					container = ["./client/template.html", "./client/about.html", "./client/notation.html"];
					container.forEach(file => {
						fs.readFile(file, "utf8", (err, data) => {
							if(err) { console.log("Could not read the file " + file + ": " + err.stack); }
							splitting = file.split("/");
							newpath = "";
							name = splitting[splitting.length - 1].split(".");
							for(var k = 0; k < splitting.length - 1; k++) {
								newpath += splitting[k] + "/";
							}
							newpath += "dist/";
							var data_min = minify(data, {
								"removeComments": true,
								"removeCommentsFromCDATA": true,
								"collapseWhitespace": true,
								"collapseInlineTagWhitespace": true,
								"removeAttributeQuotes": true,
								"removeRedundantAttributes": true,
								"useShortDoctype": true,
								"minifyJS": true,
								"minifyCSS": true
							});
							var obj = {
								"data_min": data_min,
								"file_name": newpath + name[0] + "-min." + name[1],
							};
							tmp.push(obj);
							if(tmp.length == container.length) {
								wait = container.length;
								mkdirp(newpath, err => {
									if(err) { console.log("Could not make the directory" + newpath + ": " + err.stack); }
									tmp.forEach(result => {
										fs.writeFile(result.file_name, result.data_min, err => {
											if(err) { console.log("Could not write the file " + result.file_name + ": " + err.stack); }
											wait--;
											if(wait == 0) {
												console.log("All html files in /client, CSS files in /styles/dev, and RequireJS have been minified!");
												// Tells the server to listen now that everything has been taken care of
												app.listen(80, () => {
													console.log("The server is now listening!");
												});
											}
										});
									});
								});
							}
						});
					});
				}
			});
		}
	});
});