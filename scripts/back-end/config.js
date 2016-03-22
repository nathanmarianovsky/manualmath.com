var exports = {};

// Defines the connection and its associated parameters
exports.add_connections = mysql => {
	var obj = mysql.createPool({
		"connectionLimit": 20,
		"host": "",
		"user": "",
		"password": "",
		"database": ""
	});
	return obj;
};

module.exports = exports;