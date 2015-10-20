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
	exports.compare_object_order = function(lhs, rhs) {
		if(lhs.order < rhs.order) { return -1; }
		else { return 1; }
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
	exports.organize = function(subjects, topics, sections, examples) {
		for(i = 0; i < sections.length; i++) {
			sections[i].examples = [];
			for(j = 0; j < examples.length; j++) {
				if(sections[i].section_id == examples[j].section_id) {
					sections[i].examples.push(examples[j]);
				}
			}
		}
		for(i = 0; i < topics.length; i++) {
			topics[i].sections = [];
			for(j = 0; j < sections.length; j++) {
				if(topics[i].tid == sections[j].tid) {
					topics[i].sections.push(sections[j]);
				}
			}
		}
		for(i = 0; i < subjects.length; i++) {
			subjects[i].topics = [];
			for(j = 0; j < topics.length; j++) {
				if(subjects[i].sid == topics[j].sid) {
					subjects[i].topics.push(topics[j]);
				}
			}
		}
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
		for(i = 0; i < subjects.length; i++) {
			subjects[i].topics.sort(exports.compare_object_order);
			for(j = 0; j < subjects[i].topics.length; j++) {
				subjects[i].topics[j].sections.sort(exports.compare_object_order);
				for(k = 0; k < subjects[i].topics[j].sections.length; k++) {
					subjects[i].topics[j].sections[k].examples.sort(exports.compare_object_order);
				}
			}
		}
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
	Handles the coloring of the li tags on the example_side_nav.

	*/
	exports.handle_li_coloring = function() {
		$("li").each(function() {
			if($(this).hasClass("active")) {
				$(this).css("background-color", "#4693ec");
				$(this).find("a").css("color", "white");
			}
			else {
				if($(this).css("background-color")) {
					if(exports.rgba_to_hex($(this).css("background-color")) == "#4693ec") {
						$(this).css("background-color", "");
						$(this).find("a").css("color", "#444");
					}
				}
			}
		});
	};

	/*

	Purpose:
	Handles the side nav for different screens.

	*/
	exports.handle_side_nav = function() {
		var width = 0;
		if(window.innerWidth > 992) { width = 350; }
		else { width = window.innerWidth * .75; }
		$(".button-collapse").sideNav({
			menuWidth: width,
			closeOnClick: true
		});
		if(window.innerWidth < 992) {
			$(".button-collapse").sideNav("hide");
		}
		$("#hambuger_button").click(function(e) {
			e.preventDefault();
			$(".button-collapse").sideNav("show");
		});
	};

	return exports;
});