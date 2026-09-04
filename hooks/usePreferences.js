import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'nativewind';
import { tokenStorage, KEY_DARK_MODE, KEY_NAV_TABS, KEY_PINNED_SERVICES } from '../utils/storage';

const DEFAULT_PINNED_SERVICES = ['calendar', 'announcements', 'salas', 'upload', 'dashboard'];
const DEFAULT_ACTIVE_NAV_KEYS = ['home', 'calendar', 'rooms', 'dashboard', 'profile'];

// Temas estáticos em memória para evitar recálculo em cada render
const THEME_DARK = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ffb74d',
    secondary: '#ff9800',
    background: '#121212',
  },
};

const THEME_LIGHT = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#ff9800',
    secondary: '#f57c00',
    background: '#f5f5f5',
  },
};

export function usePreferences({ accessToken, bffHost }) {
  const { setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pinnedServices, setPinnedServices] = useState(DEFAULT_PINNED_SERVICES);
  const [activeNavKeys, setActiveNavKeys] = useState(DEFAULT_ACTIVE_NAV_KEYS);

  // Carrega preferências do armazenamento local no arranque
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await tokenStorage.getItem(KEY_DARK_MODE);
        if (savedTheme !== null) {
          const isDark = savedTheme === 'true';
          setIsDarkMode(isDark);
          setColorScheme(isDark ? 'dark' : 'light');
        }

        const savedNav = await tokenStorage.getItem(KEY_NAV_TABS);
        if (savedNav) {
          const parsed = JSON.parse(savedNav);
          if (Array.isArray(parsed) && parsed.length > 0) setActiveNavKeys(parsed);
        }

        const savedPinned = await tokenStorage.getItem(KEY_PINNED_SERVICES);
        if (savedPinned) {
          const parsed = JSON.parse(savedPinned);
          if (Array.isArray(parsed) && parsed.length > 0) setPinnedServices(parsed);
        }
      } catch (e) {
        console.warn('Erro ao carregar definições locais:', e.message);
      }
    })();
  }, [setColorScheme]);

  // Sincroniza preferências com o BFF na cloud
  const savePreferencesToBFF = useCallback(
    async (preferenceUpdates) => {
      if (!accessToken || !bffHost) return;
      try {
        const res = await fetch(`${bffHost}/preferences`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(preferenceUpdates),
        });
        if (res.ok) {
          console.log('[PREFERENCES] Guardado na cloud/BD com sucesso:', preferenceUpdates);
        }
      } catch (e) {
        console.warn('Erro ao sincronizar preferências com o BFF:', e.message);
      }
    },
    [accessToken, bffHost]
  );

  // Helper para persistir localmente e sincronizar com o BFF
  const persistAndSync = useCallback(
    (storageKey, value, bffPayload) => {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      tokenStorage.setItem(storageKey, serialized).catch((e) => console.warn(`Erro a gravar ${storageKey}:`, e.message));
      savePreferencesToBFF(bffPayload);
    },
    [savePreferencesToBFF]
  );

  // Alterna ou força o modo claro / escuro de forma instantânea
  const handleToggleTheme = useCallback(
    (forceDarkModeState) => {
      const nextMode = typeof forceDarkModeState === 'boolean' ? forceDarkModeState : !isDarkMode;
      setIsDarkMode(nextMode);
      setColorScheme(nextMode ? 'dark' : 'light');

      // Persistência em background sem bloquear o UI thread
      setTimeout(() => {
        persistAndSync(KEY_DARK_MODE, nextMode ? 'true' : 'false', { darkMode: nextMode });
      }, 0);
    },
    [isDarkMode, setColorScheme, persistAndSync]
  );

  // Fixa ou desfixa um serviço dos favoritos
  const handleTogglePin = useCallback(
    (serviceId) => {
      const updated = pinnedServices.includes(serviceId)
        ? pinnedServices.filter((id) => id !== serviceId)
        : [...pinnedServices, serviceId];

      setPinnedServices(updated);
      setTimeout(() => {
        persistAndSync(KEY_PINNED_SERVICES, updated, { pinnedServices: updated });
      }, 0);
    },
    [pinnedServices, persistAndSync]
  );

  // Reordena os serviços afixados
  const handleReorderPinnedServices = useCallback(
    (newOrder) => {
      setPinnedServices(newOrder);
      setTimeout(() => {
        persistAndSync(KEY_PINNED_SERVICES, newOrder, { pinnedServices: newOrder });
      }, 0);
    },
    [persistAndSync]
  );

  // Adiciona ou remove itens da barra de navegação (limite: 2 a 5)
  const handleToggleNavItem = useCallback(
    (navItemKey) => {
      if (activeNavKeys.includes(navItemKey)) {
        if (activeNavKeys.length <= 2) {
          Alert.alert('Atenção', 'Mantenha pelo menos 2 atalhos ativos na barra de navegação.');
          return;
        }
        const updated = activeNavKeys.filter((k) => k !== navItemKey);
        setActiveNavKeys(updated);
        setTimeout(() => {
          persistAndSync(KEY_NAV_TABS, updated, { activeNavTabs: updated });
        }, 0);
      } else {
        if (activeNavKeys.length >= 5) {
          Alert.alert('Limite Atingido', 'Pode ter no máximo 5 atalhos ativos na barra inferior.');
          return;
        }
        const updated = [...activeNavKeys, navItemKey];
        setActiveNavKeys(updated);
        setTimeout(() => {
          persistAndSync(KEY_NAV_TABS, updated, { activeNavTabs: updated });
        }, 0);
      }
    },
    [activeNavKeys, persistAndSync]
  );

  // Aplica preferências recebidas da API do BFF
  const applyRemotePreferences = useCallback(
    (preferences) => {
      if (!preferences) return;
      const { darkMode, pinnedServices: remotePinned, activeNavTabs } = preferences;

      if (darkMode !== undefined) {
        const isDark = !!darkMode;
        setIsDarkMode(isDark);
        setColorScheme(isDark ? 'dark' : 'light');
        tokenStorage.setItem(KEY_DARK_MODE, isDark ? 'true' : 'false').catch(() => { });
      }

      if (Array.isArray(remotePinned) && remotePinned.length > 0) {
        setPinnedServices(remotePinned);
        tokenStorage.setItem(KEY_PINNED_SERVICES, JSON.stringify(remotePinned)).catch(() => { });
      }

      if (Array.isArray(activeNavTabs) && activeNavTabs.length > 0) {
        setActiveNavKeys(activeNavTabs);
        tokenStorage.setItem(KEY_NAV_TABS, JSON.stringify(activeNavTabs)).catch(() => { });
      }
    },
    [setColorScheme]
  );

  // Reseta estado do tema para o padrão (modo claro)
  const resetTheme = useCallback(() => {
    setIsDarkMode(false);
    setColorScheme('light');
  }, [setColorScheme]);

  // Tema configurado para o React Native Paper
  const currentTheme = useMemo(
    () => (isDarkMode ? THEME_DARK : THEME_LIGHT),
    [isDarkMode]
  );

  return {
    isDarkMode,
    currentTheme,
    pinnedServices,
    activeNavKeys,
    handleToggleTheme,
    handleTogglePin,
    handleReorderPinnedServices,
    handleToggleNavItem,
    applyRemotePreferences,
    resetTheme,
    setIsDarkMode,
  };
}

export default usePreferences;
