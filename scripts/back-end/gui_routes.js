var exports = {};

// Adds all of the client routes
exports.add_gui_routes = app => {
	// Default request for cms
	app.get("/login", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	app.get("/cms", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	// Default url will redirect to /client/about
	app.get("/", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});

	// All client requests
	app.get("/client/*", (request, response) => {
		response.sendFile("./pages/dist/template-min.html", { "root": "./" });
	});
};

module.exports = exports;