// var scurityPolictViolation = true;
// document.addEventListener("securitypolicyviolation", function(e) {
//     
//     scurityPolictViolation = false;
//     
//     
//     
// });


//variables that will be used to reference
var player;
var currentID = "";
var currentTime = 0;
//Method called once the iframe API finish loading.
//referencing the example codes from https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady() {
    
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

//event emits when video is ready to be play after loaded
function onPlayerReady(event) {
    event.target.playVideo();
}

//detect youtube iframe video state change.
function onPlayerStateChange(event) {

}

function stopVideo() {
    player.stopVideo();
}

//detect visibility of the tab, which listens to current tab's visibility change and allow interaction with it.
document.addEventListener("visibilitychange", function (event) {
    
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
        
        currentID = event.data.videoId;
        currentTime = event.data.Time;
        console.log(event.data);
        player.loadVideoById(event.data.videoId, event.data.Time);
        // player.setSize(event.data.width, event.data.height);
        grandParentDiv.style.top = event.data.top + "px";
        grandParentDiv.style.left = event.data.left + "px";
        Resizing(event.data.width, event.data.height);

        return
    }
    //The display function to hide or display the youtube iframe depending one the style of the iframe.
    if (event.source === window && event.data.type === "disableVideo") {
        if (iframe.style.display === "none") {
            iframe.style.display = "block";
            player.loadVideoById(currentID, currentTime);
        } else if (iframe.style.display === "block" || iframe.style.display === "") {
            iframe.style.display = "none";
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

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: "390",
        width: "640",
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
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
function Resize(e) {
    var iframeSize = Resizing(e.clientX, e.clientY);
    //This posts the message to the content script to be up dated
    window.postMessage({type: "IframeResizing", width: iframeSize.width, height: iframeSize.height}, "*");
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
}

//Hover the video to see the search bar
$(document).ready(function() {
    $("#searchBar").hide();
    $("#searchResults").hide();

    $("#grandParentDiv").hover( function() {
        $("#searchBar").toggle();
        $("#searchResults").toggle();
    });

    $("#resizer").hide();
    $("#grandParentDiv").hover(function () {
        $("#resizer").toggle();
    })
});

//Make the grandParentDiv draggable
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
console.log(elmnt.style.top)
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        console.log(elmnt.getBoundingClientRect().top);

        window.postMessage({type: "IframeDragging", top:elmnt.getBoundingClientRect().top , left: elmnt.getBoundingClientRect().left}, "*");
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