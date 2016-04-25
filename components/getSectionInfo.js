 /**
 * T4Utils.getSectionInfo - getSectionInfo namespace gets information about a section. duh.
 * @file getSectionInfo.js
 * @namespace T4Utils.getSectionInfo 
 * @extends T4Utils
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 25, 2016
 * Copyright 2016. MIT licensed.
 *
 * v1.0.2 Moved dependencies
 * v1.0.3 Cleaned up comments. Fixed some small issues.
 */ 
/* jshint strict: false */
T4Utils.getSectionInfo = T4Utils.getSectionInfo || {};

/** 
*	Gets the publish link from a local variable. You have to setPublishLink first
*	@function getPublishLink
* 	@memberof T4Utils.getSectionInfo
*	@return will return the publishing Link
*/
T4Utils.getSectionInfo.getPublishLink = function () {
	return this.publishLink;
};

/**
*	Sets a link to section
*	@function setPublishLink
* 	@memberof T4Utils.getSectionInfo
*	@inner
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {PublishLink} - stores the publishLink in the T4Utils.publishLink object. Use getPublishLink getter to get that object. Returns the PublishLink type in T4
*/
T4Utils.getSectionInfo.setPublishLink = function (section) {
	this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
};


/**
*	Gets the section title for the section passed in
*	@function sectionTitle
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - The name of the section
*/
T4Utils.getSectionInfo.sectionTitle = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getText();
};

/**
*	Gets the section link for the section passed in
*	@function sectionLink
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - The link of the section
*/
T4Utils.getSectionInfo.sectionLink = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getLink();
};

/**
*	Gets an HTML anchor tag for a section. If you want just the link please use getLink()
*	@function anchorLink
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - Returns a fully formed HTML anchor link for the section passed in
*/
//Note try this.publishLink.toString() 
T4Utils.getSectionInfo.anchorLink = function (section) {
	this.setPublishLink(section);
	var theLink = this.publishLink.getLink();
	var theText = this.publishLink.getText();
	var myLink = '<a href="' + theLink + '">' + theText + '</a>';
	return myLink;
};


/**
*	Gets the directory for the section passed in
*	@function getDirectory
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - Get the directory on the filesystem that this section will be published to
*/
T4Utils.getSectionInfo.getDirectory = function(section) {
	return PathBuilder.getDirectory(section, publishCache, language).toString();		
};

/** 
*	This is an adaptation of the CachedSection.GetChildren method in the API. 		
*	There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
*	@function getChildren
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
* 	@param {boolean} isHiddenInNAV - if is isHiddenInNAV is true then it will NOT output hidden sections.
*	@return {Content[]} Outputs an array of chilen in the expected order listed in the site manager.	
*/
T4Utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
	if (isHiddenInNAV === undefined) {
		isHiddenInNAV = false;
	}
	return section.getChildren(publishCache.channel, language, isHiddenInNAV);
};


/**
*	Gets the path to root from currentSection, Note if you have microsites this will goto the root of everything.
*	@function getRootPath
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@returns {Section[]} Returns an array of sections until root. Including the current section.    
*/
T4Utils.getSectionInfo.getRootPath = function (currentSection) {             
	return this.getPathUntilLevel(0, currentSection);
};   

/**
*	Gets a path from the current section until we are N steps from root
*	@function getPathUntilLevel
* 	@memberof T4Utils.getSectionInfo
*	@param {int} finalLevel - How far down do you want to traverse
*	@param {CachedSection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
* 	@example <caption>Get path to root</caption>
		T4Utils.getSectionInfo.getPathUntilLevel(0, section); 
*	@example <caption>Get path to two levels above root</caption>
		T4Utils.getSectionInfo.getPathUntilLevel(2, section);
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
};

/**
*	Gets a path from the current section until we are N steps up from root
*	@function getPathBySteps
* 	@memberof T4Utils.getSectionInfo
*	@param {int} stepsUp - How far up do you want to traverse
*	@param {CachedSection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
* 	@example <caption>go 1 step back otherwise get the parent</caption>
		T4Utils.getSectionInfo.getPathBySteps(1, section);
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
};

/**
*	Get the level of which the section is at. 
* 	@function getLevel
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {int} - Returns an int of the level of which the section is at.     
*/
T4Utils.getSectionInfo.getLevel = function (section) {
	return section.getLevel(publishCache.channel);
};