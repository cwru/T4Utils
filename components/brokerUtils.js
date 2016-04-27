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