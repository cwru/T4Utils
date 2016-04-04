/* 
	Bootstrap BreadCrumbs based on 3.3.5 Bootstrap   
    By Ben Margevicius bdm4@case.edu
	11/2/2015
    V0.1 initial.
    V0.2 11/2/15 Added two new methods to the to the util class to handle steps from current section, and steps from root. Root is assumed to be level 0.
    v0.3 2/17/16 Removed Row. It's unnecessary.
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
HTML TO WRiTE
<!-- Breadcrumb row -->

		<ol class="breadcrumb">
		  <li><a href="/">Home<span class="homeicon glyphicon glyphicon-home glyphicon-pad-left"></span></a></li>
		  <li><a href="#">Children</a></li>
		   ... more children ...
		  <li class="active">Current Section</li>
		</ol>
*/

function writeBreadCrumbs(ancestors) 
{  
    /* unnessary markup document.write("<div class=\"row\">\n");
    document.write("	<div class=\"col-sm-12\">\n");
    */
    document.write("<ol class=\"breadcrumb\">\n");
 
  	var ancestor = ancestors.length; //cache the length of the rootpath
    while(ancestor--) //reverse order our walk
    {
      var title = T4Utils.getSectionInfo.sectionTitle(ancestors[ancestor]); //cache the section title
      var link = T4Utils.getSectionInfo.sectionLink(ancestors[ancestor]);	//cache the section link
      
      //IF we are a the root add a little home icon , else if we are at the current section add the active class to it, otherwise just spit out a link 
      if(ancestor === ancestors.length - 1) { document.write("<li><a href=\"" + link + "\">" + title +"<span class=\"homeicon fa fa-home fa-pad-left\"><\/span><\/a><\/li>\n"); }
      else if(ancestor === 0) { document.write("<li class=\"active\">" + title + "<\/li>\n"); }  
      else document.write("<li><a href=\""+ link + "\">" + title + "<\/a><\/li>\n");
    }
  
    document.write("		<\/ol>\n");
  /* unnessary markup 
  document.write("	<\/div>\n");
    document.write("<\/div>\n");*/  
}



try
{
  	var rootlevel = T4Utils.getSectionInfo.getPathUntilLevel(2, section);
  	writeBreadCrumbs(rootlevel);
}
catch(err)
{
  	document.write(err.message);
}
