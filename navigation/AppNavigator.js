import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Banner, Checkbox, Modal, Portal, Icon } from 'react-native-paper';

import {
  Home,
  Profile,
  Dashboard,
  Upload,
  CalendarEventsDashboard,
  AnnouncementsDashboard,
  AdminPanel,
  Rooms,
} from '../components';

export const ALL_NAV_ITEMS = [
  { view: 'home', label: 'Início', icon: 'home' },
  { view: 'calendar', label: 'Eventos', icon: 'calendar-clock' },
  { view: 'announcements', label: 'Anúncios', icon: 'bullhorn' },
  { view: 'rooms', label: 'Salas', icon: 'door' },
  { view: 'upload', label: 'Upload', icon: 'cloud-upload' },
  { view: 'dashboard', label: 'Dashboard', icon: 'view-dashboard' },
  { view: 'profile', label: 'Perfil', icon: 'account' },
];

function AppNavigator({
  currentView,
  setCurrentView,
  dashboardInitialModule,
  setDashboardInitialModule,
  userProfile,
  accessToken,
  bffHost,
  isDarkMode,
  onToggleTheme,
  pinnedServices,
  onTogglePin,
  onReorderPinnedServices,
  activeNavKeys,
  onToggleNavItem,
  onSaveNavTabs,
  hasAccessToModule,
  isAdmin,
  errorMessage,
  setErrorMessage,
  onLogout,
}) {
  const [showNavConfigModal, setShowNavConfigModal] = useState(false);
  const [tempNavKeys, setTempNavKeys] = useState(activeNavKeys);

  // Callbacks de navegação estáveis para evitar re-renderização dos ecrãs filhos
  const handleNavigateHome = useCallback(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  const handleNavigateProfile = useCallback(() => {
    setCurrentView('profile');
  }, [setCurrentView]);

  const handleHomeNavigate = useCallback((targetAction, targetModule) => {
    if (targetAction === 'dashboard') {
      setDashboardInitialModule(targetModule || null);
      setCurrentView('dashboard');
    } else {
      setCurrentView(targetAction);
    }
  }, [setDashboardInitialModule, setCurrentView]);

  const handleBackFromDashboard = useCallback(() => {
    setDashboardInitialModule(null);
    setCurrentView('home');
  }, [setDashboardInitialModule, setCurrentView]);

  const handleNavItemPress = useCallback((viewKey) => {
    setDashboardInitialModule?.(null);
    setCurrentView(viewKey);
  }, [setDashboardInitialModule, setCurrentView]);

  const handleAdminPress = useCallback(() => {
    setDashboardInitialModule?.(null);
    setCurrentView('admin');
  }, [setDashboardInitialModule, setCurrentView]);

  const handleOpenNavConfig = useCallback(() => {
    setTempNavKeys(activeNavKeys);
    setShowNavConfigModal(true);
  }, [activeNavKeys]);

  const handleToggleTempItem = useCallback((key) => {
    setTempNavKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 2) {
          Alert.alert('Atenção', 'Mantenha pelo menos 2 atalhos selecionados.');
          return prev;
        }
        return prev.filter((k) => k !== key);
      } else {
        if (prev.length >= 5) {
          Alert.alert('Limite Atingido', 'Pode ter no máximo 5 atalhos ativos na barra inferior.');
          return prev;
        }
        return [...prev, key];
      }
    });
  }, []);

  const handleSaveNavConfig = useCallback(() => {
    if (onSaveNavTabs) {
      onSaveNavTabs(tempNavKeys);
    } else if (onToggleNavItem) {
      tempNavKeys.forEach((k) => {
        if (!activeNavKeys.includes(k)) onToggleNavItem(k);
      });
      activeNavKeys.forEach((k) => {
        if (!tempNavKeys.includes(k)) onToggleNavItem(k);
      });
    }
    setShowNavConfigModal(false);
  }, [onSaveNavTabs, onToggleNavItem, tempNavKeys, activeNavKeys]);

  // Filtra atalhos visíveis apenas quando as preferências ou permissões mudam
  const visibleNavItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter((item) => activeNavKeys.includes(item.view) && (hasAccessToModule ? hasAccessToModule(item.view) : true));
  }, [activeNavKeys, hasAccessToModule]);

  return (
    <>
      <Banner
        visible={!!errorMessage}
        actions={[{ label: 'OK', onPress: () => setErrorMessage(null) }]}
        icon="alert"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        {errorMessage}
      </Banner>

      {/* Renderização do ecrã ativo */}
      {currentView === 'home' ? (
        <Home
          profile={userProfile}
          pinnedServices={pinnedServices}
          onReorderPinnedServices={onReorderPinnedServices}
          hasAccessToModule={hasAccessToModule}
          onNavigate={handleHomeNavigate}
          onNavigateToProfile={handleNavigateProfile}
        />
      ) : currentView === 'rooms' ? (
        <Rooms
          token={accessToken}
          bffHost={bffHost}
          profile={userProfile}
          onBack={handleNavigateHome}
        />
      ) : currentView === 'dashboard' ? (
        <Dashboard
          token={accessToken}
          bffHost={bffHost}
          initialModule={dashboardInitialModule}
          pinnedServices={pinnedServices}
          onTogglePin={onTogglePin}
          onBack={handleBackFromDashboard}
        />
      ) : currentView === 'upload' ? (
        <Upload
          token={accessToken}
          bffHost={bffHost}
          onBack={handleNavigateHome}
        />
      ) : currentView === 'calendar' ? (
        <CalendarEventsDashboard
          token={accessToken}
          bffHost={bffHost}
          onBack={handleNavigateHome}
        />
      ) : currentView === 'announcements' ? (
        <AnnouncementsDashboard
          token={accessToken}
          bffHost={bffHost}
          onBack={handleNavigateHome}
        />
      ) : currentView === 'admin' ? (
        <AdminPanel
          token={accessToken}
          bffHost={bffHost}
          onBack={handleNavigateHome}
        />
      ) : (
        <Profile
          profile={userProfile}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
          onBack={handleNavigateHome}
        />
      )}

      {/* Barra de Navegação Inferior Flutuante */}
      <View className="absolute bottom-[20px] left-3 right-3 h-[70px] rounded-3xl flex-row items-center justify-around px-2 shadow-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
        {visibleNavItems.map((item) => {
          const isActive = currentView === item.view;
          const activeColor = '#ff9800';
          const inactiveColor = isDarkMode ? '#94a3b8' : '#64748b';

          return (
            <TouchableOpacity
              key={item.view}
              className="flex-1 h-[56px] items-center justify-center py-1 px-0.5 relative"
              onPress={() => handleNavItemPress(item.view)}
              onLongPress={() => setShowNavConfigModal(true)}
              activeOpacity={0.7}
            >
              {isActive && <View className="absolute top-0.5 w-6 h-1 rounded-full bg-primary" />}
              <View className="items-center justify-center mt-1">
                <Icon
                  source={item.icon}
                  size={isActive ? 23 : 21}
                  color={isActive ? activeColor : inactiveColor}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] leading-3 mt-1 text-center ${
                    isActive
                      ? 'font-bold text-primary dark:text-primary-light'
                      : 'font-medium text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {isAdmin && (
          <TouchableOpacity
            className="flex-1 h-[56px] items-center justify-center py-1 px-0.5 relative"
            onPress={handleAdminPress}
            activeOpacity={0.7}
          >
            {currentView === 'admin' && <View className="absolute top-0.5 w-6 h-1 rounded-full bg-primary" />}
            <View className="items-center justify-center mt-1">
              <Icon
                source="security"
                size={currentView === 'admin' ? 23 : 21}
                color={currentView === 'admin' ? '#ff9800' : isDarkMode ? '#94a3b8' : '#64748b'}
              />
              <Text
                numberOfLines={1}
                className={`text-[10px] leading-3 mt-1 text-center ${
                  currentView === 'admin'
                    ? 'font-bold text-primary dark:text-primary-light'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                Admin
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="flex-1 h-[56px] items-center justify-center py-1 px-0.5"
          onPress={handleOpenNavConfig}
          activeOpacity={0.7}
        >
          <View className="items-center justify-center mt-1">
            <Icon source="tune" size={21} color={isDarkMode ? '#94a3b8' : '#64748b'} />
            <Text
              numberOfLines={1}
              className="text-[10px] leading-3 mt-1 text-center font-medium text-slate-500 dark:text-slate-400"
            >
              Editar
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal de Personalização dos Separadores da Barra */}
      <Portal>
        <Modal
          visible={showNavConfigModal}
          onDismiss={() => setShowNavConfigModal(false)}
          contentContainerStyle={{
            alignSelf: 'center',
            width: '90%',
            maxWidth: 400,
          }}
        >
          <View className="bg-card dark:bg-card-dark rounded-3xl p-5 border border-border dark:border-border-dark shadow-xl">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Personalizar Barra de Navegação
            </Text>
            <Text className="text-xs text-muted dark:text-muted-dark mb-4 leading-4">
              Escolha até 5 atalhos para manter visíveis na barra inferior:
            </Text>

            {ALL_NAV_ITEMS.map((item) => {
              if (!hasAccessToModule(item.view)) return null;
              const isSelected = tempNavKeys.includes(item.view);
              return (
                <TouchableOpacity
                  key={`nav-cfg-${item.view}`}
                  className={`flex-row items-center justify-between py-2.5 px-3 rounded-xl mb-1.5 ${
                    isSelected ? 'bg-primary/15 dark:bg-primary/20' : 'bg-transparent'
                  }`}
                  onPress={() => handleToggleTempItem(item.view)}
                >
                  <View className="flex-row items-center">
                    <Icon source={item.icon} size={20} color={isSelected ? '#f57c00' : '#94a3b8'} />
                    <Text
                      className={`text-sm ml-2.5 ${
                        isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Checkbox status={isSelected ? 'checked' : 'unchecked'} color="#ff9800" />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={handleSaveNavConfig}
              className="mt-4 bg-primary h-11 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">Guardar & Concluir</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

export default React.memo(AppNavigator);
