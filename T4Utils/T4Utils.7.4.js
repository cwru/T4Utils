/**
 * t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * Copyright 2016. MIT licensed.
 */
/**
 * T4Utils.base - Starting point of the T4Utils class. This must appear first. 
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

'use strict';

/** Class representing T4Utils */
var T4Utils = (function (utils) { 

	/**
	* Outputs the version of this utility
	* @return {string} The version of the T4Utility Class 
	*/
	utils.version = 'v1.0.0_2016.04.04';
	
	
	/**
	* Writes a message to the browser console 
	* @param {string} consoleMethod - You can specify which console method you want to use. "log, warn, error" are valid. 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
	}
	
	/**
	* Writes a message to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	}
	
	/**
	* Writes a warning to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	}
	
	/**
	* Writes an error to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	}
	
	/**
	* Writes a paragraph formatted HTML message to the browser 
	* @param {string} text - The text you want to write to the screen.
	*/
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    }
    
	/**
	* Converts a javascript object to Java string
	* @param {object} obj - The object you want to convert
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	*/
	utils.toString = function(obj)
	{
		return new java.lang.String(obj); 
	}
	return utils;
})(T4Utils || {});
/**
 * T4Utils.sitemanager - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

/** 
	Sitemanager namespace gets information about the sitemanager, duh.	
*/
T4Utils.siteManager = T4Utils.siteManager || {};

/**
*	Returns the version of the site manager
*	@return {string} The site manager version	
*/
T4Utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;

/**
*	Returns the build details of the site manager
*	@return {string} The site manager build details	
*/	
T4Utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;

/**
*	Returns the java version of the site manager
*	@return {string} The site manager java version. Note: Anything below java 8 is obsolete. 4/4/16
*/	
T4Utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");

/**
 * T4Utils.security - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */


/* jshint strict: false */
/**
* Security namespace declaration
*/
T4Utils.security = T4Utils.security || {};
	
/**
*	Hashes a plaintext string into a SHA-256 Hex Encoded String
*	@param {string} plainText - Plain text value of the 
*	@return {string} A string value of the hash
*/	
T4Utils.security.toSHA256 = function(plainText) {	
	importPackage(java.security);

	var hash;
	try
	{	
		var md = MessageDigest.getInstance("SHA-256"); //Every implementation is required to have MD5, SHA-1, SHA-256. Don't use MD5 or SHA-1 anymore. 
		var pwBytes = new java.lang.String(plainText).getBytes("UTF-8");    
		md.update(pwBytes);
		var hashedBytes = md.digest();
		var sb = new java.lang.StringBuffer();
		for (var i = 0; i < hashedBytes.length; i++) {
			sb.append(java.lang.Integer.toString((hashedBytes[i] & 0xff) + 0x100, 16).substring(1)); //borrowed from http://www.mkyong.com/java/java-sha-hashing-example/
		}
		hash = sb.toString();
	}
	catch(e)
	{        
		document.write(e);
	}
	return hash;
}