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
		router.addRouteListener("login", function(toState, fromState) {
			functions.resize_modal(function() {
				if(functions.width_func() > 992) {
					$(window).off();
				}
				else { functions.resize_modal(); }
				var cookie = functions.read_cookie("contributor");
				$("title").text("Content Management System: Login");
				if(cookie == "") {
					$.get("/pages/dist/login-min.html").done(function(content) {
						$(document.body).empty().append(content).css("background", "#1163A9");
						$("select").material_select();
						links.handle_links(router, subjects, topics, sections, examples);
						$.post("/api/cms/admin/info").done(function(obj) {
							$("#admin_name").text("Name: " + obj.first_name + " " + obj.last_name);
							$("#admin_email").text("Email: " + obj.email);
						});
					});
				}
				else {
					$.post("/api/cms/live/check/", {email: cookie}).done(function(result) {
						if(result == "") {
							$.post("/api/cms/live/add/", {email: cookie}).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else {
									console.log("There was an issue adding the" + 
										" contributor to the list of live sessions!");
								}
							});
						}
						functions.session_modal(router, "cms", 2);
					});
				}
			});
		});

		router.addRouteListener("cms", function(toState, fromState) {
			var cookie = functions.read_cookie("contributor");
			functions.initial_cms(router, function() {
				navs.driver("about", 1, subjects, undefined, function() {
					functions.latex_cms("about", cookie, router, links, subjects, topics,
						sections, examples);
				});
			});
		});

		router.addRouteListener("def", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				navs.driver("about", 0, subjects, undefined, function() {
					functions.latex("about", router, links, subjects, topics,
						sections, examples);
				});
			});
		});

		router.addRouteListener("about", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				navs.driver("about", 0, subjects, undefined, function() {
					functions.latex("about", router, links, subjects, topics,
						sections, examples);
				});
			});
		});

		router.addRouteListener("subjectEdit", function(toState, fromState) {
			var cookie = functions.read_cookie("contributor");
			functions.initial_cms(router, function() {
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0];
				navs.driver("subject", 1, subject, undefined, function() {
					functions.latex_cms("subject", cookie, router, links, subjects, topics,
						sections, examples, subject);
				});
			});
		});

		router.addRouteListener("subject", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0];
				navs.driver("subject", 0, subject, undefined, function() {
					functions.latex("subject", router, links, subjects, topics,
						sections, examples, subject);
				});
			});
		});

		router.addRouteListener("subjectEdit.topicEdit", function(toState, fromState) {
			var cookie = functions.read_cookie("contributor");
			functions.initial_cms(router, function() {
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0],
					topic = subject.topics.filter(function(iter) {
					return iter.tname == toState.params.tname;
				})[0];

				navs.driver("topic", 1, topic, subject, function() {
					functions.latex_cms("topic", cookie, router, links, subjects, topics,
						sections, examples, subject, topic);
				});
			});
		});

		router.addRouteListener("subject.topic", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0],
					topic = subject.topics.filter(function(iter) {
					return iter.tname == toState.params.tname;
				})[0];
				navs.driver("topic", 0, topic, subject, function() {
					functions.latex("topic", router, links, subjects, topics,
						sections, examples, subject, topic);
				});
			});
		});

		router.addRouteListener("subjectEdit.topicEdit.sectionEdit.current_pageEdit", function(toState, fromState) {
			var cookie = functions.read_cookie("contributor");
			functions.initial_cms(router, function() {
				var subject = subjects.filter(function(iter) {
						return iter.sname == toState.params.sname;
					})[0],
					topic = subject.topics.filter(function(iter) {
						return iter.tname == toState.params.tname;
					})[0],
					section = topic.sections.filter(function(iter) {
						return iter.section_name == toState.params.section_name;
					})[0];
				navs.driver("section", 1, section, topic, function() {
					$("#nav-mobile").find("li").removeClass("active");
					if(section.section_name == toState.params.current_page_name) {
						$("#section_name" + section.section_id + "_cms").addClass("active");
						functions.latex_cms("section", cookie, router, links, subjects, 
							topics, sections, examples, subject, topic, section);
					}
					else {
						var example = section.examples.filter(function(iter) {
							return iter.ename == toState.params.current_page_name;
						})[0];
						$("#examples_li" + example.eid + "_cms").addClass("active");
						functions.latex_cms("example", cookie, router, links, subjects, 
							topics, sections, examples, subject, topic, section, example);
					}
				});
			});
		});

		router.addRouteListener("subject.topic.section.current_page", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0],
					topic = subject.topics.filter(function(iter) {
					return iter.tname == toState.params.tname;
				})[0],
					section = topic.sections.filter(function(iter) {
					return iter.section_name == toState.params.section_name;
				})[0];
				navs.driver("section", 0, section, topic, function() {
					$("#nav-mobile").find("li").removeClass("active");
					if(section.section_name == toState.params.current_page_name) {
						$("#section_name" + section.section_id).addClass("active");
						functions.latex("section", router, links, subjects, topics, 
							sections, examples, subject, topic, section);
					}
					else {
						var example = section.examples.filter(function(iter) {
							return iter.ename == toState.params.current_page_name;
						})[0];
						$("#examples_li" + example.eid).addClass("active");
						functions.latex("example", router, links, subjects, topics, 
							sections, examples, subject, topic, section, example);
					}
				});
			});
		});
	};

	return exports;
});