define(['jquery', 'materialize', 'router5', 'mathjax', 'app/functions'], function($, Materialize, router5, MathJax, functions) {
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

			router.addRouteListener('home', function(toState, fromState) {
				functions.subject_side_nav(subjects);
				$('#page_title').text('Home');
				$('title').text('Home');
				$('main').load('home.php');
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			router.addRouteListener('all', function(toState, fromState) {
				functions.subject_side_nav(subjects);
				functions.default_load();
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			router.addRouteListener('subject', function(toState, fromState) {
				subjects.forEach(function(subject) {
					if(subject.sname == toState.params.sname) {
						$('main').empty();
						$('#page_title').text(subject.clean_name);
						$('title').text(subject.clean_name);
						$('main').append($('<div>').attr('id', 'latex'));
						$('#latex').load('/content/' + subject.sname + '/' + subject.sname + '.html');
						functions.topic_side_nav(subject);
					}
				});
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			router.addRouteListener('subject.topic', function(toState, fromState) {
				subjects.forEach(function(subject) {
					if(subject.sname == toState.params.sname) {
						subject.topics.forEach(function(topic) {
							if(topic.tname == toState.params.tname) {
								$('main').empty();
								$('#page_title').text(subject.clean_name + ' - ' + topic.clean_name);
								$('title').text(subject.clean_name + ' - ' + topic.clean_name);
								$('main').append($('<div>').attr('id', 'latex'));
								$('#latex').load('/content/' + subject.sname + '/' + topic.tname + '/' + topic.tname + '.html');
								functions.section_side_nav(topic, subject);
							}
						});
					}
				});
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			router.addRouteListener('subject.topic.section', function(toState, fromState) {
				subjects.forEach(function(subject) {
					if(subject.sname == toState.params.sname) {
						subject.topics.forEach(function(topic) {
							if(topic.tname == toState.params.tname) {
								topic.sections.forEach(function(section) {
									if(section.section_name == toState.params.section_name) {
										$('main').empty();
										$('#page_title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
										$('title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
										$('main').append($('<div>').attr('id', 'latex'));
										$('#latex').load('/content/' + subject.sname + '/' + topic.tname + '/' + section.section_name + '/' + section.section_name + '.html');
										functions.example_side_nav(section, topic);
										MathJax.Hub.Queue(['Typeset',MathJax.Hub,'main']);
									}
								});
							}
						});
					}
				});
				MathJax.Hub.Queue(['Typeset',MathJax.Hub,'main']);
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			router.addRouteListener('subject.topic.section.current_page', function(toState, fromState) {
				subjects.forEach(function(subject) {
					if(subject.sname == toState.params.sname) {
						subject.topics.forEach(function(topic) {
							if(topic.tname == toState.params.tname) {
								topic.sections.forEach(function(section) {
									if(section.section_name == toState.params.section_name) {
										$('main').empty();
										if($('.side-nav').is(':empty')) {
											functions.example_side_nav(section, topic);
										}
										if(section.section_name == toState.params.current_page_name) {
											$('#sectionname_' + section.section_id).addClass('active');
											$('#page_title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
											$('title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
											$('main').append($('<div>').attr('id', 'latex'));
											$('#latex').load('/content/' + subject.sname + '/' + topic.tname + '/' + section.section_name + '/' + section.section_name + '.html');
										}
										else {
											section.examples.forEach(function(example) {
												if(example.ename == toState.params.current_page_name) {
													$('#examples_' + example.eid).addClass('active');
													$('#page_title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
													$('title').text(subject.clean_name + ' - ' + topic.clean_name + ' - ' + section.clean_name);
													$('main').append($('<div>').attr('id', 'latex'));
													$('#latex').load('/content/' + subject.sname + '/' + topic.tname + '/' + section.section_name + '/' + example.ename + '.html', function() {
														$('#latex .show_solution').click(function(defaultevent) {
															defaultevent.preventDefault();
															$('#latex .show_solution').hide();
															$('#latex .hidden_div').show();
														});
													});
												}
											});
										}
										if($('a').hasClass('active')) {
											$(this).addClass('light-blue accent-4');
										}
										MathJax.Hub.Queue(['Typeset',MathJax.Hub,'main']);
									}
								});
							}
						});
					}
				});
				MathJax.Hub.Queue(['Typeset',MathJax.Hub,'main']);
				functions.handle_links(router, subjects, topics, sections, examples);
			});

			$(".button-collapse").sideNav();

			router.start();
		});
	});
});