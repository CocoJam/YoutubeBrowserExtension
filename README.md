You need to read the below website if you do not have Browser Extension background:
https://developer.mozilla.org/en-US/Add-ons/WebExtensions

Uploading the extension to Chrome. You need to upload the whole folder

Referencing: Upload_Extension_pic.png

More information: https://developer.chrome.com/extensions/getstarted and README- Preparing Extension
YouTube Extension features and limitations:
    
   1.	Using YouTube API, the ext creates a YouTube iframe that can be injected to some certain web pages. Due the content security policy (CSP), however, some web pages do not allow our iframe injection such as Facebook, Github etc. The ext notifies you with the error messages in those cases.
    More info of the CSP: https://en.wikipedia.org/wiki/Content_Security_Policy 
    
   2.	There is less than 1 second delay of the video playing when you switch the tabs or reload the current tab. This is because the iframe requires time to reload the video from a particular time point on the current tab. There are ways to solve this problem such as:
    •	Play the video inside the background script and cast the video through buffer to the HTML. This solution, however, limits the user interaction with the ext as well as causing lagging. In addition, we are unable to employ this way given the time limitation. 
    •	Play the video across all tabs but only the active tab has the sound. However, this is not a preferred solution as it requires high computation and memory.

3.	Search feature: we use YouTube API Search function. Hence, your search will use your Google/YouTube account to require search results (i.e. the results will be the same as your search result on the YouTube page). There are 5 videos returned with the views number and video title (hover your mouse on each video thumbnail to see). Then, click to play the video of your choice. The search results and new video played will be synchronised across tabs.
4.	The iframe is synchronously draggable, resizable, played and paused across tabs. Reminder: check if all your tabs are zoomed at exactly same size (e.g. 100%) so you can see the iframe’s size and position are synchronised across tabs.
5.	Important: If you reload the extension, you must refresh all the tabs to get the updated ext to work.
6.	To enable user interaction on the iframe, we need to use eventListeners. Unfortunately, YouTube iframe does not listen to some events (e.g. mouse events). Hence, we had to work around it by nesting the iframe inside some div elements. We then made those divs draggable/resizable and the iframe adjustable to its parent element. 
7.	We had used JQuery for dragging/resizing functions. However, they did not give good user experience (i.e. the dragging is not as smooth as we wanted). We then wrote the functions in JavaScript. This added to the high number of code lines but the user experience is improved.
8.	The extension button Circle-icons-computer.svg.png will provide the functionality for user to disable the display of this extension, which can be toggled to show and hide the iframe.
9.  Pages such as youtube.com, github and facebook is ignored due to CSP violation and redundancy.  

10.	Testing: 
    We set up Selenium environment for our Extension testing. For more information. https://www.seleniumhq.org/docs/01_introducing_selenium.jsp#test-automation-for-web-applications
    Our unit tests are written in Java 1.8 or Java 8.
     
   For Windows user please use the chromedriver provided with .exe, while Mac users please use the chromedriver without the .exe. This should be the address of the driver within the webDriverInit.java and youtubeDriver.java, which should have 
    
   For window user:
    System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
    
    
   For Mac user:
    System.setProperty("webdriver.chrome.driver", "chromedriver");
    
    
   Please add all provided libraries to run unit test.
    
   Some prewritten unit test is available. Some tests are shown to be difficult such as test within uniTesting.java matchingTitle and matchingThumbnail, this is due to the dynamic property of youtube as a website that information might not always pass the unit test.
   
   If one would like to write more testing code please remember to close the WebDriver before program finishes, and check task manager for chromedriver activities.

