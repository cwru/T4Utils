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