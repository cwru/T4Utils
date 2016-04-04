/*
	Bootstrap carousel - fixed.
    
    v0.1 - 9/17/2015 - initial. 
	V0.2 - Changed the output foramtter from image to path. THis way we don't get the <span class="fig-image-" bs
    V0.3 - 10/2/2015 - Added the bootstrap image code in to load the best variant into 
    v0.4 - Added ID.
*/

importClass(com.terminalfour.publish.utils.BrokerUtils);
try {
	var utils = eval(String (com.terminalfour.publish.utils.BrokerUtils.processT4Tags (dbStatement, publishCache, section, null, language, isPreview, '<t4 type="media" id="123627" formatter="inline/*"/>')));
} catch (e) {
    if (e instanceof SyntaxError) {
        document.write(e.message);
    } else {
        throw( e );
    }
}


/* Added in 0.3 of the bootstrap carousel. This is taken from the Bootstrap Image Type. */
//mediaElementName. There is an element that points to a media type. I need to know that the name of that element.
function getImgTag(mediaElementName)
{
  try
  {  
    if(!mediaElementName) throw "media element missing";
    
    var source = String(mediaElementName);
    var myid = T4Utils.elementInfo.getElementID(source);
    var variants = T4Utils.media.getImageVariantsIds(source); //get the variants of the media element
    var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media 
    var sourceDimensions = T4Utils.media.getImageDimensions(sourceMediaObject);
    
    var saucepath = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="'+ myid +'" formatter="path/*"/>');
    
    var imagesrc = '<img alt=\"This image is in a carousel\" src=\"'+ saucepath + '\"';  	
    var variantIDs = T4Utils.media.getImageVariantsIds(source);
      
    if(variantIDs.length) {
          imagesrc += ' srcset="' + saucepath + ' ' + sourceDimensions.width + 'w, '; 
          
          for(i = 0; i < variantIDs.length; i++)
          {
              var variantObj = T4Utils.media.getMediaObject(variantIDs[i]); //Get the object from the id
              var dimensions = T4Utils.media.getImageDimensions(variantObj); //get the dimensions of the image
              var variantpath = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="'+ variants[i] +'" formatter="path/*"/>'); //get the src path
              imagesrc += variantpath + ' ' + dimensions.width + 'w, '; //concat our srcset tag. 
          }     	
          imagesrc = imagesrc.slice(0, -2); //remove the trailing ', '
          imagesrc += '\"'; //add our double quotes      
          
      }	
    
      imagesrc += ' />';   //cap our html element.
      return imagesrc; //write it to the output stream.  
  }
  catch (e) {   
      document.write(e.message);
  }
}


/* Some objects to store our images that go into the slide show*/
var myImage = function() {
  var name = "";
  var element = "";  
  var captionHTML = ""; //Note there is an issue when you put section links in the HTML. They render as <t4 tags>. Right now I can't figure out how to get the anchor from the section link t4 tag.
};

var myImages = [];
var els = content.list(); //returns a string array of element names
var imgno = 1;

for(i = 0; i < els.length; i++)
{
 	var el = els[i]; //get the element
 	if(el.indexOf("Image " + imgno) === 0) //if the element name starts with Image and contains a t4 tag
    { 	
      	
      	try
        {         
          var myimg = new myImage(); //create new img object      
          var myid = T4Utils.elementInfo.getElementID(el);
          T4Utils.console.log(myid);
          if(!myid) { continue; }
                   
          myimg.element = el;	//store the values "Image N"
          myimg.captionHTML = String(T4Utils.brokerUtils.processT4Tag('<t4 type="content" name="Image ' + imgno + ' Caption" output="normal" modifiers="medialibrary, nav_sections"  />'));  
  	
		  //myimg.captionHTML = T4Utils.elementInfo.getElementValue("Image "+ imgno +" Caption"); //get the caption for the matching Image.          
          myImages.push(myimg);  //add to array for use later.
		  imgno++; //skip the next element which is the caption.           
        }
      	catch(err)
        {
          T4Utils.console.error("Carousel: Line 95: " + err.message);
        }
	}  	
}
writeCarousel(myImages);




function writeCarousel(imagesArr)
{
  
  try {  
  
  
var addbootstrapcaptions = String(T4Utils.elementInfo.getElementValue('Use Bootstrap Style Captions'));
var addindicators = String(T4Utils.elementInfo.getElementValue('Use Indicators')); //convert text to boolean
var htmlid = String(T4Utils.elementInfo.getElementValue('carousel id'));

/* I give up. Converting to Boolean gives the wrong response. 
T4Utils.console.warn("make captions bootstrapy: " + typeof(addbootstrapcaptions) + " " + addbootstrapcaptions);
T4Utils.console.warn("add indicators: " + typeof(addindicators) + " " + addindicators);  
*/
    var hid = (htmlid.length) ? htmlid : 'feature-carousel';
    
document.write('<div id="' + hid + '" class="carousel slide" data-ride="carousel">\n');
if(addindicators === 'true')
{  
  document.write('<ol class="carousel-indicators">');
  for(i = 0; i < imagesArr.length; i++) //for all the images add them to the slide show
  {
    if(i !== 0) {
      document.write('<li data-target="#' + hid + '" data-slide-to="'+ i +'"></li>');    
    }
    else { 
      document.write('<li data-target="#'+ hid +'\" data-slide-to="0" class="active"></li>');
    }
  }
  document.write("</ol>");
}

document.write('<div class="carousel-inner" role="listbox">');

for(j = 0; j < imagesArr.length; j++) 
{ 
  if(j !== 0) {
    document.write("<div class=\"item\">\n"); 
  }
  else { 
    document.write("<div class=\"item active\">\n");  //make the first one 'active' 
  }
 
  document.write(getImgTag(imagesArr[j].element));
  
  if(addbootstrapcaptions === 'true') {
      document.write("<div class=\"carousel-caption\">\n");
  }
  else {
  	  document.write("<div class=\"carousel-caption case-carousel-caption\">\n");
  } 
  
  document.write(imagesArr[j].captionHTML);
  document.write("</div>");
 	
  document.write("</div>"); //close the .item class
} 
document.write("      <\/div>"); //close carousel innner
document.write('      <a class=\"left carousel-control\" href="#' + hid + '" role=\"button\" data-slide=\"prev\">');
document.write("        <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"><\/span>");
document.write("        <span class=\"sr-only\">Previous<\/span>");
document.write("      <\/a>");
document.write('      <a class=\"right carousel-control\" href="#' + hid + '" role=\"button\" data-slide=\"next\">');
document.write("        <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"><\/span>");
document.write("        <span class=\"sr-only\">Next<\/span>");
document.write("      <\/a>");
document.write("    <\/div>  ");
  }
  catch(err)
  {
    document.write(err.message);
  }
}



/*<!-- FEATURE  -->
  <div id="feature-carousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators 
  <ol class="carousel-indicators">
    <li data-target="#feature-carousel" data-slide-to="0" class="active"></li>
    <li data-target="#feature-carousel" data-slide-to="1"></li>
    <li data-target="#feature-carousel" data-slide-to="2"></li>
  </ol>-->

  <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div class="item active">
          <img src="/case-templates/images/banner1232x450-1.png" alt="...">
          <div class="carousel-caption">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a class="nowrap" href="#">Learn More 1 ></a>
          </div>
        </div>
        <div class="item">
          <img src="/case-templates/images/banner1232x450-1.png" alt="...">
          <div class="carousel-caption case-carousel-caption">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a class="nowrap" href="#">Learn More 2 ></a>
          </div>
        </div>  
        <!-- You can put a carosel caption here -->      
      </div>
    
      <!-- Controls -->
      <a class="left carousel-control" href="#feature-carousel" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#feature-carousel" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>  
<!-- .feature -->
*/