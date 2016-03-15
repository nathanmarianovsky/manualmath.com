define(function() {
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
		$("a").click(function(e) {
			e.preventDefault();
			if($(this).attr("href") == "about.php") {
				router.navigate("about");
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