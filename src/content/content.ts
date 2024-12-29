import { defaultConfig } from '../config/default-config';
import { storageService } from '../services/storage';
import { fontManager } from '../services/font-manager';
import { permissionsService } from '../services/permissions';
import { FontConfig, Message } from '../types';

class ContentScript {
  private config: FontConfig = { ...defaultConfig };

  constructor() {
    this.initialize();
  }

  private getCurrentHost(): string {
    return window.location.hostname;
  }

  private async initialize(): Promise<void> {
    // Prevent FOUC
    const tempStyle = document.createElement('style');
    tempStyle.textContent = `*{opacity:0 !important}`;
    document.documentElement.appendChild(tempStyle);

    // Check permission status
    const hasPermission = await permissionsService.checkTabAccess();
    fontManager.setPermissionStatus(hasPermission);

    // Load configuration
    const stored = await storageService.get([
      'primaryFont',
      'fallbackFont',
      'isEnabled',
      'disabledSites'
    ]);
    
    Object.assign(this.config, stored);
    
    if (this.config.isEnabled && 
        (!hasPermission || !this.config.disabledSites.includes(this.getCurrentHost()))) {
      fontManager.apply(this.config);
    }
    
    tempStyle.remove();
    this.setupMessageListener();
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: Message) => {
      switch(message.type) {
        case 'UPDATE_FONTS':
          Object.assign(this.config, message.config);
          fontManager.apply(this.config);
          break;
          
        case 'TOGGLE_SITE':
          const currentHost = this.getCurrentHost();
          if (message.enabled) {
            this.config.disabledSites = this.config.disabledSites.filter(
              site => site !== currentHost
            );
            fontManager.apply(this.config);
          } else {
            this.config.disabledSites = [...this.config.disabledSites, currentHost];
            fontManager.remove();
          }
          storageService.set({ disabledSites: this.config.disabledSites });
          break;
      }
    });
  }
}

new ContentScript();