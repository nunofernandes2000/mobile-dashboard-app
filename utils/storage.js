import * as SecureStore from 'expo-secure-store';

export const SECURE_KEY_TOKEN = 'ipp_access_token';
export const KEY_DARK_MODE = 'ipp_dark_mode';
export const KEY_NAV_TABS = 'ipp_nav_tabs';
export const KEY_PINNED_SERVICES = 'ipp_pinned_services';

/**
 * Utilitário de persistência segura através do SecureStore do Expo
 */
export const tokenStorage = {
  getItem: async (key) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key, val) => {
    await SecureStore.setItemAsync(key, val);
  },
  deleteItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export default tokenStorage;
