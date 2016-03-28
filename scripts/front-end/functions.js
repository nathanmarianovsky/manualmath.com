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

	Note:
	If the left object has a smaller order, -1 is returned. Otherwise
	1 is returned.

	*/
	exports.compare_object_order = (lhs, rhs) => {
		return lhs.order < rhs.order ? -1 : 1;
	};

	/*

	Purpose:
	Handles the API calls.

	Parameters:
		arguments: 
			The API calls as a list

	*/
	exports.get_all = function() {
		var urls = Array.prototype.slice.call(arguments);
		var promises = urls.map(function(url) {
			return $.get(url);
		});
		var def = $.Deferred();
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
	exports.handle_logo_link = page => {
		if(page == "about") {
			$("#logo").css("pointer-events", "none");
		}
		else {
			$("#logo").css("pointer-events", "");
		}
	};

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
						if(window.innerWidth < 992) {
							$(this).css("background-color", "white");	
						}
						else {
							$(this).css("background-color", "");
						}
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
	exports.width_func = () => { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0; }

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
			menuWidth: width,
			closeOnClick: true
		});
		if(screen_width < 992) { $(".button-collapse").sideNav("hide"); }
	};

	/*

	Purpose:
	Moves the logo all the way to the right on a mobile view.

	*/
	exports.handle_logo = () => {
		var width = exports.width_func();
		$("#logo").css("left", (width/2) - ($("#mobile_title").width()/2) - 73);
	};

	/*

	Purpose:
	Handles the button functionality for "Show Proof" and "Show Solution".

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.handle_button = page => {
		if(page == "notes") {
			$("#latex .show_solution").click(function(defaultevent) {
				defaultevent.preventDefault();
				var id = $(this).attr("id").split("_")[2];
				$(this).hide();
				$("#hidden_div_" + id).show();
			});
		}
		else if(page == "examples") {
			$("#latex .show_solution").click(function(defaultevent) {
				defaultevent.preventDefault();
				$("#latex .show_solution").hide();
				$("#latex .hidden_div").show();
			});
		}
	};

	return exports;
});