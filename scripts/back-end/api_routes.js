var exports = {};

// Adds all of the API routes
exports.add_api_routes = (app, pool, fs) => {
	// The API methods to get all subjects, topics, sections, or examples
	app.get("/api/:objects", (request, response) => {
		var objects = request.params.objects;
		response.set('Cache-Control', 'public, max-age=864000000');
		if(objects == "subjects") {
			pool.query("SELECT sid,sname,`order` FROM subject ORDER BY `order` ASC", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(subject => {
					subject.topics = [];
					subject.clean_name = subject.sname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "topics") {
			pool.query("SELECT sid,tid,tname,`order` FROM topic", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(topic => {
					topic.sections = [];
					topic.clean_name = topic.tname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "sections") {
			pool.query("SELECT section_id,tid,section_name,`order` FROM section", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(section => {
					section.examples = [];
					section.clean_name = section.section_name.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "examples") {
			pool.query("SELECT eid,ename,section_id,`order` FROM example", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(example => {
					example.clean_name = example.ename.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else { response.send("No such object exists in the database!"); }
	});

	// The API methods to get a file corresponding to any particular subject, topic, section, or example
	app.get("/api/:want/file/:param", (request, response) => {
		var want = request.params.want,
			param = request.params.param,
			statement = "";

		response.set('Cache-Control', 'public, max-age=864000000');
		if(want == "subject") {
			statement = "SELECT sname FROM subject WHERE sid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					response.sendFile("./content/" + results[0].sname + "/" + results[0].sname + ".html", { "root": "./" });
				}
				else { response.send("Cannot find such a file!"); }
			});
		}
		else if(want == "topic") {
			statement = "SELECT sid,tname FROM topic WHERE tid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					statement = "SELECT sname FROM subject WHERE sid=" + results[0].sid;
					pool.query(statement, (err, final) => {
						if(err) { console.error("Error Connecting: " + err.stack); return; }
						if(final.length != 0) {
							response.sendFile("./content/" + final[0].sname + "/" + results[0].tname + "/" + results[0].tname + ".html", { "root": "./" });
						}
						else { response.send("Cannot find such a file!"); }
					});
				}
				else { response.send("Cannot find such a file!"); }
			});
		}
		else if(want == "section") {
			statement = "SELECT tid,section_name FROM section WHERE section_id=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					statement = "SELECT sid,tname FROM topic WHERE tid=" + results[0].tid;
					pool.query(statement, (err, next) => {
						if(err) { console.error("Error Connecting: " + err.stack); return; }
						if(next.length != 0) {
							statement = "SELECT sname FROM subject WHERE sid=" + next[0].sid;
							pool.query(statement, (err, final) => {
								if(err) { console.error("Error Connecting: " + err.stack); return; }
								if(final.length != 0) {
									response.sendFile("./content/" + final[0].sname + "/" + next[0].tname + "/" + results[0].section_name + "/" + results[0].section_name + ".html", { "root": "./" });
								}
							});
						}
						else { response.send("Cannot find such a file!"); }
					});
				}
				else { response.send("Cannot find such a file!"); }
			});
		}
		else if(want == "example") {
			statement = "SELECT section_id,ename FROM example WHERE eid=" + param;
			pool.query(statement, (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(results.length != 0) {
					statement = "SELECT tid,section_name FROM section WHERE section_id=" + results[0].section_id;
					pool.query(statement, (err, next) => {
						if(err) { console.error("Error Connecting: " + err.stack); return; }
						if(next.length != 0) {
							statement = "SELECT sid,tname FROM topic WHERE tid=" + next[0].tid;
							pool.query(statement, (err, cur) => {
								if(err) { console.error("Error Connecting: " + err.stack); return; }
								if(cur.length != 0) {
									statement = "SELECT sname FROM subject WHERE sid=" + cur[0].sid;
									pool.query(statement, (err, final) => {
										if(err) { console.error("Error Connecting: " + err.stack); return; }
										if(final.length != 0) {
											response.sendFile("./content/" + final[0].sname + "/" + cur[0].tname + "/" + next[0].section_name + "/" + results[0].ename + ".html", { "root": "./" });
										}
										else { response.send("Cannot find such a file!"); }
									});
								}
								else { response.send("Cannot find such a file!"); }
							});
						}
						else { response.send("Cannot find such a file!"); }
					});
				}
				else { response.send("Cannot find such a file!"); }
			});
		}
		else { response.send("This object whose file you want does not seem to exist in the database!"); }
	});

	// The API methods to get a specific object containing all of the information of the associated to a specific id or name
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
		param_type == "name" ? statement = "SELECT " + holder_id + " FROM " + want + " WHERE " + holder_name + "='" + param + "'" : statement = "SELECT " + holder_id + " FROM " + want + " WHERE " + holder_id + "=" + param;

		container = ["subject", "topic", "section", "example"];
		check = container.some(elem => elem == want);
		if(check) {
			pool.query(statement, (err, initial) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				if(initial.length != 0) { existence = true; }
				if(existence) {
					if(want == "subject") {
						param_type == "name" ? statement = "SELECT sid,sname,`order` FROM subject WHERE " + holder_name + "='" + param + "'" : statement = "SELECT sid,sname,`order` FROM subject WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(subject => {
								subject.topics = [];
								subject.clean_name = subject.sname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "topic") {
						param_type == "name" ? statement = "SELECT tid,sid,tname,`order` FROM topic WHERE " + holder_name + "='" + param + "'" : statement = "SELECT tid,sid,tname,`order` FROM topic WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(topic => {
								topic.sections = [];
								topic.clean_name = topic.tname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "section") {
						param_type == "name" ? statement = "SELECT section_id,tid,section_name,`order` FROM section WHERE " + holder_name + "='" + param + "'" : statement = "SELECT section_id,tid,section_name,`order` FROM section WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(section => {
								section.examples = [];
								section.clean_name = section.section_name.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
							});
							response.send(results);
						});
					}
					else if(want == "example") {
						param_type == "name" ? statement = "SELECT eid,section_id,ename,`order` FROM example WHERE " + holder_name + "='" + param + "'" : statement = "SELECT eid,section_id,ename,`order` FROM example WHERE " + holder_id + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							results.forEach(example => {
								example.clean_name = example.ename.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
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
};

module.exports = exports;