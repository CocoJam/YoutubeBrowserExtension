//This method is referenced to StackOverFlow titled Insert code into the page context using a content script
//source: https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
//Forming a script to ready to be filled in and injection
var script = document.createElement('script');
//The content to inject into the given html
var insertion = "(" + function () {

} + ")()";

script.textContent = insertion;
//Append the script and then removing it
(document.head || document.documentElement).appendChild(script);
script.remove();
//Logging for debugging purpose.
console.log("Logging js injections");