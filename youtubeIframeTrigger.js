//This will fire when youtube API had and finish attaching will cause this function to fire, which then send a message
//to the content script then allow the attachment of youtubeFunctions.js
function onYouTubeIframeAPIReady() {
    window.postMessage({type:"ÏframeOnReadyEvent"}, "*");
}