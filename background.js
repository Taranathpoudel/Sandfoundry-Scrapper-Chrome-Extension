// In-memory store for accumulated MCQ data across pages
let collectedData = [];
// Stack tracking how many questions each page added — enables undo
let pageBatchSizes = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === "appendData") {
    if (Array.isArray(message.data) && message.data.length > 0) {
      collectedData = collectedData.concat(message.data);
      pageBatchSizes.push(message.data.length);
      console.log(`[Sanfoundry] Appended ${message.data.length} questions. Total: ${collectedData.length}`);
    }
    sendResponse({ success: true, total: collectedData.length });
  }

  if (message.action === "getCount") {
    sendResponse({ count: collectedData.length, batches: pageBatchSizes.length });
  }

  // Remove the last page's worth of questions
  if (message.action === "undoLast") {
    if (pageBatchSizes.length === 0) {
      sendResponse({ success: false, total: 0 });
      return;
    }
    const lastCount = pageBatchSizes.pop();
    collectedData = collectedData.slice(0, -lastCount);
    console.log(`[Sanfoundry] Undid last batch (${lastCount} questions). Total: ${collectedData.length}`);
    sendResponse({ success: true, removed: lastCount, total: collectedData.length });
  }

  if (message.action === "bulkDownload") {
    if (collectedData.length === 0) {
      sendResponse({ success: false });
      return;
    }
    const jsonStr = JSON.stringify(collectedData, null, 2);
    const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const timestamp = new Date().toISOString().slice(0, 10);
    chrome.downloads.download({
      url: dataUrl,
      filename: `sanfoundry_mcqs_${timestamp}.json`,
      saveAs: false,
    });
    collectedData = [];
    pageBatchSizes = [];
    sendResponse({ success: true });
  }

  return true;
});
