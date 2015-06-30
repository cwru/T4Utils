# Utility Javascript for T4 Javascript Content Processor
  Ben Margevicius; bdm4@case.edu
	Version 0.11 6/30/2015
   
	Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/
	
	Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
	
	Adding an image from the media library
	document.write(T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="123288" formatter="image/*"/>'));
