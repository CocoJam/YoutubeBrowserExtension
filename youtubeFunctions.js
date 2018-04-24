//variables that will be used to reference
var player;
var currentID = "";
var currentTime = 0;
//Method called once the iframe API finish loading.
//referencing the example codes from https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady() {
    //The videoId is the id of the video wanted
    player = new YT.Player('player_youtube', {
        height: '390',
        width: '640',
        videoId: currentID,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    iframe = this.player.a;
    console.log("INIT TAB")
}

//event emits when video is ready to be play after loaded
function onPlayerReady(event) {
    event.target.playVideo();
}

//detect youtube iframe video state change.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

//detect visibility of the tab, which listens to current tab's visibility change and allow interaction with it.
document.addEventListener("visibilitychange", function (event) {
    console.log(document.visibilityState);
    if (document.visibilityState === "hidden") {

    }
    if (document.visibilityState === "visible") {
        //Posting message to the content script from html to notify content script that html tab is visible.
        window.postMessage({type: "HTMLToContent", get: "Video"}, "*");
    }
});
//Messaging function between html and content script.
window.addEventListener("message", function (event) {
    //This detect the message source is from windows, which is likely to be it is from the content script.
    if (event.source === window){
        //logging messages from the content script
    console.log(event.data.name);
    }
},false);