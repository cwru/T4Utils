/**
 * T4Utils.base - Starting point of the T4Utils class. This must appear first. 
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 * DOX: https://community.terminalfour.com/info/api/sitemanager-7.3/index.html
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
}
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
	if(c !== null)
		c.getElements();	
	else
		return null;
}

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
}	

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
}

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
}	
 /**
 * T4Utils.getSectionInfo - getSectionInfo namespace gets information about a section. duh.
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
 
/* jshint strict: false */

/* Import Java based dependencies */
importClass(com.terminalfour.publish.PathBuilder); 

/**
* Security namespace declaration
*/
T4Utils.getSectionInfo = T4Utils.getSectionInfo || {};

/** 
	Gets the publish link from a local variable. You have to setPublishLink first
	@return will return the publishing Link
*/
T4Utils.getSectionInfo.getPublishLink = function () {
	return this.publishLink;
}

/**
*	Get a link to this section
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {null} - stores the publishLink in the T4Utils.publishLink object. Use getPublishLink getter to get that object. Returns the PublishLink type in T4
*/
T4Utils.getSectionInfo.setPublishLink = function (section) {
	this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
}


/**
*	Gets the section title for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - The name of the section
*/
T4Utils.getSectionInfo.sectionTitle = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getText();
}

/**
*	Gets the section link for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - The link of the section
*/
T4Utils.getSectionInfo.sectionLink = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getLink();
}

/**
*	Gets the section link for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - Returns a fully formed HTML anchor link for the section passed in
*/
T4Utils.getSectionInfo.anchorLink = function (section) {
	this.setPublishLink(section);
	var theLink = this.publishLink.getLink();
	var theText = this.publishLink.getText();
	var myLink = '<a href="' + theLink + '">' + theText + '</a>';
	return myLink;
}


/**
*	Gets the directory for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - Get the directory on the filesystem that this section will be published to
*/
T4Utils.getSectionInfo.getDirectory = function(section) {
	return PathBuilder.getDirectory(section, publishCache, language).toString();		
}

/** 
*	This is an adaptation of the CachedSection.GetChildren method in the API. 		
*	There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {boolean} isHiddenInNAV - if is isHiddenInNAV is true then it will NOT output hidden sections.
*	@return {Content[]} Outputs an array of chilen in the expected order listed in the site manager.	
*/
T4Utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
	if (isHiddenInNAV === undefined) {
		isHiddenInNAV = false;
	}
	return section.getChildren(publishCache.channel, language, isHiddenInNAV);
}


/**
*	Gets the path to root from currentSection
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@returns {Section[]} Returns an array of sections until root. Including the current section.    
*/
T4Utils.getSectionInfo.getRootPath = function (currentSection) {             
	return this.getPathUntilLevel(0, currentSection);
}   

/**
*	@usage
*	T4Utils.getSectionInfo.getPathUntilLevel(0, section); //go until level 0, otherwise known as root. 
*	T4Utils.getSectionInfo.getPathUntilLevel(2, section); //go until two levels up. 
*	@param {int} finalLevel - How far down do you want to traverse
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 
*/
T4Utils.getSectionInfo.getPathUntilLevel = function(finalLevel, currentSection, path)
{
	path = path || []; //initialize an array		
	path.push(currentSection);	
	var currentLevel = currentSection.getLevel(publishCache.channel);		
	if(finalLevel < currentLevel)
	{				
		var parentSection = currentSection.getParent();  //get the next node.
		return this.getPathUntilLevel(finalLevel, parentSection, path); //recurse up one level. 
	}
	else { return path; }
}

/**
*	Gets a path from the current section until we are N steps up from root
*	@usage
*	T4Utils.getSectionInfo.getPathBySteps(1, section); //go 1 step back otherwise get the parent
*	@param {int} stepsUp - How far up do you want to traverse
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 	
*/
T4Utils.getSectionInfo.getPathBySteps = function(stepsUp, currentSection, path)
{
	path = path || []; //initialize an array
	path.push(currentSection);
	if(path.length < stepsUp) 
	{
		var parentSection = currentSection.getParent();  //get the next node.
		if( parentSection === null ) { return path; } // break the recursion if we are at root.
		else { return this.getPathBySteps(stepsUp, parentSection, path); }//recurse up one level. 
	}
	else { return path; }
}

/**
*	Get the level of which the section is at. 
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {int} - Returns an int of the level of which the section is at.     
*/
T4Utils.getSectionInfo.getLevel = function (section) {
	return section.getLevel(publishCache.channel);
}
/**
 * T4Utils.media - Gets objects from the media library.
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
/* import java based dependencies */
importPackage(com.terminalfour.media);
importPackage(com.terminalfour.media.utils);

/**
* Media namespace declaration
*/
T4Utils.media = T4Utils.media || {};

/**
*	Gets an array of image variantids. 
*	@param {Media} - Media Element from the site manager.
*	@return {array[int]} Returns an array of media ids.		
*/
T4Utils.media.getImageVariantsIds = function(mediaElement) {
	var imageID = content.get(mediaElement).getID();
	var variantIds = MediaManager.getManager().getMediaVariants(dbStatement.getConnection(), imageID, language);  	
	return variantIds;
}

/**
*	Gets the dimensions of a media object, obviously you should pass in a picture.
*	@param {object}  T4Utils.getMediaObect
*	@return {object} Returns an object that has two properties. width and height. 
*/
T4Utils.media.getImageDimensions = function(mediaObj) { 
	var d = { width: 0, height: 0 };
	d.width = MediaUtils.getImageDimensions(mediaObj)[0];
	d.height = MediaUtils.getImageDimensions(mediaObj)[1];
	return d;
}

/**
*	Get a media object from it's id. Note this is not the same as the media element
*	@param {int} The id of the media object you are trying to return.
*	@return {object} Returns a media object
*/
T4Utils.media.getMediaObject = function(mediaID) {		
	return MediaManager.getManager().get(dbStatement.getConnection(), mediaID, language);  
}
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