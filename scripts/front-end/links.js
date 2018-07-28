define(["dist/functions-min"], function(functions) {
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

			}
			else if($(this).attr("id") == "register_button") {
				// console.log($("#email").val());
				// console.log(functions.validate($("#email").val()));
				if(functions.validate($("#email").val())) {
					if($("#password").val().length > 0 && $("#password").val() == $("#password-confirm").val()) {
						if($("#first_name").val().length > 0) {
							if($("#last_name").val().length > 0) {
								var statement = "Thanks for submitting an application to become a " 
								+ "contributor on manualmath! The design of the content management " 
								+ "system requires a majority approval from a committee of five top " 
								+ "ranking members including the administrator to become a contributor. " 
								+ "Deliberations can take a while, but you can definitely expect a " 
								+ "response within a week.<br><br><div id='signature'>- Current Administrator</div>";
								$("#template_title").text("Contributor Submission").css("text-align", "center");
								$("#template_body").text(statement);
								$("#template_issue_control").click();
								// $("#register_control").click();
								$("#template_submit").click(function() {
									router.navigate("cms_login", {reload: true});
									$(window).scrollTop(0);
								});
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

					// if($("#register_modal").css("display") != "none") {
					// 	$(document).click(function() {
					// 		console.log($("#register_modal").css("display"));
					// 		if($("#register_modal").css("display") == "none") {
					// 			router.navigate("cms_login");
					// 		}
					// 	});
					// }
				}
				else {
					$("#template_title").text("Email Issue");
					$("#template_body").text("There was an issue parsing the email you provided. Please try again!");
					$("#template_issue_control").click();
				}
				// console.log($("#email").val());
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
			}
			else if($(this).attr("id") == "register_click") {
				$("#login_input").hide(450);
				$("#register_input").show(450);
				$("#container").css("height", "620px");
				$("#login_heading").css("background", "linear-gradient(to left, #4693ec 50%, #e0e0e0 50%)");
				$("html").css("height", "1100px");
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