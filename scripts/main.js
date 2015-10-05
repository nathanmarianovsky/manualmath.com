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

		// console.log(window.innerWidth);

		// $(window).on('resize', functions.handle_page_width);

		// if(window.innerWidth < '1200px') {
		// 	$('#nav-mobile').css('visibility', 'hidden');
		// 	// console.log('true');
		// 	$('#nav-mobile').css('display', 'none');
		// }

		functions.getAll('../api/subjects', '../api/topics', '../api/sections', '../api/examples').done(function(subjects, topics, sections, examples) {
			functions.organize(subjects, topics, sections, examples);
			functions.sort_subjects(subjects);

			routes.add_listeners(router, subjects, topics, sections, examples);

			$(".button-collapse").sideNav({
				menuWidth: 350
			});

			// $('.drag-target').on('swiperight', function() {
			// 	$(this).css({
			// 		'display': 'inline',
			// 		'visibility': 'visible'
			// 	});
			// });
			if(window.innerWidth < 992) {
				console.log(window.innerWidth);
				$('#hamburger_button').click(function() {
					// $('#nav-mobile').css('visibility', 'visible');
					$('#nav-mobile').css({
						'display': 'inline',
						'visibility': 'visible'
					});
				});
			}

			router.start();
		});
	});
});