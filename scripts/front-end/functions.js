define(function() {
	var exports = {};

	// exports.scale_down = function(dataUrl, newWidth, imageType, imageArguments) {
	//     "use strict";
	//     var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

	//     // Provide default values
	//     imageType = imageType || "image/jpeg";
	//     imageArguments = imageArguments || 0.7;

	//     // Create a temporary image so that we can compute the height of the downscaled image.
	//     image = new Image();
	//     image.src = dataUrl;
	//     oldWidth = image.width;
	//     oldHeight = image.height;
	//     newHeight = Math.floor(oldHeight / oldWidth * newWidth)

	//     // Create a temporary canvas to draw the downscaled image on.
	//     canvas = document.createElement("canvas");
	//     canvas.width = newWidth;
	//     canvas.height = newHeight;

	//     // Draw the downscaled image on the canvas and return the new data URL.
	//     ctx = canvas.getContext("2d");
	//     ctx.drawImage(image, 0, 0, newWidth, newHeight);
	//     newDataUrl = canvas.toDataURL(imageType, imageArguments);
	//     return newDataUrl;
	// };

	/*

	Purpose:
	Replaces all instances of a substring inside of a given string.

	Parameters:
		str: 
			The overall string
		find:
			The substring which is to be replaced
		replace:
			The string which will replace the substring

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
		   output[key] = (typeof v === "object") ? exports.copy(v) : v;
		}
		return output;
	};

	/*

	Purpose:
	Checks if a string meets the requirements to be a password.

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
			Number of minutes til cookie expiration

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
	Listens for a change in the cookie with the given name.

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
	Handles the modal for a screen resize.

	Parameters:
		callback: 
			Function callback

	*/
	exports.resize_modal = function(callback) {
		var counter = 0;
		function message() {
			$(".lean-overlay").remove();
			$("#popup").remove();
			$("#popup_control").remove();
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
		};
		if(exports.width_func() < 992) { message(); }
		else { counter++; callback(); }
		$(window).on("resize", function() {
			$("body").css("width", "100%");
			if(exports.width_func() < 992) {
				message();
			}
			else {
				$(".lean-overlay").remove();
				$("#popup").remove();
				$("#popup_control").remove();
				if(counter == 0) { counter++; callback(); }
			}
		});
	};

	/*

	Purpose:
	Adds a committee option to the fixed action button.

	Parameters:
		email: 
			A contributor's email

	*/
	exports.committee = function(email, callback) {
		$.get("/api/cms/committee/check/" + email).done(function(check) {
			if(check >= 1) {
				var group = $("<a>").attr("id", "committee").addClass("btn-floating").css("background", "#00b8ff")
					.append($("<i>").addClass("material-icons").text("group_work"));
			}
			if(check == 1) {
				var ranking = $("<a>").attr("id", "ranking").addClass("btn-floating").css("background", "#00b8ff")
					.append($("<i>").addClass("material-icons").text("thumbs_up_down"));
				$("#profile").closest("li").before($("<li>").append(ranking), $("<li>").append(group));
			}
			else if(check == 2) {
				var decision = $("<a>").attr("id", "decision").addClass("btn-floating").css("background", "#00b8ff")
					.append($("<i>").addClass("material-icons").text("group"));
				$("#profile").closest("li").before($("<li>").append(decision), $("<li>").append(group));
			}
		}).done(function() { callback(); });
	};




	/*

	Purpose:
	Handles the decision modal for the administrator.

	*/
	exports.decision_modal = function() {
		$.get("/pages/dist/committee-table-min.html").done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Administrator Privileges").css("text-align", "center");
			$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "As the administrator of manualmath you have the power to increase a" +
				" contributor's current role by adding the user to the committee. At the same time" +
				" you may also decrease a contributor's current role by deleting their account from" +
				" the database. Using the table below you can approve and delete contributors who have" +
				" a green light indicator."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/data").done(function(contributors) {
				var list = contributors.map(function(elem, index) {
					elem.num = index;
					elem.rank_up = 0;
					elem.rank_down = 0;
					elem.deleted = 0;
					return elem;
				});
				$("#committee_table_head").find("tr th:nth-last-child(2)").text("Member Up Votes");
				$("#committee_table_head").find("tr th").last().text("Member Down Votes");
				$("#committee_table_head").find("tr")
					.append($("<th>").text("Rank Down"), $("<th>").text("Rank Up"), $("<th>").text("Delete"));
				list.forEach(function(elem) {
					var first = elem.rank_approval != null ? elem.rank_approval.split(",").length : "0",
						second = elem.rank_disapproval != null ? elem.rank_disapproval.split(",").length : "0";
					if(elem.rank == "com-member") { first = "N/A"; second = "N/A"; }
					var item_tr = $("<tr>"),
						item_fname = $("<td>").text(elem.first_name),
						item_lname = $("<td>").text(elem.last_name),
						item_email = $("<td>").text(elem.email).css("text-align", "center"),
						item_approval = $("<td>").text(first).css("text-align", "center"),
						item_disapproval = $("<td>").text(second).css("text-align", "center"),
						item_rank_down = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "rank_down_" + elem.num)
								.addClass("rank-down-contributor center").css("color", "red")
								.append($("<i>").addClass("material-icons").text("thumb_down"))),
						item_rank_up = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "rank_up_" + elem.num)
								.addClass("rank-up-contributor center").css("color", "red")
								.append($("<i>").addClass("material-icons").text("thumb_up"))),
						item_rank_delete = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "delete_" + elem.num)
								.addClass("delete-contributor center").css("color", "red")
								.append($("<i>").addClass("material-icons").text("cancel")));
					item_tr.append(item_fname, item_lname, item_email, item_approval, item_disapproval, 
						item_rank_down, item_rank_up, item_rank_delete);
					$("#committee_table_body").append(item_tr);
					// if(elem.rank_approval != null && 
					// 	elem.rank_approval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
					// 	$("#approve_" + elem.num).css("color", "green");
					// }
					// else {
					// 	$("#approve_" + elem.num).css("color", "red");
					// }
					// if(elem.rank_disapproval != null && 
					// 	elem.rank_disapproval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
					// 	$("#disapprove_" + elem.num).css("color", "green");
					// }
					// else {
					// 	$("#disapprove_" + elem.num).css("color", "red");
					// }
				});
				$("#popup_control").click();
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
				$(".delete-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#delete_" + holder[1]).css("color")) == "#ff0000") {
						$("#delete_" + holder[1]).css("color", "green");
						list[obj_ref].deleted = 1;
					}
					else {
						$("#delete_" + holder[1]).css("color", "red");
						list[obj_ref].deleted = 0;
					}
				});
				$(".rank-up-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[2];
						});
					if(exports.rgba_to_hex($("#rank_up_" + holder[2]).css("color")) == "#ff0000") {
						$("#rank_up_" + holder[2]).css("color", "green");
						$("#rank_down_" + holder[2]).css("color", "red");
						list[obj_ref].rank_up = 1;
					}
					else {
						$("#rank_up_" + holder[2]).css("color", "red");
						list[obj_ref].rank_up = 0;
					}
				});
				$(".rank-down-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[2];
						});
					if(exports.rgba_to_hex($("#rank_down_" + holder[2]).css("color")) == "#ff0000") {
						$("#rank_down_" + holder[2]).css("color", "green");
						$("#rank_up_" + holder[2]).css("color", "red");
						list[obj_ref].rank_down = 1;
					}
					else {
						$("#rank_down_" + holder[2]).css("color", "red");
						list[obj_ref].rank_down = 0;
					}
				});
				$("#popup_submit").text("Save Changes").click(function(e) {
					e.preventDefault();
					$("#popup_exit").remove();
					$("#popup_submit").addClass("modal-close");
					list.forEach(function(iter) {
						if(iter.deleted == 1) {
							$.post("/api/cms/remove/profile/", {email: iter.email}).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue deleting contributor(s) from the database!");
								$("#popup_submit").text("Ok").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
								});
							});
						}
						else if(iter.deleted == 0 && iter.rank_up == 1) {
							$.post("/api/cms/committee/add", {email: iter.email}).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue ranking up contributo(r) in the database!");
								$("#popup_submit").text("Ok").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
								});
							});
						}
						else if(iter.deleted == 0 && iter.rank_down == 1) {
							$.post("/api/cms/committee/remove", {email: iter.email}).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue ranking down contributo(r) in the database!");
								$("#popup_submit").text("Ok").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
								});
							});
						}
					});
					$("#popup_title").text("Changes Saved").css("text-align", "center");
					$("#popup_body").text("All contributor changes have been saved to the database!");
					$("#popup_submit").text("Ok").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).scrollTop(0);
					});
				});
			});
		});
	};



	/*

	Purpose:
	Handles the ranking modal for committee members excluding the administrator.

	*/
	exports.ranking_modal = function() {
		$.get("/pages/dist/committee-table-min.html").done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Committee Approval of New Committee Members").css("text-align", "center");
			$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "As a committee member on manualmath you have the power to" +
				" try to sway the administrator's decision on whether a current contributor" +
				" joins the committee or not. Using the table below you can provide an approval or" +
				" disapproval which will be indicated by a green color."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/nonmember").done(function(contributors) {
				var list = contributors.map(function(elem, index) {
					elem.num = index;
					elem.edited = 0;
					return elem;
				});
				$("#committee_table_head").find("tr th").last().text("Disapprove");
				list.forEach(function(elem) {
					var item_tr = $("<tr>"),
						item_fname = $("<td>").text(elem.first_name),
						item_lname = $("<td>").text(elem.last_name),
						item_email = $("<td>").text(elem.email).css("text-align", "center"),
						item_approve = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "approve_" + elem.num)
								.addClass("approve-contributor center").append($("<i>")
									.addClass("material-icons").text("thumb_up"))),
						item_disapprove = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "disapprove_" + elem.num)
								.addClass("disapprove-contributor center").append($("<i>")
									.addClass("material-icons").text("thumb_down")));
					item_tr.append(item_fname, item_lname, item_email, item_approve, item_disapprove);
					$("#committee_table_body").append(item_tr);
					if(elem.rank_approval != null && 
						elem.rank_approval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
						$("#approve_" + elem.num).css("color", "green");
					}
					else {
						$("#approve_" + elem.num).css("color", "red");
					}
					if(elem.rank_disapproval != null && 
						elem.rank_disapproval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
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
				});
				$(".disapprove-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#disapprove_" + holder[1]).css("color")) == "#ff0000") {
						$("#disapprove_" + holder[1]).css("color", "green");
						$("#approve_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_disapproval == null) { 
							list[obj_ref].rank_disapproval = exports.read_cookie("contributor"); 
						}
						else { list[obj_ref].rank_disapproval += "," + exports.read_cookie("contributor"); }
						if(list[obj_ref].rank_approval != null) { 
							var start = list[obj_ref].rank_approval.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_approval = list[obj_ref].rank_approval.substring(0, start) + 
										list[obj_ref].rank_approval.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].rank_approval = list[obj_ref].rank_approval
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].rank_approval == "") { list[obj_ref].rank_approval = null; }
							}
						}
					}
					else {
						$("#disapprove_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_disapproval != null) { 
							var start = list[obj_ref].rank_disapproval.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_disapproval = list[obj_ref].rank_disapproval.substring(0, start) + 
										list[obj_ref].rank_disapproval.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].rank_disapproval = list[obj_ref].rank_disapproval
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].rank_disapproval == "") { list[obj_ref].rank_disapproval = null; }
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
					if(exports.rgba_to_hex($("#approve_" + holder[1]).css("color")) == "#ff0000") {
						$("#approve_" + holder[1]).css("color", "green");
						$("#disapprove_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_approval == null) { 
							list[obj_ref].rank_approval = exports.read_cookie("contributor"); 
						}
						else { list[obj_ref].rank_approval += "," + exports.read_cookie("contributor"); }
						if(list[obj_ref].rank_disapproval != null) { 
							var start = list[obj_ref].rank_disapproval.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_disapproval = list[obj_ref].rank_disapproval.substring(0, start) + 
										list[obj_ref].rank_disapproval.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].rank_disapproval = list[obj_ref].rank_disapproval
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].rank_disapproval == "") { list[obj_ref].rank_disapproval = null; }
							}
						}
					}
					else {
						$("#approve_" + holder[1]).css("color", "red");
						if(list[obj_ref].rank_approval != null) { 
							var start = list[obj_ref].rank_approval.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].rank_approval = list[obj_ref].rank_approval.substring(0, start) + 
										list[obj_ref].rank_approval.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].rank_approval = list[obj_ref].rank_approval
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].rank_approval == "") { list[obj_ref].rank_approval = null; }
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
							var obj = {
								email: iter.email,
								rank_approval: (iter.rank_approval == null ? "0" : iter.rank_approval),
								rank_disapproval: (iter.rank_disapproval == null ? "0" : iter.rank_disapproval)
							};
							$.post("/api/cms/change/contributor/rank/approval", obj).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue uploading the contributor changes to the database!");
								$("#popup_submit").text("Ok").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$(window).scrollTop(0);
								});
							});
						}
					});
					$("#popup_title").text("Changes Saved").css("text-align", "center");
					$("#popup_body").text("All contributor changes have been saved to the database!");
					$("#popup_submit").text("Ok").click(function(e) {
						e.preventDefault();
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$(window).scrollTop(0);
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
		$.get("/pages/dist/committee-table-min.html").done(function(content) {
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_title").text("Committee Approval of New Users").css("text-align", "center");
			$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
			$("#popup_submit").removeClass("modal-close");
			var statement = "When new contributors register for the service," +
				" they do not automatically gain access to the content management" +
				" system by design. It is the job of the committee members to approve" +
				" or disapprove incoming contributors by utilizing the funtionality provided" +
				" below. Once a contributor reaches majority approval from the committee" +
				" they will gain access to the content management system. Likewise a majority" +
				" disapproval means a contributor has been denied access and has their account" +
				" wiped from the database."
			$("#popup_body").text(statement).append(content);
			$.post("/api/cms/contributors/unapproved").done(function(contributors) {
				var list = contributors.map(function(elem, index) {
					elem.num = index;
					elem.edited = 0;
					return elem;
				});
				list.forEach(function(elem) {
					var item_tr = $("<tr>"),
						item_fname = $("<td>").text(elem.first_name),
						item_lname = $("<td>").text(elem.last_name),
						item_email = $("<td>").text(elem.email).css("text-align", "center"),
						item_approve = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "check_" + elem.num)
								.addClass("approve-contributor center").append($("<i>")
									.addClass("material-icons").text("check_circle"))),
						item_delete = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", "delete_" + elem.num)
								.addClass("del-contributor center").append($("<i>")
									.addClass("material-icons").text("cancel")));
					item_tr.append(item_fname, item_lname, item_email, item_approve, item_delete);
					$("#committee_table_body").append(item_tr);
					if(elem.approval != null && 
						elem.approval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
						$("#check_" + elem.num).css("color", "green");
					}
					else {
						$("#check_" + elem.num).css("color", "red");
					}
					if(elem.del != null && 
						elem.del.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
						$("#delete_" + elem.num).css("color", "green");
					}
					else {
						$("#delete_" + elem.num).css("color", "red");
					}
				});
				$("#popup_control").click();
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
				$(".del-contributor").on("click", function(e) {
					e.preventDefault();
					var holder = $(this).attr("id").split("_"),
						obj_ref = list.findIndex(function(iter) { 
							return iter.num == holder[1];
						});
					if(exports.rgba_to_hex($("#delete_" + holder[1]).css("color")) == "#ff0000") {
						$("#delete_" + holder[1]).css("color", "green");
						if(list[obj_ref].del == null) { 
							list[obj_ref].del = exports.read_cookie("contributor"); 
						}
						else { list[obj_ref].del += "," + exports.read_cookie("contributor"); }
					}
					else {
						$("#delete_" + holder[1]).css("color", "red");
						if(list[obj_ref].del != null) { 
							var start = list[obj_ref].del.indexOf(exports.read_cookie("contributor")); 
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].del = list[obj_ref].del.substring(0, start) + 
										list[obj_ref].del.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].del = list[obj_ref].del
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].del == "") { list[obj_ref].del = null; }
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
					if(exports.rgba_to_hex($("#check_" + holder[1]).css("color")) == "#ff0000") {
						$("#check_" + holder[1]).css("color", "green");
						if(list[obj_ref].approval == null) { 
							list[obj_ref].approval = exports.read_cookie("contributor"); 
						}
						else { list[obj_ref].approval += "," + exports.read_cookie("contributor"); }
					}
					else {
						$("#check_" + holder[1]).css("color", "red");
						if(list[obj_ref].approval != null) { 
							var start = list[obj_ref].approval.indexOf(exports.read_cookie("contributor"));
							if(start != -1) {
								if(start != 0) {
									list[obj_ref].approval = list[obj_ref].approval.substring(0, start) + 
										list[obj_ref].approval.substring(start + exports.read_cookie("contributor").length);
								}
								else {
									list[obj_ref].approval = list[obj_ref].approval
										.substring(exports.read_cookie("contributor").length + 1);
								}
								if(list[obj_ref].approval == "") { list[obj_ref].approval = null; }
							}
						}
					}
					list[obj_ref].edited = 1;
				});
				$("#popup_submit").text("Save Changes").click(function(e) {
					e.preventDefault();
					$("#popup_exit").remove();
					$("#popup_submit").addClass("modal-close");
					$.get("/api/cms/committee").done(function(num) {
						const validation = parseInt(num);
						var statement = "";
						list.forEach(function(iter) {
							if(iter.del != null && iter.del.split(",").length >= validation) {
								$.post("/api/cms/remove/profile/", {email: iter.email}).fail(function() {
									$("#popup_title").text("Database Issue");
									$("#popup_body").text("There was an issue deleting a contributor from the database!");
									$("#popup_submit").text("Ok").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
									});
								});
							}
							else if(iter.approval != null && iter.approval.split(",").length >= validation) {
								$.post("/api/cms/change/status/" + iter.email + "/1").fail(function() {
									$("#popup_title").text("Database Issue");
									$("#popup_body").text("There was an issue changing the status of a contributor in the database!");
									$("#popup_submit").text("Ok").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$(window).scrollTop(0);
									});
								});
							}
							else {
								if(iter.edited == 1) {
									statement = "/api/cms/change/contributor/" + iter.email + "/" + 
										(iter.approval == null ? "0" : iter.approval) + "/" + 
										(iter.del == null ? "0" : iter.del);
									$.post(statement).fail(function() {
										$("#popup_title").text("Database Issue");
										$("#popup_body").text("There was an issue uploading the contributor changes to the database!");
										$("#popup_submit").text("Ok").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
											$(window).scrollTop(0);
										});
									});
								}
							}
						});
						$("#popup_title").text("Changes Saved").css("text-align", "center");
						$("#popup_body").text("All contributor changes have been saved to the database!");
						$("#popup_submit").text("Ok").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$(window).scrollTop(0);
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
			An array of the objects representing the current data

	*/
	exports.sidenav_modal_name_check = function(data) {
		var test = data.map(function(elem) { return elem.clean_name; }),
			i = 0;
		for(; i < test.length; i++) {
			if(test.filter(function(item) { return item == test[i] }).length >= 2) {
				break;
			}				
		}
		i != test.length ? $("#popup_submit").css("pointer-events", "none") 
			: $("#popup_submit").css("pointer-events", "auto");
	};

	/*

	Purpose:
	Handles all clicks for the sidenav modal.

	Parameters:
		type: 
			A reference to the type of data being handled
		data:
			An array of the objects representing the type of data

	*/
	exports.sidenav_modal_links = function(type, data) {
		$(".field").off("input");
		$(".arrow").off("click");
		$(".del").off("click");
		$(".approve").off("click");
		$(".garbage").off("click");
		$(".field").on("input", function() {
			var id = parseInt($(this).attr("id").split("_")[2]);
			data.forEach(function(iter) { 
				if((type == "Subjects" && iter.sid == id) || (type == "Topics" && iter.tid == id)
					|| (type == "Sections" && iter.section_id == id) || (type == "Examples" && iter.eid == id)) {
					iter.edited = 1;
					iter.clean_name = $("#" + type.toLowerCase() + "_td_" + id).text();
					var str = exports.replace_all($("#" + type.toLowerCase() + "_td_" + id).text(), " ", "_");
					str = exports.replace_all(str, "-", "AND");
					str = exports.replace_all(str, "'", "APOSTROPHE");
					str = exports.replace_all(str, "\"", "QUOTE");
					str = exports.replace_all(str, ":", "COLON");
					str = exports.replace_all(str, ",", "COMMA");
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
					if(type == "Subjects") { return iter.sid == parseInt(holder[2]); }
					else if(type == "Topics") { return iter.tid == parseInt(holder[2]); }
					else if(type == "Sections") { return iter.section_id == parseInt(holder[2]); }
					else if(type == "Examples") { return iter.eid == parseInt(holder[2]); }
				}),
				str = "";
			if(holder[1] == "up" && obj_ref != 0) {
				var obj = data[obj_ref],
					obj_order = obj.order,
					table_item = 0;
				str = "#" + type.toLowerCase() + "_tr_";
				if(type == "Subjects") {
					table_item = $(str + data[obj_ref - 1].sid).detach();
				}
				else if(type == "Topics") {
					table_item = $(str + data[obj_ref - 1].tid).detach();
				}
				else if(type == "Sections") {
					table_item = $(str + data[obj_ref - 1].section_id).detach();
				}
				else if(type == "Examples") {
					table_item = $(str + data[obj_ref - 1].eid).detach();
				}
				$("#" + type.toLowerCase() + "_tr_" + holder[2]).after(table_item);
				data[obj_ref] = data[obj_ref - 1];
				data[obj_ref - 1] = obj;
				data[obj_ref - 1].order = data[obj_ref].order;
				data[obj_ref].order = obj_order;
				data[obj_ref - 1].edited = 1;
				data[obj_ref].edited = 1;
			}
			else if(holder[1] == "down" && obj_ref != data.length - 1) {
				var table_item = $("#" + type.toLowerCase() + "_tr_" + holder[2]).detach(),
					obj = data[obj_ref],
					obj_order = obj.order;
				str = "#" + type.toLowerCase() + "_tr_";
				if(type == "Subjects") {
					$(str + data[obj_ref + 1].sid).after(table_item);
				}
				else if(type == "Topics") {
					$(str + data[obj_ref + 1].tid).after(table_item);
				}
				else if(type == "Sections") {
					$(str + data[obj_ref + 1].section_id).after(table_item);
				}
				else if(type == "Examples") {
					$(str + data[obj_ref + 1].eid).after(table_item);
				}
				data[obj_ref] = data[obj_ref + 1];
				data[obj_ref + 1] = obj;
				data[obj_ref + 1].order = data[obj_ref].order;
				data[obj_ref].order = obj_order;
				data[obj_ref + 1].edited = 1;
				data[obj_ref].edited = 1;
			}
		});
		$(".del").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id").split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") { return iter.sid == parseInt(holder[2]); }
					else if(type == "Topics") { return iter.tid == parseInt(holder[2]); }
					else if(type == "Sections") { return iter.section_id == parseInt(holder[2]); }
					else if(type == "Examples") { return iter.eid == parseInt(holder[2]); }
				});
			if(exports.rgba_to_hex($("#" + type.toLowerCase() + "_delete_" + holder[2]).css("color")) == "#ff0000") {
				$("#" + type.toLowerCase() + "_delete_" + holder[2]).css("color", "green");
				if(typeof data[obj_ref].del_approval == "object") { 
					data[obj_ref].del_approval = exports.read_cookie("contributor"); 
				}
				else { data[obj_ref].del_approval += "," + exports.read_cookie("contributor"); }
			}
			else {
				$("#" + type.toLowerCase() + "_delete_" + holder[2]).css("color", "red");
				if(typeof data[obj_ref].del_approval != "object") { 
					var start = data[obj_ref].del_approval.indexOf(exports.read_cookie("contributor"));
					if(start != -1) {
						if(start != 0) {
							data[obj_ref].del_approval = data[obj_ref].del_approval.substring(0, start) + 
								data[obj_ref].del_approval.substring(start + exports.read_cookie("contributor").length);
						}
						else {
							data[obj_ref].del_approval = data[obj_ref].del_approval
								.substring(exports.read_cookie("contributor").length + 1);
						}
						if(data[obj_ref].del_approval == "") { data[obj_ref].del_approval = {}; }
					}
				}
			}
			data[obj_ref].edited = 1;
		});
		$(".approve").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id").split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") { return iter.sid == parseInt(holder[2]); }
					else if(type == "Topics") { return iter.tid == parseInt(holder[2]); }
					else if(type == "Sections") { return iter.section_id == parseInt(holder[2]); }
					else if(type == "Examples") { return iter.eid == parseInt(holder[2]); }
				});
			if(exports.rgba_to_hex($("#" + type.toLowerCase() + "_check_" + holder[2]).css("color")) == "#ff0000") {
				$("#" + type.toLowerCase() + "_check_" + holder[2]).css("color", "green");
				if(typeof data[obj_ref].side_approval == "object") { 
					data[obj_ref].side_approval = exports.read_cookie("contributor"); 
				}
				else { data[obj_ref].side_approval += "," + exports.read_cookie("contributor"); }
			}
			else {
				$("#" + type.toLowerCase() + "_check_" + holder[2]).css("color", "red");
				if(typeof data[obj_ref].side_approval != "object") { 
					var start = data[obj_ref].side_approval.indexOf(exports.read_cookie("contributor"));
					if(start != -1) {
						if(start != 0) {
							data[obj_ref].side_approval = data[obj_ref].side_approval.substring(0, start) + 
								data[obj_ref].side_approval.substring(start + exports.read_cookie("contributor").length);
						}
						else {
							data[obj_ref].side_approval = data[obj_ref].side_approval
								.substring(exports.read_cookie("contributor").length + 1);
						}
						if(data[obj_ref].side_approval == "") { data[obj_ref].side_approval = {}; }
					}
				}
			}
			data[obj_ref].edited = 1;
		});
		$(".garbage").on("click", function(e) {
			e.preventDefault();
			var holder = $(this).attr("id").split("_"),
				obj_ref = data.findIndex(function(iter) { 
					if(type == "Subjects") { return iter.sid == parseInt(holder[2]); }
					else if(type == "Topics") { return iter.tid == parseInt(holder[2]); }
					else if(type == "Sections") { return iter.section_id == parseInt(holder[2]); }
					else if(type == "Examples") { return iter.eid == parseInt(holder[2]); }
				});
			data = data.slice(0, obj_ref).concat(data.slice(obj_ref + 1));
			$(this).parent().parent().remove();
			if(data.every(function(elem) { return elem.created == 0; })) {
				$("#garbage_head").remove();
			}
		});
	};

	/*

	Purpose:
	Handles the sidenav modal that adds and changes data.

	Parameters:
		type: 
			A reference to the type of data being handled
		data:
			An array of the objects representing the type of data

	*/
	exports.sidenav_modal = function(type, input, container_id) {
		var data = [];
		if(type == "Subjects") {
			data = (exports.copy(input)).map(function(elem) { 
				elem.edited = 0;
				elem.created = 0;
				return elem; 
			});
		}
		else if(type == "Topics") {
			data = (exports.copy(input)).filter(function(iter) { return iter.sid == container_id }).map(function(elem) { 
				elem.edited = 0;
				elem.created = 0;
				return elem; 
			});
		}
		else if(type == "Sections") {
			data = (exports.copy(input)).filter(function(iter) { return iter.tid == container_id }).map(function(elem) { 
				elem.edited = 0;
				elem.created = 0;
				return elem; 
			});
		}
		else if(type == "Examples") {
			data = (exports.copy(input)).filter(function(iter) { return iter.section_id == container_id }).map(function(elem) { 
				elem.edited = 0;
				elem.created = 0;
				return elem; 
			});
		}
		data.sort(function(a, b) { return a.order - b.order; });
		$.get("/pages/dist/modal-min.html").done(function(content) {
			$("body").append(content);
			$("#popup_title").text(type).css("text-align", "center");
			$("#popup_submit").text("Save Changes").removeClass("modal-close");
			$("#popup_modal_footer")
				.append($("<a>").attr("id", "popup_add")
					.addClass("waves-effect waves-blue btn-flat").text("Add"))
				.append($("<a>").attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
			$.get("/pages/dist/sidenav-change-min.html").done(function(table) {
				var statement = "Below you will find all current " + type.toLowerCase() + " which can be renamed" + 
					" and reorganized. Furthermore, as a contributor you can approve a subject so that it will be" + 
					" available to users on the client side, or similarly disapprove if you feel that there is" + 
					" something wrong with it. With this design, a subject will appear on the client side only" +
					" when enough contributors have given approval. To change the approval of a subject simply" + 
					" click on the checkmark and note that the green color indicates an approval from you." + 
					" Likewise the system also allows for a " + type.toLowerCase().substring(0, type.length - 1) +
					" to be deleted from the database when enough contributors have given approval for it.<br><br>" +
					"Lastly for any " + type.toLowerCase().substring(0, type.length - 1) + " that has just been added," +
					" you remove it without having to exit and clicking back by clicking on the trash can icon."
				$("#popup_body").html(statement).append(table);
				data.forEach(function(elem) {
					var addon = -1;
					if(type == "Subjects") { addon = elem.sid; }
					else if(type == "Topics") { addon = elem.tid; }
					else if(type == "Sections") { addon = elem.section_id; }
					else if(type == "Examples") { addon = elem.eid; }
					var item_tr = $("<tr>").attr("id", type.toLowerCase() + "_tr_" + addon),
						item_name = $("<td>").text(elem.clean_name).attr("contentEditable", "true")
							.attr("id", type.toLowerCase() + "_td_" + addon).addClass("field"),
						item_move = $("<td>").css("text-align", "center")
							.append($("<a>").attr("id", type.toLowerCase() + "_up_" + addon).addClass("arrow")
								.css("cursor", "pointer").append($("<i>").addClass("material-icons").text("keyboard_arrow_up")))
							.append($("<a>").attr("id", type.toLowerCase() + "_down_" + addon).addClass("arrow")
								.css("cursor", "pointer").append($("<i>").addClass("material-icons").text("keyboard_arrow_down"))),
						item_approve = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", type.toLowerCase() + "_check_" + addon)
								.addClass("approve center").append($("<i>").addClass("material-icons").text("check_circle"))),
						item_delete = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", type.toLowerCase() + "_delete_" + addon)
								.addClass("del center").append($("<i>").addClass("material-icons").text("cancel")));
					item_tr.append(item_name).append(item_move).append(item_approve).append(item_delete);
					$("#sidenav_table_body").append(item_tr);
					if(typeof elem.side_approval != "object" && 
						elem.side_approval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
						$("#" + type.toLowerCase() + "_check_" + addon).css("color", "green");
					}
					else {
						$("#" + type.toLowerCase() + "_check_" + addon).css("color", "red");
					}
					if(typeof elem.del_approval != "object" && 
						elem.del_approval.split(",").some(function(iter) { return iter == exports.read_cookie("contributor"); })) {
						$("#" + type.toLowerCase() + "_delete_" + addon).css("color", "green");
					}
					else {
						$("#" + type.toLowerCase() + "_delete_" + addon).css("color", "red");
					}
				});
				$(".modal-trigger").leanModal({
					dismissible: false,
					opacity: 2,
					inDuration: 1000,
					outDuration: 1000
				});
				$("#popup_control").click();
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
				});
				$("#popup_add").click(function(e) {
					e.preventDefault();
					var addon = -1,
						order = -1,
						lhs = -1,
						rhs = -1,
						inp_cpy = exports.copy(input),
						dat_cpy = exports.copy(data);
					if(type == "Subjects") {
						lhs = inp_cpy.length != 0 ? inp_cpy.sort(function(a, b) { 
							return b.sid - a.sid; 
						})[0].sid + 1 : 1,
						rhs = dat_cpy.length != 0 ? dat_cpy.sort(function(a, b) { 
							return b.sid - a.sid; 
						})[0].sid + 1 : 1;
					}
					else if(type == "Topics") {
						lhs = inp_cpy.length != 0 ? inp_cpy.sort(function(a, b) { 
							return b.tid - a.tid; 
						})[0].tid + 1 : 1,
						rhs = dat_cpy.length != 0 ? dat_cpy.sort(function(a, b) { 
							return b.tid - a.tid; 
						})[0].tid + 1 : 1;
					}
					else if(type == "Sections") {
						lhs = inp_cpy.length != 0 ? inp_cpy.sort(function(a, b) { 
							return b.section_id - a.section_id; 
						})[0].section_id + 1 : 1,
						rhs = dat_cpy.length != 0 ? dat_cpy.sort(function(a, b) { 
							return b.section_id - a.section_id; 
						})[0].section_id + 1 : 1;
					}
					else if(type == "Examples") {
						lhs = inp_cpy.length != 0 ? inp_cpy.sort(function(a, b) { 
							return b.eid - a.eid; 
						})[0].eid + 1 : 1,
						rhs = dat_cpy.length != 0 ? dat_cpy.sort(function(a, b) { 
							return b.eid - a.eid; 
						})[0].eid + 1 : 1;
					}
					addon = Math.max(lhs, rhs);
					var new_tr = $("<tr>").attr("id", type.toLowerCase() + "_tr_" + addon),
						new_name = $("<td>").text("New " + type.substring(0, type.length - 1)).attr("contentEditable", "true")
							.attr("id", type.toLowerCase() + "_td_" + addon).addClass("field"),
						new_move = $("<td>").css("text-align", "center")
							.append($("<a>").attr("id", type.toLowerCase() + "_up_" + addon).addClass("arrow")
								.css("cursor", "pointer").append($("<i>").addClass("material-icons").text("keyboard_arrow_up")))
							.append($("<a>").attr("id", type.toLowerCase() + "_down_" + addon).addClass("arrow")
								.css("cursor", "pointer").append($("<i>").addClass("material-icons").text("keyboard_arrow_down"))),
						new_approve = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", type.toLowerCase() + "_check_" + addon)
								.addClass("approve center").css("color", "red").append($("<i>")
									.addClass("material-icons").text("check_circle"))),
						new_delete = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", type.toLowerCase() + "_delete_" + addon)
								.addClass("del center").css("color", "red").append($("<i>")
									.addClass("material-icons").text("cancel"))),
						new_garbage = $("<td>").css("text-align", "center").append($("<a>")
								.css("cursor", "pointer").attr("id", type.toLowerCase() + "_garbage_" + addon)
								.addClass("garbage center").css("color", "red").append($("<i>")
									.addClass("material-icons").text("delete_sweep")));
					if(data.every(function(elem) { return elem.created == 0 })) {
						$("#sidenav_table_head").find("tr").append($("<th>").attr("id", "garbage_head").text("Remove"));
					}
					new_tr.append(new_name, new_move, new_approve, new_delete, new_garbage);
					$("#sidenav_table_body").append(new_tr);
					data.length == 0 ? order = 1 : order = data[data.length - 1].order + 1;
					if(type == "Subjects") {
						data.push({
							sid: addon,
							clean_name: "New " + type.substring(0, type.length - 1),
							sname: "New_" + type.substring(0, type.length - 1),
							order: order,
							topics: [],
							side_approval: {},
							del_approval: {},
							edited: 0,
							created: 1
						});
					}
					else if(type == "Topics") {
						data.push({
							tid: addon,
							sid: container_id,
							clean_name: "New " + type.substring(0, type.length - 1),
							tname: "New_" + type.substring(0, type.length - 1),
							order: order,
							sections: [],
							side_approval: {},
							del_approval: {},
							edited: 0,
							created: 1
						});
					}
					else if(type == "Sections") {
						data.push({
							section_id: addon,
							tid: container_id,
							clean_name: "New " + type.substring(0, type.length - 1),
							section_name: "New_" + type.substring(0, type.length - 1),
							order: order,
							examples: [],
							side_approval: {},
							del_approval: {},
							edited: 0,
							created: 1
						});
					}
					else if(type == "Examples") {
						data.push({
							eid: addon,
							section_id: container_id,
							clean_name: "New " + type.substring(0, type.length - 1),
							ename: "New_" + type.substring(0, type.length - 1),
							order: order,
							side_approval: {},
							del_approval: {},
							edited: 0,
							created: 1
						});
					}
					exports.sidenav_modal_links(type, data);
					exports.sidenav_modal_name_check(data);
				});
				exports.sidenav_modal_links(type, data);
				$("#popup_submit").click(function(event) {
					event.preventDefault();
					var statement = "";
					$.get("/api/cms/contributors").done(function(num) {
						const validation = Math.ceil(Math.log(parseInt(num)));
						$("#popup_submit").remove();
						$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
							.addClass("modal-close waves-effect waves-blue btn-flat").text("Ok"));
						data.forEach(function(iter) {
							var id = -1,
								ref = -1,
								name = "";
							if(type == "Subjects") { id = iter.sid; name = iter.sname; ref = "undefined"; }
							else if(type == "Topics") { id = iter.tid; name = iter.tname; ref = iter.sid; }
							else if(type == "Sections") { id = iter.section_id; name = iter.section_name; ref = iter.tid; }
							else if(type == "Examples") { id = iter.eid; name = iter.ename; ref = iter.section_id; }
							if(typeof iter.del_approval != "object" && iter.del_approval.split(",").length >= validation) {
								$.post("/api/delete/" + type.toLowerCase().substring(0, type.length - 1) + "/" + id);
							}
							else {
								if(typeof iter.del_approval == "object" || iter.del_approval == "") { iter.del_approval = "0"; }
								if(typeof iter.side_approval == "object" || iter.side_approval == "") { iter.side_approval = "0"; }
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
									$.post(statement, obj).fail(function() {
										$("#popup_title").text("Database Issue");
										if(type == "Subjects") {
											$("#popup_body").text("There was an issue uploading the new subject(s) to the database!");
										}
										else if(type == "Topics") {
											$("#popup_body").text("There was an issue uploading the new topic(s) to the database!");
										}
										else if(type == "Sections") {
											$("#popup_body").text("There was an issue uploading the new section(s) to the database!");
										}
										else if(type == "Examples") {
											$("#popup_body").text("There was an issue uploading the new example(s) to the database!");
										}
										$("#popup_exit").remove();
										$("#popup_add").remove();
										$("#popup_submit").text("Ok").click(function(e) {
											e.preventDefault();
											location.reload();
											$(window).scrollTop(0);
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
											$("#popup_body").text("There was an issue uploading the subject changes to the database!");
										}
										else if(type == "Topics") {
											$("#popup_body").text("There was an issue uploading the topic changes to the database!");
										}
										else if(type == "Sections") {
											$("#popup_body").text("There was an issue uploading the section changes to the database!");
										}
										else if(type == "Examples") {
											$("#popup_body").text("There was an issue uploading the example changes to the database!");
										}
										$("#popup_exit").remove();
										$("#popup_add").remove();
										$("#popup_submit").text("Ok").click(function(e) {
											e.preventDefault();
											location.reload();
											$(window).scrollTop(0);
										});
									});
								}
							}
						});
					}).done(function() {
						$("#popup_title").text("Changes Saved").css("text-align", "center");
						$("#popup_body").text("All changes have been saved to the database!");
						$("#popup_exit").remove();
						$("#popup_add").remove();
						$("#popup_submit").click(function(e) {
							e.preventDefault();
							location.reload();
							$(window).scrollTop(0);
						});
					});
				});
			});
		});
	};

	/*

	Purpose:
	Handles all of the modal changes for the cms contributor profile.

	Parameters:
		email: 
			Current contributor's email

	*/
	exports.profile_modal = function(email) {
		$.get("/pages/dist/contributor-profile-min.html").done(function(content) {
			$("#popup_title").text("Profile").css("text-align", "center");
			$("#popup_submit").text("Save Changes");
			$("#popup_body").append(content);
			$("#popup_submit").removeClass("modal-close");
			$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
				.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
			$.post("/api/cms/profile/" + email).done(function(information) {
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
				});
				$("#popup_submit").click(function(event) {
					event.preventDefault();
					var fname = $("#first_name_cms").val()[0].toUpperCase() + $("#first_name_cms").val().slice(1).toLowerCase(),
						lname = $("#last_name_cms").val()[0].toUpperCase() + $("#last_name_cms").val().slice(1).toLowerCase(),
						question = (parseInt($("#question_cms")[0].options.selectedIndex) + 1),
						answer = $("#answer_cms").val(),
						new_password = $("#password_cms").val();
					$.get("/pages/dist/change-confirmation-min.html").done(function(material) {
						if($("#password_cms").val().length == 0) {
							$("#popup_title").text("Profile Changes").css("text-align", "center");
							$("#popup_body").text("Please confirm the changes provided by providing your password:")
								.append(material);
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
								.addClass("waves-effect waves-blue btn-flat").text("Confirm")).append($("<a>")
									.attr("id", "popup_exit").addClass("modal-close waves-effect waves-blue btn-flat")
									.text("Exit"));
							$("#new_password_confirm").closest(".row").remove();
							$("#old_password_label").text("Password");
							$("#popup_submit").css("pointer-events", "none");
							$("#old_password_confirm").on("input", function() {
								if($("#old_password_confirm").val().length > 0) {
									$("#popup_submit").css("pointer-events", "auto");
								}
								else {
									$("#popup_submit").css("pointer-events", "none");
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
								$.post("/api/cms/check/" + email + "/" + $("#old_password_confirm").val()).done(function(result) {
									$("#popup_submit").addClass("modal-close");
									$("#popup_exit").remove();
									if(result[0] == "Wrong Password") {
										$("#popup_title").text("Password Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat").text("Exit"));
										$("#popup_body").text("The password you provided did not match the one in the database!");
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
										});
									}
									else if(fname.length == 0 || /[^a-zA-Z]/.test(fname)) {
										$("#popup_title").text("First Name Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat").text("Exit"));
										$("#popup_body").text("The first name cannot be left empty or contain an invalid character!");
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
										});
									}
									else if(lname.length == 0 || /[^a-zA-Z]/.test(lname)) {
										$("#popup_title").text("Last Name Issue");
										$("#popup_submit").remove();
										$("#popup_exit").remove();
										$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
											.addClass("waves-effect waves-blue btn-flat").text("Exit"));
										$("#popup_body").text("The last name cannot be left empty or contain an invalid character!");
										$("#popup_submit").click(function(e) {
											e.preventDefault();
											$(".lean-overlay").remove();
											$("#popup").remove();
											$("#popup_control").remove();
										});
									}
									else {
										var statement = "/api/cms/change/profile/" + email + "/" + fname + 
											"/" + lname + "/" + question + "/" + answer;
										$.post(statement).done(function(result) {
										 	if(result == "1") {
												$("#popup_title").text("Confirmation");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
													.addClass("waves-effect waves-blue btn-flat").text("Exit"));
												$("#popup_body").text("The changes you provided have been implemented!");
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
												});
											}
											else {
												$("#popup_title").text("Database Issue");
												$("#popup_submit").remove();
												$("#popup_exit").remove();
												$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
													.addClass("waves-effect waves-blue btn-flat").text("Exit"));
												$("#popup_body").text("The changes you provided had trouble" + 
													" being uploaded to the database!");
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
												});
											}
										});
									}
								});
							});
						}
						else if(exports.password_check($("#password_cms").val())) {
							$("#popup_title").text("Profile Changes").css("text-align", "center");
							$("#popup_body").text("Please confirm the changes provided by providing both the old and new passwords:")
								.append(material);
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
								.addClass("waves-effect waves-blue btn-flat").text("Confirm")).append($("<a>")
									.attr("id", "popup_exit").addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
							$("#popup_submit").css("pointer-events", "none");
							$("#old_password_confirm").on("input", function() {
								if($("#old_password_confirm").val().length > 0 && $("#new_password_confirm").val().length > 0) {
									$("#popup_submit").css("pointer-events", "auto");
								}
								else {
									$("#popup_submit").css("pointer-events", "none");
								}
							});
							$("#new_password_confirm").on("input", function() {
								if($("#old_password_confirm").val().length > 0 && $("#new_password_confirm").val().length > 0) {
									$("#popup_submit").css("pointer-events", "auto");
								}
								else {
									$("#popup_submit").css("pointer-events", "none");
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
								if(new_password != $("#new_password_confirm").val()) {
									$("#popup_title").text("Password Issue");
									$("#popup_submit").remove();
									$("#popup_exit").remove();
									$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
										.addClass("waves-effect waves-blue btn-flat").text("Exit"));
									$("#popup_body").text("The new password provided" + 
										" for confirmation does not match the previous password change!");
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
									});
								}
								else {
									$.post("/api/cms/check/" + email + "/" + $("#old_password_confirm").val()).done(function(result) {
										if(result[0] == "Wrong Password") {
											$("#popup_title").text("Password Issue");
											$("#popup_submit").remove();
											$("#popup_exit").remove();
											$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
												.addClass("waves-effect waves-blue btn-flat").text("Exit"));
											$("#popup_body").text("The old password provided for confirmation" + 
												" does not match the one in the database!");
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
											});
										}
										else {
											var statement = "/api/cms/change/profile/" + email + "/" + fname + 
												"/" + lname + "/" + question + "/" + answer;
											$.post(statement).done(function(result) {
											 	if(result == "1") {
													$.post("/api/cms/change/password/", {email: email, password: new_password})
														.done(function(result) {
													 	if(result == "1") {
															$("#popup_title").text("Confirmation");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer").append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
															$("#popup_body").text("The changes you provided have been implemented!");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
															});
														}
														else {
															$("#popup_title").text("Database Issue");
															$("#popup_submit").remove();
															$("#popup_exit").remove();
															$("#popup_modal_footer").append($("<a>")
																.attr("id", "popup_submit")
																.addClass("waves-effect waves-blue btn-flat")
																.text("Exit"));
															$("#popup_body").text("The changes you provided" + 
																" had trouble being uploaded to the database!");
															$("#popup_submit").click(function(e) {
																e.preventDefault();
																$(".lean-overlay").remove();
																$("#popup").remove();
																$("#popup_control").remove();
															});
														}
													});
												}
												else {
													$("#popup_title").text("Database Issue");
													$("#popup_submit").remove();
													$("#popup_exit").remove();
													$("#popup_modal_footer").append($("<a>")
														.attr("id", "popup_submit")
														.addClass("waves-effect waves-blue btn-flat")
														.text("Exit"));
													$("#popup_body").text("The changes you provided" + 
														" had trouble being uploaded to the database!");
													$("#popup_submit").click(function(e) {
														e.preventDefault();
														$(".lean-overlay").remove();
														$("#popup").remove();
														$("#popup_control").remove();
													});
												}
											});
										}
									});
								}
							});
						}
						else {
							$("#popup_title").text("Password Issue");
							$("#popup_submit").remove();
							$("#popup_exit").remove();
							$("#popup_modal_footer").append($("<a>")
								.attr("id", "popup_submit").addClass("waves-effect waves-blue btn-flat").text("Exit"));
							$("#popup_body").text("The new password does not meet the minimum security requirements!");
							$("#popup_submit").click(function(e) {
								e.preventDefault();
								$(".lean-overlay").remove();
								$("#popup").remove();
								$("#popup_control").remove();
							});
						}
					});
				});
			});
		});
	};

	/*

	Purpose:
	Handles the session modal for a live contributor.

	Parameters:
		router: 
			Object representing the router of the app
		page:
			The page to which the router will navigate
		issue:
			Integer corresponding to the scenario

	*/
	exports.session_modal = function(router, page, issue) {
		$(".lean-overlay").remove();
		$("#popup").remove();
		$("#popup_control").remove();
		$.get("/pages/dist/modal-min.html").done(function(content) {
			$("body").append(content);
			$("#popup_title").text("Login Issue");
			if(issue == 0) {
				$("#popup_body").text("It seems you are not currently signed" + 
					" into the content management system. Please login first!");
			}
			else if(issue == 1) {
				$("#popup_body").text("Your current session has expired. To" + 
					" continue using the system please login again!");
			}
			else if(issue == 2) {
				$("#popup_body").text("You are already logged in! Click the" + 
					" button below to redirect to the content management system.");
			}
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("#popup_control").click();
			$("#popup").keypress(function(event) {
			    if(event.keyCode === 10 || event.keyCode === 13) {
			        event.preventDefault();
			    }
			});
			$("#popup_submit").click(function(e) {
				e.preventDefault();
				router.navigate(page, {reload: true});
			});
		});
	};

	/*

	Purpose:
	Changes the modal content as needed and displays it.

	Parameters:
		type: 
			Referencing which modal is to be used
		issue:
			A number referencing the necessary case
		obj:
			An object obtained from a get/post request

	*/
	exports.modal = function(issue, router, obj) {
		$.get("/pages/dist/modal-min.html").done(function(content) {
			$("body").append(content);
			$(".modal-trigger").leanModal({
				dismissible: false,
				opacity: 2,
				inDuration: 1000,
				outDuration: 1000
			});
			$("body").on("keypress", function(event) {
			    if(event.which === 10 || event.which === 13) {
			        return false;
			    }
			});
			if(issue == 0) {
				$("#popup_title").text("Email Issue");
				$("#popup_body").text("There was an issue parsing the email you provided. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 1) {
				$("#popup_title").text("Registration Issue");
				$("#popup_body").text("The email you provided does not exist in the database." + 
					" Please provide another email!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 2) {
				$("#popup_title").text("Password Issue");
				$("#popup_body").text("The password must be at least eight characters long while" + 
					" containing at least one number, one lowercase letter, and one uppercase letter. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 3) {
				$("#popup_title").text("Database Issue");
				$("#popup_body").text("There was a problem connecting to the database!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 4) {
				$("#popup_title").text("Email Issue");
				$("#popup_body").text("The email you provided does not exist in the database. Please provide another email!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 5) {
				$("#popup_title").text("Password Issue");
				$("#popup_body").text("The password you provided does not match the one in the database. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 6) {
				$("#popup_title").text("Registration Issue");
				$("#popup_body").text("The email you provided already exists in the database. Please provide another email!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 7) {
				$("#popup_title").text("Password Issue");
				$("#popup_body").text("The passwords you provided did not match. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 8) {
				$("#popup_title").text("Name Issue");
				$("#popup_body").text("The first name cannot be left empty and must contain strictly letters. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 9) {
				$("#popup_title").text("Name Issue");
				$("#popup_body").text("The last name cannot be left empty and must contain strictly letters. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 10) {
				$("#popup_title").text("Security Question Issue");
				$("#popup_body").text("The answer to the chosen security question cannot be left empty. Please try again!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 11) {
				$("#popup_title").text("Contributor Submission Issue");
				$("#popup_body").text("There was an issue processing the submission to the database!");
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
				});
			}
			else if(issue == 12) {
				var statement = "Thanks for submitting an application to become a " 
					+ "contributor on manualmath! The design of the content management " 
					+ "system requires a majority approval from a committee of five top " 
					+ "ranking members including the administrator to become a contributor. " 
					+ "Deliberations can take a while, but you can definitely expect a " 
					+ "response within a week.";
				$("#popup_title").text("Contributor Submission").css("text-align", "center");
				$("#popup_body").text(statement).append($("<br><br>")).append($("<div>")
					.text("- " + obj.first_name + " " + obj.last_name).css("text-align", "right"));
				$("#popup_control").click();
				$("#popup_submit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("#login_click").click();
				});
			}
			else if(issue == 13) {
				var statement = "By continuing you are agreeing to manualmath's use of cookies to store session information.";
				$("#popup_submit").removeClass("modal-close");
				$("#popup_title").text("Login Confirmation").css("text-align", "center");
				$("#popup_body").text(statement);
				$("#popup_submit").text("Continue");
				$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
					.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
				$("#popup_control").click();
				$("#popup_exit").click(function(e) {
					e.preventDefault();
					$(".lean-overlay").remove();
					$("#popup").remove();
					$("#popup_control").remove();
					$("#login_click").click();
					$("body").off();
				});
				$("#popup_submit").click(function() {
					$("body").off();
					if(obj[0].status == 1) {
						$(".lean-overlay").remove();
						$("#popup").remove();
						$("#popup_control").remove();
						$.post("/api/cms/add/live/" + $("#login_email").val()).done(function(result) {
							if(result == 1) {
								exports.write_cookie("contributor", $("#login_email").val(), 60);
								router.navigate("cms", {reload: true});
							}
							else { console.log("There was an issue adding the contributor to the list of live sessions!"); }
						});
					}
					else {
						$("#popup_title").text("Contributor Status").css("text-align", "center");
						$("#popup_body").text("Your account has not been approved by manualmath's committee yet!");
						$("#popup_submit").remove();
						$("#popup_exit").remove();
						$("#popup_modal_footer").append($("<a>").attr("id", "popup_submit")
							.addClass("modal-close waves-effect waves-blue btn-flat").text("Ok"));
						
						$("#login_input input").each(function() { $(this).val(""); });
						Materialize.updateTextFields();
						$("#popup_submit").click(function(e) {
							e.preventDefault();
							$(".lean-overlay").remove();
							$("#popup").remove();
							$("#popup_control").remove();
							$(window).scrollTop(0);
							$("body").off();
						});
					}
					$("body").css({overflow: "inherit", width: "auto"});
				});
			}
			else if(issue == 14) {
				$.get("/pages/dist/password-recovery-min.html").done(function(material) {
					$("#popup_title").text("Password Recovery");
					$("#popup_body").text("Please answer the security question associated to the account:")
						.append(material);
					$("#ques").val($("#question option:selected").text());
					$("#popup_submit").text("Continue").removeClass("modal-close");
					$("#popup_modal_footer").append($("<a>").attr("id", "popup_exit")
						.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
					$("#popup_control").click();
					$("#popup_submit").css("pointer-events", "none");
					$("#forgotten").on("input", function() {
						if($("#forgotten").val().length == 0) {
							$("#popup_submit").css("pointer-events", "none");
						}
						else {
							$("#popup_submit").css("pointer-events", "auto");
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
						var statement = "/api/cms/check/security/" + $("#login_email").val() + "/" + $("#forgotten").val();
						$.post(statement).done(function(result) {
							if(result == 1) {
								$.get("/pages/dist/password-change-min.html").done(function(result) {
									$("#popup_title").text("Password Reset");
									$("#popup_body").text("Please provide a new password:").append(result);
									$("#popup_exit").remove();
									$("#popup_submit").remove();
									$("#popup_modal_footer")
										.append($("<a>").attr("id", "popup_submit")
											.addClass("modal-close waves-effect waves-blue btn-flat").text("Continue"))
										.append($("<a>").attr("id", "popup_exit")
											.addClass("modal-close waves-effect waves-blue btn-flat").text("Exit"));
									$("#popup_submit").css("pointer-events", "none");
									$("#newpass").on("input", function() {
										if($("#newpass").val().length == 0) {
											$("#popup_submit").css("pointer-events", "none");
										}
										else {
											$("#popup_submit").css("pointer-events", "auto");
										}
									});
									$("#popup_exit").click(function() {
										e.preventDefault();
										$(".lean-overlay").remove();
										$("#popup").remove();
										$("#popup_control").remove();
										$("#login_click").click();
										$(window).scrollTop(0);
										$("body").off();
									});
									$("body").on("keypress", function(event) {
									    if(event.which === 10 || event.which === 13) {
									        return false;
									    }
									});
									$("#popup_submit").click(function(e) {
										e.preventDefault();
										$("body").off();
										if(exports.password_check($("#newpass").val())) {
											statement = "/api/cms/change/password/" + $("#login_email").val() + 
												"/" + $("#newpass").val();
											$.post(statement).done(function() {
												$("#popup_title").text("Password Changed");
												$("#popup_body").text("You may now login with the new password!");
												$("#popup_exit").remove();
												$("#popup_submit").remove();
												$("#popup_modal_footer")
													.append($("<a>").attr("id", "popup_submit")
														.addClass("modal-close waves-effect waves-blue btn-flat")
														.text("Continue"));
												$("#popup_submit").click(function(e) {
													e.preventDefault();
													$(".lean-overlay").remove();
													$("#popup").remove();
													$("#popup_control").remove();
													$("#login_click").click();
													$(window).scrollTop(0);
													$("body").off();
												});
											});
										}
										else {
											$("#popup_title").text("Password Issue");
											$("#popup_body").text("The password must be at least eight characters" + 
												" long while containing at least one number, one lowercase letter," + 
												" and one uppercase letter. Please try again!");
											$("#popup_exit").remove();
											$("#popup_submit").remove();
											$("#popup_modal_footer")
												.append($("<a>").attr("id", "popup_submit")
													.addClass("modal-close waves-effect waves-blue btn-flat")
													.text("Ok"));
											$("#popup_submit").click(function(e) {
												e.preventDefault();
												$(".lean-overlay").remove();
												$("#popup").remove();
												$("#popup_control").remove();
												$("#login_click").click();
												$(window).scrollTop(0);
												$("body").off();
											});
										}
									});
								});
							}
							else {
								$("#popup_title").text("Password Recovery").css("text-align", "left");
								$("#popup_body").text("You provided the wrong answer to the security question!");
								$("#popup_exit").remove();
								$("body").off();
								$("#popup_submit").text("Ok").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
									$("#login_click").click();
									$(window).scrollTop(0);
									$("body").off();
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
    	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return reg.test(String(email).toLowerCase());
	};

	/*

	Purpose:
	Compares two objects based on their order property.

	Parameters:
		lhs: 
			The left hand side object
		rhs: 
			The right hand side object

	*/
	exports.compare_object_order = function(lhs, rhs) { return lhs.order < rhs.order ? -1 : 1; };

	/*

	Purpose:
	Handles the API calls.

	Parameters:
		arguments: 
			The API calls as a list

	*/
	exports.get_all = function() {
		var urls = Array.prototype.slice.call(arguments),
			promises = urls.map(function(url) { return $.get(url); }),
			def = $.Deferred();
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
	Once all of subjects, topics, sections, and examples are associated this function
	will change the order within the arrays based on the order property from the database.

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
		var rgb = orig.replace(/\s/g,"").match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" +
		  	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		  	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
	};

	/*

	Purpose:
	Takes away the pointer events associated to the logo link on the about page.

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.handle_logo_link = function(page) { 
		page == "about" ? $(".logo-cls").css("pointer-events", "none") : $(".logo-cls").css("pointer-events", ""); 
	};

	/*

	Purpose:
	Handles the coloring of the li tags on the example_side_nav.

	*/
	exports.handle_li_coloring = function() {
		$("#nav-mobile li").each(function() {
			if($(this).hasClass("active")) {
				$(this).css("background-color", "#4693ec");
				$(this).find("a").css("color", "white");
			}
			else {
				if($(this).css("background-color")) {
					if(exports.rgba_to_hex($(this).css("background-color")) == "#4693ec") {
						window.innerWidth < 992 ? $(this).css("background-color", "white") : $(this).css("background-color", "");
						$(this).find("a").css("color", "#444");
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
		return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	}

	/*

	Purpose:
	Handles the side nav for different screens.

	*/
	exports.handle_side_nav = function() {
		var width = 0,
			screen_width = exports.width_func();
		if(screen_width >= 992) { width = 350; }
		else if(screen_width < 992 && screen_width > 400) { width = screen_width * .75; }
		else { width = screen_width * .72; }
		$(".button-collapse").sideNav({
			"menuWidth": width,
			"closeOnClick": true
		});
		if(screen_width < 992) { $(".button-collapse").sideNav("hide"); }
	};

	/*

	Purpose:
	Moves the logo all the way to the right on a mobile view.

	*/
	exports.handle_logo = function() {
		if(exports.width_func() < 992) {
			if(exports.width_func() >= 750) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 183,
					"display": "inline-block"
				});
			}
			else if(exports.width_func() < 750 && exports.width_func() >= 550) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 165,
					"display": "inline-block"
				});
			}
			else if(exports.width_func() < 550 && exports.width_func() >= 400) {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 164,
					"display": "inline-block"
				});
			}
			else {
				$("#logo").css({
					"left": (exports.width_func() / 2) - ($("#mobile_title").width() / 2) - 150,
					"display": "inline-block"
				});
			}
		}
	};

	/*

	Purpose:
	Handles the button functionality for "Show Proof" and "Show Solution".

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.handle_button = function(cms) {
		if(cms == 1) {
			$("#latex .solution_display i").off();
			$("#latex .solution_display i").on("click", function(defaultevent) {
				defaultevent.preventDefault();
				$(this).text() == "add" ? $(this).parent().parent().next(".cont_div").fadeIn(300) 
					: $(this).parent().parent().next(".cont_div").fadeOut(300);
				$(this).text() == "add" ? $(this).text("remove") : $(this).text("add");
			});
		}
		else {
			$("#latex .show_solution").off();
			$("#latex .show_solution").on("click", function(defaultevent) {
				defaultevent.preventDefault();
				$(this).find(".solution_display i").text() == "add" ? $(this).parent().find(".cont_div").fadeIn(300) 
					: $(this).parent().find(".cont_div").fadeOut(300);
				$(this).find(".solution_display i").text() == "add" ? $(this).find(".solution_display i").text("remove") 
					: $(this).find(".solution_display i").text("add");
			});
		}
	};

	/*

	Purpose:
	Handles the mobile logo placement on an orientation change.

	*/
	exports.handle_orientation = function(page, navs, param1, param2) {
		$(window).on("deviceorientation", function(event) { 
			// exports.handle_logo();
		});
	};

	/*

	Purpose:
	Handles the generation of breadcrumbs.

	Parameters:
		page: 
			The name of the page currently set
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section

	*/
	exports.handle_breadcrumbs = function(page, obj, subject, topic, section, example) {
		if(exports.width_func() < 992) {
			if(page == "subject") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
			}
			else if(page == "topic") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(topic.clean_name));
			}
			else if(page == "section") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name)));
			}
			else if(page == "example") {
				obj.before($("<div>").addClass("col s1").attr("id", "breadcrumbs"));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").text(subject.clean_name));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(topic.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(section.clean_name)));
				$("#breadcrumbs").append($("<li>").addClass("breadcrumb").append($("<div>").text(example.clean_name)));
			}
			$(".breadcrumb:not(:first)").toggleClass("changed");
		}
	};

	/*

	Purpose:
	Makes sure that the breadcrumbs on the topic page allign correctly.

	Parameters:
		page: 
			The name of the page currently set

	*/
	exports.mobile_breadcrumbs = function(page) {
		if(page == "topic") {
			$(".breadcrumb.changed").css("display", "inline-flex");
		}
	};

	/*

	Purpose:
	Removes the extra spacing created by an invisible MathJax span.
	
	*/
	exports.hide_mathjax_span = function() {
		$("#latex .MathJax").first().css("display", "none");
	};

	/*

	Purpose:
	Handles the generation of breadcrumbs for the desktop title.

	Parameters:
		page: 
			The name of the page currently set
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section

	*/
	exports.handle_desktop_title = function(page, subject, topic, section) {
		if(exports.width_func() >= 992) {
			$("#desktop_title").empty();
			if(page == "about") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text("About"));
			}
			else if(page == "subject") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
			}
			else if(page == "topic") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
			}
			else if(page == "section") {
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(subject.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(topic.clean_name));
				$("#desktop_title").append($("<a>").addClass("breadcrumb").text(section.clean_name));
			}
			else { console.log("No such page exists: " + page); }
			$(".breadcrumb:not(:first)").toggleClass("changed");
		}
	};

	/*

	Purpose:
	Determines whether the current device is mobile or not.

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

	exports.latex_cms_links = function(data) {
		$(".toggle").off();
		$(".add-image").off();
		$(".add-math").off();
		$(".del-box").off();
		$("#latex .solution_display").off();
		$(".toggle").on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var item = $(this).parents().prev().clone().children().remove().end().text();
			var ref = data.title_cms.findIndex(function(elem) {
				return elem.split("_hidden")[0] == item;
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
		$(".solution_toggle").tooltip("destroy");
		$(".del-box-tooltipped").tooltip("destroy");
		$(".add-math-tooltipped").tooltip("destroy");
		$(".add-image-tooltipped").tooltip("destroy");
		$(".solution_toggle").tooltip();
		$(".del-box-tooltipped").tooltip();
		$(".add-math-tooltipped").tooltip();
		$(".add-image-tooltipped").tooltip();
		$(".add-math").on("click", function(e) {
			e.preventDefault();
			var obj = $(this).parent().parent().parent().find(".cont_div .latex_body").first();
			obj.append($("<div>").addClass("latex_equation").text("$New Equation$"));
		});
		$(".add-image").on("click", function(e) {
			e.preventDefault();
			$("body").append($("<input>").css("display", "none")
				.attr({id: "file", type: "file"}));
			var obj = $(this).parent().parent().parent()
				.find(".cont_div .latex_body").first();
			$("#file").click();
			$("#file").on("change", function() {
				var file = $("#file")[0].files[0],
					reader  = new FileReader();
				reader.addEventListener("load", function () {
					// var ref = reader.result.indexOf("data:image/jpeg;base64")



					/**
					 * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
					 * 
					 * @param {HtmlElement} canvas
					 * @param {int} width
					 * @param {int} height
					 * @param {boolean} resize_canvas if true, canvas will be resized. Optional.
					 */
					function resample_single(canvas, width, height, resize_canvas) {
					    var width_source = canvas.width;
					    var height_source = canvas.height;
					    width = Math.round(width);
					    height = Math.round(height);

					    var ratio_w = width_source / width;
					    var ratio_h = height_source / height;
					    var ratio_w_half = Math.ceil(ratio_w / 2);
					    var ratio_h_half = Math.ceil(ratio_h / 2);

					    var ctx = canvas.getContext("2d");
					    var img = ctx.getImageData(0, 0, width_source, height_source);
					    var img2 = ctx.createImageData(width, height);
					    var data = img.data;
					    var data2 = img2.data;

					    for (var j = 0; j < height; j++) {
					        for (var i = 0; i < width; i++) {
					            var x2 = (i + j * width) * 4;
					            var weight = 0;
					            var weights = 0;
					            var weights_alpha = 0;
					            var gx_r = 0;
					            var gx_g = 0;
					            var gx_b = 0;
					            var gx_a = 0;
					            var center_y = (j + 0.5) * ratio_h;
					            var yy_start = Math.floor(j * ratio_h);
					            var yy_stop = Math.ceil((j + 1) * ratio_h);
					            for (var yy = yy_start; yy < yy_stop; yy++) {
					                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
					                var center_x = (i + 0.5) * ratio_w;
					                var w0 = dy * dy; //pre-calc part of w
					                var xx_start = Math.floor(i * ratio_w);
					                var xx_stop = Math.ceil((i + 1) * ratio_w);
					                for (var xx = xx_start; xx < xx_stop; xx++) {
					                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
					                    var w = Math.sqrt(w0 + dx * dx);
					                    if (w >= 1) {
					                        //pixel too far
					                        continue;
					                    }
					                    //hermite filter
					                    weight = 2 * w * w * w - 3 * w * w + 1;
					                    var pos_x = 4 * (xx + yy * width_source);
					                    //alpha
					                    gx_a += weight * data[pos_x + 3];
					                    weights_alpha += weight;
					                    //colors
					                    if (data[pos_x + 3] < 255)
					                        weight = weight * data[pos_x + 3] / 250;
					                    gx_r += weight * data[pos_x];
					                    gx_g += weight * data[pos_x + 1];
					                    gx_b += weight * data[pos_x + 2];
					                    weights += weight;
					                }
					            }
					            data2[x2] = gx_r / weights;
					            data2[x2 + 1] = gx_g / weights;
					            data2[x2 + 2] = gx_b / weights;
					            data2[x2 + 3] = gx_a / weights_alpha;
					        }
					    }
					    //clear and resize canvas
					    if (resize_canvas === true) {
					        canvas.width = width;
					        canvas.height = height;
					    } else {
					        ctx.clearRect(0, 0, width_source, height_source);
					    }

					    //draw
					    ctx.putImageData(img2, 0, 0);
					}

					// var canvas = $("<canvas>").append($("<img>").attr("src", reader.result));
					var img = new Image();
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					img.src = reader.result;
					ctx.clearRect(0, 0, 1000, 1000);
					img.onload = function() {
						ctx.drawImage(img, 0, 0);
	    				// resample_single(canvas, 650, 650, 1);
					}


			  		obj.append($("<div>").addClass("latex_equation")
						.append(canvas));
						// .append($("<img>").attr("src", canvas.toDataURL())));
			  		// console.log(reader.result);
			  		// console.log(exports.scale_down(reader.result.substring(23), 500, "image/jpeg", "base64"));
					$("#file").remove();
		  		}, false);
			  	if(file) {
				    reader.readAsDataURL(file);
			  	}
			});
		});
		$(".del-box").on("click", function(e) {
			e.preventDefault();
			$(this).parent().parent().children().each(function(index) {
				if($(this).attr("data-position") == "top") {
					$("#" + $(this).attr("data-tooltip-id")).remove();
				}
			});
			$(this).parent().parent().parent().remove();
			if($("#latex .accordion").length == 0) {
				$("#latex").append($("<div>").addClass("accordion").append($("<div>")
					.addClass("show_solution").text("NO CONTENT HERE!")));
			}
		});
	};

	/*

	Purpose:
	Handles the loading of all content for the cms pages.

	Parameters:
		page: 
			The name of the page currently set
		cookie:
			A browser cookie representing the live session of a contributor
		router:
			An object representing the router
		links:
			An object that handles all links on a page
		subjects:
			An array of all subjects in the database
		topics:
			An array of all topics in the database
		sections:
			An array of all sections in the database
		examples:
			An array of all examples in the database
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section
		example:
			An object representing the current example

	*/
	exports.latex_cms = function(page, cookie, router, links, subjects, topics, sections, examples, subject, topic, section, example) {
		$.get("/pages/dist/edit-bar-min.html").done(function(bar) {
			$("#latex").append(bar);
			var statement = "/api/",
				db_id = -1,
				ref = -1;
			if(page == "about") { statement += "cms/about/data"; }
			else if(page == "subject") { statement += "subject/data/"; db_id = subject.sid; ref = "undefined"; }
			else if(page == "topic") { statement += "topic/data/"; db_id = topic.tid; ref = subject.sid; }
			else if(page == "section") { statement += "section/data/"; db_id = section.section_id; ref = topic.tid; }
			else if(page == "example") { statement += "example/data/"; db_id = example.eid; ref = section.section_id; }
			$.post(statement, {param: db_id}).done(function(data) {
				data.title = data.title != null ? decodeURIComponent(data.title).split("-----") : [""];
				data.content = data.content != null ? decodeURIComponent(data.content).split("-----") : [""];
				data.title_cms = data.title_cms != null ? decodeURIComponent(data.title_cms).split("-----") : [""];
				data.content_cms = data.content_cms != null ? decodeURIComponent(data.content_cms).split("-----") : [""];
				if(page == "about") {
					$("#latex").append($("<div>").attr("id", "main_message").addClass("box_message")
						.append($("<h1>").text(data.heading_cms).css("margin-top", "-60px")));
				}
				var i = 0;
				for(; i >= 0; i++) {
					if(data.title_cms[i] == null || data.title_cms[i] == "") { break; }
					var cont_div = "",
						title = data.title_cms[i].split("_")[0],
						accordion = $("<div>").addClass("accordion"),
						show_solution = $("<div>").addClass("show_solution").text(title),
						span = $("<span>").addClass("solution_display"),
						latex_body = $("<div>").addClass("latex_body");
					if(data.title_cms[i].split("_hidden").length == 1) {
						cont_div = $("<div>").addClass("cont_div");
						span.append($("<i>").addClass("material-icons").text("remove"));
					}
					else {
						cont_div = $("<div>").addClass("cont_div hidden_div");
						span.append($("<i>").addClass("material-icons").text("add"));
					}	
					latex_body.append(data.content_cms[i]);
					cont_div.append(latex_body);
					show_solution.append(span);
					accordion.append(show_solution);
					accordion.append(cont_div);
					$("#latex").append(accordion);
				}
				if(i == 0) {
					$("#latex").append($("<div>").addClass("accordion").append($("<div>")
						.addClass("show_solution").text("NO CONTENT HERE!")));
				}
				exports.handle_breadcrumbs(page, $(".accordion").first(), subject, topic, section, example);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
				exports.handle_button();
				if(data.cms_approval != null && 
					data.cms_approval.split(",").some(function(elem) { return elem == cookie; })) {
					$("#approve").css("color", "green");
				}
				else {
					$("#approve").css("color", "red");
				}
				$(".tooltipped").tooltip();
				$("#approve").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex($("#approve").css("color")) == "#ff0000") {
						$("#approve").css("color", "green");
						if(data.cms_approval == null) {
							data.cms_approval = cookie;
						}
						else {
							data.cms_approval += "," + cookie;
						}
					}
					else {
						$("#approve").css("color", "red");
						var pos = data.cms_approval.indexOf(cookie);
						if(pos == 0) {
							data.cms_approval = data.cms_approval.substring(cookie.length + 2);
						}
						else {
							data.cms_approval = data.cms_approval.substring(0, pos - 1) +
								data.cms_approval.substring(pos + cookie.length);
						}
					}
					if(data.cms_approval == "") { data.cms_approval = null; }
				});
				$("#add-box").css("pointer-events", "none");
				$("#cms-version").css("pointer-events", "none");
				$("#live-version").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex($("#edit").closest("li").css("background-color")) == "#008cc3") {
						if(page == "about") { data.heading_cms = $("#edit_title").text(); }
						if($(".latex_body").length != 0) {
							$(".latex_body").each(function(index) {
								var arr_title = [],
									arr_body = [];
								$(".show_solution").each(function(index) {
									var title = $(this).children().first().clone().children().remove().end().text();
									$(this).children().children().each(function(index) {
										if($(this).hasClass("toggle") && $(this).text() == "toggle_off") {
											arr_title.push(title + "_hidden");
										}
										else if($(this).hasClass("toggle") && $(this).text() == "toggle_on") {
											arr_title.push(title);
										}
									});
									$(this).siblings().each(function(index) {
										arr_body.push($(this).children()[0].innerHTML);
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
					if(exports.rgba_to_hex($("#live-version").closest("li").css("background-color")) != "#008cc3") {
						var controller = $("#bar-div").detach();
						$("#latex").empty().append(controller);
						$("#add-box").css("pointer-events", "none");
						if(page == "about") {
							$("#latex").append($("<div>").attr("id", "main_message").addClass("box_message")
								.append($("<h1>").text(data.heading_cms).css("margin-top", "-60px")));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title[j] == null || data.title[j] == "") { break; }
							var cont_div = "",
								title = data.title[j].split("_")[0],
								accordion = $("<div>").addClass("accordion"),
								show_solution = $("<div>").addClass("show_solution").text(title),
								span = $("<span>").addClass("solution_display"),
								latex_body = $("<div>").addClass("latex_body");
							if(data.title[j].split("_").length == 1) {
								cont_div = $("<div>").addClass("cont_div");
								span.append($("<i>").addClass("material-icons").text("remove"));
							}
							else {
								cont_div = $("<div>").addClass("cont_div hidden_div");
								span.append($("<i>").addClass("material-icons").text("add"));
							}	
							latex_body.append(data.content[j]);
							cont_div.append(latex_body);
							show_solution.append(span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>").addClass("accordion").append($("<div>")
								.addClass("show_solution").text("NO CONTENT HERE!")));
						}
						$("#live-version").css("pointer-events", "none").closest("li").css("background-color", "#008cc3");
						$("#cms-version").css("pointer-events", "auto").closest("li").css("background-color", "");
						$("#edit").css("pointer-events", "auto").closest("li").css("background-color", "");
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
						exports.handle_button();
					}
				});
				$("#cms-version").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex($("#edit").closest("li").css("background-color")) == "#008cc3") {
						if(page == "about") { data.heading_cms = $("#edit_title").text(); }
						if($(".latex_body").length != 0) {
							$(".latex_body").each(function(index) {
								var arr_title = [],
									arr_body = [];
								$(".show_solution").each(function(index) {
									var title = $(this).children().first().clone().children().remove().end().text();
									$(this).children().children().each(function(index) {
										if($(this).hasClass("toggle") && $(this).text() == "toggle_off") {
											arr_title.push(title + "_hidden");
										}
										else if($(this).hasClass("toggle") && $(this).text() == "toggle_on") {
											arr_title.push(title);
										}
									});
									$(this).siblings().each(function(index) {
										arr_body.push($(this).children()[0].innerHTML);
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
					if(exports.rgba_to_hex($("#cms-version").closest("li").css("background-color")) != "#008cc3") {
						var controller = $("#bar-div").detach();
						$("#latex").empty().append(controller);
						$("#add-box").css("pointer-events", "none");
						if(page == "about") {
							$("#latex").append($("<div>").attr("id", "main_message").addClass("box_message")
								.append($("<h1>").text(data.heading_cms).css("margin-top", "-60px")));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title_cms[j] == null || data.title_cms[j] == "") { break; }
							var cont_div = "",
								title = data.title_cms[j].split("_")[0],
								accordion = $("<div>").addClass("accordion"),
								show_solution = $("<div>").addClass("show_solution").text(title),
								span = $("<span>").addClass("solution_display"),
								latex_body = $("<div>").addClass("latex_body");
							if(data.title_cms[j].split("_").length == 1) {
								cont_div = $("<div>").addClass("cont_div");
								span.append($("<i>").addClass("material-icons").text("remove"));
							}
							else {
								cont_div = $("<div>").addClass("cont_div hidden_div");
								span.append($("<i>").addClass("material-icons").text("add"));
							}		
							latex_body.append(data.content_cms[j]);
							cont_div.append(latex_body);
							show_solution.append(span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>").addClass("accordion").append($("<div>")
								.addClass("show_solution").text("NO CONTENT HERE!")));
						}
						$("#cms-version").css("pointer-events", "none").closest("li").css("background-color", "#008cc3");
						$("#live-version").css("pointer-events", "auto").closest("li").css("background-color", "");
						$("#edit").css("pointer-events", "auto").closest("li").css("background-color", "");
						MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
						exports.handle_button();
					}
				});
				$("#edit").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex($("#edit").closest("li").css("background-color")) != "#008cc3") {
						var controller = $("#bar-div").detach();
						$("#latex").empty().append(controller);
						$("#add-box").css("pointer-events", "auto");
						$("#save").css("pointer-events", "auto");
						if(page == "about") {
							$("#latex").append($("<div>").attr("id", "main_message").addClass("box_message")
								.append($("<h1>").text(data.heading_cms).css("margin-top", "-60px")
									.attr({contentEditable: "true", id: "edit_title"})));
						}
						var j = 0;
						for(; j >= 0; j++) {
							if(data.title_cms[j] == null || data.title_cms[j] == "") { break; }
							var cont_div = "",
								title = data.title_cms[j].split("_")[0],
								accordion = $("<div>").addClass("accordion"),
								show_solution = $("<div>").addClass("show_solution")
									.append($("<div>").addClass("tog-title").attr("contentEditable", "true")
									.text(title)),
								span = $("<span>").addClass("solution_display"),
								span_toggle = $("<span>").addClass("solution_toggle").attr("data-position", "top")
									.attr("data-tooltip", "Toggle the Display"),
								span_box = $("<span>").addClass("solution_box add-math-tooltipped")
									.append($("<i>").addClass("material-icons add-math").text("border_color"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Insert Math Box Below"),
								span_image = $("<span>").addClass("solution_img add-image-tooltipped")
									.append($("<i>").addClass("material-icons add-image").text("image"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Insert Image Below"),
								span_del = $("<span>").addClass("solution_del del-box-tooltipped")
									.append($("<i>").addClass("material-icons del-box").text("delete_sweep"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Delete Box Below"),
								latex_body = $("<div>").addClass("latex_body");
							if(data.title_cms[j].split("_").length == 1) {
								cont_div = $("<div>").addClass("cont_div");
								span.append($("<i>").addClass("material-icons").text("remove"));
								span_toggle.append($("<i>").addClass("material-icons toggle").text("toggle_on"));
							}
							else {
								cont_div = $("<div>").addClass("cont_div hidden_div");
								span.append($("<i>").addClass("material-icons").text("add"));
								span_toggle.append($("<i>").addClass("material-icons toggle").text("toggle_off"));
							}	
							latex_body.append(data.content_cms[j]);
							cont_div.append(latex_body);
							show_solution.append(span_box, span_image, span_del, span_toggle, span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
						}
						if(j == 0) {
							$("#latex").append($("<div>").addClass("accordion").append($("<div>")
								.addClass("show_solution").text("NO CONTENT HERE!")));
						}
						$("#edit").css("pointer-events", "none").closest("li").css("background-color", "#008cc3");
						$("#live-version").css("pointer-events", "auto").closest("li").css("background-color", "");
						$("#cms-version").css("pointer-events", "auto").closest("li").css("background-color", "");
						$(".latex_body").attr("contentEditable", "true");
						$("div[contenteditable]").keydown(function(e) {
						    if(e.keyCode === 13) {
						    	document.execCommand("insertHTML", false, "<br><br>");
						    	return false;
						    }
						});
						$(".solution_toggle").tooltip();
						$(".del-box-tooltipped").tooltip();
						$(".add-math-tooltipped").tooltip();
						$(".add-image-tooltipped").tooltip();
						exports.handle_button(1);
						$("#add-box").off();
						$("#add-box").on("click", function(e) {
							e.preventDefault();
							if($(".accordion").length == 1 && 
								$(".accordion .show_solution").text() == "NO CONTENT HERE!") {
								$(".accordion").remove();
							}
							var cont_div = "",
								accordion = $("<div>").addClass("accordion"),
								show_solution = $("<div>").addClass("show_solution")
									.append($("<div>").addClass("tog-title").attr("contentEditable", "true")
									.text("New Title")),
								span = $("<span>").addClass("solution_display"),
								span_toggle = $("<span>").addClass("solution_toggle").attr("data-position", "top")
									.attr("data-tooltip", "Toggle the Display"),
								span_box = $("<span>").addClass("solution_box add-math-tooltipped")
									.append($("<i>").addClass("material-icons add-math").text("border_color"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Insert Math Box Below"),
								span_image = $("<span>").addClass("solution_img add-image-tooltipped")
									.append($("<i>").addClass("material-icons add-image").text("image"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Insert Image Below"),
								span_del = $("<span>").addClass("solution_del del-box-tooltipped")
									.append($("<i>").addClass("material-icons del-box").text("delete_sweep"))
									.attr("data-position", "top")
									.attr("data-tooltip", "Delete Box Below"),
								latex_body = $("<div>").addClass("latex_body").text("New Content"),
								cont_div = $("<div>").addClass("cont_div");
							span.append($("<i>").addClass("material-icons").text("remove"));
							span_toggle.append($("<i>").addClass("material-icons toggle").text("toggle_on"));
							cont_div.append(latex_body);
							show_solution.append(span_box, span_image, span_del, span_toggle, span);
							accordion.append(show_solution);
							accordion.append(cont_div);
							$("#latex").append(accordion);
							data.title_cms.push("New Title");
							data.content_cms.push("New Content");
							$(".latex_body").attr("contentEditable", "true");
							exports.handle_button(1);
							exports.latex_cms_links(data);

							document.height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                      			document.documentElement.clientHeight, document.documentElement.scrollHeight, 
                      			document.documentElement.offsetHeight );

						});
						exports.latex_cms_links(data);
					}
				});
				$("#save").click(function(e) {
					e.preventDefault();
					if(exports.rgba_to_hex($("#edit").closest("li").css("background-color")) == "#008cc3") {
						$(".latex_body").each(function(index) {
							var arr_title = [],
								arr_body = [];
							$(".show_solution").each(function(index) {
								var title = $(this).children().first().clone().children().remove().end().text();
								$(this).children().children().each(function(index) {
									if($(this).hasClass("toggle") && $(this).text() == "toggle_off") {
										arr_title.push(title + "_hidden");
									}
									else if($(this).hasClass("toggle") && $(this).text() == "toggle_on") {
										arr_title.push(title);
									}
								});
								$(this).siblings().each(function(index) {
									arr_body.push($(this).children()[0].innerHTML);
								});
							});
							data.title_cms = arr_title;
							data.content_cms = arr_body;
						});
					}
					$.get("/pages/dist/modal-min.html").done(function(content) {
						$("body").append(content);
						$(".modal-trigger").leanModal({
							dismissible: false,
							opacity: 2,
							inDuration: 1000,
							outDuration: 1000
						});
						$.get("/api/cms/contributors").done(function(num) {
							const validation = Math.ceil(Math.log(parseInt(num)));
							data.title_cms = data.title_cms.map(function(elem) {
								return elem.split("\\$").map(function(iter, index) {
									if(index % 2 == 0) {
										return iter.replace(/\\/g, "%5C");
									}
									else {
										return iter;
									}
								}).join("\$");
							});
							data.content_cms = data.content_cms.map(function(elem) {
								return elem.split("\\$").map(function(iter, index) {
									if(index % 2 == 0) {
										return iter.replace(/\\/g, "%5C");
									}
									else {
										return iter;
									}
								}).join("\$");
							});
							if(data.cms_approval != null && data.cms_approval != "" 
								&& data.cms_approval.split(",").length >= validation) {
								data.title = data.title_cms;
								data.content = data.content_cms;
								data.heading = data.heading_cms;
								data.cms_approval = 0;
							}
							else {
								data.title = data.title.map(function(elem) {
									return elem.split("\\$").map(function(iter, index) {
										if(index % 2 == 0) {
											return iter.replace(/\\/g, "%5C");
										}
										else {
											return iter;
										}
									}).join("\$");
								});
								data.content = data.content.map(function(elem) {
									return elem.split("\\$").map(function(iter, index) {
										if(index % 2 == 0) {
											return iter.replace(/\\/g, "%5C");
										}
										else {
											return iter;
										}
									}).join("\$");
								});
							}
							var obj = {
								param: db_id,
								ref: ref,
								name: "undefined",
								order: "undefined",
								title: (data.title.join("-----") != "" ? data.title.join("-----") : "0"),
								content: (data.content.join("-----") != "" ? data.content.join("-----") : "0"),
								side_approval: "undefined",
								cms_approval: (data.cms_approval != "" && data.cms_approval != null ? content.cms_approval : "0"),
								del_approval: "undefined",
								title_cms: (data.title_cms.join("-----") != "" ? data.title_cms.join("-----") : "0"),
								content_cms: (data.content_cms.join("-----") != "" ? data.content_cms.join("-----") : "0")
							};
							statement = "/api/change/";
							if(page == "subject") { statement += "subject/"; }
							else if(page == "topic") { statement += "topic/"; }
							else if(page == "section") { statement += "section/"; }
							else if(page == "example") { statement += "example/"; }
							else if(page == "about") {
								statement = "/api/cms/about/change/";
								obj.heading = data.heading;
								obj.heading_cms = data.heading_cms;
							}
							console.log(statement);
							console.log(obj);
							$.post(statement, obj).fail(function() {
								$("#popup_title").text("Database Issue");
								$("#popup_body").text("There was an issue uploading the content changes to the database!");
								$("#popup_control").click();
								$("#popup_submit").click(function(e) {
									e.preventDefault();
									$(".lean-overlay").remove();
									$("#popup").remove();
									$("#popup_control").remove();
								});
							}).done(function() {
								$("#popup_title").text("Changes Saved");
								$("#popup_body").text("All changes to the content have been saved to the database!");
								$("#popup_control").click();
								$("#popup_submit").click(function(e) {
									e.preventDefault();
									location.reload();
									$(window).scrollTop(0);
								});
							});
						});
					});
				});
				$.get("/pages/dist/button-min.html").done(function(button) {
					$("body").append(button);
					exports.committee(cookie, function() {
						exports.handle_logo_link("");
						exports.handle_logo();
						exports.handle_li_coloring();
						links.handle_links(router, subjects, topics, sections, examples);
						// functions.handle_orientation("section", navs, section, topic);
						if(page == "about") {
							exports.handle_desktop_title("about");
						}
						else if(page == "subject") {
							exports.handle_desktop_title("subject", subject);
						}
						else if(page == "topic") {
							exports.handle_desktop_title("topic", subject, topic);
						}
						else if(page == "section" || page == "example") {
							exports.handle_desktop_title("section", subject, topic, section);
						}
						$("#bar-nav").css("width", "100%");
						$("#bar").css("width", "82%");
						$("#live-version").parent("li").css("margin-left", "25px");
						$("#save").parent("li").css("margin-right", "25px");
						$("#cms-version").closest("li").css("background-color", "#008cc3");
						if(page == "about") {
							$("#subjects_change").click(function(e) {
								e.preventDefault();
								exports.sidenav_modal("Subjects", subjects);
							});
						}
						else if(page == "subject") {
							$("#topics_change").click(function(e) {
								e.preventDefault();
								exports.sidenav_modal("Topics", topics, subject.sid);
							});
						}
						else if(page == "topic") {
							$("#sections_change").click(function(e) {
								e.preventDefault();
								exports.sidenav_modal("Sections", sections, topic.tid);
							});
						}
						else if(page == "section" || page == "example") {
							$("#examples_change").click(function(e) {
								e.preventDefault();
								exports.sidenav_modal("Examples", examples, section.section_id);
							});
						}
						document.height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
		          			document.documentElement.clientHeight, document.documentElement.scrollHeight, 
		          			document.documentElement.offsetHeight );
					});
				});
				
				// if(functions.is_mobile() && section.section_name == "Common_Derivatives_and_Properties") {
				// 	MathJax.Hub.Queue(function() {
				// 		functions.hide_mathjax_span();
				// 	});
				// }
			});
		});
	};

	/*

	Purpose:
	Handles the loading of all content for the client pages.

	Parameters:
		page: 
			The name of the page currently set
		router:
			An object representing the router
		links:
			An object that handles all links on a page
		subjects:
			An array of all subjects in the database
		topics:
			An array of all topics in the database
		sections:
			An array of all sections in the database
		examples:
			An array of all examples in the database
		subject: 
			An object representing the current subject
		topic: 
			An object representing the current topic
		section: 
			An object representing the current section
		example:
			An object representing the current example

	*/
	exports.latex = function(page, router, links, subjects, topics, sections, examples, subject, topic, section, example) {
		var statement = "/api/",
			db_id = -1;
		if(page == "about") { statement += "cms/about/data"; }
		else if(page == "subject") { statement += "subject/data/"; db_id = subject.sid; }
		else if(page == "topic") { statement += "topic/data/"; db_id = topic.tid; }
		else if(page == "section") { statement += "section/data/"; db_id = section.section_id; }
		else if(page == "example") { statement += "example/data/"; db_id = example.eid; }
		$.post(statement, {"param": db_id}).done(function(data) {
			data.title = data.title != null ? decodeURIComponent(data.title).split("-----") : [""];
			data.content = data.content != null ? decodeURIComponent(data.content).split("-----") : [""];
			if(page == "about") {
				$("#latex").append($("<div>").attr("id", "main_message").addClass("box_message")
					.append($("<h1>").text(data.heading)));
			}
			var i = 0;
			for(; i >= 0; i++) {
				if(data.title[i] == null || data.title[i] == "") { break; }
				var cont_div = "",
					title = data.title[i].split("_")[0],
					accordion = $("<div>").addClass("accordion"),
					show_solution = $("<div>").addClass("show_solution").text(title),
					span = $("<span>").addClass("solution_display"),
					latex_body = $("<div>").addClass("latex_body");
				if(data.title[i].split("_hidden").length == 1) {
					cont_div = $("<div>").addClass("cont_div");
					span.append($("<i>").addClass("material-icons").text("remove"));
				}
				else {
					cont_div = $("<div>").addClass("cont_div hidden_div");
					span.append($("<i>").addClass("material-icons").text("add"));
				}	
				latex_body.append(data.content[i]);
				cont_div.append(latex_body);
				show_solution.append(span);
				accordion.append(show_solution);
				accordion.append(cont_div);
				$("#latex").append(accordion);
			}
			if(i == 0) {
				$("#latex").append($("<div>").addClass("accordion").append($("<div>")
					.addClass("show_solution").text("NO CONTENT HERE!")));
			}
			exports.handle_breadcrumbs(page, $(".accordion").first(), subject, topic, section, example);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main"]);
			exports.handle_button();
			exports.handle_logo_link("");
			exports.handle_logo();
			exports.handle_li_coloring();
			links.handle_links(router, subjects, topics, sections, examples);
			// functions.handle_orientation("section", navs, section, topic);
			if(page == "about") {
				exports.handle_desktop_title("about");
			}
			else if(page == "subject") {
				exports.handle_desktop_title("subject", subject);
			}
			else if(page == "topic") {
				exports.handle_desktop_title("topic", subject, topic);
			}
			else if(page == "section" || page == "example") {
				exports.handle_desktop_title("section", subject, topic, section);
			}
			
			// if(functions.is_mobile() && section.section_name == "Common_Derivatives_and_Properties") {
			// 	MathJax.Hub.Queue(function() {
			// 		functions.hide_mathjax_span();
			// 	});
			// }
		});
	};

	return exports;
});