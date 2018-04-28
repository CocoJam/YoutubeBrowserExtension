//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
//local variables to be used for this specific content script
var currentVideoId = "";
var currentTime = 0;

window.addEventListener("message", function (event) {
    if (event.data.type === "ÏframeOnReadyEvent"){
        console.log("IframeOnReadyEvent")
        var youtubeStandard = document.createElement("script");
        youtubeStandard.src = chrome.extension.getURL("youtubeFunctions.js");
        document.body.appendChild(youtubeStandard);
        window.postMessage({type: "triggerOnYouTubeIframeAPIReady"},"*")
    }

    console.log(event);
    //Checking for post messages from the html to content script specifically when html tab is visible.
    if (event.data.get !== undefined && event.data.get === "Video") {
        console.log(event.data);
        //Posting back the current Video id and Current Time back to html script.
        window.postMessage({videoId: currentVideoId, Time: currentTime}, "*")
    }

    //communication from html to content goes here and detecting youtube messages from youtube iframe API
    if (event.source !== window && event.origin === "https://www.youtube.com") {
        var json = JSON.parse(event.data);
        console.log(json);
        //When first youtube Iframe video is initialized json.event would be intitialDevlivery.
        if (json.event === "initialDelivery") {
            console.log("initialDelivery");
            //When the iframe initializes then it access the local storage to find the current global videoId and time
            chrome.storage.local.get(["time", "videoId"], function (result) {
                if (chrome.runtime.lastError) {
                    localMemoryClear();
                    return;
                }else {
                    console.log(result);
                    //posting messages of the videoid and current time to html after initialDelivery is received.
                    window.postMessage({videoId: result.videoId, Time: result.time}, "*");
                }
            });
            return;
        }


        //Detection of event consist of currentTime, such that it contains the current play time of the video.
        if (json.info.currentTime !== undefined && json.info.currentTime > 1) {
            console.log(json.info.currentTime);
            //This allow the use of chrome local storage that sets a key "time" and value of the event currentTime.
            chrome.storage.local.set({time: json.info.currentTime}, function () {
                if (chrome.runtime.lastError) {
                    localMemoryClear();
                    return;
                } else {
                    console.log('Value is set to ' + json.info.currentTime);
                }
            });
            if (json.info.videoData.video_id !== undefined && json.info.videoData.video_id !== null ) {
                console.log("videoId");
                console.log(json);
                //This allow the use of chrome local storage that sets a key "videoId" and value of the event currentTime.
                chrome.storage.local.set({videoId: json.info.videoData.video_id}, function () {
                    if (chrome.runtime.lastError) {
                        localMemoryClear();
                        return;
                    } else {
                        console.log('Value is set to ' + json.info.videoData.video_id);
                    }
                })
            }
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
    window.postMessage({type:"disableVideo"}, "*");
}
//This is a listener for the given chrome storage changes, which will fire the given callback function when detect
//changes. This is important for cross domain communication, since normal cross domain communication is not too feasible
//more information is available from: https://developer.chrome.com/extensions/devguide
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        //Detecting the storage changes in terms of the old value/state, while also acessing the new value coming in.
        console.log('Storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
        if (key === "videoId") {
            currentVideoId = storageChange.newValue;
        }
        if (key === "time") {
            currentTime = storageChange.newValue;
        }
    }
});

//chrome local memory error handling, this will handle the memory associated errors by clearing the local memory to
//Prevent memory overflow.
function localMemoryClear() {
    console.log("Error retrieving index: " + chrome.runtime.lastError);
    chrome.storage.local.clear(function () {
        console.log("Clear local storage");
    });
}