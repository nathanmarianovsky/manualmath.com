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

							// $("#top_content").append($("<ul>").addClass("right")
							// 	.append($("<li>").append("<a>").attr("id", )))
							$.get("/pages/dist/edit-bar-min.html").done(function(bar) {
								$("#latex").append(bar);
								$.get("/api/subject/data/" + subject.sid).done(function(content) {
									var accordion1 = $("<div>").addClass("accordion"),
										show_solution1 = $("<div>").addClass("show_solution").text("About"),
										span1 = $("<span>").addClass("solution_display")
											.append($("<i>").addClass("material-icons").text("remove")),
										cont_div1 = $("<div>").addClass("cont_div"),
										latex_body1 = $("<div>").addClass("latex_body"),
										accordion2 = $("<div>").addClass("accordion"),
										show_solution2 = $("<div>").addClass("show_solution").text("Notation"),
										span2 = $("<span>").addClass("solution_display")
											.append($("<i>").addClass("material-icons").text("add")),
										cont_div2 = $("<div>").addClass("cont_div hidden_div"),
										latex_body2 = $("<div>").addClass("latex_body");
									if(content.about == null || content.about == "") { 
										show_solution1.text("NO CONTENT HERE!"); span1.text(""); 
									}
									if(content.notation == null || content.notation == "") { 
										show_solution2.text("NO NOTATION HERE!"); span2.text(""); 
									}
									latex_body1.append(content.about);
									cont_div1.append(latex_body1);
									show_solution1.append(span1);
									accordion1.append(show_solution1);
									accordion1.append(cont_div1);
									latex_body2.append(content.notation);
									cont_div2.append(latex_body2);
									show_solution2.append(span2);
									accordion2.append(show_solution2);
									accordion2.append(cont_div2);
									$("#latex").append(accordion1);
									$("#latex").append(accordion2);
									functions.handle_breadcrumbs("subject", $(".accordion").first(), subject);
									$.get("/pages/dist/button-min.html").done(function(button) {
										$("body").append(button);
										functions.committee(cookie, function() {
											MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
											functions.handle_button();
											functions.handle_logo_link("subject");
											functions.handle_logo();
											functions.handle_li_coloring();
											links.handle_links(router, subjects, topics, sections, examples);
											functions.handle_orientation("subject", navs, subject);
											functions.handle_desktop_title("subject", subject);
											$("#bar-nav").css("width", "100%");
											$("#bar").css("width", "82%");
											$("#live-version").parent("li").css("margin-left", "25px");
											$("#save").parent("li").css("margin-right", "25px");
											$("#topics_change").click(function(e) {
												e.preventDefault();
												functions.sidenav_modal("Topics", topics, subject.sid);
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
					$.get("/api/subject/data/" + subject.sid).done(function(content) {
						var accordion1 = $("<div>").addClass("accordion"),
							show_solution1 = $("<div>").addClass("show_solution").text("About"),
							span1 = $("<span>").addClass("solution_display")
								.append($("<i>").addClass("material-icons").text("remove")),
							cont_div1 = $("<div>").addClass("cont_div"),
							latex_body1 = $("<div>").addClass("latex_body"),
							accordion2 = $("<div>").addClass("accordion"),
							show_solution2 = $("<div>").addClass("show_solution").text("Notation"),
							span2 = $("<span>").addClass("solution_display")
								.append($("<i>").addClass("material-icons").text("add")),
							cont_div2 = $("<div>").addClass("cont_div hidden_div"),
							latex_body2 = $("<div>").addClass("latex_body");
						if(content.about == null || content.about == "") { show_solution1.text("NO CONTENT HERE!"); span1.text(""); }
						if(content.notation == null || content.notation == "") { show_solution2.text("NO NOTATION HERE!"); span2.text(""); }
						latex_body1.append(content.about);
						cont_div1.append(latex_body1);
						show_solution1.append(span1);
						accordion1.append(show_solution1);
						accordion1.append(cont_div1);
						latex_body2.append(content.notation);
						cont_div2.append(latex_body2);
						show_solution2.append(span2);
						accordion2.append(show_solution2);
						accordion2.append(cont_div2);
						$("#latex").append(accordion1);
						$("#latex").append(accordion2);
						functions.handle_breadcrumbs("subject", $(".accordion").first(), subject);
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
						functions.handle_button();
						functions.handle_logo_link("subject");
						functions.handle_logo();
						functions.handle_li_coloring();
						links.handle_links(router, subjects, topics, sections, examples);
						functions.handle_orientation("subject", navs, subject);
						functions.handle_desktop_title("subject", subject);
					});
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
							$.get("/pages/dist/edit-bar-min.html").done(function(bar) {
								$("#latex").append(bar);
								$.get("/api/topic/data/" + topic.tid).done(function(content) {
									var accordion = $("<div>").addClass("accordion"),
										show_solution = $("<div>").addClass("show_solution").text("About"),
										span = $("<span>").addClass("solution_display")
											.append($("<i>").addClass("material-icons").text("remove")),
										cont_div = $("<div>").addClass("cont_div"),
										latex_body = $("<div>").addClass("latex_body");
									if(content == null || content == "") { show_solution.text("NO CONTENT HERE!"); span.text(""); }
									latex_body.append(content);
									cont_div.append(latex_body);
									show_solution.append(span);
									accordion.append(show_solution);
									accordion.append(cont_div);
									$("#latex").append(accordion);
									functions.handle_breadcrumbs("topic", $(".accordion").first(), subject, topic);
									$.get("/pages/dist/button-min.html").done(function(button) {
										$("body").append(button);
										functions.committee(cookie, function() {
											MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
											functions.handle_button();
											functions.handle_logo_link("subject.topic");
											functions.handle_logo();
											functions.handle_li_coloring();
											links.handle_links(router, subjects, topics, sections, examples);
											functions.handle_orientation("topic", navs, topic, subject);
											functions.handle_desktop_title("topic", subject, topic);
											$("#bar-nav").css("width", "100%");
											$("#bar").css("width", "82%");
											$("#live-version").parent("li").css("margin-left", "25px");
											$("#save").parent("li").css("margin-right", "25px");
											$("#sections_change").click(function(e) {
												e.preventDefault();
												functions.sidenav_modal("Sections", sections, topic.tid);
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
					$.get("/api/topic/data/" + topic.tid).done(function(content) {
						var accordion = $("<div>").addClass("accordion"),
							show_solution = $("<div>").addClass("show_solution").text("About"),
							span = $("<span>").addClass("solution_display")
								.append($("<i>").addClass("material-icons").text("remove")),
							cont_div = $("<div>").addClass("cont_div"),
							latex_body = $("<div>").addClass("latex_body");
						if(content == null || content == "") { show_solution.text("NO CONTENT HERE!"); span.text(""); }
						latex_body.append(content);
						cont_div.append(latex_body);
						show_solution.append(span);
						accordion.append(show_solution);
						accordion.append(cont_div);
						$("#latex").append(accordion);
						functions.handle_breadcrumbs("topic", $(".accordion").first(), subject, topic);
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
						functions.handle_button();
						functions.handle_logo_link("subject.topic");
						functions.handle_logo();
						functions.handle_li_coloring();
						links.handle_links(router, subjects, topics, sections, examples);
						functions.handle_orientation("topic", navs, topic, subject);
						functions.handle_desktop_title("topic", subject, topic);
					});
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
							$.get("/pages/dist/edit-bar-min.html").done(function(bar) {
								$("#latex").append(bar);
								if(section.section_name == toState.params.current_page_name) {
									$("#section_name" + section.section_id + "_cms").addClass("active");
									$.get("/api/section/data/" + section.section_id).done(function(data) {
										var i = 0;
										for(; i >= 0; i++) {
											if(data.title_cms[i] == null || data.title_cms[i] == "") { break; }
											var cont_div = "",
												title = data.title_cms[i].split("_")[0],
												accordion = $("<div>").addClass("accordion"),
												show_solution = $("<div>").addClass("show_solution").text(title),
												span = $("<span>").addClass("solution_display"),
												latex_body = $("<div>").addClass("latex_body");
											if(data.title_cms[i].split("_hidden").length == 1) {
												cont_div = $("<div>").addClass("cont_div");
												span.append($("<i>").addClass("material-icons").text("remove"));
											}
											else {
												cont_div = $("<div>").addClass("cont_div hidden_div");
												span.append($("<i>").addClass("material-icons").text("add"));
											}	
											latex_body.append(data.content_cms[i]);
											cont_div.append(latex_body);
											show_solution.append(span);
											accordion.append(show_solution);
											accordion.append(cont_div);
											$("#latex").append(accordion);
										}
										if(i == 0) {
											$("#latex").append($("<div>").addClass("accordion").append($("<div>")
												.addClass("show_solution").text("NO CONTENT HERE!")));
										}
										functions.handle_breadcrumbs("section", $(".accordion").first(), subject, topic, section);
										MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
										functions.handle_button();
										if(data.cms_approval != null && 
											data.cms_approval.split(",").some(function(elem) { return elem == cookie; })) {
											$("#approve").css("color", "green");
										}
										else {
											$("#approve").css("color", "red");
										}

										$(".tooltipped").tooltip();
										$("#approve").hover(function() {
											console.log("herro");
										}).click(function(e) {
											e.preventDefault();
											if(functions.rgba_to_hex($("#approve").css("color")) == "#ff0000") {
												$("#approve").css("color", "green");
												if(data.cms_approval == null) {
													data.cms_approval = cookie;
												}
												else {
													data.cms_approval += "," + cookie;
												}
											}
											else {
												$("#approve").css("color", "red");
												var pos = data.cms_approval.indexOf(cookie);
												if(pos == 0) {
													data.cms_approval = data.cms_approval.substring(cookie.length + 2);
												}
												else {
													data.cms_approval = data.cms_approval.substring(0, pos - 1) +
														data.cms_approval.substring(pos + cookie.length);
												}
											}
											if(data.cms_approval == "") { data.cms_approval = null; }
										});
										$("#live-version").click(function(e) {
											e.preventDefault();
											if(functions.rgba_to_hex($("#edit").closest("li").css("background-color")) == "#008cc3") {
												$(".latex_body").each(function(index) {
													var arr_title = [],
														arr_body = [];
													$(".show_solution").each(function(index) {
														var title = $(this).children().first().clone().children().remove().end().text();
														$(this).children().children().each(function(index) {
															if($(this).hasClass("toggle") && $(this).text() == "toggle_off") {
																arr_title.push(title + "_hidden");
															}
															else if($(this).hasClass("toggle") && $(this).text() == "toggle_on") {
																arr_title.push(title);
															}
														});
														$(this).siblings().each(function(index) {
															arr_body.push($(this).children()[0].innerHTML);
														});
													});
													data.title_cms = arr_title;
													data.content_cms = arr_body;
												});
											}
											if(functions.rgba_to_hex($("#live-version").closest("li").css("background-color")) != "#008cc3") {
												var controller = $("#bar-div").detach();
												$("#latex").empty().append(controller);
												var j = 0;
												for(; j >= 0; j++) {
													if(data.title[j] == null || data.title[j] == "") { break; }
													var cont_div = "",
														title = data.title[j].split("_")[0],
														accordion = $("<div>").addClass("accordion"),
														show_solution = $("<div>").addClass("show_solution").text(title),
														span = $("<span>").addClass("solution_display"),
														latex_body = $("<div>").addClass("latex_body");
													if(data.title[j].split("_").length == 1) {
														cont_div = $("<div>").addClass("cont_div");
														span.append($("<i>").addClass("material-icons").text("remove"));
													}
													else {
														cont_div = $("<div>").addClass("cont_div hidden_div");
														span.append($("<i>").addClass("material-icons").text("add"));
													}	
													latex_body.append(data.content[j]);
													cont_div.append(latex_body);
													show_solution.append(span);
													accordion.append(show_solution);
													accordion.append(cont_div);
													$("#latex").append(accordion);
												}
												if(j == 0) {
													$("#latex").append($("<div>").addClass("accordion").append($("<div>")
														.addClass("show_solution").text("NO CONTENT HERE!")));
												}
												$("#live-version").closest("li").css("background-color", "#008cc3");
												$("#cms-version").closest("li").css("background-color", "#00b7ff");
												$("#edit").closest("li").css("background-color", "#00b7ff");
												MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
												functions.handle_button();
											}
										});
										$("#cms-version").click(function(e) {
											e.preventDefault();
											if(functions.rgba_to_hex($("#edit").closest("li").css("background-color")) == "#008cc3") {
												$(".latex_body").each(function(index) {
													var arr_title = [],
														arr_body = [];
													$(".show_solution").each(function(index) {
														var title = $(this).children().first().clone().children().remove().end().text();
														$(this).children().children().each(function(index) {
															if($(this).hasClass("toggle") && $(this).text() == "toggle_off") {
																arr_title.push(title + "_hidden");
															}
															else if($(this).hasClass("toggle") && $(this).text() == "toggle_on") {
																arr_title.push(title);
															}
														});
														$(this).siblings().each(function(index) {
															arr_body.push($(this).children()[0].innerHTML);
														});
													});
													data.title_cms = arr_title;
													data.content_cms = arr_body;
												});
											}
											if(functions.rgba_to_hex($("#cms-version").closest("li").css("background-color")) != "#008cc3") {
												var controller = $("#bar-div").detach();
												$("#latex").empty().append(controller);
												var j = 0;
												for(; j >= 0; j++) {
													if(data.title_cms[j] == null || data.title_cms[j] == "") { break; }
													var cont_div = "",
														title = data.title_cms[j].split("_")[0],
														accordion = $("<div>").addClass("accordion"),
														show_solution = $("<div>").addClass("show_solution").text(title),
														span = $("<span>").addClass("solution_display"),
														latex_body = $("<div>").addClass("latex_body");
													if(data.title_cms[j].split("_").length == 1) {
														cont_div = $("<div>").addClass("cont_div");
														span.append($("<i>").addClass("material-icons").text("remove"));
													}
													else {
														cont_div = $("<div>").addClass("cont_div hidden_div");
														span.append($("<i>").addClass("material-icons").text("add"));
													}		
													latex_body.append(data.content_cms[j]);
													cont_div.append(latex_body);
													show_solution.append(span);
													accordion.append(show_solution);
													accordion.append(cont_div);
													$("#latex").append(accordion);
												}
												if(j == 0) {
													$("#latex").append($("<div>").addClass("accordion").append($("<div>")
														.addClass("show_solution").text("NO CONTENT HERE!")));
												}
												$("#cms-version").closest("li").css("background-color", "#008cc3");
												$("#live-version").closest("li").css("background-color", "#00b7ff");
												$("#edit").closest("li").css("background-color", "#00b7ff");
												MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
												functions.handle_button();
											}
										});
										$("#edit").click(function(e) {
											e.preventDefault();
											if(functions.rgba_to_hex($("#edit").closest("li").css("background-color")) != "#008cc3") {
												var controller = $("#bar-div").detach();
												$("#latex").empty().append(controller);
												var j = 0;
												for(; j >= 0; j++) {
													if(data.title_cms[j] == null || data.title_cms[j] == "") { break; }
													var cont_div = "",
														title = data.title_cms[j].split("_")[0],
														accordion = $("<div>").addClass("accordion"),
														show_solution = $("<div>").addClass("show_solution")
															.append($("<div>").addClass("tog-title").attr("contentEditable", "true")
															.text(title)),
														span = $("<span>").addClass("solution_display"),
														span_toggle = $("<span>").addClass("solution_toggle"),
														latex_body = $("<div>").addClass("latex_body");
													if(data.title_cms[j].split("_").length == 1) {
														cont_div = $("<div>").addClass("cont_div");
														span.append($("<i>").addClass("material-icons").text("remove"));
														span_toggle.append($("<i>").addClass("material-icons toggle").text("toggle_on"));
													}
													else {
														cont_div = $("<div>").addClass("cont_div hidden_div");
														span.append($("<i>").addClass("material-icons").text("add"));
														span_toggle.append($("<i>").addClass("material-icons toggle").text("toggle_off"));
													}	
													latex_body.append(data.content_cms[j]);
													cont_div.append(latex_body);
													show_solution.append(span_toggle, span);
													accordion.append(show_solution);
													accordion.append(cont_div);
													$("#latex").append(accordion);
												}
												if(j == 0) {
													$("#latex").append($("<div>").addClass("accordion").append($("<div>")
														.addClass("show_solution").text("NO CONTENT HERE!")));
												}
												$("#edit").closest("li").css("background-color", "#008cc3");
												$("#live-version").closest("li").css("background-color", "#00b7ff");
												$("#cms-version").closest("li").css("background-color", "#00b7ff");
												$(".toggle").click(function(e) {
													e.preventDefault();
													e.stopPropagation();
													var item = $(this).parents().prev().clone().children().remove().end().text();
													var ref = data.title_cms.findIndex(function(elem) {
														return elem.split("_hidden")[0] == item;
													});
													console.log(item, data);
													if($(this).text() == "toggle_off") {
														$(this).text("toggle_on");
														data.title_cms[ref] = item;
													}
													else if($(this).text() == "toggle_on") {
														$(this).text("toggle_off");
														data.title_cms[ref] += "_hidden";
													}
												});
												functions.handle_button(1);
												$(".latex_body").attr("contentEditable", "true");
											}
										});


										// if(functions.is_mobile() && section.section_name == "Common_Derivatives_and_Properties") {
										// 	MathJax.Hub.Queue(function() {
										// 		functions.hide_mathjax_span();
										// 	});
										// }
									});
								}
								else {
									var example = section.examples.filter(function(iter) {
										return iter.ename == toState.params.current_page_name;
									})[0];
									$("#examples_li" + example.eid + "_cms").addClass("active");
									$.get("/api/example/data/" + example.eid).done(function(content) {
										var accordion1 = $("<div>").addClass("accordion"),
											show_solution1 = $("<div>").addClass("show_solution").text("Problem"),
											problem_span = $("<span>").addClass("solution_display").attr("id", "problem_span")
												.append($("<i>").addClass("material-icons").text("remove")),
											cont_div1 = $("<div>").addClass("cont_div"),
											latex_body1 = $("<div>").addClass("latex_body"),
											accordion2 = $("<div>").addClass("accordion"),
											show_solution2 = $("<div>").addClass("show_solution").text("Solution"),
											solution_span = $("<span>").addClass("solution_display").attr("id", "solution_span")
												.append($("<i>").addClass("material-icons").text("add")),
											cont_div2 = $("<div>").addClass("cont_div hidden_div"),
											latex_body2 = $("<div>").addClass("latex_body");
										if(content.problem == null || content.problem == "") { show_solution1.text("NO PROBLEM HERE!"); problem_span.text(""); }
										if(content.solution == null || content.solution == "") { show_solution2.text("NO SOLUTION HERE!"); solution_span.text(""); }
										latex_body1.append(content.problem);
										cont_div1.append(latex_body1);
										show_solution1.append(problem_span);
										accordion1.append(show_solution1);
										accordion1.append(cont_div1);
										latex_body2.append(content.solution);
										cont_div2.append(latex_body2);
										show_solution2.append(solution_span);
										accordion2.append(show_solution2);
										accordion2.append(cont_div2);
										$("#latex").append(accordion1).append(accordion2);
										functions.handle_breadcrumbs("example", $(".accordion").first(), subject, topic, section, example);
										MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
										functions.handle_button();
									});
								}
								$.get("/pages/dist/button-min.html").done(function(button) {
									$("body").append(button);
									functions.committee(cookie, function() {
										functions.handle_logo_link("subject.topic.section.current_page");
										functions.handle_logo();
										functions.handle_li_coloring();
										links.handle_links(router, subjects, topics, sections, examples);
										functions.handle_orientation("section", navs, section, topic);
										functions.handle_desktop_title("section", subject, topic, section);
										$("#bar-nav").css("width", "100%");
										$("#bar").css("width", "82%");
										$("#live-version").parent("li").css("margin-left", "25px");
										$("#save").parent("li").css("margin-right", "25px");
										$("#cms-version").closest("li").css("background-color", "#008cc3");
										$("#examples_change").click(function(e) {
											e.preventDefault();
											functions.sidenav_modal("Examples", examples, section.section_id);
										});
									});
								});
							});
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
						$("#section_name" + section.section_id).addClass("active");
						$.get("/api/section/data/" + section.section_id).done(function(content) {
							var i = 0;
							for(; i >= 0; i++) {
								if(content["title" + i] == null || content["title" + i] == "") { break; }
								var cont_div = "",
									title = content["title" + i].split("_")[0],
									accordion = $("<div>").addClass("accordion"),
									show_solution = $("<div>").addClass("show_solution").text(title),
									span = $("<span>").addClass("solution_display"),
									latex_body = $("<div>").addClass("latex_body");
								if(content["title" + i].split("_").length == 1) {
									cont_div = $("<div>").addClass("cont_div");
									span.append($("<i>").addClass("material-icons").text("remove"));
								}
								else {
									cont_div = $("<div>").addClass("cont_div hidden_div");
									span.append($("<i>").addClass("material-icons").text("add"));
								}	
								latex_body.append(content["content" + i]);
								cont_div.append(latex_body);
								show_solution.append(span);
								accordion.append(show_solution);
								accordion.append(cont_div);
								$("#latex").append(accordion);
							}
							if(i == 0) {
								$("#latex").append($("<div>").addClass("accordion").append($("<div>")
									.addClass("show_solution").text("NO CONTENT HERE!")));
							}
							functions.handle_breadcrumbs("section", $(".accordion").first(), subject, topic, section);
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							functions.handle_button();
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
						$.get("/api/example/data/" + example.eid).done(function(content) {
							var accordion1 = $("<div>").addClass("accordion"),
								show_solution1 = $("<div>").addClass("show_solution").text("Problem"),
								problem_span = $("<span>").addClass("solution_display").attr("id", "problem_span")
									.append($("<i>").addClass("material-icons").text("remove")),
								cont_div1 = $("<div>").addClass("cont_div"),
								latex_body1 = $("<div>").addClass("latex_body"),
								accordion2 = $("<div>").addClass("accordion"),
								show_solution2 = $("<div>").addClass("show_solution").text("Solution"),
								solution_span = $("<span>").addClass("solution_display").attr("id", "solution_span")
									.append($("<i>").addClass("material-icons").text("add")),
								cont_div2 = $("<div>").addClass("cont_div hidden_div"),
								latex_body2 = $("<div>").addClass("latex_body");
							if(content.problem == null || content.problem == "") { show_solution1.text("NO PROBLEM HERE!"); problem_span.text(""); }
							if(content.solution == null || content.solution == "") { show_solution2.text("NO SOLUTION HERE!"); solution_span.text(""); }
							latex_body1.append(content.problem);
							cont_div1.append(latex_body1);
							show_solution1.append(problem_span);
							accordion1.append(show_solution1);
							accordion1.append(cont_div1);
							latex_body2.append(content.solution);
							cont_div2.append(latex_body2);
							show_solution2.append(solution_span);
							accordion2.append(show_solution2);
							accordion2.append(cont_div2);
							$("#latex").append(accordion1).append(accordion2);
							functions.handle_breadcrumbs("example", $(".accordion").first(), subject, topic, section, example);
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
							functions.handle_button();
						});
					}
					functions.handle_logo_link("subject.topic.section.current_page");
					functions.handle_logo();
					functions.handle_li_coloring();
					links.handle_links(router, subjects, topics, sections, examples);
					functions.handle_orientation("section", navs, section, topic);
					functions.handle_desktop_title("section", subject, topic, section);
				});
			});
		});
	};

	return exports;
});