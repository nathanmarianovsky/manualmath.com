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
			var link = $(this);
			e.preventDefault();
			if(link.attr("href") == "about.php") {
				router.navigate("about");
			}
			else {
				var id = link.attr("id");
				if(id) {
					var holder = id.split("_");
					var id_string = holder[0];
					if(holder.length > 1) {
						var id_num = holder[1];
					}
					if(id_string == "subjects" || id_string == "aboutsubject") {
						subjects.forEach(function(subject) {
							if(subject.sid == id_num) {
								router.navigate("subject", {sname: subject.sname});
							}
						});
					}
					else if(id_string == "notation") {
						subjects.forEach(function(subject) {
							if(subject.sid == id_num) {
								router.navigate("subject.notation", {sname: subject.sname});
							}
						});
					}
					else if(id_string == "subjectnav") {
						router.navigate("about");
					}
					else if(id_string == "topics" || id_string == "abouttopic") {
						topics.forEach(function(topic) {
							if(topic.tid == id_num) {
								subjects.forEach(function(subject) {
									if(subject.sid == topic.sid) {
										router.navigate("subject.topic", {sname: subject.sname, tname: topic.tname});
									}
								});
							}
						});
					}
					else if(id_string == "topicnav") {
						topics.forEach(function(topic) {
							if(topic.tid == id_num) {
								subjects.forEach(function(subject) {
									if(subject.sid == topic.sid) {
										router.navigate("subject", {sname: subject.sname});
									}
								});
							}
						});
					}
					else if(id_string == "sections") {
						sections.forEach(function(section) {
							if(section.section_id == id_num) {
								topics.forEach(function(topic) {
									if(topic.tid == section.tid) {
										subjects.forEach(function(subject) {
											if(subject.sid == topic.sid) {
												router.navigate("subject.topic.section", {sname: subject.sname, tname: topic.tname, section_name: section.section_name});
											}
										});
									}
								});
							}
						});
					}
					else if(id_string == "sectionnav") {
						sections.forEach(function(section) {
							if(section.section_id == id_num) {
								topics.forEach(function(topic) {
									if(topic.tid == section.tid) {
										subjects.forEach(function(subject) {
											if(subject.sid == topic.sid) {
												router.navigate("subject.topic", {sname: subject.sname, tname: topic.tname});
											}
										});
									}
								});
							}
						});
					}
					else if(id_string == "sectionname") {
						sections.forEach(function(section) {
							if(section.section_id == id_num) {
								topics.forEach(function(topic) {
									if(topic.tid == section.tid) {
										subjects.forEach(function(subject) {
											if(subject.sid == topic.sid) {
												router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: section.section_name});
											}
										});
									}
								});
							}
						});
					}
					else if(id_string == "examples") {
						examples.forEach(function(example) {
							if(example.eid == id_num) {
								sections.forEach(function(section) {
									if(section.section_id == example.section_id) {
										topics.forEach(function(topic) {
											if(topic.tid == section.tid) {
												subjects.forEach(function(subject) {
													if(subject.sid == topic.sid) {
														router.navigate("subject.topic.section.current_page", {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: example.ename});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				}
			}
		});
	};

	return exports;
});