/* Resources
https://developer.chrome.com/extensions/tabs
https://developer.chrome.com/extensions/events
https://www.w3schools.com/js/js_timing.asp
*/

//TODO:
//Make official icon for extension
//Have toggleable dev mode flag that will display init badge and console logs

console.log("background.js loaded");

//Browser action context menu code
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  title: "Reset Time",
  contexts: ["browser_action"],
  onclick: function () {
    clear();
    setBadgeTime();
  }
});

//Timer code
var sec = 0;

//0 - youtube is not open
//1 - youtube is open
var isYoutubeOpen = 0;

//Initializes browser action badge
chrome.browserAction.setBadgeText({text: "init"});
chrome.browserAction.setBadgeBackgroundColor({color: [0, 127, 127, 255]});

load();

//adds leading zero to single digit number
function pad(n){return(n<10?"0":"")+n};

//Message listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "youtube_opened") {
      //If youtube opens and is not already open, start the timer and update the badge
      if(!isYoutubeOpen) {
        timer = setInterval(function() {
          isYoutubeOpen = 1;
          sec++;
          setBadgeTime();
          if (sec < 3600) {
            chrome.browserAction.setBadgeBackgroundColor({color: [255, 127, 127, 255]});
          } else {
            chrome.browserAction.setBadgeBackgroundColor({color: [127, 0, 0, 255]});
          }

        }, 1000);
      }
    }
  }
);

function setBadgeTime(){
  var time;
  if (sec < 3600) {  //display minutes : seconds
    time = Math.floor(sec / 60) + ":" + pad(sec % 60);
  } else {  //display hours : minutes
    time = Math.floor(sec / 3600) + ":" + pad(sec % 3600);
  }
  chrome.browserAction.setBadgeText({text:time});
}

function save() {
  chrome.storage.local.set({"secStorage": sec}, function() {console.log("Saved")});
}
function load() {
  chrome.storage.local.get("secStorage", function(result) {
    if (result.secStorage !== undefined) {
      chrome.browserAction.setBadgeBackgroundColor({color: [127, 127, 255, 255]});
      sec = result.secStorage;
    }
  });
}
function clear() {
  chrome.storage.local.remove("secStorage");
  sec = 0;
}
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
        save();
        chrome.browserAction.setBadgeBackgroundColor({color: [127, 127, 127, 255]});
      }
    });
  }
});
