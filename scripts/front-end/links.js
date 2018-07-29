define(["dist/functions-min", "materialize"], function(functions, Materialize) {
	var exports = {};

	/*

	Purpose:
	Handles all of the navigation performed by the links.

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
	exports.handle_links = function(router, subjects, topics, sections, examples) {
		$("button").click(function(e) {
			e.preventDefault();
			if($(this).attr("id") == "login_button") {
				if(functions.validate($("#login_email").val())) {
					$.post("/api/cms/check/" + $("#login_email").val()).done(function(result) {
						if(result.length == 1) {
							if($("#login_password").val().length > 0) {
								$.post("api/cms/check/" + $("#login_email").val() + "/" + $("#login_password").val()).done(function(obj) {
									if(typeof(obj[0]) == "object") {
										functions.modal("template", 6);
										$(document).bind("keydown", function(event) {
											event.stopImmediatePropagation();
											return false;
										});
										// $("html").one("keydown", false);
										$("#template_exit").click(function() {
											location.reload();
											$(window).scrollTop(0);
										});
										$("#template_submit").click(function() {
											if(obj[0].status == 0) {
												$("#status_issue_control").click();
												$("#status_submit").click(function() {
													$(document).unbind("keydown");
													location.reload();
													$(window).scrollTop(0);
												});
											}
											else {
												// MOVING FORWARD HERE!!!!!!
											}
										});
									}
									else if(typeof(obj[0]) == "string") {
										if(obj[0] == "Wrong Password") {
											functions.modal("template", 5);
										}
										else {
											functions.modal("template", 4);
										}
									}
									else {
										functions.modal("template", 3);
									}
								});
							}
							else {
								functions.modal("template", 2);
							}
						}
						else {
							functions.modal("template", 1);
						}
					});
				}
				else {
					functions.modal("template", 0);
				}
			}
			else if($(this).attr("id") == "register_button") {
				if(functions.validate($("#email").val())) {
					$.post("/api/cms/check/" + $("#email").val()).done(function(result) {
						if(result.length == 0) {
							if($("#password").val().length > 0 && $("#password").val() == $("#password-confirm").val()) {
								if($("#first_name").val().length > 0) {
									if($("#last_name").val().length > 0) {
										if($("#answer").val().length > 0) {
											var call = "/api/cms/add/" + $("#first_name").val() + "/" + $("#last_name").val() 
												+ "/" + $("#email").val() + "/" + $("#password").val() + "/" 
												+ $("#question")[0].options.selectedIndex + "/" + $("#answer").val();
											$.post(call).done(function() {
												$.post("/api/cms/get/admin").done(function(obj) {
													functions.modal("template", 13, obj);
													$("#template_submit").click(function() {
														location.reload();
														$(window).scrollTop(0);
													});
												});
											}).fail(function() {
												functions.modal("template", 12);
											});
										}
										else {
											functions.modal("template", 11);
										}
									}
									else {
										functions.modal("template", 10);
									}
								}
								else {
									functions.modal("template", 9);
								}
							}
							else if($("#password").val().length == 0 && $("#password").val() == $("#password-confirm").val()) {
								functions.modal("template", 2);
							}
							else {
								functions.modal("template", 8);
							}
						}
						else {
							functions.modal("template", 7);
						}
					});
				}
				else {
					functions.modal("template", 0);
				}
			}
		});

		$("a").click(function(e) {
			e.preventDefault();
			if($(this).attr("id") == "about" || $(this).attr("href") == "about.html") {
				router.navigate("about");
			}
			else if($(this).attr("id") == "login_click") {
				$("#register_input").hide(400);
				$("#login_input").show(400);
				$("#container").css("height", "400px");
				$("#login_heading").css("background", "linear-gradient(to right, #4693ec 50%, #e0e0e0 50%)");
				$("html").css("height", "850px");
				$("#register_input input").each(function() { $(this).val(""); });
				$('select').material_select();
				Materialize.updateTextFields();
			}
			else if($(this).attr("id") == "register_click") {
				$("#login_input").hide(400);
				$("#register_input").show(400);
				$("#container").css("height", "810px");
				$("#login_heading").css("background", "linear-gradient(to left, #4693ec 50%, #e0e0e0 50%)");
				$("html").css("height", "1250px");
				$("#login_input input").each(function() { $(this).val(""); });
				Materialize.updateTextFields();
			}
			else if($(this).attr("id") == "forgot") {
				if(functions.validate($("#login_email").val())) {
					$.post("/api/cms/get/" + $("#login_email").val()).done(function(content) {
						$("#question")[0].options.selectedIndex = parseInt(content);
						functions.modal("template", 14);
						$("#template_submit").click(function(e) {
							e.preventDefault();
							$.post("/api/cms/check/security/" + $("#login_email").val() + "/" + $("#forgotten").val()).done(function(result) {
								if(result == 1) {
									functions.modal("status", 0);
									$("#status_exit").click(function() {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
									$("#status_submit").click(function(e) {
										e.preventDefault();
										$.post("/api/cms/change/password/" + $("#login_email").val() + "/" + $("#newpass").val()).done(function() {
											functions.modal("template", 15);
											$("#template_submit").click(function(e) {
												e.preventDefault();
												location.reload();
												$(window).scrollTop(0);
											});
										});
									});
								}
								else {
									functions.modal("status", 1);
									$("#status_submit").click(function(e) {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
								}
							});
						});
						$("#template_exit").click(function() {
							e.preventDefault();
							location.reload();
							$(window).scrollTop(0);
						});
					});
				}
				else {
					functions.modal("template", 0);
				}
			}
			else {
				var id = $(this).attr("id");
				if(id) {
					var holder = id.split("_"),
						id_string = holder[0];
					if(holder.length > 1) {
						var id_num = holder[1];
					}
					if(id_string == "subjects" || id_string == "aboutsubject") {
						var subject = subjects.filter(function(iter) {
							return iter.sid == id_num;
						})[0];
						router.navigate("subject", {sname: subject.sname});
					}
					else if(id_string == "subjectnav") {
						router.navigate("about");
					}
					else if(id_string == "topics" || id_string == "abouttopic") {
						var topic = topics.filter(function(iter) {
							return iter.tid == id_num;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject.topic", {sname: subject.sname, tname: topic.tname});
					}
					else if(id_string == "topicnav") {
						var topic = topics.filter(function(iter) {
							return iter.tid == id_num;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject", {sname: subject.sname});
					}
					else if(id_string == "sections") {
						var section = sections.filter(function(iter) {
							return iter.section_id == id_num;
						})[0],
							topic = topics.filter(function(iter) {
							return iter.tid == section.tid;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: section.section_name});
					}
					else if(id_string == "sectionnav") {
						var section = sections.filter(function(iter) {
							return iter.section_id == id_num;
						})[0],
							topic = topics.filter(function(iter) {
							return iter.tid == section.tid;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject.topic", {sname: subject.sname, tname: topic.tname});
					}
					else if(id_string == "sectionname") {
						var section = sections.filter(function(iter) {
							return iter.section_id == id_num;
						})[0],
							topic = topics.filter(function(iter) {
							return iter.tid == section.tid;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: section.section_name});
					}
					else if(id_string == "examples") {
						var example = examples.filter(function(iter) {
							return iter.eid == id_num;
						})[0],
							section = sections.filter(function(iter) {
							return iter.section_id == example.section_id;
						})[0],
							topic = topics.filter(function(iter) {
							return iter.tid == section.tid;
						})[0],
							subject = subjects.filter(function(iter) {
							return iter.sid == topic.sid;
						})[0];
						router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: example.ename});
					}
				}
			}
		});
	};

	return exports;
});