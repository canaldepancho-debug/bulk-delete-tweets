// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("X Post Cleaner Extension Installed");
});

// Listener for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start_deletion') {
    // Acknowledge the start
    sendResponse({ status: "started" });
  }
  return true;
});
