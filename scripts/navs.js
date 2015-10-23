define(function() {
	var exports = {};

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
		var font = "12px";
		var height = "64px";
		if(window.innerWidth < "992") {
			font = "25px";
			height = "120px";
		}
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "about_li").fadeIn("slow"));
		$("#about_li").append($("<a>").addClass("collapsible-header bold").attr("id", "about").attr("href", "about.php").text("About").css({
			"line-height": height,
			"font-size": font
		}));
		$(".side-nav").append($("<li>").addClass("divider"));
		subjects.forEach(function(subject) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "subjects_li" + subject.sid).fadeIn("slow"));
			var subjects_li = $("#subjects_li" + subject.sid).append($("<a>").addClass("collapsible-header bold").attr("id", "subjects_" + subject.sid).text(subject.clean_name).css({
				"line-height": height,
				"font-size": font
			}));
			$("#subjects_" + subject.sid).append($("<i>").addClass("material-icons right").text("arrow_forward"));
			if(window.innerWidth < 992) {
				subjects_li.css("background-color", "white");
				$("#subjects_" + subject.sid + " i").css("width", "8rem");
			}
		});
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "extra_li").fadeIn("slow"));
		$("#extra_li").append($("<a>").text(""));
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
		var font = "12px";
		var height = "64px";
		if(window.innerWidth < 992) {
			font = "25px";
			height = "120px";
		}
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "subject_li" + subject.sid).fadeIn("slow"));
		var subject_li = $("#subject_li" + subject.sid).append($("<a>").addClass("collapsible-header bold").attr("id", "subjectnav").text("All Subjects").css({
			"line-height": height,
			"font-size": font
		}));
		$("#subjectnav").append($("<i>").addClass("material-icons right").text("arrow_backward"));
		if(window.innerWidth < 992) {
			subject_li.css("background-color", "white");
			$("#subjectnav i").css("width", "5rem");
		}
		$(".side-nav").append($("<li>").addClass("divider"));
		subject.topics.forEach(function(topic) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "topics_li" + topic.tid).fadeIn("slow"));
			var topics_li = $("#topics_li" + topic.tid).append($("<a>").addClass("collapsible-header bold").attr("id", "topics_" + topic.tid).text(topic.clean_name).css({
				"line-height": height,
				"font-size": font
			}));
			$("#topics_" + topic.tid).append($("<i>").addClass("material-icons right").text("arrow_forward"));
			if(window.innerWidth < 992) {
				topics_li.css("background-color", "white");
				$("#topics_" + topic.tid + " i").css("width", "8rem");
			}
		});
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "extra_li").fadeIn("slow"));
		$("#extra_li").append($("<a>").text(""));
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
		var font = "12px";
		var height = "64px";
		if(window.innerWidth < "992") {
			font = "25px";
			height = "120px";
		}
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "topic_li" + topic.tid).fadeIn("slow"));
		var topic_li = $("#topic_li" + topic.tid).append($("<a>").addClass("collapsible-header bold").attr("id", "topicnav_" + topic.tid).text(subject.clean_name).css({
			"line-height": height,
			"font-size": font
		}));
		$("#topicnav_" + topic.tid).append($("<i>").addClass("material-icons right").text("arrow_backward"));
		if(window.innerWidth < 992) {
			topic_li.css("background-color", "white");
			$("#topicnav_" + topic.tid + " i").css("width", "5rem");
		}
		$(".side-nav").append($("<li>").addClass("divider"));
		topic.sections.forEach(function(section) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "sections_li" + section.section_id).fadeIn("slow"));
			var sections_li = $("#sections_li" + section.section_id).append($("<a>").addClass("collapsible-header bold").attr("id", "sections_" + section.section_id).text(section.clean_name).css({
				"line-height": height,
				"font-size": font
			}));
			$("#sections_" + section.section_id).append($("<i>").addClass("material-icons right").text("arrow_forward"));
			if(window.innerWidth < 992) {
				sections_li.css("background-color", "white");
				$("#sections_" + section.section_id + " i").css("width", "8rem");
			}
		});
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "extra_li").fadeIn("slow"));
		$("#extra_li").append($("<a>").text(""));
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
		var font = "12px";
		var height = "64px";
		if(window.innerWidth < "992") {
			font = "25px";
			height = "120px";
		}
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_li" + section.section_id).fadeIn("slow"));
		var section_li = $("#section_li" + section.section_id).append($("<a>").addClass("collapsible-header bold").attr("id", "sectionnav_" + section.section_id).text(topic.clean_name).css({
			"line-height": height,
			"font-size": font
		}));
		$("#sectionnav_" + section.section_id).append($("<i>").addClass("material-icons right").text("arrow_backward"));
		$(".side-nav").append($("<li>").addClass("divider"));
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "section_name" + section.section_id).fadeIn("slow"));
		var section_name = $("#section_name" + section.section_id).append($("<a>").addClass("collapsible-header bold").attr("id", "sectionname_" + section.section_id).text("Notes").css({
			"line-height": height,
			"font-size": font
		}));
		if(window.innerWidth < 992) {
			section_name.css("background-color", "white");
			section_li.css("background-color", "white");
			$("#sectionnav_" + section.section_id + " i").css("width", "5rem");
		}
		section.examples.forEach(function(example) {
			$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "examples_li" + example.eid).fadeIn("slow"));
			var examples_li = $("#examples_li" + example.eid).append($("<a>").addClass("collapsible-header bold").attr("id", "examples_" + example.eid).text(example.clean_name).css({
				"line-height": height,
				"font-size": font
			}));
			if(window.innerWidth < 992) {
				examples_li.css("background-color", "white");
			}
		});
		$(".side-nav").append($("<li>").addClass("no-padding").attr("id", "extra_li").fadeIn("slow"));
		$("#extra_li").append($("<a>").text(""));
	};

	return exports;
});