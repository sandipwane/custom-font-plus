import { FontConfig } from '../types';

class StorageService {
  async get<T extends keyof FontConfig>(
    keys: T[]
  ): Promise<Pick<FontConfig, T>> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (result) => {
        resolve(result as Pick<FontConfig, T>);
      });
    });
  }

  async set(items: Partial<FontConfig>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(items, resolve);
    });
  }
}

export const storageService = new StorageService();
