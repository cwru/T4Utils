/**
 * T4Utils.security - Security namespace for T4
 * @file security.js
 * @namespace T4Utils.security 
 * @extends T4Utils
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false*/
T4Utils.security = T4Utils.security || {};
	
/**
*	Hashes a plaintext string into a SHA-256 Hex Encoded String
*	@function toSHA256
* 	@deprecated Please use T4Utils.security.toHash method. This function doesn't generate the correct hash 100% of the time.	
* 	@memberof T4Utils.security
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

/**
*	Hashes a plaintext string into a Hex Encoded String
*	@function toHash
* 	@memberof T4Utils.security
*	@param {string} hashAlgorithm - The hash algorithm you want to use. Valid algorithms are 'MD5', 'SHA-256', 'SHA-384', 'SHA-512'
*	@param {string} plainText - Plain text value to be hashed
*	@return {string} A string value of the hash
*/
T4Utils.security.toHash = function(hashAlgorithm, plainText) {
	/* global javax, DatatypeConverter */
	importPackage(java.security);
	importClass(javax.xml.bind.DatatypeConverter);
	/* Available algorithms
		MD2	The MD2 message digest algorithm as defined in RFC 1319.
		MD5	The MD5 message digest algorithm as defined in RFC 1321.
		SHA-1
		SHA-256
		SHA-384
		SHA-512 
	*/	
	try
	{
		var hash = DatatypeConverter.printHexBinary(MessageDigest.getInstance(hashAlgorithm).digest(new java.lang.String(plainText).getBytes("UTF-8")));
		return hash;
	}
	catch(err)
	{
		document.write(err.message);
	}
};