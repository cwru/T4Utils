/*
	7/20/15
	Writes a NAV Bar the bootstrap (3.3.5) way. Allows for dropdowns and icons and other neato things given by bootstraps. NAVbar.
	V0.2 - With the addition of the getSectionInfo.getChildren() we don't have to call isSectionHiddenInNAV() anymore, also this fixes the issue where items on the NAV bar is not outputting in the same order as listed in the site manager.
*/

/* 
	Utility Javascript for T4 Javascript Content Processor
   	Ben Margevicius; bdm4@case.edu
	Version 0.14.0
   
	Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/	
*/
 
importClass(com.terminalfour.publish.PathBuilder); //import the pathbuilder class

//IIFE for t4Utils. NOTE you can't use the window namespace for window.ns = window.ns || {} 
var T4Utils = (function (utils) {  	
	utils.version = 'v0.14.0';	
	
	/* Console utils for debugging. Don't leave these in your layouts.. 
		T4Utils.console.log("log message");
		T4Utils.console.warn("warning");
		T4Utils.console.error("error message");
		T4Utils.console('<console method>', '<message>');
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
    	This is an adaptation of the CachedSection.GetChildren method in the API. 		
        There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
        This method will output the expected order in the site manager.
        if is isHiddenInNAV is true then it will NOT output hidden sections.
	*/
	utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
      	if (isHiddenInNAV === undefined) {
      		isHiddenInNAV = false;
        }
		return section.getChildren(publishCache.channel, language, isHiddenInNAV);
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
      this.name = "";
      this.link = "";
      this.children = [];
  };
  
  //T4Utils.write("Getting children");
  
  var sectionChildren = T4Utils.getSectionInfo.getChildren(t4section, true); //Added in 0.14. This will display the correct order of navlinks, and not show hidden links as well!
  //var sectionChildren = t4section.getChildren(); //get the children object
  //var sectionChild = sectionChildren.length; //counter for the while loop
  for(sectionChild = 0; sectionChild < sectionChildren.length; sectionChild++)
  {
      var childsection = sectionChildren[sectionChild]; //cache the child section
      var child = new _mysection();
      child.name = T4Utils.getSectionInfo.sectionTitle(childsection);
      child.link = T4Utils.getSectionInfo.sectionLink(childsection);
      
      //T4Utils.write("Added child " + T4Utils.getSectionInfo.sectionTitle(childsection));
      var sectionGrandChildren =  T4Utils.getSectionInfo.getChildren(childsection, true);
      for(sectionGrandChild = 0; sectionGrandChild < sectionGrandChildren.length; sectionGrandChild++)
      {    	     
        var grandchildsection = sectionGrandChildren[sectionGrandChild]; //cache the grandchild section
        //T4Utils.write("Added grand child " + T4Utils.getSectionInfo.sectionTitle(grandchildsection));
        if(grandchildsection.isVisibleInNavigation())
        {  
          child.children.push(grandchildsection);
        }
      } //end for
      _mysections.push(child);         
	}//end for
  return _mysections;
}

var mysections = getSectionChildrenAndGrandChildren(section); 
var rootpath = T4Utils.getSectionInfo.getRootPath(section.getParent()); //get the path to root for the first menu item, I don't want to include this page so get it's parent as the first menu item
if(mysections.length === 0) //there are no children in the navbar. so lets see if we can add some siblings instead.
{
  /*
  if('true' == T4Utils.elementInfo.getElementValue('show siblings')) {
  	var parentsection = section.getParent();
    var siblings = parentsection.getChildren();
  }*/
  mysections = getSectionChildrenAndGrandChildren(section.getParent()); //gets the siblings and thier children of this. 
}


writeNAVBar(rootpath, mysections);


/*Write BootStrap NAVBar 
Rules:
 	1) No GreatGrand Children menus/ sub-sub menus/ Dropdowns will NOT have other dropdowns. This is stamped and sealed by twitter bootstrap. Thou shalt not whine. 
    2) If a section has grandchildren, they are listed in a drop down list (DDL). The root of the DDL is not a navigatable anchor tag <a href="#">Home</a>. If it is kiss your responsive mobile menus goodbye. 
    3) If a section does not have grandchildren it is a navigatable anchor tag.

params: 
ancestors is an array of sections to root    
children is an object with the name, link of a child and an array of names and links to it's grandchildren.
*/
function writeNAVBar(ancestors, sections)
{  
document.write("<nav class=\"navbar navbar-default\" role=\"navigation\">");
document.write("  	<div class=\"navbar-header collapsed\" data-toggle=\"collapse\" data-target=\"#mobile-navbar-collapse\">");
document.write("      <a id=\"mobile-nav-header\" class=\"visible-xs text-center \" href=\"#\"><span class=\"glyphicon glyphicon-list-alt \" style=\"padding-right:3px;\"><\/span> Navigation & Search<\/a>");
document.write("    <\/div>");
document.write("    <div class=\"collapse navbar-collapse\" id=\"mobile-navbar-collapse\">");
document.write("       <form class=\"navbar-form navbar-left visible-xs\" role=\"search\" action=\"\/\/www.google.com\/cse\"  target=\"_parent\" name=\"searchForm\">");
document.write("       <input type=\"hidden\" name=\"cx\" value=\"013802920388319893419:7wtcwv_ppd8\" \/>");
document.write("       <input type=\"hidden\" name=\"ie\" value=\"UTF-8\" \/>");
document.write("        ");
document.write("         <div class=\"input-group\">");
document.write("			<label for=\"mobile-search-text\" class=\"sr-only\">Search<\/label>");
document.write("      		<input id=\"mobile-search-text\" size=\"30\" name=\"q\" type=\"text\" class=\"form-control\" placeholder=\"Google Search...\" onfocus=\"if(!this._haschanged){this.value=''};this._haschanged=true;\">");
document.write("      		<span class=\"input-group-btn\">");
document.write("        		<button class=\"btn btn-default\" type=\"submit\" name=\"sa\">");
document.write("                	<!-- Search -->");
document.write("                	<span class=\"glyphicon glyphicon-search\"><\/span>");
document.write("					<span class=\"sr-only\">search button<\/span>");
document.write("                <\/button>");
document.write("      		<\/span>");
document.write("    	<\/div><!-- \/input-group -->");
document.write("      <\/form>");

  
  
//Start Writing the NAV Lists  
document.write("      <ul class=\"nav navbar-nav\">\n");

//First lets write our first menu item
document.write("<li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\">Home<span class=\"caret\"></span></a>\n");
document.write("<ul class=\"dropdown-menu\" role=\"menu\">\n");  
for(ancestor = 0; ancestor < ancestors.length; ancestor++)
{  
	document.write("<li><a class=\"smaller-menu\" href=\"" +  T4Utils.getSectionInfo.sectionLink(ancestors[ancestor]) + "\">" + T4Utils.getSectionInfo.sectionTitle(ancestors[ancestor]) + "<\/a><\/li>\n");
} 
document.write("<\/ul><\/li>\n");  
//end the ancestors menu bit

//start writing children and grandbabies.
for(i = 0; i < sections.length; i++)
{  
  var children = sections[i].children; 
  if(children.length > 0) //if there is grand children 
  {
  	document.write("<li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\">" + sections[i].name + "<span class=\"caret\"></span></a>");
    document.write("<ul class=\"dropdown-menu\" role=\"menu\">");
    document.write("<li><a class=\"smaller-menu bg-info\" href=\"" + sections[i].link+ "\"><span class=\"glyphicon glyphicon-home glyphicon-pad-right glyphicon-menu-icon\"><\/span>" + sections[i].name + "<\/a><\/li>");    
    for(k = 0; k < children.length; k++)
    {
    	document.write("<li><a class=\"smaller-menu\"  href=\"" + T4Utils.getSectionInfo.sectionLink(children[k]) + "\">" + T4Utils.getSectionInfo.sectionTitle(children[k]) + "<\/a><\/li>");
    }    
    document.write("<\/ul><\/li>");
  }
  else
  {	
	//child with no grand children.    
    document.write("<li><a href=\"" + sections[i].link+ "\">" + sections[i].name + "<\/a><\/li>");
  } 
}  
document.write("      <\/ul>"); //close ul class= NAV LEFT

//Write any right side navbar links 
var addrightlinks = ('true' == content.get('Add sitelinks').publish()); //convert text to boolean   
if(addrightlinks)
{
  document.write("<ul class=\"nav navbar-nav navbar-right\">");
    document.write("        <li class=\"dropdown\">");
  document.write("          <a style=\"font-weight:200;color: #993CF3;\" href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Faculty + Staff <span class=\"caret\"><\/span><\/a>");
  document.write("          <ul class=\"dropdown-menu\">");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Preceptors<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Resources<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">IT<\/a><\/li>");
  document.write("            <li role=\"separator\" class=\"divider\"><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">DOX<\/a><\/li>");
  document.write("          <\/ul>");
  document.write("        <\/li>");
  
  document.write("        <li class=\"dropdown\">");
  document.write("          <a style=\"font-weight:200;color: #993CF3;\" href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Alumni <span class=\"caret\"><\/span><\/a>");
  document.write("          <ul class=\"dropdown-menu\">");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Homecoming 2015<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Events<\/a><\/li>");
  
  document.write("          <\/ul>");
  document.write("        <\/li>");
  
  
  document.write("        <li class=\"dropdown\">");
  document.write("          <a style=\"font-weight:200;color: #993CF3;\" href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">News <span class=\"caret\"><\/span><\/a>");
  document.write("          <ul class=\"dropdown-menu\">");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Magazine<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Calendars<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Events<\/a><\/li>");
  document.write("          <\/ul>");
  document.write("        <\/li>");
  
  document.write("        <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Giving<\/a><\/li>");
  
  
  
  
  document.write("        <li class=\"dropdown\">");
  document.write("          <a style=\"font-weight:200;color: #993CF3;\" href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Students <span class=\"caret\"><\/span><\/a>");
  document.write("          <ul class=\"dropdown-menu\">");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">New/Admitted<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">Organizations<\/a><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">LRC<\/a><\/li>");
  document.write("            <li role=\"separator\" class=\"divider\"><\/li>");
  document.write("            <li><a style=\"font-weight:200;color: #993CF3;\" href=\"#\">International<\/a><\/li>");
  document.write("          <\/ul>");
  document.write("        <\/li>");
  document.write("      <\/ul>");  
}  
  
document.write("   <\/div>"); //close <div class=collapse navbar-collapse\
document.write("<\/nav>"); //close nav element
}