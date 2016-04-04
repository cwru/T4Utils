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