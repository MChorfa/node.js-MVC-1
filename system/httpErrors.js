/*
 * system/httpErrors.js
 */

var defaultHandle = function(code, request, response) {
	response.write(
		"<html><head><title>HTTP Error: " + code + "</title></head><body>" +
		"<h1 style=\"font-family: sans-serif;\">HTTP Error: " + code + "</h1>" +
		"<p style=\"font-family: sans-serif;\">An HTTP " + code + " error has occured." +
		"<br />Also, an HTTP 404 error was encountered when attempting to handle this error." +
		"</p></body></html>");
	response.end();
};

exports.raise = function(code, request, response, defaultOnly) {
	response.writeHead(code, { "Content-Type": "text/html" });
	if (defaultOnly || ! config.handleErrors) {
		defaultHandle(code, request, response);
		return true;
	}
	var success = load.controller('errordocument', response);
	if (success) {
		success = load.page(code, request, response);
		if (! success) {
			defaultHandle(code, request, response);
		}
	} else {
		defaultHandle(code, request, response);
	}
};

