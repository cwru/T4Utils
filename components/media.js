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
 *
 * 4/14/16 v1.0.2 moved dependancies to javadependencies.js
 */
/* jshint strict: false */

T4Utils.media = T4Utils.media || {};

/**
*	Gets an array of image variantids. 
*	@function media.getImageVariantsIds
*	@param {Media} mediaElement - Media Element from the site manager.
*	@return {int[]} Returns an array of media ids.		
*/
T4Utils.media.getImageVariantsIds = function(mediaElement) {
	var imageID = content.get(mediaElement).getID();
	var variantIds = MediaManager.getManager().getMediaVariants(dbStatement.getConnection(), imageID, language);  	
	return variantIds;
};

/**
*	Gets the dimensions of a media object, obviously you should pass in a picture.
*	@function media.getImageDimensions
*	@param {object} mediaObj - T4Utils.getMediaObect
*	@return {object} Returns an object that has two properties. width and height. 
*/
T4Utils.media.getImageDimensions = function(mediaObj) { 
	var d = { width: 0, height: 0 };
	d.width = MediaUtils.getImageDimensions(mediaObj)[0];
	d.height = MediaUtils.getImageDimensions(mediaObj)[1];
	return d;
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function media.getMediaObject
*	@param {int} mediaID - The id of the media object you are trying to return.
*	@return {object} Returns a media object
*/
T4Utils.media.getMediaObject = function(mediaID) {		
	return MediaManager.getManager().get(dbStatement.getConnection(), mediaID, language);  
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function media.getImageTag
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