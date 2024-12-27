# CustomFont+ 

<div style="display: flex; align-items: center; gap: 2px;">
  <!-- SVG Icon -->
  <svg width="100px" height="100px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#5E6AD2;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4F58B8;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="16" y="16" width="96" height="96" rx="24" fill="url(#grad)"/>
    <text x="48" y="80" font-family="system-ui" font-weight="bold" font-size="64" fill="white">F</text>
    <text x="85" y="60" font-family="system-ui" font-weight="bold" font-size="40" fill="white">+</text>
  </svg>

  <!-- Text Content -->
  <div style="display: flex; align-items: center; margin-top: 15px">
    <p>
      A Chrome extension that enforces custom fonts while preserving Material Icons and special characters.
    </p>
  </div>
</div>


## Features
- Custom font enforcement across websites
- Smart fallback system for special characters
- Material Icons preservation
- Easy font configuration
- No breaking of UI elements

## Installation
1. Clone repository
2. Open Chrome Extensions (`chrome://extensions/`)
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select extension directory

## Usage
1. Click extension icon
2. Set primary font (default: JetBrains Mono)
3. Set fallback font (default: Arial)
4. Click Save

## Development
```bash
git clone [repository-url]
cd CustomFont+