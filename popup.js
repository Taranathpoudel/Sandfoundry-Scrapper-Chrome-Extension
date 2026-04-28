document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const status = document.getElementById("status");
  const counter = document.getElementById("counter");

  // Update UI based on stored count
  function refreshCount() {
    chrome.runtime.sendMessage({ action: "getCount" }, (response) => {
      const count = response?.count || 0;
      if (count > 0) {
        counter.textContent = `${count} question(s) collected so far`;
        downloadBtn.disabled = false;
      } else {
        counter.textContent = "";
        downloadBtn.disabled = true;
      }
    });
  }

  refreshCount();

  // Start Processing: inject content script into current tab
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    status.textContent = "Processing page...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url?.includes("sanfoundry.com")) {
        status.textContent = "⚠ Not a Sanfoundry page!";
        startBtn.disabled = false;
        return;
      }

      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: ["content.js"] },
        () => {
          // Give content script a moment to send its message
          setTimeout(() => {
            refreshCount();
            status.textContent = "✔ Page processed! Go to next page and process again, or download.";
            startBtn.disabled = false;
          }, 800);
        }
      );
    });
  });

  // Bulk Download: ask background to trigger download of all collected data
  downloadBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "bulkDownload" }, (response) => {
      if (response?.success) {
        status.textContent = "✔ Downloaded! Collection cleared.";
        counter.textContent = "";
        downloadBtn.disabled = true;
      } else {
        status.textContent = "⚠ Nothing to download.";
      }
    });
  });
});
