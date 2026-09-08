import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, ProgressBar, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { formatDatePt as formatDate } from '../../../utils/formatters';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  LoadingState,
  EmptyState,
  ErrorCard,
  ScreenContainer,
} from '../../ui';

const MEDIA_SOURCES = [
  {
    id: 'camera',
    title: 'Tirar Foto (Câmara)',
    description: 'Usar a câmara do telemóvel para fotografar o documento',
    icon: 'camera',
  },
  {
    id: 'gallery',
    title: 'Galeria de Fotos',
    description: 'Escolher uma foto já existente na galeria',
    icon: 'image-multiple',
  },
  {
    id: 'file',
    title: 'Explorador de Ficheiros',
    description: 'Escolher PDF, Word ou outros documentos',
    icon: 'folder-open',
  },
];

function Upload({ token, bffHost, onBack }) {
  const [pendingFileRequests, setPendingFileRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [fileRequestsErrorMessage, setFileRequestsErrorMessage] = useState(null);
  const [isSimulatedRequests, setIsSimulatedRequests] = useState(false);
  const [fulfillingRequestUuid, setFulfillingRequestUuid] = useState(null);

  const [isMediaSourcePickerVisible, setIsMediaSourcePickerVisible] = useState(false);
  const [activePickerSourceId, setActivePickerSourceId] = useState(null);
  const [selectedFileRequestItem, setSelectedFileRequestItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepLabel, setUploadStepLabel] = useState('');
  const [feedbackAlert, setFeedbackAlert] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Refs para verificar estado dentro do polling sem disparar re-execuções desnecessárias
  const isMediaSourcePickerVisibleRef = useRef(isMediaSourcePickerVisible);
  isMediaSourcePickerVisibleRef.current = isMediaSourcePickerVisible;

  const fulfillingRequestUuidRef = useRef(fulfillingRequestUuid);
  fulfillingRequestUuidRef.current = fulfillingRequestUuid;

  const fetchPendingFileRequests = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingRequests(true);
    setFileRequestsErrorMessage(null);
    try {
      const response = await fetch(`${bffHost}/filerequests?_t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (!response.ok) throw new Error(`Erro na API (${response.status})`);
      const data = await response.json();
      const newResult = data.result || [];

      // Evita re-render da árvore de componentes se os dados recebidos forem idênticos
      setPendingFileRequests((prev) => {
        if (prev.length === newResult.length && JSON.stringify(prev) === JSON.stringify(newResult)) {
          return prev;
        }
        return newResult;
      });
      setIsSimulatedRequests(!!data.simulated);
    } catch (err) {
      if (!isSilent) {
        console.warn('Erro ao carregar pedidos de ficheiro:', err.message);
        setFileRequestsErrorMessage(err.message);
      }
    } finally {
      if (!isSilent) setIsLoadingRequests(false);
    }
  }, [bffHost, token]);

  // Polling suave configurado para 20 segundos
  useEffect(() => {
    fetchPendingFileRequests();
    const pollingInterval = setInterval(() => {
      // Não faz polling se o utilizador estiver a interagir com o modal ou a enviar ficheiro
      if (!isMediaSourcePickerVisibleRef.current && !fulfillingRequestUuidRef.current) {
        fetchPendingFileRequests(true);
      }
    }, 20000);
    return () => clearInterval(pollingInterval);
  }, [fetchPendingFileRequests]);

  const pickMedia = async (sourceType) => {
    if (sourceType === 'camera') {
      try {
        const perms = await ImagePicker.getCameraPermissionsAsync();
        if (!perms.granted) {
          const requested = await ImagePicker.requestCameraPermissionsAsync();
          if (!requested.granted) throw new Error('Permissão de acesso à câmara recusada.');
        }
        const result = await ImagePicker.launchCameraAsync({
          quality: 0.7,
          allowsEditing: false,
        });
        if (result.canceled || !result.assets?.[0]) return null;
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.fileName || `foto_camera_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
        };
      } catch (e) {
        if (e.message?.includes('recusada')) throw e;
        console.warn('Erro ao abrir câmara:', e.message);
        throw new Error('Não foi possível iniciar a câmara.');
      }
    }

    if (sourceType === 'gallery') {
      try {
        const perms = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!perms.granted && perms.canAskAgain) {
          const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!requested.granted) throw new Error('Permissão de acesso à galeria recusada.');
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          allowsEditing: false,
        });
        if (result.canceled || !result.assets?.[0]) return null;
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.fileName || `foto_galeria_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
        };
      } catch (e) {
        if (e.message?.includes('recusada')) throw e;
        console.warn('Erro ao abrir galeria:', e.message);
        throw new Error('Não foi possível aceder à galeria de fotos.');
      }
    }

    if (sourceType === 'file') {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });
        if (result.canceled || !result.assets?.[0]) return null;
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.name || `documento_${Date.now()}`,
          type: asset.mimeType || 'application/octet-stream',
        };
      } catch (e) {
        console.warn('Erro ao abrir explorador de ficheiros:', e.message);
        throw new Error('Não foi possível aceder ao explorador de ficheiros.');
      }
    }
    return null;
  };

  const handleFulfillRequest = (sourceType) => {
    const requestItem = selectedFileRequestItem;
    if (!requestItem) return;

    setActivePickerSourceId(sourceType);
    setIsMediaSourcePickerVisible(false);

    // Permite que o modal termine a animação de fecho antes de abrir o seletor nativo do sistema
    setTimeout(async () => {
      try {
        const file = await pickMedia(sourceType);
        setActivePickerSourceId(null);
        if (!file) return;

        setFulfillingRequestUuid(requestItem.uuid);
        setUploadProgress(0.35);
        setUploadStepLabel('A enviar ficheiro para o servidor PAE...');

        // Envia o ficheiro selecionado para o servidor com name="file" (pág. 45-46 do PDF)
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch(`${bffHost}/files/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error(`Falha no upload do ficheiro (${uploadRes.status})`);
        const uploadData = await uploadRes.json();
        const fileUploaded = uploadData.uploadedFiles?.[0] || uploadData.fileUploaded;

        if (!fileUploaded) {
          throw new Error('Servidor não retornou dados válidos do ficheiro.');
        }

        setUploadProgress(0.75);
        setUploadStepLabel('A associar documento ao pedido no PAE...');

        // Associa o ficheiro carregado ao pedido requisitado
        const fulfillRes = await fetch(`${bffHost}/filerequests/fulfill`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: requestItem.uuid, fileUploaded }),
        });

        if (!fulfillRes.ok) throw new Error(`Falha ao associar pedido (${fulfillRes.status})`);

        setUploadProgress(1.0);
        setUploadStepLabel('Concluído com sucesso!');

        setFeedbackAlert({
          visible: true,
          type: 'success',
          title: 'Ficheiro Enviado com Sucesso!',
          message: `O documento foi associado ao pedido "${requestItem.description}" e já se encontra disponível no PAE.`,
        });
        setPendingFileRequests((prev) => prev.filter((item) => item.uuid !== requestItem.uuid));
        fetchPendingFileRequests(true);
      } catch (err) {
        console.error('Erro ao responder ao pedido:', err);
        setFeedbackAlert({
          visible: true,
          type: 'error',
          title: 'Falha no Envio',
          message: err.message || 'Não foi possível associar o ficheiro ao pedido no PAE. Por favor, tente novamente.',
        });
      } finally {
        setActivePickerSourceId(null);
        setFulfillingRequestUuid(null);
        setSelectedFileRequestItem(null);
        setUploadProgress(0);
        setUploadStepLabel('');
      }
    }, 120);
  };

  return (
    <ScreenContainer
      title="Pedidos de Ficheiros"
      onBack={onBack}
      rightIcon="refresh"
      onRightAction={() => fetchPendingFileRequests(false)}
      onRefresh={() => fetchPendingFileRequests(false)}
      refreshing={isLoadingRequests}
      contentContainerStyle={{ paddingBottom: 120 }}
      extra={
        <>
          <Dialog visible={isMediaSourcePickerVisible} onDismiss={() => setIsMediaSourcePickerVisible(false)}>
            <DialogHeader onClose={() => setIsMediaSourcePickerVisible(false)}>
              <DialogTitle>Como pretende enviar o documento?</DialogTitle>
            </DialogHeader>
            <DialogContent>
              {selectedFileRequestItem && (
                <Text className="text-xs text-muted dark:text-muted-dark mb-3">
                  Para: <Text className="font-bold text-slate-800 dark:text-slate-200">{selectedFileRequestItem.description}</Text>
                </Text>
              )}

              {MEDIA_SOURCES.map((source) => {
                const isSelected = activePickerSourceId === source.id;
                return (
                  <TouchableOpacity
                    key={source.id}
                    onPress={() => handleFulfillRequest(source.id)}
                    activeOpacity={0.7}
                    disabled={!!activePickerSourceId}
                    className={`flex-row items-center p-3 rounded-xl mb-2 ${
                      isSelected
                        ? 'bg-primary/20 dark:bg-primary/25 border border-primary'
                        : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <View className="w-10 h-10 rounded-xl bg-primary/15 items-center justify-center mr-3">
                      {isSelected ? (
                        <ActivityIndicator size={20} color="#ff9800" />
                      ) : (
                        <Icon source={source.icon} size={22} color="#f57c00" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-sm text-slate-900 dark:text-white">
                        {source.title}
                      </Text>
                      <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                        {source.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </DialogContent>
            <DialogFooter>
              <Button variant="ghost" size="sm" onPress={() => setIsMediaSourcePickerVisible(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </Dialog>

          <Dialog
            visible={feedbackAlert.visible}
            onDismiss={() => setFeedbackAlert((prev) => ({ ...prev, visible: false }))}
          >
            <View className="items-center py-4 px-2">
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
                  feedbackAlert.type === 'success' ? 'bg-green-100 dark:bg-green-950/50' : 'bg-red-100 dark:bg-red-950/50'
                }`}
              >
                <Icon
                  source={feedbackAlert.type === 'success' ? 'check-circle' : 'alert-circle'}
                  size={36}
                  color={feedbackAlert.type === 'success' ? '#16a34a' : '#dc2626'}
                />
              </View>

              <Text className="text-lg font-bold text-slate-900 dark:text-white text-center">
                {feedbackAlert.title}
              </Text>

              <Text className="text-xs text-muted dark:text-muted-dark text-center mt-2 leading-5">
                {feedbackAlert.message}
              </Text>

              <Button
                variant={feedbackAlert.type === 'success' ? 'default' : 'destructive'}
                size="sm"
                className="mt-5 w-full"
                onPress={() => setFeedbackAlert((prev) => ({ ...prev, visible: false }))}
              >
                {feedbackAlert.type === 'success' ? 'Excelente' : 'Fechar'}
              </Button>
            </View>
          </Dialog>
        </>
      }
    >
        <Card className="mb-4 bg-card dark:bg-card-dark border border-border dark:border-border-dark">
          <CardContent className="flex-row items-center py-3">
            <View className="w-12 h-12 rounded-2xl bg-primary/15 items-center justify-center mr-3">
              <Icon source="file-clock-outline" size={26} color="#f57c00" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-sm text-slate-900 dark:text-white">
                Pedidos Requisitados pela Web / PAE
              </Text>
              <Text className="text-xs text-muted dark:text-muted-dark mt-1 leading-4">
                Os pedidos efetuados pela Secretaria ou Serviços Académicos aparecem aqui em tempo real. Pode fotografar com a câmara, escolher da galeria ou anexar um ficheiro.
              </Text>
            </View>
          </CardContent>
        </Card>

        <View className="flex-row justify-between items-center mb-4">
          <Badge variant="secondary" icon="sync" size="sm">
            Atualização automática (20s)
          </Badge>
          {isSimulatedRequests && (
            <Badge variant="warning" icon="alert-decagram-outline" size="sm">
              Simulado
            </Badge>
          )}
        </View>

        <Text className="text-base font-bold mb-2.5 text-slate-900 dark:text-white">
          Pedidos Pendentes ({pendingFileRequests.length})
        </Text>

        {isLoadingRequests ? (
          <LoadingState label="A verificar novos pedidos de ficheiros..." />
        ) : fileRequestsErrorMessage ? (
          <ErrorCard message={fileRequestsErrorMessage} onRetry={() => fetchPendingFileRequests(false)} />
        ) : pendingFileRequests.length === 0 ? (
          <EmptyState
            icon="check-circle-outline"
            iconColor="#2e7d32"
            title="Nenhum pedido pendente!"
            description="Quando a Secretaria ou a Web efetuar um pedido de ficheiro (ex: justificação de falta), ele aparecerá automaticamente aqui."
          />
        ) : (
          pendingFileRequests.map((fileRequestItem, requestIndex) => {
            const isFulfilling = fulfillingRequestUuid === fileRequestItem.uuid;
            return (
              <Card
                key={fileRequestItem.uuid || (fileRequestItem.id ? `req-id-${fileRequestItem.id}` : `req-${requestIndex}`)}
                className="mb-3.5"
              >
                <CardContent className="p-4">
                  <View className="flex-row items-start">
                    <View className="w-10 h-10 rounded-xl bg-primary/15 items-center justify-center mr-3 mt-0.5">
                      <Icon source="file-document-edit-outline" size={22} color="#f57c00" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-sm text-slate-900 dark:text-white">
                        {fileRequestItem.description}
                      </Text>

                      {fileRequestItem.classRequester && (
                        <Badge variant="secondary" icon="domain" size="sm" className="mt-1.5 self-start">
                          {fileRequestItem.classRequester}
                        </Badge>
                      )}

                      <View className="mt-2 gap-0.5">
                        {fileRequestItem.showDate && (
                          <Text className="text-xs text-muted dark:text-muted-dark">
                            Solicitado em: <Text className="font-bold text-slate-700 dark:text-slate-300">{fileRequestItem.showDate}</Text>
                          </Text>
                        )}
                        {fileRequestItem.expireDate && (
                          <Text className="text-xs text-muted dark:text-muted-dark">
                            Expira em: <Text className="font-bold text-slate-700 dark:text-slate-300">{formatDate(fileRequestItem.expireDate)}</Text>
                          </Text>
                        )}
                        <Text className="font-mono text-[10px] text-muted dark:text-muted-dark mt-0.5">
                          UUID: {fileRequestItem.uuid}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {isFulfilling && (
                    <View className="mt-3.5 p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xs font-medium text-orange-900 dark:text-orange-200">
                          {uploadStepLabel}
                        </Text>
                        <Text className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                          {Math.round(uploadProgress * 100)}%
                        </Text>
                      </View>
                      <ProgressBar
                        progress={uploadProgress}
                        color="#f57c00"
                        style={{ height: 6, borderRadius: 3, backgroundColor: '#fed7aa' }}
                      />
                    </View>
                  )}

                  <Button
                    variant="default"
                    icon="camera"
                    className="mt-3.5"
                    onPress={() => {
                      setSelectedFileRequestItem(fileRequestItem);
                      setIsMediaSourcePickerVisible(true);
                    }}
                    loading={isFulfilling}
                    disabled={isFulfilling}
                  >
                    {isFulfilling ? 'A Enviar Ficheiro...' : 'Responder ao Pedido (Câmara / Galeria / Ficheiros)'}
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
    </ScreenContainer>
  );
}

export default memo(Upload);
