/**
* base.js
* @version v1.0.3
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
* @author Ben Margevicius 
* @date April 21, 2016
* Copyright 2016. MIT licensed.
*/

/*  Versioning    
	6/24/2015 - Initial
	6/30/2015 - Added stuff from T4's javascript util (https://community.terminalfour.com/forum/index.php?topic=426.0)
				Added utils.version;
				Added utils.siteManager namespace 
				Added utils.siteManager.version, and utils.siteManager.buildDetails;
				Added utils.brokerUtils namespace
				Added utils.brokerUtils.processT4Tags
	7/1/2015	Added utils.console(method, textOrObj) used to write debugging statements to the console.
	7/2/2015 	Added utils.elementInfo namspace to return info about elements 
				Added utils.elementInfo.getElements to return an array of elements
				Added utils.elementInfo.getElementValue(element) to return the value of an element. 
	7/6/2015	Added utils.elementInfo.getElementName(element).
	7/8/2015	Added newline chars for pretty printing of console and write methods
				Added utils.siteManager.javaVersion
	7/20/2015	Added utils.getSectionInfo.getChildren(section, isHiddenInNAV)  
	8/13/2015	Added utils.getSectionInfo.getLevel(section)
				Added utils.toString(obj) 
	9/18/2015	Added utils.elementInfo.getElementID (element) Returns the id of an element.
				Added utils.media namspace to give some help with images utils.media.getMediaObject(int id)
						utils.media.getImageDimensions(mediaobj media)
						utils.media.getImageVariantsIds(string mediaElement).	
	11/2/2015	Added utils.getSectionInfo.getPathUntilLevel(finalLevel, currentSection)
				Added utils.getSectionInfo.getPathBySteps(stepsUp, currentSection)
				Modded utils.getSectionInfo.getRootPath to use getPathUntilLevel(0);
	1/6/2016	Modded the elementInfo namespace. This includes some bug checks.
	2/16/2016 	Added utils.Media.getImageTag.
	2/25/2016 	Removed utils.Media.getImageTag. There is an issue with utils classes and t4 tags 
				Merged in security namespace
				Merged in security.toSHA256(plainText)
	4/5/2016	Changed to a modular format. Using NPM + Gulp to script the builds. Changed to semantic versioning.
				Added another attempt at media.GetImageTag. It's incomplete ATM.
	4/14/2016	Moved the java depedencies to a seperate file. This is done to prevent future duplicates.
	4/21/2016	Added bottlejs dependency resolver to remove T4 based dependecies. 
				Added bottlejs npm resolver. Added copy-libs to gulp to copy from node_modules to ./components/libs/
				Added dependencyinject.js for our T4 object factories
				Modded the first part of ordinalIndicators to demostrate how to use DI. 
	Todo: Mocking and Unit Testing
						
				
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
	*/
	utils.toString = function(obj)
	{
		return new java.lang.String(obj); 
	};
	
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
	
	
	/**
 +	* Escapes an html encoded string <tag class="something"> should become &lt;tag class=&quot;something&quot;&gt
 +	* @param {string} unsafe - The HTML encoded string you want to convert
 +	* @return {java.lang.String} The HTML escaped string.		
 +	*/
	utils.escapeHtml = function (unsafe) {
		return org.apache.commons.lang.StringEscapeUtils.escapeHtml4(unsafe);		
	};
	return utils;
})(T4Utils || {});