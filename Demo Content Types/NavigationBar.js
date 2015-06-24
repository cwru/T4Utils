/* 
	Bootstrap NAVBAR replacement for T4 
   	Ben Margevicius; bdm4@case.edu
	Version 6/24/2015
    
    The rules for boot strap navigation:
    1) No GreatGrand Children menus/ sub-sub menus/ Dropdowns will NOT have other dropdowns. This is stamped and sealed by twitter bootstrap. Thou shalt not whine. 
    2) If a section has grandchildren, they are listed in a drop down list (DDL). The root of the DDL is not a navigatable anchor tag <a href="#">Home</a>. If it is kiss your responsive mobile menus goodbye. 
    3) If a section does not have grandchildren it is a navigatable anchor tag.
    
    Github source: https://github.com/CaseWesternReserveUniversity/T4Utils/
    
    6/24/2015 - Initial 	
*/
 
importClass(com.terminalfour.publish.PathBuilder); //import the pathbuilder class

//IIFE for t4Utils. NOTE you can't use the window namespace for window.ns = window.ns || {} 
var T4Utils = (function (utils) {
  	/* T4Utils.write 
       Writes some text between some paragraph tags
    */
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>");
    }
    
    /* getSectionInfo namespace gets 
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


var mysections = [];
var mysection = function() {
    this.name = "";
    this.link = "";
    this.children = [];
};

//T4Utils.write("Getting children");
var sectionChildren = section.getChildren(); //get the children object
var sectionChild = sectionChildren.length; //counter for the while loop
while(sectionChild--) 
{
  	var childsection = sectionChildren[sectionChild]; //cache the child section
    var child = new mysection();
  	child.name = T4Utils.getSectionInfo.sectionTitle(childsection);
    child.link = T4Utils.getSectionInfo.sectionLink(childsection);
  
  	//T4Utils.write("Added child " + T4Utils.getSectionInfo.sectionTitle(childsection));
  	var sectionGrandChildren = childsection.getChildren();    
  	var sectionGrandChild = sectionGrandChildren.length; //counter for the while loop
  	while(sectionGrandChild--)
    {      
      var grandchildsection = sectionGrandChildren[sectionGrandChild]; //cache the grandchild section
      //T4Utils.write("Added grand child " + T4Utils.getSectionInfo.sectionTitle(grandchildsection));
      child.children.push(grandchildsection);
    }
  	mysections.push(child);
}

var rootpath = T4Utils.getSectionInfo.getRootPath(section); //get the path to root for the first menu item
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
document.write("      <\/ul>"); //close ul class= NAV
document.write("   <\/div>"); //close <div class=collapse navbar-collapse\
document.write("<\/nav>"); //close nav element
}