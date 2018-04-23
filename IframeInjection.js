//This method is referenced to StackOverFlow titled Insert code into the page context using a content script
//source: https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
//Forming a script to ready to be filled in and injection
var script = document.createElement('script');
//The content to inject into the given html
var insertion = "(" + function () {
//Dynamically inject div within the html which would be used to contain the Iframe of the youtube API.
    var div_container = document.createElement('div');
    div_container.id = "player_container";
    var div = document.createElement('div');
    div.id = "player_youtube";

    function scriptinjections(source){
        //Creating another script that to contains JavaScript content.
        var scr = document.createElement('script');
        //Loading the JavaScript content that is passed within the the argument of source.
        scr.src =source;
        //Attach the created script to the first script given
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(scr, firstScript);
    }
} + ")()";

script.textContent = insertion;
//Append the script and then removing it
(document.head || document.documentElement).appendChild(script);
script.remove();
//Logging for debugging purpose.
console.log("Logging js injections");