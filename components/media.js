/**
 * T4Utils.media - Gets objects from the media library.
 * @file media.js
 * @namespace T4Utils.media
 * @extends T4Utils
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 14, 2016
 * Copyright 2016. MIT licensed  
 */
/* 4/14/16 v1.0.2 moved dependancies to javadependencies.js 
	When the D
*/
/* jshint strict: false */

T4Utils.media = T4Utils.media || {};

/**
*	Gets an array of image variant ids. 
*	@function getImageVariantsIds
* 	@memberof T4Utils.media
*	@param {Media} mediaElement - Media Element from the site manager.
	@param {MediaManager} mediaManager - T4 Media Manager
	@param {dbStatement} oConn - T4 connection to the database?
*	@return {int[]} Returns an array of media ids.		
* 	@example <caption>Get image variant ids</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);
var variants = T4Utils.media.getImageVariantsIds(source); //get the variants of the media element
*/
T4Utils.media.getImageVariantsIds = function(mediaElement, mediaManager, oConn) {
	if(mediaManager === undefined) { 
		mediaManager = MediaManager.getManager();
	}
	if(oConn === undefined) {
		oConn = dbStatement.getConnection();
	}
	var imageID = content.get(mediaElement).getID();
	var variantIds = mediaManager.getMediaVariants(oConn, imageID, language);  	
	return variantIds;
};

/**
*	Gets the dimensions of a media object, obviously you should pass in a picture.
*	@function getImageDimensions
*	@memberof T4Utils.media
*	@param {object} mediaObj - T4Utils.getMediaObject
	@param {MediaUtils} mediaUtil - T4 MediaUtils object
*	@return {object} Returns an object that has two properties. width and height. 
	@example <caption>Get image variant ids and dimenstions</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);		
var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media
var sourceDimensions = T4Utils.media.getImageDimensions(sourceMediaObject);
*/
T4Utils.media.getImageDimensions = function(mediaObj, mediaUtil) { 
	var d = { width: 0, height: 0 };
	if(mediaUtil === undefined) {
		mediaUtil = MediaUtils; //
	}
	d.width = mediaUtil.getImageDimensions(mediaObj)[0];
	d.height = mediaUtil.getImageDimensions(mediaObj)[1];
	return d;
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function getMediaObject
*	@memberof T4Utils.media
*	@param {int} mediaID - The id of the media object you are trying to return.	
*	@return {object} Returns a media object
*	@example <caption>Get image variant ids and dimenstions</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);		
var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media		
*/
T4Utils.media.getMediaObject = function(mediaID) {
	try
	{
		var oMM = T4Utils.Bottle.container.oMM;	//refernce to MediaManager.getManager()
		return oMM.get(T4Utils.Bottle.container.oConn, mediaID, language);  
	}
	catch (err)
	{
		document.write(err.message);
	}
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function getImageTag
*	@memberof T4Utils.media
*	@ignore 
*	@param {int} mediaID - The id of the media object you are trying to return.
*	@return {object} Returns a media object
*/
T4Utils.media.getImageTag = function(imageSource, altText, cssClass, sizesQuery)
{
	var imagesrc = '';
	
	try
	{
		var t4src = "<t4 />";
		T4Utils.write("Processing t4Tag: " + t4src);
		T4Utils.write("t4src is type: " + typeof t4src);
		T4Utils.write("t4src.length: " + t4src.length);
		T4Utils.write('t4 version: ' + T4Utils.siteManager.version);
		T4Utils.write('t4 buildDetails: ' + T4Utils.siteManager.buildDetails);
		T4Utils.write('t4 javaVersion: ' + T4Utils.siteManager.javaVersion);
	}
	catch(err)
	{
		document.write("error processing utils.media.getImageTag()");
		document.write(err.message);
	}
	return imagesrc;
};