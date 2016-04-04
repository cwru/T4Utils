/* 
	Left Nav using bootstrap pills 
    By Ben Margevicius bdm4@case.edu
    8/13/2015
    V0.1 initial.
    v0.2 Added Element title 
	v0.3 Added the util class from the media lib, and changed the base functionality:
    	 The user can select whether to display siblings or children.
    v0.4 Added the code from the topnav bar where the output on the left nav matches the the sitemanager
    v0.5 Fixed the title element. 1/7/2016
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

try
{  
  	var navtype = String(T4Utils.elementInfo.getElementValue('Navigation Type')); //note the convert from object to string. 
  	var mysection = section.getParent(); //use siblings as the default case. 
  	//Setting a switch in case more navtypes are needed. 
  	switch(navtype)
    {
      	case 'Children':        	
        	mysection = section;
        	break;
		case 'Siblings':
      	default:        	
        	//The default case already set. 
        break;
    }
  var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section); //current section title
  
  if(sectionTitle == 'LColumn' || sectionTitle == 'RColumn') {  //If the left nav is nested in a hidden section then we have to traverse back to the grandparent.     
      sectionTitle = T4Utils.getSectionInfo.sectionTitle(mysection); //current section title; //change the section title to the name of the grandparent..
      mysection = mysection.getParent(); //get the grantparent.
  }
  var nodes = getSectionChildrenAndGrandChildren(mysection); //gets the siblings and thier children of this.
  writeLeftNAV(nodes, sectionTitle);
  
}
catch(e)
{
  T4Utils.write(e.message);
}


function writeLeftNAV(sibs, currSectionTitle)
{  
  	try
    {
      var navtitle = String(T4Utils.elementInfo.getElementValue('Title')).trim();
      
      //T4Utils.console.log('navtitle="'+ navtitle.length + '"');
      if(navtitle.length !== 0) //honestly I hate the stupid conversions.
      {         
      	document.write("<h3>" + navtitle + "<\/h3>\n");
      }
      
      document.write("<ul id=\"leftnav\" class=\"nav nav-pills nav-stacked\">\n");  
    
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
              //T4Utils.console.log("adding active");          
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


/* Example output HTML 
<h3>2 column menu</h3>
<ul class="nav nav-pills">
	<li role="presentation" class="active"><a href="#2-column-aside">2 Column (w/aside)</a> </li>
	<li role="presentation"><a href="#2-column-staff">2 Column (staff)</a></li>
	<li role="presentation"><a href="#2-column-video">2 Column (w/video)</a></li>
	<li role="presentation"><a href="#2-column-banner">2 Column (w/banner)</a></li>
	<li role="presentation"><a href="#2-column-thumbs">2 Column (w/thumbs)</a></li>		 
</ul>

T4Utils.console.log("left nav working");
*/
