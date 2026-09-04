import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Text } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import {
  Card,
  CardContent,
  Button,
  SearchInput,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  LoadingState,
  SkeletonList,
  EmptyState,
  Header,
} from '../../ui';
import { normalizeStr } from '../../../utils/text';

export default function AdminPanel({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [moduleAccessList, setModuleAccessList] = useState([]);

  // Lista de módulos disponíveis na app
  const AVAILABLE_APP_MODULES = [
    { id: 'calendar', title: 'Calendário & Eventos', icon: 'calendar-clock' },
    { id: 'announcements', title: 'Anúncios', icon: 'bullhorn' },
    { id: 'rooms', title: 'Salas', icon: 'door' },
    { id: 'upload', title: 'Upload Ficheiros', icon: 'cloud-upload' },
    { id: 'dashboard', title: 'Dashboards', icon: 'view-dashboard' },
    { id: 'tickets', title: 'Tickets', icon: 'ticket-confirmation-outline' },
    { id: 'birthdays', title: 'Aniversários', icon: 'cake-variant' },
    { id: 'teachers', title: 'Docentes s/ User', icon: 'account-alert' },
    { id: 'courses', title: 'Cursos', icon: 'book-sync-outline' },
    { id: 'dtp', title: 'Alertas DTP 25/26', icon: 'alert-decagram' },
    { id: 'dtpPrevYear', title: 'Alertas DTP 24/25', icon: 'history' },
    { id: 'pedagogico', title: 'Inquéritos Pedagógicos', icon: 'chart-box-outline' },
  ];

  const [selectedModuleForEdit, setSelectedModuleForEdit] = useState(null);
  const [temporaryAllowedRoleIds, setTemporaryAllowedRoleIds] = useState([]);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');
  const [isSavingAccessRules, setIsSavingAccessRules] = useState(false);

  const [alertFeedbackState, setAlertFeedbackState] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Lista filtrada de roles baseada na pesquisa (ignora acentos e maiúsculas)
  const filteredRoles = availableRoles.filter((roleItem) => {
    const query = normalizeStr(roleSearchQuery.trim());
    if (!query) return true;
    const roleName = normalizeStr(roleItem.name || '');
    const roleId = normalizeStr(roleItem.id || '');
    return roleName.includes(query) || roleId.includes(query);
  });

  // Lista filtrada de módulos baseada na pesquisa (ignora acentos e maiúsculas)
  const filteredModules = AVAILABLE_APP_MODULES.filter((moduleItem) => {
    const query = normalizeStr(moduleSearchQuery.trim());
    if (!query) return true;
    const moduleTitle = normalizeStr(moduleItem.title || '');
    const moduleId = normalizeStr(moduleItem.id || '');
    return moduleTitle.includes(query) || moduleId.includes(query);
  });

  const selectAllFilteredRoles = () => {
    const updatedRoleIds = [...temporaryAllowedRoleIds];
    filteredRoles.forEach((roleItem) => {
      if (!updatedRoleIds.includes(roleItem.id)) {
        updatedRoleIds.push(roleItem.id);
      }
    });
    setTemporaryAllowedRoleIds(updatedRoleIds);
  };

  const deselectAllFilteredRoles = () => {
    const filteredRoleIds = filteredRoles.map((roleItem) => roleItem.id);
    setTemporaryAllowedRoleIds(temporaryAllowedRoleIds.filter((roleId) => !filteredRoleIds.includes(roleId)));
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, accessResponse] = await Promise.all([
        fetch(`${bffHost}/admin/roles`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${bffHost}/admin/access`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const rolesData = await rolesResponse.json();
      const accessData = await accessResponse.json();

      if (rolesData.success) setAvailableRoles(rolesData.roles);
      if (accessData.success) setModuleAccessList(accessData.access);
    } catch (err) {
      console.error('Erro admin panel:', err);
      setAlertFeedbackState({
        visible: true,
        type: 'error',
        title: 'Erro de Ligação',
        message: 'Não foi possível carregar os dados de administração do servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openModuleAccessModal = (targetModule) => {
    setRoleSearchQuery('');
    const existingAccessRule = moduleAccessList.find((rule) => rule.moduleKey === targetModule.id);

    let currentAllowed = [];
    if (existingAccessRule) {
      currentAllowed = existingAccessRule.allowedRoles || [];
    } else {
      currentAllowed = availableRoles.map((roleItem) => roleItem.id);
    }

    setTemporaryAllowedRoleIds(currentAllowed);
    setSelectedModuleForEdit(targetModule);
  };

  const toggleRoleSelection = (roleId) => {
    if (temporaryAllowedRoleIds.includes(roleId)) {
      setTemporaryAllowedRoleIds(temporaryAllowedRoleIds.filter((id) => id !== roleId));
    } else {
      setTemporaryAllowedRoleIds([...temporaryAllowedRoleIds, roleId]);
    }
  };

  const saveModuleAccessRules = async () => {
    if (!selectedModuleForEdit) return;
    setIsSavingAccessRules(true);
    const targetModuleTitle = selectedModuleForEdit.title;
    try {
      const response = await fetch(`${bffHost}/admin/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleKey: selectedModuleForEdit.id,
          allowedRoles: temporaryAllowedRoleIds,
        }),
      });
      const data = await response.json();
      setSelectedModuleForEdit(null);
      if (data.success) {
        setAlertFeedbackState({
          visible: true,
          type: 'success',
          title: 'Guardado com Sucesso!',
          message: `As permissões de acesso ao módulo "${targetModuleTitle}" foram atualizadas.`,
        });
        fetchAdminData();
      } else {
        setAlertFeedbackState({
          visible: true,
          type: 'error',
          title: 'Erro ao Guardar',
          message: data.error || 'Não foi possível guardar as alterações.',
        });
      }
    } catch (e) {
      setSelectedModuleForEdit(null);
      setAlertFeedbackState({
        visible: true,
        type: 'error',
        title: 'Erro de Comunicação',
        message: 'Não foi possível contactar o servidor para guardar as permissões.',
      });
    } finally {
      setIsSavingAccessRules(false);
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Administração"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
          Gestão de Acessos por Role
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mb-4 leading-relaxed">
          Escolha que grupos (roles) têm permissão para aceder a cada módulo da aplicação.
        </Text>

        <SearchInput
          placeholder="Pesquisar módulo..."
          value={moduleSearchQuery}
          onChangeText={setModuleSearchQuery}
          className="mb-3.5"
        />

        {loading ? (
          <SkeletonList count={4} />
        ) : filteredModules.length === 0 ? (
          <EmptyState
            icon="view-grid-plus-outline"
            title="Nenhum módulo encontrado"
            description="Não existem módulos correspondentes à sua pesquisa."
            actionLabel={moduleSearchQuery ? "Limpar Pesquisa" : undefined}
            onAction={() => setModuleSearchQuery('')}
          />
        ) : (
          filteredModules.map((moduleItem) => {
            const dbAccessRule = moduleAccessList.find((rule) => rule.moduleKey === moduleItem.id);
            const restrictedRolesDisplay = dbAccessRule ? dbAccessRule.allowedRoles.length : 'Todos';

            return (
              <Card
                key={moduleItem.id}
                className="mb-2.5"
                onPress={() => openModuleAccessModal(moduleItem)}
              >
                <CardContent className="flex-row items-center p-3.5">
                  <View className="w-10 h-10 rounded-xl bg-primary/15 items-center justify-center mr-3">
                    <Icon source={moduleItem.icon} size={22} color="#f57c00" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-sm text-slate-900 dark:text-white">
                      {moduleItem.title}
                    </Text>
                    <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                      Acesso:{' '}
                      <Text className="font-semibold text-primary-dark dark:text-primary-light">
                        {restrictedRolesDisplay === 'Todos' ? 'Todos (Padrão)' : `${restrictedRolesDisplay} role(s)`}
                      </Text>
                    </Text>
                  </View>
                  <Icon source="chevron-right" size={20} color="#94a3b8" />
                </CardContent>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Dialog visible={!!selectedModuleForEdit} onDismiss={() => !isSavingAccessRules && setSelectedModuleForEdit(null)}>
        <DialogHeader onClose={() => !isSavingAccessRules && setSelectedModuleForEdit(null)}>
          <DialogTitle numberOfLines={1}>Acessos: {selectedModuleForEdit?.title}</DialogTitle>
        </DialogHeader>

        <DialogContent>
          <Text className="text-xs text-muted dark:text-muted-dark mb-2.5">
            Selecione as roles autorizadas a aceder a este módulo:
          </Text>

          <SearchInput
            placeholder="Pesquisar role..."
            value={roleSearchQuery}
            onChangeText={setRoleSearchQuery}
            className="mb-2.5"
          />

          <View className="flex-row justify-between mb-2">
            <Button variant="ghost" size="sm" onPress={selectAllFilteredRoles}>
              Selecionar Todos
            </Button>
            <Button variant="ghost" size="sm" onPress={deselectAllFilteredRoles}>
              Limpar Todos
            </Button>
          </View>

          {filteredRoles.length === 0 && (
            <Text className="text-xs text-muted dark:text-muted-dark text-center my-4">
              Nenhuma role encontrada para esta pesquisa.
            </Text>
          )}

          <FlatList
            data={filteredRoles}
            keyExtractor={(roleItem) => String(roleItem.id)}
            className="max-h-[260px]"
            contentContainerStyle={{ paddingBottom: 10 }}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: roleItem }) => {
              const isChecked = temporaryAllowedRoleIds.includes(roleItem.id);
              return (
                <TouchableOpacity
                  className="flex-row items-center py-2.5 border-b border-border dark:border-border-dark"
                  onPress={() => toggleRoleSelection(roleItem.id)}
                >
                  <Checkbox status={isChecked ? 'checked' : 'unchecked'} color="#ff9800" />
                  <Text className="flex-1 ml-2 text-sm text-slate-800 dark:text-slate-200">
                    {roleItem.name || roleItem.id}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </DialogContent>

        <DialogFooter>
          <Button variant="ghost" size="sm" onPress={() => setSelectedModuleForEdit(null)} disabled={isSavingAccessRules}>
            Cancelar
          </Button>
          <Button variant="default" size="sm" onPress={saveModuleAccessRules} loading={isSavingAccessRules} disabled={isSavingAccessRules}>
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        visible={alertFeedbackState.visible}
        onDismiss={() => setAlertFeedbackState((prev) => ({ ...prev, visible: false }))}
      >
        <DialogContent className="items-center text-center pt-2">
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-3.5 ${
              alertFeedbackState.type === 'success' ? 'bg-success/15' : 'bg-destructive/15'
            }`}
          >
            <Icon
              source={alertFeedbackState.type === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
              size={38}
              color={alertFeedbackState.type === 'success' ? '#2e7d32' : '#d32f2f'}
            />
          </View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white text-center mb-1">
            {alertFeedbackState.title}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark text-center leading-relaxed">
            {alertFeedbackState.message}
          </Text>
        </DialogContent>
        <DialogFooter className="justify-center border-t-0 pt-1">
          <Button
            variant={alertFeedbackState.type === 'success' ? 'default' : 'destructive'}
            size="md"
            className="w-full"
            onPress={() => setAlertFeedbackState((prev) => ({ ...prev, visible: false }))}
          >
            OK
          </Button>
        </DialogFooter>
      </Dialog>
    </View>
  );
}

