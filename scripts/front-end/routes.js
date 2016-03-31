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
	exports.add_listeners = (router, subjects, topics, sections, examples) => {
		router.addRouteListener("def", (toState, fromState) => {
			navs.driver("about", subjects);
			$("#desktop_title").text("About");
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/dist/about-min.html").done(content => {
				$("#about_page").append(content);
				$.get("/client/dist/notation-min.html").done(notation => {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				});
			});
			functions.handle_logo_link("about");
			functions.handle_logo();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("about", navs, subjects);
			functions.handle_breadcrumbs("about");
		});

		router.addRouteListener("about", (toState, fromState) => {
			navs.driver("about", subjects);
			$("#desktop_title").text("About");
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/dist/about-min.html").done(content => {
				$("#about_page").append(content);
				$.get("/client/dist/notation-min.html").done(notation => {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				});
			});
			functions.handle_logo_link("about");
			functions.handle_logo();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_orientation("about", navs, subjects);
			functions.handle_breadcrumbs("about");
		});

		router.addRouteListener("subject", (toState, fromState) => {
			var subject = subjects.filter(iter => {
				return iter.sname == toState.params.sname;
			})[0];
			navs.driver("subject", subject);
			$("main").empty();
			$("#desktop_title").text(subject.clean_name);
			$("title").text(subject.clean_name);
			$("main").append($("<div>").attr("id", "subject_page"));
			$.get("/content/" + subject.sname + "/" + subject.sname + ".html").done(content => {
				$("#subject_page").append(content)
				$.get("/content/" + subject.sname + "/Notation.html").done(notation => {
					$("#subject_page").append(notation);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				});
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_scroll();
			functions.handle_orientation("subject", navs, subject);
			functions.handle_breadcrumbs("subject", subject);
		});

		router.addRouteListener("subject.topic", (toState, fromState) => {
			var subject = subjects.filter(iter => {
				return iter.sname == toState.params.sname;
			})[0],
				topic = subject.topics.filter(iter => {
				return iter.tname == toState.params.tname;
			})[0];
			navs.driver("topic", topic, subject);
			$("main").empty();
			$("#desktop_title").text(subject.clean_name + " - " + topic.clean_name);
			$("title").text(subject.clean_name + " - " + topic.clean_name);
			$("main").append($("<div>").attr("id", "topic_page"));
			$.get("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html").done(content => {
				$("#topic_page").append(content);
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject.topic");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_scroll();
			functions.handle_orientation("topic", navs, topic, subject);
			functions.handle_breadcrumbs("topic", subject, topic);
		});

		router.addRouteListener("subject.topic.section.current_page", (toState, fromState) => {
			if(functions.width_func() < 992) {
				$(".button-collapse").sideNav("hide");
			}
			var subject = subjects.filter(iter => {
				return iter.sname == toState.params.sname;
			})[0],
				topic = subject.topics.filter(iter => {
				return iter.tname == toState.params.tname;
			})[0],
				section = topic.sections.filter(iter => {
				return iter.section_name == toState.params.section_name;
			})[0];
			$("main").empty();
			navs.driver("section", section, topic);
			$("#nav-mobile").find("li").removeClass("active");
			$("#desktop_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
			$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
			$("main").append($("<div>").attr("id", "latex"));
			if(section.section_name == toState.params.current_page_name) {
				$("#section_name" + section.section_id).addClass("active");
				$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + section.section_name + ".html").done(content => {
					$("#latex").append(content);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
					functions.handle_button("notes");
				});
			}
			else {
				var example = section.examples.filter(iter => {
					return iter.ename == toState.params.current_page_name;
				})[0];
				$("#examples_li" + example.eid).addClass("active");
				$.get("/content/" + subject.sname + "/" + topic.tname + "/" + section.section_name + "/" + example.ename + ".html").done(content => {
					$("#latex").append(content);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
					functions.handle_button("examples");
				});
			}
			functions.handle_logo_link("subject.topic.section.current_page");
			functions.handle_logo();
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			functions.handle_scroll();
			functions.handle_orientation("section", navs, section, topic);
			functions.handle_breadcrumbs("section", subject, topic, section);
		});
	};

	return exports;
});