import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, View, ScrollView, StatusBar, Text, Image } from 'react-native';
import { PaperProvider, ActivityIndicator, Banner, Icon } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InstitutionalHeader, Login, AuthWebView } from './components';
import Config from './config';
import { usePreferences } from './hooks/usePreferences';
import { useAuth } from './hooks/useAuth';
import AppNavigator from './navigation/AppNavigator';
import { setupMockInterceptor } from './services/mock/mockInterceptor';

// Ativa o intercetor de rede para pedidos da sessão de demonstração
//isto só esta aqui para apresentaç
setupMockInterceptor();

const BFF_HOST = Config?.API_URL || 'http://localhost:3000';
console.log(`[APP CONFIG] Loaded ENV: '${Config?.ENV}' | BFF_HOST: '${BFF_HOST}'`);

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [dashboardInitialModule, setDashboardInitialModule] = useState(null);

  const preferencesRef = useRef(null);

  // Callbacks com referências estáveis para o ciclo de vida de autenticação
  const handlePreferencesLoaded = useCallback((remotePrefs) => {
    preferencesRef.current?.applyRemotePreferences(remotePrefs);
  }, []);

  const handleSessionExpired = useCallback(() => {
    preferencesRef.current?.resetTheme();
  }, []);

  const handleLogout = useCallback(() => {
    preferencesRef.current?.resetTheme();
    setCurrentView('home');
  }, []);

  // Hook de autenticação e sessão OAuth
  const auth = useAuth({
    bffHost: BFF_HOST,
    onPreferencesLoaded: handlePreferencesLoaded,
    onSessionExpired: handleSessionExpired,
    onLogout: handleLogout,
  });

  // Hook de preferências e tema (com accessToken atualizado do hook de auth)
  const preferences = usePreferences({
    accessToken: auth.accessToken,
    bffHost: BFF_HOST,
  });
  preferencesRef.current = preferences;

  const {
    isDarkMode,
    currentTheme,
    pinnedServices,
    activeNavKeys,
    handleToggleTheme,
    handleTogglePin,
    handleReorderPinnedServices,
    handleToggleNavItem,
    handleSaveNavTabs,
  } = preferences;

  // Redireciona para o ecrã inicial quando não existe sessão ativa
  useEffect(() => {
    if (!auth.accessToken) {
      setCurrentView('home');
    }
  }, [auth.accessToken]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={currentTheme}>
        <View className={`flex-1 ${isDarkMode ? 'dark bg-background-dark' : 'bg-background'}`}>
          <StatusBar
            barStyle={auth.accessToken ? 'light-content' : isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={auth.accessToken ? '#ff9800' : isDarkMode ? '#121212' : '#f8fafc'}
            translucent={Platform.OS === 'android'}
          />

          {auth.isTestMode && (
            <View className="bg-amber-600 py-1.5 px-3 items-center justify-center flex-row gap-1.5">
              <Icon source="presentation" size={14} color="#ffffff" />
              <Text className="text-white font-bold text-xs tracking-wide">
                MODO DEMONSTRAÇÃO (DADOS SIMULADOS)
              </Text>
            </View>
          )}

          <AuthWebView
            key={auth.loginKey}
            visible={auth.showWebView}
            url={auth.loginUrl}
            onCancel={() => auth.setShowWebView(false)}
            onNavigationStateChange={auth.handleWebViewNavigation}
          />

          {auth.isLoading && auth.accessToken && <InstitutionalHeader />}

          {/* Ecrã de Loading ou Login (quando não autenticado ou sem perfil válido) */}
          {(!auth.accessToken || !auth.userProfile || auth.isLoading) && (
            <ScrollView
              contentContainerStyle={
                (!auth.accessToken || !auth.userProfile) && !auth.isLoading
                  ? { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 24 }
                  : { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }
              }
              showsVerticalScrollIndicator={false}
              className={!auth.accessToken || !auth.userProfile ? 'bg-[#f8fafc]' : ''}
            >
              <Banner
                visible={!!auth.errorMessage}
                actions={[{ label: 'OK', onPress: () => auth.setErrorMessage(null) }]}
                icon="alert"
              >
                {auth.errorMessage}
              </Banner>

              {auth.isLoading && (
                <View className="items-center py-16 justify-center">
                  <Image
                    source={require('./assets/upp_logo_clean.png')}
                    className="w-[260px] h-[58px] mb-6"
                    resizeMode="contain"
                  />
                  <ActivityIndicator animating={true} color="#ff9800" size="large" />
                  <Text className="text-muted dark:text-muted-dark text-sm mt-3 font-medium">A carregar...</Text>
                </View>
              )}

              {!auth.isLoading && (!auth.accessToken || !auth.userProfile) && (
                <Login
                  onLogin={auth.handleLogin}
                  onDemoLogin={auth.handleDemoLogin}
                />
              )}
            </ScrollView>
          )}

          {/* Navegação principal quando autenticado com perfil carregado */}
          {auth.accessToken && auth.userProfile && !auth.isLoading && (
            <AppNavigator
              currentView={currentView}
              setCurrentView={setCurrentView}
              dashboardInitialModule={dashboardInitialModule}
              setDashboardInitialModule={setDashboardInitialModule}
              userProfile={auth.userProfile}
              accessToken={auth.accessToken}
              bffHost={BFF_HOST}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              pinnedServices={pinnedServices}
              onTogglePin={handleTogglePin}
              onReorderPinnedServices={handleReorderPinnedServices}
              activeNavKeys={activeNavKeys}
              onToggleNavItem={handleToggleNavItem}
              onSaveNavTabs={handleSaveNavTabs}
              hasAccessToModule={auth.hasAccessToModule}
              isAdmin={auth.isAdmin}
              errorMessage={auth.errorMessage}
              setErrorMessage={auth.setErrorMessage}
              onLogout={auth.handleLogout}
            />
          )}
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
