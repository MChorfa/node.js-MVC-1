/*
 * system/httpErrors.js
 */

var defaultHandle = function(code, request, response) {
	response.write("An HTTP " + code + " error has occured. Also, an HTTP 404 " +
		"error was encountered when attempting to handle this error.");
	response.end();
};

exports.raise = function(code, request, response, defaultOnly) {
	response.writeHead(code, { "Content-Type": "text/html" });
	if (defaultOnly) {
		defaultHandle(code, request, response);
		return true;
	}
	var success = load.controller('errordocument');
	if (success) {
		success = load.page(code, request, response);
		if (! success) {
			defaultHandle(code, request, response);
		}
	} else {
		defaultHandle(code, request, response);
	}
};

