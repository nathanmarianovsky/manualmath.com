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
										var statement = "By continuing you are agreeing to manualmath's use of cookies to store session information.";
										$("#template_title").text("Login Confirmation").css("text-align", "center");
										$("#template_body").text(statement);
										$("#template_submit").text("Continue");
										$("#template_modal_footer").append($("<a>").attr("id", "template_exit")
											.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
										$("#template_issue_control").click();
										$(document).bind("keydown", function(event) {
											event.stopImmediatePropagation();
											return false;
										});
										$("html").one("keydown", false);
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
											$("#template_title").text("Password Issue");
											$("#template_body").text("The password you provided does not match the one in the database. Please try again!");
											$("#template_issue_control").click();
										}
										else {
											$("#template_title").text("Email Issue");
											$("#template_body").text("The email you provided does not exist in the database. Please provide another email!");
											$("#template_issue_control").click();
										}
									}
									else {
										$("#template_title").text("Database Issue");
										$("#template_body").text("There was a problem connecting to the database!");
										$("#template_issue_control").click();
									}
								});
							}
							else {
								$("#template_title").text("Password Issue");
								$("#template_body").text("The password cannot be left empty. Please try again!");
								$("#template_issue_control").click();
							}
						}
						else {
							$("#template_title").text("Registration Issue");
							$("#template_body").text("The email you provided does not exist in the database. Please provide another email!");
							$("#template_issue_control").click();
						}
					});
				}
				else {
					$("#template_title").text("Email Issue");
					$("#template_body").text("There was an issue parsing the email you provided. Please try again!");
					$("#template_issue_control").click();
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
												var statement = "Thanks for submitting an application to become a " 
												+ "contributor on manualmath! The design of the content management " 
												+ "system requires a majority approval from a committee of five top " 
												+ "ranking members including the administrator to become a contributor. " 
												+ "Deliberations can take a while, but you can definitely expect a " 
												+ "response within a week.";
												$("#template_title").text("Contributor Submission").css("text-align", "center");
												$.post("/api/cms/get/admin").done(function(obj) {
													$("#template_body").text(statement).append($("<br><br>")).append($("<div>")
														.text("- " + obj.first_name + " " + obj.last_name).css("text-align", "right"));
													$("#template_issue_control").click();
													$("#template_submit").click(function() {
														location.reload();
														$(window).scrollTop(0);
													});
												});
											}).fail(function() {
												$("#template_title").text("Contributor Submission Issue");
												$("#template_body").text("There was an issue processing the submission to the database!");
												$("#template_issue_control").click();
											});
										}
										else {
											$("#template_title").text("Security Question Issue");
											$("#template_body").text("The answer to the chosen security question cannot be left empty. Please try again!");
											$("#template_issue_control").click();
										}
									}
									else {
										$("#template_title").text("Name Issue");
										$("#template_body").text("The last name cannot be left empty. Please try again!");
										$("#template_issue_control").click();
									}
								}
								else {
									$("#template_title").text("Name Issue");
									$("#template_body").text("The first name cannot be left empty. Please try again!");
									$("#template_issue_control").click();
								}
							}
							else if($("#password").val().length == 0 && $("#password").val() == $("#password-confirm").val()) {
								$("#template_title").text("Password Issue");
								$("#template_body").text("The password cannot be left empty. Please try again!");
								$("#template_issue_control").click();
							}
							else {
								$("#template_title").text("Password Issue");
								$("#template_body").text("The passwords you provided did not match. Please try again!");
								$("#template_issue_control").click();
							}
						}
						else {
							$("#template_title").text("Registration Issue");
							$("#template_body").text("The email you provided already exists in the database. Please provide another email!");
							$("#template_issue_control").click();
						}
					});
				}
				else {
					$("#template_title").text("Email Issue");
					$("#template_body").text("There was an issue parsing the email you provided. Please try again!");
					$("#template_issue_control").click();
				}
			}
		});

		$("a").click(function(e) {
			e.preventDefault();
			if($(this).attr("id") == "about" || $(this).attr("href") == "about.html") {
				router.navigate("about");
			}
			else if($(this).attr("id") == "login_click") {
				$("#register_input").hide(450);
				$("#login_input").show(450);
				$("#container").css("height", "400px");
				$("#login_heading").css("background", "linear-gradient(to right, #4693ec 50%, #e0e0e0 50%)");
				$("html").css("height", "850px");
				console.log($("#question"));
				console.log($("#question")[0].options[$("#question")[0].options.selectedIndex]);
				console.log($("#question")[0].options[$("#question")[0].options.selectedIndex].text());
				console.log($("#answer").text());
				$("#register_input input").each(function() { $(this).val(""); });
				Materialize.updateTextFields();
			}
			else if($(this).attr("id") == "register_click") {
				$("#login_input").hide(450);
				$("#register_input").show(450);
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
						var first = $("<div>").addClass("col s12"),
							second = $("<form>").addClass("col s12"),
							third = $("<div>").addClass("form-container"),
							fourth1 = $("<div>").addClass("row"),
							fifth1 = $("<div>").addClass("input-field col s12"),
							sixth1 = $("<i>").addClass("material-icons prefix").text("lock"),
							seventh1 = $("<input>").attr("type", "text").val($("#question option:selected").text()),
							fourth2 = $("<div>").addClass("row"),
							fifth2 = $("<div>").addClass("input-field col s12"),
							sixth2 = $("<i>").addClass("material-icons prefix").text("mode_edit"),
							seventh2 = $("<input>").attr("id", "forgotten").attr("type", "text"),
							eighth = $("<label>").attr("for", "forgotten").addClass("black-text").text("Answer");
						fifth2.append(sixth2).append(seventh2).append(eighth);
						fourth2.append(fifth2);
						fifth1.append(sixth1).append(seventh1);
						fourth1.append(fifth1);
						third.append(fourth1).append(fourth2);
						second.append(third);
						first.append(second);
						$("#template_title").text("Password Recovery");
						$("#template_body").text("Please answer the security question associated to the account:").append(first);
						$("#template_modal_footer").append($("<a>").attr("id", "template_exit")
							.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
						$("#template_issue_control").click();
						$("#template_submit").css("pointer-events", "none");
						$("#forgotten").on("input", function() {
							if($("#forgotten").val().length == 0) {
								$("#template_submit").css("pointer-events", "none");
							}
							else {
								$("#template_submit").css("pointer-events", "auto");
							}
						});
						$("#template_submit").click(function(e) {
							e.preventDefault();
							$.post("/api/cms/check/security/" + $("#login_email").val() + "/" + $("#forgotten").val()).done(function(result) {
								if(result == 1) {
									first = $("<div>").addClass("col s12");
									second = $("<form>").addClass("col s12");
									third = $("<div>").addClass("form-container");
									fourth = $("<div>").addClass("row");
									fifth = $("<div>").addClass("input-field col s12");
									sixth = $("<i>").addClass("material-icons prefix").text("lock");
									seventh = $("<input>").attr("id", "newpass").attr("type", "password");
									eighth = $("<label>").attr("for", "newpass").addClass("black-text").text("New Password");
									fifth.append(sixth).append(seventh).append(eighth);
									fourth.append(fifth);
									third.append(fourth);
									second.append(third);
									first.append(second);
									$("#status_title").text("Password Reset");
									$("#status_body").text("Please provide a new password:").append(first);
									$("#status_modal_footer").append($("<a>").attr("id", "status_exit")
										.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
									$("#status_issue_control").click();
									$("#status_submit").css("pointer-events", "none");
									$("#newpass").on("input", function() {
										if($("#newpass").val().length == 0) {
											$("#status_submit").css("pointer-events", "none");
										}
										else {
											$("#status_submit").css("pointer-events", "auto");
										}
									});
									$("#status_exit").click(function() {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
									$("#status_submit").click(function(e) {
										e.preventDefault();
										$.post("/api/cms/change/password/" + $("#login_email").val() + "/" + $("#newpass").val()).done(function() {
											$("#template_title").text("Password Changed");
											$("#template_body").text("You may now login with the new password!");
											$("#template_exit").remove();
											$("#template_issue_control").click();
											$("#template_submit").click(function(e) {
												e.preventDefault();
												location.reload();
												$(window).scrollTop(0);
											});
										});
									});
								}
								else {
									$("#status_title").text("Password Recovery").css("text-align", "left");
									$("#status_body").text("You provided the wrong answer to the security question!");
									$("#status_issue_control").click();
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
					$("#template_title").text("Email Issue");
					$("#template_body").text("There was an issue parsing the email you provided. Please try again!");
					$("#template_issue_control").click();
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