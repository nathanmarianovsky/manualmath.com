var exports = {},
	fs = require("fs");

// Minifies all of the CSS files, RequireJS, and html files found inside of /client
// Once finished it returns "true"
exports.minify_all_but_content = (mkdirp, compressor, minify) => {
	var container = [],
		splitting = [],
		name = [],
		tmp = [],
		devpath = "./",
		distpath = "./",
		newpath = "./",
		wait = 0;

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
}

module.exports = exports;