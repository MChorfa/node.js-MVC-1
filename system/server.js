/*
 * system/server.js
 */

global.sys        = require("sys");
global.http       = require("http");
global.url        = require("url");
global.fs         = require("fs");
global.config     = require("./config");
global.load       = require("./loader");
global.httpErrors = require("./httpErrors");
global.controller = null;

var server,
cookies = require("./cookies"),

empty = function(str) {
	return (typeof str == 'undefined' || ! str || (typeof str == 'string' && str.length < 1));
};

// Sign the cookies
cookies.secret = config.cookieSig;

// Starts the server
exports.start = function(port) {
	var port = port || config.defaultPort;
	server = http.createServer(function(request, response) {
		response.writeHead(200, { "Content-Type": "text/html" });
		var pathInfo = url.parse(request.url).pathname.split("/");
		if (empty(pathInfo[1]))
			pathInfo[1] = config.defaultRoute;
		if (typeof pathInfo[2] != 'string' || empty(pathInfo[2]))
			pathInfo[2] = 'index';
		var success = load.controller(pathInfo[1]);
		if (success) {
			load.page(pathInfo[2], request, response);
		} else {
			httpErrors.raise(404, request, response);
		}
		response.end();
	});
	server.listen(port);
	sys.puts("Listening at http://localhost on port " + port + "...");
};

// Stops the server
exports.close = function() {
	if (server && server.close && typeof server.close == 'function') {
		server.close();
		server = null;
		sys.puts("Server stopped.");
	}
};
