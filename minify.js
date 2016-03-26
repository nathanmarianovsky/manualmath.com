var mkdirp = require("mkdirp"),
	compressor = require("node-minify"),
	minify = require("html-minifier").minify,
	minifier = require("./scripts/back-end/minifier");

// Minifies all html files in /client, CSS filles in /styles/dev, and RequireJS
minifier.minify_all_but_content(mkdirp, compressor, minify);