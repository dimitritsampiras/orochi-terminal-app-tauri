import { writable, type Writable } from 'svelte/store';

export interface AppSettings {
  arxpPath: string;
}

function createSettingsStore(): Writable<AppSettings> {
  const defaultSettings: AppSettings = {
    arxpPath: '/Users/dimitritsampiras/Documents/Dev/ARXP'
  };

  // Check if localStorage is available
  const isLocalStorageAvailable = typeof localStorage !== 'undefined';

  // Try to load initial state from localStorage if available
  const initialSettings: AppSettings = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem('appSettings') || JSON.stringify(defaultSettings))
    : defaultSettings;

  // Create the writable store
  const { subscribe, set, update } = writable<AppSettings>(initialSettings);

  return {
    subscribe,
    set: (value: AppSettings) => {
      // Update localStorage when setting new value, if available
      if (isLocalStorageAvailable) {
        localStorage.setItem('appSettings', JSON.stringify(value));
      }
      set(value);
    },
    update: (updater: (currentSettings: AppSettings) => AppSettings) => {
      update((currentSettings) => {
        const newSettings = updater(currentSettings);
        // Update localStorage when updating value, if available
        if (isLocalStorageAvailable) {
          localStorage.setItem('appSettings', JSON.stringify(newSettings));
        }
        return newSettings;
      });
    }
  };
}

export const settings = createSettingsStore();

export const lineItemIds = writable([] as string[]);
