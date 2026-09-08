import React, { useState, useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { Card, CardContent, Button, Header } from '../../ui';

const ALL_SERVICES_MAP = {
  calendar: { id: 'calendar', title: 'Eventos & Avaliações', icon: 'calendar-clock', action: 'calendar' },
  announcements: { id: 'announcements', title: 'Anúncios de UCs', icon: 'bullhorn-variant-outline', action: 'announcements' },
  tickets: { id: 'tickets', title: 'Tickets Abertos', icon: 'ticket-confirmation-outline', action: 'dashboard', module: 'tickets' },
  birthdays: { id: 'birthdays', title: 'Aniversários', icon: 'cake-variant', action: 'dashboard', module: 'birthdays' },
  teachers: { id: 'teachers', title: 'Docentes s/ User', icon: 'account-alert', action: 'dashboard', module: 'teachers' },
  courses: { id: 'courses', title: 'Cursos Registo', icon: 'book-sync-outline', action: 'dashboard', module: 'courses' },
  dtp: { id: 'dtp', title: 'Alertas DTP 25/26', icon: 'alert-decagram', action: 'dashboard', module: 'dtp' },
  dtpPrevYear: { id: 'dtpPrevYear', title: 'Alertas DTP 24/25', icon: 'history', action: 'dashboard', module: 'dtpPrevYear' },
  salas: { id: 'salas', title: 'Salas', icon: 'door', action: 'rooms' },
  upload: { id: 'upload', title: 'Upload Ficheiros', icon: 'cloud-upload', action: 'upload' },
  pedagogico: { id: 'pedagogico', title: 'Inquéritos Pedagógicos', icon: 'chart-box-outline', action: 'dashboard', module: 'pedagogico' },
  dashboard: { id: 'dashboard', title: 'Dashboards & KPIs', icon: 'view-dashboard', action: 'dashboard' },
};

const DEFAULT_PINNED_SERVICES = ['calendar', 'announcements', 'salas', 'upload', 'dashboard'];

function Home({
  profile: userProfile,
  pinnedServices = DEFAULT_PINNED_SERVICES,
  onNavigate,
  onNavigateToProfile,
  onReorderPinnedServices,
  hasAccessToModule,
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  // Filtra e deriva a lista de serviços afixados segundo permissões sem disparar re-render extra
  const pinnedServicesList = useMemo(() => {
    const list = (pinnedServices && pinnedServices.length > 0 ? pinnedServices : DEFAULT_PINNED_SERVICES)
      .map((serviceId) => ALL_SERVICES_MAP[serviceId])
      .filter(Boolean)
      .filter((serviceItem) => (hasAccessToModule ? hasAccessToModule(serviceItem.id) : true));

    if (!list.some((serviceItem) => serviceItem.id === 'dashboard')) {
      list.push(ALL_SERVICES_MAP['dashboard']);
    }
    return list;
  }, [pinnedServices, hasAccessToModule]);

  const movePinnedItem = (itemIndex, moveDirection) => {
    const targetIndex = moveDirection === 'left' ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex < 0 || targetIndex >= pinnedServicesList.length) return;

    const reorderedList = [...pinnedServicesList];
    const [movedItem] = reorderedList.splice(itemIndex, 1);
    reorderedList.splice(targetIndex, 0, movedItem);

    if (onReorderPinnedServices) {
      onReorderPinnedServices(reorderedList.map((serviceItem) => serviceItem.id));
    }
  };

  const userFirstName = userProfile?.name?.split(' ')[0] || 'Utilizador';

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title={`Bem-vindo, ${userFirstName}`}
        rightAction={
          <TouchableOpacity
            onPress={onNavigateToProfile}
            className="w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Text className="text-primary font-bold text-base">
              {(userProfile?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              Atalhos Afixados
            </Text>
            <Button
              variant={isEditMode ? "secondary" : "ghost"}
              size="sm"
              onPress={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? 'Concluir' : 'Editar Ordem'}
            </Button>
          </View>
          <Text className="text-xs text-muted dark:text-muted-dark mt-1">
            {isEditMode
              ? 'Utilize as setas nos cartões para os mover de posição.'
              : 'Pode afixar novos cartões a partir dos Dashboards.'}
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {pinnedServicesList.map((serviceItem, serviceIndex) => (
            <Card
              key={serviceItem.id ? `service-${serviceItem.id}` : `service-idx-${serviceIndex}`}
              className="w-[48%] mb-4 rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-sm"
              onPress={() => {
                if (!isEditMode && onNavigate) {
                  onNavigate(serviceItem.action, serviceItem.module);
                }
              }}
              onLongPress={() => setIsEditMode(true)}
            >
              <CardContent className="items-center justify-center py-5 px-2 min-h-[115px]">
                {isEditMode ? (
                  <View className="flex-row justify-between w-full mb-1">
                    <TouchableOpacity
                      disabled={serviceIndex === 0}
                      onPress={() => movePinnedItem(serviceIndex, 'left')}
                      className={`w-9 h-9 rounded-xl items-center justify-center bg-slate-100 dark:bg-slate-800 ${
                        serviceIndex === 0 ? 'opacity-30' : ''
                      }`}
                    >
                      <Icon source="arrow-left" size={20} color="#ff9800" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={serviceIndex === pinnedServicesList.length - 1}
                      onPress={() => movePinnedItem(serviceIndex, 'right')}
                      className={`w-9 h-9 rounded-xl items-center justify-center bg-slate-100 dark:bg-slate-800 ${
                        serviceIndex === pinnedServicesList.length - 1 ? 'opacity-30' : ''
                      }`}
                    >
                      <Icon source="arrow-right" size={20} color="#ff9800" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="w-12 h-12 rounded-2xl bg-primary/15 dark:bg-primary/20 items-center justify-center mb-2.5">
                    <Icon source={serviceItem.icon} size={26} color="#f57c00" />
                  </View>
                )}
                <Text
                  numberOfLines={2}
                  className="font-bold text-xs text-center text-slate-800 dark:text-slate-200 leading-4"
                >
                  {serviceItem.title}
                </Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(Home);
