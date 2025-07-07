var fs = require("fs"),
	mkdirp = require("mkdirp"),
	compressor = require("@node-minify/core"),
	minify = require("html-minifier").minify,
	minifier = require("./scripts/back-end/minifier");

// Minifies all html files in /client, CSS filles in /styles/dev, and RequireJS
minifier.driver(mkdirp, compressor, minify, fs, {}, () => {});