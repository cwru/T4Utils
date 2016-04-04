/* 
	Right Nav using bootstrap pills 
    By Ben Margevicius bdm4@case.edu
	9/1/2015
    V0.1 initial.
    v0.2 Added regex test to check for http:// on external links, rearranged the order of links. internal links return 'null' where as external links return ''
   
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

try
{   
  	var links = [];
  	var linksobj = function() {
      this.link = "";     
      this.iconcls = "";
      this.text = "";
    };
  	
    var colorcls = String(T4Utils.elementInfo.getElementValue('Color'));
  	var navcolor = (colorcls === 'btn-blue') ? 'blue-nav' : 'gray-nav';
  
  	for(i = 1; i <= 10; i++)
    {
   		var l = new linksobj();  
      	
      	
    	l.text = String(T4Utils.elementInfo.getElementValue('External Link Text ' + i));
      	l.text += String(T4Utils.brokerUtils.processT4Tag('<t4 type="content" name="Internal Link ' + i +'" output="linktext" modifiers="medialibrary, nav_sections"  />')); 
      	l.text = l.text.trim();
      	
      	l.link = String(T4Utils.elementInfo.getElementValue('External Link ' + i));  
      	
      	//if the link is external and doesn't start with http:// add it. 
      	if(l.link !== '' && !/^https?:\/\//.test(l.link)) 
        { 
          l.link = 'http://' + l.link; 	
        }
      
      	l.link += String(T4Utils.brokerUtils.processT4Tag('<t4 type="content" name="Internal Link ' + i + '" output="linkurl" modifiers="medialibrary, nav_sections"  />'));
      	l.link = l.link.trim();
      
      	l.iconcls = String(T4Utils.elementInfo.getElementValue('Icon Class ' + i));
      	//add in fixed width icons. 
      	if(l.iconcls.indexOf('fa') !== -1 && l.iconcls.indexOf("fa-fw") === -1)
        {
          	l.iconcls += " fa-fw";
        } 
        else if(l.iconcls.indexOf("glyphicon") !== -1 && l.iconcls.indexOf("glyphicon-fw") === -1)
        {
         	l.iconcls += " glyphicon-fw"; 
        }
      
      	if(l.link !== '' && l.text === '')
        {
          T4Utils.console.error("Right side NAV says: A Url is specified but text is missing. See link number " + i + " and add text to the link.");
        }
      
      	if(l.text === 'null' || l.text === '' || l.text === null) {           	
		 	break;  // if the links are both blank stop the for loop.
        }      	
  		links.push(l);        
    }  	
  	if(links.length)
    {
    	writeNAV(navcolor, links);    
    }
    else	
    {
      throw new Error("Right Side NAV: There are no links in the NAV.");
    }
}
catch (e) {   
    document.write(e.message);
}


function writeNAV(colorcls, links)
{
  /* HTML TO WRITE 
  		<ul id="rightnav" class="nav nav-pills nav-stacked gray-nav">
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-lock"></span>Gray Link 2</a></li>
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-comment"></span>Gray Link 3</a></li>
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-envelope"></span>Gray Link 4</a></li>
		</ul>	
		<ul id="rightnav" class="nav nav-pills nav-stacked blue-nav">
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-lock"></span>Blue Link 2</a></li>
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-comment"></span>Blue Link 3</a></li>
			<li role="presentation"><a title="" href="#"><span class="glyphicon glyphicon-envelope"></span>Blue Link 4</a></li>
		</ul>
        
   */ 
  document.write("<ul id=\"rightnav\" class=\"nav nav-pills nav-stacked " + colorcls + "\">");  
  for(i = 0; i < links.length; i++)
  {
   	document.write("<li role=\"presentation\">");
    document.write("<a href=\"" + links[i].link + "\" target=\"_blank\"><span class=\"" + links[i].iconcls + " glyphicon-pad-right\"></span>" + links[i].text + "</a>");
  	document.write("</li>");
  }
  document.write("</ul>");
  
}