define(["jquery", "materialize", "router5", "mathjax", "app/functions", "app/routes"], ($, Materialize, router5, MathJax, functions, routes) => {
	$(function() {

		var router = new router5.Router5([
			new router5.RouteNode("def", "/"),
			new router5.RouteNode("about", "/client/about"),
			new router5.RouteNode("subject", "/client/:sname", [
				new router5.RouteNode("topic", "/:tname", [
					new router5.RouteNode("section", "/:section_name", [
						new router5.RouteNode("current_page", "/:current_page_name")
					])
				])
			])
		],{
			defaultRoute: "about"
		});

		functions.get_all("/api/subjects", "/api/topics", "/api/sections", "/api/examples").done((subjects, topics, sections, examples) => {
			functions.organize(subjects, topics, sections, examples);
			functions.sort_subjects(subjects);
			routes.add_listeners(router, subjects, topics, sections, examples);
			functions.handle_side_nav();
			router.start();
		});
	});
});