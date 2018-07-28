var exports = {};

// Adds all of the client routes
exports.add_gui_routes = app => {
	// 
	app.get("/login", (request, response) => {
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});

	// Default url will redirect to /client/about
	app.get("/", (request, response) => {
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});

	// All client requests
	app.get("/client/*", (request, response) => {
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});
};

module.exports = exports;