// Define the necessary components
var express = require("express"),
	mysql = require("mysql"),
	fs = require("fs"),
	os = require("os"),
	recursive = require("recursive-readdir"),
	compressor = require("node-minify"),
	minify = require("html-minifier").minify,
	client_routes = require("./scripts/back-end/client_routes"),
	api_routes = require("./scripts/back-end/api_routes"),
	config = require("./scripts/back-end/config"),
	container = [],
	devpath = "./",
	distpath = "./",
	app = express(),
	pool = config.add_connections(mysql);


// Adds all of the routes
client_routes.add_client_routes(app);
api_routes.add_api_routes(app, pool);


// Reads the directory of all the styles and minifies them all
fs.readdir("./styles/dev", (err, files) => {
	if(err) { console.log("Reading the directory hit an issue: " + err.stack); }
	var wait = files.length;
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
					// Tells the server to listen now that everything has been taken care of
					app.listen(8080, () => {
						console.log("The server is now listening!");
					});
				}
			});
		}
	});
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




// fs.readFile("./content/Ordinary_Differential_Equations/Notation.html", "utf8", (err, data) => {
// 	if(err) { console.log("Could not read the file " + devpath + container[container.length - 1] + ": " + err.stack); }
// 	var data_min = minify(data, {
// 		"removeComments": true,
// 		"removeCommentsFromCDATA": true,
// 		"collapseWhitespace": true,
// 		"collapseInlineTagWhitespace": true,
// 		"removeAttributeQuotes": true,
// 		"removeRedundantAttributes": true,
// 		"useShortDoctype": true,
// 		"minifyJS": true,
// 		"minifyCSS": true
// 	});
// 	fs.writeFile("./content/Ordinary_Differential_Equations/Notation-min.html", data_min, err => {
// 		if(err) { console.log("Could not write the file " + distpath + container[container.length - 1].split(".")[0] + "-min.html: " + err.stack); }
// 	});
// });