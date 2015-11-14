define(["app/functions", "app/navs", "app/links"], function(functions, navs, links) {
	var exports = {};

	/*

	Purpose:
	Adds all of the necessary listeners to handle URL changes.

	Parameters:
		router:
			An object representing the current router
		subjects: 
			An array containing all of the subjects
		topics:
			An array containing all of the topics
		sections:
			An array containing all of the sections
		examples:
			An array containing all of the examples

	*/
	exports.add_listeners = function(router, subjects, topics, sections, examples) {
		router.addRouteListener("about", function(toState, fromState) {
			navs.subject_side_nav(subjects);
			$(".page_title").text("About");
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/about.php").done(function(content) {
				$("#about_page").append(content);
				$.get("/client/notation.php").done(function(notation) {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				});
			});
			functions.handle_logo_link("about");
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					if(fromState) {
						if(fromState.name != "subject.notation") {
							navs.topic_side_nav(subject);
						}
					}
					if($(".side-nav").is(":empty")) {
						navs.topic_side_nav(subject);
					}
					$("main").empty();
					$(".page_title").text(subject.clean_name);
					$("title").text(subject.clean_name);
					$("main").append($("<div>").attr("id", "subject_page"));
					$.get("/content/" + subject.sname + "/" + subject.sname + ".html").done(function(content) {
						$("#subject_page").append(content)
						$.get("/content/" + subject.sname + "/Notation.html").done(function(notation) {
							$("#subject_page").append(notation);
							MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
						});
					});
				}
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							$("main").empty();
							$(".page_title").text(subject.clean_name + " - " + topic.clean_name);
							$("title").text(subject.clean_name + " - " + topic.clean_name);
							$("main").append($("<div>").attr("id", "topic_page"));
							$.get("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html").done(function(content) {
								$("#topic_page").append(content);
								MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
							});
							navs.section_side_nav(topic, subject);
						}
					});
				}
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject.topic");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic.section", function(toState, fromState) {
			if(window.innerWidth < 992) {
				$(".button-collapse").sideNav("hide");
			}
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							topic.sections.forEach(function(section) {
								if(section.section_name == toState.params.section_name) {
									navs.example_side_nav(section, topic);
									$("main").empty();
									$(".page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("main").append($("<div>").attr("id", "latex"));
									$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html").done(function(content) {
										$("#latex").append(content);
										MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
									});
									$("#section_name" + section.section_id).addClass("active");
								}
							});
						}
					});
				}
			});
			functions.handle_logo_link("subject.topic.section");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic.section.current_page", function(toState, fromState) {
			if(window.innerWidth < 992) {
				$(".button-collapse").sideNav("hide");
			}
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							topic.sections.forEach(function(section) {
								if(section.section_name == toState.params.section_name) {
									$("main").empty();
									if($(".side-nav").is(":empty")) {
										navs.example_side_nav(section, topic);
									}
									if($("#section_name" + section.section_id).hasClass("active")) {
										$("#section_name" + section.section_id).removeClass("active");
									}
									if(section.section_name == toState.params.current_page_name) {
										$("#section_name" + section.section_id).addClass("active");
										section.examples.forEach(function(example) {
											if($("#examples_li" + example.eid).hasClass("active")) {
												$("#examples_li" + example.eid).removeClass("active");
											}
										});
										$(".page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
										$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
										$("main").append($("<div>").attr("id", "latex"));
										$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html").done(function(content) {
											$("#latex").append(content);
											MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
										});
									}
									else {
										section.examples.forEach(function(example) {
											if($("#examples_li" + example.eid).hasClass("active")) {
												$("#examples_li" + example.eid).removeClass("active");
											}
											if(example.ename == toState.params.current_page_name) {
												$("#examples_li" + example.eid).addClass("active");
												$(".page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
												$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
												$("main").append($("<div>").attr("id", "latex"));
												$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + example.ename + ".html").done(function(content) {
													$("#latex").append(content);
													MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
													$("#latex .show_solution").click(function(defaultevent) {
														defaultevent.preventDefault();
														$("#latex .show_solution").hide();
														$("#latex .hidden_div").show();
													});
												});
											}
										});
									}
								}
							});
						}
					});
				}
			});
			functions.handle_logo_link("subject.topic.section.current_page");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});
	};

	return exports;
});