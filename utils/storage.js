import * as SecureStore from "expo-secure-store";

export const SECURE_KEY_TOKEN = "ipp_access_token";
export const KEY_DARK_MODE = "ipp_dark_mode";
export const KEY_NAV_TABS = "ipp_nav_tabs";
export const KEY_PINNED_SERVICES = "ipp_pinned_services";

// Guarda e lê dados no armazenamento seguro do dispositivo (token, preferências, etc.)
export const tokenStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, val) => SecureStore.setItemAsync(key, val),
  deleteItem: (key) => SecureStore.deleteItemAsync(key),
};

export default tokenStorage;
