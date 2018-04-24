//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
//run time connections between contents scripts.
browser.runtime.onConnect.addListener(connected);

var portFromCS = null;
//Upon connection between the background script and the content script this function will run.
function connected(port) {
    portFromCS = port;
}