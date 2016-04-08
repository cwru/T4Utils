try {
  importClass(com.terminalfour.publish.utils.BrokerUtils);
  var utils = eval(String (com.terminalfour.publish.utils.BrokerUtils.processT4Tags (dbStatement, publishCache, section, null, language, isPreview, '<t4 type="media" id="250467" formatter="inline/*"/>')));
} catch (e) {
    if (e instanceof SyntaxError) {
        document.write(e.message);
    } else {
        throw( e );
    }
}
try
{
importClass(org.apache.commons.lang.StringUtils); //note the import of 3rd party tools loaded by T4.

var hr = "<hr>";

T4Utils.write("version: " + T4Utils.version);
T4Utils.write("Sitemanager: " + T4Utils.siteManager.version + T4Utils.siteManager.buildDetails);
T4Utils.write("Java Version: " + T4Utils.siteManager.javaVersion);
document.write(hr);

T4Utils.console("log", "log message");
T4Utils.console.log("log message");
T4Utils.console.warn("warn message");
T4Utils.console.error("error message");

//toString test
var testStr = "Test String";
var javaTestStr = T4Utils.toString(testStr);
T4Utils.write(testStr + ' is type of: ' + typeof(testStr));
T4Utils.write(javaTestStr + ' is type of: ' + typeof(javaTestStr));

if(testStr === javaTestStr)
{
  T4Utils.write('and they are equal!');
}
else
{
  T4Utils.write('and they are not equal!');
}

//T4Utils.write(testStr.hashCode()); Does not work
T4Utils.write("Hashcode: " + javaTestStr.hashCode());

T4Utils.write('is null empty: ' + StringUtils.isEmpty(null));
T4Utils.write('is "" empty: ' + StringUtils.isEmpty(""));     
T4Utils.write('is " " empty: ' + StringUtils.isEmpty(" "));
T4Utils.write('is ' + testStr + ' empty: ' + StringUtils.isEmpty(testStr));
T4Utils.write('is ' + javaTestStr + ' empty: ' + StringUtils.isEmpty(javaTestStr));
var emptyjs = ''; 
T4Utils.write('is ' + emptyjs + ' empty: ' + StringUtils.isEmpty(emptyjs));
  
T4Utils.write('SHA-256 of "' + testStr + '": ' + T4Utils.security.toSHA256(testStr));
document.write(hr);
}
catch (e) {   
    document.write(e.message);
}
