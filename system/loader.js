/*
 * system/loader.js
 */

exports.controller = function(controller, response) {
	try {
		var _controller = require("../controllers/" + controller);
	} catch (err) {
		return false;
	}
	response.controller = _controller;
	return true;
};

exports.view = function(view, request, response, data) {
	var data = data || { },
	path = __dirname + "/../views/" + view + config.viewExtension;
	try {
		var content = fs.readFileSync(path);
	} catch (err) {
		httpErrors.raise(500, request, response);
		return false;
	}
	content = content.toString();
	var match, value,
	regex1 = new RegExp("<%=\\s*([A-Za-z0-9_]+)\\s*((\\[[\"']?([A-Za-z0-9_]+)[\"']?\\])|(\\.([A-Za-z0-9_]+)))*\\s*%>"),
	regex2 = new RegExp("<%=\\s*(.*)\\s*%>");
	while (match = regex1.exec(content)) {
		if (match[4] || match[6]) {
			value = eval("(data." + regex2.exec(match[0])[1] + ")");
		} else {
			value = data[match[1]];
		}
		content = content.replace(match[0], value);
	}
	response.write(content);
};

exports.page = function(page, request, response) {
	if (response.controller) {
		if (typeof response.controller[page] == 'function') {
			response.controller[page].call(global, request, response);
			return true;
		} else if (typeof response.controller._default == 'function') {
			response.controller._default.call(global, request, response, page);
			return true;
		} else {
			return false;
		}
	} else {
		httpErrors.raise(404, request, response);
	}
};

exports.module = function(module, name) {
	if (typeof module != 'string') return false;
	var name = name || module;
	if (global[name]) {
		return false;
	} else {
		try {
			global[name] = require("./cookies");
			return true;
		} catch (err) {
			return false;
		}
	}
}

exports.cookies = function(name) {
	return exports.module("cookies", (name || false));
};

exports.sessions = function(name) {
	return exports.module("sessions", (name || false));
};





