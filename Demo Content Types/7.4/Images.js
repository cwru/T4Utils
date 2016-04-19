/* 
	Bootstrap images based on 3.3.5 Bootstrap
    Allows for pulling, shapes, and responsive
    By Ben Margevicius bdm4@case.edu
	9/17/2015
    V0.1 initial.
    V0.2 Added srcset. 
    V0.3 - 1/5/16 - bdm4 - Added source to srcset
    V0.31 - fixing sizes conditional.
*/

try {
  importClass(com.terminalfour.publish.utils.BrokerUtils);
  var utils = eval(String (com.terminalfour.publish.utils.BrokerUtils.processT4Tags (dbStatement, publishCache, section, null, language, isPreview, '<t4 type="media" id="123627" formatter="inline/*"/>')));
} catch (e) {
    if (e instanceof SyntaxError) {
        document.write(e.message);
    } else {
        throw( e );
    }
}
/*
HTML To write
<img alt="Ireland Flag" class="" 
	src="/nursing/media/nursing/images/flags/Ireland.gif" 
	srcset="/nursing/media/nursing/images/flags/Ireland.gif 1181w, 
	/nursing/media/nursing/images/flags/Ireland-100x67.gif 100w, /
	nursing/media/nursing/images/flags/Ireland-768x512.gif 768w, 
	/nursing/media/nursing/images/flags/Ireland-480x320.gif 480w, 
	/nursing/media/nursing/images/flags/Ireland-992x662.gif 992w, 
	/nursing/media/nursing/images/flags/Ireland-320x214.gif 320w" 
	sizes="(max-width: 768px) 100vw, 22vw" />
*/
try
{ 
  var source = "Source"; //cache the name of the source element
  var myid = T4Utils.elementInfo.getElementID(source);
  var variants = T4Utils.media.getImageVariantsIds(source); //get the variants of the media element
  var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media
  var sourceDimensions = T4Utils.media.getImageDimensions(sourceMediaObject);
  
  var saucepath = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="'+ myid +'" formatter="path/*"/>'); 
  
  var alt = String(T4Utils.elementInfo.getElementValue('Alt'));  
  var responsive = (Boolean(T4Utils.elementInfo.getElementValue('Responsive'))) ? "img-responsive" : "";
  var pull = String(T4Utils.elementInfo.getElementValue('Pull'));
  var shape = String(T4Utils.elementInfo.getElementValue('Shape'));  
  var sizes = String(T4Utils.elementInfo.getElementValue('Sizes')).trim();
  var cssclass = responsive + " " + pull + " " + shape;   
  cssclass = cssclass.trim();  
  
  	var imagesrc = '<img alt="' + alt + '" class="' + cssclass +'" src="'+ saucepath + '"';  	
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
  	document.write(imagesrc); //write it to the output stream.  
}
catch (e) {   
    document.write(e.message);
}