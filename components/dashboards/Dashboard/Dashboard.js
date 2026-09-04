import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import BirthdayDashboard from '../Birthdays';
import TeachersWithoutUsernameDashboard from '../TeachersWithoutUsername';
import CoursesAwaitingRegistrationDashboard from '../CoursesAwaitingRegistration';
import FaultyDtpArtifactsDashboard from '../FaultyDtpArtifacts';
import FaultyDtpArtifactsPrevYearDashboard from '../FaultyDtpArtifactsPrevYear';
import TicketsDashboard from '../Tickets';
import CalendarEventsDashboard from '../CalendarEvents';
import AnnouncementsDashboard from '../Announcements';
import PedagogicoDashboard from '../Pedagogico';
import { Card, CardContent, Header } from '../../ui';

const AVAILABLE_DASHBOARD_MODULES = [
  {
    id: 'pedagogico',
    title: 'Inquéritos Pedagógicos',
    subtitle: 'Média de avaliação dos estudantes por escola, agrupamento e evolução histórica',
    icon: 'chart-box-outline',
    badge: 'KPIs',
    color: '#1565c0',
  },
  {
    id: 'calendar',
    title: 'Eventos & Avaliações',
    subtitle: 'Calendário de frequências, testes, exames e entregas das UCs',
    icon: 'calendar-clock',
    badge: 'UCs',
    color: '#2e7d32',
  },
  {
    id: 'announcements',
    title: 'Anúncios & Avisos de UCs',
    subtitle: 'Últimas notas, avisos e comunicados publicados pelos docentes',
    icon: 'bullhorn-variant-outline',
    badge: 'Avisos',
    color: '#00897b',
  },
  {
    id: 'tickets',
    title: 'Tickets Abertos (Categorias)',
    subtitle: 'Monitorização de tickets de suporte, PAE e informática pendentes',
    icon: 'ticket-confirmation-outline',
    badge: 'Suporte',
    color: '#e65100',
  },
  {
    id: 'birthdays',
    title: 'Aniversários de Funcionários',
    subtitle: 'Monitorização de datas comemorativas e idades do pessoal do IPP',
    icon: 'cake-variant',
    badge: 'RH',
    color: '#ff9800',
  },
  {
    id: 'teachers',
    title: 'Docentes Sem Username',
    subtitle: 'Intervenção para atribuição de email institucional a docentes do PAE',
    icon: 'account-alert',
    badge: 'Docentes',
    color: '#d32f2f',
  },
  {
    id: 'courses',
    title: 'Cursos Aguardar Registo',
    subtitle: 'Cursos no SIGES pendentes de criação ou associação de entrada no PAE',
    icon: 'book-sync-outline',
    badge: 'Cursos',
    color: '#1976d2',
  },
  {
    id: 'dtp',
    title: 'Alertas DTP / Falhas em UCs',
    subtitle: 'Monitorização de planeamento, sumários, notas e fichas no Ano Corrente 2025/26',
    icon: 'alert-decagram',
    badge: 'DTP 25/26',
    color: '#c2185b',
  },
  {
    id: 'dtpPrevYear',
    title: 'Alertas DTP (Ano Anterior 2024/25)',
    subtitle: 'Relatório e auditoria histórica de irregularidades em UCs no Ano Letivo 2024/25',
    icon: 'history',
    badge: 'DTP 24/25',
    color: '#6a1b9a',
  },
];

const DASHBOARD_COMPONENTS = {
  pedagogico: PedagogicoDashboard,
  calendar: CalendarEventsDashboard,
  announcements: AnnouncementsDashboard,
  tickets: TicketsDashboard,
  birthdays: BirthdayDashboard,
  teachers: TeachersWithoutUsernameDashboard,
  courses: CoursesAwaitingRegistrationDashboard,
  dtp: FaultyDtpArtifactsDashboard,
  dtpPrevYear: FaultyDtpArtifactsPrevYearDashboard,
};

export default function Dashboard({
  token,
  bffHost,
  onBack,
  initialModule = null,
  pinnedServices = [],
  onTogglePin: handleTogglePinService,
}) {
  const [selectedDashboardModuleId, setSelectedDashboardModuleId] = useState(initialModule);

  useEffect(() => {
    setSelectedDashboardModuleId(initialModule);
  }, [initialModule]);


  // Se houver um módulo selecionado, renderiza o componente correspondente
  const ActiveDashboardComponent = DASHBOARD_COMPONENTS[selectedDashboardModuleId];
  if (ActiveDashboardComponent) {
    return (
      <ActiveDashboardComponent
        token={token}
        bffHost={bffHost}
        onBack={() => setSelectedDashboardModuleId(null)}
      />
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Dashboards & Módulos"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Catálogo de Módulos
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mb-4 leading-relaxed">
          Clique num módulo para o abrir, ou no ícone do alfinete para o afixar no ecrã Início.
        </Text>

        <View className="gap-3.5">
          {AVAILABLE_DASHBOARD_MODULES.map((moduleItem) => {
            const isModulePinned = pinnedServices.includes(moduleItem.id);

            return (
              <Card
                key={moduleItem.id}
                onPress={() => setSelectedDashboardModuleId(moduleItem.id)}
              >
                <CardContent className="p-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <View
                      className="w-11 h-11 rounded-xl items-center justify-center"
                      style={{ backgroundColor: `${moduleItem.color}20` }}
                    >
                      <Icon source={moduleItem.icon} size={24} color={moduleItem.color} />
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <View
                        className="px-2.5 py-0.5 rounded-lg"
                        style={{ backgroundColor: `${moduleItem.color}18` }}
                      >
                        <Text className="text-xs font-bold" style={{ color: moduleItem.color }}>
                          {moduleItem.badge}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleTogglePinService && handleTogglePinService(moduleItem.id)}
                        className="p-1.5"
                      >
                        <Icon
                          source={isModulePinned ? 'pin' : 'pin-outline'}
                          size={20}
                          color={isModulePinned ? '#ff9800' : '#94a3b8'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text className="font-bold text-base text-slate-900 dark:text-white mt-1">
                    {moduleItem.title}
                  </Text>

                  <Text className="text-xs text-muted dark:text-muted-dark mt-1 leading-4">
                    {moduleItem.subtitle}
                  </Text>

                  <View className="mt-3.5 pt-2.5 border-t border-border dark:border-border-dark flex-row justify-between items-center">
                    <View className="flex-row items-center gap-1">
                      <Icon source="chart-box-outline" size={14} color={moduleItem.color} />
                      <Text className="text-[11px] font-bold" style={{ color: moduleItem.color }}>
                        {isModulePinned ? 'Afixado no Início' : 'Lista + Métricas'}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-0.5">
                      <Text className="text-xs font-bold text-primary">
                        Abrir Módulo
                      </Text>
                      <Icon source="chevron-right" size={16} color="#ff9800" />
                    </View>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

