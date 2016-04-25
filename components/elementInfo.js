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