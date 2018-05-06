var scurityPolictViolation = true;
//CSP detection of violations. Such as facebook consist CSP to prevent Iframes.
document.addEventListener("securitypolicyviolation", function(e) {
    if (scurityPolictViolation){
    window.postMessage({type:"CSPError"},"*");
    scurityPolictViolation = false;
    }
});
//This method is referenced to StackOverFlow titled Insert code into the page context using a content script
//source: https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
//Forming a script to ready to be filled in and injection
var script = document.createElement('script');
//The content to inject into the given html
var insertion = "(" + function () {
//Dynamically inject div within the html which would be used to contain the Iframe of the youtube API.
//     var div_container = document.createElement('div');
//     div_container.id = "player";
//     document.body.insertBefore(div_container, document.body.firstChild);

    function scriptinjections(source){
        //Creating another script that to contains JavaScript content.
        var scr = document.createElement('script');
        //Loading the JavaScript content that is passed within the the argument of source.
        scr.src =source;
        //Attach the created script to the first script given
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(scr, firstScript);
    }

    //Injection of css frameworks
    cssLinkinjections("https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css");
    cssLinkinjections("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    cssLinkinjections("/resources/demos/style.css");

//Function to ease css injections.
    function cssLinkinjections(source){

        //creating Css script required from the playerCss.css
        var cssScript = document.createElement("link");
        cssScript.setAttribute("rel", "stylesheet");
        cssScript.setAttribute("type", "text/css");
        cssScript.setAttribute("href",source);

        document.getElementsByTagName("head")[0].appendChild(cssScript);

    }
    //Injection of youtube Iframe API sourced from: https://developers.google.com/youtube/iframe_api_reference
    scriptinjections( "https://www.youtube.com/iframe_api");
    //injection of google api for using the search function of the youtube Data API
    //Sourcing from: https://developers.google.com/youtube/v3/
    scriptinjections("https://apis.google.com/js/api.js");
    //injectin of the jquery for ease of developmental usage.
    scriptinjections("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");

    scriptinjections("https://code.jquery.com/ui/1.12.1/jquery-ui.js");
    scriptinjections("https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.js");

    console.log("HEllo there");
} + ")()";

script.textContent = insertion;
//Append the script and then removing it
(document.head || document.documentElement).appendChild(script);
script.remove();
//Logging for debugging purpose.
console.log("Logging js injections");

//injecting youtube Function scripts.
var youtubeStandard = document.createElement("script");
youtubeStandard.src = chrome.extension.getURL("youtubeFunctions.js");
document.body.appendChild(youtubeStandard);
