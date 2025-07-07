var exports = {},
	bcrypt = require("bcryptjs");

// Escape all special characters
exports.cleanName = str => {
	return str
		.replace(/x20/g, " ")
		.replace(/x21/g, "!")
		.replace(/x22/g, "\"")
		.replace(/x23/g, "#")
		.replace(/x24/g, "$")
		.replace(/x25/g, "%")
		.replace(/x26/g, "&")
		.replace(/x27/g, "'")
		.replace(/x28/g, "(")
		.replace(/x29/g, ")")
		.replace(/x2A/g, "*")
		.replace(/x2B/g, "+")
		.replace(/x2C/g, ",")
		.replace(/x2D/g, "-")
		.replace(/x2E/g, ".")
		.replace(/x2F/g, "/")
		.replace(/x3A/g, ":")
		.replace(/x3B/g, ";")
		.replace(/x3C/g, "<")
		.replace(/x3D/g, "=")
		.replace(/x3E/g, ">")
		.replace(/x3F/g, "?")
		.replace(/x40/g, "@")
		.replace(/x5B/g, "[")
		.replace(/x5C/g, "\\")
		.replace(/x5D/g, "]")
		.replace(/x5E/g, "^")
		.replace(/x5F/g, "_")
		.replace(/x7B/g, "{")
		.replace(/x7C/g, "|")
		.replace(/x7D/g, "}");
};

// Adds all of the API routes
exports.add_api_routes = (app, pool) => {
	/*
		The API method to get the content of the landing page
		for the client side
	*/
	app.post("/api/about/client", (request, response) => {
		pool.query("SELECT heading,title,content" +
			" FROM about", (err, result) => {
			if(err) {
				console.error("Error Connecting: " + err.stack);
				response.send("0");
			}
			else {
				if(result.length == 0) {
					response.send("0");
				}
				else {
					var heading_str = result[0].heading != null 
							? result[0].heading : "",
						title_str = result[0].title != null 
							? result[0].title : "",
						content_str = result[0].content != null 
							? new Buffer(result[0].content,
								"binary").toString() : "";
					response.send({
						heading: heading_str,
						title: title_str,
						content: content_str
					});
				}
			}
		});
	});

	/*
		The API method to get and change the log of any
		subject, topic, section, or example
	*/
	app.post("/api/log/:operation/:object", (request, response) => {
		var object = request.params.object,
			operation = request.params.operation,
			id = request.body.id,
			log = request.body.log,
			statement = "";
		if(operation == "want" || operation == "change") {
			if(operation == "want") {
				statement = "SELECT log FROM ";
				if(object == "about" || object == "subject" ||
					object == "topic" || object == "section" ||
					object == "example") {
					if(object == "about") {
						statement += "about WHERE about.id=0";
					}
					else if(object == "subject") {
						statement += "subject WHERE subject.sid=" + id;
					}
					else if(object == "topic") {
						statement += "topic WHERE topic.tid=" + id;
					}
					else if(object == "section") {
						statement += "section WHERE section.section_id=" + id;
					}
					else if(object == "example") {
						statement += "example WHERE example.eid=" + id;
					}
					pool.query(statement, (err, result) => {
						if(err) {
							console.error("Error Connecting: " +
								err.stack);
							response.send("0");
						}
						else {
							response.send(result[0].log);
						}
					});
				}
				else {
					response.send("No such API request exists!");
				}
			}
			else {
				statement = "UPDATE ";
				if(object == "about" || object == "subject" ||
					object == "topic" || object == "section" ||
					object == "example") {
					if(object == "about") {
						statement += "about SET log='" +
							log + "' WHERE about.id=0";
					}
					else if(object == "subject") {
						statement += "subject SET log='" +
							log + "' WHERE subject.sid=" + id;
					}
					else if(object == "topic") {
						statement += "topic SET log='" +
							log + "' WHERE topic.tid=" + id;
					}
					else if(object == "section") {
						statement += "section SET log='" +
							log + "' WHERE section.section_id=" + id;
					}
					else if(object == "example") {
						statement += "example SET log='" +
							log + "' WHERE example.eid=" + id;
					}
					pool.query(statement, (err, result) => {
						if(err) {
							console.error("Error Connecting: " +
								err.stack);
							response.send("0");
						}
						else {
							response.send("1");
						}
					});
				}
				else {
					response.send("No such API request exists!");
				}
			}
		}
		else {
			response.send("No such API request exists!");
		}
	});
	
	/*
		The API methods to get the data corresponding to
		any particular subject, topic, section, or example
	*/
	app.post("/api/:want/data/:side", (request, response) => {
		var want = request.params.want,
			side = request.params.side,
			param = request.body.param,
			statement = "";
		// response.set("Cache-Control", "public, max-age=864000000");
		if(side == "client" || side == "cms") {
			side == "cms" ? statement = "SELECT title,content" +
				",title_cms,content_cms,cms_approval FROM "
				: statement = "SELECT title,content FROM ";
			if(want == "subject") {
				statement += "subject WHERE subject.sid=";
			}
			else if(want == "topic") {
				statement += "topic WHERE topic.tid=";
			}
			else if(want == "section") {
				statement += "section WHERE section.section_id=";
			}
			else if(want == "example") {
				statement += "example WHERE example.eid=";
			}
			if(want == "subject" || want == "topic"
				|| want == "section" || want == "example") {
				statement += param;
				pool.query(statement, (err, results) => {
					if(err) { console.error("Error Connecting: " +
						err.stack); response.send("0"); }
					if(results.length != 0) {
						var title_str = results[0].title != null
								? results[0].title : "",
							content_str = results[0].content != null
								? new Buffer(results[0].content,
									"binary").toString() : "";
						if(side != "client") {
							var title_str_cms = results[0].title_cms != null
									? results[0].title_cms : "",
								content_str_cms = results[0].content_cms != null
									? new Buffer(results[0].content_cms,
										"binary").toString() : "";
						}
						var obj = {
							title: title_str,
							content: content_str
						};
						if(side != "client") {
							obj.title_cms = title_str_cms;
							obj.content_cms = content_str_cms;
							obj.cms_approval =
								results[0].cms_approval;
						}
						response.send(obj);
					}
					else {
						response.send("Cannot find an object" +
							" with the given id!");
					}
				});
			}
			else {
				response.send("This object whose data you" +
					" want does not seem to exist in the database!");
			}
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API method to delete the data corresponding to
		a particular subject, topic, section, or example
	*/
	app.post("/api/delete/:obj", (request, response) => {
		var	obj = request.params.obj,
			param = request.body.param,
			topicStatement = "",
			sectionStatement = "",
			exampleStatement = "";
		if(obj == "subject" || obj == "topic"
			|| obj == "section" || obj == "example") {
			if(!isNaN(param)) {
				if(obj == "subject") {
					pool.query("SELECT sid FROM subject",
						(err, results) => {
						if(err) {
							console.error("Error Connecting: " +
								err.stack);
							response.send("0");
						}
						if(results.some(elem => elem.sid == param)) { 
							pool.query("SELECT tid FROM topic WHERE topic.sid="
								+ param, (err, container) => {
								if(err) {
									console.error("Error Connecting: " +
										err.stack);
									response.send("0");
								}
								else {
									if(container.length != 0) {
										topicStatement = "DELETE FROM topic WHERE topic.tid IN (";
										container.forEach((iter, iterIndex) => {
											iterIndex == container.length - 1
												? topicStatement += iter.tid + ")"
												: topicStatement += iter.tid + ",";
											pool.query("SELECT section_id FROM section WHERE section.tid="
												+ iter.tid, (err, holder) => {
												if(err) {
													console.error("Error Connecting: " +
														err.stack);
													response.send("0");
												}
												else {
													if(holder.length != 0) {
														if(sectionStatement == "") {
															sectionStatement = "DELETE FROM" +
																" section WHERE section.section_id IN (";
														}
														holder.forEach((elem, elemIndex) => {
															if(elemIndex == holder.length - 1) {
																sectionStatement +=
																	elem.section_id;
															}
															else {
																var last = sectionStatement[sectionStatement.length - 1];
																if(last != "," && last != "(") {
																	sectionStatement += ",";
																}
																sectionStatement +=
																	elem.section_id + ",";
															}
															pool.query("SELECT eid FROM example WHERE example.section_id="
																+ elem.section_id, (err, collection) => {
																if(err) {
																	console.error("Error Connecting: " +
																		err.stack);
																	response.send("0");
																}
																else {
																	if(collection.length != 0) {
																		if(exampleStatement == "") {
																			exampleStatement = "DELETE " +
																				"FROM example WHERE example.eid IN (";
																		}
																		collection.forEach((item, pos) => {
																			if(pos == collection.length - 1) {
																				exampleStatement +=
																					item.eid;
																			}
																			else {
																				var char = exampleStatement[exampleStatement.length - 1];
																				if(char != "," && char != "(") {
																					exampleStatement += ",";
																				}
																				exampleStatement +=
																					item.eid + ",";
																			}
																		});

																		if(elemIndex >= holder.length - 1 
																			&& iterIndex >= container.length - 1) {
																			exampleStatement += ")";
																			pool.query(exampleStatement, err => {
																				if(err) { 
																					console.error("Error Connecting: " +
																						err.stack);
																					response.send("0");
																				}
																				else {
																					sectionStatement += ")";
																					pool.query(sectionStatement, err => {
																						if(err) { 
																							console.error("Error Connecting: " +
																								err.stack);
																							response.send("0");
																						}
																						else {
																							pool.query(topicStatement, err => {
																								if(err) { 
																									console.error("Error Connecting: " +
																										err.stack);
																									response.send("0");
																								}
																								else {
																									pool.query("DELETE FROM subject WHERE subject.sid="
																										+ param, err => {
																										if(err) {
																											console.error("Error Connecting: " +
																												err.stack);
																											response.send("0");
																										}
																										else {
																											response.send("1");
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
																	else {
																		if(elemIndex >= holder.length - 1 
																			&& iterIndex >= container.length - 1) {
																			if(exampleStatement != "") {
																				exampleStatement += ")";
																				pool.query(exampleStatement, err => {
																					if(err) {
																						console.error("Error Connecting: " +
																							err.stack);
																						response.send("0");
																					}
																					else {
																						sectionStatement += ")";
																						pool.query(sectionStatement, err => {
																							if(err) {
																								console.error("Error Connecting: " +
																									err.stack);
																								response.send("0");
																							}
																							else {
																								pool.query(topicStatement, err => {
																									if(err) {
																										console.error(
																											"Error Connecting: " +
																											err.stack);
																										response.send("0");
																									}
																									else {
																										pool.query("DELETE FROM" +
																											" subject WHERE subject.sid=" +
																											param, err => {
																											if(err) { 
																												console.error(
																													"Error Connecting: " +
																													err.stack);
																												response.send("0");
																											}
																											else {
																												response.send("1");
																											}
																										});
																									}
																								});
																							}
																						});
																					}
																				});
																			}
																			else {
																				sectionStatement += ")";
																				pool.query(sectionStatement, err => {
																					if(err) {
																						console.error(
																							"Error Connecting: " +
																							err.stack);
																						response.send("0");
																					}
																					else {
																						pool.query(topicStatement, err => {
																							if(err) {
																								console.error(
																									"Error Connecting: " +
																									err.stack);
																								response.send("0");
																							}
																							else {
																								pool.query("DELETE FROM subject" +
																									" WHERE subject.sid=" + param, err => {
																									if(err) { 
																										console.error(
																											"Error Connecting: " +
																											err.stack);
																										response.send("0");
																									}
																									else {
																										response.send("1");
																									}
																								});
																							}
																						});
																					}
																				});
																			}
																		}
																	}
																}
															});
														});
													}
													else {
														if(iterIndex >= container.length - 1) {
															if(exampleStatement != "") {
																exampleStatement += ")";
																pool.query(exampleStatement, err => {
																	if(err) {
																		console.error("Error Connecting: " +
																			err.stack);
																		response.send("0");
																	}
																	else {
																		sectionStatement += ")";
																		pool.query(sectionStatement, err => {
																			if(err) {
																				console.error("Error Connecting: " +
																					err.stack);
																				response.send("0");
																			}
																			else {
																				pool.query(topicStatement, err => {
																					if(err) {
																						console.error(
																							"Error Connecting: " +
																							err.stack);
																						response.send("0");
																					}
																					else {
																						pool.query("DELETE FROM subject" +
																							" WHERE subject.sid=" + param, err => {
																							if(err) { 
																								console.error(
																									"Error Connecting: " +
																									err.stack);
																								response.send("0");
																							}
																							else {
																								response.send("1");
																							}
																						});
																					}
																				});
																			}
																		});
																	}
																});
															}
															else {
																if(sectionStatement != "") {
																	sectionStatement += ")";
																	pool.query(sectionStatement, err => {
																		if(err) {
																			console.error(
																				"Error Connecting: " +
																				err.stack);
																			response.send("0");
																		}
																		else {
																			pool.query(topicStatement, err => {
																				if(err) {
																					console.error(
																						"Error Connecting: " +
																						err.stack);
																					response.send("0");
																				}
																				else {
																					pool.query("DELETE FROM subject" +
																						" WHERE subject.sid=" + param, err => {
																						if(err) { 
																							console.error(
																								"Error Connecting: " +
																								err.stack);
																							response.send("0");
																						}
																						else {
																							response.send("1");
																						}
																					});
																				}
																			});
																		}
																	});
																}
																else {
																	pool.query(topicStatement, err => {
																		if(err) {
																			console.error("Error Connecting: " +
																				err.stack);
																			response.send("0");
																		}
																		else {
																			pool.query("DELETE FROM subject WHERE subject.sid=" +
																				param, err => {
																				if(err) { 
																					console.error("Error Connecting: " +
																						err.stack);
																					response.send("0");
																				}
																				else {
																					response.send("1");
																				}
																			});
																		}
																	});
																}
															}
														}
													}
												}
											});
										});
									}
									else {
										pool.query("DELETE FROM subject WHERE subject.sid=" + param, err => {
											if(err) {
												console.error("Error Connecting: " + err.stack);
												response.send("0");
											}
											else { response.send("1"); }
										});
									}
								}
							});
						}
						else {
							response.send("There does not exist a subject in the database with" +
								" the given sid!");
						}
					});
				}
				else if(obj == "topic") {
					pool.query("SELECT tid FROM topic", (err, results) => {
						if(err) {
							console.error("Error Connecting: " +
								err.stack);
							response.send("0");
						}
						if(results.some(elem => elem.tid == param)) {
							pool.query("SELECT section_id FROM section WHERE section.tid=" +
								param, (err, container) => {
								if(err) {
									console.error("Error Connecting: " +
										err.stack);
									response.send("0");
								}
								else {
									if(container.length != 0) {
										sectionStatement = "DELETE FROM section" +
											" WHERE section.section_id IN (";
										container.forEach((iter, iterIndex) => {
											iterIndex == container.length - 1
												? sectionStatement += iter.section_id + ")"
												: sectionStatement += iter.section_id + ",";
											pool.query("SELECT eid FROM example WHERE example.section_id=" +
												iter.section_id, (err, holder) => {
												if(err) {
													console.error("Error Connecting: " +
														err.stack);
													response.send("0");
												}
												else {
													if(holder.length != 0) {
														if(exampleStatement == "") {
															exampleStatement = "DELETE FROM" +
																" example WHERE example.eid IN (";
														}
														holder.forEach((elem, pos) => {
															if(pos == holder.length - 1) {
																exampleStatement +=
																	elem.eid;
															}
															else {
																var char = exampleStatement[exampleStatement.length - 1];
																if(char != "," && char != "(") {
																	exampleStatement += ",";
																}
																exampleStatement +=
																	elem.eid + ",";
															}
														});
														if(iterIndex >= container.length - 1) {
															exampleStatement += ")";
															pool.query(exampleStatement, err => {
																if(err) {
																	console.error(
																		"Error Connecting: " +
																		err.stack);
																	response.send("0");
																}
																else {
																	pool.query(sectionStatement, err => {
																		if(err) {
																			console.error(
																				"Error Connecting: " +
																				err.stack);
																			response.send("0");
																		}
																		else {
																			pool.query("DELETE FROM topic WHERE topic.tid=" +
																				param, err => {
																				if(err) {
																					console.error(
																						"Error Connecting: " +
																						err.stack);
																					response.send("0");
																				}
																				else {
																					response.send("1");
																				}
																			});
																		}
																	});
																}
															});
														}
													}
													else {
														if(iterIndex >= container.length - 1) {
															if(exampleStatement != "") {
																exampleStatement += ")";
																pool.query(exampleStatement, err => {
																	if(err) {
																		console.error(
																			"Error Connecting: " +
																			err.stack);
																		response.send("0");
																	}
																	else {
																		pool.query(sectionStatement, err => {
																			if(err) {
																				console.error(
																					"Error Connecting: " +
																					err.stack);
																				response.send("0");
																			}
																			else {
																				pool.query("DELETE FROM topic WHERE topic.tid=" +
																					param, err => {
																					if(err) {
																						console.error(
																							"Error Connecting: " +
																							err.stack);
																						response.send("0");
																					}
																					else {
																						response.send("1");
																					}
																				});
																			}
																		});
																	}
																});
															}
															else {
																pool.query(sectionStatement, err => {
																	if(err) {
																		console.error("Error Connecting: " +
																			err.stack);
																		response.send("0");
																	}
																	else {
																		pool.query("DELETE FROM topic WHERE topic.tid=" +
																			param, err => {
																			if(err) {
																				console.error("Error Connecting: " +
																					err.stack);
																				response.send("0");
																			}
																			else {
																				response.send("1");
																			}
																		});
																	}
																});
															}
														}
													}
												}
											});
										});
									}
									else {
										pool.query("DELETE FROM topic WHERE topic.tid=" + param, err => {
											if(err) {
												console.error("Error Connecting: " + err.stack);
												response.send("0");
											}
											else {
												response.send("1");
											}
										});
									}
								}
							});
						}
						else {
							response.send("There does not exist a topic in the database with" +
								" the given tid!");
						}
					});
				}
				else if(obj == "section") {
					pool.query("SELECT section_id FROM section", (err, results) => {
						if(err) {
							console.error("Error Connecting: " + err.stack);
							response.send("0");
						}
						if(results.some(elem => elem.section_id == param)) { 
							pool.query("SELECT eid FROM example WHERE example.section_id=" +
								param, (err, container) => {
								if(err) {
									console.error("Error Connecting: " +
										err.stack);
									response.send("0");
								}
								else {
									if(container.length != 0) {
										exampleStatement = "DELETE FROM" +
											" example WHERE example.eid IN (";
										container.forEach((iter, iterIndex) => {
											iterIndex == container.length - 1
												? exampleStatement += iter.eid + ")"
												: exampleStatement += iter.eid + ",";
										});
										pool.query(exampleStatement, err => {
											if(err) {
												console.error("Error Connecting: " +
													err.stack);
												response.send("0");
											}
											else {
												pool.query("DELETE FROM section WHERE section.section_id=" +
													param, err => {
													if(err) {
														console.error("Error Connecting: " +
															err.stack);
														response.send("0");
													}
													else {
														response.send("1");
													}
												});
											}
										});
									}
									else {
										pool.query("DELETE FROM section WHERE section.section_id=" +
											param, err => {
											if(err) {
												console.error("Error Connecting: " +
													err.stack);
												response.send("0");
											}
											else {
												response.send("1");
											}
										});
									}
								}
							});
						}
						else {
							response.send("There does not exist a section in the" +
								" database with the given section_id!");
						}
					});
				}
				else if(obj == "example") {
					pool.query("SELECT eid FROM example", (err, results) => {
						if(err) {
							console.error("Error Connecting: " +
								err.stack);
							response.send("0");
						}
						if(results.some(elem => elem.eid == param)) { 
							pool.query("DELETE FROM example WHERE example.eid=" +
								param, err => {
								if(err) {
									console.error("Error Connecting: " +
										err.stack);
									response.send("0");
								}
								else {
									response.send("1");
								}
							});
						}
						else {
							response.send("There does not exist an" +
								" example in the database with the given eid!");
						}
					});
				}
			}
			else { response.send("The parameter has to be a positive integer."); }
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API method to add or change the data corresponding
		to any particular subject, topic, section, or example
	*/
	app.post("/api/:operation/:type", (request, response) => {
		var operation = request.params.operation
			type = request.params.type,
			param = request.body.param,
			ref = request.body.ref,
			name = request.body.name,
			order = request.body.order,
			title = request.body.title,
			content = request.body.content,
			side_approval = request.body.side_approval,
			cms_approval = request.body.cms_approval,
			del_approval = request.body.del_approval,
			title_cms = request.body.title_cms,
			content_cms = request.body.content_cms,
			status = request.body.status,
			statement = "",
			ending = "";
		if(operation == "change" || operation == "add") {
			if(operation == "change") {
				if(!isNaN(param)) {
					statement = "UPDATE " 
					if(type == "subject") {
						statement += "subject SET ";
					}
					else if(type == "topic") {
						statement += "topic SET ";
					}
					else if(type == "section") {
						statement += "section SET ";
					}
					else if(type == "example") {
						statement += "example SET ";
					}
					if(ref !== "undefined") {
						if(type == "topic") {
							statement += "sid='";
						}
						else if(type == "section") {
							statement += "tid='";
						}
						else if(type == "example") {
							statement += "section_id='";
						}
						statement += ref + "'";
					}
					if(name !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						if(type == "subject") {
							statement += "sname='";
						}
						else if(type == "topic") {
							statement += "tname='";
						}
						else if(type == "section") {
							statement += "section_name='";
						}
						else if(type == "example") {
							statement += "ename='";
						}
						statement += name + "'";
					}
					if(order !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						statement += "`order`='" + order + "'";
					}
					if(status !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						statement += "status=" + status;
					}
					if(title !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						title != "0"
							? statement += "title='" + title + "'" 
							: statement += "title=NULL";
					}
					if(content !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						content != "0"
							? statement += "content='" + content + "'" 
							: statement += "content=NULL";
					}
					if(side_approval !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						side_approval != "0"
							? statement += "side_approval='" + side_approval + "'" 
							: statement += "side_approval=NULL";
					}
					if(cms_approval !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						cms_approval != "0"
							? statement += "cms_approval='" + cms_approval + "'" 
							: statement += "cms_approval=NULL";
					}
					if(del_approval !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						del_approval != "0"
							? statement += "del_approval='" + del_approval + "'" 
							: statement += "del_approval=NULL";
					}
					if(title_cms !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						title_cms != "0"
							? statement += "title_cms='" + title_cms + "'" 
							: statement += "title_cms=NULL";
					}
					if(content_cms !== "undefined") {
						if(statement[statement.length - 1] != " ") {
							statement += ",";
						}
						content_cms != "0"
							? statement += "content_cms='" + content_cms + "'" 
							: statement += "content_cms=NULL";
					}
					if(type == "subject") {
						statement += " WHERE subject.sid=" + param;
					}
					else if(type == "topic") {
						statement += " WHERE topic.tid=" + param;
					}
					else if(type == "section") {
						statement += " WHERE section.section_id=" + param;
					}
					else if(type == "example") {
						statement += " WHERE example.eid=" + param;
					}
				}
				else { response.send("The section_id provided is invalid!"); }
			}
			else if(operation == "add") {
				if(!isNaN(param)) {
					statement = "INSERT INTO " 
					if(type == "subject") {
						statement += "subject (sid,sname,`order`";
					}
					else if(type == "topic") {
						statement += "topic (tid,sid,tname,`order`";
					}
					else if(type == "section") {
						statement += "section (section_id,tid,section_name,`order`";
					}
					else if(type == "example") {
						statement += "example (eid,section_id,ename,`order`";
					}
					if(type == "subject") {
						ending = " VALUES ('" + param +
							"','" + name + "','" +
							order + "'";
					}
					else {
						ending = " VALUES ('" + param +
							"','" + ref + "','" + name +
							"','" + order + "'";
					}
					if(title !== "undefined") {
						statement += ",title";
						ending += ",'" + title + "'";
					}
					if(content !== "undefined") {
						statement += ",content";
						ending += ",'" + content + "'";
					}
					if(status !== "undefined") {
						statement += ",status";
						ending += "," + status;
					}
					if(side_approval !== "undefined") {
						statement += ",side_approval";
						if(side_approval == "0") {
							ending += ",NULL";
						}
						else {
							ending += ",'" +
								side_approval + "'";
						}
					}
					if(cms_approval !== "undefined") {
						statement += ",cms_approval";
						if(cms_approval == "0") {
							ending += ",NULL";
						}
						else {
							ending += ",'" +
								cms_approval + "'";
						}
					}
					if(del_approval !== "undefined") {
						statement += ",del_approval";
						if(del_approval == "0") {
							ending += ",NULL";
						}
						else {
							ending += ",'" +
								del_approval + "'";
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
				else { response.send("The id provided is invalid!"); }
			}
			pool.query(statement, err => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					response.send("0");
				}
				else {
					response.send("1");
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API methods to check the existence of
		a given email and check login credentials
	*/
	app.post("/api/cms/check/:param", (request, response) => {
		var param = request.params.param,
			email = request.body.email,
			statement = "";
		if(param == "login" || param == "email") {
			if(param == "login") {
				statement = "SELECT status," +
					"password FROM contributors" +
					" WHERE contributors.email='" + email + "'";
			}
			else if(param == "email") {
				statement = "SELECT email,status" +
					" FROM contributors WHERE" +
					" contributors.email='" + email + "'";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					if(param == "login") {
						var passwd = request.body.passwd;
						if(result.length > 0) {
							if(bcrypt.compareSync(passwd,
								result[0].password)) {
								response.send([{
									email: email,
									password: passwd,
									status: result[0].status
								}]);
							}
							else {
								response.send(["Wrong Password"]);
							}
						}
						else {
							response.send(["Wrong Email"]);
						}
					}
					else if(param == "email") {
						result.length > 0
							? response.send([{
								email: result[0].email,
								status: result[0].status
							}])
							: response.send([]);
					}
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API method to check the answer of
		a security question
	*/
	app.post("/api/cms/contributor/check/security", (request, response) => {
		var email = request.body.email,
			answer = request.body.answer,
			statement = "SELECT answer FROM" +
				" contributors WHERE contributors.email='" +
				email + "'";
		pool.query(statement, (err, content) => {
			if(err) {
				console.error("Error Connecting: " +
					err.stack);
				response.send("0");
			}
			else { 
				bcrypt.compareSync(answer, content[0].answer)
					? response.send("1")
					: response.send("0");
			}
		});
	});

	/*
		The API methods to change a contributor's
		profile information, password,
		status, approval, and rank approval
	*/ 
	app.post("/api/cms/contributor/change/:param", (request, response) => {
		var param = request.params.param,
			email = request.body.email,
			statement = "";
		if(param == "profile" || param == "password" || param == "status"
			|| param == "approval" || param == "rankApproval") {
			if(param == "profile") {
				var fname = request.body.fname,
					lname = request.body.lname,
					question = request.body.question,
					answer = request.body.answer;
				statement = "UPDATE contributors SET first_name='" +
					fname + "', last_name='" + lname + "', question=" +
					question;  
				if(answer !== "" && answer !== undefined) {
					statement += ", answer='" +
						bcrypt.hashSync(answer, 10) + "'";
				}
				statement += " WHERE contributors.email='"+ email + "'";
			}
			else if(param == "password") {
				var password = request.body.password;
				statement = "UPDATE contributors" +
					" SET password='" + bcrypt.hashSync(password, 10) +
					"' WHERE contributors.email='" + email + "'";
			}
			else if(param == "status") {
				var value = request.body.status;
				statement = "UPDATE contributors SET status=" +
					value + " WHERE contributors.email='" + email + "'";
			}
			else if(param == "approval") {
				var approval = request.body.approval,
					del = request.body.del;
				statement = "UPDATE contributors SET approval=";
				approval == "0" ? statement += "NULL, del="
					: statement += "'" + approval + "', del=";
				del == "0" ? statement += "NULL "
					: statement += "'" + del + "' ";
				statement += "WHERE contributors.email='" + email + "'";
			}
			else if(param == "rankApproval") {
				var rank_approval = request.body.rank_approval,
					rank_disapproval = request.body.rank_disapproval;
				statement = "UPDATE contributors SET rank_approval=";
				rank_approval == "0"
					? statement += "NULL, rank_disapproval=" 
					: statement += "'" + rank_approval +
						"', rank_disapproval=";
				rank_disapproval == "0" ? statement += "NULL " 
					: statement += "'" + rank_disapproval + "' ";
				statement += "WHERE contributors.email='" + email + "'";
			}
			pool.query(statement, err => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					response.send("0");
				}
				else {
					response.send("1");
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API methods to remove a contributor,
		add a contributor, grab a contributor's profile,
		and grab a contributor's security question
	*/
	app.post("/api/cms/contributor/:param", (request, response) => {
		var param = request.params.param,
			email = request.body.email,
			statement = "";
		if(param == "add" || param == "remove" ||
			param == "profile" || param == "security") {
			if(param == "add") {
				var fname = request.body.fname,
					lname = request.body.lname,
					passwd = request.body.passwd,
					question = request.body.question,
					answer = request.body.answer;
				statement = "INSERT INTO contributors" +
				" (email,first_name,last_name,password,status" +
				",question,answer,rank) VALUES ('" +
				email + "','" + fname + "','" + lname + "','" +
				bcrypt.hashSync(passwd, 10) + "'," + 0 + "," +
				question + ",'" + bcrypt.hashSync(answer, 10) +
				"','contributor')";
			}
			else if(param == "remove") {
				statement = "DELETE FROM contributors WHERE" +
					" contributors.email='" + email + "'";
			}
			else if(param == "profile") {
				statement = "SELECT first_name,last_name," +
					"question FROM contributors WHERE contributors.email='" +
					email + "'";
			}
			else if(param == "security") {
				statement = "SELECT question FROM contributors" +
					" WHERE contributors.email='" + email + "'";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " + err.stack);
					response.send("0");
				}
				else {
					if(param == "add" || param == "remove") {
						response.send("1");
					}
					else if(param == "profile") {
						response.send({
							first_name: result[0].first_name, 
							last_name: result[0].last_name, 
							question: result[0].question
						}); 
					}
					else if(param == "security") {
						response.send(result[0].question
							.toString());
					}
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API methods to record a contributor's session,
		remove a contributor's session, and check if a
		contributor is live
	*/
	app.post("/api/cms/live/:param", (request, response) => {
		var param = request.params.param,
			email = request.body.email,
			statement = "";
		if(param == "check" || param == "add"
			|| param == "remove") {
			if(param == "check") {
				statement = "SELECT email FROM" +
					" `contributor-sessions` WHERE" +
					" `contributor-sessions`.email='" + email + "'";
			}
			else if(param == "add") {
				statement = "INSERT INTO" +
					" `contributor-sessions`" +
					" (email) VALUES ('" +
					email + "')";
			}
			else if(param == "remove") {
				statement = "DELETE FROM " +
					"`contributor-sessions`" +
					" WHERE `contributor-sessions`.email='" +
					email + "'";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					if(param == "check") {
						result.length == 1
							? response.send(result[0].email)
							: response.send("");
					}
					else if(param == "add"
						|| param == "remove") {
						response.send("1");
					}
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API methods to add, check, and remove a
		contributor from the committee
	*/
	app.post("/api/cms/committee/:param", (request, response) => {
		var param = request.params.param,
			email = request.body.email,
			statement = "";
		if(param == "add" || param == "check"
			|| param == "remove") {
			if(param == "add") {
				statement = "UPDATE contributors" +
					" SET rank='com-member' WHERE" +
					" contributors.email='" + email + "'";
			}
			else if(param == "check") {
				statement = "SELECT rank FROM" +
					" contributors WHERE contributors.email='" +
					email + "'";
			}
			else if(param == "remove") {
				statement = "UPDATE contributors" +
					" SET rank='contributor' WHERE" +
					" contributors.email='" + email + "'";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					if(param == "add" ||param == "remove") {
						response.send("1");
					}
					else if(param == "check") {
						if(result[0].rank == "com-member") {
							response.send("1"); 
						}
						else if(result[0].rank == "admin") {
							response.send("2");
						}
						else { response.send("0"); }
					}
				}
			});
		}
		else {
			response.send("No such API request exists!")
		}
	});

	/*
		The API methods to get the unapproved contributors,
		non-committee contributors, and  all contributors
		besides the administrator
	*/
	app.post("/api/cms/contributors/:param", (request, response) => {
		var param = request.params.param;
		if(param == "unapproved" || param == "nonmember"
			|| param == "data") {
			if(param == "unapproved") {
				statement = "SELECT email,first_name" +
					",last_name,approval,del FROM" +
					" contributors WHERE contributors.status=0";
			}
			else if(param == "nonmember") {
				statement = "SELECT email,first_name" +
					",last_name,rank_approval," +
					"rank_disapproval FROM" +
					" contributors WHERE contributors.status=1" +
					" AND contributors.rank='contributor'";
			}
			else if(param == "data") {
				statement = "SELECT email,first_name" +
					",last_name,rank,rank_approval" +
					",rank_disapproval FROM" +
					" contributors WHERE contributors.status=1" +
					" AND contributors.rank!='admin'";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					if(result.length == 0) {
						response.send([]);
					}
					else {
						var container = [];
						if(param == "unapproved") {
							result.forEach(iter => {
								container.push({
									email: iter.email,
									first_name:
										iter.first_name,
									last_name:
										iter.last_name,
									approval:
										iter.approval,
									del: iter.del,
								});
							});
							response.send(container);
						}
						else if(param == "nonmember") {
							result.forEach(iter => {
								container.push({
									email: iter.email,
									first_name:
										iter.first_name,
									last_name:
										iter.last_name,
									rank_approval:
										iter.rank_approval,
									rank_disapproval:
										iter.rank_disapproval
								});
							});
							response.send(container);
						}
						else if(param == "data") {
							result.forEach(iter => {
								container.push({
									email:
										iter.email,
									first_name:
										iter.first_name,
									last_name:
										iter.last_name,
									rank: iter.rank,
									rank_approval:
										iter.rank_approval,
									rank_disapproval:
										iter.rank_disapproval
								});
							});
							response.send(container);
						}
					}
				}
			});
		}
		else {
			response.send("No such API request exists!");
		}
	});

	/*
		The API methods to change and get the
		content of the landing page
	*/
	app.post("/api/cms/about/:param", (request, response) => {
		var param = request.params.param,
			statement = "";
		if(param == "change" || param == "data") {
			if(param == "change") {
				var	heading = request.body.heading,
					title = request.body.title,
					content = request.body.content,
					heading_cms = request.body.heading_cms,
					title_cms = request.body.title_cms,
					content_cms = request.body.content_cms,
					cms_approval = request.body.cms_approval;
				statement = "UPDATE about SET ";
				if(heading !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					heading != "0"
						? statement += "heading='" +
							heading + "'" 
						: statement += "heading=NULL";
				}
				if(title !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					title != "0"
						? statement += "title='" +
							title + "'" 
						: statement += "title=NULL";
				}
				if(content !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					content != "0"
						? statement += "content='" +
							content + "'" 
						: statement += "content=NULL";
				}
				if(cms_approval !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					cms_approval != "0"
						? statement += "cms_approval='" +
							cms_approval + "'" 
						: statement += "cms_approval=NULL";
				}
				if(heading_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ","; }
					heading_cms != "0"
						? statement += "heading_cms='" +
							heading_cms + "'" 
						: statement += "heading_cms=NULL";
				}
				if(title_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					title_cms != "0"
						? statement += "title_cms='" +
							title_cms + "'" 
						: statement += "title_cms=NULL";
				}
				if(content_cms !== "undefined") {
					if(statement[statement.length - 1] != " ") {
						statement += ",";
					}
					content_cms != "0"
						? statement += "content_cms='" +
							content_cms + "'" 
						: statement += "content_cms=NULL";
				}
			}
			else if(param == "data") {
				statement = "SELECT * FROM about";
			}
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					if(result.length == 0) {
						response.send("0");
					}
					else if(param == "change") {
						response.send("1");
					}
					else if(param == "data") {
						var heading_str = result[0].heading
								!= null ? result[0].heading : "",
							heading_str_cms = result[0].heading_cms
								!= null ? result[0].heading_cms : "",
							title_str = result[0].title != null
								? result[0].title : "",
							title_str_cms = result[0].title_cms
								!= null ? result[0].title_cms : "",
							content_str = result[0].content != null 
								? new Buffer(result[0].content,
									"binary").toString()
								: "",
							content_str_cms = result[0].content_cms
								!= null  ? new Buffer(result[0].content_cms,
									"binary").toString()
								: ""; 
						response.send({
							heading:
								heading_str,
							title:
								title_str,
							content:
								content_str,
							heading_cms:
								heading_str_cms,
							title_cms:
								title_str_cms,
							content_cms:
								content_str_cms,
							cms_approval:
								result[0].cms_approval
						});
					}
				}
			});
		}
		else {
			response.send("No such API request exists!");
		}
	});

	/*
		The API method to get the administrator
		information
	*/
	app.post("/api/cms/admin/info", (request, response) => {
		var statement = "SELECT email,first_name" +
			",last_name FROM contributors WHERE" +
			" contributors.rank='admin'";
		pool.query(statement, (err, results) => {
			if(err) {
				console.error("Error Connecting: " +
					err.stack);
				response.send("0");
			}
			else {
				response.send({
					first_name:
						results[0].first_name, 
					last_name:
						results[0].last_name, 
					email:
						results[0].email
				});
			}
		});
	});

	/*
		The API methods to get all subjects,
		topics, sections, or examples
	*/
	app.get("/api/:objects", (request, response) => {
		var objects = request.params.objects,
			statement = "";
		// response.set('Cache-Control', 'public, max-age=864000000');
		if(objects == "subjects") {
			statement = "SELECT sid,sname," +
				"`order`,side_approval," +
				"del_approval,cms_approval," +
				"status FROM subject ORDER BY" +
				" `order` ASC";
			pool.query(statement, (err, results) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				results.forEach(subject => {
					subject.topics = [];
					subject.clean_name =
						exports.cleanName(subject.sname);
				});
				response.send(results);
			});
		}
		else if(objects == "topics") {
			statement = "SELECT sid,tid,tname" +
				",`order`,side_approval," +
				"del_approval,cms_approval," +
				"status FROM topic";
			pool.query(statement, (err, results) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				results.forEach(topic => {
					topic.sections = [];
					topic.clean_name =
						exports.cleanName(topic.tname);
				});
				response.send(results);
			});
		}
		else if(objects == "sections") {
			statement = "SELECT section_id,tid" +
				",section_name,`order`," +
				"side_approval,del_approval" +
				",cms_approval,status FROM section";
			pool.query(statement, (err, results) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				results.forEach(section => {
					section.examples = [];
					section.clean_name =
						exports.cleanName(section.section_name);
				});
				response.send(results);
			});
		}
		else if(objects == "examples") {
			statement = "SELECT eid,ename," +
				"section_id,`order`," +
				"side_approval,del_approval" +
				",cms_approval,status FROM example";
			pool.query(statement, (err, results) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				results.forEach(example => {
					example.clean_name =
						exports.cleanName(example.ename);
				});
				response.send(results);
			});
		}
		else { response.send("No such API request exists!"); }
	});

	/*
		The API methods to count the number of
		contributors and committee members
	*/
	app.get("/api/cms/count/:param", (request, response) => {
		var type = request.params.param,
			statement = "";
		if(type == "contributors") {
			statement = "SELECT email FROM" +
				" contributors WHERE contributors.status=1";
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					response.send((result.length)
						.toString());
				}
			});
		}
		else if(type == "committee") {
			statement = "SELECT email FROM" +
				" contributors WHERE" +
				" contributors.rank='com-member'";
			pool.query(statement, (err, result) => {
				if(err) {
					console.error("Error Connecting: " +
						err.stack);
					response.send("0");
				}
				else {
					response.send((result.length + 1)
						.toString());
				}
			});
		}
		else { response.send("No such API request exists!"); }
	});
};

module.exports = exports;