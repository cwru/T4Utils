importClass(org.apache.commons.io.IOUtils);
importClass(com.terminalfour.media.MediaManager);
try {
  var utils = eval(String (IOUtils.toString(MediaManager.manager.get(dbStatement, <T4 ID>, language).getMedia())));
} catch (e) {
    if (e instanceof SyntaxError) {
        document.write(e.message);
    } else {
        throw( e );
    }
}