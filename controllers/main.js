/*
 * controllers/main.js
 */

exports.index = function(request, response) {

	var data = {
		title: 'Node.js MVC API'
	}

	load.view('api', request, response, data);

};
