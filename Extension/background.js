/* Resources
https://developer.chrome.com/extensions/tabs
https://developer.chrome.com/extensions/events
https://www.w3schools.com/js/js_timing.asp
*/

var time = 0;

var tabsOpen = 0;



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "youtube_opened") {
      if(tabsOpen == 0) {
        var timer = setInterval(function() {
          time++
          chrome.browserAction.setBadgeText({text:time});
        }, 1000);
      }
      tabsOpen++;
    } else if (request.message === "youtube_closed") {
      tabsOpen--;
      if(tabsOpen == 0) {
        clearInterval(timer);
      }
    }
  }
