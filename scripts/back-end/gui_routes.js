var exports = {};

// Adds all of the client routes
exports.add_gui_routes = app => {
	// Default request for cms login
	app.get("/login", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	// Default request for cms default landing page
	app.get("/cms", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	// Default request will load default landing page
	app.get("/", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	// All client requests
	app.get("/client/*", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});
};

module.exports = exports;