var exports = {};

exports.example_obj = (eid, section_id, ename, order = 0) => {
	var obj = {
		"eid": eid,
		"section_id": section_id,
		"ename": ename,
		"order": order
	};
	return obj;
};

module.exports = exports;