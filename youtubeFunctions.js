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
        stopVideo();
    }
    if (document.visibilityState === "visible") {
        //Posting message to the content script from html to notify content script that html tab is visible.
        window.postMessage({type: "HTMLToContent", get: "Video"}, "*");
    }
});
//Messaging function between html and content script.
window.addEventListener("message", function (event) {
    //This detect the message source is from windows, which is likely to be it is from the content script.
    //To receive the message event from content script and detect the data.videoId for changing the videoId when init.
    if (event.source === window && event.data.videoId !== undefined) {
        console.log(event);
        currentID = event.data.videoId;
        currentTime = event.data.Time;
        player.loadVideoById(event.data.videoId, event.data.Time);
        return
    }
    if (event.source === window && event.data.type === "disableVideo") {

    }
},false);

//Creating temper search functions bars which will be substitute later
var inputTab = document.createElement("input");
inputTab.type = "text";
inputTab.id = "Hello";
inputTab.size = 60;

inputTab.addEventListener("keyup", function (event) {
    event.preventDefault();
    //Preventing event submission then uses the google API with api key generated already to send a fetch request (GET).
    //This fetch request will return with snippet and id of the video based on q (query value).
    //Key code 13 is the keycode for enter.
    if (event.keyCode === 13) {
        $.get("https://www.googleapis.com/youtube/v3/search", {
            part: "snippet,id",
            q: this.value,
            type: "video",
            key: "AIzaSyCWm38k7P0UaGK_HhvrQ0RNx0Fup4UVnnc"
        }, function (data) {
            //Just for testing purpose that the first item of the search will be used.
            inputTab = data;
            currentID = data.items[0].id.videoId;
            //This posts the message to the content script with the video id selected.
            window.postMessage({type: "HTMLToContent", videoId: data.items[0].id.videoId}, "*")
        })
    }
});

document.getElementById("player_container").appendChild(inputTab);