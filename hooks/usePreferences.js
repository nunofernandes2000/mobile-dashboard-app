import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

  // Flags para evitar race conditions e debounce de sincronização
  const pendingBffUpdatesRef = useRef({});
  const debounceTimerRef = useRef(null);
  const hasLocalModificationsRef = useRef(false);

  // Carrega preferências do armazenamento local no arranque em paralelo
  useEffect(() => {
    (async () => {
      try {
        const [savedTheme, savedNav, savedPinned] = await Promise.all([
          tokenStorage.getItem(KEY_DARK_MODE),
          tokenStorage.getItem(KEY_NAV_TABS),
          tokenStorage.getItem(KEY_PINNED_SERVICES),
        ]);

        if (savedTheme !== null) {
          const isDark = savedTheme === 'true';
          setIsDarkMode(isDark);
          setColorScheme(isDark ? 'dark' : 'light');
        }

        if (savedNav) {
          const parsed = JSON.parse(savedNav);
          if (Array.isArray(parsed) && parsed.length >= 2) setActiveNavKeys(parsed);
        }

        if (savedPinned) {
          const parsed = JSON.parse(savedPinned);
          if (Array.isArray(parsed) && parsed.length > 0) setPinnedServices(parsed);
        }
      } catch (e) {
        console.warn('Erro ao carregar definições locais:', e.message);
      }
    })();
  }, [setColorScheme]);

  // Sincroniza preferências com o BFF de forma debounced (evita requisições concorrentes e sobrescritas)
  const savePreferencesToBFF = useCallback(
    (preferenceUpdates) => {
      if (!accessToken || !bffHost) return;

      hasLocalModificationsRef.current = true;
      pendingBffUpdatesRef.current = {
        ...pendingBffUpdatesRef.current,
        ...preferenceUpdates,
      };

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        const payload = { ...pendingBffUpdatesRef.current };
        pendingBffUpdatesRef.current = {};
        try {
          const res = await fetch(`${bffHost}/preferences`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const isDemo = typeof accessToken === 'string' && accessToken.includes('DEMO_SESSION_SIMULATED_TOKEN');
            if (isDemo) {
              console.log('[PREFERENCES] [MODO DEMO] Atualizado apenas em memória local:', payload);
            } else {
              console.log('[PREFERENCES] Sincronizado com o servidor com sucesso:', payload);
            }
          }
        } catch (e) {
          console.warn('Erro ao sincronizar preferências com o servidor:', e.message);
        }
      }, 400);
    },
    [accessToken, bffHost]
  );

  // Helper para persistir localmente e sincronizar em background com o BFF
  const persistAndSync = useCallback(
    (storageKey, value, bffPayload) => {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      tokenStorage.setItem(storageKey, serialized).catch((e) => console.warn(`Erro a gravar ${storageKey}:`, e.message));
      savePreferencesToBFF(bffPayload);
    },
    [savePreferencesToBFF]
  );

  // Alterna ou força o modo claro / escuro de forma 100% instantânea
  const handleToggleTheme = useCallback(
    (forceDarkModeState) => {
      setIsDarkMode((prev) => {
        const nextMode = typeof forceDarkModeState === 'boolean' ? forceDarkModeState : !prev;
        setColorScheme(nextMode ? 'dark' : 'light');
        persistAndSync(KEY_DARK_MODE, nextMode ? 'true' : 'false', { darkMode: nextMode });
        return nextMode;
      });
    },
    [setColorScheme, persistAndSync]
  );

  // Fixa ou desfixa um serviço dos favoritos
  const handleTogglePin = useCallback(
    (serviceId) => {
      setPinnedServices((prev) => {
        const updated = prev.includes(serviceId)
          ? prev.filter((id) => id !== serviceId)
          : [...prev, serviceId];
        persistAndSync(KEY_PINNED_SERVICES, updated, { pinnedServices: updated });
        return updated;
      });
    },
    [persistAndSync]
  );

  // Reordena os serviços afixados
  const handleReorderPinnedServices = useCallback(
    (newOrder) => {
      setPinnedServices(newOrder);
      persistAndSync(KEY_PINNED_SERVICES, newOrder, { pinnedServices: newOrder });
    },
    [persistAndSync]
  );

  // Guarda atalhos da barra de navegação de forma consolidada
  const handleSaveNavTabs = useCallback(
    (newTabs) => {
      if (!Array.isArray(newTabs) || newTabs.length < 2 || newTabs.length > 5) {
        Alert.alert('Atenção', 'Selecione entre 2 e 5 atalhos para a barra inferior.');
        return;
      }
      setActiveNavKeys(newTabs);
      persistAndSync(KEY_NAV_TABS, newTabs, { activeNavTabs: newTabs });
    },
    [persistAndSync]
  );

  // Adiciona ou remove itens da barra de navegação (retrocompatibilidade)
  const handleToggleNavItem = useCallback(
    (navItemKey) => {
      setActiveNavKeys((prev) => {
        if (prev.includes(navItemKey)) {
          if (prev.length <= 2) {
            Alert.alert('Atenção', 'Mantenha pelo menos 2 atalhos ativos na barra de navegação.');
            return prev;
          }
          const updated = prev.filter((k) => k !== navItemKey);
          persistAndSync(KEY_NAV_TABS, updated, { activeNavTabs: updated });
          return updated;
        } else {
          if (prev.length >= 5) {
            Alert.alert('Limite Atingido', 'Pode ter no máximo 5 atalhos ativos na barra inferior.');
            return prev;
          }
          const updated = [...prev, navItemKey];
          persistAndSync(KEY_NAV_TABS, updated, { activeNavTabs: updated });
          return updated;
        }
      });
    },
    [persistAndSync]
  );

  // Aplica preferências recebidas da API do BFF (apenas se o utilizador não tiver alterado localmente)
  const applyRemotePreferences = useCallback(
    (preferences) => {
      if (!preferences) return;
      if (hasLocalModificationsRef.current) {
        console.log('[PREFERENCES] Ignoradas preferências remotas obsoletas (existem modificações locais recentes)');
        return;
      }

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

      if (Array.isArray(activeNavTabs) && activeNavTabs.length >= 2) {
        setActiveNavKeys(activeNavTabs);
        tokenStorage.setItem(KEY_NAV_TABS, JSON.stringify(activeNavTabs)).catch(() => { });
      }
    },
    [setColorScheme]
  );

  // Reseta estado do tema para o padrão (modo claro)
  const resetTheme = useCallback(() => {
    hasLocalModificationsRef.current = false;
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
    handleSaveNavTabs,
    applyRemotePreferences,
    resetTheme,
    setIsDarkMode,
  };
}

export default usePreferences;
