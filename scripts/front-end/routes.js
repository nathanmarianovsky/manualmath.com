define(["dist/functions-min", "dist/navs-min", "dist/links-min"], function(functions, navs, links) {
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
		router.addRouteListener("def", function(toState, fromState) {
			if(functions.width_func() < 992) {
				$(".button-collapse").sideNav("hide");
			}
			navs.driver("about", subjects);
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/dist/about-min.html").done(function(content) {
				$("#about_page").append(content);
				$.get("/client/dist/notation-min.html").done(function(notation) {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				});
			});
			functions.handle_logo_link("about");
			functions.handle_logo();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("about", navs, subjects);
			functions.handle_desktop_title("about");
		});

		router.addRouteListener("about", function(toState, fromState) {
			if(functions.width_func() < 992) {
				$(".button-collapse").sideNav("hide");
			}
			navs.driver("about", subjects);
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/dist/about-min.html").done(function(content) {
				$("#about_page").append(content);
				$.get("/client/dist/notation-min.html").done(function(notation) {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				});
			});
			functions.handle_logo_link("about");
			functions.handle_logo();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("about", navs, subjects);
			functions.handle_desktop_title("about");
		});

		router.addRouteListener("subject", function(toState, fromState) {
			if(functions.is_mobile()) {
				$(".button-collapse").sideNav("hide");
			}
			var subject = subjects.filter(function(iter) {
				return iter.sname == toState.params.sname;
			})[0];
			navs.driver("subject", subject);
			$("main").empty();
			$("title").text(subject.clean_name);
			$("main").append($("<div>").attr("id", "subject_page"));
			$.get("/content/" + subject.sname + "/" + subject.sname + ".html").done(function(content) {
				$("#subject_page").append(content);
				functions.handle_breadcrumbs("subject", $("h2").first(), subject);
				$.get("/content/" + subject.sname + "/Notation.html").done(function(notation) {
					$("#subject_page").append(notation);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				});
			});
			functions.handle_logo_link("subject");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("subject", navs, subject);
			functions.handle_desktop_title("subject", subject);
		});

		router.addRouteListener("subject.topic", function(toState, fromState) {
			if(functions.is_mobile()) {
				$(".button-collapse").sideNav("hide");
			}
			var subject = subjects.filter(function(iter) {
				return iter.sname == toState.params.sname;
			})[0],
				topic = subject.topics.filter(function(iter) {
				return iter.tname == toState.params.tname;
			})[0];
			navs.driver("topic", topic, subject);
			$("main").empty();
			$("title").text(subject.clean_name + " - " + topic.clean_name);
			$("main").append($("<div>").attr("id", "topic_page"));
			$.get("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html").done(function(content) {
				$("#topic_page").append(content);
				functions.handle_breadcrumbs("topic", $("h2").first(), subject, topic);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				if(functions.is_mobile()) {
					MathJax.Hub.Queue(function() {
						functions.mobile_breadcrumbs("topic"); 
						functions.hide_mathjax_span();
					});
				}
			});
			functions.handle_logo_link("subject.topic");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("topic", navs, topic, subject);
			functions.handle_desktop_title("topic", subject, topic);
		});

		router.addRouteListener("subject.topic.section.current_page", function(toState, fromState) {
			if(functions.width_func() < 992) {
				$(".button-collapse").sideNav("hide");
			}
			var subject = subjects.filter(function(iter) {
				return iter.sname == toState.params.sname;
			})[0],
				topic = subject.topics.filter(function(iter) {
				return iter.tname == toState.params.tname;
			})[0],
				section = topic.sections.filter(function(iter) {
				return iter.section_name == toState.params.section_name;
			})[0];
			$("main").empty();
			navs.driver("section", section, topic);
			$("#nav-mobile").find("li").removeClass("active");
			$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
			$("main").append($("<div>").attr("id", "latex"));
			if(section.section_name == toState.params.current_page_name) {
				$("#section_name" + section.section_id).addClass("active");
				$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html").done(function(content) {
					$("#latex").append(content);
					functions.handle_breadcrumbs("section", $(".latex_section").first(), subject, topic, section);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					functions.handle_button("notes");
					if(functions.is_mobile() && section.section_name == "Common_Derivatives_and_Properties") {
						MathJax.Hub.Queue(function() {
							functions.hide_mathjax_span();
						});
					}
				});
			}
			else {
				var example = section.examples.filter(function(iter) {
					return iter.ename == toState.params.current_page_name;
				})[0];
				$("#examples_li" + example.eid).addClass("active");
				$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + example.ename + ".html").done(function(content) {
					$("#latex").append(content);
					functions.handle_breadcrumbs("example", $(".latex_section").first(), subject, topic, section, example);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					functions.handle_button("example");
				});
			}
			functions.handle_logo_link("subject.topic.section.current_page");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("section", navs, section, topic);
			functions.handle_desktop_title("section", subject, topic, section);
		});
	};

	return exports;
});