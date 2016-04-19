/**
 * t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * Copyright 2016. MIT licensed.
 * Built: Tue Apr 19 2016 16:17:45 GMT-0400 (Eastern Daylight Time).
 */
/**
 * Java dependencies -
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 19, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
/* Java Language
importPackage(java.lang); */
/* getSectionInfo.js 
importClass(com.terminalfour.publish.PathBuilder); */
/* media.js 
importPackage(com.terminalfour.media);
importPackage(com.terminalfour.media.utils);*/
/* ordinalIndicators.js
importClass(com.terminalfour.sitemanager.cache.utils.CSHelper);
importClass(com.terminalfour.sitemanager.cache.CachedContent);
importPackage(com.terminalfour.sitemanager);
importPackage(com.terminalfour.content); */

/*  Versioning    
	4/19/2016 - Initial V8.1 support
	
	Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
	
	
	How to get url and text from a section link type. You can output 'normal' to get the whole link as well.
	var internalLink = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linkurl" ...  />');	
  	var internalLinkText = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linktext" ... />');
	
	How do you get an image from the media library? Note the formatter. I had to change this from image/* to path/*.
	 var elv = T4Utils.elementInfo.getElementValue('Source'); //Returns a t4tag 
	  elv = elv.replace("image/*", "path/*"); //The t4 tag has the formatter = image versus just the source. So change it.
	  var sauce = T4Utils.brokerUtils.processT4Tag(elv);  //Process the t4 tag. Similar to below.
	OR
	var sauce = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="156737" formatter="path/*"/>');
*/



/* Notes:
	There are several varibles you can use:
		
	document: The output stream writer. This is critical if the script wants to write output to the appropriate location during publish. For example, during publish the output writer would either be writing directly to a publish file on disk, or writing to a String which in turn, would be written to a file on disk.
	
	publishCache: The name of the PublishCache object. publishCache.channel - returns the current channel?
	
	dbStatement: The name of the database Statement object used to talk to the database.
	
	section: The name of the Section object. The section in question is the one being currently published.
	
	content: The name of the Content object which is being published.
	
	contentList: The name of the array of CachedContent objects which are required when a page layout is being processed. This is likely to be null in the case of content layouts.
	
	template: The name of the Template object which is required content layouts, where it represents the content-type/template of which the content is an instance of. This is likely to be null in the case of page layouts.
	
	templateFormat: The name of the TemplateFormat object which represents the content layout for the given content instance. This is likely to be null in the case of content layouts.
	
	language: The language version of the given publish or preview.
	
	isPreview: A flag indicating whether the processing is occurring under a preview or a publish.
	
	isStyleHeader: A flag indicating whether the data being processed in a page layout is header or footer text. Not applicable in the case of content layouts.	
*/

'use strict';
/*jshint -W097*/
/** Class representing T4Utils */
var T4Utils = (function (utils) { 

	/**
	* Outputs the version of this utility
	* @return {string} The version of the T4Utility Class 
	*/
	utils.version = 'v1.0.2_2016.14.04';
	
	
	/**
	* Writes a message to the browser console 
	* @param {string} consoleMethod - You can specify which console method you want to use. "log, warn, error" are valid. 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string") 
		{			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a message to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")	
		{			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a warning to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")
		{
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes an error to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")
		{
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a paragraph formatted HTML message to the browser 
	* @param {string} text - The text you want to write to the screen.
	*/
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    };
    
	/**
	* Converts a javascript object to Java string
	* @param {object} obj - The object you want to convert
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	depreciating this 4/19/2016. toJavaString is more sound and complete of a description. 
	utils.toString = function(obj)
	{
		return new obj.toJavaString(); 
	};*/
	
	/**
	* Converts a javascript object to Java string by prototying
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	* jshint -w121 extending the native javascript String object.
	*/
	/*jshint -W121*/
	String.prototype.toJavaString = function () {
		return new java.lang.String(this); //this is crazy.		
	};
	
	utils.escapeHtml = function (unsafe) {
		return unsafe.replace(/&/g, "&amp;")
    			.replace(/</g, "&lt;")
    			.replace(/>/g, "&gt;")
    			.replace(/'/g, "&#039;")
    			.replace(/"/g, "&quot;");	
	};
	return utils;
})(T4Utils || {});
/**
 * T4Utils.sitemanager - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 19, 2016
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
 * T4Utils.brokerUtils - Broker Utils namespace for T4
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
T4Utils.brokerUtils = T4Utils.brokerUtils || {};
/**
*	Processes a t4 tag.
*	@param {string} t4Tag - HTML style T4 tag that needs to be processed. Typically something from the media library.
*	@return {string} A string value of the t4 tag output. Depends on the formatters you put in. 
*/
T4Utils.brokerUtils.processT4Tag = function (t4Tag) {
	var myContent = content || null; 
	return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag); 
};
/**
 * T4Utils.elementInfo - elementInfo namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
 
/* jshint strict: false */
/**
* elementInfo namespace declaration
*/
T4Utils.elementInfo = T4Utils.elementInfo || {};

/**
*	Get all of the elements within the piece of content
*	@return {ContentElement[]} An array containing the elements within the piece of content.
*/	
T4Utils.elementInfo.getElements = function() {
	var c = content || null;
	if(c !== null) {
		c.getElements();	
	}
	else {
		return null;
	}
};

/**
*	If the element is "text", get its' "publish" value as a String.
*	@param {string} element - The string value of the name of the element
*	@return {string} The value of the element. Can be null if the supplied value is already null.
*/
T4Utils.elementInfo.getElementValue = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{
		var el = c.get(element); //returns a contentelement type
		if(typeof el.publish === "function")
		{
			return el.publish();	
		}
	}	
	return null;
};	

/**
*	Used to get the name of the element.
*	@param {string} element - The string value of the name of the element
*	@return {string} The name of the element
*/ 
T4Utils.elementInfo.getElementName = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{	
		var el = c.get(element);
		if(typeof el.getName === "function")
		{
			return c.get(element).getName();	
		}			
	}
	return null;
};

/**
*	Used to get the ID of the element.
*	@param {string} element - The string value of the name of the element
*	@return {string} The ID of the element
*/
T4Utils.elementInfo.getElementID = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{
		var el = c.get(element); //Returns a CachedContent type?
		if(typeof el.getID === "function")
		{
			return el.getID();
		}			
	}
	return null;
};	
/**
 * T4Utils.security - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */


/* jshint strict: false*/
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
	/* jshint bitwise: false */
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
};