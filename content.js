//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
//local variables to be used for this specific content script
var currentVideoId = "";
var currentTime = 0;
var alertOfYouTubeIframeIsAttached = false;
var width=0;
var height=0;
window.addEventListener("message", function (event) {
    //This will recieve a message from the youtubeIframeTrigger.js when the youtube IFrame API did and finsihed loading
    //Then apply the attachment of the actually functionality of the youtubeFunction.js.
    if (event.data.type === "ÏframeOnReadyEvent"){
        
        var youtubeStandard = document.createElement("script");
        youtubeStandard.src = chrome.extension.getURL("youtubeFunctions.js");
        document.body.appendChild(youtubeStandard);
        alertOfYouTubeIframeIsAttached = !alertOfYouTubeIframeIsAttached;
        window.postMessage({type: "triggerOnYouTubeIframeAPIReady"},"*")
    }
    //This will alert the user that the youtube Iframe API is not attached
    if (!alertOfYouTubeIframeIsAttached){
        alert("youtube!!!");
        alertOfYouTubeIframeIsAttached=!alertOfYouTubeIframeIsAttached;
        return;
    }
    //
    if (event.data.type === "IframeResizing"){
        chrome.storage.local.set({width: event.data.width, height: event.data.height}, function () {
            if (chrome.runtime.lastError) {
                localMemoryClear();
                return;
            } else {
                
            }
        });
    }
    
    //Checking for post messages from the html to content script specifically when html tab is visible.
    if (event.data.get !== undefined && event.data.get === "Video") {
        
        //Posting back the current Video id and Current Time back to html script.
        window.postMessage({videoId: currentVideoId, Time: currentTime, width:width, height:height}, "*")
    }

    //communication from html to content goes here and detecting youtube messages from youtube iframe API
    if (event.source !== window && event.origin === "https://www.youtube.com") {
        var json = JSON.parse(event.data);
        
        //When first youtube Iframe video is initialized json.event would be intitialDevlivery.
        if (json.event === "initialDelivery") {
            
            //When the iframe initializes then it access the local storage to find the current global videoId and time
            chrome.storage.local.get(["time", "videoId","width","height"], function (result) {
                if (chrome.runtime.lastError) {
                    localMemoryClear();
                    return;
                }else {
                    
                    //posting messages of the videoid and current time to html after initialDelivery is received.
                    window.postMessage({videoId: result.videoId, Time: result.time, width:result.width, height: result.height}, "*");
                }
            });
            return;
        }


        //Detection of event consist of currentTime, such that it contains the current play time of the video.
        if (json.info.currentTime !== undefined && json.info.currentTime > 1) {
            
            //This allow the use of chrome local storage that sets a key "time" and value of the event currentTime.
            chrome.storage.local.set({time: json.info.currentTime}, function () {
                if (chrome.runtime.lastError) {
                    localMemoryClear();
                    return;
                } else {
                    
                }
            });
            if (json.info.videoData.video_id !== undefined && json.info.videoData.video_id !== null ) {
                
                
                //This allow the use of chrome local storage that sets a key "videoId" and value of the event currentTime.
                chrome.storage.local.set({videoId: json.info.videoData.video_id}, function () {
                    if (chrome.runtime.lastError) {
                        localMemoryClear();
                        return;
                    } else {
                        
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

    
    window.postMessage({type:"disableVideo"}, "*");
}
//This is a listener for the given chrome storage changes, which will fire the given callback function when detect
//changes. This is important for cross domain communication, since normal cross domain communication is not too feasible
//more information is available from: https://developer.chrome.com/extensions/devguide
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        //Detecting the storage changes in terms of the old value/state, while also acessing the new value coming in.
        
        if (key === "videoId") {
            currentVideoId = storageChange.newValue;
        }
        if (key === "time") {
            currentTime = storageChange.newValue;
        }
        if (key === "width"){
            width = storageChange.newValue;
        }
        if (key ==="height"){
            height = storageChange.newValue;
        }
    }
});

//chrome local memory error handling, this will handle the memory associated errors by clearing the local memory to
//Prevent memory overflow.
function localMemoryClear() {
    
    chrome.storage.local.clear(function () {
        
    });
}