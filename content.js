let config = {
  primaryFont: 'JetBrains Mono',
  fallbackFont: 'Arial',
  isEnabled: true,
  disabledSites: []
};

function getCurrentHost() {
  return window.location.hostname;
}

function applyFonts() {
  const currentHost = getCurrentHost();
  if (!config.isEnabled || config.disabledSites.includes(currentHost)) return;

  const style = document.createElement('style');
  style.id = 'customfont-plus-style';
  style.textContent = `
    @font-face {
      font-family: 'MaterialIconsFallback';
      src: local('Material Icons');
      unicode-range: U+E000-F8FF;
    }
    
    * {
      font-family: 'MaterialIconsFallback', "${config.primaryFont}", "${config.fallbackFont}" !important;
    }
    
    .material-icons {
      font-family: 'Material Icons' !important;
    }
  `;
  document.head.appendChild(style);
}

function removeFonts() {
  const style = document.getElementById('customfont-plus-style');
  if (style) style.remove();
}

chrome.storage.sync.get(['primaryFont', 'fallbackFont', 'isEnabled', 'disabledSites'], (result) => {
  Object.assign(config, result);
  if (config.isEnabled) applyFonts();
});

chrome.runtime.onMessage.addListener((message) => {
  switch(message.type) {
    case 'UPDATE_FONTS':
      Object.assign(config, message.config);
      removeFonts();
      if (config.isEnabled) applyFonts();
      break;
    case 'TOGGLE_SITE':
      const host = getCurrentHost();
      config.disabledSites = message.enabled ? 
        config.disabledSites.filter(site => site !== host) :
        [...config.disabledSites, host];
      chrome.storage.sync.set({ disabledSites: config.disabledSites });
      message.enabled ? applyFonts() : removeFonts();
      break;
  }
});