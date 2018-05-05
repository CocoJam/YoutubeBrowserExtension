//variables that will be used to reference
var player;
var currentID = null;
var currentTime = 0;
var iframe = null;
var youtubePLayerState = 0;
var ispause = false;

//event emits when video is ready to be play after loaded
function onPlayerReady(event) {
    event.target.playVideo();
}

//detect youtube iframe video state change.
function onPlayerStateChange(event) {
if (event.data === 2){
    window.postMessage({type : "youtubeVideoState",youtubeVideoState: 2},"*");
    ispause = false;
}
if(event.data ===1){
    if (!ispause){
        console.log(event.data);
        player.seekTo(currentTime, true);
        window.postMessage({type : "youtubeVideoState",youtubeVideoState: 1},"*");
    }
    youtubePLayerState = 1;
    ispause =true;
}
}

function stopVideo() {
    player.stopVideo();
}

//detect visibility of the tab, which listens to current tab's visibility change and allow interaction with it.
document.addEventListener("visibilitychange", function (event) {
    if (document.visibilityState === "hidden") {
        //Removing the on mouseLeave event listener when leaving the page.
        document.getElementById("grandParentDiv").removeEventListener("mouseleave",function (ev) {  });
        //View display reset to show the display in order to be repainted by the web browser.
        document.getElementById("searchBar").style.display = "";
        document.getElementById("searchResults").style.display = "";
        document.getElementById("resizer").style.display="";
        stopVideo();

    }
    if (document.visibilityState === "visible") {
        console.log(youtubePLayerState);
        //Posting message to the content script from html to notify content script that html tab is visible.
        if (youtubePLayerState !== 2){
        player.seekTo(currentTime, true);
        }
        // window.postMessage({type: "HTMLToContent", get: "Video"}, "*");
    }
});
//Messaging function between html and content script.
window.addEventListener("message", function (event) {
    if(event.source === window && event.data.type === "search"){
        console.log(event.data);
        document.getElementById("query").value = event.data.search;
        searchVideo();
        return;
    }

    if(event.source === window && event.data.type ==="youtubeVideoState"){
        console.log(event.data.youtubeVideoState);
            youtubePLayerState = event.data.youtubeVideoState;
            if (youtubePLayerState === 2){
                ispause =false;
            }
            return;
    }

    if (event.source === window && event.data.type ==="videoId"){
        console.log(event);
        currentVideoId = event.data.videoId;
        player.loadVideoById(currentVideoId);
        player.stopVideo();
    }

    if(event.source === window && event.data.type === "time"){
        // console.log(event);
        currentTime = event.data.time;
        console.log(currentTime);

        // player.seekTo(event.data.time,true);
    }

    if(event.source === window && event.data.type === "size" ){
        console.log(event.data);
        Resizing(event.data.size.width, event.data.size.height);
        return;
    }

    if (event.source === window && event.data.type === "location"){
        console.log(event.data);
        grandParentDiv.style.top = event.data.location.top;
        grandParentDiv.style.left = event.data.location.left;
        return;
    }
    //This detect the message source is from windows, which is likely to be it is from the content script.
    //To receive the message event from content script and detect the data.videoId for changing the videoId when init.
    if (event.source === window && event.data.type === "init") {

        currentID = event.data.videoId||"";
        currentTime = event.data.time||0;
        console.log(event.data);

        player.loadVideoById(currentID, currentTime);
        // player.setSize(event.data.width, event.data.height);
        if (event.data.location !== undefined){
        grandParentDiv.style.top = event.data.location.top||0;
        grandParentDiv.style.left = event.data.location.left||0;}
        if(event.data.size !== undefined){
        Resizing(event.data.size.width||640, event.data.size.height||390);}
        document.getElementById("query").value = event.data.search;
        searchVideo();
        //Reattach the onmouseleave listener for the hover effect.
        document.getElementById("grandParentDiv").onmouseleave = function (ev) {
            document.getElementById("searchBar").style.display = "none";
            document.getElementById("searchResults").style.display = "none";
            document.getElementById("resizer").style.display="none";
        };
        // searchBar.style.display = "none";
        // searchBar.style.display = "block";
        return
    }
    //The display function to hide or display the youtube iframe depending one the style of the iframe.
    if (event.source === window && event.data.type === "disableVideo") {
        if (grandParentDiv.style.display === "none") {
            grandParentDiv.style.display = "block";
            player.loadVideoById(currentID, currentTime);
        } else if (grandParentDiv.style.display === "block" || grandParentDiv.style.display === "") {
            grandParentDiv.style.display = "none";
            player.stopVideo();
        }
    }
},false);
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
var dataYT;
//Method called once the iframe API finish loading.
//referencing the example codes from https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady() {
    if (currentID === null){
        currentID = "blah";
    }
    //The videoId is the id of the video wanted
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: currentID,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    iframe = this.player.a;
}

// Create HTML element function
function createElement(tag, id) {
    var element = document.createElement(tag);
    element.id = id;
    return element;
}

// Create grandParenetDiv and parentDiv
var grandParentDiv = createElement('div', 'grandParentDiv');
document.body.appendChild(grandParentDiv);

var parentDiv = createElement("div", "parentDiv");
grandParentDiv.append(parentDiv);

// iFrame's initial width
var iFrameInitWidth = parentDiv.offsetWidth - 10;

// Create div for the iFrame
var player = createElement("div", "player");
parentDiv.append(player);

// Create a div for search bar
var searchBar = createElement("div", "searchBar");
parentDiv.append(searchBar);
searchBar.style.width = iFrameInitWidth + 'px';
//searchBar.style.width = "100px";
searchBar.className = "ui mini input";

// Add query tag and search button
var query = createElement("input", "query");
query.placeholder = "Search...";
searchBar.append(query);
query.style.width = iFrameInitWidth/2 + 'px';

var searchButton = createElement("button", "searchButton");
searchButton.innerHTML = "Search";
searchButton.className = "ui olive button" + ", " + "mini ui button" ;
searchBar.append(searchButton);

// Create a div to contain the search results
var searchResults = createElement("div", "searchResults");
parentDiv.append(searchResults);
searchResults.style.width = iFrameInitWidth +'px';

function searchVideo() {
    $.get("https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet,id',
            q: document.getElementById("query").value,
            type: 'video',
            key: 'AIzaSyBY1d9RpLqmieVnW0UjQD2Vahs2thzDsBw'
        },

        // Display the search results
        function (data) {
            //Message the content script
            console.log(document.getElementById("query").value);
            window.postMessage({type: "searchQuery", search: document.getElementById("query").value}, "*");

            // Clear the previous search results
            while (searchResults.hasChildNodes()) {
                searchResults.removeChild(searchResults.lastChild);
            }

            //Hide or display the search results
            $(document).ready(function(){

                $("#hide").click(function(){
                    $("#searchResults").hide();
                });

                $("#display").click(function(){
                    $("#searchResults").show();
                });
            });
            dataYT = data.items;
            dataYT.forEach(function(data){
                var thumbnailWidth = (searchResults.offsetWidth)*0.15 + 'px';
                var thumbnailMargin =  (searchResults.offsetWidth)*0.025 + 'px'

                var thumbnail = document.createElement("img");

                var thumbnailContainer = document.createElement("div");
                thumbnailContainer.id = "thumbnailContainer";
                thumbnailContainer.style.width = thumbnailWidth;

                thumbnailContainer.style.marginLeft = thumbnailMargin;
                thumbnailContainer.style.marginRight = thumbnailMargin;

                thumbnail.style.width = thumbnailWidth;

                thumbnail.src  = data.snippet.thumbnails.default.url;
                //var br = document.createElement('br');

                searchResults.append(thumbnailContainer);
                thumbnailContainer.append(thumbnail);

                // Get the number of views
                var viewCountData;

                $.get("https://www.googleapis.com/youtube/v3/videos", {
                        part: 'snippet,contentDetails,statistics',
                        id: data.id.videoId,
                        key: 'AIzaSyBY1d9RpLqmieVnW0UjQD2Vahs2thzDsBw'
                    },
                    function (data) {

                        viewCountData = data.items[0].statistics.viewCount;
                        var viewCount = document.createElement("div");

                        function formatViewCountData (num) {
                            var numLength = num.length;
                            if(numLength >= 10) {

                                return (parseFloat(num)/1000000000).toFixed(1) + "B views";

                            } else if(numLength >= 7) {
                                return (parseFloat(num)/1000000).toFixed(0) + "M views";

                            } else if (numLength >= 4) {
                                return (parseFloat(num)/1000).toFixed(1) + "K views";

                            } else {
                                return num + " views";
                            }
                        }
                        viewCount.innerHTML = formatViewCountData(viewCountData) + '';
                        viewCount.className = "viewCount";
                        viewCount.style.width = thumbnailWidth;
                        thumbnailContainer.append(viewCount);

                    });


                //Users are able to play the videos of their choice
                function chooseVideo(){
                    player.loadVideoById(data.id.videoId);
                    window.postMessage({videoId:data.id.videoId},"*");
                };
                thumbnail.addEventListener("click", chooseVideo);

                var videoTitle = document.createElement('div');
                parentDiv.append(videoTitle);
                videoTitle.id = "videoTitle";

                function showTitle() {
                    videoTitle.innerHTML = '<br>' + data.snippet.title;
                    videoTitle.style.fontSize = "20px";
                }
                thumbnail.addEventListener("mouseover", showTitle);

                function clearTittle() {
                    videoTitle.innerHTML = "";
                }
                thumbnail.addEventListener("mouseout", clearTittle);
            });
        });
}
// Positioning the search bar
searchBar.style.marginLeft = (parentDiv.offsetWidth - searchBar.offsetWidth)/2 + 'px';

//Ref: https://stackoverflow.com/questions/8960193/how-to-make-html-element-resizable-using-pure-javascript)
var resizer = document.createElement("div");
resizer.id = 'resizer';
parentDiv.append(resizer);
resizer.addEventListener('mousedown', initResize, false);

function initResize(e) {
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
}

// Resize the parentDiv's size
// Then the iFrame's size is adjusted accordingly
// Ref: Stackoverflow
function Resize(e) {
    var iframeSize = Resizing(e.clientX, e.clientY);

}

function Resizing(width,height){
    var newWidth = width - parentDiv.offsetLeft;
    var newHeight = height - parentDiv.offsetTop;

    parentDiv.style.width = newWidth + 'px';
    parentDiv.style.height = newHeight + 'px';

    player.setSize(newWidth - 10 + 'px', newHeight - 10 + 'px');

    searchBar.style.width = newWidth - 10 + 'px';
    query.style.width = (newWidth - 10)/2 + 'px';

    searchResults.style.width = newWidth - 10 + 'px';

    $("#searchResults").find("*").css("width", (searchResults.offsetWidth - 10)*0.15 + 'px');
    $("#searchResults").find("*").css("marginLeft", (searchResults.offsetWidth - 10)*0.025 + 'px');
    $("#searchResults").find("*").css("marginRight", (searchResults.offsetWidth - 10)*0.025 + 'px');

    grandParentDiv.style.width = parentDiv.offsetWidth + 20 + 'px';
    grandParentDiv.style.height = parentDiv.offsetHeight + searchBar.offsetHeight + searchResults.offsetHeight + 20 + 'px';
    console.log(parentDiv.offsetHeight + searchBar.offsetHeight + searchResults.offsetHeight + 20);
    console.log(parentDiv.offsetWidth + 20 );
    return {height: parentDiv.offsetHeight + searchBar.offsetHeight + searchResults.offsetHeight + 20, width:parentDiv.offsetWidth + 20 }
}
function stopResize(e) {
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    //This posts the message to the content script to be up dated
    window.postMessage({type: "IframeResizing", width: e.clientX, height: e.clientY}, "*");
}

//Hover the video to see the search bar
    document.getElementById("grandParentDiv").onmouseover = function (ev) {
        console.log("display");
        document.getElementById("searchBar").style.display = "";
        document.getElementById("searchResults").style.display = "";
        document.getElementById("resizer").style.display="";
    };


//Make the grandParentDiv draggable
// Ref: w3school
dragElement(grandParentDiv);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (searchBar) {
        /* if present, the header is where you move the DIV from:*/
        searchBar.onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        console.log(elmnt.getBoundingClientRect().top);
        //This is to post message to content to snyc the dragging positions.
        window.postMessage({type: "IframeDragging", top:elmnt.style.top , left: elmnt.style.left}, "*");
    }
}

// Click SearchButton to generate search results
searchButton.onclick = searchVideo;

// Enter to get the search results
query.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        searchButton.click();
    }
});
onYouTubeIframeAPIReady();
//hide the elements on loaded.
(function(){
document.getElementById("searchBar").style.display = "none";
document.getElementById("searchResults").style.display = "none";
document.getElementById("resizer").style.display="none";})