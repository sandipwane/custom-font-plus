import { defaultConfig } from '../config/default-config';
import { storageService } from '../services/storage';
import { permissionsService } from '../services/permissions';
import { FontConfig, Message } from '../types';

console.log('Popup script starting...');

class Popup {
  private toggles: {
    global: HTMLElement;
    site?: HTMLElement;
  };
  private siteToggleContainer: HTMLElement;
  private permissionRequest: HTMLElement;
  private permissionGranted: boolean = false;

  constructor() {
    console.log('Popup class instantiated');
    this.toggles = {
      global: document.getElementById('globalToggle') as HTMLElement,
    };
    this.siteToggleContainer = document.getElementById('siteToggleContainer') as HTMLElement;
    this.permissionRequest = document.getElementById('permissionRequest') as HTMLElement;
    this.initialize();
    console.log('Popup initialized');
  }

  private async initialize(): Promise<void> {
    await this.checkAndRequestPermissions();
    
    const config = await storageService.get([
      'isEnabled',
      'primaryFont',
      'fallbackFont'
    ]);

    if (this.permissionGranted) {
      const siteConfig = await storageService.get(['disabledSites']);
      Object.assign(config, siteConfig);
    }

    this.setupToggles(config);
    this.setupInputs(config);
    this.setupSaveButton();
    this.setupPermissionButton();
  }

  private async checkAndRequestPermissions(): Promise<void> {
    this.permissionGranted = await permissionsService.checkTabAccess();
    this.updateUIForPermissions();
  }

  private updateUIForPermissions(): void {
    if (this.permissionGranted) {
      this.siteToggleContainer.style.display = 'block';
      this.permissionRequest.style.display = 'none';
      this.toggles.site = document.getElementById('siteToggle') as HTMLElement;
    } else {
      this.siteToggleContainer.style.display = 'none';
      this.permissionRequest.style.display = 'block';
      delete this.toggles.site;
    }
  }

  private setupToggles(config: Partial<FontConfig>): void {
    this.toggles.global.classList.toggle('active', config.isEnabled ?? true);
    
    if (this.permissionGranted) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const url = tabs[0]?.url;
        if (!url) return;
        const hostname = new URL(url).hostname;
        this.toggles.site?.classList.toggle(
          'active',
          !(config.disabledSites || []).includes(hostname)
        );
      });
    }

    this.setupToggleListeners();
  }

  private setupToggleListeners(): void {
    Object.entries(this.toggles).forEach(([key, toggle]) => {
      toggle?.addEventListener('click', async () => {
        toggle.classList.toggle('active');
        
        if (key === 'global') {
          const isEnabled = toggle.classList.contains('active');
          await storageService.set({ isEnabled });
          this.sendMessageToActiveTab({
            type: 'UPDATE_FONTS',
            config: { isEnabled }
          });
        } else if (key === 'site' && this.permissionGranted) {
          this.sendMessageToActiveTab({
            type: 'TOGGLE_SITE',
            enabled: toggle.classList.contains('active')
          });
        }
      });
    });
  }

  private setupInputs(config: Partial<FontConfig>): void {
    (document.getElementById('primaryFont') as HTMLInputElement).value = 
      config.primaryFont || defaultConfig.primaryFont;
    (document.getElementById('fallbackFont') as HTMLInputElement).value = 
      config.fallbackFont || defaultConfig.fallbackFont;
  }

  private setupSaveButton(): void {
    document.getElementById('save')?.addEventListener('click', async () => {
      const config = {
        primaryFont: (document.getElementById('primaryFont') as HTMLInputElement).value,
        fallbackFont: (document.getElementById('fallbackFont') as HTMLInputElement).value
      };
      
      await storageService.set(config);
      this.sendMessageToActiveTab({
        type: 'UPDATE_FONTS',
        config
      });
    });
  }

  private setupPermissionButton(): void {
    document.getElementById('requestPermission')?.addEventListener('click', async () => {
      this.permissionGranted = await permissionsService.requestTabAccess();
      if (this.permissionGranted) {
        this.updateUIForPermissions();
        const config = await storageService.get([
          'isEnabled',
          'disabledSites'
        ]);
        this.setupToggles(config);
      }
    });
  }

  private async sendMessageToActiveTab(message: Message): Promise<void> {
    if (this.permissionGranted) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id as number, message);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  try {
    new Popup();
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
});
