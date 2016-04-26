/*
* Inject T4 Dependencies within our Utils class
* https://github.com/young-steveo/bottlejs
* 
* Methodology
* Given the circumstances, I am not sure I did this correctly. The way I did this is more like an interface.
* I specifically avoided 'constructor' based DI resolution because I wanted to keep T4Objects out of content types. i.e. T4Utils.doSomethingWithMedia(MediaManager.getManager()); 
* That would mean if on upgrade of T4, and the media manager would change you'd have to update all of you content types.
* So what I did is with the bottlejs DI container library put all of T4 dependencies in there. This will no pollution in the global namspace.
* Then I pass bottle to T4Utils in base.js. I think this is a form of interface injection, or maybe you can call it prototype injection. 
* Then you can reference your dependencies throughout the class with T4Utils.Bottle.container.<dependency>.
*
* When we start implementing unit tests we'll see if this method works. The next thing to do is mock T4 Classes.
* Since T4Objects objects don't exist in a test we could just implement the parts of them that is used in the utility.
* I am guessing it would look something like:
*
* http://stackoverflow.com/questions/1635800/javascript-best-singleton-pattern
* http://www.dofactory.com/javascript/singleton-design-pattern
* var ContentManager = (function () {
    var instance;
 
    function createInstance() {
        var object = new Object("I am the ContentManager");
        return object;
    }
 
    return {
        getManager: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
		getId: function() {
			return 1;
		}
		//other instance methods here. 
    };
})();
var instance1 = ContentManager.getManager();
var instance2 = ContentManager.getManager();
 
  alert("Same instance? " + (instance1 === instance2));  
*/
/**
* @file dependencyinject.js
* @version v1.0.3
* @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
* @author Ben Margevicius 
* @date April 15, 2016
* Copyright 2016. MIT licensed.
*/


/* jshint strict: false */
var bottle = (function(undefined) {
	var b = new Bottle(); //setup our DI container
	b.service('oCM', function () { return ContentManager.getManager(); });
	b.service('oCH', function () { return new ContentHierarchy(); }); //??????
	b.service('oConn', function() { return dbStatement.getConnection(); }); //https://community.terminalfour.com/forum/index.php?topic=477.0
	b.service('oMM', function() { return MediaManager.getManager(); });
	b.service('oMU', function() { return MediaUtils; }); 	
	return b;
})();


