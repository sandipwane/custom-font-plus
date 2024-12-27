let config = {
    primaryFont: 'JetBrains Mono',
    fallbackFont: 'Arial'
  };
  
  // function applyFonts() {
  //   const style = document.createElement('style');
  //   style.textContent = `
  //     * {
  //       font-family: "${config.primaryFont}", "${config.fallbackFont}" !important;
  //     }
  //     pre, code {
  //       font-family: "${config.primaryFont}" !important;
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }

  function applyFonts() {
    const style = document.createElement('style');
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
  
  chrome.storage.sync.get(['primaryFont', 'fallbackFont'], (result) => {
    if (result.primaryFont) config.primaryFont = result.primaryFont;
    if (result.fallbackFont) config.fallbackFont = result.fallbackFont;
    applyFonts();
  });
  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'UPDATE_FONTS') {
      chrome.storage.sync.get(['primaryFont', 'fallbackFont'], (result) => {
        if (result.primaryFont) config.primaryFont = result.primaryFont;
        if (result.fallbackFont) config.fallbackFont = result.fallbackFont;
        applyFonts();
      });
    }
  });