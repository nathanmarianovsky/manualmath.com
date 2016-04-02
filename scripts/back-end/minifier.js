var exports = {};

// Driver function to handle all of the minification
exports.driver = (mkdirp, compressor, minify, fs, app, callback) => {
	// exports.minify_styles(compressor, fs, exports.minify_js(compressor, fs, exports.minify_html(minify, mkdirp, fs, () => {
	// })));
	exports.minify_styles(compressor, fs);
	exports.minify_js(compressor, fs);
	exports.minify_html(minify, mkdirp, fs);
	console.log("Everything has been minified!");
	callback();
};

// Reads the directory of all the styles and minifies them all
exports.minify_styles = (compressor, fs) => {
	fs.readdir("./styles/dev", (err, files) => {
		if(err) { console.log("Reading the styles directory hit an issue: " + err.stack); }
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
		});
	});
};

// Minifies all necessary js files
exports.minify_js = (compressor, fs) => {
	new compressor.minify({
		"type": "yui-js",
		"fileIn": "./node_modules/requirejs/require.js",
		"fileOut": "./scripts/dist/require-min.js",
		"callback": (err, result) => { if(err) { console.log("Minifying the requirejs file threw an error: " + err.stack); } }
	});
	new compressor.minify({
		"type": "yui-js",
		"fileIn": "./node_modules/router5/dist/amd/router5.js",
		"fileOut": "./scripts/dist/router5-min.js",
		"callback": (err, result) => { if(err) { console.log("Minifying the router5 file threw an error: " + err.stack); } }
	});
	new compressor.minify({
		"type": "yui-js",
		"fileIn": "./bower_components/materializecss-amd/dist/materialize.amd.js",
		"fileOut": "./scripts/dist/materialize.amd-min.js",
		"callback": (err, result) => { if(err) { console.log("Minifying the materialize.amd file threw an error: " + err.stack); } }
	});
};

// Minifies the html files in /client
exports.minify_html = (minify, mkdirp, fs) => {
	var container = ["./client/template.html", "./client/about.html", "./client/notation.html"],
		tmp = [];
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
				mkdirp(newpath, err => {
					if(err) { console.log("Could not make the directory" + newpath + ": " + err.stack); }
					tmp.forEach(result => {
						fs.writeFile(result.file_name, result.data_min, err => {
							if(err) { console.log("Could not write the file " + result.file_name + ": " + err.stack); }
						});
					});
				});
			}
		});
	});
};

module.exports = exports;