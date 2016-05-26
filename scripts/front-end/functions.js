define(function() {
	var exports = {};

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
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
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
	exports.handle_button = function(page) {
		$("#latex .show_solution").click(function(defaultevent) {
			defaultevent.preventDefault();
			if(page == "notes") {
				var id = $(this).attr("id").split("_")[2];
				$(this).val() == "Show Proof" ? $("#hidden_div_" + id).show() : $("#hidden_div_" + id).hide();
				$(this).val() == "Show Proof" ? $(this).val("Hide Proof") : $(this).val("Show Proof");
			}
			else { 
				$(this).val() == "Show Solution" ? $(".hidden_div").show() : $(".hidden_div").hide();
				$(this).val() == "Show Solution" ? $(this).val("Hide Solution") : $(this).val("Show Solution");
			}
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
			if(page == "about" || page == "subject" || page == "topic") {
				if(obj.text() == "About") {
					obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
					if(page == "subject") {
						$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
					}
					else if(page == "topic") {
						$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
						$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(topic.clean_name));
					}
					else { console.log("No such page exists with the corresponding object"); }
				}
			}
			else if(page == "example") {
				if(obj.hasClass("latex_section")) {
					obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name).css({
						"position": "absolute",
						"display": "inline"
					})));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name).css({
						"position": "absolute",
						"display": "inline"
					})));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(example.clean_name).css({
						"position": "absolute",
						"display": "inline"
					})));
				}
				else { console.log("The object does not have the necessary class!"); }
			}
			else {
				if(obj.hasClass("latex_section")) {
					obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name).css({
						"position": "absolute",
						"display": "inline"
					})));
					$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name).css({
						"position": "absolute",
						"display": "inline"
					})));
				}
				else { console.log("The object does not have the necessary class!"); }
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