
/**
 * T4Utils.console - console writer for browser based messages. 
 * @file console.js
 * @namespace T4Utils.console 
 * @extends T4Utils
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 25, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
 
T4Utils.console = T4Utils.console || {};

/**
* Writes a message to the browser console
* @function log
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
*/
T4Utils.console.log = function(textOrObj) {		
	if(typeof textOrObj === "string")	
	{			
		document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	}
};

/**
* Writes a warning to the browser console 
* @function warn
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
*/
T4Utils.console.warn = function(textOrObj) {		
	if(typeof textOrObj === "string")
	{
		document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	}
};

/**
* Writes an error to the browser console 
* @function error
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
*/
T4Utils.console.error = function(textOrObj) {		
	if(typeof textOrObj === "string")
	{
		document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	}
};
