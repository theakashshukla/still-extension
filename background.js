chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "webInfo") {
      chrome.storage.local.get("webInfo", function(result) {
          let storedInfo = result.webInfo || [];
          storedInfo.push(message.data);
          chrome.storage.local.set({ webInfo: storedInfo }); 
      }); 
  }
});
