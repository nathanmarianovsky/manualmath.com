define(["app/functions"], function(functions) {
	var exports = {};

	/*

	Purpose:
	Adds the neccesary "padding" at the bottom of the menu.

	*/
	exports.extra = () => {
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
	exports.subject_side_nav = subjects => {
		$(".side-nav").empty();
		subjects.forEach(subject => {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "subjects_li" + subject.sid));
			$("#subjects_li" + subject.sid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjects_" + subject.sid).text(subject.clean_name));
			$("#subjects_" + subject.sid).append($("<i>").addClass("material-icons right").text("arrow_forward"));
			if(functions.is_mobile()) { $(".side-nav").append($("<li>").addClass("divider")); }
		});
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
	exports.topic_side_nav = subject => {
		var subjectLi = $("<li>").addClass("no-padding").attr("id", "subject_li" + subject.sid),
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjectnav").text("All Subjects"),
			arrow = $("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"),
			sidenav = $(".side-nav");
		
		sidenav.empty();
		sidenav.append(subjectLi);
		subjectLi.append(link);
		link.append(arrow);
		sidenav.append($("<li>").addClass("divider"));

		var results = subject.topics.map(topic => {
			var topicli = $("<li>").addClass("no-padding").attr("id", "topics_li" + topic.tid)
			link = $("<a>").addClass("collapsible-header bold menu_items").attr("id", "topics_" + topic.tid).text(topic.clean_name);
			link.append($("<i>").addClass("material-icons right").text("arrow_forward"));
			return topicli.append(link);
		});

		results.forEach(topic => { functions.is_mobile() ? sidenav.append(topic, $("<li>").addClass("divider")) : sidenav.append(topic); });

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
	exports.section_side_nav = (topic, subject) => {
		$(".side-nav").empty();

		if(functions.is_mobile()) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "about_li"));
			$("#about_li").append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "about").text("About"));
			$("#about").append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
			$(".side-nav").append($("<li>").addClass("divider"));
		}

		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "topic_li" + topic.tid));
		$("#topic_li" + topic.tid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "topicnav_" + topic.tid).text(subject.clean_name));
		$("#topicnav_" + topic.tid).append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		topic.sections.forEach(section => {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "sections_li" + section.section_id));
			var sections_li = $("#sections_li" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sections_" + section.section_id).text(section.clean_name));
			$("#sections_" + section.section_id).append($("<i>").addClass("material-icons right").text("arrow_forward"));
			if(functions.is_mobile()) { $(".side-nav").append($("<li>").addClass("divider")); }
		});
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
	exports.example_side_nav = (section, topic) => {
		$(".side-nav").empty();
		
		if(functions.is_mobile()) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "about_li"));
			$("#about_li").append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "about").text("About"));
			$("#about").append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
			$(".side-nav").append($("<li>").addClass("divider"));
		}

		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_li" + section.section_id));
		$("#section_li" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionnav_" + section.section_id).text(topic.clean_name));
		$("#sectionnav_" + section.section_id).append($("<i>").addClass("material-icons left").css("padding-right", "30px").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_name" + section.section_id));
		$("#section_name" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionname_" + section.section_id).text("Notes"));
		if(functions.is_mobile()) { $(".side-nav").append($("<li>").addClass("divider")); }
		section.examples.forEach(example => {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "examples_li" + example.eid));
			$("#examples_li" + example.eid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "examples_" + example.eid).text(example.clean_name));
			if(functions.is_mobile()) { $(".side-nav").append($("<li>").addClass("divider")); }
		});
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
	exports.driver = (page, param1, param2) => {
		if(page == "about") { exports.subject_side_nav(param1); }
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
					if($(".side-nav").is(":empty")) { exports.example_side_nav(param1, param2); }
				}
			}
		}
	};

	return exports;
});