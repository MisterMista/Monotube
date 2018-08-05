/* Resources
https://developer.chrome.com/extensions/tabs
https://developer.chrome.com/extensions/events
https://www.w3schools.com/js/js_timing.asp
*/

//TODO:
//Make official icon for extension
//Have time reset at a settable time and check against system clock (3am)
//Have toggleable dev mode flag that will display init badge and console logs
//Document/comment code so myself and others can comprehend it(content and background scripts)
//store config in local storage somehow
//store time so it persists through closing chrome

console.log("background.js loaded");

//Timer code
var sec = 0;
var min = 0;
var hour = 0;

//0 - youtube is not open
//1 - youtube is open
var isYoutubeOpen = 0;

//Initializes browser action badge
chrome.browserAction.setBadgeText({text: "init"});
chrome.browserAction.setBadgeBackgroundColor({color: [0, 127, 127, 255]});

//Message listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "youtube_opened") {
      //If youtube opens and is not already open, start the timer and update the badge
      if(!isYoutubeOpen) {
        timer = setInterval(function() {
          isYoutubeOpen = 1;

          sec++;
          if (sec >= 60) {
            sec = sec % 60;
            min ++;
            if (min >= 60) {
              min = min % 60;
              hour ++;
            }
          }

          var time;
          var firstPos; //holds number for large number in timer (i.e. `5` in `5:27`)
          var secPos; //holds number for small number in timer (i.e. `4` in `1:04`)
          if (hour === 0) {  //display minutes : seconds
            firstPos = min;
            secPos = sec;
          } else {  //display hours : minutes
            firstPos = hour;
            secPos = min;
          }
          if (secPos < 10) {
            secPos = "0" + secPos;
          }
          time = firstPos + ":" + secPos;

          chrome.browserAction.setBadgeText({text:time});
          if (hour === 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: [255, 127, 127, 255]});
          } else {
            chrome.browserAction.setBadgeBackgroundColor({color: [127, 0, 0, 255]});
          }

        }, 1000);
      }
    }
  }
);

//Tab close listener
//Everytime a tab is closed, this listener checks all the open tabs, and if
//alteast one tab is youtube, nothing will happen, if no tab has youtube,
//then the timer is stopped and the badge color changes to grey
chrome.tabs.onRemoved.addListener(function() {
  if (isYoutubeOpen) {
    chrome.tabs.query({},function(tabs){
      isYoutubeOpen = 0;
      tabs.forEach(function(tab){
        //String.match() returns an array of all matches
        if (tab.url.match(/youtube.com/i) != null) {
          isYoutubeOpen = 1;
        }
      });
      if (!isYoutubeOpen) {
        clearInterval(timer);
        chrome.browserAction.setBadgeBackgroundColor({color: [127, 127, 127, 255]});
      }
    });
  }
});
