define(function() {
	var exports = {};

	exports.compare_object_order = function(lhs, rhs) {
		if(lhs.order < rhs.order) { return -1; }
		else { return 1; }
	};

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

	exports.default_load = function() {
		if($('main').is(':empty')) {
			$('#page_title').text('Home');
			$('title').text('Home');
			$('main').load('/client/home.php');
		}
	}

	exports.subject_side_nav = function(subjects) {
		$('.side-nav').empty();
		subjects.forEach(function(subject) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'subjects_li' + subject.sid).fadeIn('slow'));
			$('#subjects_li' + subject.sid).append($('<a>').addClass('collapsible-header bold').attr('id', 'subjects_' + subject.sid).text(subject.clean_name).css({
				'line-height': '64px',
				'font-size': '10px'
			}));
			$('#subjects_' + subject.sid).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
	};

	exports.topic_side_nav = function(subject) {
		$('.side-nav').empty();
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'subject_li' + subject.sid).fadeIn('slow'));
		$('#subject_li' + subject.sid).append($('<a>').addClass('collapsible-header bold').attr('id', 'subjectnav').text('All Subjects').css({
			'line-height': '64px',
			'font-size': '12px'
		}));
		$('#subjectnav').append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		subject.topics.forEach(function(topic) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'topics_li' + topic.tid).fadeIn('slow'));
			$('#topics_li' + topic.tid).append($('<a>').addClass('collapsible-header bold').attr('id', 'topics_' + topic.tid).text(topic.clean_name).css({
				'line-height': '64px',
				'font-size': '10px'
			}));
			$('#topics_' + topic.tid).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
	}

	exports.section_side_nav = function(topic, subject) {
		$('.side-nav').empty();
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'topic_li' + topic.tid).fadeIn('slow'));
		$('#topic_li' + topic.tid).append($('<a>').addClass('collapsible-header bold').attr('id', 'topicnav_' + topic.tid).text(subject.clean_name).css({
			'line-height': '64px',
			'font-size': '12px'
		}));
		$('#topicnav_' + topic.tid).append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		topic.sections.forEach(function(section) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'sections_li' + section.section_id).fadeIn('slow'));
			$('#sections_li' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sections_' + section.section_id).text(section.clean_name).css({
				'line-height': '64px',
				'font-size': '10px'
			}));
			$('#sections_' + section.section_id).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
	}

	exports.example_side_nav = function(section, topic) {
		$('.side-nav').empty();
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'section_li' + section.section_id).fadeIn('slow'));
		$('#section_li' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sectionnav_' + section.section_id).text(topic.clean_name).css({
			'line-height': '64px',
			'font-size': '12px'
		}));
		$('#sectionnav_' + section.section_id).append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'section_name' + section.section_id).fadeIn('slow'));
		$('#section_name' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sectionname_' + section.section_id).text('Notes').css({
			'line-height': '64px',
			'font-size': '12px'
		}));
		section.examples.forEach(function(example) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'examples_li' + example.eid).fadeIn('slow'));
			$('#examples_li' + example.eid).append($('<a>').addClass('collapsible-header bold').attr('id', 'examples_' + example.eid).text(example.clean_name).css({
				'line-height': '64px',
				'font-size': '10px'
			}));
		});
	}

	exports.handle_links = function(router, subjects, topics, sections, examples) {
		$('a').click(function(e) {
			var link = $(this);
			e.preventDefault();
			if(link.attr('href') == 'home.php') {
				router.navigate('home');
			}
			else {
				var id = link.attr('id');
				var holder = id.split('_');
				var id_string = holder[0];
				if(holder.length > 1) {
					var id_num = holder[1];
				}
				if(id_string == 'subjects') {
					subjects.forEach(function(subject) {
						if(subject.sid == id_num) {
							router.navigate('subject', {sname: subject.sname});
						}
					});
				}
				else if(id_string == 'subjectnav') {
					router.navigate('all');
				}
				else if(id_string == 'topics') {
					topics.forEach(function(topic) {
						if(topic.tid == id_num) {
							subjects.forEach(function(subject) {
								if(subject.sid == topic.sid) {
									router.navigate('subject.topic', {sname: subject.sname, tname: topic.tname});
								}
							});
						}
					});
				}
				else if(id_string == 'topicnav') {
					topics.forEach(function(topic) {
						if(topic.tid == id_num) {
							subjects.forEach(function(subject) {
								if(subject.sid == topic.sid) {
									router.navigate('subject', {sname: subject.sname});
								}
							});
						}
					});
				}
				else if(id_string == 'sections') {
					sections.forEach(function(section) {
						if(section.section_id == id_num) {
							topics.forEach(function(topic) {
								if(topic.tid == section.tid) {
									subjects.forEach(function(subject) {
										if(subject.sid == topic.sid) {
											router.navigate('subject.topic.section', {sname: subject.sname, tname: topic.tname, section_name: section.section_name});
										}
									});
								}
							});
						}
					});
				}
				else if(id_string == 'sectionnav') {
					sections.forEach(function(section) {
						if(section.section_id == id_num) {
							topics.forEach(function(topic) {
								if(topic.tid == section.tid) {
									subjects.forEach(function(subject) {
										if(subject.sid == topic.sid) {
											router.navigate('subject.topic', {sname: subject.sname, tname: topic.tname});
										}
									});
								}
							});
						}
					});
				}
				else if(id_string == 'sectionname') {
					sections.forEach(function(section) {
						if(section.section_id == id_num) {
							topics.forEach(function(topic) {
								if(topic.tid == section.tid) {
									subjects.forEach(function(subject) {
										if(subject.sid == topic.sid) {
											router.navigate('subject.topic.section.current_page', {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: section.section_name});
										}
									});
								}
							});
						}
					});
				}
				else if(id_string == 'examples') {
					examples.forEach(function(example) {
						if(example.eid == id_num) {
							sections.forEach(function(section) {
								if(section.section_id == example.section_id) {
									topics.forEach(function(topic) {
										if(topic.tid == section.tid) {
											subjects.forEach(function(subject) {
												if(subject.sid == topic.sid) {
													router.navigate('subject.topic.section.current_page', {sname: subject.sname, tname: topic.tname, section_name: section.section_name, current_page_name: example.ename});
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
		});
	};

	return exports;
});