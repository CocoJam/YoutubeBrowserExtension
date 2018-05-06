//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
//local variables to be used for this specific content script
var currentVideoId = "";
var currentTime = 0;
var alertOfYouTubeIframeIsAttached = false;
var width=0;
var height=0;
window.addEventListener("message", function (event) {
    // console.log(event);
    //This will recieve a message from the youtubeIframeTrigger.js when the youtube IFrame API did and finsihed loading
    //Then apply the attachment of the actually functionality of the youtubeFunction.js.
    if (event.data.type === "ÏframeOnReadyEvent"){
        
        var youtubeStandard = document.createElement("script");
        youtubeStandard.src = chrome.extension.getURL("youtubeFunctions.js");
        document.body.appendChild(youtubeStandard);
        alertOfYouTubeIframeIsAttached = !alertOfYouTubeIframeIsAttached;
        console.log("triggerOnYouTubeIframeAPIReady");
        window.postMessage({type: "triggerOnYouTubeIframeAPIReady"},"*");
        return;
    }
    //This is to set the iframe Dragging to sync
    if (event.data.type === "IframeDragging"){
        chromeLocalSet({location:{top: event.data.top, left: event.data.left}});
        return
    }
    //This is to set the iframe Resizing to sync
    if (event.data.type === "IframeResizing"){
       chromeLocalSet({size: {width:event.data.width, height:event.data.height}});
       return;
    }
    //This is to set the Search query
    if (event.data.type ==="searchQuery"){
        console.log(event.data.search);
        chromeLocalSet({search: event.data.search});
        return;
    }
    //Checking for post messages from the html to content script specifically when html tab is visible.
    if (event.data.get !== undefined && event.data.get === "Video") {
        //Posting back the current Video id and Current Time back to html script.
       videoStatePosting();
        return;
    }
    if(event.data.type === "videoId"){
        chromeLocalSet({videoId: event.data.videoId});
        return;
    }
    if(event.data.type ==="youtubeVideoState"){
        chromeLocalSet({youtubeVideoState: event.data.youtubeVideoState});
        return;
    }

    //communication from html to content goes here and detecting youtube messages from youtube iframe API
    if (event.source !== window && event.origin === "https://www.youtube.com") {
        var json = JSON.parse(event.data);
        //When first youtube Iframe video is initialized json.event would be intitialDevlivery.
        if (json.event === "initialDelivery") {
            //When the iframe initializes then it access the local storage to find the current global videoId and time
           videoStatePosting();
           return;
        }
        //Detection of event consist of currentTime, such that it contains the current play time of the video.
        if (json.info !==null && json.info.currentTime !== undefined && json.info.currenTime !== null && json.info.currentTime > 1) {
            console.log(event)
            //This allow the use of chrome local storage that sets a key "time" and value of the event currentTime.
            chromeLocalSet({time: json.info.currentTime});
            if (json.info.videoData !== undefined && json.info.videoData.video_id !== undefined && json.info.videoData.video_id !== null ) {
                console.log(json.info.videoData.video_id);
                //This allow the use of chrome local storage that sets a key "videoId" and value of the event currentTime.
                chromeLocalSet({videoId: json.info.videoData.video_id});
                return;
            }
        }
        window.postMessage({name:"From content"}, "*");
        return
    }
    //This will alert the user that the youtube Iframe API is not attached
    // if (!alertOfYouTubeIframeIsAttached){
    //     alert("youtube!!!");
    //     alertOfYouTubeIframeIsAttached=true;
    //     return;
    // }
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
        var json = {};
        // window.postMessage({videoId: result.videoId, Time: result.time, width:result.width, height: result.height, top: result.top, left: result.left, search:result.search}, "*");
        if (key === "videoId") {
            json.videoId = storageChange.newValue;
            json.type = "videoId";
        }
        if (key === "time") {
            json.time = storageChange.newValue;
            json.type = "time";
        }
        if (key === "size"){
            json.size = storageChange.newValue;
            json.type = "size";
        }
        if(key ==="location"){
            json.location = storageChange.newValue;
            json.type = "location";
        }
        if(key === "youtubeVideoState"){
            json.youtubeVideoState = storageChange.newValue;
            json.type = "youtubeVideoState";
        }
        if(key === "search"){
            json.search = storageChange.newValue;
            json.type = "search";
        }
        window.postMessage(json, "*");
    }
});

//chrome local memory error handling, this will handle the memory associated errors by clearing the local memory to
//Prevent memory overflow.
function localMemoryClear() {
    
    chrome.storage.local.clear(function () {
        
    });
}

function videoStatePosting(){
    chrome.storage.local.get(["time", "videoId","size","location","youtubeVideoState","search"], function (result) {
        if (chrome.runtime.lastError) {
            localMemoryClear();
            return;
        }else {
            //posting messages of the videoid and current time to html after message is received.
            window.postMessage({type:"init",videoId: result.videoId, time: result.time, size:result.size, location: result.location, search:result.search,youtubeVideoState: result.youtubeVideoState }, "*");
        }
    });
}

function chromeLocalSet(json) {
    chrome.storage.local.set(json, function () {
        if (chrome.runtime.lastError) {
            localMemoryClear();
            return;
        } else {

        }
    })
}