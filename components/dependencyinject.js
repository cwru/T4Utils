/**
* Inject T4 Dependencies within our Utils class
* This is a crude way of using the DI pattern. However, given the circumstances I chose this way to handle dependency resolution.
* I added the bottlejs injection lib.  
* https://github.com/young-steveo/bottlejs
* 
* Methodology
* We could go full constructor style injection into our components, however that would cause a little bit of a headache
* When resolving those dependencies from programmable content type in T4. Essentially you'd have to call 
* bottle.container.<injected>. Bottle is resolved in the T4Util.js file that resides in the media library. This makes knowing to do something from the content creation POV like T4Utils.SomeNamespace.Method(bottle.container.oCM) a little weird. 

We could of created our dependencies in the bottle object like
bottle.service('T4Utils.namespace.method', T4Utils.namespace.method, 'dependency1')
But then in order to consume the method from the content type you'd have to call it by doing bottle.container.T4Utils.namespace.method
* Which is also not the easiest thing to know. 
*
* So as of the writing of this I am going to go with a glofied global variable. This way we can resolve our dependencies within the media library, without polluting the global namespace with global variables. 
*
* dependencyinject.js
* @version v1.0.3
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
* @author Ben Margevicius 
* @date April 15, 2016
* Copyright 2016. MIT licensed.
*/
/* jshint strict: false */
var bottle = new Bottle(); //setup our DI container

bottle.service('oCM', function () { return ContentManager.getManager(); });
bottle.service('oCH', function () { return new ContentHierarchy(); }); //??????
bottle.service('oConn', function() { dbStatement.getConnection(); }); //https://community.terminalfour.com/forum/index.php?topic=477.0
