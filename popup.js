document.getElementById('save').addEventListener('click', () => {
    const primaryFont = document.getElementById('primaryFont').value;
    const fallbackFont = document.getElementById('fallbackFont').value;
    
    chrome.storage.sync.set({
      primaryFont,
      fallbackFont
    }, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'UPDATE_FONTS'});
      });
    });
  });