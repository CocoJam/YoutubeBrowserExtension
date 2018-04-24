//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
window.addEventListener("message", function (event) {
    console.log(event);
    //Checking for post messages from the html to content script specifically when html tab is visible.
    if (event.data.get !== undefined && event.data.get === "Video") {
        console.log(event.data);
    }

    //communication from html to content goes here and detecting youtube messages from youtube iframe API
    if (event.source !== window && event.origin === "https://www.youtube.com") {
        var json = JSON.parse(event.data);
        console.log(json);
        //When first youtube Iframe video is initialized json.event would be intitialDevlivery.
        if (json.event === "initialDelivery") {
            console.log("initialDelivery");
        }
        //Detection of event consist of currentTime, such that it contains the current play time of the video.
        if (json.info.currentTime !== undefined && json.info.currentTime > 1) {
            console.log(json.info.currentTime);
        }
        window.postMessage({name:"From content"}, "*");
    }
},false);
//Attaching the port with the browser runtime connection allowing the communication between the content and background.
var myPort = browser.runtime.connect();
//The callback function being called more details plz refer to MDN chrome extension documentations.
//This onMessage function will be called upon message from background script.
browser.runtime.onMessage.addListener(ReceivedMessage);

//Background script to this specific content script with the specific tabID.
function ReceivedMessage(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
}
