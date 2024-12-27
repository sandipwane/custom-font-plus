document.addEventListener('DOMContentLoaded', () => {
  const toggles = {
    global: document.getElementById('globalToggle'),
    site: document.getElementById('siteToggle')
  };
 
  // Initialize toggles
  chrome.storage.sync.get(['isEnabled', 'disabledSites', 'primaryFont', 'fallbackFont'], (result) => {
    toggles.global.classList.toggle('active', result.isEnabled ?? true);
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const hostname = new URL(tabs[0].url).hostname;
      toggles.site.classList.toggle('active', !(result.disabledSites || []).includes(hostname));
    });
 
    document.getElementById('primaryFont').value = result.primaryFont || 'JetBrains Mono';
    document.getElementById('fallbackFont').value = result.fallbackFont || 'Arial';
  });
 
  // Toggle handlers
  Object.entries(toggles).forEach(([key, toggle]) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      
      if (key === 'global') {
        const isEnabled = toggle.classList.contains('active');
        chrome.storage.sync.set({ isEnabled });
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'UPDATE_FONTS',
            config: { isEnabled }
          });
        });
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'TOGGLE_SITE',
            enabled: toggle.classList.contains('active')
          });
        });
      }
    });
  });
 
  // Save button
  document.getElementById('save').addEventListener('click', () => {
    const config = {
      primaryFont: document.getElementById('primaryFont').value,
      fallbackFont: document.getElementById('fallbackFont').value
    };
    
    chrome.storage.sync.set(config, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_FONTS',
          config
        });
      });
    });
  });
 });