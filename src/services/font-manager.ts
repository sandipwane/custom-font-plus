import { FontConfig } from '../types';

class FontManager {
  private readonly styleId: string = 'customfont-plus-style';
  private isPermissionGranted: boolean = false;

  setPermissionStatus(status: boolean): void {
    this.isPermissionGranted = status;
  }

  private createStyleElement(config: FontConfig): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = this.styleId;
    style.textContent = this.getStyleContent(config);
    return style;
  }

  private getStyleContent(config: FontConfig): string {
    return `
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
  }

  apply(config: FontConfig): void {
    this.remove();
    if (config.isEnabled) {
      document.head.appendChild(this.createStyleElement(config));
    }
  }

  remove(): void {
    const style = document.getElementById(this.styleId);
    style?.remove();
  }
}

export const fontManager = new FontManager();
