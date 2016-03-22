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
		router.addRouteListener("about", (toState, fromState) => {
			navs.subject_side_nav(subjects);
			$(".page_title").text("About");
			$("title").text("About");
			$("main").empty();
			$("main").append($("<div>").attr("id", "about_page"));
			$.get("/client/about.html").done(content => {
				$("#about_page").append(content);
				$.get("/client/notation.html").done(notation => {
					$("#notation_box").append(notation);
					MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
				});
			});
			functions.handle_logo_link("about");
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject", (toState, fromState) => {
			var subject = subjects.filter(iter => {
				return iter.sname == toState.params.sname;
			})[0];
			navs.topic_side_nav(subject);
			$("main").empty();
			$(".page_title").text(subject.clean_name);
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
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic", (toState, fromState) => {
			var subject = subjects.filter(iter => {
				return iter.sname == toState.params.sname;
			})[0],
				topic = subject.topics.filter(iter => {
				return iter.tname == toState.params.tname;
			})[0];
			navs.section_side_nav(topic, subject);
			$("main").empty();
			$(".page_title").text(subject.clean_name + " - " + topic.clean_name);
			$("title").text(subject.clean_name + " - " + topic.clean_name);
			$("main").append($("<div>").attr("id", "topic_page"));
			$.get("/content/" + subject.sname + "/" + topic.tname + "/" + topic.tname + ".html").done(content => {
				$("#topic_page").append(content);
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"]);
			});
			$("#about_li").addClass("active");
			functions.handle_logo_link("subject.topic");
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
		});

		router.addRouteListener("subject.topic.section.current_page", (toState, fromState) => {
			if(window.innerWidth < 992) {
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
			$(".side-nav li").each(function() {
				if(typeof $(this).attr("id") !== typeof undefined && $(this).attr("id") !== false) {
					if($(this).attr("id").split("_")[0] == "topic") {
						navs.example_side_nav(section, topic);
					}  
				}
			});
			if($(".side-nav").is(":empty")) {
				navs.example_side_nav(section, topic);
			}
			if($("#section_name" + section.section_id).hasClass("active")) {
				$("#section_name" + section.section_id).removeClass("active");
			}

			$("#nav-mobile").find("li").removeClass("active");
			$(".page_title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
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
			functions.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);





			$(document).keydown(event => {
				if(event.which == 37) {
					event.preventDefault();
					event.stopPropagation();
					// console.log(example);

					if(section.section_name != toState.params.current_page_name) {
						console.log(example);
						if(example.order == 1) {
							router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: section.section_name});
						}
						else {
							var next_example = section.examples.filter(iter => {
								return iter.order == example.order - 1;
							})[0];
							router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: next_example.ename});
						}
					}
				}
				// event.stopPropagation();
			});








			
		});
	};

	return exports;
});