document.addEventListener('DOMContentLoaded', () => {
  const globalToggle = document.getElementById('globalToggle');
  const siteToggle = document.getElementById('siteToggle');

  chrome.storage.sync.get(['isEnabled', 'disabledSites'], (result) => {
    globalToggle.checked = result.isEnabled ?? true;
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const hostname = new URL(tabs[0].url).hostname;
      siteToggle.checked = !(result.disabledSites || []).includes(hostname);
    });
  });

  globalToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ isEnabled: globalToggle.checked }, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_FONTS',
          config: { isEnabled: globalToggle.checked }
        });
      });
    });
  });

  siteToggle.addEventListener('change', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'TOGGLE_SITE',
        enabled: siteToggle.checked
      });
    });
  });
});