var exports = {};

exports.topic_obj = (sid, tid, tname, sections, order = 0) => {
	var obj = {
		"sid": sid,
		"tid": tid,
		"tname": tname,
		"sections": sections,
		"order": order
	};
	return obj;
};

module.exports = exports;