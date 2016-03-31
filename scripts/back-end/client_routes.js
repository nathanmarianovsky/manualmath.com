var exports = {};

// Adds all of the client routes
exports.add_client_routes = app => {
	// Default url will redirect to /client/about
	app.get("/", (request, response) => {
		// response.redirect("/client/about");
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});


	// All client requests
	app.get("/client/*", (request, response) => {
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});
};

module.exports = exports;