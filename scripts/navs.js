define(function() {
	var exports = {};

	/*

	Purpose:
	Adds the neccesary "padding" at the bottom of the menu.

	*/
	exports.extra = function() {
		$(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
		if(window.innerWidth < 992) {
			$(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
		}
		if(window.innerWidth < 600) {
			$(".side-nav").append($("<li>").addClass("no-padding extra_li").fadeIn("slow"));
		}
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
	exports.subject_side_nav = function(subjects) {
		$(".side-nav").empty();
		subjects.forEach(function(subject) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "subjects_li" + subject.sid).fadeIn("slow"));
			$("#subjects_li" + subject.sid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjects_" + subject.sid).text(subject.clean_name));
			$("#subjects_" + subject.sid).append($("<i>").addClass("material-icons right").text("arrow_forward"));
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
	exports.topic_side_nav = function(subject) {
		$(".side-nav").empty();
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "subject_li" + subject.sid).fadeIn("slow"));
		$("#subject_li" + subject.sid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "subjectnav").text("All Subjects"));
		$("#subjectnav").append($("<i>").addClass("material-icons right").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		subject.topics.forEach(function(topic) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "topics_li" + topic.tid).fadeIn("slow"));
			$("#topics_li" + topic.tid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "topics_" + topic.tid).text(topic.clean_name));
			$("#topics_" + topic.tid).append($("<i>").addClass("material-icons right").text("arrow_forward"));
		});
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
		$(".side-nav").empty();
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "topic_li" + topic.tid).fadeIn("slow"));
		$("#topic_li" + topic.tid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "topicnav_" + topic.tid).text(subject.clean_name));
		$("#topicnav_" + topic.tid).append($("<i>").addClass("material-icons right").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		topic.sections.forEach(function(section) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "sections_li" + section.section_id).fadeIn("slow"));
			var sections_li = $("#sections_li" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sections_" + section.section_id).text(section.clean_name));
			$("#sections_" + section.section_id).append($("<i>").addClass("material-icons right").text("arrow_forward"));
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
	exports.example_side_nav = function(section, topic) {
		$(".side-nav").empty();
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_li" + section.section_id).fadeIn("slow"));
		$("#section_li" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionnav_" + section.section_id).text(topic.clean_name));
		$("#sectionnav_" + section.section_id).append($("<i>").addClass("material-icons right").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_name" + section.section_id).fadeIn("slow"));
		$("#section_name" + section.section_id).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "sectionname_" + section.section_id).text("Notes"));
		section.examples.forEach(function(example) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "examples_li" + example.eid).fadeIn("slow"));
			$("#examples_li" + example.eid).append($("<a>").addClass("collapsible-header bold menu_items").attr("id", "examples_" + example.eid).text(example.clean_name));
		});
		exports.extra();
	};

	return exports;
});