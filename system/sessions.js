/*
 * system/sessions.js
 */

// Make sure signed cookies are enabled
if (! cookies) {
	global.cookies = require("./cookies");
	cookies.secret = config.cookieSig;
}



