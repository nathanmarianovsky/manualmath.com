var exports = {};

// Driver function to handle all of the minification
exports.driver = (mkdirp, compressor, minify, fs, app, callback) => {
	const yui = require('@node-minify/yui');
	exports.minify_styles(compressor, yui, fs);
	exports.minify_js(compressor, yui, fs);
	exports.minify_html(minify, mkdirp, fs);
	console.log("Everything has been minified!");
	callback();
};

// Reads the directory of all the styles and minifies them all
exports.minify_styles = (compressor, yui, fs) => {
	fs.readdir("./styles/dev", (err, files) => {
		if(err) {
			console.log("Reading the styles directory" +
				" hit an issue: " + err.stack);
		}
		files.forEach(file => {
			var name = file.split("."),
				devpath = "./styles/dev/" + file,
				distpath = "./styles/dist/" + name[0] +
					"-min.css";
			compressor({
				"compressor": yui,
				"type": "css",
				"input": devpath,
				"output": distpath,
				"callback": (err, result) => {
					if(err) {
						console.log("Minifying the css file "
							+ file + " threw an error: " +
							err.stack);
					}
				}
			});
		});
	});
};

// Minifies all necessary js files
exports.minify_js = (compressor, yui, fs) => {
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./node_modules/requirejs/require.js",
		"output": "./scripts/dist/require-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the requirejs" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./node_modules/router5/dist/amd/router5.js",
		"output": "./scripts/dist/router5-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the router5" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/functions.js",
		"output": "./scripts/dist/functions-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the functions" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/main.js",
		"output": "./scripts/dist/main-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the main" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/config.js",
		"output": "./scripts/dist/config-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the config" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/navs.js",
		"output": "./scripts/dist/navs-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the navs" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/routes.js",
		"output": "./scripts/dist/routes-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the routes" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
	compressor({
		"compressor": yui,
		"type": "js",
		"input": "./scripts/front-end/links.js",
		"output": "./scripts/dist/links-min.js",
		"callback": (err, result) => {
			if(err) {
				console.log("Minifying the links" +
					" file threw an error: " +
					err.stack);
			}
		}
	});
};

// Minifies the html files in /client
exports.minify_html = (minify, mkdirp, fs) => {
	var container = [
			"./pages/template.html",
			"./pages/main.html",
			"./pages/login.html", 
			"./pages/button.html",
			"./pages/modal.html",
			"./pages/contributor-profile.html",
			"./pages/change-confirmation.html",
			"./pages/password-recovery.html",
			"./pages/password-change.html",
			"./pages/sidenav-change.html",
			"./pages/committee-table.html",
			"./pages/edit-bar.html",
			"./pages/add-link.html",
			"./pages/bulleted-list-form.html",
			"./pages/numbered-list-form.html"
		],
		tmp = [];
	container.forEach(file => {
		fs.readFile(file, "utf8", (err, data) => {
			if(err) {
				console.log("Could not read the file "
					+ file + ": " + err.stack);
			}
			splitting = file.split("/");
			newpath = "";
			name = splitting[splitting.length - 1]
				.split(".");
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
				"useShortDoctype": true,
				"minifyJS": true,
				"minifyCSS": true
			});
			var obj = {
				"data_min": data_min,
				"file_name": newpath + name[0] +
					"-min." + name[1],
			};
			mkdirp(newpath).then((parent, err) => {
				if(err) {
					console.log("Could not make the" +
						" directory" + newpath +
						": " + err.stack);
				}
				fs.writeFile(obj.file_name, obj.data_min,
					err => {
					if(err) {
						console.log("Could not write" +
							" the file " + obj.file_name +
							": " + err.stack);
					}
				});
			});
		});
	});
};

module.exports = exports;