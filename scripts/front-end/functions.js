define(function() {
	var exports = {};

	/*

	Purpose:
	Checks if a string meets the requirements to be a password.

	Parameters:
		str: 
			Password candidate

	*/
	exports.password_check = function(str) {
	    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    	return re.test(str);
	};

	/*

	Purpose:
	Creates a cookie.

	Parameters:
		name: 
			Cookie name
		value:
			Cookie value
		minutes:
			Number of minutes til cookie expiration

	*/
	exports.write_cookie = function(name, value, minutes) {
	    var date, expires;
	    if(minutes) {
	        date = new Date();
	        date.setTime(date.getTime() + (minutes * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    }
	    else { expires = ""; }
	    document.cookie = name + "=" + value + expires + "; path=/";
	};

	/*

	Purpose:
	Reads a cookie's value with the given name.

	Parameters:
		name: 
			Cookie name

	*/
	exports.read_cookie = function(name) {
	    var i, c, ca, nameEQ = name + "=";
	    ca = document.cookie.split(";");
	    for(i = 0; i < ca.length; i++) {
	        c = ca[i];
	        while(c.charAt(0)==" ") {
	            c = c.substring(1, c.length);
	        }
	        if(c.indexOf(nameEQ) == 0) {
	            return c.substring(nameEQ.length, c.length);
	        }
	    }
	    return "";
	};

	/*

	Purpose:
	Deletes a cookie by changing the max-age.

	Parameters:
		name: 
			Cookie name

	*/
	exports.delete_cookie = function(name) {   
	    document.cookie = name + "=; Max-Age=-99999999;";  
	};

	/*

	Purpose:
	Listens for a change in the cookie with the given name.

	Parameters:
		name: 
			Cookie name
		callback:
			Callback function to execute afterwards

	*/
	exports.listen_cookie_change = function(name, callback) {
		var cookieRegistry = [];
	    setInterval(function() {
	        if(cookieRegistry[name]) {
	            if(exports.read_cookie(name) != cookieRegistry[name]) {
	                cookieRegistry[name] = exports.read_cookie(name);
	                return callback();
	            }
	        } 
	        else {
	            cookieRegistry[name] = exports.read_cookie(name);
	        }
	    }, 100);
	};

	exports.session_modal = function(router, page, issue) {
		var button = $("<button>").attr("data-target", "template_issue").attr("id", "template_issue_control")
			.addClass("btn modal-trigger"),
			outer_div = $("<div>").attr("id", "template_issue").addClass("modal modal-fixed-footer"),
			content = $("<div>").addClass("modal-content"),
			content_title = $("<h4>").attr("id", "template_title").text("Login Issue"),
			content_body = $("<p>").attr("id", "template_body"),
			footer = $("<div>").attr("id", "template_modal_footer").addClass("modal-footer"),
			footer_link = $("<a>").attr("id", "template_submit").addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Ok");
		if(issue == 0) {
			content_body.text("It seems you are not currently signed into the content management system. Please login first!");
		}
		else if(issue == 1) {
			content_body.text("Your current session has expired. To continue using the system please login again!");
		}
		else if(issue == 2) {
			content_body.text("You are already logged in! Click the button below to redirect to the content management system.");
		}
		content.append(content_title).append(content_body);
		footer.append(footer_link);
		outer_div.append(content).append(footer);
		$("body").empty().append(button).append(outer_div);
		$(".modal-trigger").leanModal({
			dismissible: false,
			opacity: 2,
			inDuration: 1000,
			outDuration: 1000
		});
		$("#template_issue_control").click();
		$(document).bind("keydown", function(event) {
			event.stopImmediatePropagation();
			return false;
		});
		$("#template_submit").click(function() {
			$(document).unbind("keydown");
			router.navigate(page, {reload: true});
		});
	};

	/*

	Purpose:
	Changes the modal content as needed and displays it.

	Parameters:
		type: 
			Referencing which modal is to be used
		issue:
			A number referencing the necessary case
		obj:
			An object obtained from a get/post request

	*/
	exports.modal = function(type, issue, obj) {
		if(type == "template") {
			if(issue == 0) {
				$("#template_title").text("Email Issue");
				$("#template_body").text("There was an issue parsing the email you provided. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 1) {
				$("#template_title").text("Registration Issue");
				$("#template_body").text("The email you provided does not exist in the database. Please provide another email!");
				$("#template_issue_control").click();
			}
			else if(issue == 2) {
				$("#template_title").text("Password Issue");
				$("#template_body").text("The password must be at least eight characters long while containing at least one number, one lowercase letter, and one uppercase letter. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 3) {
				$("#template_title").text("Database Issue");
				$("#template_body").text("There was a problem connecting to the database!");
				$("#template_issue_control").click();
			}
			else if(issue == 4) {
				$("#template_title").text("Email Issue");
				$("#template_body").text("The email you provided does not exist in the database. Please provide another email!");
				$("#template_issue_control").click();
			}
			else if(issue == 5) {
				$("#template_title").text("Password Issue");
				$("#template_body").text("The password you provided does not match the one in the database. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 6) {
				var statement = "By continuing you are agreeing to manualmath's use of cookies to store session information.";
				$("#template_title").text("Login Confirmation").css("text-align", "center");
				$("#template_body").text(statement);
				$("#template_submit").text("Continue");
				$("#template_modal_footer").append($("<a>").attr("id", "template_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
				$("#template_issue_control").click();
			}
			else if(issue == 7) {
				$("#template_title").text("Registration Issue");
				$("#template_body").text("The email you provided already exists in the database. Please provide another email!");
				$("#template_issue_control").click();
			}
			else if(issue == 8) {
				$("#template_title").text("Password Issue");
				$("#template_body").text("The passwords you provided did not match. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 9) {
				$("#template_title").text("Name Issue");
				$("#template_body").text("The first name cannot be left empty. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 10) {
				$("#template_title").text("Name Issue");
				$("#template_body").text("The last name cannot be left empty. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 11) {
				$("#template_title").text("Security Question Issue");
				$("#template_body").text("The answer to the chosen security question cannot be left empty. Please try again!");
				$("#template_issue_control").click();
			}
			else if(issue == 12) {
				$("#template_title").text("Contributor Submission Issue");
				$("#template_body").text("There was an issue processing the submission to the database!");
				$("#template_issue_control").click();
			}
			else if(issue == 13) {
				var statement = "Thanks for submitting an application to become a " 
					+ "contributor on manualmath! The design of the content management " 
					+ "system requires a majority approval from a committee of five top " 
					+ "ranking members including the administrator to become a contributor. " 
					+ "Deliberations can take a while, but you can definitely expect a " 
					+ "response within a week.";
				$("#template_title").text("Contributor Submission").css("text-align", "center");
				$("#template_body").text(statement).append($("<br><br>")).append($("<div>")
					.text("- " + obj.first_name + " " + obj.last_name).css("text-align", "right"));
				$("#template_issue_control").click();
			}
			else if(issue == 14) {
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
			}
			else if(issue == 15) {
				$("#template_title").text("Password Changed");
				$("#template_body").text("You may now login with the new password!");
				$("#template_exit").remove();
				$("#template_issue_control").click();
			}
			else if(issue == 16) {
				$("#template_title").text("Password Issue");
				$("#template_body").text("The password provided does not match the one in the database. Please try again!");
				$("#template_issue_control").click();
			}
		}
		else if(type == "status") {
			if(issue == 0) {
				var first = $("<div>").addClass("col s12");
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
			}
			else if(issue == 1) {
				$("#status_title").text("Password Recovery").css("text-align", "left");
				$("#status_body").text("You provided the wrong answer to the security question!");
				$("#status_issue_control").click();
			}
		}
	};

	/*

	Purpose:
	Validates a given email.

	Parameters:
		email: 
			A user's email

	*/
	exports.validate = function(email) {
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	};

	/*

	Purpose:
	Compares two objects based on their order property.

	Parameters:
		lhs: 
			The left hand side object
		rhs: 
			The right hand side object

	*/
	exports.compare_object_order = function(lhs, rhs) { return lhs.order < rhs.order ? -1 : 1; };

	/*

	Purpose:
	Handles the API calls.

	Parameters:
		arguments: 
			The API calls as a list

	*/
	exports.get_all = function() {
		var urls = Array.prototype.slice.call(arguments),
			promises = urls.map(function(url) { return $.get(url); }),
			def = $.Deferred();
		$.when.apply($, promises).done(function() {
			var responses = Array.prototype.slice.call(arguments);
			def.resolve.apply(def, responses.map(function(res) { return res[0]; }));
		});
		return def.promise();
	};

	/*

	Purpose:
	Creates the necessary association of all the subjects, topics, sections, and examples.

	Parameters:
		subjects: 
			An array of all the subjects
		topics: 
			An array of all the topics
		sections:
			An array of all the sections
		examples:
			An array of all the examples

	*/
	exports.organize = function(subjects, topics, sections, examples) {
		sections.forEach(function(section) {
			section.examples = [];
			examples.forEach(function(example) {
				if(section.section_id == example.section_id) {
					section.examples.push(example);
				}
			});
		});
		topics.forEach(function(topic) {
			topic.sections = [];
			sections.forEach(function(section) {
				if(topic.tid == section.tid) {
					topic.sections.push(section);
				}
			});
		});
		subjects.forEach(function(subject) {
			subject.topics = [];
			topics.forEach(function(topic) {
				if(subject.sid == topic.sid) {
					subject.topics.push(topic);
				}
			});
		});
	};

	/*

	Purpose:
	Once all of subjects, topics, sections, and examples are associated this function
	will change the order within the arrays based on the order property from the database.

	Parameters:
		subjects: 
			An array of all the subjects

	*/
	exports.sort_subjects = function(subjects) {
		subjects.forEach(function(subject) {
			subject.topics.sort(exports.compare_object_order);
			subject.topics.forEach(function(topic) {
				topic.sections.sort(exports.compare_object_order);
				topic.sections.forEach(function(section) {
					section.examples.sort(exports.compare_object_order);
				});
			});
		});
	};

	/*

	Purpose:
	Converts rgb/rgba colors codes to hex.

	Parameters:
		orig: 
			The rgb/rgba color code

	*/
	exports.rgba_to_hex = function(orig) {
		var rgb = orig.replace(/\s/g,"").match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" +
		  	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
	};

	/*

	Purpose:
	Takes away the pointer events associated to the logo link on the about page.

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.handle_logo_link = function(page) { page == "about" ? $("#logo").css("pointer-events", "none") : $("#logo").css("pointer-events", ""); };

	/*

	Purpose:
	Handles the coloring of the li tags on the example_side_nav.

	*/
	exports.handle_li_coloring = function() {
		$("#nav-mobile li").each(function() {
			if($(this).hasClass("active")) {
				$(this).css("background-color", "#4693ec");
				$(this).find("a").css("color", "white");
			}
			else {
				if($(this).css("background-color")) {
					if(exports.rgba_to_hex($(this).css("background-color")) == "#4693ec") {
						window.innerWidth < 992 ? $(this).css("background-color", "white") : $(this).css("background-color", "");
						$(this).find("a").css("color", "#444");
					}
				}
			}
		});
	};

	/*

	Purpose:
	Returns the screen width.

	*/
	exports.width_func = function() {
		return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	}

	/*

	Purpose:
	Handles the side nav for different screens.

	*/
	exports.handle_side_nav = function() {
		var width = 0,
			screen_width = exports.width_func();
		if(screen_width >= 992) { width = 350; }
		else if(screen_width < 992 && screen_width > 400) { width = screen_width * .75; }
		else { width = screen_width * .72; }
		$(".button-collapse").sideNav({
			"menuWidth": width,
			"closeOnClick": true
		});
		if(screen_width < 992) { $(".button-collapse").sideNav("hide"); }
	};

	/*

	Purpose:
	Moves the logo all the way to the right on a mobile view.

	*/
	exports.handle_logo = function() {
		if(exports.width_func() < 992) {
			if(exports.width_func() >= 750) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 183,
					"display": "inline-block"
				});
			}
			else if(exports.width_func() < 750 && exports.width_func() >= 550) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 165,
					"display": "inline-block"
				});
			}
			else if(exports.width_func() < 550 && exports.width_func() >= 400) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 164,
					"display": "inline-block"
				});
			}
			else {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 150,
					"display": "inline-block"
				});
			}
		}
	};

	/*

	Purpose:
	Handles the button functionality for "Show Proof" and "Show Solution".

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.handle_button = function() {
		$("#latex .show_solution").click(function(defaultevent) {
			defaultevent.preventDefault();
			$(this).find(".solution_display").text() == "+" ? $(this).parent().find(".cont_div").fadeIn(300) : $(this).parent().find(".cont_div").fadeOut(300);
			$(this).find(".solution_display").text() == "+" ? $(this).find(".solution_display").text("-") : $(this).find(".solution_display").text("+");
		});
	};

	/*

	Purpose:
	Handles the mobile logo placement on an orientation change.

	*/
	exports.handle_orientation = function(page, navs, param1, param2) {
		$(window).on("deviceorientation", function(event) { 
			// exports.handle_logo();
		});
	};

	/*

	Purpose:
	Handles the generation of breadcrumbs.

	Parameters:
		page: 
			The name of the page currently set
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section

	*/
	exports.handle_breadcrumbs = function(page, obj, subject, topic, section, example) {
		if(exports.width_func() < 992) {
			if(page == "subject") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
			}
			else if(page == "topic") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(topic.clean_name));
			}
			else if(page == "section") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name)));
			}
			else if(page == "example") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(example.clean_name)));
			}
			$(".breadcrumb:not(:first)").toggleClass("changed");
		}
	};

	/*

	Purpose:
	Makes sure that the breadcrumbs on the topic page allign correctly.

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.mobile_breadcrumbs = function(page) {
		if(page == "topic") {
			$(".breadcrumb.changed").css("display", "inline-flex");
		}
	};

	/*

	Purpose:
	Removes the extra spacing created by an invisible MathJax span.
	
	*/
	exports.hide_mathjax_span = function() {
		$("#latex .MathJax").first().css("display", "none");
	};

	/*

	Purpose:
	Handles the generation of breadcrumbs for the desktop title.

	Parameters:
		page: 
			The name of the page currently set
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section

	*/
	exports.handle_desktop_title = function(page, subject, topic, section) {
		if(exports.width_func() >= 992) {
			$("#desktop_title").empty();
			if(page == "about") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text("About"));
			}
			else if(page == "subject") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
			}
			else if(page == "topic") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
			}
			else if(page == "section") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(section.clean_name));
			}
			else { console.log("No such page exists: " + page); }
			$(".breadcrumb:not(:first)").toggleClass("changed");
		}
	};

	/*

	Purpose:
	Determines whether the current device is mobile or not.

	*/
	exports.is_mobile = function() {
	    if(
	    	/Mobi/.test(navigator.userAgent) ||
			navigator.userAgent.match(/Phone/i) ||
			navigator.userAgent.match(/DROID/i) ||
			navigator.userAgent.match(/Android/i) ||
		    navigator.userAgent.match(/webOS/i) ||
		    navigator.userAgent.match(/iPhone/i) ||
		    navigator.userAgent.match(/iPod/i) ||
		    navigator.userAgent.match(/BlackBerry/) || 
		    navigator.userAgent.match(/Windows Phone/i) || 
		    navigator.userAgent.match(/ZuneWP7/i) || 
		    navigator.userAgent.match(/IEMobile/i) ||
		    navigator.userAgent.match(/Tablet/i) ||
		    navigator.userAgent.match(/iPad/i) ||
		    navigator.userAgent.match(/Kindle/i) ||
		    navigator.userAgent.match(/Playbook/i) ||
		    navigator.userAgent.match(/Nexus/i) ||
		    navigator.userAgent.match(/Xoom/i) ||
		    navigator.userAgent.match(/SM-N900T/i) ||
		    navigator.userAgent.match(/GT-N7100/i) ||
		    navigator.userAgent.match(/SAMSUNG-SGH-I717/i) ||
		    navigator.userAgent.match(/SM-T330NU/i)
		) { return true; }
	    else { return false; }
	};

	return exports;
});