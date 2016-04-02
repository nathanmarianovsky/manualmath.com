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
	exports.compare_object_order = (lhs, rhs) => { return lhs.order < rhs.order ? -1 : 1; };

	/*

	Purpose:
	Handles the API calls.

	Parameters:
		arguments: 
			The API calls as a list

	*/
	exports.get_all = function() {
		var urls = Array.prototype.slice.call(arguments),
			promises = urls.map(url => { return $.get(url); }),
			def = $.Deferred();
		$.when.apply($, promises).done(function() {
			var responses = Array.prototype.slice.call(arguments);
			def.resolve.apply(def, responses.map(res => { return res[0]; }));
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
	exports.organize = (subjects, topics, sections, examples) => {
		sections.forEach(section => {
			section.examples = [];
			examples.forEach(example => {
				if(section.section_id == example.section_id) {
					section.examples.push(example);
				}
			});
		});
		topics.forEach(topic => {
			topic.sections = [];
			sections.forEach(section => {
				if(topic.tid == section.tid) {
					topic.sections.push(section);
				}
			});
		});
		subjects.forEach(subject => {
			subject.topics = [];
			topics.forEach(topic => {
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
	exports.sort_subjects = subjects => {
		subjects.forEach(subject => {
			subject.topics.sort(exports.compare_object_order);
			subject.topics.forEach(topic => {
				topic.sections.sort(exports.compare_object_order);
				topic.sections.forEach(section => {
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
	exports.rgba_to_hex = orig => {
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
	exports.handle_logo_link = page => { page == "about" ? $("#logo").css("pointer-events", "none") : $("#logo").css("pointer-events", ""); };

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
	exports.width_func = () => {
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
	exports.handle_logo = page => {
		console.log(exports.is_mobile());
		if(exports.is_mobile()) {
			if(page == "about") {
				$("#top_content .s1").css("display", "none");
				$("#mobile_logo_title").show();
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 154,
					"display": "inline-block"
				});
			}
			else {
				$("#top_content .s1").css("display", "block");
				$("#mobile_logo_title").hide();
				$("#logo").css("display", "none");
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
	exports.handle_button = page => {
		// if(page == "notes") {
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
		// }
		// else if(page == "examples") {
		// 	$("#latex .show_solution").click(function(defaultevent) {
		// 		defaultevent.preventDefault();
		// 		$("#latex .show_solution").hide();
		// 		$("#latex .hidden_div").show();
		// 	});
		// }
	};

	/*

	Purpose:
	Handles the mobile logo placement on an orientation change.

	*/
	exports.handle_orientation = (page, navs, param1, param2) => {
		$(window).on("deviceorientation", event => { 
			// exports.handle_logo();
		});
	};

	/*

	Purpose:
	Handles the side nav vertical placement for mobile views due to the presence of breadcrumbs.

	*/
	exports.handle_scroll = () => {
		// $(document).scroll(() => {
		// 	if(exports.width_func() < 992) {
		// 		if($(this).scrollTop() > $('#second_top_nav').position().top - 54) {
		// 			if(exports.width_func() >= 750) { $("#nav-mobile").css("top", "64px"); }
		// 			else { $("#nav-mobile").css("top", "56px");}
		// 		}
		// 		else {
		//     		if(exports.width_func() >= 750) { $("#nav-mobile").css("top", "119px"); }
		// 			else { $("#nav-mobile").css("top", "112px"); }
		// 		}
		// 	}
		// });
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
	exports.handle_breadcrumbs = (page, subject, topic, section) => {
		if(exports.width_func() < 992) {
			$("#top_content .s1").empty();
			$("#top_content").show();
			// exports.width_func() >= 700 ? $("#nav-mobile").css("top", "119px") : $("#nav-mobile").css("top", "112px");
			if(page == "about") {
				// $("#top_content").hide();
				// exports.width_func() >= 700 ? $("#nav-mobile").css("top", "64px") : $("#nav-mobile").css("top", "56px");
			}
			else if(page == "subject") {
				$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
			}
			else if(page == "topic") {
				$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
			}
			else if(page == "section") {
				if(exports.width_func() >= 550) {
					$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				}
				$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
				$("#top_content .s1").append($("<a>").addClass("breadcrumb").text(section.clean_name));
			}
			else { console.log("No such page exists: " + page); }
			$(".breadcrumb:not(:first)").toggleClass("changed");
		}
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
	exports.handle_desktop_title = (page, subject, topic, section) => {
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
	exports.is_mobile = () => {
		if(/Mobi/.test(navigator.userAgent)) {
		    // mobile!
		    console.log("first");
		    if(navigator.userAgent.match(/iPad/i) != null) {
		    	// console.log("ipad -> not mobile");
		    	console.log("second");
		    	return true;
		    }
		    else {
		    	// console.log("mobile");
		    	console.log("third");
		    	return true;
			}
		}
	};

	return exports;
});