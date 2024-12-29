export interface FontConfig {
    primaryFont: string;
    fallbackFont: string;
    isEnabled: boolean;
    disabledSites: string[];
  }
  
  export interface UpdateMessage {
    type: 'UPDATE_FONTS';
    config: Partial<FontConfig>;
  }
  
  export interface ToggleSiteMessage {
    type: 'TOGGLE_SITE';
    enabled: boolean;
  }

  export type Message = UpdateMessage | ToggleSiteMessage;