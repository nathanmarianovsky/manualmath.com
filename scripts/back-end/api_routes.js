var exports = {},
	bcrypt = require("bcryptjs");

// Adds all of the API routes
exports.add_api_routes = (app, pool) => {
	// The API methods to get all subjects, topics, sections, or examples
	app.get("/api/:objects", (request, response) => {
		var objects = request.params.objects;
		response.set('Cache-Control', 'public, max-age=864000000');
		if(objects == "subjects") {
			pool.query("SELECT sid,sname,`order`,side_approval,del_approval,cms_approval FROM subject ORDER BY `order` ASC", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(subject => {
					subject.topics = [];
					subject.clean_name = subject.sname.replace(/_/g, " ")
						.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
						.replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "topics") {
			pool.query("SELECT sid,tid,tname,`order`,side_approval,del_approval,cms_approval FROM topic", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(topic => {
					topic.sections = [];
					topic.clean_name = topic.tname.replace(/_/g, " ")
						.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
						.replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "sections") {
			pool.query("SELECT section_id,tid,section_name,`order`,side_approval,del_approval,cms_approval FROM section", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(section => {
					section.examples = [];
					section.clean_name = section.section_name.replace(/_/g, " ")
						.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
						.replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "examples") {
			pool.query("SELECT eid,ename,section_id,`order`,side_approval,del_approval,cms_approval FROM example", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(example => {
					example.clean_name = example.ename.replace(/_/g, " ")
						.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
						.replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else { response.send("No such object exists in the database!"); }
	});

	// The API methods to get the data corresponding to any particular subject, topic, section, or example
	app.get("/api/:want/data/:param", (request, response) => {
		var want = request.params.want,
			param = request.params.param,
			statement = "";
		response.set('Cache-Control', 'public, max-age=864000000');
		if(want == "subject") {
			statement = "SELECT about,notation FROM subject WHERE sid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					response.send(results[0]);
				}
				else { response.send("Cannot find an object associated with the given sid!"); }
			});
		}
		else if(want == "topic") {
			statement = "SELECT about FROM topic WHERE tid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					response.send(results[0].about);
				}
				else { response.send("Cannot find an object associated with the given tid!"); }
			});
		}
		else if(want == "section") {
			statement = "SELECT title,content FROM section WHERE section_id=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					var title_str = results[0].title,
						content_str = results[0].content,
						title_arr = title_str != null ? title_str.split("-----") : [],
						content_arr = content_str != null ? content_str.split("-----") : [];
					var obj = {};
					for(var k = 0; k < title_arr.length; k++) {
						obj["title" + k] = title_arr[k];
						obj["content" + k] = content_arr[k];
					}
					response.send(obj);
				}
				else { response.send("Cannot find an object with the given section_id!"); }
			});
		}
		else if(want == "example") {
			statement = "SELECT problem,solution FROM example WHERE eid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					response.send(results[0]);
				}
				else { response.send("Cannot find an object associated with the given eid!"); }
			});
		}
		else { response.send("This object whose file you want does not seem to exist in the database!"); }
	});

	// The API methods to get a specific object containing all of the information of the associated id or name
	app.get("/api/:want/:param_type/:param", (request, response) => {
		var want = request.params.want,
			param_type = request.params.param_type,
			param = request.params.param,
			holder_name = "",
			holder_id = "",
			statement = "",
			check = false,
			existence = false;
		response.set('Cache-Control', 'public, max-age=864000000');
		want != "section" ? holder_name = want.slice(0,1) + "name" : holder_name = "section_name";
		want != "section" ? holder_id = want.slice(0,1) + "id" : holder_id = "section_id";
		param_type == "name" ? statement = "SELECT " + holder_id + " FROM " + want + " WHERE " + holder_name + "='" + param + "'" 
			: statement = "SELECT " + holder_id + " FROM " + want + " WHERE " + holder_id + "=" + param;
		container = ["subject", "topic", "section", "example"];
		check = container.some(elem => elem == want);
		if(check) {
			pool.query(statement, (err, initial) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(initial.length != 0) { existence = true; }
				if(existence) {
					if(want == "subject") {
						param_type == "name" ? statement = "SELECT sid,sname,`order` FROM subject WHERE " 
							+ holder_name + "='" + param + "'" 
							: statement = "SELECT sid,sname,`order` FROM subject WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(subject => {
								subject.topics = [];
								subject.clean_name = subject.sname.replace(/_/g, " ")
									.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
									.replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "topic") {
						param_type == "name" ? statement = "SELECT tid,sid,tname,`order` FROM topic WHERE " 
							+ holder_name + "='" + param + "'" 
							: statement = "SELECT tid,sid,tname,`order` FROM topic WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(topic => {
								topic.sections = [];
								topic.clean_name = topic.tname.replace(/_/g, " ")
									.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
									.replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "section") {
						param_type == "name" ? statement = "SELECT section_id,tid,section_name,`order` FROM section WHERE " 
							+ holder_name + "='" + param + "'" 
							: statement = "SELECT section_id,tid,section_name,`order` FROM section WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(section => {
								section.examples = [];
								section.clean_name = section.section_name.replace(/_/g, " ")
									.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
									.replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "example") {
						param_type == "name" ? statement = "SELECT eid,section_id,ename,`order` FROM example WHERE " 
							+ holder_name + "='" + param + "'" 
							: statement = "SELECT eid,section_id,ename,`order` FROM example WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(example => {
								example.clean_name = example.ename.replace(/_/g, " ")
									.replace(/AND/g, "-").replace(/APOSTROPHE/g, "'")
									.replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else { response.send("The object providing the information does not seem to exist in the database!"); }
				}
				else { response.send("The object providing the information does not seem to have database entry with the same information!"); }
			});
		}
		else { response.send("The object providing the information does not seem to be a type that exists in the database!"); }
	});

	// The API method to add or change the data corresponding to any particular subject
	app.post("/api/:operation/subject/:param/:name/:order/:about/:notation/:side_approval/:cms_approval/:del_approval/:about_cms/:notation_cms", (request, response) => {
		var operation = request.params.operation
			param = request.params.param,
			name = request.params.name,
			order = request.params.order,
			about = request.params.about,
			notation = request.params.notation,
			side_approval = request.params.side_approval,
			cms_approval = request.params.cms_approval,
			del_approval = request.params.del_approval,
			about_cms = request.params.about_cms,
			notation_cms = request.params.notation_cms,
			statement = "",
			ending = "";
		if(operation == "change") {
			if(!isNaN(param)) {
				statement = "UPDATE subject SET ";
				if(name !== "undefined") {
					statement += "sname='" + name + "'";
				}
				if(order !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "`order`='" + order + "'";
				}
				if(about !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "about='" + about + "'";
				}
				if(notation !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "notation='" + notation + "'";
				}
				if(side_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					side_approval != "0" ? statement += "side_approval='" + side_approval + "'" 
						: statement += "side_approval=NULL";
				}
				if(cms_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					cms_approval != "0" ? statement += "cms_approval='" + cms_approval + "'" 
						: statement += "cms_approval=NULL";
				}
				if(del_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					del_approval != "0" ? statement += "del_approval='" + del_approval + "'" 
						: statement += "del_approval=NULL";
				}
				if(about_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "about_cms='" + about_cms + "'";
				}
				if(notation_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "notation_cms='" + notation_cms + "'";
				}
				statement += " WHERE sid=" + param;
			}
			else { response.send("The sid provided is invalid!"); }
		}
		else if(operation == "add") {
			if(!isNaN(param)) {
				statement = "INSERT INTO subject (sid,sname,`order`";
				ending = " VALUES ('" + param + "','" + name + "','" + order + "'";
				if(about !== "undefined") {
					statement += ",about";
					ending += ",'" + about + "'";
				}
				if(notation !== "undefined") {
					statement += ",notation";
					ending += ",'" + notation + "'";
				}
				if(side_approval !== "undefined") {
					statement += ",side_approval";
					if(side_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + side_approval + "'";
					}
				}
				if(cms_approval !== "undefined") {
					statement += ",cms_approval";
					if(cms_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + cms_approval + "'";
					}
				}
				if(del_approval !== "undefined") {
					statement += ",del_approval";
					if(del_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + del_approval + "'";
					}
				}
				if(about_cms !== "undefined") {
					statement += ",about_cms";
					ending += ",'" + about_cms + "'";
				}
				if(notation_cms !== "undefined") {
					statement += ",notation_cms";
					ending += ",'" + notation_cms + "'";
				}
				ending += ")";
				statement += ")" + ending;
			}
			else { response.send("The sid provided is invalid!"); }
		}
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to add or change the data corresponding to any particular topic
	app.post("/api/:operation/topic/:param/:sid/:name/:order/:about/:side_approval/:cms_approval/:del_approval/:about_cms", (request, response) => {
		var operation = request.params.operation
			param = request.params.param,
			sid = request.params.sid,
			name = request.params.name,
			order = request.params.order,
			about = request.params.about,
			side_approval = request.params.side_approval,
			cms_approval = request.params.cms_approval,
			del_approval = request.params.del_approval,
			about_cms = request.params.about_cms,
			statement = "",
			ending = "";
		if(operation == "change") {
			if(!isNaN(param)) {
				statement = "UPDATE topic SET ";
				if(sid !== "undefined") {
					statement += "sid='" + sid + "'";
				}
				if(name !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "tname='" + name + "'";
				}
				if(order !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "`order`='" + order + "'";
				}
				if(about !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "about='" + about + "'";
				}
				if(side_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					side_approval != "0" ? statement += "side_approval='" + side_approval + "'" 
						: statement += "side_approval=NULL";
				}
				if(cms_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					cms_approval != "0" ? statement += "cms_approval='" + cms_approval + "'" 
						: statement += "cms_approval=NULL";
				}
				if(del_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					del_approval != "0" ? statement += "del_approval='" + del_approval + "'" 
						: statement += "del_approval=NULL";
				}
				if(about_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "about_cms='" + about_cms + "'";
				}
				statement += " WHERE tid=" + param;
			}
			else { response.send("The tid provided is invalid!"); }
		}
		else if(operation == "add") {
			if(!isNaN(param)) {
				statement = "INSERT INTO topic (tid,tname,`order`,sid";
				ending = " VALUES ('" + param + "','" + name + "','" + order + "','" + sid + "'";
				if(about !== "undefined") {
					statement += ",about";
					ending += ",'" + about + "'";
				}
				if(side_approval !== "undefined") {
					statement += ",side_approval";
					if(side_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + side_approval + "'";
					}
				}
				if(cms_approval !== "undefined") {
					statement += ",cms_approval";
					if(cms_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + cms_approval + "'";
					}
				}
				if(del_approval !== "undefined") {
					statement += ",del_approval";
					if(del_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + del_approval + "'";
					}
				}
				if(about_cms !== "undefined") {
					statement += ",about_cms";
					ending += ",'" + about_cms + "'";
				}
				ending += ")";
				statement += ")" + ending;
			}
			else { response.send("The tid provided is invalid!"); }
		}
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to add or change the data corresponding to any particular section
	app.post("/api/:operation/section/:param/:tid/:name/:order/:title/:content/:side_approval/:cms_approval/:del_approval/:title_cms/:content_cms", (request, response) => {
		var operation = request.params.operation
			param = request.params.param,
			tid = request.params.tid,
			name = request.params.name,
			order = request.params.order,
			title = request.params.title,
			content = request.params.content,
			side_approval = request.params.side_approval,
			cms_approval = request.params.cms_approval,
			del_approval = request.params.del_approval,
			title_cms = request.params.title_cms,
			content_cms = request.params.content_cms,
			statement = "",
			ending = "";
		if(operation == "change") {
			if(!isNaN(param)) {
				statement = "UPDATE section SET ";
				if(tid !== "undefined") {
					statement += "tid='" + tid + "'";
				}
				if(name !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "section_name='" + name + "'";
				}
				if(order !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "`order`='" + order + "'";
				}
				if(title !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "title='" + title + "'";
				}
				if(content !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "content='" + content + "'";
				}
				if(side_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					side_approval != "0" ? statement += "side_approval='" + side_approval + "'" 
						: statement += "side_approval=NULL";
				}
				if(cms_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					cms_approval != "0" ? statement += "cms_approval='" + cms_approval + "'" 
						: statement += "cms_approval=NULL";
				}
				if(del_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					del_approval != "0" ? statement += "del_approval='" + del_approval + "'" 
						: statement += "del_approval=NULL";
				}
				if(title_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "title_cms='" + title_cms + "'";
				}
				if(content_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "content_cms='" + content_cms + "'";
				}
				statement += " WHERE section_id=" + param;
			}
			else { response.send("The section_id provided is invalid!"); }
		}
		else if(operation == "add") {
			if(!isNaN(param)) {
				statement = "INSERT INTO section (section_id,section_name,`order`,tid";
				ending = " VALUES ('" + param + "','" + name + "','" + order + "','" + tid + "'";
				if(title !== "undefined") {
					statement += ",title";
					ending += ",'" + title + "'";
				}
				if(content !== "undefined") {
					statement += ",content";
					ending += ",'" + content + "'";
				}
				if(side_approval !== "undefined") {
					statement += ",side_approval";
					if(side_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + side_approval + "'";
					}
				}
				if(cms_approval !== "undefined") {
					statement += ",cms_approval";
					if(cms_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + cms_approval + "'";
					}
				}
				if(del_approval !== "undefined") {
					statement += ",del_approval";
					if(del_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + del_approval + "'";
					}
				}
				if(title_cms !== "undefined") {
					statement += ",title_cms";
					ending += ",'" + title_cms + "'";
				}
				if(content_cms !== "undefined") {
					statement += ",content_cms";
					ending += ",'" + content_cms + "'";
				}
				ending += ")";
				statement += ")" + ending;
			}
			else { response.send("The section_id provided is invalid!"); }
		}
		console.log(statement);
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});



	// The API method to add or change the data corresponding to any particular section
	app.post("/api/:operation/example/:param/:section_id/:name/:order/:problem/:solution/:side_approval/:cms_approval/:del_approval/:problem_cms/:solution_cms", (request, response) => {
		var operation = request.params.operation
			param = request.params.param,
			section_id = request.params.section_id,
			name = request.params.name,
			order = request.params.order,
			problem = request.params.problem,
			solution = request.params.solution,
			side_approval = request.params.side_approval,
			cms_approval = request.params.cms_approval,
			del_approval = request.params.del_approval,
			problem_cms = request.params.problem_cms,
			solution_cms = request.params.solution_cms,
			statement = "",
			ending = "";
		if(operation == "change") {
			if(!isNaN(param)) {
				statement = "UPDATE example SET ";
				if(section_id !== "undefined") {
					statement += "section_id='" + section_id + "'";
				}
				if(name !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "ename='" + name + "'";
				}
				if(order !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "`order`='" + order + "'";
				}
				if(problem !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "problem='" + problem + "'";
				}
				if(solution !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "solution='" + solution + "'";
				}
				if(side_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					side_approval != "0" ? statement += "side_approval='" + side_approval + "'" 
						: statement += "side_approval=NULL";
				}
				if(cms_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					cms_approval != "0" ? statement += "cms_approval='" + cms_approval + "'" 
						: statement += "cms_approval=NULL";
				}
				if(del_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					del_approval != "0" ? statement += "del_approval='" + del_approval + "'" 
						: statement += "del_approval=NULL";
				}
				if(problem_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "problem_cms='" + problem_cms + "'";
				}
				if(solution_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") { statement += ","; }
					statement += "solution_cms='" + solution_cms + "'";
				}
				statement += " WHERE eid=" + param;
			}
			else { response.send("The eid provided is invalid!"); }
		}
		else if(operation == "add") {
			if(!isNaN(param)) {
				statement = "INSERT INTO example (eid,ename,`order`,section_id";
				ending = " VALUES ('" + param + "','" + name + "','" + order + "','" + section_id + "'";
				if(problem !== "undefined") {
					statement += ",problem";
					ending += ",'" + problem + "'";
				}
				if(solution !== "undefined") {
					statement += ",solution";
					ending += ",'" + solution + "'";
				}
				if(side_approval !== "undefined") {
					statement += ",side_approval";
					if(side_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + side_approval + "'";
					}
				}
				if(cms_approval !== "undefined") {
					statement += ",cms_approval";
					if(cms_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + cms_approval + "'";
					}
				}
				if(del_approval !== "undefined") {
					statement += ",del_approval";
					if(del_approval == "0") {
						ending += ",NULL";
					}
					else {
						ending += ",'" + del_approval + "'";
					}
				}
				if(problem_cms !== "undefined") {
					statement += ",problem_cms";
					ending += ",'" + problem_cms + "'";
				}
				if(solution_cms !== "undefined") {
					statement += ",solution_cms";
					ending += ",'" + solution_cms + "'";
				}
				ending += ")";
				statement += ")" + ending;
			}
			else { response.send("The eid provided is invalid!"); }
		}
		console.log(statement);
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});



	// // The API method to change the data corresponding to any particular example
	// app.post("/api/change/example/:param/:name/:order/:section_id/:problem/:solution", (request, response) => {
	// 	var param = request.params.param,
	// 		name = request.params.name,
	// 		order = request.params.order,
	// 		section_id = request.params.section_id,
	// 		problem = request.params.problem,
	// 		solution = request.params.solution,
	// 		statement = "";
	// 	if(!isNaN(param)) {
	// 		statement = "UPDATE example SET ";
	// 		if(name !== "undefined") {
	// 			statement += "ename='" + name + "'";
	// 		}
	// 		if(order !== "undefined") {
	// 			if(statement[statement.length-1] != " ") { statement += ","; }
	// 			statement += "`order`='" + order + "'";
	// 		}
	// 		if(section_id !== "undefined") {
	// 			if(statement[statement.length-1] != " ") { statement += ","; }
	// 			statement += "section_id='" + section_id + "'";
	// 		}
	// 		if(problem !== "undefined") {
	// 			if(statement[statement.length-1] != " ") { statement += ","; }
	// 			statement += "problem='" + problem + "'";
	// 		}
	// 		if(solution !== "undefined") {
	// 			if(statement[statement.length-1] != " ") { statement += ","; }
	// 			statement += "solution='" + solution + "'";
	// 		}
	// 		statement += " WHERE eid=" + param;
	// 	}
	// 	else { response.send("The eid provided is invalid!"); }
	// 	pool.query(statement, err => {
	// 		if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
	// 		else { response.send("1"); }
	// 	});
	// });

	// // The API method to add the data corresponding to a new example
	// app.post("/api/add/example/:param/:name/:order/:section_id/:problem/:solution", (request, response) => {
	// 	var param = request.params.param,
	// 		name = request.params.name,
	// 		order = request.params.order,
	// 		section_id = request.params.section_id,
	// 		problem = request.params.problem,
	// 		solution = request.params.solution,
	// 		statement = "";
	// 	pool.query("SELECT eid FROM example", (err, results) => {
	// 		if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
	// 		if(results.some(elem => elem.eid == param)) { response.send("0"); }
	// 		else {
	// 			pool.query("SELECT section_id FROM section", (err, container) => {
	// 				if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
	// 				if(!results.some(elem => elem.section_id == section_id)) { response.send("0"); }
	// 				else {
	// 					statement = "INSERT INTO example (eid,ename,`order`,section_id,problem,solution) VALUES ('";
	// 					if(!isNaN(param) && (name.split(" ")).length == 1 && !isNaN(order) && !isNaN(section_id) && 
	// 						problem.length > 0 && solution.length > 0) {
	// 						statement += param + "','" + name + "','" + order + "','" + section_id + 
	// 							"','" + problem + "','" + solution + "')";
	// 					}
	// 					pool.query(statement, err => {
	// 						if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
	// 						else { response.send("1"); }
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});
	// });

	// The API method to delete the data corresponding to a particular subject, topic, section, or example
	app.post("/api/delete/:obj/:param", (request, response) => {
		var	obj = request.params.obj,
			param = request.params.param,
			statement = "";
		if(!isNaN(param)) {
			if(obj == "subject") {
				pool.query("SELECT sid FROM subject", (err, results) => {
					if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
					if(results.some(elem => elem.sid == param)) { 
						statement += "DELETE FROM subject WHERE sid=" + param;
						pool.query(statement, err => {
							if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
							else { response.send("1"); }
						});
					}
					else {
						response.send("There does not exist a subject in the database with the given sid.");
					}
				});
			}
			else if(obj == "topic") {
				pool.query("SELECT tid FROM topic", (err, results) => {
					if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
					if(results.some(elem => elem.tid == param)) { 
						statement += "DELETE FROM topic WHERE tid=" + param;
						pool.query(statement, err => {
							if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
							else { response.send("1"); }
						});
					}
					else {
						response.send("There does not exist a topic in the database with the given tid.");
					}
				});
			}
			else if(obj == "section") {
				pool.query("SELECT tid FROM section", (err, results) => {
					if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
					if(results.some(elem => elem.tid == param)) { 
						statement += "DELETE FROM section WHERE section_id=" + param;
						pool.query(statement, err => {
							if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
							else { response.send("1"); }
						});
					}
					else {
						response.send("There does not exist a section in the database with the given section_id.");
					}
				});
			}
			else if(obj == "example") {
				pool.query("SELECT eid FROM example", (err, results) => {
					if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
					if(results.some(elem => elem.tid == param)) { 
						statement += "DELETE FROM example WHERE eid=" + param;
						pool.query(statement, err => {
							if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
							else { response.send("1"); }
						});
					}
					else {
						response.send("There does not exist an example in the database with the given eid.");
					}
				});
			}
		}
	});

	// The API method to add a new contributor
	app.post("/api/cms/add/:fname/:lname/:email/:passwd/:question/:answer", (request, response) => {
		var fname = request.params.fname,
			lname = request.params.lname,
			email = request.params.email,
			passwd = request.params.passwd,
			question = request.params.question,
			answer = request.params.answer,
			statement = "INSERT INTO contributors (email,first_name,last_name,password,status,question,answer) VALUES ('" 
				+ email + "','" + fname + "','" + lname + "','" + bcrypt.hashSync(passwd, 10) + "'," + 0 + "," + question 
				+ ",'" + bcrypt.hashSync(answer, 10) + "')";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to check login credentials
	app.post("/api/cms/check/:email/:passwd", (request, response) => {
		var email = request.params.email,
			passwd = request.params.passwd,
			statement = "SELECT status,password FROM contributors WHERE email='" + email + "'";
		pool.query(statement, (err, result) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { 
				if(result.length > 0) {
					if(bcrypt.compareSync(passwd, result[0].password)) {
						response.send([{email: email, password: passwd, status: result[0].status}]);
					}
					else {
						response.send(["Wrong Password"]);
					}
				}
				else {
					response.send(["Wrong Email"]);
				}
			}
		});
	});

	// The API method to check the existence of a given email
	app.post("/api/cms/check/:email", (request, response) => {
		var email = request.params.email,
			statement = "SELECT email,status FROM contributors WHERE email='" + email + "'";
		pool.query(statement, (err, content) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { 
				content.length > 0 ? response.send([{email: content[0].email, status: content[0].status}]) : response.send([]);
			}
		});
	});

	// The API method to check the answer of a security question
	app.post("/api/cms/check/security/:email/:answer", (request, response) => {
		var email = request.params.email,
			answer = request.params.answer,
			statement = "SELECT answer FROM contributors WHERE email='" + email + "'";
		pool.query(statement, (err, content) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("ERROR"); }
			else { 
				bcrypt.compareSync(answer, content[0].answer) ? response.send("1") : response.send("0");
			}
		});
	});

	// The API method to get the administrator information
	app.post("/api/cms/get/admin", (request, response) => {
		var statement = "SELECT email FROM committee WHERE status='admin'";
		pool.query(statement, (err, results) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else {
				statement = "SELECT first_name,last_name FROM contributors WHERE email='" + results[0].email + "'";
				pool.query(statement, (err, container) => {
					if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
					else {
						response.send({
							first_name: container[0].first_name, 
							last_name: container[0].last_name, 
							email: results[0].email
						});
					}
				});
			}
		});
	});

	// The API method to get the security question for a contributor
	app.post("/api/cms/get/:email", (request, response) => {
		var email = request.params.email,
			statement = "SELECT question FROM contributors WHERE email='" + email + "'";
		pool.query(statement, (err, results) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("ERROR"); }
			else {
				response.send(results[0].question.toString());
			}
		});
	});

	// The API method to change a contributor's password
	app.post("/api/cms/change/password/:email/:password", (request, response) => {
		var email = request.params.email,
			password = request.params.password,
			statement = "UPDATE contributors SET password='" + bcrypt.hashSync(password, 10) + "' WHERE email='" + email + "'";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to change a contributor's profile information
	app.post("/api/cms/change/profile/:email/:fname/:lname/:question", (request, response) => {
		var email = request.params.email,
			fname = request.params.fname,
			lname = request.params.lname,
			question = request.params.question,
			answer = request.params.answer,
			statement = "UPDATE contributors SET first_name='" + fname + "', last_name='" + 
			lname + "', question=" + question + " WHERE email='" + email + "'";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to change a contributor's profile information
	app.post("/api/cms/change/profile/:email/:fname/:lname/:question/:answer", (request, response) => {
		var email = request.params.email,
			fname = request.params.fname,
			lname = request.params.lname,
			question = request.params.question,
			answer = request.params.answer,
			statement = "UPDATE contributors SET first_name='" + fname + "', last_name='" + lname + 
			"', question=" + question + ", answer='" + bcrypt.hashSync(answer, 10) + 
			"' WHERE email='" + email + "'";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to record a contributor's live session
	app.post("/api/cms/add/live/:email", (request, response) => {
		var email = request.params.email,
			statement = "INSERT INTO `contributor-sessions` (email) VALUES ('" + email + "')";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to remove a contributor's live session
	app.post("/api/cms/remove/live/:email", (request, response) => {
		var email = request.params.email,
			statement = "DELETE FROM `contributor-sessions` WHERE email='" + email + "'";
		pool.query(statement, err => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send("1"); }
		});
	});

	// The API method to check if a contributor is live
	app.post("/api/cms/live/check/:email", (request, response) => {
		var email = request.params.email,
			statement = "SELECT email FROM `contributor-sessions` WHERE email='" + email + "'";
		pool.query(statement, (err, result) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { result.length == 1 ? response.send(result[0].email) : response.send(""); }
		});
	});

	// The API method to grab a contributor's profile information
	app.post("/api/cms/profile/:email", (request, response) => {
		var email = request.params.email,
			statement = "SELECT first_name,last_name,question FROM contributors WHERE email='" + email + "'";
		pool.query(statement, (err, result) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { 
				response.send({
					first_name: result[0].first_name, 
					last_name: result[0].last_name, 
					question: result[0].question
				}); 
			}
		});
	});

	// The API method to count the number of contributors
	app.get("/api/cms/contributors", (request, response) => {
		var statement = "SELECT email FROM contributors";
		pool.query(statement, (err, result) => {
			if(err) { console.error("Error Connecting: " + err.stack); response.send("0"); }
			else { response.send((result.length).toString()); }
		});
	});
};

module.exports = exports;