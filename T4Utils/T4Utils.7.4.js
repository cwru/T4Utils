/**
 * t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * Copyright 2016. MIT licensed.
 * Built: Tue Apr 26 2016 14:46:41 GMT-0400 (Eastern Daylight Time).
 */
;(function(undefined) {
    'use strict';
    /**
     * BottleJS v1.2.3 - 2016-03-04
     * A powerful dependency injection micro container
     *
     * Copyright (c) 2016 Stephen Young
     * Licensed MIT
     */
    
    /**
     * Unique id counter;
     *
     * @type Number
     */
    var id = 0;
    
    /**
     * Local slice alias
     *
     * @type Functions
     */
    var slice = Array.prototype.slice;
    
    /**
     * Map of fullnames by index => name
     *
     * @type Array
     */
    var fullnameMap = [];
    
    /**
     * Iterator used to flatten arrays with reduce.
     *
     * @param Array a
     * @param Array b
     * @return Array
     */
    var concatIterator = function concatIterator(a, b) {
        return a.concat(b);
    };
    
    /**
     * Get a group (middleware, decorator, etc.) for this bottle instance and service name.
     *
     * @param Array collection
     * @param Number id
     * @param String name
     * @return Array
     */
    var get = function get(collection, id, name) {
        var group = collection[id];
        if (!group) {
            group = collection[id] = {};
        }
        if (name && !group[name]) {
            group[name] = [];
        }
        return name ? group[name] : group;
    };
    
    /**
     * Will try to get all things from a collection by name, by __global__, and by mapped names.
     *
     * @param Array collection
     * @param Number id
     * @param String name
     * @return Array
     */
    var getAllWithMapped = function(collection, id, name) {
        return get(fullnameMap, id, name)
            .map(getMapped.bind(null, collection))
            .reduce(concatIterator, get(collection, id, name))
            .concat(get(collection, id, '__global__'));
    };
    
    /**
     * Iterator used to get decorators from a map
     *
     * @param Array collection
     * @param Object data
     * @return Function
     */
    var getMapped = function getMapped(collection, data) {
        return get(collection, data.id, data.fullname);
    };
    
    /**
     * Iterator used to walk down a nested object.
     *
     * If Bottle.config.strict is true, this method will throw an exception if it encounters an
     * undefined path
     *
     * @param Object obj
     * @param String prop
     * @return mixed
     * @throws throw an exception if it encounters an undefined path
     */
    var getNested = function getNested(obj, prop) {
        var service = obj[prop];
        if (service === undefined && globalConfig.strict) {
            throw new Error('Bottle was unable to resolve a service.  `' + prop + '` is undefined.');
        }
        return service;
    };
    
    /**
     * Get a service stored under a nested key
     *
     * @param String fullname
     * @return Service
     */
    var getNestedService = function getNestedService(fullname) {
        return fullname.split('.').reduce(getNested, this);
    };
    
    /**
     * A helper function for pushing middleware and decorators onto their stacks.
     *
     * @param Array collection
     * @param String name
     * @param Function func
     */
    var set = function set(collection, id, name, func) {
        if (typeof name === 'function') {
            func = name;
            name = '__global__';
        }
        get(collection, id, name).push(func);
    };
    
    /**
     * Register a constant
     *
     * @param String name
     * @param mixed value
     * @return Bottle
     */
    var constant = function constant(name, value) {
        var parts = name.split('.');
        name = parts.pop();
        defineConstant.call(parts.reduce(setValueObject, this.container), name, value);
        return this;
    };
    
    var defineConstant = function defineConstant(name, value) {
        Object.defineProperty(this, name, {
            configurable : false,
            enumerable : true,
            value : value,
            writable : false
        });
    };
    
    /**
     * Map of decorator by index => name
     *
     * @type Object
     */
    var decorators = [];
    
    /**
     * Register decorator.
     *
     * @param String name
     * @param Function func
     * @return Bottle
     */
    var decorator = function decorator(name, func) {
        set(decorators, this.id, name, func);
        return this;
    };
    
    /**
     * Map of deferred functions by id => name
     *
     * @type Object
     */
    var deferred = [];
    
    /**
     * Register a function that will be executed when Bottle#resolve is called.
     *
     * @param Function func
     * @return Bottle
     */
    var defer = function defer(func) {
        set(deferred, this.id, func);
        return this;
    };
    
    
    /**
     * Immediately instantiates the provided list of services and returns them.
     *
     * @param Array services
     * @return Array Array of instances (in the order they were provided)
     */
    var digest = function digest(services) {
        return (services || []).map(getNestedService, this.container);
    };
    
    /**
     * Register a factory inside a generic provider.
     *
     * @param String name
     * @param Function Factory
     * @return Bottle
     */
    var factory = function factory(name, Factory) {
        return provider.call(this, name, function GenericProvider() {
            this.$get = Factory;
        });
    };
    
    /**
     * Map of middleware by index => name
     *
     * @type Object
     */
    var middles = [];
    
    /**
     * Function used by provider to set up middleware for each request.
     *
     * @param Number id
     * @param String name
     * @param Object instance
     * @param Object container
     * @return void
     */
    var applyMiddleware = function applyMiddleware(id, name, instance, container) {
        var middleware = getAllWithMapped(middles, id, name);
        var descriptor = {
            configurable : true,
            enumerable : true
        };
        if (middleware.length) {
            descriptor.get = function getWithMiddlewear() {
                var index = 0;
                var next = function nextMiddleware(err) {
                    if (err) {
                        throw err;
                    }
                    if (middleware[index]) {
                        middleware[index++](instance, next);
                    }
                };
                next();
                return instance;
            };
        } else {
            descriptor.value = instance;
            descriptor.writable = true;
        }
    
        Object.defineProperty(container, name, descriptor);
    
        return container[name];
    };
    
    /**
     * Register middleware.
     *
     * @param String name
     * @param Function func
     * @return Bottle
     */
    var middleware = function middleware(name, func) {
        set(middles, this.id, name, func);
        return this;
    };
    
    /**
     * Named bottle instances
     *
     * @type Object
     */
    var bottles = {};
    
    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local hash.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     *
     * @param String name
     * @return Bottle
     */
    var pop = function pop(name) {
        var instance;
        if (name) {
            instance = bottles[name];
            if (!instance) {
                bottles[name] = instance = new Bottle();
                instance.constant('BOTTLE_NAME', name);
            }
            return instance;
        }
        return new Bottle();
    };
    
    /**
     * Map of nested bottles by index => name
     *
     * @type Array
     */
    var nestedBottles = [];
    
    /**
     * Map of provider constructors by index => name
     *
     * @type Array
     */
    var providerMap = [];
    
    /**
     * Used to process decorators in the provider
     *
     * @param Object instance
     * @param Function func
     * @return Mixed
     */
    var reducer = function reducer(instance, func) {
        return func(instance);
    };
    
    /**
     * Register a provider.
     *
     * @param String fullname
     * @param Function Provider
     * @return Bottle
     */
    var provider = function provider(fullname, Provider) {
        var parts, providers, name, factory;
        providers = get(providerMap, this.id);
        parts = fullname.split('.');
        if (providers[fullname] && parts.length === 1 && !this.container[fullname + 'Provider']) {
            return console.error(fullname + ' provider already instantiated.');
        }
        providers[fullname] = true;
    
        name = parts.shift();
        factory = parts.length ? createSubProvider : createProvider;
    
        return factory.call(this, name, Provider, fullname, parts);
    };
    
    /**
     * Create the provider properties on the container
     *
     * @param String fullname
     * @param String name
     * @param Function Provider
     * @return Bottle
     */
    var createProvider = function createProvider(name, Provider) {
        var providerName, properties, container, id;
    
        id = this.id;
        container = this.container;
        providerName = name + 'Provider';
    
        properties = Object.create(null);
        properties[providerName] = {
            configurable : true,
            enumerable : true,
            get : function getProvider() {
                var instance = new Provider();
                delete container[providerName];
                container[providerName] = instance;
                return instance;
            }
        };
    
        properties[name] = {
            configurable : true,
            enumerable : true,
            get : function getService() {
                var provider = container[providerName];
                var instance;
                if (provider) {
                    // filter through decorators
                    instance = getAllWithMapped(decorators, id, name)
                        .reduce(reducer, provider.$get(container));
    
                    delete container[providerName];
                    delete container[name];
                }
                return instance === undefined ? instance : applyMiddleware(id, name, instance, container);
            }
        };
    
        Object.defineProperties(container, properties);
        return this;
    };
    
    /**
     * Creates a bottle container on the current bottle container, and registers
     * the provider under the sub container.
     *
     * @param String name
     * @param Function Provider
     * @param String fullname
     * @param Array parts
     * @return Bottle
     */
    var createSubProvider = function createSubProvider(name, Provider, fullname, parts) {
        var bottle, bottles, subname, id;
    
        id = this.id;
        bottles = get(nestedBottles, id);
        bottle = bottles[name];
        if (!bottle) {
            this.container[name] = (bottle = bottles[name] = Bottle.pop()).container;
        }
        subname = parts.join('.');
        bottle.provider(subname, Provider);
    
        set(fullnameMap, bottle.id, subname, { fullname : fullname, id : id });
    
        return this;
    };
    
    /**
     * Register a service, factory, provider, or value based on properties on the object.
     *
     * properties:
     *  * Obj.$name   String required ex: `'Thing'`
     *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
     *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
     *  * Obj.$value  Mixed  optional Normally Obj is registered on the container.  However, if this
     *                       property is included, it's value will be registered on the container
     *                       instead of the object itsself.  Useful for registering objects on the
     *                       bottle container without modifying those objects with bottle specific keys.
     *
     * @param Function Obj
     * @return Bottle
     */
    var register = function register(Obj) {
        var value = Obj.$value === undefined ? Obj : Obj.$value;
        return this[Obj.$type || 'service'].apply(this, [Obj.$name, value].concat(Obj.$inject || []));
    };
    
    
    /**
     * Execute any deferred functions
     *
     * @param Mixed data
     * @return Bottle
     */
    var resolve = function resolve(data) {
        get(deferred, this.id, '__global__').forEach(function deferredIterator(func) {
            func(data);
        });
    
        return this;
    };
    
    /**
     * Register a service inside a generic factory.
     *
     * @param String name
     * @param Function Service
     * @return Bottle
     */
    var service = function service(name, Service) {
        var deps = arguments.length > 2 ? slice.call(arguments, 2) : null;
        var bottle = this;
        return factory.call(this, name, function GenericFactory() {
            if (deps) {
                deps = deps.map(getNestedService, bottle.container);
                deps.unshift(Service);
                Service = Service.bind.apply(Service, deps);
            }
            return new Service();
        });
    };
    
    /**
     * Register a value
     *
     * @param String name
     * @param mixed val
     * @return this
     */
    var value = function value(name, val) {
        var parts;
        parts = name.split('.');
        name = parts.pop();
        defineValue.call(parts.reduce(setValueObject, this.container), name, val);
        return this;
    };
    
    /**
     * Iterator for setting a plain object literal via defineValue
     *
     * @param Object container
     * @param string name
     */
    var setValueObject = function setValueObject(container, name) {
        var nestedContainer = container[name];
        if (!nestedContainer) {
            nestedContainer = {};
            defineValue.call(container, name, nestedContainer);
        }
        return nestedContainer;
    };
    
    /**
     * Define a mutable property on the container.
     *
     * @param String name
     * @param mixed val
     * @return void
     * @scope container
     */
    var defineValue = function defineValue(name, val) {
        Object.defineProperty(this, name, {
            configurable : true,
            enumerable : true,
            value : val,
            writable : true
        });
    };
    
    
    /**
     * Bottle constructor
     *
     * @param String name Optional name for functional construction
     */
    var Bottle = function Bottle(name) {
        if (!(this instanceof Bottle)) {
            return Bottle.pop(name);
        }
    
        this.id = id++;
        this.container = { $register : register.bind(this) };
    };
    
    /**
     * Bottle prototype
     */
    Bottle.prototype = {
        constant : constant,
        decorator : decorator,
        defer : defer,
        digest : digest,
        factory : factory,
        middleware : middleware,
        provider : provider,
        register : register,
        resolve : resolve,
        service : service,
        value : value
    };
    
    /**
     * Bottle static
     */
    Bottle.pop = pop;
    
    /**
     * Global config
     */
    var globalConfig = Bottle.config = {
        strict : false
    };
    
    /**
     * Exports script adapted from lodash v2.4.1 Modern Build
     *
     * @see http://lodash.com/
     */
    
    /**
     * Valid object type map
     *
     * @type Object
     */
    var objectTypes = {
        'function' : true,
        'object' : true
    };
    
    (function exportBottle(root) {
    
        /**
         * Free variable exports
         *
         * @type Function
         */
        var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    
        /**
         * Free variable module
         *
         * @type Object
         */
        var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    
        /**
         * CommonJS module.exports
         *
         * @type Function
         */
        var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
    
        /**
         * Free variable `global`
         *
         * @type Object
         */
        var freeGlobal = objectTypes[typeof global] && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
            root = freeGlobal;
        }
    
        /**
         * Export
         */
        if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
            root.Bottle = Bottle;
            define(function() { return Bottle; });
        } else if (freeExports && freeModule) {
            if (moduleExports) {
                (freeModule.exports = Bottle).Bottle = Bottle;
            } else {
                freeExports.Bottle = Bottle;
            }
        } else {
            root.Bottle = Bottle;
        }
    }((objectTypes[typeof window] && window) || this));
    
}.call(this));
/**
 * Java dependencies -
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 14, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
/* Java Language */
importPackage(java.lang);

/* getSectionInfo.js */
importClass(com.terminalfour.publish.PathBuilder);
/* media.js */
importPackage(com.terminalfour.media);
importPackage(com.terminalfour.media.utils);
/* ordinalIndicators.js */
importClass(com.terminalfour.sitemanager.cache.utils.CSHelper);
importClass(com.terminalfour.sitemanager.cache.CachedContent);
importPackage(com.terminalfour.sitemanager);
importPackage(com.terminalfour.content);

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
* @file dependencyinject.js
* @version v1.0.3
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
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



/**
* base.js
* @namespace T4Utils
* @version v1.0.3
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
* @author Ben Margevicius 
* @date April 21, 2016
* @copyright Ben Margevicius 2016. MIT licensed.
*/

/*  Versioning    
	6/24/2015 - Initial
	6/30/2015 - Added stuff from T4's javascript util (https://community.terminalfour.com/forum/index.php?topic=426.0)
				Added utils.version;
				Added utils.siteManager namespace 
				Added utils.siteManager.version, and utils.siteManager.buildDetails;
				Added utils.brokerUtils namespace
				Added utils.brokerUtils.processT4Tags
	7/1/2015	Added utils.console(method, textOrObj) used to write debugging statements to the console.
	7/2/2015 	Added utils.elementInfo namspace to return info about elements 
				Added utils.elementInfo.getElements to return an array of elements
				Added utils.elementInfo.getElementValue(element) to return the value of an element. 
	7/6/2015	Added utils.elementInfo.getElementName(element).
	7/8/2015	Added newline chars for pretty printing of console and write methods
				Added utils.siteManager.javaVersion
	7/20/2015	Added utils.getSectionInfo.getChildren(section, isHiddenInNAV)  
	8/13/2015	Added utils.getSectionInfo.getLevel(section)
				Added utils.toString(obj) 
	9/18/2015	Added utils.elementInfo.getElementID (element) Returns the id of an element.
				Added utils.media namspace to give some help with images utils.media.getMediaObject(int id)
						utils.media.getImageDimensions(mediaobj media)
						utils.media.getImageVariantsIds(string mediaElement).	
	11/2/2015	Added utils.getSectionInfo.getPathUntilLevel(finalLevel, currentSection)
				Added utils.getSectionInfo.getPathBySteps(stepsUp, currentSection)
				Modded utils.getSectionInfo.getRootPath to use getPathUntilLevel(0);
	1/6/2016	Modded the elementInfo namespace. This includes some bug checks.
	2/16/2016 	Added utils.Media.getImageTag.
	2/25/2016 	Removed utils.Media.getImageTag. There is an issue with utils classes and t4 tags 
				Merged in security namespace
				Merged in security.toSHA256(plainText)
	4/5/2016	Changed to a modular format. Using NPM + Gulp to script the builds. Changed to semantic versioning.
				Added another attempt at media.GetImageTag. It's incomplete ATM.
	4/14/2016	Moved the java depedencies to a seperate file. This is done to prevent future duplicates.
	4/21/2016	Added bottlejs dependency resolver to remove T4 based dependecies. 
				Added bottlejs npm resolver. Added copy-libs to gulp to copy from node_modules to ./components/libs/
				Added dependencyinject.js for our T4 object factories
				Modded the first part of ordinalIndicators to demostrate how to use DI. 
	Todo: Mocking and Unit Testing
						
				
	Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
	
	
	How to get url and text from a section link type. You can output 'normal' to get the whole link as well.
	var internalLink = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linkurl" ...  />');	
  	var internalLinkText = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linktext" ... />');
	
	How do you get an image from the media library? Note the formatter. I had to change this from image/* to path/*.
	 var elv = T4Utils.elementInfo.getElementValue('Source'); //Returns a t4tag 
	  elv = elv.replace("image/*", "path/*"); //The t4 tag has the formatter = image versus just the source. So change it.
	  var sauce = T4Utils.brokerUtils.processT4Tag(elv);  //Process the t4 tag. Similar to below.
	OR
	var sauce = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="156737" formatter="path/*"/>');
*/



/* Notes:
	There are several varibles you can use:
		
	document: The output stream writer. This is critical if the script wants to write output to the appropriate location during publish. For example, during publish the output writer would either be writing directly to a publish file on disk, or writing to a String which in turn, would be written to a file on disk.
	
	publishCache: The name of the PublishCache object. publishCache.channel - returns the current channel?
	
	dbStatement: The name of the database Statement object used to talk to the database.
	
	section: The name of the Section object. The section in question is the one being currently published.
	
	content: The name of the Content object which is being published.
	
	contentList: The name of the array of CachedContent objects which are required when a page layout is being processed. This is likely to be null in the case of content layouts.
	
	template: The name of the Template object which is required content layouts, where it represents the content-type/template of which the content is an instance of. This is likely to be null in the case of page layouts.
	
	templateFormat: The name of the TemplateFormat object which represents the content layout for the given content instance. This is likely to be null in the case of content layouts.
	
	language: The language version of the given publish or preview.
	
	isPreview: A flag indicating whether the processing is occurring under a preview or a publish.
	
	isStyleHeader: A flag indicating whether the data being processed in a page layout is header or footer text. Not applicable in the case of content layouts.	
*/

'use strict';
/*jshint -W097*/

/** Class representing T4Utils */
var T4Utils = (function (utils) { 
	
	/**
	* Outputs the version of this utility
	* @function version
	* @return {string} The version of the T4Utility Class 
	*/
	utils.version = 'v1.0.2_2016.14.04';
	
	/**
	* Writes a message to the browser console 
	* @function console
	* @deprecated Please use T4Utils.console.log, warn, error instead. 	
	* @param {string} consoleMethod - You can specify which console method you want to use. "log, warn, error" are valid. 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	* @example T4Utils.console("log", "Logging a message");
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string") 
		{			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
		}
	};
	
	
	/**
	* Writes a paragraph formatted HTML message to the browser 
	* @function write
	* @param {string} text - The text you want to write to the screen.
	*/
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    };
    
	/**
	* Converts a javascript object to Java string
	* @function toString
	* @deprecated Use string.protoype.toJavaString
	* @param {object} obj - The object you want to convert
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	*/
	utils.toString = function(obj)
	{
		return new java.lang.String(obj); 
	};	
	
	/**
 +	* Escapes an html encoded string <tag class="something"> should become &lt;tag class=&quot;something&quot;&gt
 +	* @param {string} unsafe - The HTML encoded string you want to convert
 +	* @return {java.lang.String} The HTML escaped string.		
 +	
	utils.escapeHtml = function (unsafe) {
		try {
			var escaped = "<Escape me>";
			return StringEscapeUtils.escapeHtml4(escaped);				
		}
		catch(err)
		{
			document.write("Error in escapeHtml.");
			document.write(err.message);
		}
	};*/
	return utils;
})(T4Utils || {});
T4Utils.Bottle = bottle; //inject our dependencies throughout the util. They can be referenced by T4Utils.Bottle.container.<dependency>

/**
	* Converts a javascript object to Java string by prototying
	* @function toJavaString
	* @memberof String
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	* jshint -w121 extending the native javascript String object.
	*/
/*jshint -W121*/
String.prototype.toJavaString = function () {
	return new java.lang.String(this); //this is crazy.		
};


	

/**
 * T4Utils.console - console writer for browser based messages. 
 * @file console.js
 * @namespace T4Utils.console 
 * @extends T4Utils
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 25, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
 
T4Utils.console = T4Utils.console || {};

/**
* Writes a message to the browser console
* @function log
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
* @example T4Utils.console.log("Console message");
*/
T4Utils.console.log = function(textOrObj) {		
	if(typeof textOrObj === "string")	
	{			
		document.write("<script>console.log('" + textOrObj + "');</script>\n");				
	}
};

/**
* Writes a warning to the browser console 
* @function warn
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
* @example T4Utils.console.warn("Console warning");
*/
T4Utils.console.warn = function(textOrObj) {		
	if(typeof textOrObj === "string")
	{
		document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
	}
};

/**
* Writes an error to the browser console 
* @function error
* @memberof T4Utils.console
* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
* @example T4Utils.console.warn("Console error");
*/
T4Utils.console.error = function(textOrObj) {		
	if(typeof textOrObj === "string")
	{
		document.write("<script>console.error('" + textOrObj + "');</script>\n");				
	}
};

/**
 * T4Utils.sitemanager - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

/** 
	Sitemanager namespace gets information about the sitemanager, duh.	
*/
T4Utils.siteManager = T4Utils.siteManager || {};

/**
*	Returns the version of the site manager
*	@return {string} The site manager version	
*/
T4Utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;

/**
*	Returns the build details of the site manager
*	@return {string} The site manager build details	
*/	
T4Utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;

/**
*	Returns the java version of the site manager
*	@return {string} The site manager java version. Note: Anything below java 8 is obsolete. 4/4/16
*/	
T4Utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");

/**
 * T4Utils.brokerUtils - Broker Utils namespace for T4
 * @file brokerUtils.js
 * @namespace T4Utils.brokerUtils 
 * @extends T4Utils
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */

T4Utils.brokerUtils = T4Utils.brokerUtils || {};
/**
*	Processes a t4 tag. T4Utils~processT4Tag
*	@function processT4Tag
* 	@memberof T4Utils.brokerUtils
*	@param {string} t4Tag - HTML style T4 tag that needs to be processed. Typically something from the media library.
*	@return {string} A string value of the t4 tag output. Depends on the formatters you put in. 
* 	@example T4Utils.processT4Tag("<t4 id=123456' formatter='css/*' />");
*/
T4Utils.brokerUtils.processT4Tag = function (t4Tag) {
	var context = (typeof content !== 'undefined') ? content : null; //see issue #10 for this
	return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, context, language, isPreview, t4Tag); 
};
/**
 * T4Utils.elementInfo - elementInfo namespace for T4. This namespace will retrieve infomation about the declared 'elements' within a content type
 * @file elementInfo.js
 * @namespace T4Utils.elementInfo 
 * @extends T4Utils
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */ 
/* jshint strict: false */

T4Utils.elementInfo = T4Utils.elementInfo || {};
/**
*	Get all of the elements within the piece of content
*	@function getElements 
*	@memberof T4Utils.elementInfo	
*	@example <caption>How to loop through the elements of a content type</caption>
		var els = T4Utils.elementInfo.getElements();  
		T4Utils.write("I have: " + els.length + " elements");  
		for(var i = 0; i < els.length; i++)
		{
			var el = els[i];		
			T4Utils.write("element[" + i + "]: " + el.getName()); //gets the name
			T4Utils.write("element[" + i + "]: " + el.publish()); //gets the published value. 
		}	
*	@return {ContentElement[]} An array containing the elements within the piece of content.
* 	@exception Will throw an error if content is null
*/	
T4Utils.elementInfo.getElements = function() {
	var c = (typeof content !== 'undefined') ? content : null; //see issue #10 for this
	if(c !== null) {
		return c.getElements();	
	}
	else {
		throw "Error: content does not have any elements";
	}
};

/**
*	If the element is "text", get its' "publish" value as a String.
*	@function getElementValue 
*	@memberof T4Utils.elementInfo	
*	@param {string} element - The string value of the name of the element
*	@return {string} The value of the element. Can be null if the supplied value is already null.
* 	@exception Will throw an error if content is null
*/
T4Utils.elementInfo.getElementValue = function(element) 
{
	var c = (typeof content !== 'undefined') ? content : null; //see issue #10 for this
	if(c !== null)
	{
		var el = c.get(element); //returns a contentelement type
		if(typeof el.publish === "function")
		{
			return el.publish();	
		}
	}	
	else {
		throw "Error: content does not have any elements";
	}
};	

/**
*	Used to get the name of the element.
* 	@function getElementName 
*	@memberof T4Utils.elementInfo	
*	@param {string} element - The string value of the name of the element
*	@return {string} The name of the element
* 	@exception Will throw an error if content is null
*/ 
T4Utils.elementInfo.getElementName = function(element) 
{
	var c = (typeof content !== 'undefined') ? content : null; //see issue #10 for this
	if(c !== null)
	{	
		var el = c.get(element);
		if(typeof el.getName === "function")
		{
			return c.get(element).getName();	
		}			
	}
	else {
		throw "Error: content does not have any elements";
	}
};

/**
*	Used to get the ID of the element.
*	@function getElementID 
*	@memberof T4Utils.elementInfo	
*	@param {string} element - The string value of the name of the element
*	@return {string} The ID of the element
*	@exception Will throw an error if content is null
*/
T4Utils.elementInfo.getElementID = function(element) 
{
	var c = (typeof content !== 'undefined') ? content : null; //see issue #10 for this
	if(c !== null)
	{
		var el = c.get(element); //Returns a CachedContent type?
		if(typeof el.getID === "function")
		{
			return el.getID();
		}			
	}
	else {
		throw "Error: content does not have any elements";
	}
};	
 /**
 * T4Utils.getSectionInfo - getSectionInfo namespace gets information about a section. duh.
 * @file getSectionInfo.js
 * @namespace T4Utils.getSectionInfo 
 * @extends T4Utils
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 25, 2016
 * Copyright 2016. MIT licensed.
 *
 * v1.0.2 Moved dependencies
 * v1.0.3 Cleaned up comments. Fixed some small issues.
 */ 
/* jshint strict: false */
T4Utils.getSectionInfo = T4Utils.getSectionInfo || {};

/** 
*	Gets the publish link from a local variable. You have to setPublishLink first
*	@function getPublishLink
* 	@memberof T4Utils.getSectionInfo
*	@return will return the publishing Link
*/
T4Utils.getSectionInfo.getPublishLink = function () {
	return this.publishLink;
};

/**
*	Sets a link to section
*	@function setPublishLink
* 	@memberof T4Utils.getSectionInfo
*	@inner
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {PublishLink} - stores the publishLink in the T4Utils.publishLink object. Use getPublishLink getter to get that object. Returns the PublishLink type in T4
*/
T4Utils.getSectionInfo.setPublishLink = function (section) {
	this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
};


/**
*	Gets the section title for the section passed in
*	@function sectionTitle
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - The name of the section
*/
T4Utils.getSectionInfo.sectionTitle = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getText();
};

/**
*	Gets the section link for the section passed in
*	@function sectionLink
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - The link of the section
*/
T4Utils.getSectionInfo.sectionLink = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getLink();
};

/**
*	Gets an HTML anchor tag for a section. If you want just the link please use getLink()
*	@function anchorLink
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - Returns a fully formed HTML anchor link for the section passed in
*/
//Note try this.publishLink.toString() 
T4Utils.getSectionInfo.anchorLink = function (section) {
	this.setPublishLink(section);
	var theLink = this.publishLink.getLink();
	var theText = this.publishLink.getText();
	var myLink = '<a href="' + theLink + '">' + theText + '</a>';
	return myLink;
};


/**
*	Gets the directory for the section passed in
*	@function getDirectory
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {string} - Get the directory on the filesystem that this section will be published to
*/
T4Utils.getSectionInfo.getDirectory = function(section) {
	return PathBuilder.getDirectory(section, publishCache, language).toString();		
};

/** 
*	This is an adaptation of the CachedSection.GetChildren method in the API. 		
*	There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
*	@function getChildren
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
* 	@param {boolean} isHiddenInNAV - if is isHiddenInNAV is true then it will NOT output hidden sections.
*	@return {Content[]} Outputs an array of chilen in the expected order listed in the site manager.	
*/
T4Utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
	if (isHiddenInNAV === undefined) {
		isHiddenInNAV = false;
	}
	return section.getChildren(publishCache.channel, language, isHiddenInNAV);
};


/**
*	Gets the path to root from currentSection, Note if you have microsites this will goto the root of everything.
*	@function getRootPath
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@returns {Section[]} Returns an array of sections until root. Including the current section.    
*/
T4Utils.getSectionInfo.getRootPath = function (currentSection) {             
	return this.getPathUntilLevel(0, currentSection);
};   

/**
*	Gets a path from the current section until we are N steps from root
*	@function getPathUntilLevel
* 	@memberof T4Utils.getSectionInfo
*	@param {int} finalLevel - How far down do you want to traverse
*	@param {CachedSection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
* 	@example <caption>Get path to root</caption>
		T4Utils.getSectionInfo.getPathUntilLevel(0, section); 
*	@example <caption>Get path to two levels above root</caption>
		T4Utils.getSectionInfo.getPathUntilLevel(2, section);
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 
*/
T4Utils.getSectionInfo.getPathUntilLevel = function(finalLevel, currentSection, path)
{
	path = path || []; //initialize an array		
	path.push(currentSection);	
	var currentLevel = currentSection.getLevel(publishCache.channel);		
	if(finalLevel < currentLevel)
	{				
		var parentSection = currentSection.getParent();  //get the next node.
		return this.getPathUntilLevel(finalLevel, parentSection, path); //recurse up one level. 
	}
	else { return path; }
};

/**
*	Gets a path from the current section until we are N steps up from root
*	@function getPathBySteps
* 	@memberof T4Utils.getSectionInfo
*	@param {int} stepsUp - How far up do you want to traverse
*	@param {CachedSection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
* 	@example <caption>go 1 step back otherwise get the parent</caption>
		T4Utils.getSectionInfo.getPathBySteps(1, section);
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 	
*/
T4Utils.getSectionInfo.getPathBySteps = function(stepsUp, currentSection, path)
{
	path = path || []; //initialize an array
	path.push(currentSection);
	if(path.length < stepsUp) 
	{
		var parentSection = currentSection.getParent();  //get the next node.
		if( parentSection === null ) { return path; } // break the recursion if we are at root.
		else { return this.getPathBySteps(stepsUp, parentSection, path); }//recurse up one level. 
	}
	else { return path; }
};

/**
*	Get the level of which the section is at. 
* 	@function getLevel
* 	@memberof T4Utils.getSectionInfo
*	@param {CachedSection} section - There is a predefined section object you can pass here.
*	@return {int} - Returns an int of the level of which the section is at.     
*/
T4Utils.getSectionInfo.getLevel = function (section) {
	return section.getLevel(publishCache.channel);
};
/**
 * T4Utils.media - Gets objects from the media library.
 * @file media.js
 * @namespace T4Utils.media
 * @extends T4Utils
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 14, 2016
 * Copyright 2016. MIT licensed  
 */
/* 4/14/16 v1.0.2 moved dependancies to javadependencies.js */
/* jshint strict: false */

T4Utils.media = T4Utils.media || {};

/**
*	Gets an array of image variant ids. 
*	@function getImageVariantsIds
* 	@memberof T4Utils.media
*	@param {Media} mediaElement - Media Element from the site manager.
	@param {MediaManager} mediaManager - T4 Media Manager
	@param {dbStatement} oConn - T4 connection to the database?
*	@return {int[]} Returns an array of media ids.		
* 	@example <caption>Get image variant ids</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);
var variants = T4Utils.media.getImageVariantsIds(source); //get the variants of the media element
*/
T4Utils.media.getImageVariantsIds = function(mediaElement, mediaManager, oConn) {
	if(mediaManager === undefined) {
		mediaManager = MediaManager.getManager();
	}
	if(oConn === undefined) {
		oConn = dbStatement.getConnection();
	}
	var imageID = content.get(mediaElement).getID();
	var variantIds = mediaManager.getMediaVariants(oConn, imageID, language);  	
	return variantIds;
};

/**
*	Gets the dimensions of a media object, obviously you should pass in a picture.
*	@function getImageDimensions
*	@memberof T4Utils.media
*	@param {object} mediaObj - T4Utils.getMediaObject
	@param {MediaUtils} mediaUtil - T4 MediaUtils object
*	@return {object} Returns an object that has two properties. width and height. 
	@example <caption>Get image variant ids and dimenstions</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);		
var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media
var sourceDimensions = T4Utils.media.getImageDimensions(sourceMediaObject);
*/
T4Utils.media.getImageDimensions = function(mediaObj, mediaUtil) { 
	var d = { width: 0, height: 0 };
	if(mediaUtil === undefined) {
		mediaUtil = MediaUtils; //
	}
	d.width = mediaUtil.getImageDimensions(mediaObj)[0];
	d.height = mediaUtil.getImageDimensions(mediaObj)[1];
	return d;
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function getMediaObject
*	@memberof T4Utils.media
*	@param {int} mediaID - The id of the media object you are trying to return.	
*	@return {object} Returns a media object
*	@example <caption>Get image variant ids and dimenstions</caption>
var source = "Source Image Element"; //cache the name of the source element
var myid = T4Utils.elementInfo.getElementID(source);		
var sourceMediaObject = T4Utils.media.getMediaObject(myid); //Returns a type of Media		
*/
T4Utils.media.getMediaObject = function(mediaID) {
	try
	{
		var oMM = T4Utils.Bottle.container.oMM;	//refernce to MediaManager.getManager()
		return oMM.get(T4Utils.Bottle.container.oConn, mediaID, language);  
	}
	catch (err)
	{
		document.write(err.message);
	}
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
* 	@function getImageTag
*	@memberof T4Utils.media
*	@ignore 
*	@param {int} mediaID - The id of the media object you are trying to return.
*	@return {object} Returns a media object
*/
T4Utils.media.getImageTag = function(imageSource, altText, cssClass, sizesQuery)
{
	var imagesrc = '';
	
	try
	{
		var t4src = "<t4 />";
		T4Utils.write("Processing t4Tag: " + t4src);
		T4Utils.write("t4src is type: " + typeof t4src);
		T4Utils.write("t4src.length: " + t4src.length);
		T4Utils.write('t4 version: ' + T4Utils.siteManager.version);
		T4Utils.write('t4 buildDetails: ' + T4Utils.siteManager.buildDetails);
		T4Utils.write('t4 javaVersion: ' + T4Utils.siteManager.javaVersion);
	}
	catch(err)
	{
		document.write("error processing utils.media.getImageTag()");
		document.write(err.message);
	}
	return imagesrc;
};
/**
 * T4Utils.security - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */


/* jshint strict: false*/
/**
* Security namespace declaration
*/
T4Utils.security = T4Utils.security || {};
	
/**
*	Hashes a plaintext string into a SHA-256 Hex Encoded String
*	@param {string} plainText - Plain text value of the 
*	@return {string} A string value of the hash
*/	
T4Utils.security.toSHA256 = function(plainText) {	
	/* jshint bitwise: false */
	importPackage(java.security);

	var hash;
	try
	{	
		var md = MessageDigest.getInstance("SHA-256"); //Every implementation is required to have MD5, SHA-1, SHA-256. Don't use MD5 or SHA-1 anymore. 
		var pwBytes = new java.lang.String(plainText).getBytes("UTF-8");    
		md.update(pwBytes);
		var hashedBytes = md.digest();
		var sb = new java.lang.StringBuffer();
		for (var i = 0; i < hashedBytes.length; i++) {
			sb.append(java.lang.Integer.toString((hashedBytes[i] & 0xff) + 0x100, 16).substring(1)); //borrowed from http://www.mkyong.com/java/java-sha-hashing-example/
		}
		hash = sb.toString();
	}
	catch(e)
	{        
		document.write(e);
	}
	return hash;
};