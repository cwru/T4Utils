/* 
	T4Utils Version 8.1.00 
	Written by Ben Margevicius 
	bdm4@case.edu
	3/9/2016

	My versioning scheme is going to change a little since the first version of T4Utils.	
	I am going to do something like T4Major.T4Minor.T4UtilsBuild_YYMMDD. So the initial T4Utils of version on Jan 1 2016
	Terminal Four Site Manger 8.1 is 8.1.00_160101, the next will be 8.1.01 and so on...
	
	
*/
var T4Utils = (function(utils) {
	utils.version = '8.1.00_160309';
	//Create our namespaces
	utils.siteManager = utils.siteManager || {};
	utils.brokerUtils = utils.brokerUtils || {};
	utils.elementInfo = utils.elementInfo || {};
	utils.getSectionInfo = utils.getSectionInfo || {};
	utils.media = utils.media || {};
	utils.security = utils.security || {};
	
	
	/**
		Console utils for debugging. Don't leave these in your layouts.. 
		T4Utils.console.log("log message");
		T4Utils.console.warn("warning");
		T4Utils.console.error("error message");
		T4Utils.console('<console method>', '<message>');
	**/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
	}
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	}
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	}
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	}	
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    }
	

	/**
	SiteManager NameSpace 
	
	**/

	
	return utils;
})(T4Utils || {});



