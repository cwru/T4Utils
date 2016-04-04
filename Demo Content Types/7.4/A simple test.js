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

T4Utils.write('SHA-256 of "' + testStr + '": ' + T4Utils.security.toSHA256(testStr));