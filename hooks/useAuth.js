import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { tokenStorage, SECURE_KEY_TOKEN } from '../utils/storage';
import { resetDemoFulfilledRequests } from '../services/mock/mockApiHandler';
// DEMO_TOKEN só esta aqui para apresentação da universidade
import { DEMO_TOKEN } from '../services/mock/mockInterceptor';

export function useAuth({ bffHost, onPreferencesLoaded, onSessionExpired, onLogout }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [moduleAccess, setModuleAccess] = useState([]);

  const [showWebView, setShowWebView] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const [loginKey, setLoginKey] = useState(0);

  // Mantém referências estáveis aos callbacks externos para evitar loops de renderização
  const callbacksRef = useRef({ onPreferencesLoaded, onSessionExpired, onLogout });
  useEffect(() => {
    callbacksRef.current = { onPreferencesLoaded, onSessionExpired, onLogout };
  }, [onPreferencesLoaded, onSessionExpired, onLogout]);

  // Determina se o utilizador possui privilégios de administração
  const isAdmin = useMemo(() => {
    return (
      userProfile?.roles?.some((roleEntry) => {
        const roleName = (typeof roleEntry === 'object' ? roleEntry.name || roleEntry.id : roleEntry)?.toLowerCase();
        return roleName === 'admin' || roleName === 'test.monitor.apis';
      }) || false
    );
  }, [userProfile]);

  // Valida o acesso a determinado módulo com base nos perfis do utilizador
  const hasAccessToModule = useCallback(
    (moduleKey) => {
      const accessRule = moduleAccess.find((rule) => rule.moduleKey === moduleKey);
      if (!accessRule) return true;
      const userRoles = (userProfile?.roles || []).map((roleEntry) =>
        (typeof roleEntry === 'object' ? roleEntry.name || roleEntry.id : roleEntry)?.toLowerCase()
      );
      return accessRule.allowedRoles.some((allowedRole) => userRoles.includes(allowedRole.toLowerCase()));
    },
    [moduleAccess, userProfile]
  );

  // Carrega perfil, preferências remotas e permissões do utilizador
  const fetchUserProfileAndSettings = useCallback(
    async (targetAccessToken) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${bffHost}/profile`, {
          headers: { Authorization: `Bearer ${targetAccessToken}` },
        });

        if (response.status === 401) {
          setIsLoading(false);
          setAccessToken(null);
          setUserProfile(null);
          setModuleAccess([]);
          setIsTestMode(false);
          callbacksRef.current.onSessionExpired?.();
          await tokenStorage.deleteItem(SECURE_KEY_TOKEN);
          throw new Error('A sua sessão expirou. Por favor, faça login novamente.');
        }

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(errorBody.error || `Erro HTTP ${response.status}`);
        }
        const profileData = await response.json();
        setUserProfile(profileData.profile);
        setIsTestMode(!!profileData.simulated);

        try {
          const [prefRes, accessRes] = await Promise.all([
            fetch(`${bffHost}/preferences`, {
              headers: { Authorization: `Bearer ${targetAccessToken}` },
            }).catch(() => null),
            fetch(`${bffHost}/admin/access`, {
              headers: { Authorization: `Bearer ${targetAccessToken}` },
            }).catch(() => null),
          ]);

          if (prefRes?.ok) {
            const prefData = await prefRes.json().catch(() => null);
            if (prefData?.success && prefData.preferences) {
              callbacksRef.current.onPreferencesLoaded?.(prefData.preferences);
            }
          }

          if (accessRes?.ok) {
            const accessData = await accessRes.json().catch(() => null);
            if (accessData?.success && accessData.access) {
              setModuleAccess(accessData.access);
            }
          }
        } catch (err) {
          console.warn('Nao foi possivel carregar preferencias ou permissoes:', err.message);
        }
      } catch (e) {
        setErrorMessage(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [bffHost]
  );

  // Persiste o token de acesso e carrega dados de sessão
  const persistAccessToken = useCallback(
    async (newToken) => {
      setIsLoading(true);
      setAccessToken(newToken);
      await tokenStorage.setItem(SECURE_KEY_TOKEN, newToken);
      fetchUserProfileAndSettings(newToken);
    },
    [fetchUserProfileAndSettings]
  );

  // Recupera token guardado no armazenamento seguro ao iniciar a aplicação (apenas uma vez)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const savedToken = await tokenStorage.getItem(SECURE_KEY_TOKEN);
        if (savedToken && isMounted) {
          setAccessToken(savedToken);
          await fetchUserProfileAndSettings(savedToken);
        }
      } catch (err) {
        console.warn('Erro ao ler token no arranque:', err.message);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchUserProfileAndSettings]);

  // Verificação periódica em segundo plano para validar a sessão e expiração do JWT
  useEffect(() => {
    if (!accessToken) return;

    let isChecking = false;

    const interval = setInterval(async () => {
      if (isChecking) return;
      isChecking = true;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${bffHost}/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });

        if (response.status === 401) {
          clearInterval(interval);
          await tokenStorage.deleteItem(SECURE_KEY_TOKEN);
          setAccessToken(null);
          setUserProfile(null);
          setModuleAccess([]);
          setIsTestMode(false);
          setErrorMessage('A sua sessão expirou. Por favor, faça login novamente.');
          Alert.alert(
            'Sessão Expirada',
            'A sua sessão expirou. Por favor, inicie sessão novamente para continuar.',
            [{ text: 'OK' }]
          );
          callbacksRef.current.onSessionExpired?.();
        }
      } catch (err) {
        // Falhas transitórias de rede ou timeout não invalidam a sessão
      } finally {
        clearTimeout(timeoutId);
        isChecking = false;
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [accessToken, bffHost]);

  // Inicia o fluxo de autenticação (abre modal WebView com URL do BFF)
  const handleLogin = useCallback(() => {
    setIsLoading(false);
    setErrorMessage(null);

    const redirectTarget = `${bffHost}/auth-success`;
    const url = `${bffHost}/login-mobile?prompt=login&redirect=${encodeURIComponent(redirectTarget)}`;

    setLoginKey((previousKey) => previousKey + 1);
    setLoginUrl(url);
    setShowWebView(true);
  }, [bffHost]);

  // Interceta a navegação da WebView para capturar o token emitido no callback OAuth
  const handleWebViewNavigation = useCallback(
    (navState) => {
      const { url } = navState;

      if (url.includes('oauth-ipp://callback') || url.includes('exp://') || url.includes('token=')) {
        try {
          const parsed = Linking.parse(url);
          let receivedToken = parsed.queryParams?.token;

          if (!receivedToken) {
            const match = url.match(/[?&]token=([^&]+)/);
            if (match) {
              receivedToken = decodeURIComponent(match[1]);
            }
          }

          if (receivedToken) {
            setIsLoading(true);
            setShowWebView(false);
            persistAccessToken(receivedToken);
          }
        } catch (e) {
          console.error('Erro ao ler token:', e);
        }
      }
    },
    [persistAccessToken]
  );

  // DEMO_TOKEN só esta aqui para apresentação da universidade (modo demonstração juri)
  const handleDemoLogin = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setAccessToken(DEMO_TOKEN);
    await fetchUserProfileAndSettings(DEMO_TOKEN);
  }, [fetchUserProfileAndSettings]);

  // Termina a sessão com diálogo de confirmação
  const handleLogout = useCallback(() => {
    const performLogout = async () => {
      setIsLoading(false);
      setAccessToken(null);
      setUserProfile(null);
      setModuleAccess([]);
      setIsTestMode(false);
      setErrorMessage(null);
      resetDemoFulfilledRequests();
      callbacksRef.current.onLogout?.();
      try {
        await tokenStorage.deleteItem(SECURE_KEY_TOKEN);
      } catch (err) {
        console.warn('Erro ao apagar token no logout:', err);
      }
    };

    Alert.alert('Sair', 'Tem a certeza que quer sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: performLogout,
      },
    ]);
  }, []);

  return {
    accessToken,
    userProfile,
    isLoading,
    errorMessage,
    isTestMode,
    isAdmin,
    moduleAccess,
    showWebView,
    loginUrl,
    loginKey,
    setShowWebView,
    setErrorMessage,
    setUserProfile,
    hasAccessToModule,
    handleLogin,
    handleDemoLogin,
    handleWebViewNavigation,
    handleLogout,
    persistAccessToken,
    fetchUserProfileAndSettings,
  };
}

export default useAuth;
