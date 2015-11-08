// Defines all the required packages
var gulp = require("gulp"),
	install = require("gulp-install"),
	gutil = require("gulp-util"),
	exec = require("child_process").exec;

// Runs bower install and npm install for the root directory
gulp.task("root_packages", function() {
	gulp.src(["./bower.json"]).pipe(install({"config.interactive": false, allowRoot: true}));
	gutil.log("Bower Components Have Been Added!");
	gulp.src(["./package.json"]).pipe(install());
	gutil.log("Node Modules Have Been Added!");
});

// Runs bower install and npm install for the MaterializeCSS-AMD library
gulp.task("materialize_packages", function() {
	gulp.src(["./bower_components/materializecss-amd/bower.json"]).pipe(install({"config.interactive": false, allowRoot: true}));
	gutil.log("Bower Components for MaterializeCSS-AMD Have Been Added!");
	gulp.src(["./bower_components/materializecss-amd/package.json"]).pipe(install());
	gutil.log("Node Modules for MaterializeCSS-AMD Have Been Added!");
});

// Runs gulp build for the MaterializeCSS-AMD library
gulp.task("build_materialize", function() {
	process.chdir("./bower_components/materializecss-amd");
	exec("gulp build");
	gutil.log("Gulp Build Has Executed for MaterializeCSS-AMD");
});