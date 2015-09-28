define(['jquery', 'materialize', 'router5', 'mathjax', 'app/functions', 'app/routes'], function($, Materialize, router5, MathJax, functions, routes) {
	$(function() {

		var router = new router5.Router5([
			new router5.RouteNode('home', '/client/home'),
			new router5.RouteNode('all', '/client/all'),
			new router5.RouteNode('subject', '/client/:sname', [
				new router5.RouteNode('topic', '/:tname', [
					new router5.RouteNode('section', '/:section_name', [
						new router5.RouteNode('current_page', '/:current_page_name')
					])
				])
			])
		],{
			defaultRoute: 'home'
		});

		var getAll = function() {
			var urls = Array.prototype.slice.call(arguments);
			var promises = urls.map(function(url) {
				return $.get(url);
			});
			var def = $.Deferred();
			$.when.apply($, promises).done(function() {
				var responses = Array.prototype.slice.call(arguments);
				def.resolve.apply(def, responses.map(function(res) { return res[0]; }));
			});
			return def.promise();
		};

		getAll('../api/subjects', '../api/topics', '../api/sections', '../api/examples').done(function(subjects, topics, sections, examples) {
			functions.organize(subjects, topics, sections, examples);
			functions.sort_subjects(subjects);

			routes.add_listeners(router, subjects, topics, sections, examples);

			$(".button-collapse").sideNav();

			router.start();
		});
	});
});