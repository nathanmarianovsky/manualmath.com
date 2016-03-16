var exports = {};

exports.section_obj = (section_id, tid, section_name, examples, order = 0) => {
	var obj = {
		"section_id": section_id,
		"tid": tid,
		"section_name": section_name,
		"examples": examples,
		"order": order
	};
	return obj;
};

module.exports = exports;