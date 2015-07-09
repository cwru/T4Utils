/* 
	Left Nav using bootstrap pills 
    By Ben Margevicius bdm4@case.edu
    7/8/2015
    V0.1 initial.
    v0.2 Added Element title 
    Right now the left navbar will only show the siblings of the parent.	
*/

/* 
	Utility Javascript for T4 Javascript Content Processor
   	Ben Margevicius; bdm4@case.edu
	Version 0.13.2
   
	Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/	
*/
importClass(com.terminalfour.publish.PathBuilder); //import the pathbuilder class

//IIFE for t4Utils. NOTE you can't use the window namespace for window.ns = window.ns || {} 
var T4Utils = (function (utils) {
  	/* T4Utils.write 
       Writes some text between some paragraph tags
    */
	//version of this utility class
	utils.version = 'v0.13.2';	
	
	/*
		Basic console writing method.
		Usage: 
		T4Utils.console('log','Hello from console');
		T4Utils.console('warn','warning from console');
		
		ToDo: write objects to the console... 
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
	};
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	};
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	};
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")			
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	};
	
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    };
    
	/* 
		sitemanager namespace gets information about the sitemanager 	
	*/
	utils.siteManager = utils.siteManager || {};
	//write the version of T4 you are working with.
	utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;	
	utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;
	utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");
	/* 
		BrokerUtils NameSpace does something. I dunno yet.. I'll have to read the API :) 
	
	*/
	utils.brokerUtils = utils.brokerUtils || {};
	utils.brokerUtils.processT4Tag = function (t4Tag) {
		var myContent = content || null; 
		return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag); 
	};
	/*
	  contentInfo namespace gets information about content	
		note: in layouts content will be null.
	*/
	utils.elementInfo = utils.elementInfo || {};
	utils.elementInfo.getElements = function() {
		var c = content || null;
		if(c !== null)
			c.getElements();	
	}
	utils.elementInfo.getElementValue = function(elementName) 
	{
		var c = content || null; 
		if(c !== null)
			return c.get(elementName).publish();		
	}
	//This may not work. 
	utils.elementInfo.getElementName = function(element) 
	{
		var c = content || null; 
		if(c !== null)
			return c.get(element).getName();		
	}
		
	
    /* 
	
		getSectionInfo namespace gets 
       information about a section. duh.       
    */
    utils.getSectionInfo = utils.getSectionInfo || {};
  	//getPublishLink will return the publishing Link 
    utils.getSectionInfo.getPublishLink = function () {
        return this.publishLink;
    };
    //sets the publishlink object
    utils.getSectionInfo.setPublishLink = function (section) {
        this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
    };
    
  	//gets the section title for the section passed in
    utils.getSectionInfo.sectionTitle = function (section) {
        this.setPublishLink(section);
        return this.publishLink.getText();
    };
  
  	//gets the url for the section passed in
    utils.getSectionInfo.sectionLink = function (section) {
        this.setPublishLink(section);
        return this.publishLink.getLink();
    };
  
  	//returns a fully formed anchor link for the section passed in
    utils.getSectionInfo.anchorLink = function (section) {
        this.setPublishLink(section);
        var theLink = this.publishLink.getLink();
        var theText = this.publishLink.getText();
        var myLink = '<a href="' + theLink + '">' + theText + '</a>';
        return myLink;
    };
   	
  
  //outputs the directory from "section" in a string format
   	utils.getSectionInfo.getDirectory = function(section) {
      	return PathBuilder.getDirectory(section, publishCache, language).toString();		
    }
    
  /*
  	GetRootPath(section, path)
    Usage T4Utils.getSectionInfo.getRootPath(section); //section is predefined in t4 as the section you are in. 
    Returns an array of sections until root. Including the current section.    
  */
    utils.getSectionInfo.getRootPath = function (nextNode, path) {             
      path = path || []; //if the path is empty create on e
      path.push(nextNode);  //add the next node
      var parentnode = nextNode.getParent();  //get the next node.    
      if (parentnode !== null) return this.getRootPath(parentnode, path); //if the next node is not nothing, get the next node and repeat until nothing. 
      else return path;  //when all the nodes have been gotten return the path. 
    };    
  
    return utils; //return out of the module 
})(T4Utils || {});

function getSectionChildrenAndGrandChildren(t4section) {  
  var _mysections = [];
  var _mysection = function() {
      this.name = '';
      this.link = '';
      this.children = [];
  };
  
  //T4Utils.write("Getting children");
  var sectionChildren = t4section.getChildren(); //get the children object
  var sectionChild = sectionChildren.length; //counter for the while loop
  while(sectionChild--) 
  {
      var childsection = sectionChildren[sectionChild]; //cache the child section
      
      if(childsection.isVisibleInNavigation())
      {  
        var child = new _mysection();
        child.name = T4Utils.getSectionInfo.sectionTitle(childsection);
        child.link = T4Utils.getSectionInfo.sectionLink(childsection);
      
        //T4Utils.write("Added child " + T4Utils.getSectionInfo.sectionTitle(childsection));
        var sectionGrandChildren = childsection.getChildren();    
        var sectionGrandChild = sectionGrandChildren.length; //counter for the while loop
        while(sectionGrandChild--)
        {      
          var grandchildsection = sectionGrandChildren[sectionGrandChild]; //cache the grandchild section
          //T4Utils.write("Added grand child " + T4Utils.getSectionInfo.sectionTitle(grandchildsection));
          if(grandchildsection.isVisibleInNavigation())
          {  
              child.children.push(grandchildsection);
          }
        }
        _mysections.push(child);
      }   
	}//end while
  return _mysections;
}

var mysection = section.getParent(); //get the parent section. 
var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section); //current section title

if(sectionTitle == 'LColumn' || sectionTitle == 'RColumn') {  //If the left nav is nested in a hidden section then we have to traverse back to the grandparent.     
  	sectionTitle = T4Utils.getSectionInfo.sectionTitle(mysection); //current section title; //change the section title to the name of the grandparent..
  	mysection = mysection.getParent(); //get the grantparent.
}
var siblings = getSectionChildrenAndGrandChildren(mysection); //gets the siblings and thier children of this.


writeLeftNAV(siblings, sectionTitle);
function writeLeftNAV(sibs, currSectionTitle)
{  
  	try
    {
      var title = T4Utils.elementInfo.getElementValue('Title');
      if(title !== null)
      {         
      	document.write("<h3>" + title + "<\/h3>\n");
      }
      
      document.write("<ul class=\"nav nav-pills\">\n");  
    
      for(sibling = 0; sibling < sibs.length; sibling++)
      {	            	
          var n = String(sibs[sibling].name);
          var s = String(currSectionTitle);
          
          if(n !== s)
          {
              document.write("<li role=\"presentation\"><a href=\""+ sibs[sibling].link +"\">" + n + "<\/a><\/li>\n");
          }
          else          
          {
              T4Utils.console.log("adding active");          
              document.write("<li role=\"presentation\" class=\"active\"><a href=\""+ sibs[sibling].link +"\">" + n + "<\/a><\/li>\n");
          }
      }    
      document.write("<\/ul>\n");
    }
  	catch(err)
    {
      T4Utils.console.error("Failed to write the left nav bar with error: " + err.message);
    }
}


/*
<h3>2 column menu</h3>
<ul class="nav nav-pills">
	<li role="presentation" class="active"><a href="#2-column-aside">2 Column (w/aside)</a> </li>
	<li role="presentation"><a href="#2-column-staff">2 Column (staff)</a></li>
	<li role="presentation"><a href="#2-column-video">2 Column (w/video)</a></li>
	<li role="presentation"><a href="#2-column-banner">2 Column (w/banner)</a></li>
	<li role="presentation"><a href="#2-column-thumbs">2 Column (w/thumbs)</a></li>		 
</ul>
*/
T4Utils.console.log("left nav working");

