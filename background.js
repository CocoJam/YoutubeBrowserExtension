//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
//run time connections between contents scripts.
browser.runtime.onConnect.addListener(connected);

var portFromCS = null;
//Upon connection between the background script and the content script this function will run.
function connected(port) {
    portFromCS = port;
}
//This handles the clicking actions from the browser as browser actions
browser.browserAction.onClicked.addListener(handleClick);

//Sense to button click of the window, then sending a message down to specific tab's content script.
function handleClick(tab) {
    console.log(tab);
    browser.tabs.sendMessage(tab.id, {});
}