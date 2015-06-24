# Utility Javascript for T4 Javascript Content Processor
  Ben Margevicius; bdm4@case.edu
	Version 0.1 6/24/2015
   
	Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/
  6/24/2015 - Initial

	Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
