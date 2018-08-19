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
		router.addRouteListener("cms", function(toState, fromState) {
			functions.resize_modal(function() {
				$("title").text("Content Management System");
				$(window).on("resize", function() {
					if(functions.read_cookie("contributor") == "" && functions.width_func() >= 992) {
						functions.session_modal(router, "login", 0);
					}
				});
				if(functions.read_cookie("contributor") == "") {
					functions.session_modal(router, "login", 0);
				}
				else {
					var cookie = functions.read_cookie("contributor");
					$.post("/api/cms/live/check/" + cookie).done(function(result) {
						if(result == "") {
							$.post("/api/cms/add/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
							});
						}
					});
					functions.listen_cookie_change("contributor", function() {
						if(functions.read_cookie("contributor") == "") {
							$.post("/api/cms/remove/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.session_modal(router, "login", 1);
								}
								else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
							});
						}
					});
					$(window).on("unload", function() {
						$.ajax({
						    type: "POST",
						    async: false,
						    url: "/api/cms/remove/live/" + cookie
						});
					});
					$.get("/pages/dist/main-min.html").done(function(content) {
						$(document.body).empty().append(content);
						$("#logo").attr("id", "logo_cms");
						if(functions.width_func() < 992) {
							$(".button-collapse").sideNav("hide");
						}
						navs.driver("about", 1, subjects, undefined, function() {
							$("body").css("background", "#e0e0e0");
							$("main").empty();
							$("main").append($("<div>").attr("id", "latex"));
							$.get("/pages/dist/edit-bar-min.html").done(function(bar) {
								$("#latex").append(bar);
								$.get("/pages/dist/about-min.html").done(function(about) {
									$("#latex").append(about);
									$.get("/pages/dist/notation-min.html").done(function(notation) {
										$("#notation_box").append(notation);
										$.get("/pages/dist/button-min.html").done(function(button) {
											$("body").append(button);
											functions.committee(cookie, function() {
												MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
												functions.handle_button();
												functions.handle_logo_link("about");
												functions.handle_logo();
												links.handle_links(router, subjects, topics, sections, examples);
												functions.handle_orientation("about", navs, subjects);
												functions.handle_desktop_title("about");
												$("#bar-nav").css("width", "100%");
												$("#bar").css("width", "82%");
												$("#live-version").parent("li").css("margin-left", "25px");
												$("#save").parent("li").css("margin-right", "25px");
												$("#main_message").css("margin-top", "100px");
												$("#subjects_change").click(function(e) {
													e.preventDefault();
													functions.sidenav_modal("Subjects", subjects);
												});
											});
										});
									});
								});
							});
						});
					});
				}
			});
		});

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
						$.post("/api/cms/get/admin").done(function(obj) {
							$("#admin_name").text("Name: " + obj.first_name + " " + obj.last_name);
							$("#admin_email").text("Email: " + obj.email);
						});
					});
				}
				else {
					$.post("/api/cms/live/check/" + cookie).done(function(result) {
						if(result == "") {
							$.post("/api/cms/add/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
							});
						}
						functions.session_modal(router, "cms", 2);
					});
				}
			});
		});

		router.addRouteListener("def", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				navs.driver("about", 0, subjects, undefined, function() {
					$("title").text("About");
					$("body").css("background", "#e0e0e0");
					$("main").empty();
					$("main").append($("<div>").attr("id", "latex"));
					$.get("/pages/dist/about-min.html").done(function(content) {
						$("#latex").append(content);
						$.get("/pages/dist/notation-min.html").done(function(notation) {
							$("#notation_box").append(notation);
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							functions.handle_button();
							functions.handle_logo_link("about");
							functions.handle_logo();
							links.handle_links(router, subjects, topics, sections, examples);
							functions.handle_orientation("about", navs, subjects);
							functions.handle_desktop_title("about");
						});
					});
				});
			});
		});

		router.addRouteListener("about", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				if(functions.width_func() < 992) {
					$(".button-collapse").sideNav("hide");
				}
				navs.driver("about", 0, subjects, undefined, function() {
					$("title").text("About");
					$("body").css("background", "#e0e0e0");
					$("main").empty();
					$("main").append($("<div>").attr("id", "latex"));
					$.get("/pages/dist/about-min.html").done(function(content) {
						$("#latex").append(content);
						$.get("/pages/dist/notation-min.html").done(function(notation) {
							$("#notation_box").append(notation);
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							functions.handle_button();
							functions.handle_logo_link("about");
							functions.handle_logo();
							links.handle_links(router, subjects, topics, sections, examples);
							functions.handle_orientation("about", navs, subjects);
							functions.handle_desktop_title("about");
						});
					});
				});
			});
		});

		router.addRouteListener("subjectEdit", function(toState, fromState) {
			functions.resize_modal(function() {
				$("title").text("Content Management System");
				if(functions.read_cookie("contributor") == "") {
					functions.session_modal(router, "login", 0);
				}
				else {
					var cookie = functions.read_cookie("contributor");
					$.post("/api/cms/live/check/" + cookie).done(function(result) {
						if(result == "") {
							$.post("/api/cms/add/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
							});
						}
					});
					functions.listen_cookie_change("contributor", function() {
						if(functions.read_cookie("contributor") == "") {
							$.post("/api/cms/remove/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.session_modal(router, "login", 1);
								}
								else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
							});
						}
					});
					$(window).on("unload", function() {
						$.ajax({
						    type: "POST",
						    async: false,
						    url: "/api/cms/remove/live/" + cookie
						});
					});
					$.get("/pages/dist/main-min.html").done(function(content) {
						$(document.body).empty().append(content);
						$("#logo").attr("id", "logo_cms");
						if(functions.is_mobile()) {
							$(".button-collapse").sideNav("hide");
						}
						var subject = subjects.filter(function(iter) {
							return iter.sname == toState.params.sname;
						})[0];
						navs.driver("subject", 1, subject, undefined, function() {
							$("main").empty();
							$("title").text(subject.clean_name);
							$("body").css("background", "#e0e0e0");
							$("main").append($("<div>").attr("id", "latex"));
							functions.latex_cms("subject", cookie, router, links, subjects, topics, sections, examples, subject);

							// $("#top_content").append($("<ul>").addClass("right")
							// 	.append($("<li>").append("<a>").attr("id", )))
							// $.get("/pages/dist/edit-bar-min.html").done(function(bar) {
							// 	$("#latex").append(bar);
							// 	$.get("/api/subject/data/" + subject.sid).done(function(content) {
							// 		var accordion1 = $("<div>").addClass("accordion"),
							// 			show_solution1 = $("<div>").addClass("show_solution").text("About"),
							// 			span1 = $("<span>").addClass("solution_display")
							// 				.append($("<i>").addClass("material-icons").text("remove")),
							// 			cont_div1 = $("<div>").addClass("cont_div"),
							// 			latex_body1 = $("<div>").addClass("latex_body"),
							// 			accordion2 = $("<div>").addClass("accordion"),
							// 			show_solution2 = $("<div>").addClass("show_solution").text("Notation"),
							// 			span2 = $("<span>").addClass("solution_display")
							// 				.append($("<i>").addClass("material-icons").text("add")),
							// 			cont_div2 = $("<div>").addClass("cont_div hidden_div"),
							// 			latex_body2 = $("<div>").addClass("latex_body");
							// 		if(content.about == null || content.about == "") { 
							// 			show_solution1.text("NO CONTENT HERE!"); span1.text(""); 
							// 		}
							// 		if(content.notation == null || content.notation == "") { 
							// 			show_solution2.text("NO NOTATION HERE!"); span2.text(""); 
							// 		}
							// 		latex_body1.append(content.about);
							// 		cont_div1.append(latex_body1);
							// 		show_solution1.append(span1);
							// 		accordion1.append(show_solution1);
							// 		accordion1.append(cont_div1);
							// 		latex_body2.append(content.notation);
							// 		cont_div2.append(latex_body2);
							// 		show_solution2.append(span2);
							// 		accordion2.append(show_solution2);
							// 		accordion2.append(cont_div2);
							// 		$("#latex").append(accordion1);
							// 		$("#latex").append(accordion2);
							// 		functions.handle_breadcrumbs("subject", $(".accordion").first(), subject);
							// 		$.get("/pages/dist/button-min.html").done(function(button) {
							// 			$("body").append(button);
							// 			functions.committee(cookie, function() {
							// 				MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							// 				functions.handle_button();
							// 				functions.handle_logo_link("subject");
							// 				functions.handle_logo();
							// 				functions.handle_li_coloring();
							// 				links.handle_links(router, subjects, topics, sections, examples);
							// 				functions.handle_orientation("subject", navs, subject);
							// 				functions.handle_desktop_title("subject", subject);
							// 				$("#bar-nav").css("width", "100%");
							// 				$("#bar").css("width", "82%");
							// 				$("#live-version").parent("li").css("margin-left", "25px");
							// 				$("#save").parent("li").css("margin-right", "25px");
							// 				$("#topics_change").click(function(e) {
							// 					e.preventDefault();
							// 					functions.sidenav_modal("Topics", topics, subject.sid);
							// 				});
							// 			});
							// 		});
							// 	});
							// });
						});
					});
				}
			});
		});

		router.addRouteListener("subject", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				if(functions.is_mobile()) {
					$(".button-collapse").sideNav("hide");
				}
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0];
				navs.driver("subject", 0, subject, undefined, function() {
					$("main").empty();
					$("title").text(subject.clean_name);
					$("body").css("background", "#e0e0e0");
					$("main").append($("<div>").attr("id", "latex"));
					functions.latex("subject", router, links, subjects, topics, sections, examples, subject);
					// $.get("/api/subject/data/" + subject.sid).done(function(content) {
					// 	var accordion1 = $("<div>").addClass("accordion"),
					// 		show_solution1 = $("<div>").addClass("show_solution").text("About"),
					// 		span1 = $("<span>").addClass("solution_display")
					// 			.append($("<i>").addClass("material-icons").text("remove")),
					// 		cont_div1 = $("<div>").addClass("cont_div"),
					// 		latex_body1 = $("<div>").addClass("latex_body"),
					// 		accordion2 = $("<div>").addClass("accordion"),
					// 		show_solution2 = $("<div>").addClass("show_solution").text("Notation"),
					// 		span2 = $("<span>").addClass("solution_display")
					// 			.append($("<i>").addClass("material-icons").text("add")),
					// 		cont_div2 = $("<div>").addClass("cont_div hidden_div"),
					// 		latex_body2 = $("<div>").addClass("latex_body");
					// 	if(content.about == null || content.about == "") { show_solution1.text("NO CONTENT HERE!"); span1.text(""); }
					// 	if(content.notation == null || content.notation == "") { show_solution2.text("NO NOTATION HERE!"); span2.text(""); }
					// 	latex_body1.append(content.about);
					// 	cont_div1.append(latex_body1);
					// 	show_solution1.append(span1);
					// 	accordion1.append(show_solution1);
					// 	accordion1.append(cont_div1);
					// 	latex_body2.append(content.notation);
					// 	cont_div2.append(latex_body2);
					// 	show_solution2.append(span2);
					// 	accordion2.append(show_solution2);
					// 	accordion2.append(cont_div2);
					// 	$("#latex").append(accordion1);
					// 	$("#latex").append(accordion2);
					// 	functions.handle_breadcrumbs("subject", $(".accordion").first(), subject);
					// 	MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					// 	functions.handle_button();
					// 	functions.handle_logo_link("subject");
					// 	functions.handle_logo();
					// 	functions.handle_li_coloring();
					// 	links.handle_links(router, subjects, topics, sections, examples);
					// 	functions.handle_orientation("subject", navs, subject);
					// 	functions.handle_desktop_title("subject", subject);
					// });
				});
			});
		});

		router.addRouteListener("subjectEdit.topicEdit", function(toState, fromState) {
			functions.resize_modal(function() {
				$("title").text("Content Management System");
				if(functions.read_cookie("contributor") == "") {
					functions.session_modal(router, "login", 0);
				}
				else {
					var cookie = functions.read_cookie("contributor");
					$.post("/api/cms/live/check/" + cookie).done(function(result) {
						if(result == "") {
							$.post("/api/cms/add/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
							});
						}
					});
					functions.listen_cookie_change("contributor", function() {
						if(functions.read_cookie("contributor") == "") {
							$.post("/api/cms/remove/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.session_modal(router, "login", 1);
								}
								else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
							});
						}
					});
					$(window).on("unload", function() {
						$.ajax({
						    type: "POST",
						    async: false,
						    url: "/api/cms/remove/live/" + cookie
						});
					});
					$.get("/pages/dist/main-min.html").done(function(content) {
						$(document.body).empty().append(content);
						$("#logo").attr("id", "logo_cms");
						if(functions.is_mobile()) {
							$(".button-collapse").sideNav("hide");
						}
						var subject = subjects.filter(function(iter) {
							return iter.sname == toState.params.sname;
						})[0],
							topic = subject.topics.filter(function(iter) {
							return iter.tname == toState.params.tname;
						})[0];
						navs.driver("topic", 1, topic, subject, function() {
							$("main").empty();
							$("title").text(subject.clean_name + " - " + topic.clean_name);
							$("body").css("background", "#e0e0e0");
							$("main").append($("<div>").attr("id", "latex"));
							functions.latex_cms("topic", cookie, router, links, subjects, topics, sections, examples, subject, topic);
							// $.get("/pages/dist/edit-bar-min.html").done(function(bar) {
							// 	$("#latex").append(bar);
							// 	$.get("/api/topic/data/" + topic.tid).done(function(content) {
							// 		var accordion = $("<div>").addClass("accordion"),
							// 			show_solution = $("<div>").addClass("show_solution").text("About"),
							// 			span = $("<span>").addClass("solution_display")
							// 				.append($("<i>").addClass("material-icons").text("remove")),
							// 			cont_div = $("<div>").addClass("cont_div"),
							// 			latex_body = $("<div>").addClass("latex_body");
							// 		if(content == null || content == "") { show_solution.text("NO CONTENT HERE!"); span.text(""); }
							// 		latex_body.append(content);
							// 		cont_div.append(latex_body);
							// 		show_solution.append(span);
							// 		accordion.append(show_solution);
							// 		accordion.append(cont_div);
							// 		$("#latex").append(accordion);
							// 		functions.handle_breadcrumbs("topic", $(".accordion").first(), subject, topic);
							// 		$.get("/pages/dist/button-min.html").done(function(button) {
							// 			$("body").append(button);
							// 			functions.committee(cookie, function() {
							// 				MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							// 				functions.handle_button();
							// 				functions.handle_logo_link("subject.topic");
							// 				functions.handle_logo();
							// 				functions.handle_li_coloring();
							// 				links.handle_links(router, subjects, topics, sections, examples);
							// 				functions.handle_orientation("topic", navs, topic, subject);
							// 				functions.handle_desktop_title("topic", subject, topic);
							// 				$("#bar-nav").css("width", "100%");
							// 				$("#bar").css("width", "82%");
							// 				$("#live-version").parent("li").css("margin-left", "25px");
							// 				$("#save").parent("li").css("margin-right", "25px");
							// 				$("#sections_change").click(function(e) {
							// 					e.preventDefault();
							// 					functions.sidenav_modal("Sections", sections, topic.tid);
							// 				});
							// 			});
							// 		});
							// 	});
							// });
						});
					});
				}
			});
		});

		router.addRouteListener("subject.topic", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
				if(functions.is_mobile()) {
					$(".button-collapse").sideNav("hide");
				}
				var subject = subjects.filter(function(iter) {
					return iter.sname == toState.params.sname;
				})[0],
					topic = subject.topics.filter(function(iter) {
					return iter.tname == toState.params.tname;
				})[0];
				navs.driver("topic", 0, topic, subject, function() {
					$("main").empty();
					$("title").text(subject.clean_name + " - " + topic.clean_name);
					$("body").css("background", "#e0e0e0");
					$("main").append($("<div>").attr("id", "latex"));
					functions.latex("topic", router, links, subjects, topics, sections, examples, subject, topic);
					// $.get("/api/topic/data/" + topic.tid).done(function(content) {
					// 	var accordion = $("<div>").addClass("accordion"),
					// 		show_solution = $("<div>").addClass("show_solution").text("About"),
					// 		span = $("<span>").addClass("solution_display")
					// 			.append($("<i>").addClass("material-icons").text("remove")),
					// 		cont_div = $("<div>").addClass("cont_div"),
					// 		latex_body = $("<div>").addClass("latex_body");
					// 	if(content == null || content == "") { show_solution.text("NO CONTENT HERE!"); span.text(""); }
					// 	latex_body.append(content);
					// 	cont_div.append(latex_body);
					// 	show_solution.append(span);
					// 	accordion.append(show_solution);
					// 	accordion.append(cont_div);
					// 	$("#latex").append(accordion);
					// 	functions.handle_breadcrumbs("topic", $(".accordion").first(), subject, topic);
					// 	MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					// 	functions.handle_button();
					// 	functions.handle_logo_link("subject.topic");
					// 	functions.handle_logo();
					// 	functions.handle_li_coloring();
					// 	links.handle_links(router, subjects, topics, sections, examples);
					// 	functions.handle_orientation("topic", navs, topic, subject);
					// 	functions.handle_desktop_title("topic", subject, topic);
					// });
				});
			});
		});

		router.addRouteListener("subjectEdit.topicEdit.sectionEdit.current_pageEdit", function(toState, fromState) {
			functions.resize_modal(function() {
				$("title").text("Content Management System");
				if(functions.read_cookie("contributor") == "") {
					functions.session_modal(router, "login", 0);
				}
				else {
					var cookie = functions.read_cookie("contributor");
					$.post("/api/cms/live/check/" + cookie).done(function(result) {
						if(result == "") {
							$.post("/api/cms/add/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.write_cookie("contributor", cookie, 60);
								}
								else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
							});
						}
					});
					functions.listen_cookie_change("contributor", function() {
						if(functions.read_cookie("contributor") == "") {
							$.post("/api/cms/remove/live/" + cookie).done(function(result) {
								if(result == 1) {
									functions.session_modal(router, "login", 1);
								}
								else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
							});
						}
					});
					$(window).on("unload", function() {
						$.ajax({
						    type: "POST",
						    async: false,
						    url: "/api/cms/remove/live/" + cookie
						});
					});
					$.get("/pages/dist/main-min.html").done(function(content) {
						$(document.body).empty().append(content);
						$("#logo").attr("id", "logo_cms");
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
						navs.driver("section", 1, section, topic, function() {
							$("#nav-mobile").find("li").removeClass("active");
							$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
							$("body").css("background", "#e0e0e0");
							$("main").append($("<div>").attr("id", "latex"));
							if(section.section_name == toState.params.current_page_name) {
								$("#section_name" + section.section_id + "_cms").addClass("active");
								functions.latex_cms("section", cookie, router, links, subjects, topics, sections, examples, subject, topic, section);
							}
							else {
								var example = section.examples.filter(function(iter) {
									return iter.ename == toState.params.current_page_name;
								})[0];
								$("#examples_li" + example.eid + "_cms").addClass("active");
								functions.latex_cms("example", cookie, router, links, subjects, topics, sections, examples, subject, topic, section, example);
							}


						});
					});
				}
			});
		});

		router.addRouteListener("subject.topic.section.current_page", function(toState, fromState) {
			$.get("/pages/dist/main-min.html").done(function(content) {
				$(document.body).empty().append(content);
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
				navs.driver("section", 0, section, topic, function() {
					$("#nav-mobile").find("li").removeClass("active");
					$("title").text(subject.clean_name + " - " + topic.clean_name + " - " + section.clean_name);
					$("body").css("background", "#e0e0e0");
					$("main").append($("<div>").attr("id", "latex"));
					if(section.section_name == toState.params.current_page_name) {
						$("#section_name" + section.section_id + "_cms").addClass("active");
						functions.latex("section", router, links, subjects, topics, sections, examples, subject, topic, section);
					}
					else {
						var example = section.examples.filter(function(iter) {
							return iter.ename == toState.params.current_page_name;
						})[0];
						$("#examples_li" + example.eid + "_cms").addClass("active");
						functions.latex("example", router, links, subjects, topics, sections, examples, subject, topic, section, example);
					}
					// if(section.section_name == toState.params.current_page_name) {
					// 	$("#section_name" + section.section_id).addClass("active");
					// 	$.get("/api/section/data/" + section.section_id).done(function(content) {
					// 		var i = 0;
					// 		for(; i >= 0; i++) {
					// 			if(content.title[i] == null || content.title[i] == "") { break; }
					// 			var cont_div = "",
					// 				title = content.title[i].split("_")[0],
					// 				accordion = $("<div>").addClass("accordion"),
					// 				show_solution = $("<div>").addClass("show_solution").text(title),
					// 				span = $("<span>").addClass("solution_display"),
					// 				latex_body = $("<div>").addClass("latex_body");
					// 			if(content.title[i].split("_").length == 1) {
					// 				cont_div = $("<div>").addClass("cont_div");
					// 				span.append($("<i>").addClass("material-icons").text("remove"));
					// 			}
					// 			else {
					// 				cont_div = $("<div>").addClass("cont_div hidden_div");
					// 				span.append($("<i>").addClass("material-icons").text("add"));
					// 			}	
					// 			latex_body.append(content.content[i]);
					// 			cont_div.append(latex_body);
					// 			show_solution.append(span);
					// 			accordion.append(show_solution);
					// 			accordion.append(cont_div);
					// 			$("#latex").append(accordion);
					// 		}
					// 		if(i == 0) {
					// 			$("#latex").append($("<div>").addClass("accordion").append($("<div>")
					// 				.addClass("show_solution").text("NO CONTENT HERE!")));
					// 		}
					// 		functions.handle_breadcrumbs("section", $(".accordion").first(), subject, topic, section);
					// 		MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					// 		functions.handle_button();
					// 		// if(functions.is_mobile() && section.section_name == "Common_Derivatives_and_Properties") {
					// 		// 	MathJax.Hub.Queue(function() {
					// 		// 		functions.hide_mathjax_span();
					// 		// 	});
					// 		// }
					// 	});
					// }
					// else {
					// 	var example = section.examples.filter(function(iter) {
					// 		return iter.ename == toState.params.current_page_name;
					// 	})[0];
					// 	$("#examples_li" + example.eid).addClass("active");
					// 	$.get("/api/example/data/" + example.eid).done(function(content) {
					// 		var accordion1 = $("<div>").addClass("accordion"),
					// 			show_solution1 = $("<div>").addClass("show_solution").text("Problem"),
					// 			problem_span = $("<span>").addClass("solution_display").attr("id", "problem_span")
					// 				.append($("<i>").addClass("material-icons").text("remove")),
					// 			cont_div1 = $("<div>").addClass("cont_div"),
					// 			latex_body1 = $("<div>").addClass("latex_body"),
					// 			accordion2 = $("<div>").addClass("accordion"),
					// 			show_solution2 = $("<div>").addClass("show_solution").text("Solution"),
					// 			solution_span = $("<span>").addClass("solution_display").attr("id", "solution_span")
					// 				.append($("<i>").addClass("material-icons").text("add")),
					// 			cont_div2 = $("<div>").addClass("cont_div hidden_div"),
					// 			latex_body2 = $("<div>").addClass("latex_body");
					// 		if(content.problem == null || content.problem == "") { show_solution1.text("NO PROBLEM HERE!"); problem_span.text(""); }
					// 		if(content.solution == null || content.solution == "") { show_solution2.text("NO SOLUTION HERE!"); solution_span.text(""); }
					// 		latex_body1.append(content.problem);
					// 		cont_div1.append(latex_body1);
					// 		show_solution1.append(problem_span);
					// 		accordion1.append(show_solution1);
					// 		accordion1.append(cont_div1);
					// 		latex_body2.append(content.solution);
					// 		cont_div2.append(latex_body2);
					// 		show_solution2.append(solution_span);
					// 		accordion2.append(show_solution2);
					// 		accordion2.append(cont_div2);
					// 		$("#latex").append(accordion1).append(accordion2);
					// 		functions.handle_breadcrumbs("example", $(".accordion").first(), subject, topic, section, example);
					// 		MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
					// 		functions.handle_button();
					// 	});
					// }
					// functions.handle_logo_link("subject.topic.section.current_page");
					// functions.handle_logo();
					// functions.handle_li_coloring();
					// links.handle_links(router, subjects, topics, sections, examples);
					// functions.handle_orientation("section", navs, section, topic);
					// functions.handle_desktop_title("section", subject, topic, section);
				});
			});
		});
	};

	return exports;
});