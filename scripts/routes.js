define(["app/functions"], function(functions) {
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
			if(fromState) {
				if(fromState.name != "notation") {
					functions.subject_side_nav(subjects);
				}
			}
			if($(".side-nav").is(":empty")) {
				functions.subject_side_nav(subjects);
			}
			$("#page_title").text("About");
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$("#about_page").load("/client/about.php");
			if($("#notation_li").hasClass("active")) {
				$("#notation_li").removeClass("active");
			}
			$("#about_li").addClass("active");
			functions.handle_li_coloring();
			functions.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("notation", function(toState, fromState) {
			if(fromState) {
				if(fromState.name != "about") {
					functions.subject_side_nav(subjects);
				}
			}
			if($(".side-nav").is(":empty")) {
				functions.subject_side_nav(subjects);
			}
			$("#page_title").text("Notation");
			$("title").text("Notation");
			$("main").empty();
			$("main").append($("<div>").attr("id", "latex"));
			$("#latex").load("/client/notation.php");
			if($("#about_li").hasClass("active")) {
				$("#about_li").removeClass("active");
			}
			$("#notation_li").addClass("active");
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			functions.handle_links(router, subjects, topics, sections, examples);
			functions.handle_li_coloring();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
		});

		router.addRouteListener("subject", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					$("main").empty();
					$("#page_title").text(subject.clean_name);
					$("title").text(subject.clean_name);
					$("main").append($("<div>").attr("id", "subject_page"));
					$("#subject_page").load("/content/" + subject.sname + "/" + subject.sname + ".html");
					functions.topic_side_nav(subject);
				}
			});
			functions.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							$("main").empty();
							$("#page_title").text(subject.clean_name + " - " + topic.clean_name);
							$("title").text(subject.clean_name + " - " + topic.clean_name);
							$("main").append($("<div>").attr("id", "topic_page"));
							$("#topic_page").load("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html");
							functions.section_side_nav(topic, subject);
						}
					});
				}
			});
			functions.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic.section", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							topic.sections.forEach(function(section) {
								if(section.section_name == toState.params.section_name) {
									$("main").empty();
									$("#page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
									$("main").append($("<div>").attr("id", "latex"));
									$("#latex").load("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html");
									functions.example_side_nav(section, topic);
									$("#section_name" + section.section_id).addClass("active");
									MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
								}
							});
						}
					});
				}
			});
			functions.handle_li_coloring();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			functions.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic.section.current_page", function(toState, fromState) {
			subjects.forEach(function(subject) {
				if(subject.sname == toState.params.sname) {
					subject.topics.forEach(function(topic) {
						if(topic.tname == toState.params.tname) {
							topic.sections.forEach(function(section) {
								if(section.section_name == toState.params.section_name) {
									$("main").empty();
									if($(".side-nav").is(":empty")) {
										functions.example_side_nav(section, topic);
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
										$("#page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
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
												$("#page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
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
			functions.handle_li_coloring();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			functions.handle_links(router, subjects, topics, sections, examples);
		});
	};

	return exports;
});