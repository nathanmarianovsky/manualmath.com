var exports = {};

exports.connection_obj = () => {
	var obj = {
		"host": host,
		"user": user,
		"password": password,
		"database": database
	};
	return obj;
};

module.exports = exports;