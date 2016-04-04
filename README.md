[![forthebadge](http://forthebadge.com/images/badges/powered-by-case-western-reserve.svg)](http://forthebadge.com)

  Ben Margevicius; bdm4@case.edu
	Version 1.0.0 4/4/2016
   
	Github source: https://github.com/FPBSchoolOfNursing/T4Utils/
	
	#Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	#Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
	
	#Namespace extending:
	T4Utils.blah = T4Utils.blah || {};
	T4Utils.blah.hello = function() {
		T4Utils.write("hello");   
	}	
	T4Utils.blah.hello(); //writes hello
	
	#Adding an image from the media library:
	document.write(T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="123288" formatter="image/*"/>'));
	
	#Try catch with console error 
	
	try {}
	catch (err) {
		T4Utils.console.error(err.message);
	}
