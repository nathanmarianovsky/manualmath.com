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
			var statement = "";
			if($(this).attr("id") == "login_button") {
				if(functions.validate($("#login_email").val())) {
					$.post("/api/cms/check/" + $("#login_email").val()).done(function(result) {
						if(result.length == 1) {
							if(functions.password_check($("#login_password").val())) {
								statement = "/api/cms/check/" + $("#login_email").val() + 
									"/" + $("#login_password").val();
								$.post(statement).done(function(obj) {
									if(typeof(obj[0]) == "object") {
										functions.modal(13, router, obj);
									}
									else if(typeof(obj[0]) == "string") {
										if(obj[0] == "Wrong Password") {
											functions.modal(5);
										}
										else { functions.modal(4); }
									}
									else { functions.modal(3); }
								});
							}
							else { functions.modal(5); }
						}
						else { functions.modal(1); }
					});
				}
				else { functions.modal(0); }
			}
			else if($(this).attr("id") == "register_button") {
				if(functions.validate($("#email").val())) {
					$.post("/api/cms/check/" + $("#email").val()).done(function(result) {
						if(result.length == 0) {
							if(functions.password_check($("#password").val()) && 
								$("#password").val() == $("#password-confirm").val()) {
								if($("#first_name").val().trim().length > 0 && 
									!/[^a-zA-Z]/.test($("#first_name").val())) {
									if($("#last_name").val().trim().length > 0 && 
										!/[^a-zA-Z]/.test($("#last_name").val())) {
										if($("#answer").val().trim().length > 0) {
											var first = $("#first_name").val()[0].toUpperCase() + 
												$("#first_name").val().slice(1).toLowerCase(),
												last =  $("#last_name").val()[0].toUpperCase() + 
													$("#last_name").val().slice(1).toLowerCase(),
												call = "/api/cms/add/" + first + "/" + last + "/" + 
													$("#email").val() + "/" + $("#password").val() + 
													"/" + $("#question")[0].options.selectedIndex + 
													"/" + $("#answer").val();
											$.post(call).done(function() {
												$.post("/api/cms/get/admin").done(function(obj) {
													functions.modal(12, router, obj);
												});
											}).fail(function() { functions.modal(11); });
										}
										else { functions.modal(10); }
									}
									else { functions.modal(9); }
								}
								else { functions.modal(8); }
							}
							else if(!functions.password_check($("#password").val())) {
								functions.modal(2);
							}
							else { functions.modal(7); }
						}
						else { functions.modal(6); }
					});
				}
				else { functions.modal(0); }
			}
		});

		$("a").click(function(e) {
			e.preventDefault();
			console.log("herro!!");
			console.log($(this).attr("id"));
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
				$("#question").val(1);
				$("select").material_select();
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
			else if($(this).attr("id") == "logout") {
				var cookie = functions.read_cookie("contributor");
				$.post("/api/cms/remove/live/" + cookie).done(function(result) {
					if(result == 1) {
						functions.delete_cookie("contributor");
					}
					else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
				});
			}
			else if($(this).attr("id") == "profile") {
				var cookie = functions.read_cookie("contributor");
				$.get("/pages/dist/modal-min.html").done(function(result) {
					if(result != "0") {
						$("body").append(result);
						functions.profile_modal(cookie);
					}
					else { console.log("There was an issue removing the contributor from the list of live sessions!"); }
				});
			}
			else if($(this).attr("id") == "forgot") {
				if(functions.validate($("#login_email").val())) {
					$.post("/api/cms/get/" + $("#login_email").val()).done(function(content) {
						$("#question")[0].options.selectedIndex = parseInt(content);
						functions.modal(14);
					});
				}
				else {
					functions.modal(0);
				}
			}
			else if($(this).attr("id") == "subjects_change") {
				functions.sidenav_modal("Subjects", subjects);
			}
			else {
				var id = $(this).attr("id");
				console.log(id);
				if(id) {
					var holder = id.split("_"),
						id_string = holder[0];
					if(holder.length > 1) {
						var id_num = holder[1];
					}
					if(id_string == "subjects") {
						var subject = subjects.filter(function(iter) {
							return iter.sid == id_num;
						})[0];
						if(holder[2] != "cms") {
							router.navigate("subject", {sname: subject.sname});
						}
						else {
							console.log("success!!");
						}
					}
					else if(id_string == "subjectnav") {
						router.navigate("about");
					}
					else if(id_string == "topics") {
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
						router.navigate("subject.topic.section.current_page", {
							sname: subject.sname, 
							tname: topic.tname, 
							section_name: 
							section.section_name, 
							current_page_name: section.section_name
						});
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
						router.navigate("subject.topic.section.current_page", { 
							sname: subject.sname, 
							tname: topic.tname, 
							section_name: section.section_name, 
							current_page_name: section.section_name
						});
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
						router.navigate("subject.topic.section.current_page", { 
							sname: subject.sname, 
							tname: topic.tname, 
							section_name: section.section_name, 
							current_page_name: example.ename
						});
					}
				}
			}
		});
	};

	return exports;
});