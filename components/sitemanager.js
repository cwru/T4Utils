/**
 * T4Utils.sitemanager - Security namespace for T4
 * @file sitemanager.js
 * @namespace T4Utils.siteManager 
 * @extends T4Utils
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

T4Utils.siteManager = T4Utils.siteManager || {};

/**
*	Returns the version of the site manager
* 	@function version
*	@memberof T4Utils.siteManager
*	@return {string} The site manager version	
*/
T4Utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;

/**
*	Returns the build details of the site manager
*  	@function buildDetails
* 	@memberof T4Utils.siteManager
*	@return {string} The site manager build details	
*/	
T4Utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;

/**
*	Returns the java version of the site manager
*  	@function javaVersion
* 	@memberof T4Utils.siteManager	
*	@return {string} The site manager java version. Note: Anything below java 8 is obsolete. 4/4/16
*/	
T4Utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");
