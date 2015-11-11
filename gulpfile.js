// Defines all the required packages
var gulp = require("gulp"),
	install = require("gulp-install"),
	exec = require("child_process").exec;

// Runs bower install and npm install for the root directory
gulp.task("root_packages", function() {
	return gulp.src(["./bower.json", "./package.json"]).pipe(install({"config.interactive": false, allowRoot: true}));
});

// Runs bower install and npm install for the MaterializeCSS-AMD library
gulp.task("materialize_packages", ["root_packages"], function() {
	process.chdir("./bower_components/materializecss-amd");
	return gulp.src(["./bower.json", "./package.json"]).pipe(install({"config.interactive": false, allowRoot: true}));
});

// Runs gulp build for the MaterializeCSS-AMD library
gulp.task("build_materialize", ["materialize_packages"], function() {
	return exec("gulp build");
});

// Default task that runs all of the tasks above in the correct order and timing
gulp.task("default", ["build_materialize"]);