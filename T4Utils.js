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

/* 
	Utility Javascript for T4 Javascript Content Processor
   	Ben Margevicius; bdm4@case.edu
	Version 0.19.0 2/16/16
   
	Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/	
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


importClass(com.terminalfour.publish.PathBuilder); //import the pathbuilder class
importPackage(com.terminalfour.media);
importPackage(com.terminalfour.media.utils);

//IIFE for t4Utils. NOTE you can't use the window namespace for window.ns = window.ns || {} 
var T4Utils = (function (utils) {  	
	utils.version = 'v0.19.0_2016.02.16';	
	
	/* Console utils for debugging. Don't leave these in your layouts.. 
		T4Utils.console.log("log message");
		T4Utils.console.warn("warning");
		T4Utils.console.error("error message");
		T4Utils.console('<console method>', '<message>');
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
	}
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	}
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	}
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	}
	
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    }
    
	
	/*converts and object to string. 
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will
		not convert that to a javascript string. This will convert to a string. grumble.
	*/
	utils.toString = function(object)
	{
		return String(object); 
	}
	/* 
		sitemanager namespace gets information about the sitemanager 	
	*/
	utils.siteManager = utils.siteManager || {};
	//write the version of T4 you are working with.
	utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;	
	utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;
	utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");
	/* 
		BrokerUtils NameSpace does something. I dunno yet.. I'll have to read the API :) 
	
	*/
	utils.brokerUtils = utils.brokerUtils || {};
	utils.brokerUtils.processT4Tag = function (t4Tag) {
		var myContent = content || null; 
		return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag); 
	}
	/*
	  contentInfo namespace gets information about content	
		note: in layouts content will be null.
	*/
	utils.elementInfo = utils.elementInfo || {};
	utils.elementInfo.getElements = function() {
		var c = content || null;
		if(c !== null)
			c.getElements();	
		else
			return null;
	}
	utils.elementInfo.getElementValue = function(element) 
	{
		var c = content || null; 
		if(c !== null)
		{
			var el = c.get(element);
			if(typeof el.publish === "function")
			{
				return el.publish();	
			}
		}	
		return null;
	}	 
	utils.elementInfo.getElementName = function(element) 
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
	utils.elementInfo.getElementID = function(element) 
	{
		var c = content || null; 
		if(c !== null)
		{
			var el = c.get(element);
			if(typeof el.getID === "function")
			{
				return el.getID();
			}			
		}
		return null;
	}	
		
	
    /* 
		getSectionInfo namespace gets 
       information about a section. duh.       
    */
    utils.getSectionInfo = utils.getSectionInfo || {};
  	//getPublishLink will return the publishing Link 
    utils.getSectionInfo.getPublishLink = function () {
        return this.publishLink;
    }
    //sets the publishlink object
    utils.getSectionInfo.setPublishLink = function (section) {
        this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
    }
    
  	//gets the section title for the section passed in
    utils.getSectionInfo.sectionTitle = function (section) {
        this.setPublishLink(section);
        return this.publishLink.getText();
    }
  
  	//gets the url for the section passed in
    utils.getSectionInfo.sectionLink = function (section) {
        this.setPublishLink(section);
        return this.publishLink.getLink();
    }
  
  	//returns a fully formed anchor link for the section passed in
    utils.getSectionInfo.anchorLink = function (section) {
        this.setPublishLink(section);
        var theLink = this.publishLink.getLink();
        var theText = this.publishLink.getText();
        var myLink = '<a href="' + theLink + '">' + theText + '</a>';
        return myLink;
    }
   	
  
	//outputs the directory from "section" in a string format
   	utils.getSectionInfo.getDirectory = function(section) {
      	return PathBuilder.getDirectory(section, publishCache, language).toString();		
    }
	
	/* 
    	This is an adaptation of the CachedSection.GetChildren method in the API. 		
        There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
        This method will output the expected order in the site manager.
        if is isHiddenInNAV is true then it will NOT output hidden sections.
	*/
	utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
      	if (isHiddenInNAV === undefined) {
      		isHiddenInNAV = false;
        }
		return section.getChildren(publishCache.channel, language, isHiddenInNAV);
	}
    
    
	/*
		GetRootPath(section, path)
		Usage T4Utils.getSectionInfo.getRootPath(section); //section is predefined in t4 as the section you are in. 
		Returns an array of sections until root. Including the current section.    
	*/
    utils.getSectionInfo.getRootPath = function (currentSection) {             
		return this.getPathUntilLevel(0, currentSection);
    }   
	
	/*
		getPathUntilLevel(finalLevel, currentSection, path)
		usage 
		T4Utils.getSectionInfo.getPathUntilLevel(0, section); //go until level 0, otherwise known as root. 
		T4Utils.getSectionInfo.getPathUntilLevel(2, section); //go until two levels up. 		
		Gets a path from the current section until we get to a certain level. 
	*/
	utils.getSectionInfo.getPathUntilLevel = function(finalLevel, currentSection, path)
	{
		path = path || []; //initialize an array		
		path.push(currentSection);	
		var currentLevel = currentSection.getLevel(publishCache.channel);		
		if(finalLevel < currentLevel)
		{				
			var parentSection = currentSection.getParent();  //get the next node.
			return this.getPathUntilLevel(finalLevel, parentSection, path); //recurse up one level. 
		}
		else return path;
	}
	
	/*
		getPathBySteps(stepsUp, currentSection, path)
		usage 
		T4Utils.getSectionInfo.getPathBySteps(1, section); //go 1 step back otherwise get the parent
		Gets a path from the current section until we get to a certain level. 
		
		To Avoid confusion consider making path 
	*/
	utils.getSectionInfo.getPathBySteps = function(stepsUp, currentSection, path)
	{
		path = path || []; //initialize an array
		path.push(currentSection);
		if(path.length < stepsUp) 
		{
			var parentSection = currentSection.getParent();  //get the next node.
			if( parentSection === null ) return path; // break the recursion if we are at root.
			else return this.getPathBySteps(stepsUp, parentSection, path); //recurse up one level. 
		}
		else return path;
	}
	
	/*
		getLevel(section)
		Usage T4Utils.getSectionInfo.getRootPath(section); //section is predefined in t4 as the section you are in. 
		Returns an int of the level of which the section is at.     
	*/
	utils.getSectionInfo.getLevel = function (section) {
		return section.getLevel(publishCache.channel);
	}
	/*
		MEDIA Helpers
		Works with media objects from the media library
	*/
	utils.media = utils.media || {};
	/*
		Gets an array of image variantids 
		Pass is the Media Element from the site manager. 
		This will return an array of int ids
	*/
	utils.media.getImageVariantsIds = function(mediaElement) {
		var imageID = content.get(mediaElement).getID();
		var variantIds = MediaManager.getManager().getMediaVariants(dbStatement.getConnection(), imageID, language);  	
		return variantIds;
	}
	/*
		Use getMediaObect to get the media object. Pass that in here to get the dimensions of that media. 
		Probably should check to see if it's an image or not.
		Returns an object that has height and width. 
	*/
	utils.media.getImageDimensions = function(mediaObj) { 
		var d = { width: 0, height: 0 };
		d.width = MediaUtils.getImageDimensions(mediaObj)[0];
		d.height = MediaUtils.getImageDimensions(mediaObj)[1];
		return d;
	}
	/*
		Returns a media object from the ID. Note this is not the same as the media element
	*/
	utils.media.getMediaObject = function(mediaID) {		
		return MediaManager.getManager().get(dbStatement.getConnection(), mediaID, language);  
	}
	/*
	*/
	utils.media.getImageTag = function(imageSource, cssClass)
	{
		
		return "";
	}
	
	 /* 
		security namespace contains methods to do things securely?            
    */
    utils.security = utils.security || {};
	
	/**
		Hashes a plaintext string into a SHA-256 Hex Encoded String
	**/	
	utils.security.toSHA256 = function(plainText) {	
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
	
    return utils; //return out of the module 
})(T4Utils || {});