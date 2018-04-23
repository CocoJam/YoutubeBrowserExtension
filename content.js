//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
window.addEventListener("message", function (event) {
    console.log(event);
    //communication from html to content goes here and detecting youtube messages from youtube iframe API
    if (event.source !== window && event.origin === "https://www.youtube.com") {
        var json = JSON.parse(event.data);
        console.log(json);
        window.postMessage({name:"From content"}, "*");
    }
});