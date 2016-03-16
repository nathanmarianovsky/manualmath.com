var exports = {};

exports.subject_obj = (sid, sname, topics, order = 0) => {
	var obj = {
		"sid": sid,
		"sname": sname,
		"topics": topics,
		"order": order
	};
	return obj;
};

module.exports = exports;