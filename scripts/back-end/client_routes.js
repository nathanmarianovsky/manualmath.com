var exports = {};

// Adds all of the client routes
exports.add_client_routes = app => {
	// Default url will redirect to /client/about
	app.get("/", (request, response) => {
		response.redirect("/client/about");
	});


	// This will load the template file where the rest is handled by the front-end
	app.get("/client/about", (request, response) => {
		response.sendFile("./client/dist/template-min.html", { "root": "./" });
	});


	// Any url going to the client folder will automatically all redirect to /client/about
	app.get("/client/*", (request, response) => {
		response.redirect("/client/about");
	});
};

module.exports = exports;