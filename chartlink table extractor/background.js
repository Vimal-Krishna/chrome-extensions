let stocks = {};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ stocks });
});
