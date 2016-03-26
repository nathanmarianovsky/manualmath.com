var exports = {};

// Adds all of the API routes
exports.add_api_routes = (app, pool) => {
	// The API methods to get all subjects, topics, sections, or examples
	app.get("/api/:objects", (request, response) => {
		var objects = request.params.objects;
		if(objects == "subjects") {
			pool.query("SELECT sid,sname,`order` FROM subject ORDER BY `order` ASC", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(subject => {
					subject.clean_name = subject.sname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "topics") {
			pool.query("SELECT sid,tid,tname,`order` FROM topic", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(topic => {
					topic.clean_name = topic.tname.replace(/_/g, " ").replace(/AND/g, "-").replace(/APOSTROPHE/g, "'").replace(/COLON/g, ":").replace(/COMMA/g, ",");
				});
				response.send(results);
			});
		}
		else if(objects == "sections") {
			pool.query("SELECT section_id,tid,section_name,`order` FROM section", (err, results) => {
				if(err) { console.error("Error Connecting: " + err.stack); return; }
				results.forEach(section => {
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
		else {
			response.send("No such object exists in the database!");
		}
	});
};

module.exports = exports;