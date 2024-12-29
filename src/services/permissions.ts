class PermissionsService {
    async requestTabAccess(): Promise<boolean> {
      try {
        return await chrome.permissions.request({
          permissions: ['activeTab']
        });
      } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
      }
    }
  
    async checkTabAccess(): Promise<boolean> {
      try {
        return await chrome.permissions.contains({
          permissions: ['activeTab']
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
      }
    }
  }
  
  export const permissionsService = new PermissionsService();