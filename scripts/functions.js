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
	Loads home.php into the main element if it is empty.

	*/
	exports.default_load = function() {
		if($('main').is(':empty')) {
			$('title').text('Home');
			$('main').load('/client/home.php');
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
		var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
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
		$('li').each(function() {
			if($(this).hasClass('active')) {
				$(this).css('background-color', '#4693ec');
				$(this).find('a').css('color', 'white');
			}
			else {
				if($(this).css('background-color')) {
					if(exports.rgba_to_hex($(this).css('background-color')) == '#4693ec') {
						$(this).css('background-color', '');
						$(this).find('a').css('color', '#444');
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
			$('.button-collapse').sideNav('hide');
		}
		$('#hambuger_button').click(function(e) {
			e.preventDefault();
			$('.button-collapse').sideNav('show');
		});
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
		$('.side-nav').empty();
		var font = '12px';
		var height = '64px';
		if(window.innerWidth < '992') {
			font = '25px';
			height = '120px';
		}
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'notation_li').fadeIn('slow'));
		$('#notation_li').append($('<a>').addClass('collapsible-header bold').attr('id', 'notation').attr('href', 'notation.php').text('Notation').css({
			'line-height': height,
			'font-size': font
		}));
		$('.side-nav').append($('<li>').addClass('divider'));
		subjects.forEach(function(subject) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'subjects_li' + subject.sid).fadeIn('slow'));
			$('#subjects_li' + subject.sid).append($('<a>').addClass('collapsible-header bold').attr('id', 'subjects_' + subject.sid).text(subject.clean_name).css({
				'line-height': height,
				'font-size': font
			}));
			$('#subjects_' + subject.sid).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'extra_li').fadeIn('slow'));
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
		$('.side-nav').empty();
		var font = '12px';
		var height = '64px';
		if(window.innerWidth < '992') {
			font = '25px';
			height = '120px';
		}
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'subject_li' + subject.sid).fadeIn('slow'));
		$('#subject_li' + subject.sid).append($('<a>').addClass('collapsible-header bold').attr('id', 'subjectnav').text('All Subjects').css({
			'line-height': height,
			'font-size': font
		}));
		$('#subjectnav').append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		subject.topics.forEach(function(topic) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'topics_li' + topic.tid).fadeIn('slow'));
			$('#topics_li' + topic.tid).append($('<a>').addClass('collapsible-header bold').attr('id', 'topics_' + topic.tid).text(topic.clean_name).css({
				'line-height': height,
				'font-size': font
			}));
			$('#topics_' + topic.tid).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'extra_li').fadeIn('slow'));
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
		$('.side-nav').empty();
		var font = '12px';
		var height = '64px';
		if(window.innerWidth < '992') {
			font = '25px';
			height = '120px';
		}
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'topic_li' + topic.tid).fadeIn('slow'));
		$('#topic_li' + topic.tid).append($('<a>').addClass('collapsible-header bold').attr('id', 'topicnav_' + topic.tid).text(subject.clean_name).css({
			'line-height': height,
			'font-size': font
		}));
		$('#topicnav_' + topic.tid).append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		topic.sections.forEach(function(section) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'sections_li' + section.section_id).fadeIn('slow'));
			$('#sections_li' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sections_' + section.section_id).text(section.clean_name).css({
				'line-height': height,
				'font-size': font
			}));
			$('#sections_' + section.section_id).append($('<i>').addClass('material-icons right').text('arrow_forward'));
		});
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'extra_li').fadeIn('slow'));
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
		$('.side-nav').empty();
		var font = '12px';
		var height = '64px';
		if(window.innerWidth < '992') {
			font = '25px';
			height = '120px';
		}
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'section_li' + section.section_id).fadeIn('slow'));
		$('#section_li' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sectionnav_' + section.section_id).text(topic.clean_name).css({
			'line-height': height,
			'font-size': font
		}));
		$('#sectionnav_' + section.section_id).append($('<i>').addClass('material-icons right').text('arrow_backward'));
		$('.side-nav').append($('<li>').addClass('divider'));
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'section_name' + section.section_id).fadeIn('slow'));
		$('#section_name' + section.section_id).append($('<a>').addClass('collapsible-header bold').attr('id', 'sectionname_' + section.section_id).text('Notes').css({
			'line-height': height,
			'font-size': font
		}));
		section.examples.forEach(function(example) {
			$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'examples_li' + example.eid).fadeIn('slow'));
			$('#examples_li' + example.eid).append($('<a>').addClass('collapsible-header bold').attr('id', 'examples_' + example.eid).text(example.clean_name).css({
				'line-height': height,
				'font-size': font
			}));
		});
		$('.side-nav').append($('<li>').addClass('no-padding').attr('id', 'extra_li').fadeIn('slow'));
	};

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
		$('a').click(function(e) {
			var link = $(this);
			e.preventDefault();
			if(link.attr('href') == 'home.php') {
				router.navigate('home');
			}
			else if(link.attr('href') == 'notation.php') {
				router.navigate('notation');
			}
			else {
				var id = link.attr('id');
				if(id) {
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
						router.navigate('home');
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
			}
		});
	};

	return exports;
});