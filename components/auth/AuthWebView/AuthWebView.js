import { useState, useEffect, useRef } from 'react';
import { Modal, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Icon } from 'react-native-paper';

export default function AuthWebView({ visible, url, onCancel, onNavigationStateChange }) {
  const webViewRef = useRef(null);
  const [currentWebViewUrl, setCurrentWebViewUrl] = useState(url);

  useEffect(() => {
    setCurrentWebViewUrl(url);
  }, [url]);

  // Interceta o callback do OAuth
  const handleShouldStartLoadRequest = (navigationRequest) => {
    const { url: navigationRequestUrl } = navigationRequest;

    // Se o URL contiver o token ou callback deep link (oauth-ipp:// ou exp://)
    if (
      navigationRequestUrl &&
      (navigationRequestUrl.includes('token=') ||
        navigationRequestUrl.includes('oauth-ipp://') ||
        navigationRequestUrl.includes('exp://'))
    ) {
      if (onNavigationStateChange) {
        onNavigationStateChange(navigationRequest);
      }
      return false; // Evita erro de esquema desconhecido no Android WebView
    }

    return true;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <Text className="text-primary font-semibold text-base">Cancelar</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 dark:text-white">Autenticação IPP</Text>
          <View className="w-[60px]" />
        </View>
        <WebView
          ref={webViewRef}
          source={{ uri: currentWebViewUrl }}
          incognito={true}
          onNavigationStateChange={onNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadRequest}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute inset-0 bg-surface dark:bg-surface-dark items-center justify-center">
              <ActivityIndicator size="large" color="#ff9800" />
            </View>
          )}
          renderError={() => (
            <View className="flex-1 items-center justify-center p-6 bg-surface dark:bg-surface-dark">
              <View className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mb-4">
                <Icon source="alert-circle-outline" size={36} color="#f57c00" />
              </View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
                Não foi possível ligar ao servidor
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 px-4">
                Verifique se o servidor BFF está ativo na porta 3000 ou execute "npm run fix" no terminal do mobile.
              </Text>
              <TouchableOpacity
                onPress={() => webViewRef.current?.reload()}
                className="bg-primary px-6 py-3 rounded-xl shadow-sm"
              >
                <Text className="text-white font-bold text-sm">Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}
