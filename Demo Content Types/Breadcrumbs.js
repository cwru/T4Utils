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

/* 
HTML TO WRiTE
<!-- Breadcrumb row -->
<div class="row"> 
	<div class="col-sm-12">
		<ol class="breadcrumb">
		  <li><a href="/">Home<span class="homeicon glyphicon glyphicon-home glyphicon-pad-left"></span></a></li>
		  <li><a href="#">Children</a></li>
		   ... more children ...
		  <li class="active">Current Section</li>
		</ol>
	</div>
</div>
*/

function writeBreadCrumbs(ancestors) 
{
  	document.write("<div class=\"row\">\n");
	document.write("	<h1 class=\"header-text\">Breadcrumb Demo<\/h1>\n");
	document.write("<\/div>\n");
    document.write("<div class=\"row\">\n");
    document.write("	<div class=\"col-sm-12\">\n");
    document.write("		<ol class=\"breadcrumb\">\n");
 
  	var ancestor = ancestors.length; //cache the length of the rootpath
    while(ancestor--) //reverse order our walk
    {
      var title = T4Utils.getSectionInfo.sectionTitle(ancestors[ancestor]); //cache the section title
      var link = T4Utils.getSectionInfo.sectionLink(ancestors[ancestor]);	//cache the section link
      
      //IF we are a the root add a little home icon , else if we are at the current section add the active class to it, otherwise just spit out a link 
      if(ancestor === ancestors.length - 1) { document.write("<li><a href=\"" + link + "\">" + title +"<span class=\"homeicon glyphicon glyphicon-home glyphicon-pad-left\"><\/span><\/a><\/li>\n"); }
      else if(ancestor === 0) { document.write("<li class=\"active\">" + title + "<\/li>\n"); }  
      else document.write("<li><a href=\""+ link + "\">" + title + "<\/a><\/li>\n");
    }
  
    document.write("		<\/ol>\n");
    document.write("	<\/div>\n");
    document.write("<\/div>\n");
}

var rootpath = T4Utils.getSectionInfo.getRootPath(section);
writeBreadCrumbs(rootpath);