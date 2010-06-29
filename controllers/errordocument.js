/*
 * controllers/errordocument.js
 */

exports._default = function(request, response, code) {
	var data = { code: code };
	load.view('error', request, response, data);
};
