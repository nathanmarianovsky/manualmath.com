define(["dist/functions-min"], function(functions) {
	var exports = {};

	/*

	Purpose:
	Adds the neccesary "padding" at the bottom of the menu.

	*/
	exports.extra = function() {
		$(".side-nav").append($("<li>").addClass("no-padding extra_li"));
		// $(".side-nav").append($("<li>").addClass("no-padding extra_li"));
		// if(window.innerWidth < 992) {
			// $(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
			// $(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
		// }
		// if(window.innerWidth < 600) {
			// $(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
		// }
		$(".extra_li").append($("<a>").text(""));
	};

	/*

	Purpose:
	Empties the sides navigation and adds the side navigation containing
	all of the subjects.

	Parameters:
		subjects: 
			An array of all the subjects

	*/
	exports.subject_side_nav = function(subjects, cms, min) {
		var sidenav = $(".side-nav"),
			results = [];
		sidenav.empty();
		if(cms == 1) {
			var change_li = $("<li>").addClass("no-padding").attr("id", "subjectsli_change"),
				change_link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjects_change").text("Add/Remove");
			change_link.append($("<i>").addClass("material-icons right").text("library_add"));
			sidenav.append(change_li.append(change_link));
		}
		results = subjects.map(function(subject) {
			if(cms == 0 && subject.side_approval !== null && subject.side_approval.split(",").length >= min) {
				var subjectli = $("<li>").addClass("no-padding").attr("id", "subjects_li" + subject.sid),
					link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjects_" + subject.sid).text(subject.clean_name);
					link.append($("<i>").addClass("material-icons right").text("arrow_forward"));
					return subjectli.append(link);
			}
			else if(cms == 1) {
				var subjectli = $("<li>").addClass("no-padding").attr("id", "subjects_li" + subject.sid + "_cms"),
					link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjects_" + subject.sid + "_cms").text(subject.clean_name);
					link.append($("<i>").addClass("material-icons right").text("arrow_forward"));
					return subjectli.append(link);
			}
		});
		results.forEach(function(subject) { functions.is_mobile() ? sidenav.append(subject, $("<li>").addClass("divider")) : sidenav.append(subject); });
		exports.extra();
	};

	/*

	Purpose:
	Empties the sides navigation and adds the side navigation containing
	all of the topics associated to a single subject.

	Parameters:
		subject: 
			An object representing the current subject

	*/
	exports.topic_side_nav = function(subject) {
		var	sidenav = $(".side-nav"),
			subjectLi = $("<li>").addClass("no-padding").attr("id", "subject_li" + subject.sid),
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjectnav").text("All Subjects");
		sidenav.empty();
		link.append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
		subjectLi.append(link);
		sidenav.append(subjectLi);
		sidenav.append($("<li>").addClass("divider"));
		var results = subject.topics.map(function(topic) {
			var topicli = $("<li>").addClass("no-padding").attr("id", "topics_li" + topic.tid);
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "topics_" + topic.tid).text(topic.clean_name);
			link.append($("<i>").addClass("material-icons right").text("arrow_forward"));
			return topicli.append(link);
		});
		results.forEach(function(topic) { functions.is_mobile() ? sidenav.append(topic, $("<li>").addClass("divider")) : sidenav.append(topic); });
		exports.extra();
	};

	/*

	Purpose:
	Empties the sides navigation and adds the side navigation containing
	all of the sections associated to a single topic.

	Parameters:
		subject: 
			An object representing the current subject
		topic:
			An object representing the current topic

	*/
	exports.section_side_nav = function(topic, subject) {
		var sidenav = $(".side-nav"),
			topicli = $("<li>").addClass("no-padding").attr("id", "topic_li" + topic.tid),
			topicnav = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "topicnav_" + topic.tid).text(subject.clean_name);
		sidenav.empty();
		topicnav.append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
		topicli.append(topicnav);
		sidenav.append(topicli, $("<li>").addClass("divider"));
		var results = topic.sections.map(function(section) {
			var sectionli = $("<li>").addClass("no-padding").attr("id", "sections_li" + section.section_id),
				link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "sections_" + section.section_id).text(section.clean_name);
			link.append($("<i>").addClass("material-icons right").text("arrow_forward"));
			return sectionli.append(link);
		});
		results.forEach(function(section) { functions.is_mobile() ? sidenav.append(section, $("<li>").addClass("divider")) : sidenav.append(section); })
		exports.extra();
	};

	/*

	Purpose:
	Empties the sides navigation and adds the side navigation containing
	all of the examples and notes associated to a single section.

	Parameters:
		topic:
			An object representing the current topic
		section: 
			An object representing the current section

	*/
	exports.example_side_nav = function(section, topic) {
		var sidenav = $(".side-nav"),
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionname_" + section.section_id).text("Notes"),
			sectionli = $("<li>").addClass("no-padding").attr("id", "section_li" + section.section_id),
			sectionnav = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionnav_" + section.section_id).text(topic.clean_name),
			sectionname = $("<li>").addClass("no-padding").attr("id", "section_name" + section.section_id);
		sidenav.empty();
		sectionnav.append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
		sectionli.append(sectionnav);
		sidenav.append(sectionli, $("<li>").addClass("divider"));
		sectionname.append(link);
		functions.is_mobile() ? sidenav.append(sectionname, $("<li>").addClass("divider")) : sidenav.append(sectionname);
		var results = section.examples.map(function(example) {
			var exampleli = $("<li>").addClass("no-padding").attr("id", "examples_li" + example.eid);
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "examples_" + example.eid).text(example.clean_name);
			return exampleli.append(link);
		});
		results.forEach(function(example) { functions.is_mobile() ? sidenav.append(example, $("<li>").addClass("divider")) : sidenav.append(example); })
		exports.extra();
	};

	/*

	Purpose:
	Driver function to handle loading all side navs given the correct parameters.

	Parameters:
		param1:
			An object representing "subjects", "subject", "topic", or "section"
		param2: 
			An object representing "subject" or "topic"

	*/
	exports.driver = function(page, cms, param1, param2, callback) {
		$.get("/api/cms/contributors").done(function(num) {
			const validation = Math.ceil(Math.log(parseInt(num)));
			if(page == "about") { exports.subject_side_nav(param1, cms, validation); }
			else if(page == "subject") { exports.topic_side_nav(param1); }
			else {
				if(typeof param2 !== "undefined" && param2 !== null) {
					if(page == "topic") { exports.section_side_nav(param1, param2); }
					else if(page == "section") {
						$(".side-nav li").each(function() {
							if(typeof $(this).attr("id") !== typeof undefined && $(this).attr("id") !== false) {
								if($(this).attr("id").split("_")[0] == "topic") {
									exports.example_side_nav(param1, param2);
								}
							}
						});
						if($(".side-nav").is(":empty") || $(".side-nav").children().length == 1) { exports.example_side_nav(param1, param2); }
					}
				}
			}
		}).done(function() { callback(); });
	};

	return exports;
});