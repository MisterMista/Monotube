console.log("content.js loaded")
chrome.runtime.sendMessage({"message":"youtube_opened"})

chrome.tabs.onRemoved.addListener(function() {
  chrome.runtime.sendMessage({"message":"youtube_closed"})
});
