/**
 * T4Utils.media - Gets objects from the media library.
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

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
* Creates an image tag with srcset from an element source
* @param {} imageSource - Source media element
* @param {string} altText - Alt text to the img tag
* @param {string} cssClass - String for the css classes to be applied
* @param {string} sizesQuery - Media query for the sizes on the img tag. 100vw is assumed. 
*/
T4Utils.media.getImageTag = function(imageSource, altText, cssClass, sizesQuery)
{
	var imagesrc = '';
	
	try
	{
		var source = imageSource; //cache the name of the source element
		var myid = T4Utils.elementInfo.getElementID(source);
		var variants = T4Utils.media.getImageVariantsIds(source); //get the variants of the media element
		var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media
		var sourceDimensions = T4Utils.media.getImageDimensions(sourceMediaObject);
		
		//var saucepath = utils.brokerUtils.processT4Tag('<t4 type="media" id="'+ myid +'" formatter="path/*"/>'); 
		//var t4src = '< t4 type="media" id="'+ myid +'" formatter="path/*" />';		
		var t4src = "<t4 />"
		T4Utils.write("Processing t4Tag: " + t4src);
		T4Utils.write("t4src is type: " + typeof t4src);
		T4Utils.write("t4src.length: " + t4src.length);
		
		var saucepath = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, t4src); 
		T4Utils.write("Source path: " + saucepath)
		
		var imagesrc = '<img alt="' + altText + '" class="' + cssClass +'" src="'+ saucepath + '"';  	
		var variantIDs = T4Utils.media.getImageVariantsIds(source);
		if(variantIDs.length)
		{
			imagesrc += ' srcset="' + saucepath + ' ' + sourceDimensions.width + 'w, '; 
		  
			for(i = 0; i < variantIDs.length; i++)
			{
				var variantObj = T4Utils.media.getMediaObject(variantIDs[i]); //Get the object from the id
				var dimensions = T4Utils.media.getImageDimensions(variantObj); //get the dimensions of the image
				var variantpath = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="'+ variants[i] +'" formatter="path/*"/>'); //get the src path
				imagesrc += variantpath + ' ' + dimensions.width + 'w, '; //concat our srcset tag. 
			}     	
			imagesrc = imagesrc.slice(0, -2); //remove the trailing ', '
			imagesrc += '"'; //add our double quotes
		 
			if(sizes.length)
			{              
			  imagesrc += ' sizes="' + sizes + '"';
			}
		}
		imagesrc += ' />';   //cap our html element.
		imagesrc = myid; //debugging
	}
	catch(err)
	{
		document.write("error processing T4Utils.media.getImageTag()");
		document.write(err.message);
	}
	return imagesrc;
}