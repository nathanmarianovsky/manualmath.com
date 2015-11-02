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
			var page = $("#about_page").load("/client/about.php");
			$.get("/client/notation.php").done(function(notation) {
				page.append(notation);
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("about");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
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
					var subject_page = $("#subject_page").load("/content/" + subject.sname + "/" + subject.sname + ".html");
					$.get("/content/" + subject.sname + "/notation.html").done(function(notation) {
						subject_page.append(notation);
						$.get("/client/subject_directions.php").done(function(content) {
							subject_page.append(content);
						});
					});
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				}
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
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
							var topic_page = $("#topic_page").load("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html");
							$.get("/client/topic_directions.php").done(function(content) {
								topic_page.append(content);
								$("#second_li").text("Click on " + subject.clean_name + " in the menu to go back to the subject page");
							});
							navs.section_side_nav(topic, subject);
							MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
						}
					});
				}
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject.topic");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
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
									$("main").empty();
									$(".page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("main").append($("<div>").attr("id", "latex"));
									$("#latex").load("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html");
									navs.example_side_nav(section, topic);
									$("#section_name" + section.section_id).addClass("active");
									MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
								}
							});
						}
					});
				}
			});
			functions.handle_logo_link("subject.topic.section");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
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
										$("#latex").load("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html");
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
												$("#latex").load("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + example.ename + ".html", function() {
													$("#latex .show_solution").click(function(defaultevent) {
														defaultevent.preventDefault();
														$("#latex .show_solution").hide();
														$("#latex .hidden_div").show();
													});
												});
											}
										});
									}
									MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
								}
							});
						}
					});
				}
			});
			functions.handle_logo_link("subject.topic.section.current_page");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
		});
	};

	return exports;
});