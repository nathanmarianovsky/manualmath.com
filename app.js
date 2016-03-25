// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	fs = require("fs"),
	os = require("os"),
	recursive = require("recursive-readdir"),
	mkdirp = require("mkdirp"),
	compressor = require("node-minify"),
	compression = require("compression"),
	minify = require("html-minifier").minify,
	client_routes = require("./scripts/back-end/client_routes"),
	api_routes = require("./scripts/back-end/api_routes"),
	config = require("./scripts/back-end/config"),
	minifier = require("./scripts/back-end/minifier"),
	app = express(),
	pool = config.add_connections(mysql);

// Tells the app use to compress files whenever possible
app.use(compression());

// Adds all of the routes
client_routes.add_client_routes(app);
api_routes.add_api_routes(app, pool);

// Minifies all html files in /client, CSS filles in /styles/dev, and RequireJS
minifier.minify_all_but_content(mkdirp, compressor, minify, fs);

// Tells the server to listen now that everything has been taken care of
app.listen(8080, () => {
	console.log("The server is now listening!");
});















// recursive("./content", ["current_dev.sql"], (err, files) => {
// 	files.forEach(file => {
// 		devpath = "./";
// 		distpath = "./";
// 		console.log(devpath + "\n");
// 		os.platform() === "win32" ? container = file.split("\\") : container = file.split("/");
// 		for(var i = 0; i < container.length - 1; i++) {
// 			devpath += container[i] + "/";
// 			container[i] == "content" ? distpath += "content-dist/" : distpath += container[i] + "/";
// 			console.log(devpath + "\n");
// 		};
// 		fs.readFile(devpath + container[container.length - 1], "utf8", (err, data) => {
// 			if(err) { console.log("Could not read the file " + devpath + container[container.length - 1] + ": " + err.stack); }
// 			var data_min = minify(data, {
// 				"removeComments": true,
// 				"removeCommentsFromCDATA": true,
// 				"collapseWhitespace": true,
// 				"collapseInlineTagWhitespace": true,
// 				"removeAttributeQuotes": true,
// 				"removeRedundantAttributes": true,
// 				"useShortDoctype": true,
// 				"minifyJS": true,
// 				"minifyCSS": true
// 			});
// 			fs.writeFile(distpath + container[container.length - 1].split(".")[0] + "-min.html", data_min, err => {
// 				if(err) { console.log("Could not write the file " + distpath + container[container.length - 1].split(".")[0] + "-min.html: " + err.stack); }
// 			});
// 		});
// 		// console.log(container);
// 	});
// });




