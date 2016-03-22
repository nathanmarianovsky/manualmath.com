var exports = {};

// Adds all of the API routes
exports.add_api_routes = (app, pool) => {
	// The API methods to get all subjects, topics, sections, or examples
	app.get("/api/:objects", (request, response) => {
		var objects = request.params.objects;
		if(objects == "subjects") {
			pool.query("SELECT sid,sname,`order` FROM subject ORDER BY `order` ASC", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				response.send(JSON.stringify(results));
			});
		}
		else if(objects == "topics") {
			pool.query("SELECT sid,tid,tname,`order` FROM topic", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				response.send(JSON.stringify(results));
			});
		}
		else if(objects == "sections") {
			pool.query("SELECT section_id,tid,section_name,`order` FROM section", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				response.send(JSON.stringify(results));
			});
		}
		else if(objects == "examples") {
			pool.query("SELECT eid,ename,section_id,`order` FROM example", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				response.send(JSON.stringify(results));
			});
		}
		else {
			response.send("No such object exists in the database!");
		}
	});

	// The API methods to get a result based on some given information such as the id or name
	app.get("/api/:want/:provider/:param_type/:param", (request, response) => {
		var want = request.params.want,
			provider = request.params.provider,
			param_type = request.params.param_type,
			param = request.params.param,
			holder_name = "",
			holder_id = "",
			statement = "",
			initial_query = "",
			container = [],
			section_container = [],
			topic_container = [],
			subject_container = [],
			existence = false,
			check = true,
			wait = 0,
			total_wait = 0;

		provider != "section" ? holder_name = provider.slice(0,1) + "name" : holder_name = "section_name";
		provider != "section" ? holder_id = provider.slice(0,1) + "id" : holder_id = "section_id";
		param_type == "name" ? initial_query = "SELECT " + holder_id + " FROM " + provider + " WHERE " + holder_name + "='" + param + "'" : initial_query = "SELECT " + holder_id + " FROM " + provider + " WHERE " + holder_id + "=" + param;

		pool.query(initial_query, (err, results) => {
			if(err) { console.error("Error Connecting: " + err.stack); return; }
			if(results.length != 0) { existence = true; }
			if(existence) {
				if(want == provider) {
					if(provider == "subject") {
						statement = "SELECT sid,sname,`order` FROM subject WHERE " + holder + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							response.send(JSON.stringify(results));
						});
					}
					else if(provider == "topic") {
						statement = "SELECT tid,sid,tname,`order` FROM topic WHERE " + holder + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							response.send(JSON.stringify(results));
						});
					}
					else if(provider == "section") {
						statement = "SELECT section_id,tid,section_name,`order` FROM section WHERE " + holder + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							response.send(JSON.stringify(results));
						});
					}
					else if(provider == "example") {
						statement = "SELECT eid,section_id,ename,`order` FROM example WHERE " + holder + "=" + param;
						pool.query(statement, (err, results) => {
							if(err) { console.error("Error Connecting: " + err.stack); return; }
							response.send(JSON.stringify(results));
						});
					}
					else {
						response.send("The object providing the information does not seem to exist in the database!");
					}
				}
				else {
					if(want == "subject") {
						if(provider == "topic") {
							param_type == "name" ? statement = "SELECT sid FROM topic WHERE " + holder_name + "='" + param + "'" : statement = "SELECT sid FROM topic WHERE " + holder_id + "=" + param;
							pool.query(statement, (err, results) => {
								if(err) { console.error("Error Connecting: " + err.stack); return; }
								results.forEach(iter => {
									check = subject_container.some(elem => elem.tid == iter.sid);
									if(!check) { 
										subject_container.push(iter);
										statement = "SELECT DISTINCT sid,sname,`order` FROM subject WHERE sid=" + iter.sid;
										wait = results.length;
										total_wait += wait;
										pool.query(statement, (err, collection) => {
											if(err) { console.error("Error Connecting: " + err.stack); return; }
											collection.forEach(subject => {
												check = container.some(elem => elem.sid == subject.sid);
												if(!check) { container.push(subject); }
												total_wait--;
												if(total_wait == 0) { response.send(JSON.stringify(container)); }
											});
										});
									}
								});
							});
						}
						else if(provider == "section") {
							param_type == "name" ? statement = "SELECT tid FROM section WHERE " + holder_name + "='" + param + "'" : statement = "SELECT tid FROM section WHERE " + holder_id + "=" + param;
							pool.query(statement, (err, results) => {
								if(err) { console.error("Error Connecting: " + err.stack); return; }
								results.forEach(iter => {
									check = topic_container.some(elem => elem.tid == iter.tid);
									if(!check) { 
										topic_container.push(iter);
										statement = "SELECT DISTINCT sid FROM topic WHERE tid=" + iter.tid;
										pool.query(statement, (err, collection) => {
											if(err) { console.error("Error Connecting: " + err.stack); return; }
											collection.forEach(iterat => {
												check = subject_container.some(elem => elem.sid == iterat.sid);
												if(!check) { 
													subject_container.push(iterat);
													statement = "SELECT DISTINCT sid,sname,`order` FROM subject WHERE sid=" + iterat.sid;
													wait = collection.length;
													total_wait += wait;
													pool.query(statement, (err, assortment) => {
														if(err) { console.error("Error Connecting: " + err.stack); return; }
														assortment.forEach(subject => {
															check = container.some(elem => elem.sid == subject.sid);
															if(!check) { container.push(subject); }
															total_wait--;
															if(total_wait == 0) { response.send(JSON.stringify(container)); }
														});
													});
												}
											});
										});
									}
								});
							});
						}
						else if(provider == "example") {
							param_type == "name" ? statement = "SELECT section_id FROM example WHERE " + holder_name + "='" + param + "'" : statement = "SELECT section_id FROM example WHERE " + holder_id + "=" + param;
							pool.query(statement, (err, results) => {
								if(err) { console.error("Error Connecting: " + err.stack); return; }
								results.forEach(iter => {
									check = section_container.some(elem => elem.section_id == iter.section_id);
									if(!check) { 
										section_container.push(iter);
										statement = "SELECT DISTINCT tid FROM section WHERE section_id=" + iter.section_id;
										pool.query(statement, (err, collection) => {
											if(err) { console.error("Error Connecting: " + err.stack); return; }
											collection.forEach(iterat => {
												check = topic_container.some(elem => elem.tid == iterat.tid);
												if(!check) { 
													topic_container.push(iterat);
													statement = "SELECT DISTINCT sid FROM topic WHERE tid=" + iterat.tid;
													pool.query(statement, (err, assortment) => {
														if(err) { console.error("Error Connecting: " + err.stack); return; }
														assortment.forEach(iterator => {
															check = subject_container.some(elem => elem.sid == iterator.sid);
															if(!check) { 
																subject_container.push(iterator);
																statement = "SELECT DISTINCT sid,sname,`order` FROM subject WHERE sid=" + iterator.sid;
																wait = assortment.length;
																total_wait += wait;
																pool.query(statement, (err, everything) => {
																	if(err) { console.error("Error Connecting: " + err.stack); return; }
																	everything.forEach(subject => {
																		check = container.some(elem => elem.sid == subject.sid);
																		if(!check) { container.push(subject); }
																		total_wait--;
																		if(total_wait == 0) { response.send(JSON.stringify(container)); }
																	});
																});
															}
														});
													});
												}
											});
										});
									}
								});
							});
						}
						else {
							response.send("The object providing the information does not seem to exist in the database!");
						}
					}
					else if(want == "topic") {

					}
					else if(want == "section") {

					}
					else if(want == "example") {

					}
					else {
						response.send("The object you want does not seem to exist in the database!");
					}
				}
			}
			else {
				response.send("The object providing the information does not seem to have database entry with the same information!");
			}
		});
	});
};

module.exports = exports;