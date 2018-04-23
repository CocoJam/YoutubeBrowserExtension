//detecting what browser it is, if it is chrome it will return chrome. Otherwise then it will return associated browser.
const browser = chrome || browers;
window.addEventListener("message", function (event) {
    //communication from html to content goes here
    if (event.source !== window && event.origin === "https://www.youtube.com") {

    }
});