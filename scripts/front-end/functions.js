define(function() {
	var exports = {};

	/*

	Purpose:
		Adds and removes dividers in the sidenav as
		the screen is resized.

	Parameters:
		page: The name of the page currently set

	*/
	exports.handle_dividers = function(page) {
		$(".divider").remove();
		if(exports.width_func() < 992) {
			$(".menu_items").each(function(index) {
				$(this).parent().after($("<li>")
					.addClass("divider"));
			});
		}
		else {
			if(page != "about") {
				$("#nav-mobile").children().first()
					.after($("<li>").addClass("divider"));
			}
		}
	};

	/*

	Purpose:
		Rescales a given data url.

	Parameters:
		url: 
			The data url representing the image
		width:
			The desired width of the image
		height:
			The desired height of the image
		callback:
			A callback function

	*/
	exports.resize_image = function(url, width, height, callback) {
	    var sourceImage = new Image();
	    sourceImage.onload = function() {
	        var canvas = document.createElement("canvas");
	        canvas.width = width;
	        canvas.height = height;
	        canvas.getContext("2d")
	        	.drawImage(sourceImage, 0, 0, width, height);
	        callback(canvas.toDataURL());
	    }
	    sourceImage.src = url;
	};

	/*

	Purpose:
		Replaces all instances of a substring inside of
		a given string.

	Parameters:
		str: 
			The overall string
		find:
			The substring which is to be replaced
		replace:
			The string which will replace the
			substring

	*/
	exports.replace_all = function(str, find, replace) {
	    return str.replace(new RegExp(find, "g"), replace);
	};

	/*

	Purpose:
		Returns a deep copy of an object.

	Parameters:
		obj: 
			The object which is to be copied

	*/
	exports.copy = function(obj) {
		var output = undefined,
			v = undefined, 
			key = undefined;
		output = Array.isArray(obj) ? [] : {};
		for(key in obj) {
		   	v = obj[key];
		   	output[key] = (typeof v === "object")
		   		? exports.copy(v) : v;
		}
		return output;
	};

	/*

	Purpose:
		Checks if a string meets the requirements
		to be a password.

	Parameters:
		str: 
			Password candidate

	*/
	exports.password_check = function(str) {
	    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    	return re.test(str);
	};

	/*

	Purpose:
		Creates a cookie.

	Parameters:
		name: 
			Cookie name
		value:
			Cookie value
		minutes:
			Number of minutes til
			cookie expiration

	*/
	exports.write_cookie = function(name, value, minutes) {
	    var dat = undefined, 
	    	expires = undefined;
	    if(minutes) {
	        date = new Date();
	        date.setTime(date.getTime() + (minutes * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    }
	    else { expires = ""; }
	    document.cookie = name + "=" + value + expires + "; path=/";
	};

	/*

	Purpose:
		Reads a cookie's value with the given name.

	Parameters:
		name: 
			Cookie name

	*/
	exports.read_cookie = function(name) {
	    var i = undefined, 
	    	c = undefined, 
	    	ca = document.cookie.split(";"), 
	    	nameEQ = name + "=";
	    for(i = 0; i < ca.length; i++) {
	        c = ca[i];
	        while(c.charAt(0) == " ") {
	            c = c.substring(1, c.length);
	        }
	        if(c.indexOf(nameEQ) == 0) {
	            return c.substring(nameEQ.length, c.length);
	        }
	    }
	    return "";
	};

	/*

	Purpose:
		Deletes a cookie by changing the max-age.

	Parameters:
		name: 
			Cookie name

	*/
	exports.delete_cookie = function(name) {   
	    document.cookie = name + "=; Max-Age=-99999999;path=/;";  
	};

	/*

	Purpose:
		Listens for a change in the cookie with the
		given name.

	Parameters:
		name: 
			Cookie name
		callback:
			Callback function to execute afterwards

	*/
	exports.listen_cookie_change = function(name, callback) {
		var cookieRegistry = [];
	    setInterval(function() {
	        if(cookieRegistry[name]) {
	            if(exports.read_cookie(name) != cookieRegistry[name]) {
	                cookieRegistry[name] = exports.read_cookie(name);
	                return callback();
	            }
	        } 
	        else {
	            cookieRegistry[name] = exports.read_cookie(name);
	        }
	    }, 100);
	};

	/*

	Purpose:
		Handles the missing approvals modal.

	Parameters:
		callback: 
			Function callback

	*/
	exports.approvals_modal = function(subjects) {
		var cookie = exports.read_cookie("contributor");
		$(".modal-trigger").leanModal({
			dismissible: false,
			opacity: 2,
			inDuration: 1000,
			outDuration: 1000
		});
		$("#popup_title").text("Missing Approvals")
			.css("text-align", "center");
		var statement = "Below you will find all" +
			" subjects, topics, sections, and" +
			" examples that require your approval" +
			" currently. It is important to note" +
			" that once changes have been pushed" +
			" to the client side, the content" +
			" approval is reset as any new changes" +
			" cannot obtain your approval prior to" +
			" viewing.";
		var table = $("<table>"),
			tableHead = $("<thead>"),
			tableBody = $("<tbody>"),
			headTR = $("<tr>"),
			item = $("<th>").text("Item")
				.css("text-align", "center"),
			approval = $("<th>")
				.text("Current Content Approval")
				.css("text-align", "center");
		subjects.forEach(function(subject) {
			var subjectContainer = $("<tr>"),
				subjectName = $("<span>")
					.text(subject.clean_name),
				subjectItem = $("<td>")
					.attr("id", "subjectContainer_" +
						subject.sid)
					.append(subjectName),
				subjectApproval = $("<td>")
					.css({
						"text-align": "center",
						"pointer-events": "none"
					});
			if(subject.topics.length > 0) {
				subjectItem.css("cursor", "pointer");
				subjectName.append($("<a>")
					.addClass("right")
					.append($("<i>")
						.addClass("material-icons controller")
						.text("add")
						.css("color", "black")));
			}
			if(subject.cms_approval === null ||
				!subject.cms_approval.split(",")
					.some(function(elem) {
						return elem == cookie;
			})) {
				subjectApproval.append($("<i>")
					.addClass("material-icons")
					.text("check_circle")
					.css("color", "red"));
			}
			else {
				subjectApproval.append($("<i>")
					.addClass("material-icons")
					.text("check_circle")
					.css("color", "green"));
			}
			subjectContainer.append(subjectItem,
				subjectApproval);
			tableBody.append(subjectContainer);
			subject.topics.forEach(function(topic) {
				var topicContainer = $("<tr>").hide(),
					topicName = $("<span>")
						.text(topic.clean_name)
						.css({
							"list-style-type": "square",
							"display": "list-item"
						}),
					topicItem = $("<td>")
						.attr("id", "topicContainer_" +
							topic.tid + "_" + subject.sid)
						.css("padding-left", "40px")
						.append(topicName),
					topicApproval = $("<td>")
						.css({
							"text-align": "center",
							"pointer-events": "none"
						});
				if(topic.sections.length > 0) {
					topicItem.css("cursor", "pointer");
					topicName.append($("<a>")
						.addClass("right")
						.append($("<i>")
							.addClass("material-icons controller")
							.text("add")
							.css("color", "black")));
				}
				if(topic.cms_approval === null ||
					!topic.cms_approval.split(",")
						.some(function(elem) {
							return elem == cookie;
				})) {
					topicApproval.append($("<i>")
						.addClass("material-icons")
						.text("check_circle")
						.css("color", "red"));
				}
				else {
					topicApproval.append($("<i>")
						.addClass("material-icons")
						.text("check_circle")
						.css("color", "green"));
				}
				topicContainer.append(topicItem,
					topicApproval);
				tableBody.append(topicContainer);
				topic.sections.forEach(function(section) {
					var sectionContainer = $("<tr>").hide(),
						sectionName = $("<span>")
							.text(section.clean_name)
							.css({
								"list-style-type": "disc",
								"display": "list-item"
							}),
						sectionItem = $("<td>")
							.attr("id", "sectionContainer_" +
								section.section_id + "_" +
								topic.tid + "_" + subject.sid)
							.css("padding-left", "80px")
							.append(sectionName),
						sectionApproval = $("<td>")
							.css({
								"text-align": "center",
								"pointer-events": "none"
							});
					if(section.examples.length > 0) {
						sectionItem.css("cursor", "pointer");
						sectionName.append($("<a>")
							.addClass("right")
							.append($("<i>")
								.addClass("material-icons controller")
								.text("add")
								.css("color", "black")));
					}
					if(section.cms_approval === null ||
						!section.cms_approval.split(",")
							.some(function(elem) {
								return elem == cookie;
					})) {
						sectionApproval.append($("<i>")
							.addClass("material-icons")
							.text("check_circle")
							.css("color", "red"));
					}
					else {
						sectionApproval.append($("<i>")
							.addClass("material-icons")
							.text("check_circle")
							.css("color", "green"));
					}
					sectionContainer.append(sectionItem,
						sectionApproval);
					tableBody.append(sectionContainer);
					section.examples.forEach(function(example) {
						var exampleContainer = $("<tr>").hide(),
							exampleItem = $("<td>")
								.attr("id", "exampleContainer_" +
									example.eid + "_" +
									section.section_id + "_" +
									topic.tid + "_" + subject.sid)
								.css("padding-left", "120px")
								.append($("<span>")
									.text(example.clean_name)
									.css({
										"list-style-type": "circle",
										"display": "list-item"
									})),
							exampleApproval = $("<td>")
								.css({
									"text-align": "center",
									"pointer-events": "none"
								});
						if(example.cms_approval === null ||
							!example.cms_approval.split(",")
								.some(function(elem) {
									return elem == cookie;
						})) {
							exampleApproval.append($("<i>")
								.addClass("material-icons")
								.text("check_circle")
								.css("color", "red"));
						}
						else {
							exampleApproval.append($("<i>")
								.addClass("material-icons")
								.text("check_circle")
								.css("color", "green"));
						}
						exampleContainer.append(exampleItem,
							exampleApproval);
						tableBody.append(exampleContainer);
					});
				});
			});
		});
		headTR.append(item, approval);
		tableHead.append(headTR);
		table.append(tableHead, tableBody);
		$("#popup_body").text(statement)
			.append(table);
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, "#popup"]);
		$("#popup_control").click();
		var popup = $("#popup")[0].outerHTML,
			popup_control = $("#popup_control")[0].outerHTML,
			overlay = $(".lean-overlay")[0].outerHTML;
		$(window).on("resize", function() {
			if(exports.width_func() >= 992) {
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				var controlWrap = $("<div>").html(popup_control),
					popupWrap = $("<div>").html(popup),
					overlayWrap = $("<div>").html(overlay);
				$("body").append(controlWrap.children().first(),
					popupWrap.children().first(),
					overlayWrap.children().first());
				$("#popup").css({
					opacity: "1",
					transform: "scaleX(1)",
					top: "10%"
				});
				$(".lean-overlay").css("opacity", "2");
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$(window).off();
					exports.resize_modal();
				});
				$("td").click(function(e) {
					e.preventDefault();
					var holder = $(this).attr("id")
						.split("_");
					if(holder[0] == "subjectContainer") {
						var obj = subjects.filter(function(elem) {
								return elem.sid == parseInt(holder[1]);
							})[0],
							test = $(this).find(".controller").first();
						if(test.text() == "add") {
							test.text("remove");
							obj.topics.forEach(function(iter) {
								$("#topicContainer_" + iter.tid +
									"_" + holder[1]).parent()
									.show();
							});
						}
						else if(test.text() == "remove") {
							test.text("add");
							obj.topics.forEach(function(iter) {
								$("#topicContainer_" + iter.tid +
									"_" + holder[1]).parent()
									.hide();
								$("#topicContainer_" + iter.tid +
									"_" + holder[1]).find(".controller")
									.first().text("add");
								iter.sections.forEach(function(item) {
									$("#sectionContainer_" + item.section_id +
										"_" + iter.tid + "_" + holder[1]).parent()
										.hide();
									$("#sectionContainer_" + item.section_id +
										"_" + iter.tid + "_" + holder[1])
										.find(".controller").first().text("add");
									item.examples.forEach(function(tmp) {
										$("#exampleContainer_" + tmp.eid +
											"_" + item.section_id +
											"_" + iter.tid + "_" +
											holder[1]).parent()
											.hide();
									});
								});
							});
						}
					}
					else if(holder[0] == "topicContainer") {
						var obj = subjects.filter(function(elem) {
								return elem.sid == parseInt(holder[2]);
							})[0].topics.filter(function(elem) {
								return elem.tid == parseInt(holder[1]);
							})[0],
							test = $(this).find(".controller").first();
						if(test.text() == "add") {
							test.text("remove");
							obj.sections.forEach(function(iter) {
								$("#sectionContainer_" + iter.section_id +
									"_" + holder[1] + "_" + holder[2]).parent()
									.show();
							});
						}
						else if(test.text() == "remove") {
							test.text("add");
							obj.sections.forEach(function(item) {
								$("#sectionContainer_" + item.section_id +
									"_" + holder[1] + "_" + holder[2]).parent()
									.hide();
								$("#sectionContainer_" + item.section_id +
									"_" + holder[1] + "_" + holder[2])
									.find(".controller").first().text("add");
								item.examples.forEach(function(tmp) {
									$("#exampleContainer_" + tmp.eid + "_" +
										item.section_id + "_" + holder[1] +
										"_" + holder[2]).parent()
										.hide();
								});
							});
						}
					}
					else if(holder[0] == "sectionContainer") {
						var obj = subjects.filter(function(elem) {
								return elem.sid == parseInt(holder[3]);
							})[0].topics.filter(function(elem) {
								return elem.tid == parseInt(holder[2]);
							})[0].sections.filter(function(elem) {
								return elem.section_id == parseInt(holder[1]);
							})[0],
							test = $(this).find(".controller").first();
						if(test.text() == "add") {
							test.text("remove");
							obj.examples.forEach(function(iter) {
								$("#exampleContainer_" + iter.eid +
									"_" + holder[1] + "_" + holder[2] +
									"_" + holder[3]).parent()
									.show();
							});
						}
						else if(test.text() == "remove") {
							test.text("add");
							obj.examples.forEach(function(tmp) {
								$("#exampleContainer_" + tmp.eid + "_" +
									holder[1] + "_" + holder[2] +
									"_" + holder[3]).parent()
									.hide();
							});
						}
					}
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
			}
		});
		$("#popup_submit").click(function(e) {
			e.preventDefault();
			$(".lean-overlay").remove();
			$("#popup").remove();
			$("#popup_control").remove();
			$(window).off();
			exports.resize_modal();
		});
		$("td").click(function(e) {
			e.preventDefault();
			var holder = $(this).attr("id")
				.split("_");
			if(holder[0] == "subjectContainer") {
				var obj = subjects.filter(function(elem) {
						return elem.sid == parseInt(holder[1]);
					})[0],
					test = $(this).find(".controller").first();
				if(test.text() == "add") {
					test.text("remove");
					obj.topics.forEach(function(iter) {
						$("#topicContainer_" + iter.tid +
							"_" + holder[1]).parent()
							.show();
					});
				}
				else if(test.text() == "remove") {
					test.text("add");
					obj.topics.forEach(function(iter) {
						$("#topicContainer_" + iter.tid +
							"_" + holder[1]).parent()
							.hide();
						$("#topicContainer_" + iter.tid +
							"_" + holder[1]).find(".controller")
							.first().text("add");
						iter.sections.forEach(function(item) {
							$("#sectionContainer_" + item.section_id +
								"_" + iter.tid + "_" + holder[1]).parent()
								.hide();
							$("#sectionContainer_" + item.section_id +
								"_" + iter.tid + "_" + holder[1])
								.find(".controller").first().text("add");
							item.examples.forEach(function(tmp) {
								$("#exampleContainer_" + tmp.eid +
									"_" + item.section_id +
									"_" + iter.tid + "_" +
									holder[1]).parent()
									.hide();
							});
						});
					});
				}
			}
			else if(holder[0] == "topicContainer") {
				var obj = subjects.filter(function(elem) {
						return elem.sid == parseInt(holder[2]);
					})[0].topics.filter(function(elem) {
						return elem.tid == parseInt(holder[1]);
					})[0],
					test = $(this).find(".controller").first();
				if(test.text() == "add") {
					test.text("remove");
					obj.sections.forEach(function(iter) {
						$("#sectionContainer_" + iter.section_id +
							"_" + holder[1] + "_" + holder[2]).parent()
							.show();
					});
				}
				else if(test.text() == "remove") {
					test.text("add");
					obj.sections.forEach(function(item) {
						$("#sectionContainer_" + item.section_id +
							"_" + holder[1] + "_" + holder[2]).parent()
							.hide();
						$("#sectionContainer_" + item.section_id +
							"_" + holder[1] + "_" + holder[2])
							.find(".controller").first().text("add");
						item.examples.forEach(function(tmp) {
							$("#exampleContainer_" + tmp.eid + "_" +
								item.section_id + "_" + holder[1] +
								"_" + holder[2]).parent()
								.hide();
						});
					});
				}
			}
			else if(holder[0] == "sectionContainer") {
				var obj = subjects.filter(function(elem) {
						return elem.sid == parseInt(holder[3]);
					})[0].topics.filter(function(elem) {
						return elem.tid == parseInt(holder[2]);
					})[0].sections.filter(function(elem) {
						return elem.section_id == parseInt(holder[1]);
					})[0],
					test = $(this).find(".controller").first();
				if(test.text() == "add") {
					test.text("remove");
					obj.examples.forEach(function(iter) {
						$("#exampleContainer_" + iter.eid +
							"_" + holder[1] + "_" + holder[2] +
							"_" + holder[3]).parent()
							.show();
					});
				}
				else if(test.text() == "remove") {
					test.text("add");
					obj.examples.forEach(function(tmp) {
						$("#exampleContainer_" + tmp.eid + "_" +
							holder[1] + "_" + holder[2] +
							"_" + holder[3]).parent()
							.hide();
					});
				}
			}
			popup = $("#popup")[0].outerHTML,
			popup_control = $("#popup_control")[0].outerHTML,
			overlay = $(".lean-overlay")[0].outerHTML;
		});
	};

	/*

	Purpose:
		Handles the modal for a screen resize.

	Parameters:
		callback: 
			Function callback

	*/
	exports.resize_modal = function(callback) {
		var counter = 0;
		function message() {
			if($("#popup").length == 0) {
				$.get("/pages/dist/modal-min.html").done(function(content) {
					$("body").append(content);
					$(".modal-trigger").leanModal({
						dismissible: false,
						opacity: 2,
						inDuration: 1000,
						outDuration: 1000
					});
					$("#popup_submit").remove();
					$("#popup_title").text("Size Issue");
					var statement = "By design the content management system cannot" +
						" operate on a screen less than 992 pixels. Please increase" +
						" the width of the browser to continue working."
					$("#popup_body").text(statement);
					$("#popup_control").click();
				});
			}
			else {
				var popupSidenav = $("#popup"),
					popup_controlSidenav = $("#popup_control"),
					overlaySidenav = $(".lean-overlay");
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("body").append(popup_controlSidenav,
						popupSidenav, overlaySidenav);
					popupSidenav.find(".modal-content")
						.first().children()
						.each(function(index) {
						if(index > 1) {
							$(this).remove();
						}
					});
					$("#popup_title").text("Size Issue");
					$("#popup_modal_footer").empty();
					var statement = "By design the content management system cannot" +
						" operate on a screen less than 992 pixels. Please increase" +
						" the width of the browser to continue working."
					$("#popup_body").empty().text(statement);
					$("#popup").css({
						opacity: "1",
						transform: "scaleX(1)",
						top: "10%"
					});
					$(".lean-overlay").css("opacity", "2");
			}
		};
		if(exports.width_func() < 992) { message(); }
		else {
			if(callback !== undefined) {
				callback();
			}
			counter++;
		}
		$(window).on("resize", function() {
			$("body").css({width: "100%", overflow: "auto"});
			$("#bar").css("width", $("#latex").width());
			if(exports.width_func() < 992) {
				message();
			}
			else if(counter == 0 && exports.width_func() >= 992) {
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				if(callback !== undefined) {
					callback();
				}
				counter++;
			}
			else {
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
			}
		});
	};

	/*

	Purpose:
		Adds a committee option to the fixed
		action button.

	Parameters:
		email: 
			A contributor's email

	*/
	exports.committee = function(email, callback) {
		$.post("/api/cms/committee/check/", {email: email}).done(function(check) {
			if(check >= 1) {
				var group = $("<a>").css("background", "#00b8ff")
					.addClass("btn-floating button-tooltipped")
					.append($("<i>").addClass("material-icons")
						.text("group_work"))
					.attr({
						"id": "committee",
						"data-position": "left",
						"data-tooltip": "Committee Approvals"
					});
			}
			if(check == 1) {
				var ranking = $("<a>").css("background", "#00b8ff")
					.addClass("btn-floating button-tooltipped")
					.append($("<i>").addClass("material-icons")
						.text("thumbs_up_down"))
					.attr({
						"id": "ranking",
						"data-position": "left",
						"data-tooltip": "Contributor Approvals"
					});
				$("#missing-approvals").closest("li").before(
					$("<li>").append(ranking),
					$("<li>").append(group));
			}
			else if(check == 2) {
				var decision = $("<a>").css("background", "#00b8ff")
					.addClass("btn-floating button-tooltipped")
					.append($("<i>").addClass("material-icons")
						.text("group"))
					.attr({
						"id": "decision",
						"data-position": "left",
						"data-tooltip": "Administrator Privileges"
					});
				$("#missing-approvals").closest("li").before(
					$("<li>").append(decision),
					$("<li>").append(group));
			}
		}).done(function() { callback(); });
	};

	/*

	Purpose:
		Handles the decision modal for
		the administrator.

	*/
	exports.decision_modal = function() {
		$.get("/pages/dist/committee-table-min.html")
			.done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Administrator Privileges")
				.css("text-align", "center");
			$("#popup_modal_footer").append($("<a>")
				.attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "As the administrator of manualmath you have" +
				" the power to increase a contributor's current role by" +
				" adding the user to the committee. At the same time you" +
				" may also decrease a contributor's current role by deleting" +
				" their account from the database. Using the table below you" +
				" can approve and delete contributors who have a green light" +
				" indicator."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/data").done(function(contributors) {
				var list = contributors.map(function(elem, index) {
					elem.num = index;
					elem.rank_up = 0;
					elem.rank_down = 0;
					elem.deleted = 0;
					return elem;
				});
				$("#committee_table_head").find("tr th:nth-last-child(2)")
					.text("Member Up Votes");
				$("#committee_table_head").find("tr th")
					.last().text("Member Down Votes");
				$("#committee_table_head").find("tr")
					.append($("<th>").text("Rank Down"),
						$("<th>").text("Rank Up"), $("<th>").text("Delete"));
				list.forEach(function(elem) {
					var first = elem.rank_approval != null
							? elem.rank_approval.split(",").length
							: "0",
						second = elem.rank_disapproval != null
							? elem.rank_disapproval.split(",").length
							: "0";
					if(elem.rank == "com-member") {
						first = "N/A";
						second = "N/A";
					}
					var item_tr = $("<tr>"),
						item_fname = $("<td>").text(elem.first_name),
						item_lname = $("<td>").text(elem.last_name),
						item_email = $("<td>").text(elem.email)
							.css("text-align", "center"),
						item_approval = $("<td>").text(first)
							.css("text-align", "center"),
						item_disapproval = $("<td>").text(second)
							.css("text-align", "center"),
						item_rank_down = $("<td>").css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "rank_down_" + elem.num)
								.addClass("rank-down-contributor center")
								.css("color", "red")
								.append($("<i>").addClass("material-icons")
									.text("thumb_down"))),
						item_rank_up = $("<td>").css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "rank_up_" + elem.num)
								.addClass("rank-up-contributor center")
								.css("color", "red")
								.append($("<i>").addClass("material-icons")
									.text("thumb_up"))),
						item_rank_delete = $("<td>").css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "delete_" + elem.num)
								.addClass("delete-contributor center")
								.css("color", "red")
								.append($("<i>").addClass("material-icons")
									.text("cancel")));
					item_tr.append(item_fname, item_lname, item_email,
						item_approval, item_disapproval, 
						item_rank_down, item_rank_up,
						item_rank_delete);
					$("#committee_table_body").append(item_tr);
				});
				$("#popup_control").click();
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$(window).off();
					exports.resize_modal();
				});
				$(".delete-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#delete_" +
						holder[1]).css("color")) == "#ff0000") {
						$("#delete_" + holder[1]).css("color", "green");
						list[obj_ref].deleted = 1;
					}
					else {
						$("#delete_" + holder[1]).css("color", "red");
						list[obj_ref].deleted = 0;
					}
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
				$(".rank-up-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[2];
						});
					if(exports.rgba_to_hex($("#rank_up_" +
						holder[2]).css("color")) == "#ff0000") {
						$("#rank_up_" + holder[2]).css("color", "green");
						$("#rank_down_" + holder[2]).css("color", "red");
						list[obj_ref].rank_up = 1;
					}
					else {
						$("#rank_up_" + holder[2]).css("color", "red");
						list[obj_ref].rank_up = 0;
					}
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
				$(".rank-down-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[2];
						});
					if(exports.rgba_to_hex($("#rank_down_" +
						holder[2]).css("color")) == "#ff0000") {
						$("#rank_down_" + holder[2]).css("color", "green");
						$("#rank_up_" + holder[2]).css("color", "red");
						list[obj_ref].rank_down = 1;
					}
					else {
						$("#rank_down_" + holder[2]).css("color", "red");
						list[obj_ref].rank_down = 0;
					}
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
				$("#popup_submit").text("Save Changes").click(function(e) {
					e.preventDefault();
					$("#popup_exit").remove();
					$("#popup_submit").addClass("modal-close");
					list.forEach(function(iter) {
						if(iter.deleted == 1) {
							$.post("/api/cms/contributor/remove/",
								{email: iter.email})
								.fail(function() {
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue" +
									" deleting contributor(s) from the" +
									" database!");
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							});
						}
						else if(iter.deleted == 0 && iter.rank_up == 1) {
							$.post("/api/cms/committee/add",
								{email: iter.email})
								.fail(function() {
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue" +
									" ranking up contributo(r) in the" +
									" database!");
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							});
						}
						else if(iter.deleted == 0 && iter.rank_down == 1) {
							$.post("/api/cms/committee/remove",
								{email: iter.email})
								.fail(function() {
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue" +
									" ranking down contributo(r) in the" +
									" database!");
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							});
						}
					});
					$("#popup").find(".modal-content")
						.first().children()
						.each(function(index) {
						if(index > 1) {
							$(this).remove();
						}
					});
					$("#popup_title").text("Changes Saved")
						.css("text-align", "center");
					$("#popup_body").text("All contributor changes have" +
						" been saved to the database!");
					$("#popup_submit").text("Ok").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).scrollTop(0);
						$(window).off();
						exports.resize_modal();
					});
				});
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#popup_exit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$(window).off();
							exports.resize_modal();
						});
						$(".delete-contributor").on("click", function(e) {
							e.preventDefault();
							var holder = $(this).attr("id").split("_"),
								obj_ref = list.findIndex(function(iter) { 
									return iter.num == holder[1];
								});
							if(exports.rgba_to_hex($("#delete_" +
								holder[1]).css("color")) == "#ff0000") {
								$("#delete_" + holder[1]).css("color", "green");
								list[obj_ref].deleted = 1;
							}
							else {
								$("#delete_" + holder[1]).css("color", "red");
								list[obj_ref].deleted = 0;
							}
							popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						});
						$(".rank-up-contributor").on("click", function(e) {
							e.preventDefault();
							var holder = $(this).attr("id").split("_"),
								obj_ref = list.findIndex(function(iter) { 
									return iter.num == holder[2];
								});
							if(exports.rgba_to_hex($("#rank_up_" +
								holder[2]).css("color")) == "#ff0000") {
								$("#rank_up_" + holder[2]).css("color", "green");
								$("#rank_down_" + holder[2]).css("color", "red");
								list[obj_ref].rank_up = 1;
							}
							else {
								$("#rank_up_" + holder[2]).css("color", "red");
								list[obj_ref].rank_up = 0;
							}
							popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						});
						$(".rank-down-contributor").on("click", function(e) {
							e.preventDefault();
							var holder = $(this).attr("id").split("_"),
								obj_ref = list.findIndex(function(iter) { 
									return iter.num == holder[2];
								});
							if(exports.rgba_to_hex($("#rank_down_" +
								holder[2]).css("color")) == "#ff0000") {
								$("#rank_down_" + holder[2]).css("color", "green");
								$("#rank_up_" + holder[2]).css("color", "red");
								list[obj_ref].rank_down = 1;
							}
							else {
								$("#rank_down_" + holder[2]).css("color", "red");
								list[obj_ref].rank_down = 0;
							}
							popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						});
						$("#popup_submit").text("Save Changes").click(function(e) {
							e.preventDefault();
							$("#popup_exit").remove();
							$("#popup_submit").addClass("modal-close");
							list.forEach(function(iter) {
								if(iter.deleted == 1) {
									$.post("/api/cms/contributor/remove/",
										{email: iter.email})
										.fail(function() {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title").text("Database Issue");
										$("#popup_body").text("There was an issue" +
											" deleting contributor(s) from the" +
											" database!");
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$(window).scrollTop(0);
												$(window).off();
												exports.resize_modal();
										});
									});
								}
								else if(iter.deleted == 0 && iter.rank_up == 1) {
									$.post("/api/cms/committee/add",
										{email: iter.email})
										.fail(function() {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title").text("Database Issue");
										$("#popup_body").text("There was an issue" +
											" ranking up contributo(r) in the" +
											" database!");
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$(window).scrollTop(0);
												$(window).off();
												exports.resize_modal();
										});
									});
								}
								else if(iter.deleted == 0 && iter.rank_down == 1) {
									$.post("/api/cms/committee/remove",
										{email: iter.email})
										.fail(function() {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title").text("Database Issue");
										$("#popup_body").text("There was an issue" +
											" ranking down contributo(r) in the" +
											" database!");
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$(window).scrollTop(0);
												$(window).off();
												exports.resize_modal();
										});
									});
								}
							});
							$("#popup").find(".modal-content")
								.first().children()
								.each(function(index) {
								if(index > 1) {
									$(this).remove();
								}
							});
							$("#popup_title").text("Changes Saved")
								.css("text-align", "center");
							$("#popup_body").text("All contributor changes have" +
								" been saved to the database!");
							$("#popup_submit").text("Ok").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$(window).scrollTop(0);
								$(window).off();
								exports.resize_modal();
							});
						});
					}
				});
			});
		});
	};

	/*

	Purpose:
		Handles the ranking modal for committee members
		excluding the administrator.

	*/
	exports.ranking_modal = function() {
		$.get("/pages/dist/committee-table-min.html").done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Committee Approval of New Committee Members")
				.css("text-align", "center");
			$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "As a committee member on manualmath you have" +
				" the power to try to sway the administrator's decision" +
				" on whether a current contributor joins the committee" +
				" or not. Using the table below you can provide an" +
				" approval or disapproval which will be indicated by" +
				" a green color."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/nonmember")
				.done(function(contributors) {
				var list = contributors
					.map(function(elem, index) {
						elem.num = index;
						elem.edited = 0;
						return elem;
				});
				$("#committee_table_head").find("tr th").last()
					.text("Disapprove");
				list.forEach(function(elem) {
					var item_tr = $("<tr>"),
						item_fname = $("<td>")
							.text(elem.first_name),
						item_lname = $("<td>")
							.text(elem.last_name),
						item_email = $("<td>")
							.text(elem.email)
							.css("text-align", "center"),
						item_approve = $("<td>")
							.css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "approve_" + elem.num)
								.addClass("approve-contributor center")
								.append($("<i>")
									.addClass("material-icons")
									.text("thumb_up"))),
						item_disapprove = $("<td>")
							.css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "disapprove_" + elem.num)
								.addClass("disapprove-contributor center")
								.append($("<i>")
									.addClass("material-icons")
									.text("thumb_down")));
					item_tr.append(item_fname, item_lname,
						item_email, item_approve, item_disapprove);
					$("#committee_table_body").append(item_tr);
					if(elem.rank_approval != null && 
						elem.rank_approval.split(",").some(function(iter) {
							return iter == exports.read_cookie("contributor");
						})) {
						$("#approve_" + elem.num).css("color", "green");
					}
					else {
						$("#approve_" + elem.num).css("color", "red");
					}
					if(elem.rank_disapproval != null && 
						elem.rank_disapproval.split(",").some(function(iter) {
							return iter == exports.read_cookie("contributor");
						})) {
						$("#disapprove_" + elem.num).css("color", "green");
					}
					else {
						$("#disapprove_" + elem.num).css("color", "red");
					}
				});
				$("#popup_control").click();
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$(window).off();
					exports.resize_modal();
				});
				$(".disapprove-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#disapprove_"
						+ holder[1]).css("color")) == "#ff0000") {
						$("#disapprove_" + holder[1]).css("color", "green");
						$("#approve_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_disapproval == null) { 
							list[obj_ref].rank_disapproval = 
								exports.read_cookie("contributor"); 
						}
						else {
							list[obj_ref].rank_disapproval += "," +
								exports.read_cookie("contributor");
						}
						if(list[obj_ref].rank_approval != null) { 
							var start = list[obj_ref].rank_approval
								.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_approval = 
										list[obj_ref].rank_approval
											.substring(0, start) + 
										list[obj_ref].rank_approval
											.substring(start +
											exports.read_cookie("contributor")
											.length);
								}
								else {
									list[obj_ref].rank_approval =
										list[obj_ref].rank_approval
											.substring(exports.read_cookie(
												"contributor").length + 1);
								}
								if(list[obj_ref].rank_approval == "") {
									list[obj_ref].rank_approval = null;
								}
							}
						}
					}
					else {
						$("#disapprove_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_disapproval != null) { 
							var start = list[obj_ref].rank_disapproval
								.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_disapproval =
										list[obj_ref].rank_disapproval
											.substring(0, start) + 
										list[obj_ref].rank_disapproval
											.substring(start +
											exports.read_cookie(
												"contributor").length);
								}
								else {
									list[obj_ref].rank_disapproval =
										list[obj_ref].rank_disapproval
											.substring(exports.read_cookie(
												"contributor").length + 1);
								}
								if(list[obj_ref].rank_disapproval == "") {
									list[obj_ref].rank_disapproval = null;
								}
							}
						}
					}
					list[obj_ref].edited = 1;
				});
				$(".approve-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#approve_" +
						holder[1]).css("color")) == "#ff0000") {
						$("#approve_" + holder[1]).css("color", "green");
						$("#disapprove_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_approval == null) { 
							list[obj_ref].rank_approval =
								exports.read_cookie("contributor"); 
						}
						else {
							list[obj_ref].rank_approval += "," +
								exports.read_cookie("contributor");
						}
						if(list[obj_ref].rank_disapproval != null) { 
							var start = list[obj_ref].rank_disapproval
								.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_disapproval = 
										list[obj_ref].rank_disapproval
											.substring(0, start) + 
										list[obj_ref].rank_disapproval
											.substring(start +
												exports.read_cookie(
													"contributor").length);
								}
								else {
									list[obj_ref].rank_disapproval =
										list[obj_ref].rank_disapproval
											.substring(exports.read_cookie(
												"contributor").length + 1);
								}
								if(list[obj_ref].rank_disapproval == "") {
									list[obj_ref].rank_disapproval = null;
								}
							}
						}
					}
					else {
						$("#approve_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_approval != null) { 
							var start = list[obj_ref].rank_approval
							.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_approval =
										list[obj_ref].rank_approval
											.substring(0, start) + 
										list[obj_ref].rank_approval
											.substring(start +
												exports.read_cookie(
													"contributor").length);
								}
								else {
									list[obj_ref].rank_approval =
										list[obj_ref].rank_approval
											.substring(exports.read_cookie(
												"contributor").length + 1);
								}
								if(list[obj_ref].rank_approval == "") {
									list[obj_ref].rank_approval = null;
								}
							}
						}
					}
					list[obj_ref].edited = 1;
				});
				$("#popup_submit").text("Save Changes").click(function(e) {
					e.preventDefault();
					$("#popup_exit").remove();
					$("#popup_submit").addClass("modal-close");
					list.forEach(function(iter) {
						if(iter.edited == 1) {
							$.post("/api/cms/contributor/change" +
								"/rankApproval", {
								email: iter.email,
								rank_approval: (iter.rank_approval == null
									? "0" : iter.rank_approval),
								rank_disapproval: (iter.rank_disapproval == null
									? "0" : iter.rank_disapproval)
							}).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue" +
									" uploading the contributor changes" +
									" to the database!");
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							});
						}
					});
					$("#popup_title").text("Changes Saved")
						.css("text-align", "center");
					$("#popup_body").text("All contributor changes have" +
						" been saved to the database!");
					$("#popup_submit").text("Ok").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).scrollTop(0);
						$(window).off();
						exports.resize_modal();
					});
				});
			});
		});
	};

	/*

	Purpose:
		Handles the committee modal.

	*/
	exports.committee_modal = function() {
		$.get("/pages/dist/committee-table-min.html")
			.done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Committee Approval of New Users")
				.css("text-align", "center");
			$("#popup_modal_footer").append($("<a>")
				.attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "When new contributors register" +
				" for the service, system by design. It is" +
				" the job of the committee members to approve" +
				" or disapprove incoming contributors by" +
				" utilizing the funtionality provided below." +
				" Once a contributor reaches majority" +
				" approval from the committee they will" +
				" gain access to the content management" +
				" system. Likewise a majority disapproval" +
				" means a contributor has been denied" +
				" access and has their account wiped" +
				" from the database."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/unapproved")
				.done(function(contributors) {
				var list = contributors.map(function(elem, index) {
					elem.num = index;
					elem.edited = 0;
					return elem;
				});
				list.forEach(function(elem) {
					var item_tr = $("<tr>"),
						item_fname = $("<td>").text(elem.first_name),
						item_lname = $("<td>").text(elem.last_name),
						item_email = $("<td>").text(elem.email)
							.css("text-align", "center"),
						item_approve = $("<td>").css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "check_" + elem.num)
								.addClass("approve-contributor center")
								.append($("<i>")
									.addClass("material-icons")
									.text("check_circle"))),
						item_delete = $("<td>").css("text-align", "center")
							.append($("<a>")
								.css("cursor", "pointer")
								.attr("id", "delete_" + elem.num)
								.addClass("del-contributor center")
								.append($("<i>")
									.addClass("material-icons")
									.text("cancel")));
					item_tr.append(item_fname, item_lname,
						item_email, item_approve, item_delete);
					$("#committee_table_body").append(item_tr);
					if(elem.approval != null && 
						elem.approval.split(",").some(function(iter) {
							return iter == exports.read_cookie("contributor");
						})) {
						$("#check_" + elem.num).css("color", "green");
					}
					else {
						$("#check_" + elem.num).css("color", "red");
					}
					if(elem.del != null && 
						elem.del.split(",").some(function(iter) {
							return iter == exports.read_cookie("contributor");
						})) {
						$("#delete_" + elem.num).css("color", "green");
					}
					else {
						$("#delete_" + elem.num).css("color", "red");
					}
				});
				$("#popup_control").click();
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#popup_exit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$(window).off();
							exports.resize_modal();
						});
						$(".del-contributor").on("click", function(e) {
							e.preventDefault();
							var holder = $(this).attr("id").split("_"),
								obj_ref = list.findIndex(function(iter) { 
									return iter.num == holder[1];
								});
							if(exports.rgba_to_hex($("#delete_" +
								holder[1]).css("color")) == "#ff0000") {
								$("#delete_" + holder[1]).css("color", "green");
								if(list[obj_ref].del == null) { 
									list[obj_ref].del =
										exports.read_cookie("contributor"); 
								}
								else {
									list[obj_ref].del += "," +
										exports.read_cookie("contributor");
								}
							}
							else {
								$("#delete_" + holder[1]).css("color", "red");
								if(list[obj_ref].del != null) { 
									var start = list[obj_ref].del
										.indexOf(exports.read_cookie("contributor")); 
									if(start != -1) {
										if(start != 0) {
											list[obj_ref].del = 
												list[obj_ref].del.substring(0, start) + 
												list[obj_ref].del.substring(start +
													exports.read_cookie(
														"contributor").length);
										}
										else {
											list[obj_ref].del = list[obj_ref].del
												.substring(exports.read_cookie(
													"contributor").length + 1);
										}
										if(list[obj_ref].del == "") {
											list[obj_ref].del = null;
										}
									}
								}
							}
							list[obj_ref].edited = 1;
							popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						});
						$(".approve-contributor").on("click", function(e) {
							e.preventDefault();
							var holder = $(this).attr("id").split("_"),
								obj_ref = list.findIndex(function(iter) { 
									return iter.num == holder[1];
								});
							if(exports.rgba_to_hex($("#check_" +
								holder[1]).css("color")) == "#ff0000") {
								$("#check_" + holder[1]).css("color", "green");
								if(list[obj_ref].approval == null) { 
									list[obj_ref].approval =
										exports.read_cookie("contributor"); 
								}
								else {
									list[obj_ref].approval += "," +
										exports.read_cookie("contributor");
									}
							}
							else {
								$("#check_" + holder[1]).css("color", "red");
								if(list[obj_ref].approval != null) { 
									var start = list[obj_ref].approval
										.indexOf(exports.read_cookie("contributor"));
									if(start != -1) {
										if(start != 0) {
											list[obj_ref].approval =
												list[obj_ref].approval
													.substring(0, start) + 
												list[obj_ref].approval
													.substring(start +
														exports.read_cookie(
															"contributor").length);
										}
										else {
											list[obj_ref].approval =
												list[obj_ref].approval
													.substring(exports.read_cookie(
														"contributor").length + 1);
										}
										if(list[obj_ref].approval == "") {
											list[obj_ref].approval = null;
										}
									}
								}
							}
							list[obj_ref].edited = 1;
							popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						});
						$("#popup_submit").text("Save Changes").click(function(e) {
							e.preventDefault();
							$("#popup_exit").remove();
							$("#popup_submit").addClass("modal-close");
							$.get("/api/cms/count/committee").done(function(num) {
								const validation = Math.ceil((parseInt(num) + 1) / 2);
								var statement = "";
								list.forEach(function(iter) {
									if(iter.del != null &&
										iter.del.split(",").length >= validation) {
										$.post("/api/cms/contributor/remove/",
											{email: iter.email})
											.fail(function() {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title").text("Database Issue");
											$("#popup_body").text("There was an" +
												" issue deleting a contributor" +
												" from the database!");
											var popup = $("#popup")[0].outerHTML,
												popup_control = $("#popup_control")[0].outerHTML,
												overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").text("Ok")
														.click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$(window).scrollTop(0);
															$(window).off();
															exports.resize_modal();
													});
												}
											});
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$(window).scrollTop(0);
													$(window).off();
													exports.resize_modal();
											});
										});
									}
									else if(iter.approval != null &&
										iter.approval.split(",").length >= validation) {
										$.post("/api/cms/contributor/change/status/",
											{email: iter.email, status: 1})
											.fail(function() {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title").text("Database Issue");
											$("#popup_body").text("There was an" +
												" issue changing the status" +
												" of a contributor in the database!");
											var popup = $("#popup")[0].outerHTML,
												popup_control = $("#popup_control")[0].outerHTML,
												overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").text("Ok")
														.click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$(window).scrollTop(0);
															$(window).off();
															exports.resize_modal();
													});
												}
											});
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$(window).scrollTop(0);
													$(window).off();
													exports.resize_modal();
											});
										});
									}
									else {
										if(iter.edited == 1) {
											$.post("/api/cms/contributor/change" +
												"/approval/", {
												email: iter.email,
												approval: iter.approval == null
													? "0" : iter.approval,
												del: iter.del == null
													? "0" : iter.del
											}).fail(function() {
												$("#popup").find(".modal-content")
													.first().children()
													.each(function(index) {
													if(index > 1) {
														$(this).remove();
													}
												});
												$("#popup_title").text("Database Issue");
												$("#popup_body").text("There was an" +
													" issue uploading the" +
													" contributor changes to" +
													" the database!");
												var popup = $("#popup")[0].outerHTML,
													popup_control = $("#popup_control")[0].outerHTML,
													overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").text("Ok")
															.click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$(window).scrollTop(0);
																$(window).off();
																exports.resize_modal();
														});
													}
												});
												$("#popup_submit").text("Ok")
													.click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$(window).scrollTop(0);
														$(window).off();
														exports.resize_modal();
												});
											});
										}
									}
								});
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$("#popup_title").text("Changes Saved")
									.css("text-align", "center");
								$("#popup_body").text("All contributor" +
									" changes have been saved" +
									" to the database!");
								var popup = $("#popup")[0].outerHTML,
									popup_control = $("#popup_control")[0].outerHTML,
									overlay = $(".lean-overlay")[0].outerHTML;
								$(window).on("resize", function() {
									if(exports.width_func() >= 992) {
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										var controlWrap = $("<div>").html(popup_control),
											popupWrap = $("<div>").html(popup),
											overlayWrap = $("<div>").html(overlay);
										$("body").append(controlWrap.children().first(),
											popupWrap.children().first(),
											overlayWrap.children().first());
										$("#popup").css({
											opacity: "1",
											transform: "scaleX(1)",
											top: "10%"
										});
										$(".lean-overlay").css("opacity", "2");
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$(window).scrollTop(0);
												$(window).off();
												exports.resize_modal();
										});
									}
								});
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							});
						});
					}
				});
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$(window).off();
					exports.resize_modal();
				});
				$(".del-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#delete_" +
						holder[1]).css("color")) == "#ff0000") {
						$("#delete_" + holder[1]).css("color", "green");
						if(list[obj_ref].del == null) { 
							list[obj_ref].del =
								exports.read_cookie("contributor"); 
						}
						else {
							list[obj_ref].del += "," +
								exports.read_cookie("contributor");
						}
					}
					else {
						$("#delete_" + holder[1]).css("color", "red");
						if(list[obj_ref].del != null) { 
							var start = list[obj_ref].del
								.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].del = 
										list[obj_ref].del.substring(0, start) + 
										list[obj_ref].del.substring(start +
											exports.read_cookie(
												"contributor").length);
								}
								else {
									list[obj_ref].del = list[obj_ref].del
										.substring(exports.read_cookie(
											"contributor").length + 1);
								}
								if(list[obj_ref].del == "") {
									list[obj_ref].del = null;
								}
							}
						}
					}
					list[obj_ref].edited = 1;
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
				$(".approve-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#check_" +
						holder[1]).css("color")) == "#ff0000") {
						$("#check_" + holder[1]).css("color", "green");
						if(list[obj_ref].approval == null) { 
							list[obj_ref].approval =
								exports.read_cookie("contributor"); 
						}
						else {
							list[obj_ref].approval += "," +
								exports.read_cookie("contributor");
							}
					}
					else {
						$("#check_" + holder[1]).css("color", "red");
						if(list[obj_ref].approval != null) { 
							var start = list[obj_ref].approval
								.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].approval =
										list[obj_ref].approval
											.substring(0, start) + 
										list[obj_ref].approval
											.substring(start +
												exports.read_cookie(
													"contributor").length);
								}
								else {
									list[obj_ref].approval =
										list[obj_ref].approval
											.substring(exports.read_cookie(
												"contributor").length + 1);
								}
								if(list[obj_ref].approval == "") {
									list[obj_ref].approval = null;
								}
							}
						}
					}
					list[obj_ref].edited = 1;
					popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				});
				$("#popup_submit").text("Save Changes").click(function(e) {
					e.preventDefault();
					$("#popup_exit").remove();
					$("#popup_submit").addClass("modal-close");
					$.get("/api/cms/count/committee").done(function(num) {
						const validation = Math.ceil((parseInt(num) + 1) / 2);
						var statement = "";
						list.forEach(function(iter) {
							if(iter.del != null &&
								iter.del.split(",").length >= validation) {
								$.post("/api/cms/contributor/remove/",
									{email: iter.email})
									.fail(function() {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title").text("Database Issue");
									$("#popup_body").text("There was an" +
										" issue deleting a contributor" +
										" from the database!");
									var popup = $("#popup")[0].outerHTML,
										popup_control = $("#popup_control")[0].outerHTML,
										overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$(window).scrollTop(0);
													$(window).off();
													exports.resize_modal();
											});
										}
									});
									$("#popup_submit").text("Ok")
										.click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$(window).scrollTop(0);
											$(window).off();
											exports.resize_modal();
									});
								});
							}
							else if(iter.approval != null &&
								iter.approval.split(",").length >= validation) {
								$.post("/api/cms/contributor/change/status/",
									{email: iter.email, status: 1})
									.fail(function() {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title").text("Database Issue");
									$("#popup_body").text("There was an" +
										" issue changing the status" +
										" of a contributor in the database!");
									var popup = $("#popup")[0].outerHTML,
										popup_control = $("#popup_control")[0].outerHTML,
										overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$(window).scrollTop(0);
													$(window).off();
													exports.resize_modal();
											});
										}
									});
									$("#popup_submit").text("Ok")
										.click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$(window).scrollTop(0);
											$(window).off();
											exports.resize_modal();
									});
								});
							}
							else {
								if(iter.edited == 1) {
									$.post("/api/cms/contributor/change" +
										"/approval/", {
										email: iter.email,
										approval: iter.approval == null
											? "0" : iter.approval,
										del: iter.del == null
											? "0" : iter.del
									}).fail(function() {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title").text("Database Issue");
										$("#popup_body").text("There was an" +
											" issue uploading the" +
											" contributor changes to" +
											" the database!");
										var popup = $("#popup")[0].outerHTML,
											popup_control = $("#popup_control")[0].outerHTML,
											overlay = $(".lean-overlay")[0].outerHTML;
										$(window).on("resize", function() {
											if(exports.width_func() >= 992) {
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												var controlWrap = $("<div>").html(popup_control),
													popupWrap = $("<div>").html(popup),
													overlayWrap = $("<div>").html(overlay);
												$("body").append(controlWrap.children().first(),
													popupWrap.children().first(),
													overlayWrap.children().first());
												$("#popup").css({
													opacity: "1",
													transform: "scaleX(1)",
													top: "10%"
												});
												$(".lean-overlay").css("opacity", "2");
												$("#popup_submit").text("Ok")
													.click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$(window).scrollTop(0);
														$(window).off();
														exports.resize_modal();
												});
											}
										});
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$(window).scrollTop(0);
												$(window).off();
												exports.resize_modal();
										});
									});
								}
							}
						});
						$("#popup").find(".modal-content")
							.first().children()
							.each(function(index) {
							if(index > 1) {
								$(this).remove();
							}
						});
						$("#popup_title").text("Changes Saved")
							.css("text-align", "center");
						$("#popup_body").text("All contributor" +
							" changes have been saved" +
							" to the database!");
						var popup = $("#popup")[0].outerHTML,
							popup_control = $("#popup_control")[0].outerHTML,
							overlay = $(".lean-overlay")[0].outerHTML;
						$(window).on("resize", function() {
							if(exports.width_func() >= 992) {
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								var controlWrap = $("<div>").html(popup_control),
									popupWrap = $("<div>").html(popup),
									overlayWrap = $("<div>").html(overlay);
								$("body").append(controlWrap.children().first(),
									popupWrap.children().first(),
									overlayWrap.children().first());
								$("#popup").css({
									opacity: "1",
									transform: "scaleX(1)",
									top: "10%"
								});
								$(".lean-overlay").css("opacity", "2");
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
										$(window).off();
										exports.resize_modal();
								});
							}
						});
						$("#popup_submit").text("Ok")
							.click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$(window).scrollTop(0);
								$(window).off();
								exports.resize_modal();
						});
					});
				});
			});
		});
	};

	/*

	Purpose:
		Handles the name checks of the sidenav modal.

	Parameters:
		data:
			An array of the objects representing
			the current data

	*/
	exports.sidenav_modal_name_check = function(data) {
		var test = data.map(function(elem) {
				return elem.clean_name;
			}),
			i = 0;
		for(; i < test.length; i++) {
			if(test.filter(function(item) {
				return item == test[i];
			}).length >= 2) {
				break;
			}				
		}
		i != test.length 
			? $("#popup_submit").css("pointer-events", "none") 
			: $("#popup_submit").css("pointer-events", "auto");
	};

	/*

	Purpose:
		Handles all clicks for the sidenav modal.

	Parameters:
		type: 
			A reference to the type of data
			being handled
		data:
			An array of the objects
			representing the type of data

	*/
	exports.sidenav_modal_links = function(type, data) {
		$(".field").off("input");
		$(".arrow").off("click");
		$(".del").off("click");
		$(".approve").off("click");
		$(".garbage").off("click");
		$(".field").on("input", function() {
			var id = parseInt($(this).attr("id")
				.split("_")[2]);
			data.forEach(function(iter) { 
				if((type == "Subjects" &&
						iter.sid == id) ||
					(type == "Topics" &&
						iter.tid == id) ||
					(type == "Sections" &&
						iter.section_id == id) ||
					(type == "Examples" &&
						iter.eid == id)) {
					iter.edited = 1;
					iter.clean_name = $("#" +
						type.toLowerCase() + "_td_" + id)
						.text();
					var str = iter.clean_name
						.replace(/ /g, "x20")
						.replace(/!/g, "x21")
						.replace(/"/g, "x22")
						.replace(/#/g, "x23")
						.replace(/\$/g, "x24")
						.replace(/%/g, "x25")
						.replace(/&/g, "x26")
						.replace(/'/g, "x27")
						.replace(/\(/g, "x28")
						.replace(/\)/g, "x29")
						.replace(/\*/g, "x2A")
						.replace(/\+/g, "x2B")
						.replace(/,/g, "x2C")
						.replace(/-/g, "x2D")
						.replace(/\./g, "x2E")
						.replace(/\//g, "x2F")
						.replace(/:/g, "x3A")
						.replace(/\;/g, "x3B")
						.replace(/</g, "x3C")
						.replace(/=/g, "x3D")
						.replace(/>/g, "x3E")
						.replace(/\?/g, "x3F")
						.replace(/@/g, "x40")
						.replace(/\[/g, "x5B")
						.replace(/\\/g, "x5C")
						.replace(/\]/g, "x5D")
						.replace(/\^/g, "x5E")
						.replace(/_/g, "x5F")
						.replace(/\{/g, "x7B")
						.replace(/\|/g, "x7C")
						.replace(/\}/g, "x7D")

					if(type == "Subjects") {
						iter.sname = str;
					}
					else if(type == "Topics") {
						iter.tname = str;
					}
					else if(type == "Sections") {
						iter.section_name = str;
					}
					else if(type == "Examples") {
						iter.ename = str;
					}
				}
			});
			exports.sidenav_modal_name_check(data);
		});
		$(".arrow").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id").split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") {
						return iter.sid ==
							parseInt(holder[2]);
					}
					else if(type == "Topics") {
						return iter.tid ==
							parseInt(holder[2]);
					}
					else if(type == "Sections") {
						return iter.section_id ==
							parseInt(holder[2]);
					}
					else if(type == "Examples") {
						return iter.eid ==
							parseInt(holder[2]);
					}
				}),
				str = "";
			if(holder[1] == "up" && obj_ref != 0) {
				var obj = data[obj_ref],
					obj_order = obj.order,
					table_item = 0;
				str = "#" + type.toLowerCase() + "_tr_";
				if(type == "Subjects") {
					table_item = $(str +
						data[obj_ref - 1].sid)
						.detach();
				}
				else if(type == "Topics") {
					table_item = $(str +
						data[obj_ref - 1].tid)
						.detach();
				}
				else if(type == "Sections") {
					table_item = $(str +
						data[obj_ref - 1].section_id)
						.detach();
				}
				else if(type == "Examples") {
					table_item = $(str +
						data[obj_ref - 1].eid)
						.detach();
				}
				$("#" + type.toLowerCase() + "_tr_"
					+ holder[2]).after(table_item);
				data[obj_ref] = data[obj_ref - 1];
				data[obj_ref - 1] = obj;
				data[obj_ref - 1].order =
					data[obj_ref].order;
				data[obj_ref].order = obj_order;
				data[obj_ref - 1].edited = 1;
				data[obj_ref].edited = 1;
			}
			else if(holder[1] == "down" && obj_ref
				!= data.length - 1) {
				var table_item = $("#" +
						type.toLowerCase() +
						"_tr_" + holder[2])
					.detach(),
					obj = data[obj_ref],
					obj_order = obj.order;
				str = "#" + type.toLowerCase()
					+ "_tr_";
				if(type == "Subjects") {
					$(str + data[obj_ref + 1].sid)
						.after(table_item);
				}
				else if(type == "Topics") {
					$(str + data[obj_ref + 1].tid)
						.after(table_item);
				}
				else if(type == "Sections") {
					$(str + data[obj_ref + 1].section_id)
						.after(table_item);
				}
				else if(type == "Examples") {
					$(str + data[obj_ref + 1].eid)
						.after(table_item);
				}
				data[obj_ref] = data[obj_ref + 1];
				data[obj_ref + 1] = obj;
				data[obj_ref + 1].order =
					data[obj_ref].order;
				data[obj_ref].order = obj_order;
				data[obj_ref + 1].edited = 1;
				data[obj_ref].edited = 1;
			}
		});
		$(".del").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id")
				.split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") {
						return iter.sid ==
							parseInt(holder[2]);
					}
					else if(type == "Topics") {
						return iter.tid ==
							parseInt(holder[2]);
					}
					else if(type == "Sections") {
						return iter.section_id ==
							parseInt(holder[2]);
					}
					else if(type == "Examples") {
						return iter.eid ==
							parseInt(holder[2]);
					}
				});
			if(exports.rgba_to_hex($("#" +
				type.toLowerCase() + "_delete_"
				+ holder[2]).css("color"))
				== "#ff0000") {
				$("#" + type.toLowerCase() +
					"_delete_" + holder[2])
					.css("color", "green");
				if(typeof data[obj_ref].del_approval
					== "object") { 
					data[obj_ref].del_approval =
						exports.read_cookie("contributor"); 
				}
				else {
					data[obj_ref].del_approval += "," +
						exports.read_cookie("contributor");
				}
			}
			else {
				$("#" + type.toLowerCase() +
					"_delete_" + holder[2])
					.css("color", "red");
				if(typeof data[obj_ref].del_approval
					!= "object") { 
					var start = data[obj_ref].del_approval
						.indexOf(exports.read_cookie(
							"contributor"));
					if(start != -1) {
						if(start != 0) {
							data[obj_ref].del_approval =
								data[obj_ref].del_approval
									.substring(0, start) + 
								data[obj_ref].del_approval
									.substring(start +
										exports.read_cookie(
											"contributor").length);
						}
						else {
							data[obj_ref].del_approval =
								data[obj_ref].del_approval
									.substring(exports.read_cookie(
										"contributor").length + 1);
						}
						if(data[obj_ref].del_approval == "") {
							data[obj_ref].del_approval = {};
						}
					}
				}
			}
			data[obj_ref].edited = 1;
		});
		$(".approve").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id")
				.split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") {
						return iter.sid ==
							parseInt(holder[2]);
					}
					else if(type == "Topics") {
						return iter.tid ==
							parseInt(holder[2]);
					}
					else if(type == "Sections") {
						return iter.section_id ==
							parseInt(holder[2]);
					}
					else if(type == "Examples") {
						return iter.eid ==
							parseInt(holder[2]);
					}
				});
			if(exports.rgba_to_hex($("#" +
				type.toLowerCase() + "_check_"
				+ holder[2]).css("color"))
				== "#ff0000") {
				$("#" + type.toLowerCase() +
					"_check_" + holder[2])
					.css("color", "green");
				if(typeof data[obj_ref].side_approval
					== "object") { 
					data[obj_ref].side_approval =
						exports.read_cookie("contributor"); 
				}
				else {
					data[obj_ref].side_approval += "," +
						exports.read_cookie("contributor");
				}
			}
			else {
				$("#" + type.toLowerCase() +
					"_check_" + holder[2])
					.css("color", "red");
				if(typeof data[obj_ref].side_approval
					!= "object") { 
					var start = data[obj_ref].side_approval
						.indexOf(exports.read_cookie(
							"contributor"));
					if(start != -1) {
						if(start != 0) {
							data[obj_ref].side_approval =
								data[obj_ref].side_approval
									.substring(0, start - 1) + 
								data[obj_ref].side_approval
									.substring(start +
										exports.read_cookie(
											"contributor").length);
						}
						else {
							data[obj_ref].side_approval =
								data[obj_ref].side_approval
									.substring(exports.read_cookie(
										"contributor").length + 1);
						}
						if(data[obj_ref].side_approval == "") {
							data[obj_ref].side_approval = {};
						}
					}
				}
			}
			data[obj_ref].edited = 1;
		});
		$(".garbage").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id")
				.split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") {
						return iter.sid ==
							parseInt(holder[2]);
					}
					else if(type == "Topics") {
						return iter.tid ==
							parseInt(holder[2]);
					}
					else if(type == "Sections") {
						return iter.section_id ==
							parseInt(holder[2]);
					}
					else if(type == "Examples") {
						return iter.eid ==
							parseInt(holder[2]);
					}
				});
			data = data.slice(0, obj_ref)
				.concat(data.slice(obj_ref + 1));
			$(this).parent().parent().remove();
			if(data.every(function(elem) {
				return elem.created == 0;
			})) {
				$("#garbage_head").remove();
			}
			exports.sidenav_modal_name_check(data);
		});
	};

	/*

	Purpose:
		Handles the sidenav modal that adds
		and changes data.

	Parameters:
		type: 
			A reference to the type of
			data being handled
		data:
			An array of the objects
			representing the type
			of data

	*/
	exports.sidenav_modal = function(type, container_id) {
		var data = [],
			statement = "",
			cookie = exports.read_cookie("contributor");
		if(type == "Subjects") {
			statement = "/api/subjects";
		}
		else if(type == "Topics") {
			statement = "/api/topics";
		}
		else if(type == "Sections") {
			statement = "/api/sections";
		}
		else if(type == "Examples") {
			statement = "/api/examples";
		}
		$.get(statement).done(function(all) {
			if(type == "Subjects") {
				data = all.map(function(elem) { 
					elem.edited = 0;
					elem.created = 0;
					return elem; 
				});
			}
			else if(type == "Topics") {
				data = all.filter(function(iter) {
					return iter.sid == container_id
				}).map(function(elem) { 
					elem.edited = 0;
					elem.created = 0;
					return elem; 
				});
			}
			else if(type == "Sections") {
				data = all.filter(function(iter) {
					return iter.tid == container_id
				}).map(function(elem) { 
					elem.edited = 0;
					elem.created = 0;
					return elem; 
				});
			}
			else if(type == "Examples") {
				data = all.filter(function(iter) {
					return iter.section_id == container_id
				}).map(function(elem) { 
					elem.edited = 0;
					elem.created = 0;
					return elem; 
				});
			}
			data.sort(function(a, b) { return a.order - b.order; });
			$.get("/pages/dist/modal-min.html").done(function(content) {
				$("body").append(content);
				$("#popup_title").text(type)
					.css("text-align", "center");
				$("#popup_submit").text("Save Changes")
					.removeClass("modal-close");
				$("#popup_modal_footer")
					.append($("<a>").attr("id", "popup_add")
						.addClass("waves-effect waves-blue btn-flat")
						.text("Add"))
					.append($("<a>").attr("id", "popup_exit")
						.addClass("modal-close waves-effect waves-blue btn-flat")
						.text("Exit"));
				$.get("/pages/dist/sidenav-change-min.html")
					.done(function(table) {
					var statement = "Below you will find all current " +
						type.toLowerCase() + " which can be renamed" + 
						" and reorganized. Furthermore, as a" +
						" contributor you can approve a subject" +
						" so that it will be available to users" +
						" on the client side, or similarly" +
						" disapprove if you feel that there is" + 
						" something wrong with it. With this" +
						" design, a subject will appear on" +
						" the client side only when enough" +
						" contributors have given approval." +
						" To change the approval of a subject" +
						" simply click on the checkmark and" +
						" note that the green color indicates" +
						" an approval from you. Likewise the" +
						" system also allows for a " +
						type.toLowerCase().substring(0, type.length - 1) +
						" to be deleted from the database when" +
						" enough contributors have given approval" +
						" for it.<br><br>Lastly for any " +
						type.toLowerCase().substring(0, type.length - 1) +
						" that has just been added, you remove it" +
						" without having to exit and clicking back" +
						" by clicking on the trash can icon."
					$("#popup_body").html(statement).append(table);
					data.forEach(function(elem) {
						var addon = -1;
						if(type == "Subjects") {
							addon = elem.sid;
						}
						else if(type == "Topics") {
							addon = elem.tid;
						}
						else if(type == "Sections") {
							addon = elem.section_id;
						}
						else if(type == "Examples") {
							addon = elem.eid;
						}
						var item_tr = $("<tr>").attr("id", type.toLowerCase()
								+ "_tr_" + addon),
							item_name = $("<td>").text(elem.clean_name)
								.addClass("field")
								.attr({
									contentEditable: "true",
									id: type.toLowerCase() + "_td_" + addon
								}),
							item_move = $("<td>").css("text-align", "center")
								.append($("<a>").attr("id", type.toLowerCase()
									+ "_up_" + addon).addClass("arrow")
									.css("cursor", "pointer")
									.append($("<i>").addClass("material-icons")
										.text("keyboard_arrow_up")))
								.append($("<a>").attr("id", type.toLowerCase()
									+ "_down_" + addon).addClass("arrow")
									.css("cursor", "pointer")
									.append($("<i>").addClass("material-icons")
										.text("keyboard_arrow_down"))),
							item_approve = $("<td>").css("text-align", "center")
								.append($("<a>")
									.css("cursor", "pointer")
									.attr("id", type.toLowerCase()
										+ "_check_" + addon)
									.addClass("approve center")
									.append($("<i>").addClass("material-icons")
										.text("check_circle"))),
							item_delete = $("<td>").css("text-align", "center")
								.append($("<a>")
									.css("cursor", "pointer")
									.attr("id", type.toLowerCase()
										+ "_delete_" + addon)
									.addClass("del center")
									.append($("<i>").addClass("material-icons")
										.text("cancel")));
						item_tr.append(item_name, item_move,
							item_approve, item_delete);
						$("#sidenav_table_body").append(item_tr);
						if(typeof elem.side_approval != "object" && 
							elem.side_approval.split(",").some(function(iter) {
								return iter == cookie;
							})) {
							$("#" + type.toLowerCase() + "_check_" + addon)
								.css("color", "green");
						}
						else {
							$("#" + type.toLowerCase() + "_check_" + addon)
								.css("color", "red");
						}
						if(typeof elem.del_approval != "object" && 
							elem.del_approval.split(",").some(function(iter) {
								return iter == cookie;
							})) {
							$("#" + type.toLowerCase() + "_delete_" + addon)
								.css("color", "green");
						}
						else {
							$("#" + type.toLowerCase() + "_delete_" + addon)
								.css("color", "red");
						}
					});
					$(".modal-trigger").leanModal({
						dismissible: false,
						opacity: 2,
						inDuration: 1000,
						outDuration: 1000
					});
					$("#popup_control").click();
					var popup = $("#popup")[0].outerHTML,
						popup_control = $("#popup_control")[0].outerHTML,
						overlay = $(".lean-overlay")[0].outerHTML;



					$(window).on("resize", function() {
						if(exports.width_func() >= 992) {
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							var controlWrap = $("<div>").html(popup_control),
								popupWrap = $("<div>").html(popup),
								overlayWrap = $("<div>").html(overlay);
							$("body").append(controlWrap.children().first(),
								popupWrap.children().first(),
								overlayWrap.children().first());
							$("#popup").find(".modal-content")
								.first().children()
								.each(function(index) {
								if(index > 1) {
									$(this).remove();
								}
							});
							$("#popup_body").append(table);
							if(data.some(function(elem) {
								return elem.created == 1
							})) {
								$("#sidenav_table_head").find("tr")
									.append($("<th>").attr("id", "garbage_head")
										.text("Remove"));
							}
							data.forEach(function(elem) {
								var addon = -1;
								if(type == "Subjects") {
									addon = elem.sid;
								}
								else if(type == "Topics") {
									addon = elem.tid;
								}
								else if(type == "Sections") {
									addon = elem.section_id;
								}
								else if(type == "Examples") {
									addon = elem.eid;
								}
								var item_tr = $("<tr>").attr("id", type.toLowerCase()
										+ "_tr_" + addon),
									item_name = $("<td>").text(elem.clean_name)
										.addClass("field")
										.attr({
											contentEditable: "true",
											id: type.toLowerCase() + "_td_" + addon
										}),
									item_move = $("<td>").css("text-align", "center")
										.append($("<a>").attr("id", type.toLowerCase()
											+ "_up_" + addon).addClass("arrow")
											.css("cursor", "pointer")
											.append($("<i>").addClass("material-icons")
												.text("keyboard_arrow_up")))
										.append($("<a>").attr("id", type.toLowerCase()
											+ "_down_" + addon).addClass("arrow")
											.css("cursor", "pointer")
											.append($("<i>").addClass("material-icons")
												.text("keyboard_arrow_down"))),
									item_approve = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase()
												+ "_check_" + addon)
											.addClass("approve center")
											.append($("<i>").addClass("material-icons")
												.text("check_circle"))),
									item_delete = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase()
												+ "_delete_" + addon)
											.addClass("del center")
											.append($("<i>").addClass("material-icons")
												.text("cancel")));
								if(elem.created == 1) {
									item_garbage = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase() +
												"_garbage_" + addon)
											.addClass("garbage center")
											.css("color", "red")
											.append($("<i>")
												.addClass("material-icons")
												.text("delete_sweep")));
									item_tr.append(item_name, item_move,
										item_approve, item_delete, item_garbage);
								}
								else {
									item_tr.append(item_name, item_move,
										item_approve, item_delete);
								}
								$("#sidenav_table_body").append(item_tr);
								if(typeof elem.side_approval != "object" && 
									elem.side_approval.split(",").some(function(iter) {
										return iter == cookie;
									})) {
									$("#" + type.toLowerCase() + "_check_" + addon)
										.css("color", "green");
								}
								else {
									$("#" + type.toLowerCase() + "_check_" + addon)
										.css("color", "red");
								}
								if(typeof elem.del_approval != "object" && 
									elem.del_approval.split(",").some(function(iter) {
										return iter == cookie;
									})) {
									$("#" + type.toLowerCase() + "_delete_" + addon)
										.css("color", "green");
								}
								else {
									$("#" + type.toLowerCase() + "_delete_" + addon)
										.css("color", "red");
								}
							});
							exports.sidenav_modal_name_check(data);
							$(".modal-trigger").leanModal({
								dismissible: false,
								opacity: 2,
								inDuration: 1000,
								outDuration: 1000
							});
							$("#popup").css({
								opacity: "1",
								transform: "scaleX(1)",
								top: "10%"
							});
							$(".lean-overlay").css("opacity", "2");
							$("#popup").keypress(function(event) {
							    if(event.keyCode === 10 || event.keyCode === 13) {
							        event.preventDefault();
							    }
							});
							$("#popup_exit").click(function(event) {
								event.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_add").click(function(e) {
								e.preventDefault();
								var addon = -1,
									order = -1,
									lhs = -1,
									rhs = -1,
									inp_cpy = exports.copy(all),
									dat_cpy = exports.copy(data);
								if(type == "Subjects") {
									lhs = inp_cpy.length != 0
										? inp_cpy.sort(function(a, b) { 
											return b.sid - a.sid; 
										})[0].sid + 1
										: 1,
									rhs = dat_cpy.length != 0
										? dat_cpy.sort(function(a, b) { 
											return b.sid - a.sid; 
										})[0].sid + 1
										: 1;
								}
								else if(type == "Topics") {
									lhs = inp_cpy.length != 0
										? inp_cpy.sort(function(a, b) { 
											return b.tid - a.tid; 
										})[0].tid + 1
										: 1,
									rhs = dat_cpy.length != 0
										? dat_cpy.sort(function(a, b) { 
											return b.tid - a.tid; 
										})[0].tid + 1
										: 1;
								}
								else if(type == "Sections") {
									lhs = inp_cpy.length != 0
										? inp_cpy.sort(function(a, b) { 
											return b.section_id - a.section_id; 
										})[0].section_id + 1
										: 1,
									rhs = dat_cpy.length != 0
										? dat_cpy.sort(function(a, b) { 
											return b.section_id - a.section_id; 
										})[0].section_id + 1
										: 1;
								}
								else if(type == "Examples") {
									lhs = inp_cpy.length != 0
										? inp_cpy.sort(function(a, b) { 
											return b.eid - a.eid; 
										})[0].eid + 1
										: 1,
									rhs = dat_cpy.length != 0
										? dat_cpy.sort(function(a, b) { 
											return b.eid - a.eid; 
										})[0].eid + 1
										: 1;
								}
								addon = Math.max(lhs, rhs);
								var new_tr = $("<tr>").attr("id",
										type.toLowerCase() + "_tr_" + addon),
									new_name = $("<td>").text("New "
										+ type.substring(0, type.length - 1))
										.addClass("field")
										.attr({
											contentEditable: "true",
											id: type.toLowerCase() +
												"_td_" + addon
										}),
									new_move = $("<td>").css("text-align", "center")
										.append($("<a>").attr("id",
											type.toLowerCase() + "_up_" + addon)
											.addClass("arrow")
											.css("cursor", "pointer")
											.append($("<i>").addClass("material-icons")
												.text("keyboard_arrow_up")))
										.append($("<a>").attr("id",
											type.toLowerCase() + "_down_" + addon)
											.addClass("arrow")
											.css("cursor", "pointer")
											.append($("<i>").addClass("material-icons")
												.text("keyboard_arrow_down"))),
									new_approve = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase()
												+ "_check_" + addon)
											.addClass("approve center")
											.css("color", "red")
											.append($("<i>")
												.addClass("material-icons")
												.text("check_circle"))),
									new_delete = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase()
												+ "_delete_" + addon)
											.addClass("del center")
											.css("color", "red")
											.append($("<i>")
												.addClass("material-icons")
												.text("cancel"))),
									new_garbage = $("<td>").css("text-align", "center")
										.append($("<a>")
											.css("cursor", "pointer")
											.attr("id", type.toLowerCase() +
												"_garbage_" + addon)
											.addClass("garbage center")
											.css("color", "red")
											.append($("<i>")
												.addClass("material-icons")
												.text("delete_sweep")));
								if(data.every(function(elem) {
									return elem.created == 0
								})) {
									$("#sidenav_table_head").find("tr")
										.append($("<th>").attr("id", "garbage_head")
											.text("Remove"));
								}
								new_tr.append(new_name, new_move,
									new_approve, new_delete, new_garbage);
								$("#sidenav_table_body").append(new_tr);
								data.length == 0 ? order = 1
									: order = data[data.length - 1].order + 1;
								if(type == "Subjects") {
									data.push({
										sid: addon,
										clean_name: "New " +
											type.substring(0, type.length - 1),
										sname: "Newx20" +
											type.substring(0, type.length - 1),
										order: order,
										topics: [],
										side_approval: {},
										del_approval: {},
										edited: 0,
										created: 1,
										status: 0
									});
								}
								else if(type == "Topics") {
									data.push({
										tid: addon,
										sid: container_id,
										clean_name: "New " +
											type.substring(0, type.length - 1),
										tname: "Newx20" +
											type.substring(0, type.length - 1),
										order: order,
										sections: [],
										side_approval: {},
										del_approval: {},
										edited: 0,
										created: 1,
										status: 0
									});
								}
								else if(type == "Sections") {
									data.push({
										section_id: addon,
										tid: container_id,
										clean_name: "New " +
											type.substring(0, type.length - 1),
										section_name: "Newx20" +
											type.substring(0, type.length - 1),
										order: order,
										examples: [],
										side_approval: {},
										del_approval: {},
										edited: 0,
										created: 1,
										status: 0
									});
								}
								else if(type == "Examples") {
									data.push({
										eid: addon,
										section_id: container_id,
										clean_name: "New " +
											type.substring(0, type.length - 1),
										ename: "Newx20" +
											type.substring(0, type.length - 1),
										order: order,
										side_approval: {},
										del_approval: {},
										edited: 0,
										created: 1,
										status: 0
									});
								}
								exports.sidenav_modal_links(type, data);
								exports.sidenav_modal_name_check(data);
							});
							exports.sidenav_modal_links(type, data);
							$("#popup_submit").click(function(event) {
								event.preventDefault();
								var statement = "";
								$.get("/api/cms/count/contributors")
									.done(function(num) {
									const validation = 
										Math.ceil(Math.log(parseInt(num)));
									$("#popup_submit").remove();
									$("#popup_modal_footer").append($("<a>")
										.attr("id", "popup_submit")
										.addClass("modal-close waves-effect waves-blue btn-flat")
										.text("Ok"));
									data.forEach(function(iter) {
										var id = -1,
											ref = -1,
											name = "";
										if(type == "Subjects") {
											id = iter.sid;
											name = iter.sname;
											ref = "undefined";
										}
										else if(type == "Topics") {
											id = iter.tid;
											name = iter.tname;
											ref = iter.sid;
										}
										else if(type == "Sections") {
											id = iter.section_id;
											name = iter.section_name;
											ref = iter.tid;
										}
										else if(type == "Examples") {
											id = iter.eid;
											name = iter.ename;
											ref = iter.section_id;
										}
										if(typeof iter.del_approval !="object" &&
											iter.del_approval.split(",")
											.length >= validation) {
											$.post("/api/delete/" +
												type.toLowerCase().substring(0,
													type.length - 1) + "/",
												{param: id})
											.fail(function(xhr, status, error) {
												console.log("Deleting the " +
													type.toLowerCase().substring(0,
														type.length - 1) +
													" with id " + id +
													" failed with the error: " +
													error);
											});
										}
										else {
											if(typeof iter.del_approval == "object" ||
												iter.del_approval == "") {
												iter.del_approval = "0";
											}
											if(typeof iter.side_approval == "object" ||
												iter.side_approval == "") {
												iter.side_approval = "0";
											}
											var obj = {
												param: id,
												ref: ref,
												name: name,
												order: iter.order,
												title: "undefined",
												content: "undefined",
												side_approval: iter.side_approval,
												cms_approval: "undefined",
												del_approval: iter.del_approval,
												title_cms: "undefined",
												content_cms: "undefined"
											};
											if(iter.status == 0 && typeof
												iter.side_approval !== "object") {
												iter.side_approval != "0" &&
													iter.side_approval.split(",").length 
														>= validation
													? obj.status = 1 : obj.status = 0;
											}
											else {
												obj.status = 1;
											}
											if(iter.created == 1) {
												statement = "/api/add/";
												if(type == "Subjects") {
													statement += "subject/";
												}
												else if(type == "Topics") {
													statement += "topic/";
												}
												else if(type == "Sections") {
													statement += "section/";
												}
												else if(type == "Examples") {
													statement += "example/";
												}
												$.post(statement, obj)
													.fail(function() {
													$("#popup_title").text("Database Issue");
													if(type == "Subjects") {
														$("#popup_body").text("There was" +
															" an issue uploading the new" +
															" subject(s) to the database!");
													}
													else if(type == "Topics") {
														$("#popup_body").text("There was" +
															" an issue uploading the new" +
															" topic(s) to the database!");
													}
													else if(type == "Sections") {
														$("#popup_body").text("There was" +
															" an issue uploading the new" +
															" section(s) to the database!");
													}
													else if(type == "Examples") {
														$("#popup_body").text("There was" +
															" an issue uploading the new" +
															" example(s) to the database!");
													}
													$("#popup_exit").remove();
													$("#popup_add").remove();
													var popup = $("#popup")[0].outerHTML,
														popup_control = $("#popup_control")[0].outerHTML,
														overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																location.reload();
																$(window).scrollTop(0);
															});
														}
													});
													$("#popup_submit").text("Ok")
														.click(function(e) {
															e.preventDefault();
															location.reload();
															$(window).scrollTop(0);
													});
												}).done(function() {
													$.post("/api/log/want/" +
														type.toLowerCase()
														.substring(0, type.length - 1),
														{id: id}).done(function(log) {
														if(log === null) { log = ""; }
														var now = new Date()
																.toLocaleString("en-US",
																	{timeZone: "UTC"}),
															change = "The " + type.toLowerCase()
																.substring(0, type.length - 1) +
																" " + iter.clean_name + " was " +
																"officially created by the " +
																"contributor " + cookie + ".";
														if(log != "") {
															log += "-----";
														}
														log += now + "_____" + change;
														if(iter.status == 0 && obj.status == 1) {
															change = "The " + type.toLowerCase()
																.substring(0, type.length - 1) +
																" " + iter.clean_name + " has " +
																"gained permanent sidenav approval.";
															log += "-----" + now + "_____" + change;
														}
														$.post("/api/log/change/" +
															type.toLowerCase()
															.substring(0, type.length - 1), {
																id: id,
																log: log
														});
													});
												});
											}
											if(iter.edited == 1 && iter.created == 0) {
												statement = "/api/change/";
												if(type == "Subjects") {
													statement += "subject/";
												}
												else if(type == "Topics") {
													statement += "topic/";
												}
												else if(type == "Sections") {
													statement += "section/";
												}
												else if(type == "Examples") {
													statement += "example/";
												}
												$.post(statement, obj).fail(function() {
													$("#popup_title").text("Database Issue");
													if(type == "Subjects") {
														$("#popup_body").text("There was an" +
															" issue uploading the subject" +
															" changes to the database!");
													}
													else if(type == "Topics") {
														$("#popup_body").text("There was an" +
															" issue uploading the topic" +
															" changes to the database!");
													}
													else if(type == "Sections") {
														$("#popup_body").text("There was an" +
															" issue uploading the section" +
															" changes to the database!");
													}
													else if(type == "Examples") {
														$("#popup_body").text("There was an" +
															" issue uploading the example" +
															" changes to the database!");
													}
													$("#popup_exit").remove();
													$("#popup_add").remove();
													var popup = $("#popup")[0].outerHTML,
														popup_control = $("#popup_control")[0].outerHTML,
														overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																location.reload();
																$(window).scrollTop(0);
															});
														}
													});
													$("#popup_submit").text("Ok")
														.click(function(e) {
															e.preventDefault();
															location.reload();
															$(window).scrollTop(0);
													});
												}).done(function() {
													$.post("/api/log/want/" +
														type.toLowerCase()
														.substring(0, type.length - 1),
														{id: id}).done(function(log) {
														if(log === null) { log = ""; }
														var now = new Date()
																.toLocaleString("en-US",
																	{timeZone: "UTC"}),
															change = "The " + type.toLowerCase()
																.substring(0, type.length - 1) +
																" " + iter.clean_name + " had " +
																"its sidenav information " +
																"edited by the contributor " +
																cookie + ".";
														if(log != "") {
															log += "-----";
														}
														log += now + "_____" + change;
														if(iter.status == 0 && obj.status == 1) {
															change = "The " + type.toLowerCase()
																.substring(0, type.length - 1) +
																" " + iter.clean_name + " has " +
																"gained permanent sidenav approval.";
															log += "-----" + now + "_____" + change;
														}
														$.post("/api/log/change/" +
															type.toLowerCase()
															.substring(0, type.length - 1), {
																id: id,
																log: log
														});
													});
												});
											}
										}
									});
								}).done(function() {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title").text("Changes Saved")
										.css("text-align", "center");
									$("#popup_body").text("All changes have" +
										" been saved to the database!");
									$("#popup_exit").remove();
									$("#popup_add").remove();
									var popup = $("#popup")[0].outerHTML,
										popup_control = $("#popup_control")[0].outerHTML,
										overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												location.reload();
												$(window).scrollTop(0);
											});
										}
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
								});
							});
						}
					});
					$("#popup").keypress(function(event) {
					    if(event.keyCode === 10 || event.keyCode === 13) {
					        event.preventDefault();
					    }
					});
					$("#popup_exit").click(function(event) {
						event.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).off();
						exports.resize_modal();
					});
					$("#popup_add").click(function(e) {
						e.preventDefault();
						var addon = -1,
							order = -1,
							lhs = -1,
							rhs = -1,
							inp_cpy = exports.copy(all),
							dat_cpy = exports.copy(data);
						if(type == "Subjects") {
							lhs = inp_cpy.length != 0
								? inp_cpy.sort(function(a, b) { 
									return b.sid - a.sid; 
								})[0].sid + 1
								: 1,
							rhs = dat_cpy.length != 0
								? dat_cpy.sort(function(a, b) { 
									return b.sid - a.sid; 
								})[0].sid + 1
								: 1;
						}
						else if(type == "Topics") {
							lhs = inp_cpy.length != 0
								? inp_cpy.sort(function(a, b) { 
									return b.tid - a.tid; 
								})[0].tid + 1
								: 1,
							rhs = dat_cpy.length != 0
								? dat_cpy.sort(function(a, b) { 
									return b.tid - a.tid; 
								})[0].tid + 1
								: 1;
						}
						else if(type == "Sections") {
							lhs = inp_cpy.length != 0
								? inp_cpy.sort(function(a, b) { 
									return b.section_id - a.section_id; 
								})[0].section_id + 1
								: 1,
							rhs = dat_cpy.length != 0
								? dat_cpy.sort(function(a, b) { 
									return b.section_id - a.section_id; 
								})[0].section_id + 1
								: 1;
						}
						else if(type == "Examples") {
							lhs = inp_cpy.length != 0
								? inp_cpy.sort(function(a, b) { 
									return b.eid - a.eid; 
								})[0].eid + 1
								: 1,
							rhs = dat_cpy.length != 0
								? dat_cpy.sort(function(a, b) { 
									return b.eid - a.eid; 
								})[0].eid + 1
								: 1;
						}
						addon = Math.max(lhs, rhs);
						var new_tr = $("<tr>").attr("id",
								type.toLowerCase() + "_tr_" + addon),
							new_name = $("<td>").text("New "
								+ type.substring(0, type.length - 1))
								.addClass("field")
								.attr({
									contentEditable: "true",
									id: type.toLowerCase() +
										"_td_" + addon
								}),
							new_move = $("<td>").css("text-align", "center")
								.append($("<a>").attr("id",
									type.toLowerCase() + "_up_" + addon)
									.addClass("arrow")
									.css("cursor", "pointer")
									.append($("<i>").addClass("material-icons")
										.text("keyboard_arrow_up")))
								.append($("<a>").attr("id",
									type.toLowerCase() + "_down_" + addon)
									.addClass("arrow")
									.css("cursor", "pointer")
									.append($("<i>").addClass("material-icons")
										.text("keyboard_arrow_down"))),
							new_approve = $("<td>").css("text-align", "center")
								.append($("<a>")
									.css("cursor", "pointer")
									.attr("id", type.toLowerCase()
										+ "_check_" + addon)
									.addClass("approve center")
									.css("color", "red")
									.append($("<i>")
										.addClass("material-icons")
										.text("check_circle"))),
							new_delete = $("<td>").css("text-align", "center")
								.append($("<a>")
									.css("cursor", "pointer")
									.attr("id", type.toLowerCase()
										+ "_delete_" + addon)
									.addClass("del center")
									.css("color", "red")
									.append($("<i>")
										.addClass("material-icons")
										.text("cancel"))),
							new_garbage = $("<td>").css("text-align", "center")
								.append($("<a>")
									.css("cursor", "pointer")
									.attr("id", type.toLowerCase() +
										"_garbage_" + addon)
									.addClass("garbage center")
									.css("color", "red")
									.append($("<i>")
										.addClass("material-icons")
										.text("delete_sweep")));
						if(data.every(function(elem) {
							return elem.created == 0
						})) {
							$("#sidenav_table_head").find("tr")
								.append($("<th>").attr("id", "garbage_head")
									.text("Remove"));
						}
						new_tr.append(new_name, new_move,
							new_approve, new_delete, new_garbage);
						$("#sidenav_table_body").append(new_tr);
						data.length == 0 ? order = 1
							: order = data[data.length - 1].order + 1;
						if(type == "Subjects") {
							data.push({
								sid: addon,
								clean_name: "New " +
									type.substring(0, type.length - 1),
								sname: "Newx20" +
									type.substring(0, type.length - 1),
								order: order,
								topics: [],
								side_approval: {},
								del_approval: {},
								edited: 0,
								created: 1,
								status: 0
							});
						}
						else if(type == "Topics") {
							data.push({
								tid: addon,
								sid: container_id,
								clean_name: "New " +
									type.substring(0, type.length - 1),
								tname: "Newx20" +
									type.substring(0, type.length - 1),
								order: order,
								sections: [],
								side_approval: {},
								del_approval: {},
								edited: 0,
								created: 1,
								status: 0
							});
						}
						else if(type == "Sections") {
							data.push({
								section_id: addon,
								tid: container_id,
								clean_name: "New " +
									type.substring(0, type.length - 1),
								section_name: "Newx20" +
									type.substring(0, type.length - 1),
								order: order,
								examples: [],
								side_approval: {},
								del_approval: {},
								edited: 0,
								created: 1,
								status: 0
							});
						}
						else if(type == "Examples") {
							data.push({
								eid: addon,
								section_id: container_id,
								clean_name: "New " +
									type.substring(0, type.length - 1),
								ename: "Newx20" +
									type.substring(0, type.length - 1),
								order: order,
								side_approval: {},
								del_approval: {},
								edited: 0,
								created: 1,
								status: 0
							});
						}
						exports.sidenav_modal_links(type, data);
						exports.sidenav_modal_name_check(data);
					});
					exports.sidenav_modal_links(type, data);
					$("#popup_submit").click(function(event) {
						event.preventDefault();
						var statement = "";
						$.get("/api/cms/count/contributors")
							.done(function(num) {
							const validation = 
								Math.ceil(Math.log(parseInt(num)));
							$("#popup_submit").remove();
							$("#popup_modal_footer").append($("<a>")
								.attr("id", "popup_submit")
								.addClass("modal-close waves-effect waves-blue btn-flat")
								.text("Ok"));
							data.forEach(function(iter) {
								var id = -1,
									ref = -1,
									name = "";
								if(type == "Subjects") {
									id = iter.sid;
									name = iter.sname;
									ref = "undefined";
								}
								else if(type == "Topics") {
									id = iter.tid;
									name = iter.tname;
									ref = iter.sid;
								}
								else if(type == "Sections") {
									id = iter.section_id;
									name = iter.section_name;
									ref = iter.tid;
								}
								else if(type == "Examples") {
									id = iter.eid;
									name = iter.ename;
									ref = iter.section_id;
								}
								if(typeof iter.del_approval !="object" &&
									iter.del_approval.split(",")
									.length >= validation) {
									$.post("/api/delete/" +
										type.toLowerCase().substring(0,
											type.length - 1) + "/",
										{param: id})
									.fail(function(xhr, status, error) {
										console.log("Deleting the " +
											type.toLowerCase().substring(0,
												type.length - 1) +
											" with id " + id +
											" failed with the error: " +
											error);
									});
								}
								else {
									if(typeof iter.del_approval == "object" ||
										iter.del_approval == "") {
										iter.del_approval = "0";
									}
									if(typeof iter.side_approval == "object" ||
										iter.side_approval == "") {
										iter.side_approval = "0";
									}
									var obj = {
										param: id,
										ref: ref,
										name: name,
										order: iter.order,
										title: "undefined",
										content: "undefined",
										side_approval: iter.side_approval,
										cms_approval: "undefined",
										del_approval: iter.del_approval,
										title_cms: "undefined",
										content_cms: "undefined"
									};
									if(iter.status == 0 && typeof
										iter.side_approval !== "object") {
										iter.side_approval != "0" &&
											iter.side_approval.split(",").length 
												>= validation
											? obj.status = 1 : obj.status = 0;
									}
									else {
										obj.status = 1;
									}
									if(iter.created == 1) {
										statement = "/api/add/";
										if(type == "Subjects") {
											statement += "subject/";
										}
										else if(type == "Topics") {
											statement += "topic/";
										}
										else if(type == "Sections") {
											statement += "section/";
										}
										else if(type == "Examples") {
											statement += "example/";
										}
										$.post(statement, obj)
											.fail(function() {
											$("#popup_title").text("Database Issue");
											if(type == "Subjects") {
												$("#popup_body").text("There was" +
													" an issue uploading the new" +
													" subject(s) to the database!");
											}
											else if(type == "Topics") {
												$("#popup_body").text("There was" +
													" an issue uploading the new" +
													" topic(s) to the database!");
											}
											else if(type == "Sections") {
												$("#popup_body").text("There was" +
													" an issue uploading the new" +
													" section(s) to the database!");
											}
											else if(type == "Examples") {
												$("#popup_body").text("There was" +
													" an issue uploading the new" +
													" example(s) to the database!");
											}
											$("#popup_exit").remove();
											$("#popup_add").remove();
											var popup = $("#popup")[0].outerHTML,
												popup_control = $("#popup_control")[0].outerHTML,
												overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														location.reload();
														$(window).scrollTop(0);
													});
												}
											});
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													location.reload();
													$(window).scrollTop(0);
											});
										}).done(function() {
											$.post("/api/log/want/" +
												type.toLowerCase()
												.substring(0, type.length - 1),
												{id: id}).done(function(log) {
												if(log === null) { log = ""; }
												var now = new Date()
														.toLocaleString("en-US",
															{timeZone: "UTC"}),
													change = "The " + type.toLowerCase()
														.substring(0, type.length - 1) +
														" " + iter.clean_name + " was " +
														"officially created by the " +
														"contributor " + cookie + ".";
												if(log != "") {
													log += "-----";
												}
												log += now + "_____" + change;
												if(iter.status == 0 && obj.status == 1) {
													change = "The " + type.toLowerCase()
														.substring(0, type.length - 1) +
														" " + iter.clean_name + " has " +
														"gained permanent sidenav approval.";
													log += "-----" + now + "_____" + change;
												}
												$.post("/api/log/change/" +
													type.toLowerCase()
													.substring(0, type.length - 1), {
														id: id,
														log: log
												});
											});
										});
									}
									if(iter.edited == 1 && iter.created == 0) {
										statement = "/api/change/";
										if(type == "Subjects") {
											statement += "subject/";
										}
										else if(type == "Topics") {
											statement += "topic/";
										}
										else if(type == "Sections") {
											statement += "section/";
										}
										else if(type == "Examples") {
											statement += "example/";
										}
										$.post(statement, obj).fail(function() {
											$("#popup_title").text("Database Issue");
											if(type == "Subjects") {
												$("#popup_body").text("There was an" +
													" issue uploading the subject" +
													" changes to the database!");
											}
											else if(type == "Topics") {
												$("#popup_body").text("There was an" +
													" issue uploading the topic" +
													" changes to the database!");
											}
											else if(type == "Sections") {
												$("#popup_body").text("There was an" +
													" issue uploading the section" +
													" changes to the database!");
											}
											else if(type == "Examples") {
												$("#popup_body").text("There was an" +
													" issue uploading the example" +
													" changes to the database!");
											}
											$("#popup_exit").remove();
											$("#popup_add").remove();
											var popup = $("#popup")[0].outerHTML,
												popup_control = $("#popup_control")[0].outerHTML,
												overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														location.reload();
														$(window).scrollTop(0);
													});
												}
											});
											$("#popup_submit").text("Ok")
												.click(function(e) {
													e.preventDefault();
													location.reload();
													$(window).scrollTop(0);
											});
										}).done(function() {
											$.post("/api/log/want/" +
												type.toLowerCase()
												.substring(0, type.length - 1),
												{id: id}).done(function(log) {
												if(log === null) { log = ""; }
												var now = new Date()
														.toLocaleString("en-US",
															{timeZone: "UTC"}),
													change = "The " + type.toLowerCase()
														.substring(0, type.length - 1) +
														" " + iter.clean_name + " had " +
														"its sidenav information " +
														"edited by the contributor " +
														cookie + ".";
												if(log != "") {
													log += "-----";
												}
												log += now + "_____" + change;
												if(iter.status == 0 && obj.status == 1) {
													change = "The " + type.toLowerCase()
														.substring(0, type.length - 1) +
														" " + iter.clean_name + " has " +
														"gained permanent sidenav approval.";
													log += "-----" + now + "_____" + change;
												}
												$.post("/api/log/change/" +
													type.toLowerCase()
													.substring(0, type.length - 1), {
														id: id,
														log: log
												});
											});
										});
									}
								}
							});
						}).done(function() {
							$("#popup").find(".modal-content")
								.first().children()
								.each(function(index) {
								if(index > 1) {
									$(this).remove();
								}
							});
							$("#popup_title").text("Changes Saved")
								.css("text-align", "center");
							$("#popup_body").text("All changes have" +
								" been saved to the database!");
							$("#popup_exit").remove();
							$("#popup_add").remove();
							var popup = $("#popup")[0].outerHTML,
								popup_control = $("#popup_control")[0].outerHTML,
								overlay = $(".lean-overlay")[0].outerHTML;
							$(window).on("resize", function() {
								if(exports.width_func() >= 992) {
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									var controlWrap = $("<div>").html(popup_control),
										popupWrap = $("<div>").html(popup),
										overlayWrap = $("<div>").html(overlay);
									$("body").append(controlWrap.children().first(),
										popupWrap.children().first(),
										overlayWrap.children().first());
									$("#popup").css({
										opacity: "1",
										transform: "scaleX(1)",
										top: "10%"
									});
									$(".lean-overlay").css("opacity", "2");
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
								}
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								location.reload();
								$(window).scrollTop(0);
							});
						});
					});
				});
			});
		});
	};

	/*

	Purpose:
		Handles all of the modal changes for the cms
		contributor profile.

	Parameters:
		email: 
			Current contributor's email

	*/
	exports.profile_modal = function(email) {
		$.get("/pages/dist/contributor-profile-min.html")
			.done(function(content) {
			$("#popup_title").text("Profile")
				.css("text-align", "center");
			$("#popup_submit").text("Save Changes");
			$("#popup_body").append(content);
			$("#popup_submit").removeClass("modal-close");
			$("#popup_modal_footer").append($("<a>")
				.attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Exit"));
			$.post("/api/cms/contributor/profile/", {email: email})
				.done(function(information) {
				$("#first_name_cms").val(information.first_name);
				$("#last_name_cms").val(information.last_name);
				$("#question_cms").val(information.question);
				Materialize.updateTextFields();
				$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
				$("select").material_select();
				$("#popup_control").click();
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML,
					firstNameCMS = undefined,
					lastNameCMS = undefined,
					passwordCMS = undefined,
					answerCMS = undefined,
					questionCMS = undefined;
				$("#first_name_cms").on("input", function() {
					firstNameCMS = $(this).val();
				});
				$("#last_name_cms").on("input", function() {
					lastNameCMS = $(this).val();
				});
				$("#password_cms").on("input", function() {
					passwordCMS = $(this).val();
				});
				$("#answer_cms").on("input", function() {
					answerCMS = $(this).val();
				});
				$("#question_cms").on("change", function() {
					questionCMS = $(this).val();
				});
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#first_name_cms").val(firstNameCMS !== undefined
							? firstNameCMS : information.first_name);
						$("#last_name_cms").val(lastNameCMS !== undefined
							? lastNameCMS : information.last_name);
						$("#password_cms").val(passwordCMS !== undefined
							? passwordCMS : "");
						$("#answer_cms").val(answerCMS !== undefined
							? answerCMS : "");
						$("#question_cms").val(questionCMS !== undefined
							? questionCMS : information.question);
						var logo = $("#question_cms").parent().prev(),
							questions = $("#question_cms").detach();
						logo.next().remove();
						logo.after(questions);
						$("select").material_select();
						Materialize.updateTextFields();
						$(".material-icons").removeClass("active");
						$("#first_name_cms").on("input", function() {
							firstNameCMS = $(this).val();
						});
						$("#last_name_cms").on("input", function() {
							lastNameCMS = $(this).val();
						});
						$("#password_cms").on("input", function() {
							passwordCMS = $(this).val();
						});
						$("#answer_cms").on("input", function() {
							answerCMS = $(this).val();
						});
						$("#question_cms").on("change", function() {
							questionCMS = $(this).val();
						});
						$("#popup").keypress(function(event) {
						    if(event.keyCode === 10 ||
						    	event.keyCode === 13) {
						        event.preventDefault();
						    }
						});
						$("#popup_exit").click(function(event) {
							event.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$("body").css("overflow", "auto");
							$(window).off();
							exports.resize_modal();
						});
						$("#popup_submit").click(function(event) {
							event.preventDefault();
							var fname = firstNameCMS !== undefined ?
									firstNameCMS[0].toUpperCase() +
									firstNameCMS.slice(1).toLowerCase() :
									information.first_name,
								lname = lastNameCMS !== undefined ?
									lastNameCMS[0].toUpperCase() +
									lastNameCMS.slice(1).toLowerCase() :
									information.last_name,
								question = (parseInt($("#question_cms")[0]
									.options.selectedIndex) + 1),
								answer = answerCMS,
								new_password = passwordCMS;
							$.get("/pages/dist/change-confirmation-min.html")
								.done(function(material) {
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								if(passwordCMS === undefined || passwordCMS == "") {
									$("#popup_title").text("Profile Changes")
										.css("text-align", "center");
									$("#popup_body").text("Please confirm" +
										" the changes provided by providing" +
										" your password:")
										.append(material);
									$("#popup_submit").remove();
									$("#popup_exit").remove();
									$("#popup_modal_footer").append($("<a>")
										.attr("id", "popup_submit")
										.addClass("waves-effect waves-blue btn-flat")
										.text("Confirm"))
										.append($("<a>")
											.attr("id", "popup_exit")
											.addClass("modal-close waves-effect waves-blue btn-flat")
											.text("Exit"));
									$("#new_password_confirm")
										.closest(".row").remove();
									$("#old_password_label")
										.text("Password");
									$("#popup_submit")
										.css("pointer-events", "none");
									var oldPassword = undefined;
									popup = $("#popup")[0].outerHTML;
									popup_control = $("#popup_control")[0].outerHTML;
									overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#old_password_confirm").val(oldPassword !== undefined
												? oldPassword : "");
											Materialize.updateTextFields();
											$(".material-icons").removeClass("active");
											$("#old_password_confirm").on("input", function() {
												oldPassword = $("#old_password_confirm").val();
												if(oldPassword.length > 0) {
													$("#popup_submit")
														.css("pointer-events", "auto");
												}
												else {
													$("#popup_submit")
														.css("pointer-events", "none");
												}
												popup = $("#popup")[0].outerHTML;
											});
											$("#popup_exit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$("#popup").find(".modal-content")
													.first().children()
													.each(function(index) {
													if(index > 1) {
														$(this).remove();
													}
												});
												$.post("/api/cms/check/login/", {
													email: email,
													passwd: oldPassword
												}).done(function(result) {
													$("#popup_submit")
														.addClass("modal-close");
													$("#popup_exit").remove();
													if(result[0] == "Wrong Password") {
														$("#popup_title")
															.text("Password Issue");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The password" +
															" you provided did not match" +
															" the one in the database!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
													else if(fname.length == 0 ||
														/[^a-zA-Z]/.test(fname)) {
														$("#popup_title")
															.text("First Name Issue");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The first name" +
															" cannot be left empty or contain" +
															" an invalid character!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
													else if(lname.length == 0 ||
														/[^a-zA-Z]/.test(lname)) {
														$("#popup_title")
															.text("Last Name Issue");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The last name" +
															" cannot be left empty or" +
															" contain an invalid character!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
													else {
														$.post("/api/cms/contributor/change/profile/", {
															email: email,
															fname: fname,
															lname: lname,
															question: question,
															answer: answer
														}).done(function(result) {
														 	if(result == "1") {
																$("#popup_title")
																	.text("Confirmation");
																$("#popup_submit").remove();
																$("#popup_exit").remove();
																$("#popup_modal_footer")
																	.append($("<a>")
																		.attr("id", "popup_submit")
																		.addClass("waves-effect waves-blue btn-flat")
																		.text("Exit"));
																$("#popup_body").text("The changes" +
																	" you provided have" +
																	" been implemented!");
																popup = $("#popup")[0].outerHTML;
																popup_control = $("#popup_control")[0].outerHTML;
																overlay = $(".lean-overlay")[0].outerHTML;
																$(window).on("resize", function() {
																	if(exports.width_func() >= 992) {
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		var controlWrap = $("<div>").html(popup_control),
																			popupWrap = $("<div>").html(popup),
																			overlayWrap = $("<div>").html(overlay);
																		$("body").append(controlWrap.children().first(),
																			popupWrap.children().first(),
																			overlayWrap.children().first());
																		$("#popup").css({
																			opacity: "1",
																			transform: "scaleX(1)",
																			top: "10%"
																		});
																		$(".lean-overlay").css("opacity", "2");
																		$("#popup_submit").click(function(e) {
																			e.preventDefault();
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			$("body").css("overflow", "auto");
																			$(window).off();
																			exports.resize_modal();
																		});
																	}
																});
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
															else {
																$("#popup_title")
																	.text("Database Issue");
																$("#popup_submit").remove();
																$("#popup_exit").remove();
																$("#popup_modal_footer")
																	.append($("<a>")
																		.attr("id", "popup_submit")
																		.addClass("waves-effect waves-blue btn-flat")
																		.text("Exit"));
																$("#popup_body").text("The changes" +
																	" you provided had trouble" + 
																	" being uploaded to the database!");
																popup = $("#popup")[0].outerHTML;
																popup_control = $("#popup_control")[0].outerHTML;
																overlay = $(".lean-overlay")[0].outerHTML;
																$(window).on("resize", function() {
																	if(exports.width_func() >= 992) {
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		var controlWrap = $("<div>").html(popup_control),
																			popupWrap = $("<div>").html(popup),
																			overlayWrap = $("<div>").html(overlay);
																		$("body").append(controlWrap.children().first(),
																			popupWrap.children().first(),
																			overlayWrap.children().first());
																		$("#popup").css({
																			opacity: "1",
																			transform: "scaleX(1)",
																			top: "10%"
																		});
																		$(".lean-overlay").css("opacity", "2");
																		$("#popup_submit").click(function(e) {
																			e.preventDefault();
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			$("body").css("overflow", "auto");
																			$(window).off();
																			exports.resize_modal();
																		});
																	}
																});
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
													}
												});
											});
										}
									});
									$("#old_password_confirm").on("input", function() {
										oldPassword = $("#old_password_confirm").val();
										if(oldPassword.length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#popup_exit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$.post("/api/cms/check/login/", {
											email: email,
											passwd: oldPassword
										}).done(function(result) {
											$("#popup_submit")
												.addClass("modal-close");
											$("#popup_exit").remove();
											if(result[0] == "Wrong Password") {
												$("#popup_title")
													.text("Password Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The password" +
													" you provided did not match" +
													" the one in the database!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else if(fname.length == 0 ||
												/[^a-zA-Z]/.test(fname)) {
												$("#popup_title")
													.text("First Name Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The first name" +
													" cannot be left empty or contain" +
													" an invalid character!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else if(lname.length == 0 ||
												/[^a-zA-Z]/.test(lname)) {
												$("#popup_title")
													.text("Last Name Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The last name" +
													" cannot be left empty or" +
													" contain an invalid character!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else {
												$.post("/api/cms/contributor/change/profile/", {
													email: email,
													fname: fname,
													lname: lname,
													question: question,
													answer: answer
												}).done(function(result) {
												 	if(result == "1") {
														$("#popup_title")
															.text("Confirmation");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The changes" +
															" you provided have" +
															" been implemented!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
													else {
														$("#popup_title")
															.text("Database Issue");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The changes" +
															" you provided had trouble" + 
															" being uploaded to the database!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
											}
										});
									});
								}
								else if(exports.password_check(
									passwordCMS)) {
									$("#popup_title").text("Profile Changes")
										.css("text-align", "center");
									$("#popup_body").text("Please confirm" +
										" the changes provided by" +
										" providing both the old" +
										" and new passwords:")
										.append(material);
									$("#popup_submit").remove();
									$("#popup_exit").remove();
									$("#popup_modal_footer")
										.append($("<a>")
											.attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat")
											.text("Confirm"))
										.append($("<a>")
											.attr("id", "popup_exit")
											.addClass("modal-close waves-effect waves-blue btn-flat")
											.text("Exit"));
									$("#popup_submit")
										.css("pointer-events", "none");
									var oldPassword = undefined,
										newPassword = undefined;
									popup = $("#popup")[0].outerHTML;
									popup_control = $("#popup_control")[0].outerHTML;
									overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#old_password_confirm").val(oldPassword !== undefined
												? oldPassword : "");
											$("#new_password_confirm").val(newPassword !== undefined
												? newPassword : "");
											Materialize.updateTextFields();
											$(".material-icons").removeClass("active");
											$("#old_password_confirm").on("input", function() {
												oldPassword = $("#old_password_confirm").val();
												if(oldPassword.length > 0 &&
													$("#new_password_confirm").val().length > 0) {
													$("#popup_submit")
														.css("pointer-events", "auto");
												}
												else {
													$("#popup_submit")
														.css("pointer-events", "none");
												}
												popup = $("#popup")[0].outerHTML;
											});
											$("#new_password_confirm").on("input", function() {
												newPassword = $("#new_password_confirm").val();
												if($("#old_password_confirm").val().length > 0 &&
													newPassword.length > 0) {
													$("#popup_submit")
														.css("pointer-events", "auto");
												}
												else {
													$("#popup_submit")
														.css("pointer-events", "none");
												}
												popup = $("#popup")[0].outerHTML;
											});
											$("#popup_exit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												if(new_password !=
													$("#new_password_confirm").val()) {
													$("#popup").find(".modal-content")
														.first().children()
														.each(function(index) {
														if(index > 1) {
															$(this).remove();
														}
													});
													$("#popup_title")
														.text("Password Issue");
													$("#popup_submit").remove();
													$("#popup_exit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("waves-effect waves-blue btn-flat")
															.text("Exit"));
													$("#popup_body").text("The new" +
														" password provided for" +
														" confirmation does not" +
														" match the previous" +
														" password change!");
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
												else {
													$.post("/api/cms/check/login/", {
														email: email,
														passwd: oldPassword
													}).done(function(result) {
														if(result[0] == "Wrong Password") {
															$("#popup_title")
																.text("Password Issue");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("waves-effect waves-blue btn-flat")
																	.text("Exit"));
															$("#popup_body").text("The old" +
																" password provided for" +
																" confirmation does not" +
																" match the one in the" +
																" database!");
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
														else {
															$.post("/api/cms/contributor/change/profile/", {
																email: email,
																fname: fname,
																lname: lname,
																question: question,
																answer: answer
															}).done(function(result) {
															 	if(result == "1") {
																	$.post("/api/cms/contributor/change" +
																		"/password/", {
																		email: email,
																		password: new_password
																	}).done(function(result) {
																	 	if(result == "1") {
																	 		$("#popup").find(".modal-content")
																	 			.first().children()
																	 			.each(function(index) {
																				if(index > 1) {
																					$(this).remove();
																				}
																			});
																			$("#popup_title")
																				.text("Confirmation");
																			$("#popup_submit").remove();
																			$("#popup_exit").remove();
																			$("#popup_modal_footer")
																				.append($("<a>")
																					.attr("id", "popup_submit")
																					.addClass("waves-effect waves-blue btn-flat")
																					.text("Exit"));
																			$("#popup_body").text("The" +
																				" changes you provided" +
																				" have been implemented!");
																			popup = $("#popup")[0].outerHTML;
																			popup_control = $("#popup_control")[0].outerHTML;
																			overlay = $(".lean-overlay")[0].outerHTML;
																			$(window).on("resize", function() {
																				if(exports.width_func() >= 992) {
																					$(".lean-overlay").remove();
																					$("#popup").remove();
																					$("#popup_control").remove();
																					var controlWrap = $("<div>").html(popup_control),
																						popupWrap = $("<div>").html(popup),
																						overlayWrap = $("<div>").html(overlay);
																					$("body").append(controlWrap.children().first(),
																						popupWrap.children().first(),
																						overlayWrap.children().first());
																					$("#popup").css({
																						opacity: "1",
																						transform: "scaleX(1)",
																						top: "10%"
																					});
																					$(".lean-overlay").css("opacity", "2");
																					$("#popup_submit").click(function(e) {
																						e.preventDefault();
																						$(".lean-overlay").remove();
																						$("#popup").remove();
																						$("#popup_control").remove();
																						$("body").css("overflow", "auto");
																						$(window).off();
																						exports.resize_modal();
																					});
																				}
																			});
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																		else {
																			$("#popup_title")
																				.text("Database Issue");
																			$("#popup_submit").remove();
																			$("#popup_exit").remove();
																			$("#popup_modal_footer")
																				.append($("<a>")
																					.attr("id", "popup_submit")
																					.addClass("waves-effect waves-blue btn-flat")
																					.text("Exit"));
																			$("#popup_body").text("The" +
																				" changes you provided" + 
																				" had trouble being" +
																				" uploaded to the database!");
																			popup = $("#popup")[0].outerHTML;
																			popup_control = $("#popup_control")[0].outerHTML;
																			overlay = $(".lean-overlay")[0].outerHTML;
																			$(window).on("resize", function() {
																				if(exports.width_func() >= 992) {
																					$(".lean-overlay").remove();
																					$("#popup").remove();
																					$("#popup_control").remove();
																					var controlWrap = $("<div>").html(popup_control),
																						popupWrap = $("<div>").html(popup),
																						overlayWrap = $("<div>").html(overlay);
																					$("body").append(controlWrap.children().first(),
																						popupWrap.children().first(),
																						overlayWrap.children().first());
																					$("#popup").css({
																						opacity: "1",
																						transform: "scaleX(1)",
																						top: "10%"
																					});
																					$(".lean-overlay").css("opacity", "2");
																					$("#popup_submit").click(function(e) {
																						e.preventDefault();
																						$(".lean-overlay").remove();
																						$("#popup").remove();
																						$("#popup_control").remove();
																						$("body").css("overflow", "auto");
																						$(window).off();
																						exports.resize_modal();
																					});
																				}
																			});
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																}
																else {
																	$("#popup_title")
																		.text("Database Issue");
																	$("#popup_submit").remove();
																	$("#popup_exit").remove();
																	$("#popup_modal_footer")
																		.append($("<a>")
																			.attr("id", "popup_submit")
																			.addClass("waves-effect waves-blue btn-flat")
																			.text("Exit"));
																	$("#popup_body").text("The" +
																		" changes you provided" + 
																		" had trouble being" +
																		" uploaded to the database!");
																	popup = $("#popup")[0].outerHTML;
																	popup_control = $("#popup_control")[0].outerHTML;
																	overlay = $(".lean-overlay")[0].outerHTML;
																	$(window).on("resize", function() {
																		if(exports.width_func() >= 992) {
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			var controlWrap = $("<div>").html(popup_control),
																				popupWrap = $("<div>").html(popup),
																				overlayWrap = $("<div>").html(overlay);
																			$("body").append(controlWrap.children().first(),
																				popupWrap.children().first(),
																				overlayWrap.children().first());
																			$("#popup").css({
																				opacity: "1",
																				transform: "scaleX(1)",
																				top: "10%"
																			});
																			$(".lean-overlay").css("opacity", "2");
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
														}
													});
												}
											});
										}
									});
									$("#old_password_confirm").on("input", function() {
										oldPassword = $("#old_password_confirm").val();
										if(oldPassword.length > 0 &&
											$("#new_password_confirm").val().length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#new_password_confirm").on("input", function() {
										newPassword = $("#new_password_confirm").val();
										if($("#old_password_confirm").val().length > 0 &&
											newPassword.length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#popup_exit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										if(new_password !=
											$("#new_password_confirm").val()) {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title")
												.text("Password Issue");
											$("#popup_submit").remove();
											$("#popup_exit").remove();
											$("#popup_modal_footer")
												.append($("<a>")
													.attr("id", "popup_submit")
													.addClass("waves-effect waves-blue btn-flat")
													.text("Exit"));
											$("#popup_body").text("The new" +
												" password provided for" +
												" confirmation does not" +
												" match the previous" +
												" password change!");
											popup = $("#popup")[0].outerHTML;
											popup_control = $("#popup_control")[0].outerHTML;
											overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
										}
										else {
											$.post("/api/cms/check/login/", {
												email: email,
												passwd: oldPassword
											}).done(function(result) {
												if(result[0] == "Wrong Password") {
													$("#popup").find(".modal-content")
														.first().children()
														.each(function(index) {
														if(index > 1) {
															$(this).remove();
														}
													});
													$("#popup_title")
														.text("Password Issue");
													$("#popup_submit").remove();
													$("#popup_exit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("waves-effect waves-blue btn-flat")
															.text("Exit"));
													$("#popup_body").text("The old" +
														" password provided for" +
														" confirmation does not" +
														" match the one in the" +
														" database!");
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
												else {
													$.post("/api/cms/contributor/change/profile/", {
														email: email,
														fname: fname,
														lname: lname,
														question: question,
														answer: answer
													}).done(function(result) {
													 	if(result == "1") {
															$.post("/api/cms/contributor/change" +
																"/password/", {
																email: email,
																password: new_password
															}).done(function(result) {
															 	if(result == "1") {
																	$("#popup_title")
																		.text("Confirmation");
																	$("#popup_submit").remove();
																	$("#popup_exit").remove();
																	$("#popup_modal_footer")
																		.append($("<a>")
																			.attr("id", "popup_submit")
																			.addClass("waves-effect waves-blue btn-flat")
																			.text("Exit"));
																	$("#popup_body").text("The" +
																		" changes you provided" +
																		" have been implemented!");
																	popup = $("#popup")[0].outerHTML;
																	popup_control = $("#popup_control")[0].outerHTML;
																	overlay = $(".lean-overlay")[0].outerHTML;
																	$(window).on("resize", function() {
																		if(exports.width_func() >= 992) {
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			var controlWrap = $("<div>").html(popup_control),
																				popupWrap = $("<div>").html(popup),
																				overlayWrap = $("<div>").html(overlay);
																			$("body").append(controlWrap.children().first(),
																				popupWrap.children().first(),
																				overlayWrap.children().first());
																			$("#popup").css({
																				opacity: "1",
																				transform: "scaleX(1)",
																				top: "10%"
																			});
																			$(".lean-overlay").css("opacity", "2");
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
																else {
																	$("#popup_title")
																		.text("Database Issue");
																	$("#popup_submit").remove();
																	$("#popup_exit").remove();
																	$("#popup_modal_footer")
																		.append($("<a>")
																			.attr("id", "popup_submit")
																			.addClass("waves-effect waves-blue btn-flat")
																			.text("Exit"));
																	$("#popup_body").text("The" +
																		" changes you provided" + 
																		" had trouble being" +
																		" uploaded to the database!");
																	popup = $("#popup")[0].outerHTML;
																	popup_control = $("#popup_control")[0].outerHTML;
																	overlay = $(".lean-overlay")[0].outerHTML;
																	$(window).on("resize", function() {
																		if(exports.width_func() >= 992) {
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			var controlWrap = $("<div>").html(popup_control),
																				popupWrap = $("<div>").html(popup),
																				overlayWrap = $("<div>").html(overlay);
																			$("body").append(controlWrap.children().first(),
																				popupWrap.children().first(),
																				overlayWrap.children().first());
																			$("#popup").css({
																				opacity: "1",
																				transform: "scaleX(1)",
																				top: "10%"
																			});
																			$(".lean-overlay").css("opacity", "2");
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
														}
														else {
															$("#popup_title")
																.text("Database Issue");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("waves-effect waves-blue btn-flat")
																	.text("Exit"));
															$("#popup_body").text("The" +
																" changes you provided" + 
																" had trouble being" +
																" uploaded to the database!");
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
												}
											});
										}
									});
								}
								else {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title")
										.text("Password Issue");
									$("#popup_submit").remove();
									$("#popup_exit").remove();
									$("#popup_modal_footer")
										.append($("<a>")
											.attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat")
											.text("Exit"));
									$("#popup_body").text("The new password" +
										" does not meet the minimum security" +
										" requirements!");
									popup = $("#popup")[0].outerHTML;
									popup_control = $("#popup_control")[0].outerHTML;
									overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
										}
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
								}
							});
						});
					}
				});
				$("#popup").keypress(function(event) {
				    if(event.keyCode === 10 ||
				    	event.keyCode === 13) {
				        event.preventDefault();
				    }
				});
				$("#popup_exit").click(function(event) {
					event.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("body").css("overflow", "auto");
					$(window).off();
					exports.resize_modal();
				});
				$("#popup_submit").click(function(event) {
					event.preventDefault();
					var fname = firstNameCMS !== undefined ?
							firstNameCMS[0].toUpperCase() +
							firstNameCMS.slice(1).toLowerCase() :
							information.first_name,
						lname = lastNameCMS !== undefined ?
							lastNameCMS[0].toUpperCase() +
							lastNameCMS.slice(1).toLowerCase() :
							information.last_name,
						question = (parseInt($("#question_cms")[0]
							.options.selectedIndex) + 1),
						answer = answerCMS,
						new_password = passwordCMS;
					$.get("/pages/dist/change-confirmation-min.html")
						.done(function(material) {
						$("#popup").find(".modal-content")
							.first().children()
							.each(function(index) {
							if(index > 1) {
								$(this).remove();
							}
						});
						if(passwordCMS === undefined || passwordCMS == "") {
							$("#popup_title").text("Profile Changes")
								.css("text-align", "center");
							$("#popup_body").text("Please confirm" +
								" the changes provided by providing" +
								" your password:")
								.append(material);
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer").append($("<a>")
								.attr("id", "popup_submit")
								.addClass("waves-effect waves-blue btn-flat")
								.text("Confirm"))
								.append($("<a>")
									.attr("id", "popup_exit")
									.addClass("modal-close waves-effect waves-blue btn-flat")
									.text("Exit"));
							$("#new_password_confirm")
								.closest(".row").remove();
							$("#old_password_label")
								.text("Password");
							$("#popup_submit")
								.css("pointer-events", "none");
							var oldPassword = undefined;
							popup = $("#popup")[0].outerHTML;
							popup_control = $("#popup_control")[0].outerHTML;
							overlay = $(".lean-overlay")[0].outerHTML;
							$(window).on("resize", function() {
								if(exports.width_func() >= 992) {
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									var controlWrap = $("<div>").html(popup_control),
										popupWrap = $("<div>").html(popup),
										overlayWrap = $("<div>").html(overlay);
									$("body").append(controlWrap.children().first(),
										popupWrap.children().first(),
										overlayWrap.children().first());
									$("#popup").css({
										opacity: "1",
										transform: "scaleX(1)",
										top: "10%"
									});
									$(".lean-overlay").css("opacity", "2");
									$("#old_password_confirm").val(oldPassword !== undefined
										? oldPassword : "");
									Materialize.updateTextFields();
									$(".material-icons").removeClass("active");
									$("#old_password_confirm").on("input", function() {
										oldPassword = $("#old_password_confirm").val();
										if(oldPassword.length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#popup_exit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$.post("/api/cms/check/login/", {
											email: email,
											passwd: oldPassword
										}).done(function(result) {
											$("#popup_submit")
												.addClass("modal-close");
											$("#popup_exit").remove();
											if(result[0] == "Wrong Password") {
												$("#popup_title")
													.text("Password Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The password" +
													" you provided did not match" +
													" the one in the database!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else if(fname.length == 0 ||
												/[^a-zA-Z]/.test(fname)) {
												$("#popup_title")
													.text("First Name Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The first name" +
													" cannot be left empty or contain" +
													" an invalid character!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else if(lname.length == 0 ||
												/[^a-zA-Z]/.test(lname)) {
												$("#popup_title")
													.text("Last Name Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The last name" +
													" cannot be left empty or" +
													" contain an invalid character!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else {
												$.post("/api/cms/contributor/change/profile/", {
													email: email,
													fname: fname,
													lname: lname,
													question: question,
													answer: answer
												}).done(function(result) {
												 	if(result == "1") {
														$("#popup_title")
															.text("Confirmation");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The changes" +
															" you provided have" +
															" been implemented!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
													else {
														$("#popup_title")
															.text("Database Issue");
														$("#popup_submit").remove();
														$("#popup_exit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
														$("#popup_body").text("The changes" +
															" you provided had trouble" + 
															" being uploaded to the database!");
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("body").css("overflow", "auto");
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
											}
										});
									});
								}
							});
							$("#old_password_confirm").on("input", function() {
								oldPassword = $("#old_password_confirm").val();
								if(oldPassword.length > 0) {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
								popup = $("#popup")[0].outerHTML;
							});
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$.post("/api/cms/check/login/", {
									email: email,
									passwd: oldPassword
								}).done(function(result) {
									$("#popup_submit")
										.addClass("modal-close");
									$("#popup_exit").remove();
									if(result[0] == "Wrong Password") {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title")
											.text("Password Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer")
											.append($("<a>")
												.attr("id", "popup_submit")
												.addClass("waves-effect waves-blue btn-flat")
												.text("Exit"));
										$("#popup_body").text("The password" +
											" you provided did not match" +
											" the one in the database!");
										popup = $("#popup")[0].outerHTML;
										popup_control = $("#popup_control")[0].outerHTML;
										overlay = $(".lean-overlay")[0].outerHTML;
										$(window).on("resize", function() {
											if(exports.width_func() >= 992) {
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												var controlWrap = $("<div>").html(popup_control),
													popupWrap = $("<div>").html(popup),
													overlayWrap = $("<div>").html(overlay);
												$("body").append(controlWrap.children().first(),
													popupWrap.children().first(),
													overlayWrap.children().first());
												$("#popup").css({
													opacity: "1",
													transform: "scaleX(1)",
													top: "10%"
												});
												$(".lean-overlay").css("opacity", "2");
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
										});
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$("body").css("overflow", "auto");
											$(window).off();
											exports.resize_modal();
										});
									}
									else if(fname.length == 0 ||
										/[^a-zA-Z]/.test(fname)) {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title")
											.text("First Name Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer")
											.append($("<a>")
												.attr("id", "popup_submit")
												.addClass("waves-effect waves-blue btn-flat")
												.text("Exit"));
										$("#popup_body").text("The first name" +
											" cannot be left empty or contain" +
											" an invalid character!");
										popup = $("#popup")[0].outerHTML;
										popup_control = $("#popup_control")[0].outerHTML;
										overlay = $(".lean-overlay")[0].outerHTML;
										$(window).on("resize", function() {
											if(exports.width_func() >= 992) {
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												var controlWrap = $("<div>").html(popup_control),
													popupWrap = $("<div>").html(popup),
													overlayWrap = $("<div>").html(overlay);
												$("body").append(controlWrap.children().first(),
													popupWrap.children().first(),
													overlayWrap.children().first());
												$("#popup").css({
													opacity: "1",
													transform: "scaleX(1)",
													top: "10%"
												});
												$(".lean-overlay").css("opacity", "2");
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
										});
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$("body").css("overflow", "auto");
											$(window).off();
											exports.resize_modal();
										});
									}
									else if(lname.length == 0 ||
										/[^a-zA-Z]/.test(lname)) {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title")
											.text("Last Name Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer")
											.append($("<a>")
												.attr("id", "popup_submit")
												.addClass("waves-effect waves-blue btn-flat")
												.text("Exit"));
										$("#popup_body").text("The last name" +
											" cannot be left empty or" +
											" contain an invalid character!");
										popup = $("#popup")[0].outerHTML;
										popup_control = $("#popup_control")[0].outerHTML;
										overlay = $(".lean-overlay")[0].outerHTML;
										$(window).on("resize", function() {
											if(exports.width_func() >= 992) {
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												var controlWrap = $("<div>").html(popup_control),
													popupWrap = $("<div>").html(popup),
													overlayWrap = $("<div>").html(overlay);
												$("body").append(controlWrap.children().first(),
													popupWrap.children().first(),
													overlayWrap.children().first());
												$("#popup").css({
													opacity: "1",
													transform: "scaleX(1)",
													top: "10%"
												});
												$(".lean-overlay").css("opacity", "2");
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
										});
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$("body").css("overflow", "auto");
											$(window).off();
											exports.resize_modal();
										});
									}
									else {
										$.post("/api/cms/contributor/change/profile/", {
											email: email,
											fname: fname,
											lname: lname,
											question: question,
											answer: answer
										}).done(function(result) {
										 	if(result == "1") {
												$("#popup_title")
													.text("Confirmation");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The changes" +
													" you provided have" +
													" been implemented!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
											else {
												$("#popup_title")
													.text("Database Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
												$("#popup_body").text("The changes" +
													" you provided had trouble" + 
													" being uploaded to the database!");
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("body").css("overflow", "auto");
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("body").css("overflow", "auto");
													$(window).off();
													exports.resize_modal();
												});
											}
										});
									}
								});
							});
						}
						else if(exports.password_check(
							passwordCMS)) {
							$("#popup_title").text("Profile Changes")
								.css("text-align", "center");
							$("#popup_body").text("Please confirm" +
								" the changes provided by" +
								" providing both the old" +
								" and new passwords:")
								.append(material);
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer")
								.append($("<a>")
									.attr("id", "popup_submit")
									.addClass("waves-effect waves-blue btn-flat")
									.text("Confirm"))
								.append($("<a>")
									.attr("id", "popup_exit")
									.addClass("modal-close waves-effect waves-blue btn-flat")
									.text("Exit"));
							$("#popup_submit")
								.css("pointer-events", "none");
							var oldPassword = undefined,
								newPassword = undefined;
							popup = $("#popup")[0].outerHTML;
							popup_control = $("#popup_control")[0].outerHTML;
							overlay = $(".lean-overlay")[0].outerHTML;
							$(window).on("resize", function() {
								if(exports.width_func() >= 992) {
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									var controlWrap = $("<div>").html(popup_control),
										popupWrap = $("<div>").html(popup),
										overlayWrap = $("<div>").html(overlay);
									$("body").append(controlWrap.children().first(),
										popupWrap.children().first(),
										overlayWrap.children().first());
									$("#popup").css({
										opacity: "1",
										transform: "scaleX(1)",
										top: "10%"
									});
									$(".lean-overlay").css("opacity", "2");
									$("#old_password_confirm").val(oldPassword !== undefined
										? oldPassword : "");
									$("#new_password_confirm").val(newPassword !== undefined
										? newPassword : "");
									Materialize.updateTextFields();
									$(".material-icons").removeClass("active");
									$("#old_password_confirm").on("input", function() {
										oldPassword = $("#old_password_confirm").val();
										if(oldPassword.length > 0 &&
											$("#new_password_confirm").val().length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#new_password_confirm").on("input", function() {
										newPassword = $("#new_password_confirm").val();
										if($("#old_password_confirm").val().length > 0 &&
											newPassword.length > 0) {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#popup_exit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										if(new_password != $("#new_password_confirm").val()) {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title")
												.text("Password Issue");
											$("#popup_submit").remove();
											$("#popup_exit").remove();
											$("#popup_modal_footer")
												.append($("<a>")
													.attr("id", "popup_submit")
													.addClass("waves-effect waves-blue btn-flat")
													.text("Exit"));
											$("#popup_body").text("The new" +
												" password provided for" +
												" confirmation does not" +
												" match the previous" +
												" password change!");
											popup = $("#popup")[0].outerHTML;
											popup_control = $("#popup_control")[0].outerHTML;
											overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
										}
										else {
											$.post("/api/cms/check/login/", {
												email: email,
												passwd: oldPassword
											}).done(function(result) {
												if(result[0] == "Wrong Password") {
													$("#popup").find(".modal-content")
														.first().children()
														.each(function(index) {
														if(index > 1) {
															$(this).remove();
														}
													});
													$("#popup_title")
														.text("Password Issue");
													$("#popup_submit").remove();
													$("#popup_exit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("waves-effect waves-blue btn-flat")
															.text("Exit"));
													$("#popup_body").text("The old" +
														" password provided for" +
														" confirmation does not" +
														" match the one in the" +
														" database!");
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
												else {
													$.post("/api/cms/contributor/change/profile/", {
														email: email,
														fname: fname,
														lname: lname,
														question: question,
														answer: answer
													}).done(function(result) {
													 	if(result == "1") {
															$.post("/api/cms/contributor/change" +
																"/password/", {
																email: email,
																password: new_password
															}).done(function(result) {
															 	if(result == "1") {
																	$("#popup_title")
																		.text("Confirmation");
																	$("#popup_submit").remove();
																	$("#popup_exit").remove();
																	$("#popup_modal_footer")
																		.append($("<a>")
																			.attr("id", "popup_submit")
																			.addClass("waves-effect waves-blue btn-flat")
																			.text("Exit"));
																	$("#popup_body").text("The" +
																		" changes you provided" +
																		" have been implemented!");
																	popup = $("#popup")[0].outerHTML;
																	popup_control = $("#popup_control")[0].outerHTML;
																	overlay = $(".lean-overlay")[0].outerHTML;
																	$(window).on("resize", function() {
																		if(exports.width_func() >= 992) {
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			var controlWrap = $("<div>").html(popup_control),
																				popupWrap = $("<div>").html(popup),
																				overlayWrap = $("<div>").html(overlay);
																			$("body").append(controlWrap.children().first(),
																				popupWrap.children().first(),
																				overlayWrap.children().first());
																			$("#popup").css({
																				opacity: "1",
																				transform: "scaleX(1)",
																				top: "10%"
																			});
																			$(".lean-overlay").css("opacity", "2");
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
																else {
																	$("#popup_title")
																		.text("Database Issue");
																	$("#popup_submit").remove();
																	$("#popup_exit").remove();
																	$("#popup_modal_footer")
																		.append($("<a>")
																			.attr("id", "popup_submit")
																			.addClass("waves-effect waves-blue btn-flat")
																			.text("Exit"));
																	$("#popup_body").text("The" +
																		" changes you provided" + 
																		" had trouble being" +
																		" uploaded to the database!");
																	popup = $("#popup")[0].outerHTML;
																	popup_control = $("#popup_control")[0].outerHTML;
																	overlay = $(".lean-overlay")[0].outerHTML;
																	$(window).on("resize", function() {
																		if(exports.width_func() >= 992) {
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			var controlWrap = $("<div>").html(popup_control),
																				popupWrap = $("<div>").html(popup),
																				overlayWrap = $("<div>").html(overlay);
																			$("body").append(controlWrap.children().first(),
																				popupWrap.children().first(),
																				overlayWrap.children().first());
																			$("#popup").css({
																				opacity: "1",
																				transform: "scaleX(1)",
																				top: "10%"
																			});
																			$(".lean-overlay").css("opacity", "2");
																			$("#popup_submit").click(function(e) {
																				e.preventDefault();
																				$(".lean-overlay").remove();
																				$("#popup").remove();
																				$("#popup_control").remove();
																				$("body").css("overflow", "auto");
																				$(window).off();
																				exports.resize_modal();
																			});
																		}
																	});
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
														}
														else {
															$("#popup_title")
																.text("Database Issue");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("waves-effect waves-blue btn-flat")
																	.text("Exit"));
															$("#popup_body").text("The" +
																" changes you provided" + 
																" had trouble being" +
																" uploaded to the database!");
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
												}
											});
										}
									});
								}
							});
							$("#old_password_confirm").on("input", function() {
								oldPassword = $("#old_password_confirm").val();
								if(oldPassword.length > 0 &&
									$("#new_password_confirm").val().length > 0) {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
								popup = $("#popup")[0].outerHTML;
							});
							$("#new_password_confirm").on("input", function() {
								newPassword = $("#new_password_confirm").val();
								if($("#old_password_confirm").val().length > 0 &&
									newPassword.length > 0) {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
								popup = $("#popup")[0].outerHTML;
							});
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								if(new_password !=
									$("#new_password_confirm").val()) {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title")
										.text("Password Issue");
									$("#popup_submit").remove();
									$("#popup_exit").remove();
									$("#popup_modal_footer")
										.append($("<a>")
											.attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat")
											.text("Exit"));
									$("#popup_body").text("The new" +
										" password provided for" +
										" confirmation does not" +
										" match the previous" +
										" password change!");
									popup = $("#popup")[0].outerHTML;
									popup_control = $("#popup_control")[0].outerHTML;
									overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
										}
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
								}
								else {
									$.post("/api/cms/check/login/", {
										email: email,
										passwd: oldPassword
									}).done(function(result) {
										if(result[0] == "Wrong Password") {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title")
												.text("Password Issue");
											$("#popup_submit").remove();
											$("#popup_exit").remove();
											$("#popup_modal_footer")
												.append($("<a>")
													.attr("id", "popup_submit")
													.addClass("waves-effect waves-blue btn-flat")
													.text("Exit"));
											$("#popup_body").text("The old" +
												" password provided for" +
												" confirmation does not" +
												" match the one in the" +
												" database!");
											popup = $("#popup")[0].outerHTML;
											popup_control = $("#popup_control")[0].outerHTML;
											overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("body").css("overflow", "auto");
												$(window).off();
												exports.resize_modal();
											});
										}
										else {
											$.post("/api/cms/contributor/change/profile/", {
												email: email,
												fname: fname,
												lname: lname,
												question: question,
												answer: answer
											}).done(function(result) {
											 	if(result == "1") {
													$.post("/api/cms/contributor/change" +
														"/password/", {
														email: email,
														password: new_password
													}).done(function(result) {
													 	if(result == "1") {
															$("#popup_title")
																.text("Confirmation");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("waves-effect waves-blue btn-flat")
																	.text("Exit"));
															$("#popup_body").text("The" +
																" changes you provided" +
																" have been implemented!");
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
														else {
															$("#popup_title")
																.text("Database Issue");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("waves-effect waves-blue btn-flat")
																	.text("Exit"));
															$("#popup_body").text("The" +
																" changes you provided" + 
																" had trouble being" +
																" uploaded to the database!");
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("body").css("overflow", "auto");
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
												}
												else {
													$("#popup_title")
														.text("Database Issue");
													$("#popup_submit").remove();
													$("#popup_exit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("waves-effect waves-blue btn-flat")
															.text("Exit"));
													$("#popup_body").text("The" +
														" changes you provided" + 
														" had trouble being" +
														" uploaded to the database!");
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("body").css("overflow", "auto");
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("body").css("overflow", "auto");
														$(window).off();
														exports.resize_modal();
													});
												}
											});
										}
									});
								}
							});
						}
						else {
							$("#popup_title")
								.text("Password Issue");
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer")
								.append($("<a>")
									.attr("id", "popup_submit")
									.addClass("waves-effect waves-blue btn-flat")
									.text("Exit"));
							$("#popup_body").text("The new password" +
								" does not meet the minimum security" +
								" requirements!");
							popup = $("#popup")[0].outerHTML;
							popup_control = $("#popup_control")[0].outerHTML;
							overlay = $(".lean-overlay")[0].outerHTML;
							$(window).on("resize", function() {
								if(exports.width_func() >= 992) {
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									var controlWrap = $("<div>").html(popup_control),
										popupWrap = $("<div>").html(popup),
										overlayWrap = $("<div>").html(overlay);
									$("body").append(controlWrap.children().first(),
										popupWrap.children().first(),
										overlayWrap.children().first());
									$("#popup").css({
										opacity: "1",
										transform: "scaleX(1)",
										top: "10%"
									});
									$(".lean-overlay").css("opacity", "2");
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
								}
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
						}
					});
				});
			});
		});
	};

	/*

	Purpose:
		Handles the session modal for a
		live contributor.

	Parameters:
		router: 
			Object representing the
			router of the app
		page:
			The page to which the
			router will navigate
		issue:
			Integer corresponding
			to the scenario

	*/
	exports.session_modal = function(router, page, issue) {
		$(".lean-overlay").remove();
		$("#popup").remove();
		$("#popup_control").remove();
		$.get("/pages/dist/modal-min.html")
			.done(function(content) {
			$("body").append(content);
			$("#popup_title").text("Login Issue");
			if(issue == 0) {
				$("#popup_body").text("It seems" +
					" you are not currently signed" + 
					" into the content management" +
					" system. Please login first!");
			}
			else if(issue == 1) {
				$("#popup_body").text("Your current" +
					" session has expired. To" + 
					" continue using the system" +
					" please login again!");
			}
			else if(issue == 2) {
				$("#popup_body").text("You are" +
					" already logged in! Click the" + 
					" button below to redirect to" +
					" the content management system.");
			}
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_control").click();
			$("#popup").keypress(function(event) {
			    if(event.keyCode === 10 ||
			    	event.keyCode === 13) {
			        event.preventDefault();
			    }
			});
			$("#popup_submit").click(function(e) {
				e.preventDefault();
				router.navigate(page, {reload: true});
			});
			var popup = $("#popup"),
				popup_control = $("#popup_control"),
				overlay = $(".lean-overlay");
			$(window).on("resize", function() {
				if(exports.width_func() >= 992) {
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					popup.css({
						opacity: "1",
						transform: "scaleX(1)",
						top: "10%"
					});
					overlay.css("opacity", "2");
					$("body").append(popup_control,
						popup, overlay);
					$("#popup_title").text("Login Issue");
						if(issue == 0) {
							$("#popup_body").text("It seems" +
								" you are not currently signed" + 
								" into the content management" +
								" system. Please login first!");
						}
						else if(issue == 1) {
							$("#popup_body").text("Your current" +
								" session has expired. To" + 
								" continue using the system" +
								" please login again!");
						}
						else if(issue == 2) {
							$("#popup_body").text("You are" +
								" already logged in! Click the" + 
								" button below to redirect to" +
								" the content management system.");
						}
					if($("#popup_modal_footer").children().length == 0) {
						$("#popup_modal_footer").append($("<a>")
							.addClass("modal-close waves-effect waves-blue btn-flat")
							.attr("id", "popup_submit")
							.text("Ok"));
					}
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						router.navigate(page, {reload: true});
					});
				}
			});
		});
	};

	/*

	Purpose:
		Changes the modal content as needed
		and displays it.

	Parameters:
		type: 
			Referencing which modal is
			to be used
		issue:
			A number referencing the
			necessary case
		obj:
			An object obtained from a
			get/post request

	*/
	exports.modal = function(issue, router, obj) {
		$.get("/pages/dist/modal-min.html")
			.done(function(content) {
			$("body").append(content);
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("body").on("keypress", function(event) {
			    if(event.which === 10 ||
			    	event.which === 13) {
			        return false;
			    }
			});
			if(issue <= 11) {
				if(issue == 0) {
					$("#popup_title")
						.text("Email Issue");
					$("#popup_body").text("There was" +
						" an issue parsing the email" +
						" you provided. Please try" +
						" again!");
				}
				else if(issue == 1) {
					$("#popup_title")
						.text("Registration Issue");
					$("#popup_body").text("The email" +
						" you provided does not exist" +
						" in the database. Please" +
						" provide another email!");
				}
				else if(issue == 2) {
					$("#popup_title")
						.text("Password Issue");
					$("#popup_body").text("The" +
						" password must be at" +
						" least eight characters" +
						" long while containing" +
						" at least one number," +
						" one lowercase letter," +
						" and one uppercase" +
						" letter. Please try" +
						" again!");
				}
				else if(issue == 3) {
					$("#popup_title")
						.text("Database Issue");
					$("#popup_body").text("There" +
						" was a problem" +
						" connecting to the" +
						" database!");
				}
				else if(issue == 4) {
					$("#popup_title")
						.text("Email Issue");
					$("#popup_body").text("The" +
						" email you provided" +
						" does not exist in" +
						" the database." +
						" Please provide" +
						" another email!");
				}
				else if(issue == 5) {
					$("#popup_title")
						.text("Password Issue");
					$("#popup_body").text("The" +
						" password you provided" +
						" does not match the one" +
						" in the database." +
						" Please try again!");
				}
				else if(issue == 6) {
					$("#popup_title")
						.text("Registration Issue");
					$("#popup_body").text("The" +
						" email you provided" +
						" already exists in" +
						" the database." +
						" Please provide" +
						" another email!");
				}
				else if(issue == 7) {
					$("#popup_title")
						.text("Password Issue");
					$("#popup_body").text("The" +
						" passwords you provided" +
						" did not match." +
						" Please try again!");
				}
				else if(issue == 8) {
					$("#popup_title")
						.text("Name Issue");
					$("#popup_body").text("The" +
						" first name cannot be" +
						" left empty and must" +
						" contain strictly" +
						" letters. Please" +
						" try again!");
				}
				else if(issue == 9) {
					$("#popup_title")
						.text("Name Issue");
					$("#popup_body").text("The" +
						" last name cannot be" +
						" left empty and must" +
						" contain strictly" +
						" letters. Please" +
						" try again!");
				}
				else if(issue == 10) {
					$("#popup_title")
						.text("Security Question Issue");
					$("#popup_body").text("The" +
						" answer to the chosen" +
						" security question" +
						" cannot be left empty." +
						" Please try again!");
				}
				else if(issue == 11) {
					$("#popup_title")
						.text("Contributor Submission Issue");
					$("#popup_body").text("There" +
						" was an issue processing" +
						" the submission to the" +
						" database!");
				}
				$("#popup_control").click();
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#popup_submit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$("body").css("overflow", "auto");
							$(window).off();
							exports.resize_modal();
						});
					}
				});
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("body").css("overflow", "auto");
					$(window).off();
					exports.resize_modal();
				});
			}
			else if(issue == 12) {
				var statement = "Thanks for" +
					" submitting an application" +
					" to become a contributor" +
					" on manualmath! The design" +
					" of the content management" +
					" system requires a majority" +
					" approval from a committee" +
					" of five top ranking members" +
					" including the administrator" +
					" to become a contributor." +
					" Deliberations can take a" +
					" while, but you can definitely" +
					" expect a response within a week.";
				$("#popup_title")
					.text("Contributor Submission")
					.css("text-align", "center");
				$("#popup_body").text(statement)
					.append($("<br><br>"), ($("<div>")
						.text("- " + obj.first_name +
							" " + obj.last_name)
						.css("text-align", "right")));
				$("#popup_control").click();
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#popup_submit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$("#login_click").click();
							$("body").css("overflow", "auto");
							$(window).off();
							exports.resize_modal();
						});
					}
				});
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("#login_click").click();
					$("body").css("overflow", "auto");
					$(window).off();
					exports.resize_modal();
				});
			}
			else if(issue == 13) {
				var statement = "By continuing" +
					" you are agreeing to" +
					" manualmath's use of" +
					" cookies to store session" +
					" information.";
				$("#popup_submit").removeClass("modal-close");
				$("#popup_title").text("Login Confirmation")
					.css("text-align", "center");
				$("#popup_body").text(statement);
				$("#popup_submit").text("Continue");
				$("#popup_modal_footer").append($("<a>")
					.attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat")
					.text("Exit"));
				$("#popup_control").click();
				var popup = $("#popup")[0].outerHTML,
					popup_control = $("#popup_control")[0].outerHTML,
					overlay = $(".lean-overlay")[0].outerHTML;
				$(window).on("resize", function() {
					if(exports.width_func() >= 992) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						var controlWrap = $("<div>").html(popup_control),
							popupWrap = $("<div>").html(popup),
							overlayWrap = $("<div>").html(overlay);
						$("body").append(controlWrap.children().first(),
							popupWrap.children().first(),
							overlayWrap.children().first());
						$("#popup").css({
							opacity: "1",
							transform: "scaleX(1)",
							top: "10%"
						});
						$(".lean-overlay").css("opacity", "2");
						$("#popup_exit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$("#login_click").click();
							$("body").css("overflow", "auto").off();
							$(window).off();
							exports.resize_modal();
						});
						$("#popup_submit").click(function() {
							$("body").off();
							if(obj[0].status == 1) {
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$.post("/api/cms/live/check/",
									{email: $("#login_email").val()})
								.done(function(presence) {
									if(presence == "") {
										$.post("/api/cms/live/add/",
											{email: $("#login_email").val()})
										.done(function(result) {
											if(result == 1) {
												exports.write_cookie(
													"contributor",
													$("#login_email").val(),
													180);
												router.navigate("cms",
													{reload: true});
											}
											else {
												console.log("There was an" +
													" issue adding the" +
													" contributor to the" +
													" list of live sessions!");
											}
										});
									}
									else {
										exports.write_cookie("contributor",
											$("#login_email").val(), 180);
										router.navigate("cms", {reload: true});
									}
								});
							}
							else {
								$("#popup_title")
									.text("Contributor Status")
									.css("text-align", "center");
								$("#popup_body").text("Your account" +
									" has not been approved by" +
									" manualmath's committee yet!");
								$("#popup_submit").remove();
								$("#popup_exit").remove();
								$("#popup_modal_footer").append($("<a>")
									.attr("id", "popup_submit")
									.addClass("modal-close waves-effect waves-blue btn-flat")
									.text("Ok"));
								$("#login_input input").each(function() {
									$(this).val("");
								});
								Materialize.updateTextFields();
								popup = $("#popup")[0].outerHTML;
								popup_control = $("#popup_control")[0].outerHTML;
								overlay = $(".lean-overlay")[0].outerHTML;
								$(window).on("resize", function() {
									if(exports.width_func() >= 992) {
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										var controlWrap = $("<div>").html(popup_control),
											popupWrap = $("<div>").html(popup),
											overlayWrap = $("<div>").html(overlay);
										$("body").append(controlWrap.children().first(),
											popupWrap.children().first(),
											overlayWrap.children().first());
										$("#popup").css({
											opacity: "1",
											transform: "scaleX(1)",
											top: "10%"
										});
										$(".lean-overlay").css("opacity", "2");
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$(window).scrollTop(0);
											$("body").css("overflow", "auto").off();
											$(window).off();
											exports.resize_modal();
										});
									}
								});
								$("#popup_submit").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
									$("body").css("overflow", "auto").off();
									$(window).off();
									exports.resize_modal();
								});
							}
							$("body").css({overflow: "inherit", width: "auto"});
						});
					}
				});
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("#login_click").click();
					$("body").css("overflow", "auto").off();
					$(window).off();
					exports.resize_modal();
				});
				$("#popup_submit").click(function() {
					$("body").off();
					if(obj[0].status == 1) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$.post("/api/cms/live/check/",
							{email: $("#login_email").val()})
						.done(function(presence) {
							if(presence == "") {
								$.post("/api/cms/live/add/",
									{email: $("#login_email").val()})
								.done(function(result) {
									if(result == 1) {
										exports.write_cookie(
											"contributor",
											$("#login_email").val(),
											180);
										router.navigate("cms",
											{reload: true});
									}
									else {
										console.log("There was an" +
											" issue adding the" +
											" contributor to the" +
											" list of live sessions!");
									}
								});
							}
							else {
								exports.write_cookie("contributor",
									$("#login_email").val(), 180);
								router.navigate("cms", {reload: true});
							}
						});
					}
					else {
						$("#popup_title")
							.text("Contributor Status")
							.css("text-align", "center");
						$("#popup_body").text("Your account" +
							" has not been approved by" +
							" manualmath's committee yet!");
						$("#popup_submit").remove();
						$("#popup_exit").remove();
						$("#popup_modal_footer").append($("<a>")
							.attr("id", "popup_submit")
							.addClass("modal-close waves-effect waves-blue btn-flat")
							.text("Ok"));
						$("#login_input input").each(function() {
							$(this).val("");
						});
						Materialize.updateTextFields();
						popup = $("#popup")[0].outerHTML;
						popup_control = $("#popup_control")[0].outerHTML;
						overlay = $(".lean-overlay")[0].outerHTML;
						$(window).on("resize", function() {
							if(exports.width_func() >= 992) {
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								var controlWrap = $("<div>").html(popup_control),
									popupWrap = $("<div>").html(popup),
									overlayWrap = $("<div>").html(overlay);
								$("body").append(controlWrap.children().first(),
									popupWrap.children().first(),
									overlayWrap.children().first());
								$("#popup").css({
									opacity: "1",
									transform: "scaleX(1)",
									top: "10%"
								});
								$(".lean-overlay").css("opacity", "2");
								$("#popup_submit").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
									$("body").css("overflow", "auto").off();
									$(window).off();
									exports.resize_modal();
								});
							}
						});
						$("#popup_submit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$(window).scrollTop(0);
							$("body").css("overflow", "auto").off();
							$(window).off();
							exports.resize_modal();
						});
					}
					$("body").css({overflow: "inherit", width: "auto"});
				});
			}
			else if(issue == 14) {
				$.get("/pages/dist/password-recovery-min.html")
					.done(function(material) {
					$("#popup_title").text("Password Recovery");
					$("#popup_body").text("Please answer" +
						" the security question associated" +
						" to the account:")
						.append(material);
					$("#ques").val($("#question option:selected")
						.text());
					$("#popup_submit").text("Continue")
						.removeClass("modal-close")
						.css("pointer-events", "none");
					$("#popup_modal_footer").append($("<a>")
						.attr("id", "popup_exit")
						.addClass("modal-close waves-effect waves-blue btn-flat")
						.text("Exit"));
					$("#popup_control").click();
					var popup = $("#popup")[0].outerHTML,
						popup_control = $("#popup_control")[0].outerHTML,
						overlay = $(".lean-overlay")[0].outerHTML;
					$(window).on("resize", function() {
						if(exports.width_func() >= 992) {
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							var controlWrap = $("<div>").html(popup_control),
								popupWrap = $("<div>").html(popup),
								overlayWrap = $("<div>").html(overlay);
							$("body").append(controlWrap.children().first(),
								popupWrap.children().first(),
								overlayWrap.children().first());
							$("#popup").css({
								opacity: "1",
								transform: "scaleX(1)",
								top: "10%"
							});
							$(".lean-overlay").css("opacity", "2");
							$("#ques").val($("#question option:selected")
								.text());
							$("#forgotten").on("input", function() {
								if($("#forgotten").val().length == 0) {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								popup = $("#popup")[0].outerHTML;
							});
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("#login_click").click();
								$(window).scrollTop(0);
								$("body").css("overflow", "auto").off();
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								$.post("/api/cms/contributor/check/security/", {
									email: $("#login_email").val(),
									answer: $("#forgotten").val()
								}).done(function(result) {
									if(result == 1) {
										$.get("/pages/dist/password-change-min.html")
											.done(function(result) {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title").text("Password Reset");
											$("#popup_body")
												.text("Please provide a new password:")
												.append(result);
											$("#popup_exit").remove();
											$("#popup_submit").remove();
											$("#popup_modal_footer")
												.append($("<a>")
													.attr("id", "popup_submit")
													.addClass("modal-close waves-effect waves-blue btn-flat")
													.text("Continue"))
												.append($("<a>")
													.attr("id", "popup_exit")
													.addClass("modal-close waves-effect waves-blue btn-flat")
													.text("Exit"));
											$("#popup_submit")
												.css("pointer-events", "none");
											popup = $("#popup")[0].outerHTML;
											popup_control = $("#popup_control")[0].outerHTML;
											overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#newpass").on("input", function() {
														if($("#newpass").val().length == 0) {
															$("#popup_submit")
																.css("pointer-events", "none");
														}
														else {
															$("#popup_submit")
																.css("pointer-events", "auto");
														}
														popup = $("#popup")[0].outerHTML;
													});
													$("#popup_exit").click(function() {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("#login_click").click();
														$(window).scrollTop(0);
														$("body").css("overflow", "auto").off();
														$(window).off();
														exports.resize_modal();
													});
													$("body").on("keypress", function(event) {
													    if(event.which === 10 ||
													    	event.which === 13) {
													        return false;
													    }
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$("body").off();
														if(exports.password_check($("#newpass").val())) {
															$.post("/api/cms/contributor/change/password/", {
																email: $("#login_email").val(),
																password: encodeURIComponent(
																	$("#newpass").val())
															}).done(function() {
																$("#popup_title")
																	.text("Password Changed");
																$("#popup_body").text("You" +
																	" may now login with" +
																	" the new password!");
																$("#popup_exit").remove();
																$("#popup_submit").remove();
																$("#popup_modal_footer")
																	.append($("<a>")
																		.attr("id", "popup_submit")
																		.addClass("modal-close waves-effect waves-blue btn-flat")
																		.text("Continue"));
																popup = $("#popup")[0].outerHTML;
																popup_control = $("#popup_control")[0].outerHTML;
																overlay = $(".lean-overlay")[0].outerHTML;
																$(window).on("resize", function() {
																	if(exports.width_func() >= 992) {
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		var controlWrap = $("<div>").html(popup_control),
																			popupWrap = $("<div>").html(popup),
																			overlayWrap = $("<div>").html(overlay);
																		$("body").append(controlWrap.children().first(),
																			popupWrap.children().first(),
																			overlayWrap.children().first());
																		$("#popup").css({
																			opacity: "1",
																			transform: "scaleX(1)",
																			top: "10%"
																		});
																		$(".lean-overlay").css("opacity", "2");
																		$("#popup_submit").click(function(e) {
																			e.preventDefault();
																			$(".lean-overlay").remove();
																			$("#popup").remove();
																			$("#popup_control").remove();
																			$("#login_click").click();
																			$(window).scrollTop(0);
																			$("body").css("overflow", "auto").off();
																			$(window).off();
																			exports.resize_modal();
																		});
																	}
																});
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("#login_click").click();
																	$(window).scrollTop(0);
																	$("body").css("overflow", "auto").off();
																	$(window).off();
																	exports.resize_modal();
																});
															});
														}
														else {
															$("#popup").find(".modal-content")
																.first().children()
																.each(function(index) {
																if(index > 1) {
																	$(this).remove();
																}
															});
															$("#popup_title")
																.text("Password Issue");
															$("#popup_body").text("The" +
																" password must be at" +
																" least eight characters" + 
																" long while containing" +
																" at least one number," +
																" one lowercase letter," + 
																" and one uppercase" +
																" letter. Please try" +
																" again!");
															$("#popup_exit").remove();
															$("#popup_submit").remove();
															$("#popup_modal_footer")
																.append($("<a>")
																	.attr("id", "popup_submit")
																	.addClass("modal-close waves-effect waves-blue btn-flat")
																	.text("Ok"));
															popup = $("#popup")[0].outerHTML;
															popup_control = $("#popup_control")[0].outerHTML;
															overlay = $(".lean-overlay")[0].outerHTML;
															$(window).on("resize", function() {
																if(exports.width_func() >= 992) {
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	var controlWrap = $("<div>").html(popup_control),
																		popupWrap = $("<div>").html(popup),
																		overlayWrap = $("<div>").html(overlay);
																	$("body").append(controlWrap.children().first(),
																		popupWrap.children().first(),
																		overlayWrap.children().first());
																	$("#popup").css({
																		opacity: "1",
																		transform: "scaleX(1)",
																		top: "10%"
																	});
																	$(".lean-overlay").css("opacity", "2");
																	$("#popup_submit").click(function(e) {
																		e.preventDefault();
																		$(".lean-overlay").remove();
																		$("#popup").remove();
																		$("#popup_control").remove();
																		$("#login_click").click();
																		$(window).scrollTop(0);
																		$("body").css("overflow", "auto").off();
																		$(window).off();
																		exports.resize_modal();
																	});
																}
															});
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("#login_click").click();
																$(window).scrollTop(0);
																$("body").css("overflow", "auto").off();
																$(window).off();
																exports.resize_modal();
															});
														}
													});
												}
											});
											$("#newpass").on("input", function() {
												if($("#newpass").val().length == 0) {
													$("#popup_submit")
														.css("pointer-events", "none");
												}
												else {
													$("#popup_submit")
														.css("pointer-events", "auto");
												}
												popup = $("#popup")[0].outerHTML;
											});
											$("#popup_exit").click(function() {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").css("overflow", "auto").off();
												$(window).off();
												exports.resize_modal();
											});
											$("body").on("keypress", function(event) {
											    if(event.which === 10 ||
											    	event.which === 13) {
											        return false;
											    }
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$("body").off();
												if(exports.password_check($("#newpass").val())) {
													$.post("/api/cms/contributor/change/password/", {
														email: $("#login_email").val(),
														password: encodeURIComponent(
															$("#newpass").val())
													}).done(function() {
														$("#popup_title")
															.text("Password Changed");
														$("#popup_body").text("You" +
															" may now login with" +
															" the new password!");
														$("#popup_exit").remove();
														$("#popup_submit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("modal-close waves-effect waves-blue btn-flat")
																.text("Continue"));
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("#login_click").click();
																	$(window).scrollTop(0);
																	$("body").css("overflow", "auto").off();
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("#login_click").click();
															$(window).scrollTop(0);
															$("body").css("overflow", "auto").off();
															$(window).off();
															exports.resize_modal();
														});
													});
												}
												else {
													$("#popup").find(".modal-content")
														.first().children()
														.each(function(index) {
														if(index > 1) {
															$(this).remove();
														}
													});
													$("#popup_title")
														.text("Password Issue");
													$("#popup_body").text("The" +
														" password must be at" +
														" least eight characters" + 
														" long while containing" +
														" at least one number," +
														" one lowercase letter," + 
														" and one uppercase" +
														" letter. Please try" +
														" again!");
													$("#popup_exit").remove();
													$("#popup_submit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("modal-close waves-effect waves-blue btn-flat")
															.text("Ok"));
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("#login_click").click();
																$(window).scrollTop(0);
																$("body").css("overflow", "auto").off();
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("#login_click").click();
														$(window).scrollTop(0);
														$("body").css("overflow", "auto").off();
														$(window).off();
														exports.resize_modal();
													});
												}
											});
										});
									}
									else {
										$("#popup").find(".modal-content")
											.first().children()
											.each(function(index) {
											if(index > 1) {
												$(this).remove();
											}
										});
										$("#popup_title")
											.text("Password Recovery")
											.css("text-align", "left");
										$("#popup_body").text("You" +
											" provided the wrong" +
											" answer to the" +
											" security question!");
										$("#popup_exit").remove();
										$("body").off();
										popup = $("#popup")[0].outerHTML;
										popup_control = $("#popup_control")[0].outerHTML;
										overlay = $(".lean-overlay")[0].outerHTML;
										$(window).on("resize", function() {
											if(exports.width_func() >= 992) {
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												var controlWrap = $("<div>").html(popup_control),
													popupWrap = $("<div>").html(popup),
													overlayWrap = $("<div>").html(overlay);
												$("body").append(controlWrap.children().first(),
													popupWrap.children().first(),
													overlayWrap.children().first());
												$("#popup").css({
													opacity: "1",
													transform: "scaleX(1)",
													top: "10%"
												});
												$(".lean-overlay").css("opacity", "2");
												$("#popup_submit").text("Ok")
													.click(function(e) {
													e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("#login_click").click();
														$(window).scrollTop(0);
														$("body").css("overflow", "auto")
															.off();
														$(window).off();
														exports.resize_modal();
												});
											}
										});
										$("#popup_submit").text("Ok")
											.click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").css("overflow", "auto")
													.off();
												$(window).off();
												exports.resize_modal();
										});
									}
								});
							});
						}
					});
					$("#forgotten").on("input", function() {
						if($("#forgotten").val().length == 0) {
							$("#popup_submit")
								.css("pointer-events", "none");
						}
						else {
							$("#popup_submit")
								.css("pointer-events", "auto");
						}
					});
					$("#popup_exit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$("#login_click").click();
						$(window).scrollTop(0);
						$("body").off();
					});
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						$.post("/api/cms/contributor/check/security/", {
							email: $("#login_email").val(),
							answer: $("#forgotten").val()
						}).done(function(result) {
							if(result == 1) {
								$.get("/pages/dist/password-change-min.html")
									.done(function(result) {
									$("#popup").find(".modal-content")
										.first().children()
										.each(function(index) {
										if(index > 1) {
											$(this).remove();
										}
									});
									$("#popup_title").text("Password Reset");
									$("#popup_body")
										.text("Please provide a new password:")
										.append(result);
									$("#popup_exit").remove();
									$("#popup_submit").remove();
									$("#popup_modal_footer")
										.append($("<a>")
											.attr("id", "popup_submit")
											.addClass("modal-close waves-effect waves-blue btn-flat")
											.text("Continue"))
										.append($("<a>")
											.attr("id", "popup_exit")
											.addClass("modal-close waves-effect waves-blue btn-flat")
											.text("Exit"));
									$("#popup_submit")
										.css("pointer-events", "none");
									popup = $("#popup")[0].outerHTML;
									popup_control = $("#popup_control")[0].outerHTML;
									overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#newpass").on("input", function() {
												if($("#newpass").val().length == 0) {
													$("#popup_submit")
														.css("pointer-events", "none");
												}
												else {
													$("#popup_submit")
														.css("pointer-events", "auto");
												}
												popup = $("#popup")[0].outerHTML;
											});
											$("#popup_exit").click(function() {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").css("overflow", "auto").off();
												$(window).off();
												exports.resize_modal();
											});
											$("body").on("keypress", function(event) {
											    if(event.which === 10 ||
											    	event.which === 13) {
											        return false;
											    }
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$("body").off();
												if(exports.password_check($("#newpass").val())) {
													$.post("/api/cms/contributor/change/password/", {
														email: $("#login_email").val(),
														password: encodeURIComponent(
															$("#newpass").val())
													}).done(function() {
														$("#popup_title")
															.text("Password Changed");
														$("#popup_body").text("You" +
															" may now login with" +
															" the new password!");
														$("#popup_exit").remove();
														$("#popup_submit").remove();
														$("#popup_modal_footer")
															.append($("<a>")
																.attr("id", "popup_submit")
																.addClass("modal-close waves-effect waves-blue btn-flat")
																.text("Continue"));
														popup = $("#popup")[0].outerHTML;
														popup_control = $("#popup_control")[0].outerHTML;
														overlay = $(".lean-overlay")[0].outerHTML;
														$(window).on("resize", function() {
															if(exports.width_func() >= 992) {
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																var controlWrap = $("<div>").html(popup_control),
																	popupWrap = $("<div>").html(popup),
																	overlayWrap = $("<div>").html(overlay);
																$("body").append(controlWrap.children().first(),
																	popupWrap.children().first(),
																	overlayWrap.children().first());
																$("#popup").css({
																	opacity: "1",
																	transform: "scaleX(1)",
																	top: "10%"
																});
																$(".lean-overlay").css("opacity", "2");
																$("#popup_submit").click(function(e) {
																	e.preventDefault();
																	$(".lean-overlay").remove();
																	$("#popup").remove();
																	$("#popup_control").remove();
																	$("#login_click").click();
																	$(window).scrollTop(0);
																	$("body").css("overflow", "auto").off();
																	$(window).off();
																	exports.resize_modal();
																});
															}
														});
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("#login_click").click();
															$(window).scrollTop(0);
															$("body").css("overflow", "auto").off();
															$(window).off();
															exports.resize_modal();
														});
													});
												}
												else {
													$("#popup").find(".modal-content")
														.first().children()
														.each(function(index) {
														if(index > 1) {
															$(this).remove();
														}
													});
													$("#popup_title")
														.text("Password Issue");
													$("#popup_body").text("The" +
														" password must be at" +
														" least eight characters" + 
														" long while containing" +
														" at least one number," +
														" one lowercase letter," + 
														" and one uppercase" +
														" letter. Please try" +
														" again!");
													$("#popup_exit").remove();
													$("#popup_submit").remove();
													$("#popup_modal_footer")
														.append($("<a>")
															.attr("id", "popup_submit")
															.addClass("modal-close waves-effect waves-blue btn-flat")
															.text("Ok"));
													popup = $("#popup")[0].outerHTML;
													popup_control = $("#popup_control")[0].outerHTML;
													overlay = $(".lean-overlay")[0].outerHTML;
													$(window).on("resize", function() {
														if(exports.width_func() >= 992) {
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															var controlWrap = $("<div>").html(popup_control),
																popupWrap = $("<div>").html(popup),
																overlayWrap = $("<div>").html(overlay);
															$("body").append(controlWrap.children().first(),
																popupWrap.children().first(),
																overlayWrap.children().first());
															$("#popup").css({
																opacity: "1",
																transform: "scaleX(1)",
																top: "10%"
															});
															$(".lean-overlay").css("opacity", "2");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
																$("#login_click").click();
																$(window).scrollTop(0);
																$("body").css("overflow", "auto").off();
																$(window).off();
																exports.resize_modal();
															});
														}
													});
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("#login_click").click();
														$(window).scrollTop(0);
														$("body").css("overflow", "auto").off();
														$(window).off();
														exports.resize_modal();
													});
												}
											});
										}
									});
									$("#newpass").on("input", function() {
										if($("#newpass").val().length == 0) {
											$("#popup_submit")
												.css("pointer-events", "none");
										}
										else {
											$("#popup_submit")
												.css("pointer-events", "auto");
										}
										popup = $("#popup")[0].outerHTML;
									});
									$("#popup_exit").click(function() {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("#login_click").click();
										$(window).scrollTop(0);
										$("body").css("overflow", "auto").off();
										$(window).off();
										exports.resize_modal();
									});
									$("body").on("keypress", function(event) {
									    if(event.which === 10 ||
									    	event.which === 13) {
									        return false;
									    }
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$("body").off();
										if(exports.password_check($("#newpass").val())) {
											$.post("/api/cms/contributor/change/password/", {
												email: $("#login_email").val(),
												password: encodeURIComponent(
													$("#newpass").val())
											}).done(function() {
												$("#popup_title")
													.text("Password Changed");
												$("#popup_body").text("You" +
													" may now login with" +
													" the new password!");
												$("#popup_exit").remove();
												$("#popup_submit").remove();
												$("#popup_modal_footer")
													.append($("<a>")
														.attr("id", "popup_submit")
														.addClass("modal-close waves-effect waves-blue btn-flat")
														.text("Continue"));
												popup = $("#popup")[0].outerHTML;
												popup_control = $("#popup_control")[0].outerHTML;
												overlay = $(".lean-overlay")[0].outerHTML;
												$(window).on("resize", function() {
													if(exports.width_func() >= 992) {
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														var controlWrap = $("<div>").html(popup_control),
															popupWrap = $("<div>").html(popup),
															overlayWrap = $("<div>").html(overlay);
														$("body").append(controlWrap.children().first(),
															popupWrap.children().first(),
															overlayWrap.children().first());
														$("#popup").css({
															opacity: "1",
															transform: "scaleX(1)",
															top: "10%"
														});
														$(".lean-overlay").css("opacity", "2");
														$("#popup_submit").click(function(e) {
															e.preventDefault();
															$(".lean-overlay").remove();
															$("#popup").remove();
															$("#popup_control").remove();
															$("#login_click").click();
															$(window).scrollTop(0);
															$("body").css("overflow", "auto").off();
															$(window).off();
															exports.resize_modal();
														});
													}
												});
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("#login_click").click();
													$(window).scrollTop(0);
													$("body").css("overflow", "auto").off();
													$(window).off();
													exports.resize_modal();
												});
											});
										}
										else {
											$("#popup").find(".modal-content")
												.first().children()
												.each(function(index) {
												if(index > 1) {
													$(this).remove();
												}
											});
											$("#popup_title")
												.text("Password Issue");
											$("#popup_body").text("The" +
												" password must be at" +
												" least eight characters" + 
												" long while containing" +
												" at least one number," +
												" one lowercase letter," + 
												" and one uppercase" +
												" letter. Please try" +
												" again!");
											$("#popup_exit").remove();
											$("#popup_submit").remove();
											$("#popup_modal_footer")
												.append($("<a>")
													.attr("id", "popup_submit")
													.addClass("modal-close waves-effect waves-blue btn-flat")
													.text("Ok"));
											popup = $("#popup")[0].outerHTML;
											popup_control = $("#popup_control")[0].outerHTML;
											overlay = $(".lean-overlay")[0].outerHTML;
											$(window).on("resize", function() {
												if(exports.width_func() >= 992) {
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													var controlWrap = $("<div>").html(popup_control),
														popupWrap = $("<div>").html(popup),
														overlayWrap = $("<div>").html(overlay);
													$("body").append(controlWrap.children().first(),
														popupWrap.children().first(),
														overlayWrap.children().first());
													$("#popup").css({
														opacity: "1",
														transform: "scaleX(1)",
														top: "10%"
													});
													$(".lean-overlay").css("opacity", "2");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
														$("#login_click").click();
														$(window).scrollTop(0);
														$("body").css("overflow", "auto").off();
														$(window).off();
														exports.resize_modal();
													});
												}
											});
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").css("overflow", "auto").off();
												$(window).off();
												exports.resize_modal();
											});
										}
									});
								});
							}
							else {
								$("#popup").find(".modal-content")
									.first().children()
									.each(function(index) {
									if(index > 1) {
										$(this).remove();
									}
								});
								$("#popup_title")
									.text("Password Recovery")
									.css("text-align", "left");
								$("#popup_body").text("You" +
									" provided the wrong" +
									" answer to the" +
									" security question!");
								$("#popup_exit").remove();
								$("body").off();
								popup = $("#popup")[0].outerHTML;
								popup_control = $("#popup_control")[0].outerHTML;
								overlay = $(".lean-overlay")[0].outerHTML;
								$(window).on("resize", function() {
									if(exports.width_func() >= 992) {
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										var controlWrap = $("<div>").html(popup_control),
											popupWrap = $("<div>").html(popup),
											overlayWrap = $("<div>").html(overlay);
										$("body").append(controlWrap.children().first(),
											popupWrap.children().first(),
											overlayWrap.children().first());
										$("#popup").css({
											opacity: "1",
											transform: "scaleX(1)",
											top: "10%"
										});
										$(".lean-overlay").css("opacity", "2");
										$("#popup_submit").text("Ok")
											.click(function(e) {
											e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").css("overflow", "auto")
													.off();
												$(window).off();
												exports.resize_modal();
										});
									}
								});
								$("#popup_submit").text("Ok")
									.click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("#login_click").click();
										$(window).scrollTop(0);
										$("body").css("overflow", "auto")
											.off();
										$(window).off();
										exports.resize_modal();
								});
							}
						});
					});
				});
			}
		});
	};

	/*

	Purpose:
		Validates a given email.

	Parameters:
		email: 
			A user's email

	*/
	exports.validate = function(email) {
    	var reg = new RegExp('^(([^<>()\\[\\]' +
    		'\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]' +
    		'\\\\.,;:\\s@"]+)*)|(".+"))@((\\' +
    		'[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9' +
    		']{1,3}\\.[0-9]{1,3}\\])|(([a-zA' +
    		'-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
    	return reg.test(String(email)
    		.toLowerCase());
	};

	/*

	Purpose:
		Validates a given URL.

	Parameters:
		url: 
			The URL to test

	*/
	exports.valid_url = function(url) {
		var reg = new RegExp('[a-z0-9]+([' +
			'\\-\\.]{1}[a-z0-9]+)*\\.[a-z' +
			']{2,5}(:[0-9]{1,5})?(\\/.*)' +
			'?$', "i");
	    return reg.test(url) ? 1 : 0;
	};

	/*

	Purpose:
		Compares two objects based on
		their order property.

	Parameters:
		lhs: 
			The left hand side
			object
		rhs: 
			The right hand side
			object

	*/
	exports.compare_object_order = function(lhs, rhs) {
		return lhs.order < rhs.order
			? -1 : 1;
		};

	/*

	Purpose:
		Handles the API calls.

	Parameters:
		arguments: 
			The API calls as a list

	*/
	exports.get_all = function() {
		var urls = Array.prototype.slice
			.call(arguments),
			promises = urls.map(function(url) {
				return $.get(url);
			}),
			def = $.Deferred();
		$.when.apply($, promises)
			.done(function() {
			var responses = Array.prototype.slice
				.call(arguments);
			def.resolve.apply(def,
				responses.map(function(res) {
					return res[0];
			}));
		});
		return def.promise();
	};

	/*

	Purpose:
		Creates the necessary association of
		all the subjects, topics, sections,
		and examples.

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
		sections.forEach(function(section) {
			section.examples = [];
			examples.forEach(function(example) {
				if(section.section_id == example.section_id) {
					section.examples.push(example);
				}
			});
		});
		topics.forEach(function(topic) {
			topic.sections = [];
			sections.forEach(function(section) {
				if(topic.tid == section.tid) {
					topic.sections.push(section);
				}
			});
		});
		subjects.forEach(function(subject) {
			subject.topics = [];
			topics.forEach(function(topic) {
				if(subject.sid == topic.sid) {
					subject.topics.push(topic);
				}
			});
		});
	};

	/*

	Purpose:
		Once all of subjects, topics, sections,
		and examples are associated this function
		will change the order within the arrays
		based on the order property from the
		database.

	Parameters:
		subjects: 
			An array of all the subjects

	*/
	exports.sort_subjects = function(subjects) {
		subjects.forEach(function(subject) {
			subject.topics.sort(exports.compare_object_order);
			subject.topics.forEach(function(topic) {
				topic.sections.sort(exports.compare_object_order);
				topic.sections.forEach(function(section) {
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
	exports.rgba_to_hex = function(orig) {
		var rgb = orig.replace(/\s/g, "")
			.match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" +
		  	("0" + parseInt(rgb[1], 10)
		  		.toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[2], 10)
		  		.toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[3], 10)
		  		.toString(16)).slice(-2) : orig;
	};

	/*

	Purpose:
		Takes away the pointer events associated
		to the logo link on the about page.

	Parameters:
		page: 
			The name of the page currently
			set

	*/
	exports.handle_logo_link = function(page) { 
		page == "about"
			? $(".logo-cls")
				.css("pointer-events", "none")
			: $(".logo-cls")
				.css("pointer-events", ""); 
	};

	/*

	Purpose:
		Handles the coloring of the li tags on
		the example_side_nav.

	*/
	exports.handle_li_coloring = function() {
		$("#nav-mobile li").each(function() {
			if($(this).hasClass("active")) {
				$(this)
					.css("background-color", "#4693ec");
				$(this).find("a")
					.css("color", "white");
			}
			else {
				if($(this).css("background-color")) {
					if(exports.rgba_to_hex
						($(this).css("background-color")) == "#4693ec") {
						window.innerWidth < 992
							? $(this)
								.css("background-color", "white")
							: $(this)
								.css("background-color", "");
						$(this).find("a")
							.css("color", "#444");
					}
				}
			}
		});
	};

	/*

	Purpose:
		Returns the screen width.

	*/
	exports.width_func = function() {
		return (window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth || 0);
	}

	/*

	Purpose:
		Returns the screen height.

	*/
	exports.height_func = function() {
		return (window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight || 0);
	}

	/*

	Purpose:
		Handles the side nav for
		different screens.

	*/
	exports.handle_side_nav = function() {
		var width = 0,
			screen_width = exports.width_func(),
			mobile = exports.is_mobile();
		if(screen_width >= 992) {
			width = 350;
		}
		else if(screen_width < 992
			&& screen_width > 400) {
			width = screen_width * .75;
		}
		else {
			width = screen_width * .72;
		}
		$(".button-collapse").sideNav({
			"menuWidth": width,
			"closeOnClick": true
		});
		if(screen_width < 992 || mobile) {
			$(".button-collapse")
				.sideNav("hide");
		}
	};

	/*

	Purpose:
		Moves the logo all the way to
		the right on a mobile view.

	*/
	exports.handle_logo = function() {
		if(exports.width_func() < 992) {
			$("#logo").css({
				"float": "right",
				"right": "10px"
			});
		}
	};

	/*

	Purpose:
		Handles the button functionality for
		"Show Proof" and "Show Solution".

	Parameters:
		page: 
			The name of the page
			currently set

	*/
	exports.handle_button = function(cms) {
		if(cms == 1) {
			$("#latex .solution_display i").off();
			$("#latex .solution_display i")
				.on("click", function(defaultevent) {
				defaultevent.preventDefault();
				$(this).text() == "add"
					? $(this).parent().parent()
						.next(".cont_div").fadeIn(300) 
					: $(this).parent().parent()
						.next(".cont_div").fadeOut(300);
				$(this).text() == "add"
					? $(this).text("remove")
					: $(this).text("add");
			});
		}
		else {
			$("#latex .show_solution").off();
			$("#latex .show_solution")
				.on("click", function(defaultevent) {
				defaultevent.preventDefault();
				$(this).find(".solution_display i").text() == "add"
					? $(this).parent()
						.find(".cont_div").fadeIn(300) 
					: $(this).parent()
						.find(".cont_div").fadeOut(300);
				$(this).find(".solution_display i").text() == "add"
					? $(this).find(".solution_display i")
						.text("remove") 
					: $(this).find(".solution_display i")
						.text("add");
			});
		}
	};

	/*

	Purpose:
		Handles the mobile logo placement
		on an orientation change.

	*/
	exports.handle_orientation = function() {
		$(window).on("orientationchange", function() {
			var orientation = screen.msOrientation ||
				(screen.orientation ||
					screen.mozOrientation ||
					{}).type,
				val = exports.height_func(),
				width = -1;
			if(val >= 992) {
				width = 350;
			}
			else if(val < 992 && val > 400) {
				width = val * .75;
			}
			else {
				width = val * .72;
			}
			$("#nav-mobile").css("width", width);
		});
	};

	/*

	Purpose:
		Handles the generation of breadcrumbs.

	Parameters:
		page: 
			The name of the page
			currently set
		subject: 
			An object representing
			the current subject
		topic: 
			An object representing
			the current topic
		section: 
			An object representing
			the current section

	*/
	exports.handle_breadcrumbs = function(page, obj, subject,
		topic, section, example) {
		$("#breadcrumbs").remove();
		if(exports.width_func() < 992) {
			if(page == "subject") {
				obj.before($("<div>")
					.addClass("col s1")
					.attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(subject.clean_name)
						.css("display", "inline-block")));
			}
			else if(page == "topic") {
				obj.before($("<div>")
					.addClass("col s1")
					.attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(subject.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(topic.clean_name)
						.css("display", "inline-block")));
			}
			else if(page == "section") {
				obj.before($("<div>")
					.addClass("col s1")
					.attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(subject.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(topic.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(section.clean_name)
						.css("display", "inline-block")));
			}
			else if(page == "example") {
				obj.before($("<div>")
					.addClass("col s1")
					.attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(subject.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(topic.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(section.clean_name)
						.css("display", "inline-block")));
				$("#breadcrumbs").append($("<li>")
					.addClass("breadcrumb")
					.append($("<div>")
						.text(example.clean_name)
						.css("display", "inline-block")));
			}
			$(".breadcrumb:not(:first)")
				.toggleClass("changed");
		}
	};

	/*

	Purpose:
		Makes sure that the breadcrumbs on
		the topic page allign correctly.

	Parameters:
		page: 
			The name of the page
			currently set

	*/
	exports.mobile_breadcrumbs = function(page) {
		if(page == "topic") {
			$(".breadcrumb.changed")
				.css("display", "inline-flex");
		}
	};

	/*

	Purpose:
		Handles the generation of breadcrumbs
		for the desktop title.

	Parameters:
		page: 
			The name of the page
			currently set
		subject: 
			An object representing the
			current subject
		topic: 
			An object representing the
			current topic
		section: 
			An object representing the
			current section

	*/
	exports.handle_desktop_title = function(page,
		subject, topic, section) {
		if(exports.width_func() >= 992) {
			$("#desktop_title").empty();
			if(page == "about") {
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text("About"));
			}
			else if(page == "subject") {
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(subject.clean_name));
			}
			else if(page == "topic") {
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(subject.clean_name));
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(topic.clean_name));
			}
			else if(page == "section") {
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(subject.clean_name));
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(topic.clean_name));
				$("#desktop_title").append($("<a>")
					.addClass("breadcrumb")
					.text(section.clean_name));
			}
			else {
				console.log("No such page" +
					" exists: " + page);
			}
			$(".breadcrumb:not(:first)")
				.toggleClass("changed");
		}
	};

	/*

	Purpose:
		Determines whether the current
		device is mobile or not.

	*/
	exports.is_mobile = function() {
	    if(
	    	/Mobi/.test(navigator.userAgent) ||
			navigator.userAgent.match(/Phone/i) ||
			navigator.userAgent.match(/DROID/i) ||
			navigator.userAgent.match(/Android/i) ||
		    navigator.userAgent.match(/webOS/i) ||
		    navigator.userAgent.match(/iPhone/i) ||
		    navigator.userAgent.match(/iPod/i) ||
		    navigator.userAgent.match(/BlackBerry/) || 
		    navigator.userAgent.match(/Windows Phone/i) || 
		    navigator.userAgent.match(/ZuneWP7/i) || 
		    navigator.userAgent.match(/IEMobile/i) ||
		    navigator.userAgent.match(/Tablet/i) ||
		    navigator.userAgent.match(/iPad/i) ||
		    navigator.userAgent.match(/Kindle/i) ||
		    navigator.userAgent.match(/Silk/i) ||
		    navigator.userAgent.match(/KFTT/i) ||
		    navigator.userAgent.match(/KFOT/i) ||
		    navigator.userAgent.match(/KFJWA/i) ||
		    navigator.userAgent.match(/KFJWI/i) ||
		    navigator.userAgent.match(/KFSOWI/i) ||
		    navigator.userAgent.match(/KFTHWA/i) ||
		    navigator.userAgent.match(/KFTHWI/i) ||
		    navigator.userAgent.match(/KFAPWA/i) ||
		    navigator.userAgent.match(/KFAPWI/i) ||
		    navigator.userAgent.match(/Playbook/i) ||
		    navigator.userAgent.match(/Nexus/i) ||
		    navigator.userAgent.match(/Xoom/i) ||
		    navigator.userAgent.match(/SM-N900T/i) ||
		    navigator.userAgent.match(/GT-N7100/i) ||
		    navigator.userAgent.match(/SAMSUNG-SGH-I717/i) ||
		    navigator.userAgent.match(/SM-T330NU/i)
		) { return true; }
	    else { return false; }
	};

	/*

	Purpose:
		Handles the modal that warns
		a contributor about leaving
		a page with unsaved changes.

	Parameters:
		router:
			An object representing
			the router
		page: 
			The page to navigate to

	*/
	exports.warning_modal = function(router, page, obj) {
		$.get("/pages/dist/modal-min.html")
			.done(function(content) {
			$("body").append(content);
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("body").on("keypress", function(event) {
			    if(event.which === 10 ||
			    	event.which === 13) {
			        return false;
			    }
			});
			$("#popup_modal_footer").append($("<a>")
				.attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat")
				.text("Exit"));
			$("#popup_title")
				.text("Warning");
			$("#popup_body").text("You are about" +
				" to leave a page with unsaved" +
				" changes!");
			$("#popup_control").click();
			var popup = $("#popup")[0].outerHTML,
				popup_control = $("#popup_control")[0].outerHTML,
				overlay = $(".lean-overlay")[0].outerHTML;
			$(window).on("resize", function() {
				if(exports.width_func() >= 992) {
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					var controlWrap = $("<div>").html(popup_control),
						popupWrap = $("<div>").html(popup),
						overlayWrap = $("<div>").html(overlay);
					$("body").append(controlWrap.children().first(),
						popupWrap.children().first(),
						overlayWrap.children().first());
					$("#popup").css({
						opacity: "1",
						transform: "scaleX(1)",
						top: "10%"
					});
					$(".lean-overlay").css("opacity", "2");
					$("#popup_exit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$("body").css("overflow", "auto");
						$(window).off();
						exports.resize_modal();
					});
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).off();
						exports.resize_modal();
						router.navigate(page, obj);
						$("body").css("overflow", "auto");
					});
				}
			});
			$("#popup_exit").click(function(e) {
				e.preventDefault();
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				$("body").css("overflow", "auto");
				$(window).off();
				exports.resize_modal();
			});
			$("#popup_submit").click(function(e) {
				e.preventDefault();
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				$(window).off();
				exports.resize_modal();
				router.navigate(page, obj);
				$("body").css("overflow", "auto");
			});
		});
	};

	/*

	Purpose:
		Returns an array of values
		which the original heading_cms,
		title_cms, and content_cms
		can be compared to.

	Parameters:
		obj:
			An object representing
			the current set of data
			including any recent
			changes

	*/
	exports.compareTo = function(obj) {
		var arr = [];
		arr.push(obj.title_cms
			.map(function(elem) {
				return elem.replace(/_/g, "x5F").split("\\$")
					.map(function(iter, index) {
						return iter;
			}).join("\$");
		}));
		arr.push(obj.content_cms
			.map(function(elem) {
				return elem.split("\\$")
					.map(function(iter, index) {
						return iter;
			}).join("\$");
		}));
		if(obj.heading_cms !== undefined) {
			arr.push([obj.heading_cms]
				.map(function(elem) {
					return elem.split("\\$")
						.map(function(iter, index) {
							return iter;
				}).join("\$");
			}));
		}
		return arr;
	};

	/*

	Purpose:
		Handles the initial load of any
		cms page.

	Parameters:
		router:
			An object representing
			the router
		callback: 
			A function callback

	*/
	exports.initial_cms = function(router, callback) {
		exports.resize_modal(function() {
			if(exports.read_cookie("contributor") == "" &&
				exports.width_func() >= 992) {
				exports.session_modal(router, "login", 0);
			}
			else {
				var cookie = 
					exports.read_cookie("contributor");
				$.post("/api/cms/live/check/",
					{email: cookie})
				.done(function(result) {
					if(result == "") {
						$.post("/api/cms/live/add/",
							{email: cookie})
						.done(function(result) {
							if(result == 1) {
								exports.write_cookie(
									"contributor", cookie, 180);
							}
							else {
								console.log("There was an" +
									" issue adding" + 
									" the contributor" +
									" to the list of" +
									" live sessions!");
							}
						});
					}
				});
				exports.listen_cookie_change(
					"contributor", function() {
					if(exports.read_cookie("contributor") == "") {
						$.post("/api/cms/live/remove",
							{email: cookie})
						.done(function(result) {
							if(result == 1) {
								exports.session_modal(
									router, "login", 1);
							}
							else {
								console.log("There was an" +
									" issue removing" + 
									" the contributor" +
									" from the list" +
									" of live sessions!");
							}
						});
					}
				});
				$(window).on("unload", function() {
					$.ajax({
					    type: "POST",
					    async: false,
					    url: "/api/cms/live/remove/",
					    data: {email: cookie}
					});
				});
				$.get("/pages/dist/main-min.html")
					.done(function(content) {
					$(document.body).empty()
						.append(content);
					$("#logo").attr("id", "logo_cms");
					callback();
				});
			}
		});
	};

	/*

	Purpose:
		Handles the cms box links.

	Parameters:
		data: 
			An array of objects
			representing the current
			set of data

	*/
	exports.latex_cms_links = function(data) {
		$(".toggle").off();
		$(".add-image").off();
		$(".add-math").off();
		$(".del-box").off();
		$(".add-table").off();
		$(".add-link").off();
		$(".format-list-bulleted").off();
		$(".format-list-numbered").off();
		$(".arrow-up").off();
		$(".arrow-down").off();
		$(".add-row").off();
		$(".add-column").off();
		$(".remove-row").off();
		$(".remove-column").off();
		$(".add-bullet").off();
		$(".remove-bullet").off();
		$(".add-numbered").off();
		$(".remove-numbered").off();
		$(".note-box").off();
		$(".solution_display").off();
		$(".show_solution").each(function(index) {
			$(this).find("span").each(function(index) {
				if($(this).attr("data-position") == "top") {
					$("#" + $(this).attr("data-tooltip-id"))
						.remove();
				}
			});
		});
		$(".edit-tooltipped").tooltip();
		$(".toggle").on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var item = $(this).parents()
				.prev().clone()
				.children().remove()
				.end().text();
			var ref = data.title_cms
				.findIndex(function(elem) {
					return elem.split("_hidden")[0]
						== item;
			});
			if($(this).text() == "toggle_off") {
				$(this).text("toggle_on");
				data.title_cms[ref] = item;
			}
			else if($(this).text() == "toggle_on") {
				$(this).text("toggle_off");
				data.title_cms[ref] += "_hidden";
			}
		});
		$(".format-list-bulleted").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent().parent().parent()
				.find(".cont_div .latex_body").first();
			$.get("/pages/dist/modal-min.html")
				.done(function(content) {
				$("body").append(content);
				$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
				$("body").on("keypress", function(event) {
				    if(event.which === 10 ||
				    	event.which === 13) {
				        return false;
				    }
				});
				$("#popup_title").text("Add Unordered List");
				$("#popup_modal_footer").append($("<a>")
					.attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat")
					.text("Exit"));
				$.get("/pages/dist/bulleted-list-form-min.html")
					.done(function(form) {
					$("#popup_body").append(form);
					$("#popup_submit").css("pointer-events", "none");
					$("#popup_control").click();
					var popup = $("#popup")[0].outerHTML,
						popup_control = $("#popup_control")[0].outerHTML,
						overlay = $(".lean-overlay")[0].outerHTML,
						firstCheck = "";
					$("#popup_submit")
						.css("pointer-events", "none");
					$('input:radio[name="unordered"]')
						.on("change", function() {
						if($(this)[0].checked) {
							$("#popup_submit")
								.css("pointer-events", "auto");
							firstCheck = $(this).attr("value");
						}
						else {
							$("#popup_submit")
								.css("pointer-events", "none");
						}
					});
					popup = $("#popup")[0].outerHTML;
					$("#popup_exit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
					});
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						var style =	$('input:radio[name="unordered"]:checked').val();
						obj.append($("<div>")
							.addClass("latex_equation")
							.attr("contentEditable", "false")
							.append($("<div>")
								.addClass("table-buttons")
								.append($("<a>")
									.addClass("waves-effect waves-light btn plus-bullet")
									.text("Bullet").attr("contentEditable", "false")
									.append($("<i>").addClass("material-icons right")
										.text("add")))
								.append($("<a>")
									.addClass("waves-effect waves-light btn minus-bullet")
									.text("Bullet").attr("contentEditable", "false")
									.append($("<i>").addClass("material-icons right")
										.text("remove"))),
							$("<ul>").css("list-style-position", "inside")
								.append($("<li>").attr("contentEditable", "true")
									.css({
										"list-style-type": style,
										"text-align": "left"
						}))), "<br>");
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(".plus-bullet").off();
						$(".minus-bullet").off();
						$(".plus-bullet").click(function(e) {
							e.preventDefault();
							var listing = $(this).parent().next(),
								styling = listing.children().first()
									.css("list-style-type");
							listing.append($("<li>").css({
								"list-style-type": styling,
								"text-align": "left"
							}).attr("contentEditable", "true"));
						});
						$(".minus-bullet").click(function(e) {
							e.preventDefault();
							var children = $(this).parent()
								.next().children();
							if(children.length - 1 == 0) {
								$(this).parent()
									.parent().remove();
							}
							else {
								$(this).parent().next()
									.children().last()
									.remove();
							}
						});
					});
					$(window).on("resize", function() {
						if(exports.width_func() >= 992) {
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							var controlWrap = $("<div>").html(popup_control),
								popupWrap = $("<div>").html(popup),
								overlayWrap = $("<div>").html(overlay);
							$("body").append(controlWrap.children().first(),
								popupWrap.children().first(),
								overlayWrap.children().first());
							$("#popup").css({
								opacity: "1",
								transform: "scaleX(1)",
								top: "10%"
							});
							$(".lean-overlay").css("opacity", "2");
							$('input:radio[name="unordered"]')
								.on("change", function() {
								if($(this)[0].checked) {
									$("#popup_submit")
										.css("pointer-events", "auto");
									firstCheck = $(this).attr("value");
								}
							});
							if(firstCheck != "") {
								$("input").each(function(index) {
									if($(this).attr("value") == firstCheck) {
										$(this).click();
									}
								});
							}
							popup = $("#popup")[0].outerHTML;
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								var	style = $('input:radio[name="unordered"]:checked').val();
								obj.append($("<div>")
									.addClass("latex_equation")
									.attr("contentEditable", "false")
									.append($("<div>")
										.addClass("table-buttons")
										.append($("<a>")
											.addClass("waves-effect waves-light btn plus-bullet")
											.text("Bullet").attr("contentEditable", "false")
											.append($("<i>").addClass("material-icons right")
												.text("add")))
										.append($("<a>")
											.addClass("waves-effect waves-light btn minus-bullet")
											.text("Bullet").attr("contentEditable", "false")
											.append($("<i>").addClass("material-icons right")
												.text("remove"))),
									$("<ul>").css("list-style-position", "inside")
										.append($("<li>").attr("contentEditable", "true")
											.css({
												"list-style-type": style,
												"text-align": "left"
								}))), "<br>");
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
								$(".plus-bullet").off();
								$(".minus-bullet").off();
								$(".plus-bullet").click(function(e) {
									e.preventDefault();
									var listing = $(this).parent().next(),
										styling = listing.children().first()
											.css("list-style-type");
									listing.append($("<li>").css({
										"list-style-type": styling,
										"text-align": "left"
									}).attr("contentEditable", "true"));
								});
								$(".minus-bullet").click(function(e) {
									e.preventDefault();
									var children = $(this).parent()
										.next().children();
									if(children.length - 1 == 0) {
										$(this).parent()
											.parent().remove();
									}
									else {
										$(this).parent().next()
											.children().last()
											.remove();
									}
								});
							});
						}
					});
				});
			});
		});
		$(".format-list-numbered").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent().parent().parent()
				.find(".cont_div .latex_body").first();
			$.get("/pages/dist/modal-min.html")
				.done(function(content) {
				$("body").append(content);
				$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
				$("body").on("keypress", function(event) {
				    if(event.which === 10 ||
				    	event.which === 13) {
				        return false;
				    }
				});
				$("#popup_title").text("Add Ordered List");
				$("#popup_modal_footer").append($("<a>")
					.attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat")
					.text("Exit"));
				$.get("/pages/dist/numbered-list-form-min.html")
					.done(function(form) {
					$("#popup_body").append(form);
					$("#popup_submit").css("pointer-events", "none");
					$("#popup_control").click();
					var popup = $("#popup")[0].outerHTML,
						popup_control = $("#popup_control")[0].outerHTML,
						overlay = $(".lean-overlay")[0].outerHTML,
						firstCheck = "";
					$("#popup_submit")
						.css("pointer-events", "none");
					$('input:radio[name="ordered"]')
						.on("change", function() {
						if($(this)[0].checked) {
							$("#popup_submit")
								.css("pointer-events", "auto");
							firstCheck = $(this).attr("value");
						}
						else {
							$("#popup_submit")
								.css("pointer-events", "none");
						}
					});
					popup = $("#popup")[0].outerHTML;
					$("#popup_exit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
					});
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						var style =	$('input:radio[name="ordered"]:checked').val();
						obj.append($("<div>")
							.addClass("latex_equation")
							.attr("contentEditable", "false")
							.append($("<div>")
								.addClass("table-buttons")
								.append($("<a>")
									.addClass("waves-effect waves-light btn plus-numbered")
									.text("Bullet").attr("contentEditable", "false")
									.append($("<i>").addClass("material-icons right")
										.text("add")))
								.append($("<a>")
									.addClass("waves-effect waves-light btn minus-numbered")
									.text("Bullet").attr("contentEditable", "false")
									.append($("<i>").addClass("material-icons right")
										.text("remove"))),
							$("<ol>").css("list-style-position", "inside")
								.attr("type", style).append($("<li>")
									.attr("contentEditable", "true")
									.css("text-align", "left"))), "<br>");
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(".plus-numbered").off();
						$(".minus-numbered").off();
						$(".plus-numbered").click(function(e) {
							e.preventDefault();
							$(this).parent().next()
								.append($("<li>")
									.attr("contentEditable", "true")
									.css("text-align", "left"));
						});
						$(".minus-numbered").click(function(e) {
							e.preventDefault();
							var children = $(this).parent()
								.next().children();
							if(children.length - 1 == 0) {
								$(this).parent()
									.parent().remove();
							}
							else {
								$(this).parent().next()
									.children().last()
									.remove();
							}
						});
					});
					$(window).on("resize", function() {
						if(exports.width_func() >= 992) {
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							var controlWrap = $("<div>").html(popup_control),
								popupWrap = $("<div>").html(popup),
								overlayWrap = $("<div>").html(overlay);
							$("body").append(controlWrap.children().first(),
								popupWrap.children().first(),
								overlayWrap.children().first());
							$("#popup").css({
								opacity: "1",
								transform: "scaleX(1)",
								top: "10%"
							});
							$(".lean-overlay").css("opacity", "2");
							$('input:radio[name="ordered"]')
								.on("change", function() {
								if($(this)[0].checked) {
									$("#popup_submit")
										.css("pointer-events", "auto");
									firstCheck = $(this).attr("value");
								}
							});
							if(firstCheck != "") {
								$("input").each(function(index) {
									if($(this).attr("value") == firstCheck) {
										$(this).click();
									}
								});
							}
							popup = $("#popup")[0].outerHTML;
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								var style =	$('input:radio[name="ordered"]:checked').val();
								obj.append($("<div>")
									.addClass("latex_equation")
									.attr("contentEditable", "false")
									.append($("<div>")
										.addClass("table-buttons")
										.append($("<a>")
											.addClass("waves-effect waves-light btn plus-numbered")
											.text("Bullet").attr("contentEditable", "false")
											.append($("<i>").addClass("material-icons right")
												.text("add")))
										.append($("<a>")
											.addClass("waves-effect waves-light btn minus-numbered")
											.text("Bullet").attr("contentEditable", "false")
											.append($("<i>").addClass("material-icons right")
												.text("remove"))),
									$("<ol>").css("list-style-position", "inside")
										.attr("type", style).append($("<li>")
											.attr("contentEditable", "true")
											.css("text-align", "left"))), "<br>");
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
								$(".plus-numbered").off();
								$(".minus-numbered").off();
								$(".plus-numbered").click(function(e) {
									e.preventDefault();
									$(this).parent().next()
										.append($("<li>")
											.attr("contentEditable", "true")
											.css("text-align", "left"));
								});
								$(".minus-numbered").click(function(e) {
									e.preventDefault();
									var children = $(this).parent()
										.next().children();
									if(children.length - 1 == 0) {
										$(this).parent()
											.parent().remove();
									}
									else {
										$(this).parent().next()
											.children().last()
											.remove();
									}
								});
							});
						}
					});
				});
			});
		});
		$(".note-box").on("click", function(e) {
			e.preventDefault();
			var row = $("<div>").addClass("row note-row")
					.attr("contentEditable", "false"),
				col = $("<div>").addClass("col s12 m5 note-col"),
				panel = $("<div>").addClass("card-panel"),
				span = $("<span>").addClass("black-text")
					.attr("contentEditable", "true")
					.text("New Note");
			panel.text(" ").append(span);
			col.append(panel);
			row.append(col);
			$(this).parent().parent().next()
				.find(".latex_body").first()
				.append(row, "<br>");
		});
		$(".add-math").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent()
				.parent().parent()
				.find(".cont_div .latex_body")
				.first();
			obj.append($("<div>")
				.addClass("latex_equation")
				.text("$\\eqalign{New Equation}$"),
					"<br>");
		});
		$(".arrow-up").on("click", function(e) {
			e.preventDefault();
			var box = $(this).parent().parent().parent();
			if(box.prev().attr("id") != "bar-div"
				&& box.prev().attr("id") != "main_message") {
				var above = box.prev();
				box.detach();
				above.before(box);
			}
		});
		$(".arrow-down").on("click", function(e) {
			e.preventDefault();
			var box = $(this).parent().parent().parent();
			if(box.next().length != 0) {
				var below = box.next();
				box.detach();
				below.after(box);
			}
		});
		$(".add-image").on("click", function(e) {
			e.preventDefault();
			$("body").append($("<input>")
				.css("display", "none")
				.attr({
					id: "file",
					type: "file"
				}));
			var obj = $(this).parent()
				.parent().parent()
				.find(".cont_div .latex_body")
				.first();
			$("#file").click();
			$("#file").on("change", function() {
				var file = $("#file")[0].files[0],
					reader  = new FileReader();
				reader.addEventListener("load", function () {
					exports.resize_image(reader.result, 500, 500,
						function(scaled_data) {
				  		obj.append($("<div>")
				  			.addClass("latex_equation")
							.append($("<img>").attr({
								src: scaled_data,
								alt: "Math Image"
						})), "<br>");
					});
					$("#file").remove();
		  		}, false);
			  	if(file) {
				    reader.readAsDataURL(file);
			  	}
			});
		});
		$(".add-table").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent()
				.parent().parent()
				.find(".cont_div .latex_body")
				.first();
			obj.append($("<div>")
				.addClass("latex_equation")
				.append($("<div>")
					.addClass("table-buttons")
					.append($("<a>")
						.addClass("waves-effect waves-light btn add-row")
						.text("Row")
						.attr("contentEditable", "false")
						.append($("<i>")
							.addClass("material-icons right")
							.text("add")))
					.append($("<a>")
						.addClass("waves-effect waves-light btn remove-row")
						.text("Row")
						.attr("contentEditable", "false")
						.append($("<i>")
							.addClass("material-icons right")
							.text("remove")))
					.append($("<a>")
						.addClass("waves-effect waves-light btn add-column")
						.text("Column")
						.attr("contentEditable", "false")
						.append($("<i>")
							.addClass("material-icons right")
							.text("add")))
					.append($("<a>")
						.addClass("waves-effect waves-light btn remove-column")
						.text("Column")
						.attr("contentEditable", "false")
						.append($("<i>")
							.addClass("material-icons right")
							.text("remove"))), $("<table>")
								.append($("<tbody>")
									.append($("<tr>")
										.append($("<td>"))))), "<br>");
			$(".add-row").off();
			$(".add-column").off();
			$(".remove-row").off();
			$(".remove-column").off();
			$(".add-row").on("click", function(e) {
				e.preventDefault();
				var count = $(this).parent()
					.next().find("tbody")
					.first().children()
					.first().find("td").length,
					cont = $("<tr>");
				for(var i = 0; i < count; i++) {
					cont.append($("<td>"));
				}
				$(this).parent().next()
					.find("tbody")
					.first()
					.append(cont);
			});
			$(".add-column").on("click", function(e) {
				e.preventDefault();
				$(this).parent()
					.next().find("tbody")
					.children()
					.each(function() {
						$(this).append($("<td>"));
				});
			});
			$(".remove-row").on("click", function(e) {
				e.preventDefault();
				var list = $(this).parent()
					.next().find("tbody")
					.first().children();
				list.last().remove();
				if(list.length - 1 == 0) {
					$(this).parent()
						.parent().remove();
				}
			});
			$(".remove-column").on("click", function(e) {
				e.preventDefault();
				var list = $(this).parent()
					.next().find("tbody")
					.children();
				list.each(function() {
					$(this).children()
					.last().remove();
				});
				if(list.first()
					.children().length == 0) {
					$(this).parent()
						.parent().remove();
				}
			});
		});
		$(".add-row").on("click", function(e) {
			e.preventDefault();
			var count = $(this).parent()
				.next().find("tbody")
				.first().children()
				.first().find("td").length,
				cont = $("<tr>");
			for(var i = 0; i < count; i++) {
				cont.append($("<td>"));
			}
			$(this).parent()
				.next().find("tbody")
				.first().append(cont);
		});
		$(".add-column").on("click", function(e) {
			e.preventDefault();
			$(this).parent()
				.next().find("tbody")
				.children()
				.each(function() {
					$(this).append($("<td>"));
			});
		});
		$(".remove-row").on("click", function(e) {
			e.preventDefault();
			var list = $(this).parent()
				.next().find("tbody")
				.first().children();
			list.last().remove();
			if(list.length - 1 == 0) {
				$(this).parent()
					.parent().remove();
			}
		});
		$(".remove-column").on("click", function(e) {
			e.preventDefault();
			var list = $(this).parent()
				.next().find("tbody")
				.children();
			list.each(function() {
				$(this).children()
					.last().remove();
			});
			if(list.first()
				.children().length == 0) {
				$(this).parent()
					.parent().remove();
			}
		});
		$(".plus-bullet").click(function(e) {
			e.preventDefault();
			var listing = $(this).parent().next(),
				styling = listing.children().first()
					.css("list-style-type");
			listing.append($("<li>").css({
				"list-style-type": styling,
				"text-align": "left"
			}).attr("contentEditable", "true"));
		});
		$(".minus-bullet").click(function(e) {
			e.preventDefault();
			var children = $(this).parent()
				.next().children();
			if(children.length - 1 == 0) {
				$(this).parent()
					.parent().remove();
			}
			else {
				$(this).parent().next()
					.children().last()
					.remove();
			}
		});
		$(".plus-numbered").click(function(e) {
			e.preventDefault();
			$(this).parent().next()
				.append($("<li>")
					.attr("contentEditable", "true")
					.css("text-align", "left"));
		});
		$(".minus-numbered").click(function(e) {
			e.preventDefault();
			var children = $(this).parent()
				.next().children();
			if(children.length - 1 == 0) {
				$(this).parent()
					.parent().remove();
			}
			else {
				$(this).parent().next()
					.children().last()
					.remove();
			}
		});
		$(".add-link").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent()
				.parent().parent()
				.find(".cont_div .latex_body")
				.first();
			$.get("/pages/dist/modal-min.html")
				.done(function(content) {
				$("body").append(content);
				$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
				$("body").on("keypress", function(event) {
				    if(event.which === 10 ||
				    	event.which === 13) {
				        return false;
				    }
				});
				$("#popup_title").text("Add Link");
				$("#popup_modal_footer").append($("<a>")
					.attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat")
					.text("Exit"));
				$.get("/pages/dist/add-link-min.html")
					.done(function(form) {
					$("#popup_body").append(form);
					$("#popup_submit")
						.css("pointer-events", "none");
					$("#popup_control").click();
					$("#link-text").on("input", function() {
						if($("#link-text").val().length > 0
							&& $("#link-url").val().length > 0
							&& exports.valid_url($("#link-url").val())) {
							$("#popup_submit")
								.css("pointer-events", "auto");
						}
						else {
							$("#popup_submit")
								.css("pointer-events", "none");
						}
					});
					$("#link-url").on("input", function() {
						if($("#link-text").val().length > 0
							&& $("#link-url").val().length > 0
							&& exports.valid_url($("#link-url").val())) {
							$("#popup_submit")
								.css("pointer-events", "auto");
						}
						else {
							$("#popup_submit")
								.css("pointer-events", "none");
						}
					});
					$("#popup_exit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
					});
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						obj.append($("<a>")
							.addClass("content-link")
							.text($("#link-text").val()).attr({
								href: "//" + $("#link-url").val(),
								target: "_blank",
								rel: "noreferrer"
						}));
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
					});
					var popup = $("#popup")[0].outerHTML,
						popup_control = $("#popup_control")[0].outerHTML,
						overlay = $(".lean-overlay")[0].outerHTML;
					$(window).on("resize", function() {
						if(exports.width_func() >= 992) {
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							var controlWrap = $("<div>").html(popup_control),
								popupWrap = $("<div>").html(popup),
								overlayWrap = $("<div>").html(overlay);
							$("body").append(controlWrap.children().first(),
								popupWrap.children().first(),
								overlayWrap.children().first());
							$("#popup").css({
								opacity: "1",
								transform: "scaleX(1)",
								top: "10%"
							});
							$(".lean-overlay").css("opacity", "2");
							$("#link-text").on("input", function() {
								if($("#link-text").val().length > 0
									&& $("#link-url").val().length > 0
									&& exports.valid_url($("#link-url").val())) {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
							});
							$("#link-url").on("input", function() {
								if($("#link-text").val().length > 0
									&& $("#link-url").val().length > 0
									&& exports.valid_url($("#link-url").val())) {
									$("#popup_submit")
										.css("pointer-events", "auto");
								}
								else {
									$("#popup_submit")
										.css("pointer-events", "none");
								}
							});
							$("#popup_exit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								obj.append($("<a>")
									.addClass("content-link")
									.text($("#link-text").val()).attr({
										href: "//" + $("#link-url").val(),
										target: "_blank",
										rel: "noreferrer"
								}));
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
						}
					});
				});
			});
		});
		$(".del-box").on("click", function(e) {
			e.preventDefault();
			$(this).parent().parent()
				.children().each(function(index) {
				if($(this).attr("data-position")
					== "top") {
					$("#" + $(this)
						.attr("data-tooltip-id")).remove();
				}
			});
			$(this).parent().parent().parent().remove();
			if($("#latex .accordion").length == 0) {
				$("#latex").append($("<div>")
					.addClass("accordion")
					.append($("<div>")
						.addClass("show_solution")
						.text("NO CONTENT HERE!")
						.css("pointer-events", "none")));
			}
		});
	};

	/*

	Purpose:
		Handles the modal that informs a
		contributor when another contributor
		has pushed new content into the
		database.

	*/
	exports.update_modal = function() {
		$.get("/pages/dist/modal-min.html").done(function(content) {
			$(".lean-overlay").remove();
			$("#popup").remove();
			$("#popup_control").remove();
			$("body").append(content);
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Database Update");
			$("#popup_body").text("In the last five" +
				" minutes another contributor has" +
				" updated the content of the" +
				" current page. To see the new" +
				" changes you have to refresh" +
				" the page.");
			$("#popup_control").click();
			var popup = $("#popup")[0].outerHTML,
				popup_control = $("#popup_control")[0].outerHTML,
				overlay = $(".lean-overlay")[0].outerHTML;
			$(window).on("resize", function() {
				if(exports.width_func() >= 992) {
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					var controlWrap = $("<div>").html(popup_control),
						popupWrap = $("<div>").html(popup),
						overlayWrap = $("<div>").html(overlay);
					$("body").append(controlWrap.children().first(),
						popupWrap.children().first(),
						overlayWrap.children().first());
					$("#popup").css({
						opacity: "1",
						transform: "scaleX(1)",
						top: "10%"
					});
					$(".lean-overlay").css("opacity", "2");
					$("#popup_submit").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$("body").css("overflow", "auto");
						$(window).off();
						exports.resize_modal();
					});
				}
			});
			$("#popup_submit").click(function(e) {
				e.preventDefault();
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				$("body").css("overflow", "auto");
				$(window).off();
				exports.resize_modal();
			});
		});
	};

	/*

	Purpose:
		Handles the loading of all content
		for the cms pages.

	Parameters:
		page: 
			The name of the page
			currently set
		cookie:
			A browser cookie
			representing the live
			session of a contributor
		router:
			An object representing
			the router
		links:
			An object that handles
			all links on a page
		subjects:
			An array of all subjects
			in the database
		topics:
			An array of all topics
			in the database
		sections:
			An array of all sections
			in the database
		examples:
			An array of all examples
			in the database
		subject: 
			An object representing
			the current subject
		topic: 
			An object representing
			the current topic
		section: 
			An object representing
			the current section
		example:
			An object representing
			the current example

	*/
	exports.latex_cms = function(page, cookie, router, links,
		subjects, topics, sections, examples, subject, topic,
		section, example) {
		$("body").css("background", "#e0e0e0");
		$("title").text("Content Management System");
		$("main").empty();
		$("main").append($("<div>")
			.attr("id", "latex"));
		$.get("/pages/dist/edit-bar-min.html")
			.done(function(bar) {
			$("#latex").append(bar);
			var statement = "/api/",
				db_id = -1,
				ref = -1;
			if(page == "about") {
				statement += "cms/about/data";
			}
			else if(page == "subject") {
				statement += "subject/data/cms";
				db_id = subject.sid;
				ref = "undefined"; }
			else if(page == "topic") {
				statement += "topic/data/cms";
				db_id = topic.tid;
				ref = subject.sid; }
			else if(page == "section") {
				statement += "section/data/cms";
				db_id = section.section_id;
				ref = topic.tid; }
			else if(page == "example") {
				statement += "example/data/cms";
				db_id = example.eid;
				ref = section.section_id; }
			$.post(statement, {param: db_id})
				.done(function(data) {
				data.title = data.title != null 
					? decodeURIComponent(data.title)
						.replace(/_/g, "x5F")
						.split("-----")
					: [""];
				data.content = data.content != null 
					? decodeURIComponent(data.content)
						.split("-----")
					: [""];
				data.title_cms = data.title_cms != null 
					? decodeURIComponent(data.title_cms)
						.replace(/_/g, "x5F")
						.split("-----")
					: [""];
				data.content_cms = data.content_cms != null 
					? decodeURIComponent(data.content_cms)
						.split("-----")
					: [""];
				if(page == "about") {
					$("#latex").append($("<div>")
						.attr("id", "main_message")
						.addClass("box_message")
						.append($("<h1>")
							.text(data.heading_cms)
							.css("margin-top", "-60px")));
				}
				var i = 0;
				for(; i >= 0; i++) {
					if(data.title_cms[i] == null ||
						data.title_cms[i] == "") {
						break;
					}
					var cont_div = "",
						title = data.title_cms[i].split("x5F")
							.filter(function(elem) {
								return elem != "hidden";
							}).join("_"),
						accordion = $("<div>")
							.addClass("accordion"),
						show_solution = $("<div>")
							.addClass("show_solution")
							.text(title),
						span = $("<span>")
							.addClass("solution_display"),
						latex_body = $("<div>")
							.addClass("latex_body");
					if(data.title_cms[i].split("x5F")
						.filter(function(elem) {
							return elem == "hidden";
						}).length == 0) {
						cont_div = $("<div>")
							.addClass("cont_div");
						span.append($("<i>")
							.addClass("material-icons")
							.text("remove"));
					}
					else {
						cont_div = $("<div>")
							.addClass("cont_div hidden_div");
						span.append($("<i>")
							.addClass("material-icons")
							.text("add"));
					}	
					latex_body.append(data.content_cms[i]);
					cont_div.append(latex_body);
					show_solution.append(span);
					accordion.append(show_solution);
					accordion.append(cont_div);
					$("#latex").append(accordion);
				}
				if(i == 0) {
					$("#latex").append($("<div>")
						.addClass("accordion")
						.append($("<div>")
							.addClass("show_solution")
							.text("NO CONTENT HERE!")
							.css("pointer-events", "none")));
				}
				$(".table-buttons")
					.css("display", "none");
				exports.handle_breadcrumbs(page,
					$(".accordion").first(), subject,
					topic, section, example);
				exports.handle_button();
				if(data.cms_approval !== undefined &&
					data.cms_approval !== null &&
					data.cms_approval.split(",")
					.some(function(elem) {
						return elem == cookie;
					})) {
					$("#approve")
						.css("color", "green");
				}
				else {
					$("#approve")
						.css("color", "red");
				}
				$(".tooltipped").tooltip();
				$("#log").click(function(e) {
					e.preventDefault();
					$.get("/pages/dist/modal-min.html")
						.done(function(result) {
						$("body").append(result);
						$(".modal-trigger").leanModal({
							dismissible: false,
							opacity: 2,
							inDuration: 1000,
							outDuration: 1000
						});
						$("#popup_title").text("History of Current Page")
							.css("text-align", "center");
						$.post("/api/log/want/" + page, {id: db_id})
							.done(function(log) {
							if(log !== null && log != "") {
								var lines = log.split("-----"),
									table = $("<table>"),
									tableHead = $("<thead>"),
									tableBody = $("<tbody>"),
									headTR = $("<tr>"),
									dateItem = $("<th>").text("Date")
										.css("text-align", "center"),
									timeItem = $("<th>").text("Time (UTC)")
										.css("text-align", "center"),
									commentItem = $("<th>").text("Changes")
										.css("text-align", "center");
								lines.forEach(function(elem) {
									var container = elem.split("_____"),
										date = container[0]
											.split(",")[0],
										time = container[0]
											.split(",")[1].trim(),
										current = $("<tr>").append(
											$("<td>").text(date)
												.css("text-align", "center"),
											$("<td>").text(time)
												.css("text-align", "center"),
											$("<td>").text(container[1])
										)
										tableBody.append(current);
								});
								headTR.append(dateItem, timeItem, commentItem);
								tableHead.append(headTR);
								table.append(tableHead, tableBody);
								$("#popup_body").append(table);
							}
							$("#popup_control").click();
							MathJax.Hub.Queue(["Typeset", MathJax.Hub, "popup"]);
							var popup = $("#popup")[0].outerHTML,
								popup_control = $("#popup_control")[0].outerHTML,
								overlay = $(".lean-overlay")[0].outerHTML;
							$(window).on("resize", function() {
								if(exports.width_func() >= 992) {
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									var controlWrap = $("<div>").html(popup_control),
										popupWrap = $("<div>").html(popup),
										overlayWrap = $("<div>").html(overlay);
									$("body").append(controlWrap.children().first(),
										popupWrap.children().first(),
										overlayWrap.children().first());
									$("#popup").css({
										opacity: "1",
										transform: "scaleX(1)",
										top: "10%"
									});
									$(".lean-overlay").css("opacity", "2");
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("body").css("overflow", "auto");
										$(window).off();
										exports.resize_modal();
									});
								}
							});
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
								$("body").css("overflow", "auto");
								$(window).off();
								exports.resize_modal();
							});
						});
					});
				});
				$("#approve").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex(
						$("#approve").css("color")) == "#ff0000") {
						$("#approve").css("color", "green");
						if(data.cms_approval !== undefined &&
							data.cms_approval == null) {
							data.cms_approval = cookie;
						}
						else if(data.cms_approval !== undefined) {
							data.cms_approval +=
								"," + cookie;
						}
					}
					else {
						$("#approve").css("color", "red");
						var pos = data.cms_approval
							.indexOf(cookie);
						if(pos == 0) {
							data.cms_approval = data.cms_approval
								.substring(cookie.length + 2);
						}
						else {
							data.cms_approval = 
								data.cms_approval
									.substring(0, pos - 1) +
								data.cms_approval
									.substring(pos +
										cookie.length);
						}
					}
					if(data.cms_approval == "") {
						data.cms_approval = null;
					}
				});
				$("#add-box")
					.css("cursor", "default");
				$("#cms-version")
					.css("cursor", "default");
				$("#live-version").click(function(e) {
					e.preventDefault();
					$("#" + $(this).attr("data-tooltip-id"))
						.css("display", "none");
					if(exports.rgba_to_hex(
						$("#edit").closest("li")
						.css("background-color"))
						== "#008cc3") {
						if(page == "about") {
							data.heading_cms =
								$("#edit_title").text();
						}
						if($(".latex_body").length != 0) {
							$(".latex_body").each(function(index) {
								var arr_title = [],
									arr_body = [];
								$(".show_solution").each(function(index) {
									var title = $(this).children()
										.first().clone()
										.children().remove()
										.end().text();
									$(this).children()
										.children().each(function(index) {
										if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_off") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F") +
												"x5Fhidden");
										}
										else if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_on") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F"));
										}
									});
									$(this).siblings().each(function(index) {
										arr_body.push(
											$(this).children()[0].innerHTML);
									});
								});
								data.title_cms = arr_title;
								data.content_cms = arr_body;
							});
						}
						else {
							data.title_cms = [""];
							data.content_cms = [""];
						}
					}
					if(exports.rgba_to_hex(
						$("#live-version").closest("li")
						.css("background-color")) != "#008cc3") {
						var controller = $("#bar-div").detach();
						$("#latex").empty()
							.append(controller);
						if(page == "about") {
							$("#latex").append($("<div>")
								.attr("id", "main_message")
								.addClass("box_message")
								.append($("<h1>")
									.text(data.heading)
									.css("margin-top", "-60px")));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title[j] == null ||
								data.title[j] == "") {
								break;
							}
							var cont_div = "",
								title = data.title[j].split("x5F")
									.filter(function(elem) {
										return elem != "hidden";
									}).join("_"),
								accordion = $("<div>")
									.addClass("accordion"),
								show_solution = $("<div>")
									.addClass("show_solution")
									.text(title),
								span = $("<span>")
									.addClass("solution_display"),
								latex_body = $("<div>")
									.addClass("latex_body");
							if(data.title[j].split("x5F")
								.filter(function(elem) {
									return elem == "hidden";
								}).length == 0) {
								cont_div = $("<div>")
									.addClass("cont_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("remove"));
							}
							else {
								cont_div = $("<div>")
									.addClass("cont_div hidden_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("add"));
							}	
							latex_body.append(data.content[j]);
							cont_div.append(latex_body);
							show_solution.append(span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>")
								.addClass("accordion")
								.append($("<div>")
									.addClass("show_solution")
									.text("NO CONTENT HERE!")
									.css("pointer-events", "none")));
						}
						$("#add-box")
							.css("cursor", "default");
						$("#live-version")
							.css("cursor", "default")
							.closest("li")
							.css("background-color", "#008cc3");
						$("#cms-version")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						$("#edit")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "body"]);
						exports.handle_button();
					}
				});
				$("#cms-version").click(function(e) {
					e.preventDefault();
					$("#" + $(this).attr("data-tooltip-id"))
						.css("display", "none");
					if(exports.rgba_to_hex(
						$("#edit").closest("li")
						.css("background-color"))
						== "#008cc3") {
						if(page == "about") {
							data.heading_cms =
								$("#edit_title").text();
						}
						if($(".latex_body").length != 0) {
							$(".latex_body").each(function(index) {
								var arr_title = [],
									arr_body = [];
								$(".show_solution").each(function(index) {
									var title = $(this).children()
										.first().clone()
										.children().remove()
										.end().text();
									$(this).children()
										.children().each(function(index) {
										if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_off") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F")
												+ "x5Fhidden");
										}
										else if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_on") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F"));
										}
									});
									$(this).siblings().each(function(index) {
										arr_body.push(
											$(this).children()[0].innerHTML);
									});
								});
								data.title_cms = arr_title;
								data.content_cms = arr_body;
							});
						}
						else {
							data.title_cms = [""];
							data.content_cms = [""];
						}
					}
					if(exports.rgba_to_hex(
						$("#cms-version").closest("li")
						.css("background-color"))
						!= "#008cc3") {
						var controller = $("#bar-div").detach();
						$("#latex").empty()
							.append(controller);
						if(page == "about") {
							$("#latex").append($("<div>")
								.attr("id", "main_message")
								.addClass("box_message")
								.append($("<h1>")
									.text(data.heading_cms)
									.css("margin-top", "-60px")));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title_cms[j] == null ||
								data.title_cms[j] == "") {
								break;
							}
							var cont_div = "",
								title = data.title_cms[j].split("x5F")
									.filter(function(elem) {
										return elem != "hidden";
									}).join("_"),
								accordion = $("<div>")
									.addClass("accordion"),
								show_solution = $("<div>")
									.addClass("show_solution")
									.text(title),
								span = $("<span>")
									.addClass("solution_display"),
								latex_body = $("<div>")
									.addClass("latex_body");
							if(data.title_cms[j].split("x5F")
								.filter(function(elem) {
									return elem == "hidden";
								}).length == 0) {
								cont_div = $("<div>")
									.addClass("cont_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("remove"));
							}
							else {
								cont_div = $("<div>")
									.addClass("cont_div hidden_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("add"));
							}		
							latex_body.append(data.content_cms[j]);
							cont_div.append(latex_body);
							show_solution.append(span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>")
								.addClass("accordion")
								.append($("<div>")
									.addClass("show_solution")
									.text("NO CONTENT HERE!")
									.css("pointer-events", "none")));
						}
						$(".table-buttons")
							.css("display", "none");
						$("#add-box")
							.css("cursor", "default");
						$("#cms-version")
							.css("cursor", "default")
							.closest("li")
							.css("background-color", "#008cc3");
						$("#live-version")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						$("#edit")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "body"]);
						exports.handle_button();
					}
				});
				var titleComparison =
						data.title_cms.join("-----"),
					contentComparison =
						data.content_cms.join("-----"),
					headingComparison = undefined,
					approvalComparison = [],
					ind = -1;
				if(data.heading_cms !== undefined) {
					headingComparison =
						data.heading_cms;
				}
				if(data.cms_approval !== null) {
					approvalComparison.push(data.cms_approval)
					ind = data.cms_approval.indexOf(cookie);
				}
				if(ind == -1) {
					if(data.cms_approval === null) {
						approvalComparison.push(null, cookie);
					}
					else {
						approvalComparison.push(
							data.cms_approval +
							"," + cookie);
					}
				}
				else {
					approvalComparison.push(data.cms_approval
						.substring(0, ind - 1) +
						data.cms_approval.substring(ind +
							cookie.length));
				}
				$("#edit").click(function(e) {
					e.preventDefault();
					$("#" + $(this).attr("data-tooltip-id"))
						.css("display", "none");
					if(exports.rgba_to_hex(
						$("#edit").closest("li")
						.css("background-color"))
						!= "#008cc3") {
						var controller = 
							$("#bar-div").detach();
						$("#latex").empty()
							.append(controller);
						if(page == "about") {
							$("#latex").append($("<div>")
								.attr("id", "main_message")
								.addClass("box_message")
								.append($("<h1>")
									.text(data.heading_cms)
									.css("margin-top", "-60px")
									.attr({
										contentEditable: "true",
										id: "edit_title"
							})));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title_cms[j] == null ||
								data.title_cms[j] == "") {
								break;
							}
							var cont_div = "",
								title = data.title_cms[j].split("x5F")
									.filter(function(elem) {
										return elem != "hidden";
									}).join("_"),
								accordion = $("<div>")
									.addClass("accordion"),
								show_solution = $("<div>")
									.addClass("show_solution")
									.append($("<div>")
										.addClass("tog-title")
										.attr("contentEditable", "true")
										.text(title)),
								span = $("<span>")
									.addClass("solution_display"),
								span_toggle = $("<span>")
									.addClass("solution_toggle edit-tooltipped")
									.attr({
										"data-position": "top",
										"data-tooltip": "Toggle Box Display"
									}),
								span_box = $("<span>")
									.addClass("solution_box edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-math")
										.text("border_color"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Math Box Below"
									}),
								span_image = $("<span>")
									.addClass("solution_img edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-image")
										.text("image"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Image Below"
									}),
								span_table = $("<span>")
									.addClass("solution_table edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-table")
										.text("table_chart"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Table Below"
									}),
								span_bullet = $("<span>")
									.addClass("solution_bullet edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons format-list-bulleted")
										.text("format_list_bulleted"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert List Below"
									}),
								span_numbered = $("<span>")
									.addClass("solution_numbered edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons format-list-numbered")
										.text("format_list_numbered"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert List Below"
									}),
								span_link = $("<span>")
									.addClass("solution_link edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-link")
										.text("link"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Link Below"
									}),
								span_arrow_up = $("<span>")
									.addClass("solution_arrow_up edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons arrow-up")
										.text("arrow_upward"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Move Up"
									}),
								span_arrow_down = $("<span>")
									.addClass("solution_arrow_down edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons arrow-down")
										.text("arrow_downward"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Move Down"
									}),
								span_del = $("<span>")
									.addClass("solution_del edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons del-box")
										.text("delete_sweep"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Delete Box"
									}),
								span_note = $("<span>")
									.addClass("solution_note edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons note-box")
										.text("chat_bubble"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Comment Below"
									}),
								latex_body = $("<div>")
									.addClass("latex_body");
							if(data.title_cms[j].split("x5F")
								.filter(function(elem) {
									return elem == "hidden";
								}).length == 0) {
								cont_div = $("<div>")
									.addClass("cont_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("remove"));
								span_toggle.append($("<i>")
									.addClass("material-icons toggle")
									.text("toggle_on"));
							}
							else {
								cont_div = $("<div>")
									.addClass("cont_div hidden_div");
								span.append($("<i>")
									.addClass("material-icons")
									.text("add"));
								span_toggle.append($("<i>")
									.addClass("material-icons toggle")
									.text("toggle_off"));
							}	
							latex_body.append(data.content_cms[j]);
							cont_div.append(latex_body);
							show_solution.append(span_box,
								span_table, span_image, span_bullet,
								span_numbered, span_link, span_note,
								span_del, span_arrow_up,
								span_arrow_down, span_toggle, span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>")
								.addClass("accordion")
								.append($("<div>")
									.addClass("show_solution")
									.text("NO CONTENT HERE!")
									.css("pointer-events", "none")));
						}
						$("#add-box")
							.css("cursor", "pointer");
						$("#edit")
							.css("cursor", "default")
							.closest("li")
							.css("background-color", "#008cc3");
						$("#live-version")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						$("#cms-version")
							.css("cursor", "pointer")
							.closest("li")
							.css("background-color", "");
						$(".latex_body")
							.attr("contentEditable", "true");
						$(".latex_body").keydown(function(e) {
						    if(e.keyCode === 13) {
						    	document.execCommand(
						    		"insertHTML", false, "<br><br>");
						    	return false;
						    }
						});
						$(".edit-tooltipped").tooltip();
						exports.handle_button(1);
						$("#add-box").off("click");
						$("#add-box").on("click", function(e) {
							e.preventDefault();
							if($(".accordion").length == 1 && 
								$(".accordion .show_solution").text()
								== "NO CONTENT HERE!") {
								$(".accordion").remove();
							}
							var cont_div = "",
								accordion = $("<div>")
									.addClass("accordion"),
								show_solution = $("<div>")
									.addClass("show_solution")
									.append($("<div>")
										.addClass("tog-title")
										.attr("contentEditable", "true")
										.text("New Title")),
								span = $("<span>")
									.addClass("solution_display"),
								span_toggle = $("<span>")
									.addClass("solution_toggle edit-tooltipped")
									.attr({
										"data-position": "top",
										"data-tooltip": "Toggle Box Display"
									}),
								span_box = $("<span>")
									.addClass("solution_box edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-math")
										.text("border_color"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Math Box Below"
									}),
								span_image = $("<span>")
									.addClass("solution_img edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-image")
										.text("image"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Image Below"
									}),
								span_table = $("<span>")
									.addClass("solution_table edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-table")
										.text("table_chart"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Table Below"
									}),
								span_bullet = $("<span>")
									.addClass("solution_bullet edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons format-list-bulleted")
										.text("format_list_bulleted"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert List Below"
									}),
								span_numbered = $("<span>")
									.addClass("solution_numbered edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons format-list-numbered")
										.text("format_list_numbered"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert List Below"
									}),
								span_link = $("<span>")
									.addClass("solution_link edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons add-link")
										.text("link"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Link Below"
									}),
								span_arrow_up = $("<span>")
									.addClass("solution_arrow_up edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons arrow-up")
										.text("arrow_upward"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Move Up"
									}),
								span_arrow_down = $("<span>")
									.addClass("solution_arrow_down edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons arrow-down")
										.text("arrow_downward"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Move Down"
									}),
								span_del = $("<span>")
									.addClass("solution_del edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons del-box")
										.text("delete_sweep"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Delete Box"
									}),
								span_note = $("<span>")
									.addClass("solution_note edit-tooltipped")
									.append($("<i>")
										.addClass("material-icons note-box")
										.text("chat_bubble"))
									.attr({
										"data-position": "top",
										"data-tooltip": "Insert Comment Below"
									}),
								latex_body = $("<div>")
									.addClass("latex_body")
									.text("New Content"),
								cont_div = $("<div>")
									.addClass("cont_div");
							span.append($("<i>")
								.addClass("material-icons")
								.text("remove"));
							span_toggle.append($("<i>")
								.addClass("material-icons toggle")
								.text("toggle_on"));
							cont_div.append(latex_body);
							show_solution.append(span_box,
								span_table, span_image,
								span_bullet, span_numbered,
								span_link, span_note,
								span_arrow_up,
								span_arrow_down,
								span_del, span_toggle,
								span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
							data.title_cms.push("New Title");
							data.content_cms.push("New Content");
							$(".latex_body")
								.attr("contentEditable", "true");
							exports.handle_button(1);
							exports.latex_cms_links(data);
							document.height = Math.max(
								document.body.scrollHeight,
								document.body.offsetHeight, 
                      			document.documentElement.clientHeight,
                      			document.documentElement.scrollHeight, 
                      			document.documentElement.offsetHeight
                      		); 
						});
						exports.latex_cms_links(data);
					}
				});
				$("#save").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex(
						$("#edit").closest("li")
						.css("background-color"))
						== "#008cc3") {
						if(page == "about") {
							data.heading_cms =
								$("#edit_title").text();
						}
						if($(".latex_body").length != 0) {
							$(".latex_body").each(function(index) {
								var arr_title = [],
									arr_body = [];
								$(".show_solution").each(function(index) {
									var title = $(this).children()
										.first().clone()
										.children().remove()
										.end().text();
									$(this).children()
										.children().each(function(index) {
										if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_off") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F")
												+ "x5Fhidden");
										}
										else if($(this).hasClass("toggle") &&
											$(this).text() == "toggle_on") {
											arr_title.push(exports.replace_all(
												title, "_", "x5F"));
										}
									});
									$(this).siblings().each(function(index) {
										arr_body.push(
											$(this).children()[0].innerHTML);
									});
								});
								data.title_cms = arr_title;
								data.content_cms = arr_body;
							});
						}
						else {
							data.title_cms = [""];
							data.content_cms = [""];
						}
					}
					$.get("/pages/dist/modal-min.html")
						.done(function(content) {
						$("body").append(content);
						$(".modal-trigger").leanModal({
							dismissible: false,
							opacity: 2,
							inDuration: 1000,
							outDuration: 1000
						});
						$.get("/api/cms/count/contributors")
							.done(function(num) {
							const validation = 
								Math.ceil(Math.log(parseInt(num)));
							data.title_cms = data.title_cms
								.map(function(elem) {
									return elem.split("\\$")
										.map(function(iter, index) {
										if(index % 2 == 0) {
											return exports.replace_all(
												exports.replace_all(iter,
													"\\\\", "%5C"),
												"'", "%27");
										}
										else { return iter; }
								}).join("\$");
							});
							data.content_cms = data.content_cms
								.map(function(elem) {
									return elem.split("\\$")
										.map(function(iter, index) {
										if(index % 2 == 0) {
											return exports.replace_all(
												exports.replace_all(iter,
													"\\\\", "%5C"),
												"'", "%27");
										}
										else { return iter; }
								}).join("\$");
							});
							if(data.cms_approval !== undefined
								&& data.cms_approval !== null
								&& data.cms_approval != ""
								&& titleComparison ===
									decodeURIComponent(data.title_cms
										.join("-----"))
								&& contentComparison ===
									decodeURIComponent(data.content_cms
										.join("-----"))
								&& data.cms_approval
									.split(",").length >= validation) {
								data.title = data.title_cms;
								data.content = data.content_cms
									.map(function(elem) {
									var filter = exports.replace_all(elem, 
											'<div class="table-buttons">' +
											'<a class="waves-effect' +
											' waves-light btn add-row"' +
											' contenteditable="false">' +
											'Row<i class="material-icons' +
											' right">add</i></a><a class' +
											'="waves-effect waves-light' +
											' btn remove-row" ' +
											'contenteditable="false">' +
											'Row<i class="material-' +
											'icons right">remove</i>' +
											'</a><a class="waves-' +
											'effect waves-light btn' +
											' add-column" content' +
											'editable="false">Column' +
											'<i class="material-icons' +
											' right">add</i></a><a' +
											' class="waves-effect' +
											' waves-light btn remove' +
											'-column" contenteditable' +
											'="false">Column<i class' +
											'="material-icons right' +
											'">remove</i></a></div>', ""),
										reg = new RegExp('<div class' +
											'="row note-row" content' +
											'editable="false"><div' +
											' class="col s12 m5' +
											' note-col"><div ' +
											'class="card-panel' +
											'"> <span class=' +
											'"black-text"' +
											' contenteditable' +
											'="true">.*<\/span' +
											'><\/div><\/div><\/div>');
									filter = exports.replace_all(filter,
										reg, "");
									return exports.replace_all(filter,
										'<div class="table-buttons">' +
										'<a class="waves-effect ' +
										'waves-light btn plus-bullet"' +
										' contenteditable="false">' +
										'Bullet<i class="material-icons' +
										' right">add</i></a><a class=' +
										'"waves-effect waves-light' +
										' btn minus-bullet" ' +
										'contenteditable="false">Bullet' +
										'<i class="material-icons ' +
										'right">remove</i></a></div>', "");
								});
								data.heading = data.heading_cms;
								data.cms_approval = 0;
								$.post("/api/log/want/" + page,
									{id: db_id}).done(function(log) {
									if(log === null) { log = ""; }
									var now = new Date()
											.toLocaleString("en-US",
												{timeZone: "UTC"}),
										change = "The system just pushed" +
											" the cms content of the ";
									if(page == "about") {
										change += "about page";
									}
									else {
										change += page + " " +
											subject.clean_name;
									}
									change += " to the client side."
									if(log != "") {
										log += "-----";
									}
									log += now + "_____" + change;
									$.post("/api/log/change/" + page, {
											id: db_id,
											log: log
									});
								});
							}
							else {
								if(!(titleComparison ===
									decodeURIComponent(data.title_cms
										.join("-----")) &&
									contentComparison ===
									decodeURIComponent(data.content_cms
										.join("-----")))) {
									data.cms_approval !== undefined &&
										data.cms_approval !== null &&
										data.cms_approval.indexOf(cookie) != -1
										? data.cms_approval = cookie
										: data.cms_approval = "";
								}
								data.title = data.title
									.map(function(elem) {
										return elem.split("\\$")
											.map(function(iter, index) {
											if(index % 2 == 0) {
												return exports.replace_all(
													exports.replace_all(iter,
														"\\\\", "%5C"),
													"'", "%27");
											}
											else { return iter; }
									}).join("\$");
								});
								data.content = data.content
									.map(function(elem) {
										return elem.split("\\$")
											.map(function(iter, index) {
											if(index % 2 == 0) {
												return exports.replace_all(
													exports.replace_all(iter,
														"\\\\", "%5C"),
													"'", "%27");
											}
											else { return iter; }
									}).join("\$");
								});
							}
							var obj = {
								param: db_id,
								ref: ref,
								name: "undefined",
								order: "undefined",
								status: "undefined",
								title: data.title.join("-----") 
									!= "" 
									? data.title.join("-----")
									: "0",
								content: data.content.join("-----") 
									!= "" 
									? data.content.join("-----")
									: "0",
								side_approval: "undefined",
								cms_approval: data.cms_approval != "" 
									&& data.cms_approval !== undefined
									&& data.cms_approval !== null 
									? data.cms_approval
									: "0",
								del_approval: "undefined",
								title_cms: data.title_cms
									.join("-----") != "" 
									? data.title_cms.join("-----")
									: "0",
								content_cms: data.content_cms
									.join("-----") != "" 
									? data.content_cms.join("-----")
									: "0"
							};
							var call = "/api/change/";
							if(page == "subject") {
								call += "subject/";
							}
							else if(page == "topic") {
								call += "topic/";
							}
							else if(page == "section") {
								call += "section/";
							}
							else if(page == "example") {
								call += "example/";
							}
							else if(page == "about") {
								call = "/api/cms/about/change/";
								obj.heading = data.heading;
								obj.heading_cms = data.heading_cms;
							}
							$.post(call, obj)
								.fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was" +
									" an issue uploading the" +
									" content changes to the" +
									" database!");
								$("#popup_control").click();
								var popup = $("#popup")[0].outerHTML,
									popup_control = $("#popup_control")[0].outerHTML,
									overlay = $(".lean-overlay")[0].outerHTML;
								$(window).on("resize", function() {
									if(exports.width_func() >= 992) {
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										var controlWrap = $("<div>").html(popup_control),
											popupWrap = $("<div>").html(popup),
											overlayWrap = $("<div>").html(overlay);
										$("body").append(controlWrap.children().first(),
											popupWrap.children().first(),
											overlayWrap.children().first());
										$("#popup").css({
											opacity: "1",
											transform: "scaleX(1)",
											top: "10%"
										});
										$(".lean-overlay").css("opacity", "2");
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$("body").css("overflow", "auto");
											$(window).off();
											exports.resize_modal();
										});
									}
								});
								$("#popup_submit").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$("body").css("overflow", "auto");
									$(window).off();
									exports.resize_modal();
								});
							}).done(function() {
								$.post("/api/log/want/" + page,
									{id: db_id}).done(function(log) {
									var cont = exports.compareTo(data);
									if(titleComparison !==
											cont[0].join("-----")
										|| contentComparison !==
											decodeURIComponent(cont[1].join("-----"))
										|| (headingComparison !==
											undefined &&
											headingComparison !==
											cont[2].join("-----"))) {
										if(log === null) { log = ""; }
										var now = new Date()
												.toLocaleString("en-US",
													{timeZone: "UTC"}),
											change = "The ";
										if(page == "about") {
											change += "about page";
										}
										else {
											change += page + " " +
												subject.clean_name;
										}
										change += " had its cms content" +
											" edited by the contributor " +
											cookie + ".";
										if(log != "") {
											log += "-----";
										}
										log += now + "_____" + change;
										$.post("/api/log/change/" + page, {
												id: db_id,
												log: log
										});
									}
								}).done(function() {
									$("#popup_title").text("Changes Saved");
									$("#popup_body").text("All changes" +
										" to the content have been" +
										" saved to the database!");
									$("#popup_control").click();
									var popup = $("#popup")[0].outerHTML,
										popup_control = $("#popup_control")[0].outerHTML,
										overlay = $(".lean-overlay")[0].outerHTML;
									$(window).on("resize", function() {
										if(exports.width_func() >= 992) {
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											var controlWrap = $("<div>").html(popup_control),
												popupWrap = $("<div>").html(popup),
												overlayWrap = $("<div>").html(overlay);
											$("body").append(controlWrap.children().first(),
												popupWrap.children().first(),
												overlayWrap.children().first());
											$("#popup").css({
												opacity: "1",
												transform: "scaleX(1)",
												top: "10%"
											});
											$(".lean-overlay").css("opacity", "2");
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												location.reload();
												$(window).scrollTop(0);
											});
										}
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										location.reload();
										$(window).scrollTop(0);
									});
								});
							});
						});
					});
				});
				$.get("/pages/dist/button-min.html")
					.done(function(button) {
					$("body").append(button);
					$("#dev-btn").children("ul").first()
						.css("pointer-events", "none")
					exports.committee(cookie, function() {
						exports.handle_logo_link(page);
						exports.handle_logo();
						exports.handle_li_coloring();
						links.handle_links(router, subjects,
							topics, sections, examples);
						var interval = setInterval(function() {
							$.post(statement, {param: db_id})
								.done(function(comparison) {
								comparison.title = comparison.title != null 
									? decodeURIComponent(comparison.title)
									: "";
								comparison.content = comparison.content != null 
									? decodeURIComponent(comparison.content)
									: "";
								comparison.title_cms = comparison.title_cms != null 
									? decodeURIComponent(comparison.title_cms)
									: "";
								comparison.content_cms = comparison.content_cms != null 
									? decodeURIComponent(comparison.content_cms)
									: "";
								if(page == "about") {
									comparison.heading_cms = comparison.heading_cms != null 
										? decodeURIComponent(comparison.heading_cms)
										: "";
									if(comparison.heading_cms !=
											headingComparison ||
										exports.replace_all(
											comparison.title_cms,
											"_", "x5F") !=
											titleComparison ||
										comparison.content_cms !=
											contentComparison ||
										!approvalComparison.some(function(elem) {
											return elem == comparison.cms_approval;
										})) {
										exports.update_modal();
									}
								}
								else {
									if(exports.replace_all(comparison.title_cms,
										"_", "x5F") != titleComparison ||
										comparison.content_cms !=
											contentComparison ||
										!approvalComparison.some(function(elem) {
											return elem == comparison.cms_approval;
										})) {
										exports.update_modal();
									}
								}
							});
						}, 1000 * 60 * 5);
						exports.listen_cookie_change("contributor", function() {
							if(exports.read_cookie("contributor") == "") {
								clearInterval(interval);
							}
						});
						$("a").click(function(e) {
							e.preventDefault();
							if(exports.rgba_to_hex(
								$("#edit").closest("li")
								.css("background-color"))
								== "#008cc3") {
								if(page == "about") {
									data.heading_cms =
										$("#edit_title").text();
								}
								if($(".latex_body").length != 0) {
									$(".latex_body").each(function(index) {
										var arr_title = [],
											arr_body = [];
										$(".show_solution").each(function(index) {
											var title = $(this).children()
												.first().clone()
												.children().remove()
												.end().text();
											$(this).children()
												.children().each(function(index) {
												if($(this).hasClass("toggle") &&
													$(this).text() == "toggle_off") {
													arr_title.push(title +
														"_hidden");
												}
												else if($(this).hasClass("toggle") &&
													$(this).text() == "toggle_on") {
													arr_title.push(title);
												}
											});
											$(this).siblings().each(function(index) {
												arr_body.push(
													$(this).children()[0].innerHTML);
											});
										});
										data.title_cms = arr_title;
										data.content_cms = arr_body;
									});
								}
								else {
									data.title_cms = [""];
									data.content_cms = [""];
								}
							}
							var id = $(this).attr("id"),
								cont = exports.compareTo(data);
							if(id == "logo_cms") {
								if(titleComparison === cont[0].join("-----")
									&& contentComparison ===
									decodeURIComponent(cont[1].join("-----"))) {
									if(headingComparison !== undefined) {
										if(headingComparison ===
											cont[2].join("-----")) {
											router.navigate("cms");
										}
										else {
											exports.warning_modal(router, "cms");
										}
									}
									else {
										router.navigate("cms");
									}
								}
								else {
									exports.warning_modal(router, "cms");
								}
							}
							else {
								if(id) {
									var holder = id.split("_"),
										id_string = holder[0];
									if(holder.length > 1) {
										var id_num = holder[1];
									}
									if(id_string == "subjects"
										&& holder[1] != "change"
										&& holder[2] == "cms") {
										var subject = subjects
											.filter(function(iter) {
												return iter.sid ==
													id_num;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit",
														{sname: subject.sname});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit",
														{sname: subject.sname});
												}
											}
											else {
												router.navigate("subjectEdit",
													{sname: subject.sname});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit",
												{sname: subject.sname});
										}
									}
									else if(id_string == "subjectnav"
										&& holder[1] == "cms") {
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("cms");
												}
												else {
													exports.warning_modal(router,
														"cms");
												}
											}
											else {
												router.navigate("cms");
											}
										}
										else {
											exports.warning_modal(router,
												"cms");
										}
									}
									else if(id_string == "topics"
										&& holder[1] != "change"
										&& holder[2] == "cms") {
										var topic = topics
											.filter(function(iter) {
												return iter.tid ==
													id_num;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
														topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit.topicEdit", {
														sname: subject.sname,
														tname: topic.tname
													});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit.topicEdit", {
															sname: subject.sname,
															tname: topic.tname
													});
												}
											}
											else {
												router.navigate("subjectEdit.topicEdit", {
													sname: subject.sname,
													tname: topic.tname
												});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit.topicEdit", {
													sname: subject.sname,
													tname: topic.tname
											});
										}
									}
									else if(id_string == "topicnav"
										&& holder[2] == "cms") {
										var topic = topics
											.filter(function(iter) {
												return iter.tid ==
													id_num;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
														topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit",
														{sname: subject.sname});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit",
														{sname: subject.sname});
												}
											}
											else {
												router.navigate("subjectEdit",
													{sname: subject.sname});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit",
												{sname: subject.sname});
										}
									}
									else if(id_string == "sections"
										&& holder[1] != "change"
										&& holder[2] == "cms") {
										var section = sections
											.filter(function(iter) {
												return iter.section_id ==
													id_num;
										})[0],
											topic = topics
												.filter(function(iter) {
													return iter.tid ==
														section.tid;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
														topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
															section.section_name, 
															current_page_name: 
																section.section_name
													});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
															section.section_name, 
															current_page_name: 
																section.section_name
													});
												}
											}
											else {
												router.navigate("subjectEdit." +
													"topicEdit.sectionEdit." +
													"current_pageEdit", {
														sname: subject.sname, 
														tname: topic.tname, 
														section_name: 
														section.section_name, 
														current_page_name: 
															section.section_name
												});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit." +
												"topicEdit.sectionEdit." +
												"current_pageEdit", {
													sname: subject.sname, 
													tname: topic.tname, 
													section_name: 
													section.section_name, 
													current_page_name: 
														section.section_name
											});
										}
									}
									else if(id_string == "sectionnav"
										&& holder[2] == "cms") {
										var section = sections
											.filter(function(iter) {
												return iter.section_id ==
													id_num;
										})[0],
											topic = topics
												.filter(function(iter) {
													return iter.tid ==
														section.tid;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
														topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit.topicEdit", {
														sname: subject.sname,
														tname: topic.tname
													});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit.topicEdit", {
															sname: subject.sname, 
															tname: topic.tname
													});
												}
											}
											else {
												router.navigate("subjectEdit.topicEdit", {
													sname: subject.sname,
													tname: topic.tname
												});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit.topicEdit", {
													sname: subject.sname, 
													tname: topic.tname
											});
										}
									}
									else if(id_string == "sectionname"
										&& holder[2] == "cms") {
										var section = sections
											.filter(function(iter) {
												return iter.section_id ==
													id_num;
										})[0],
											topic = topics
												.filter(function(iter) {
													return iter.tid ==
														section.tid;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
														topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
																section.section_name, 
															current_page_name: 
																section.section_name
													});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
																section.section_name, 
															current_page_name: 
																section.section_name
													});
												}
											}
											else {
												router.navigate("subjectEdit." +
													"topicEdit.sectionEdit." +
													"current_pageEdit", {
														sname: subject.sname, 
														tname: topic.tname, 
														section_name: 
															section.section_name, 
														current_page_name: 
															section.section_name
												});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit." +
												"topicEdit.sectionEdit." +
												"current_pageEdit", {
													sname: subject.sname, 
													tname: topic.tname, 
													section_name: 
														section.section_name, 
													current_page_name: 
														section.section_name
											});
										}
									}
									else if(id_string == "examples"
										&& holder[1] != "change"
										&& holder[2] == "cms") {
										var example = examples
											.filter(function(iter) {
												return iter.eid ==
													id_num;
										})[0],
											section = sections
												.filter(function(iter) {
													return iter.section_id ==
														example.section_id;
										})[0],
											topic = topics
												.filter(function(iter) {
													return iter.tid ==
														section.tid;
										})[0],
											subject = subjects
												.filter(function(iter) {
													return iter.sid ==
													topic.sid;
										})[0];
										if(titleComparison ===
											cont[0].join("-----")
											&& contentComparison ===
											cont[1].join("-----")) {
											if(headingComparison !== undefined) {
												if(headingComparison ===
													cont[2].join("-----")) {
													router.navigate("subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
																section.section_name, 
															current_page_name: 
																example.ename
													});
												}
												else {
													exports.warning_modal(router,
														"subjectEdit." +
														"topicEdit.sectionEdit." +
														"current_pageEdit", {
															sname: subject.sname, 
															tname: topic.tname, 
															section_name: 
																section.section_name, 
															current_page_name: 
																example.ename
													});
												}
											}
											else {
												router.navigate("subjectEdit." +
													"topicEdit.sectionEdit." +
													"current_pageEdit", {
														sname: subject.sname, 
														tname: topic.tname, 
														section_name: 
															section.section_name, 
														current_page_name: 
															example.ename
												});
											}
										}
										else {
											exports.warning_modal(router,
												"subjectEdit." +
												"topicEdit.sectionEdit." +
												"current_pageEdit", {
													sname: subject.sname, 
													tname: topic.tname, 
													section_name: 
														section.section_name, 
													current_page_name: 
														example.ename
											});
										}
									}
								}
							}
						});
						exports.handle_orientation();
						if(page == "about") {
							exports.handle_desktop_title("about");
						}
						else if(page == "subject") {
							exports.handle_desktop_title("subject",
								subject);
						}
						else if(page == "topic") {
							exports.handle_desktop_title("topic",
								subject, topic);
						}
						else if(page == "section"
							|| page == "example") {
							exports.handle_desktop_title("section",
								subject, topic, section);
						}
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "body"]);
						$("#bar-nav")
							.css("width", "100%");
						$("#bar").css("width",
							$("#latex").width());
						$("#live-version").parent("li")
							.css("margin-left", "25px");
						$("#save").parent("li")
							.css("margin-right", "25px");
						$("#cms-version")
							.closest("li")
							.css("background-color",
								"#008cc3");
						if(page == "about") {
							$("#subjects_change")
								.click(function(e) {
									e.preventDefault();
									exports.sidenav_modal(
										"Subjects");
							});
						}
						else if(page == "subject") {
							$("#topics_change")
								.click(function(e) {
									e.preventDefault();
									exports.sidenav_modal(
										"Topics", subject.sid);
							});
						}
						else if(page == "topic") {
							$("#sections_change")
								.click(function(e) {
									e.preventDefault();
									exports.sidenav_modal(
										"Sections", topic.tid);
							});
						}
						else if(page == "section"
							|| page == "example") {
							$("#examples_change")
								.click(function(e) {
									e.preventDefault();
									exports.sidenav_modal(
										"Examples", section
											.section_id);
							});
						}
						document.height = Math.max(
							document.body.scrollHeight,
							document.body.offsetHeight, 
		          			document.documentElement.clientHeight,
		          			document.documentElement.scrollHeight, 
		          			document.documentElement.offsetHeight
		          		);
						$(window).on("resize", function() {
							if(page == "about") {
								exports.handle_desktop_title(
									"about");
							}
							else if(page == "subject") {
								exports.handle_desktop_title(
									"subject", subject);
							}
							else if(page == "topic") {
								exports.handle_desktop_title(
									"topic", subject, topic);
							}
							else if(page == "section"
								|| page == "example") {
								exports.handle_desktop_title(
									"section", subject, topic,
									section);
							}
							if(exports.width_func() < 992) {
								$("#logo").css({
									"float": "right",
									"right": "10px"
								});
							}
							else {
								$("#logo").css({
									"float": "",
									"right": ""
								});
							}
							exports.handle_breadcrumbs(page,
								$(".accordion").first(), subject,
								topic, section, example);
							exports.handle_dividers(page);
							var width = 0,
								screen_width = exports.width_func();
							if(screen_width >= 992) {
								width = 350;
							}
							else if(screen_width < 992
								&& screen_width > 400) {
								width = screen_width * .75;
								$("#popup").css({
									opacity: "1",
									transform: "scaleX(1)",
									top: "10%"
								});
								$(".lean-overlay").css("opacity", "2");
							}
							else {
								width = screen_width * .72;
								$("#popup").css({
									opacity: "1",
									transform: "scaleX(1)",
									top: "10%"
								});
								$(".lean-overlay").css("opacity", "2");
							}
							$("#nav-mobile").css("width", width);
						});
					});
				});
				$(document).click(function(event) {
					event.stopImmediatePropagation();
					if(event.which !== undefined) {
						exports.delete_cookie("contributor");
						exports.write_cookie("contributor",
							cookie, 180);
					}
				});
			});
		});
	};

	/*

	Purpose:
		Handles the initial load of
		any client page.

	Parameters:
		callback: 
			A function callback

	*/
	exports.initial_client = function(callback) {
		$.get("/pages/dist/main-min.html")
			.done(function(content) {
			$(document.body).empty()
				.append(content);
			callback();
		});
	};

	/*

	Purpose:
		Handles the loading of all content
		for the client pages.

	Parameters:
		page: 
			The name of the page
			currently set
		router:
			An object representing
			the router
		links:
			An object that handles
			all links on a page
		subjects:
			An array of all subjects
			in the database
		topics:
			An array of all topics
			in the database
		sections:
			An array of all sections
			in the database
		examples:
			An array of all examples
			in the database
		subject: 
			An object representing
			the current subject
		topic: 
			An object representing
			the current topic
		section: 
			An object representing
			the current section
		example:
			An object representing
			the current example

	*/
	exports.latex = function(page, router, links,
		subjects, topics, sections, examples, subject,
		topic, section, example) {
		$("body").css("background", "#e0e0e0");
		$("main").empty();
		$("main").append($("<div>")
			.attr("id", "latex"));
		var statement = "/api/",
			db_id = -1;
		if(page == "about") { 
			statement += "about/client";
			$("title").text("About");
		}
		else if(page == "subject") { 
			statement +=
				"subject/data/client";
			db_id = subject.sid;
			$("title")
				.text(subject.clean_name);
		}
		else if(page == "topic") { 
			statement +=
				"topic/data/client";
			db_id = topic.tid;
			$("title")
				.text(subject.clean_name +
					" - " +
					topic.clean_name);
		}
		else if(page == "section") { 
			statement +=
				"section/data/client";
			db_id = section.section_id;
			$("title")
				.text(subject.clean_name +
					" - " +
					topic.clean_name + 
					" - " +
					section.clean_name);
		}
		else if(page == "example") { 
			statement +=
				"example/data/client";
			db_id = example.eid;
			$("title")
				.text(subject.clean_name +
					" - " +
					topic.clean_name + 
					" - " +
					section.clean_name);
		}
		$.post(statement, {"param": db_id})
			.done(function(data) {
			data.title = data.title != null
				? decodeURIComponent(
					data.title).split("-----")
				: [""];
			data.content = data.content != null
				? decodeURIComponent(
					data.content).split("-----")
				: [""];
			if(page == "about") {
				$("#latex").append($("<div>")
					.attr("id", "main_message")
					.addClass("box_message")
					.append($("<h1>")
						.text(data.heading)));
			}
			var i = 0;
			for(; i >= 0; i++) {
				if(data.title[i] == null ||
					data.title[i] == "") {
					break;
				}
				var cont_div = "",
					title = data.title[i].split("x5F")
						.filter(function(elem) {
							return elem != "hidden";
						}).join("_"),
					accordion = $("<div>")
						.addClass("accordion"),
					show_solution = $("<div>")
						.addClass("show_solution")
						.text(title),
					span = $("<span>")
						.addClass("solution_display"),
					latex_body = $("<div>")
						.addClass("latex_body");
				if(data.title[i].split("x5F")
					.filter(function(elem) {
						return elem == "hidden";
					}).length == 0) {
					cont_div = $("<div>")
						.addClass("cont_div");
					span.append($("<i>")
						.addClass("material-icons")
						.text("remove"));
				}
				else {
					cont_div = $("<div>")
						.addClass("cont_div hidden_div");
					span.append($("<i>")
						.addClass("material-icons")
						.text("add"));
				}	
				latex_body.append(data.content[i]);
				cont_div.append(latex_body);
				show_solution.append(span);
				accordion.append(show_solution);
				accordion.append(cont_div);
				$("#latex").append(accordion);
			}
			if(i == 0) {
				$("#latex").append($("<div>")
					.addClass("accordion")
					.append($("<div>")
						.addClass("show_solution")
						.text("NO CONTENT HERE!")
						.css("pointer-events", "none")));
			}
			exports.handle_breadcrumbs(page,
				$(".accordion").first(), subject,
				topic, section, example);
			exports.handle_button();
			exports.handle_logo_link(page);
			exports.handle_logo();
			exports.handle_li_coloring();
			links.handle_links(router, subjects,
				topics, sections, examples);
			exports.handle_orientation();
			if(page == "about") {
				exports.handle_desktop_title(
					"about");
			}
			else if(page == "subject") {
				exports.handle_desktop_title(
					"subject", subject);
			}
			else if(page == "topic") {
				exports.handle_desktop_title(
					"topic", subject, topic);
			}
			else if(page == "section" ||
				page == "example") {
				exports.handle_desktop_title(
					"section", subject, topic,
					section);
			}
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, "body"]);
			$("body").css("overflow", "auto");
			$(window).on("resize", function() {
				if(page == "about") {
					exports.handle_desktop_title(
						"about");
				}
				else if(page == "subject") {
					exports.handle_desktop_title(
						"subject", subject);
				}
				else if(page == "topic") {
					exports.handle_desktop_title(
						"topic", subject, topic);
				}
				else if(page == "section" ||
					page == "example") {
					exports.handle_desktop_title(
						"section", subject, topic,
						section);
				}
				if(exports.width_func() < 992) {
					$("#logo").css({
						"float": "right",
						"right": "10px"
					});
				}
				else {
					$("#logo").css({
						"float": "",
						"right": ""
					});
				}
				exports.handle_breadcrumbs(page,
					$(".accordion").first(), subject,
					topic, section, example);
				exports.handle_dividers(page);
				var width = 0,
					screen_width = exports.width_func();
				if(screen_width >= 992) {
					width = 350;
				}
				else if(screen_width < 992 && screen_width > 400) {
					width = screen_width * .75;
				}
				else {
					width = screen_width * .72;
				}
				$("#nav-mobile").css("width", width);
			});
		});
	};

	return exports;
});