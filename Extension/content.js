/*
This content script is set to only run on the youtube homepage and the youtube
video webpage. Since youtube uses the same css selectors for displaying videos
on the homepage as well as for displaying videos on channel pages, we have to
make the css only be injected in the homepage and not the channel page to allow
proper functionality. To accomplish this, we must refesh the page on url
changes since Youtube does not truly reload the page when navigating the site,
so if you are on the homepage and navigate to a channel page, the css will
remain loaded. The current solution is to reload the page, but I hope to find
a more elegant solution in the future.
*/
console.log("content.js loaded");

//Url update listener which refreshes the page

document.addEventListener("yt-navigate-start",
  function(){
    //The element with id 'progress' is the red loading bar that appears
    //when navigating between pages
    window.location.reload(false);
  }
);

//Timer code
chrome.runtime.sendMessage({"message":"youtube_opened"});
