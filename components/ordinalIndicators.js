/**
* T4Utils.ordinalIndicators - This namespace provides 
* @version v1.0.3
* @file ordinalIndicators.js
* @namespace T4Utils.ordinalIndicators 
* @extends T4Utils
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
* @author Joel Eisner, Ben Margevicius
* @date April 15, 2016
* Copyright 2016. MIT licensed.
*/
/* jshint strict: false */

/* 4/21/2016 - bdm4@case - Removed dependencies on ContentManager and ContentHierarchy */

T4Utils.ordinalIndicators = T4Utils.ordinalIndicators || {};

/**
* Return an array of unique values. 
* @function uniqueSorter
* @memberof T4Utils.ordinalIndicators
* @param {array} arr - The array that's to be sorted on key and pruned.* 
* @return {array} - An array that is sorted and pruned.
*/
T4Utils.ordinalIndicators.uniqueSorter = function (arr) {
	var comparer = function compareObject(a, b) { //compare two objects in an array. 
		if (a.key === b.key) { //if the objects are the same 
			return 0; 		//No sorting should be done
		} else {
			if (a.key < b.key) { 
				return -1; 	//sort a to be lower than b
			} else {
				return 1; 	//sort b to be lower than a. 
			}
		}
	};
	arr.sort(comparer); //sort our array
	
	for (var i = 0; i < arr.length - 1; ++i) { //foreach object in that array 
		if (comparer(arr[i], arr[i+1]) === 0) { //if the objects are the same 
			arr.splice(i, 1);	//remove that object from the array
		}
	}
	return arr; //return an array of distinct values. 
};

/**
* Find if the position of the content within the page is the first of its kind
* @function pageFirst
* @memberof T4Utils.ordinalIndicators
* @return {bool} true if first, false if not
*/
T4Utils.ordinalIndicators.pageFirst = (function() {
    var pageFirst = false;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pFirst = pieces[0];
            // If this piece of content is the first of its kind on the page...
            if (pFirst === this_uID) {
                pageFirst = true;
            } else {
                pageFirst = false;
            }
        }
    }
    return pageFirst;
})();

/**
* Find if the position of the content within the page is the last of its kind
* @function pageLast
* @memberof T4Utils.ordinalIndicators
* @return {bool} true if last, false if not
*/
T4Utils.ordinalIndicators.pageLast = (function() {
    var pageLast = false;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pLength = pieces.length,
            pIndex = pLength - 1,
            pLast = pieces[pIndex];
            // If this piece of content is the last of its kind on the page...
            if (pLast === this_uID) {
                pageLast = true;
            } else {
                pageLast = false;
            }
        }
    }
    return pageLast;
})();

/**
* Find index of the content within the page
* @function pageIndex
* @memberof T4Utils.ordinalIndicators
* @return {int} the content's index number (starting from 0)
*/
T4Utils.ordinalIndicators.pageIndex = (function() {
    var contentIndex;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pLength = pieces.length;
            // Set the contentIndex variable...
            for (var n = 0; n < pLength; n++) {
                var piece = pieces[n];
                if (this_uID === piece) {
                    contentIndex = n;
                    break;
                }
            }
        }
    }
    return contentIndex;
})();

/**
* Find if the position of the content within a groupset is the first of its kind
* @function groupFirst
* @memberof T4Utils.ordinalIndicators
* @return {bool} true if first, false if not
*/
T4Utils.ordinalIndicators.groupFirst = (function() {
    var tid = content.getTemplateID(),
        sid = section.getID(),
        oCH = T4Utils.Bottle.container.oCH,
        oCM = T4Utils.Bottle.container.oCM,
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupFirst = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(dbStatement,contentInSection[i],"en").getID()) {
            if (i === 0) {
                groupFirst = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i-1],"en").getTemplateID()) {
                groupFirst = true;
            } else {
                groupFirst = false;
            }
        }
    }
    return groupFirst;
})();

/**
* Find if the position of the content within a groupset is the last of its kind
* @function groupLast
* @memberof T4Utils.ordinalIndicators
* @return {bool} true if last, false if not
*/
T4Utils.ordinalIndicators.groupLast = (function() {
    var tid = content.getTemplateID(),
        sid = section.getID(),
        oCH = T4Utils.Bottle.container.oCH, //get the ContentHierarchy Object
        oCM = T4Utils.Bottle.container.oCM, //get the Content Manager 
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupLast = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(dbStatement,contentInSection[i],"en").getID()) {
            if (i === contentInSection.length-1) {
                groupLast = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i+1],"en").getTemplateID()) {
                groupLast = true;
            } else {
                groupLast = false;
            }
        }
    }
    return groupLast;
})();
