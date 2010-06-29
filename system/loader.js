/*
 * system/loader.js
 */

exports.controller = function(controller) {
	try {
		var _controller = require("../controllers/" + controller);
	} catch (err) {
		return false;
	}
	global.controller = _controller;
	return true;
};

exports.view = function(view, request, response, data) {
	var data = data || { },
	path = __dirname + "/../views/" + view + ".jsp";
	try {
		var content = fs.readFileSync(path);
	} catch (err) {
		httpErrors.raise(500, request, response);
		return false;
	}
	content = content.toString();
	for (var i in data) {
		if (data.hasOwnProperty(i)) {
			var regex = new RegExp("<%=\s*" + i + "\s*%>", "g");
			content = content.replace(regex, data[i]);
		}
	}
	response.write(content);
};

exports.page = function(page, request, response) {
	if (controller) {
		if (typeof controller[page] == 'function') {
			controller[page].call(global, request, response);
			return true;
		} else if (typeof controller._default == 'function') {
			controller._default.call(global, request, response, page);
			return true;
		} else {
			return false;
		}
	} else {
		httpErrors.raise(404, request, response);
	}
};


