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
global.mime       = require("./mime");

var server,

empty = function(str) {
	return (typeof str == 'undefined' || ! str || (typeof str == 'string' && str.length < 1));
};

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
		// resource handling
		if (pathInfo[1] == 'resources') {
			var path = '';
			for (var i = 2; i < pathInfo.length; i++)
				path += "/resources/" + pathInfo[i];
			path = __dirname + "/.." + path;
			fs.readFile(path, function(err, content) {
				if (err) {
					httpErrors.raise(404, request, response);
				} else {
					var mimeType = mime.lookup(path);
					response.writeHead(200, { "Content-Type": mimeType });
					response.write(content);
					response.end();
				}
			});
		}
		// page handling
		else {
			var success = load.controller(pathInfo[1], response);
			if (success) {
				success = load.page(pathInfo[2], request, response);
				if (! success) {
					httpErrors.raise(404, request, response);
				}
			} else {
				httpErrors.raise(404, request, response);
			}
			response.end();
		}
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

process.addListener('exit', function() {
	exports.close();
	sys.puts("Process Stopped.");
});

