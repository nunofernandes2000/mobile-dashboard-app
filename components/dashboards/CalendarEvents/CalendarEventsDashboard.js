import React, { useState, useEffect, useMemo } from 'react';
import { View, Linking, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { normalizeStr } from '../../../utils/text';
import {
  Card,
  CardContent,
  StatCard,
  Badge,
  SearchInput,
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  SkeletonList,
  EmptyState,
  ErrorCard,
  ScreenContainer,
} from '../../ui';

function getEventTypeBadge(eventType) {
  switch (eventType) {
    case 'EXAM':
      return { label: 'Exame', variant: 'destructive' };
    case 'TEST':
      return { label: 'Frequência / Teste', variant: 'warning' };
    case 'DELIVERY':
      return { label: 'Entrega de Trabalho', variant: 'info' };
    case 'PRESENTATION':
      return { label: 'Apresentação', variant: 'purple' };
    default:
      return { label: 'Evento', variant: 'secondary' };
  }
}

export default function CalendarEventsDashboard({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isMock, setIsMock] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [selectedUc, setSelectedUc] = useState('ALL');
  const [lateDeliversOnly, setLateDeliversOnly] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [selectedYear, setSelectedYear] = useState('CURRENT');

  useEffect(() => {
    fetchCalendarEvents();
  }, [selectedYear]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        selectedYear === 'CURRENT'
          ? `${bffHost}/calendar`
          : `${bffHost}/calendar?year=${selectedYear}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      setEvents(data.events || []);
      setIsMock(!!data.isMock);
    } catch (err) {
      console.error('Erro ao carregar eventos do calendário:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueUcs = useMemo(() => {
    const ucSet = new Map();
    events.forEach((item) => {
      const meta = item.metadata || {};
      const code = meta.ucCode || item.code;
      const name = meta.ucName || item.name;
      if (code && !ucSet.has(code)) {
        ucSet.set(code, name);
      }
    });
    return Array.from(ucSet.entries()).map(([code, name]) => ({ code, name }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((item) => {
        const meta = item.metadata || {};
        const name = item.name || '';
        const title = meta.assignementTitle || '';
        const desc = meta.assignementDescription || item.obs || '';
        const teacher = meta.personName || '';
        const ucName = meta.ucName || '';
        const ucCode = meta.ucCode || '';
        const eventType = meta.eventType || 'EVENT';

        if (searchText) {
          const query = normalizeStr(searchText);
          const matchName = normalizeStr(name).includes(query);
          const matchTitle = normalizeStr(title).includes(query);
          const matchDesc = normalizeStr(desc).includes(query);
          const matchTeacher = normalizeStr(teacher).includes(query);
          const matchUc = normalizeStr(ucName).includes(query) || normalizeStr(ucCode).includes(query);
          if (!matchName && !matchTitle && !matchDesc && !matchTeacher && !matchUc) {
            return false;
          }
        }

        if (selectedEventType !== 'ALL' && eventType !== selectedEventType) {
          return false;
        }

        if (selectedUc !== 'ALL' && ucCode !== selectedUc) {
          return false;
        }

        if (lateDeliversOnly && !meta.lateDelivers) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.metadata?.assignementDate || a.timestamp || 0).getTime();
        const dateB = new Date(b.metadata?.assignementDate || b.timestamp || 0).getTime();
        return dateA - dateB;
      });
  }, [events, searchText, selectedEventType, selectedUc, lateDeliversOnly]);

  const metrics = useMemo(() => {
    const total = events.length;
    const exams = events.filter((e) => e.metadata?.eventType === 'EXAM').length;
    const tests = events.filter((e) => e.metadata?.eventType === 'TEST').length;
    const deliveries = events.filter((e) => e.metadata?.eventType === 'DELIVERY').length;
    return { total, exams, tests, deliveries, ucsCount: uniqueUcs.length };
  }, [events, uniqueUcs]);

  return (
    <ScreenContainer
      title="Eventos & Avaliações"
      subtitle="Calendário das UCs"
      onBack={onBack}
      rightIcon="refresh"
      onRightAction={fetchCalendarEvents}
      onRefresh={fetchCalendarEvents}
      refreshing={loading}
      extra={
        <Dialog visible={!!selectedEventDetails} onDismiss={() => setSelectedEventDetails(null)}>
          {selectedEventDetails && (() => {
            const meta = selectedEventDetails.metadata || {};
            const eventTypeInfo = getEventTypeBadge(meta.eventType);

            return (
              <>
                <DialogHeader onClose={() => setSelectedEventDetails(null)}>
                  <Badge variant={eventTypeInfo.variant} size="sm" className="mb-1">
                    {eventTypeInfo.label}
                  </Badge>
                  <DialogTitle numberOfLines={2}>
                    {meta.assignementTitle || selectedEventDetails.name}
                  </DialogTitle>
                </DialogHeader>

                <DialogContent scrollable>
                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider">
                    Unidade Curricular
                  </Text>
                  <Text className="font-bold text-sm text-primary mb-3">
                    {meta.ucName || selectedEventDetails.name} ({meta.ucCode || selectedEventDetails.code}) — {meta.courseName || 'Licenciatura'}
                  </Text>

                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider">
                    Data Limite / Realização
                  </Text>
                  <Text className="text-xs text-slate-800 dark:text-slate-200 mb-3">
                    {meta.assignementDate || (selectedEventDetails.timestamp ? new Date(selectedEventDetails.timestamp).toLocaleDateString('pt-PT') : 'N/D')}
                  </Text>

                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider">
                    Docente Responsável
                  </Text>
                  <Text className="text-xs text-slate-800 dark:text-slate-200 mb-3">
                    {meta.personName || 'Docente'} ({meta.personEmail || 'Sem email'})
                  </Text>

                  {meta.assignementDescription ? (
                    <>
                      <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider mb-1">
                        Descrição / Instruções
                      </Text>
                      <View className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3.5 border border-border dark:border-border-dark my-1">
                        <Text className="text-sm text-slate-900 dark:text-white leading-relaxed">
                          {meta.assignementDescription}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </DialogContent>

                <DialogFooter>
                  {selectedEventDetails.url && (
                    <Button
                      variant="default"
                      size="sm"
                      icon="open-in-new"
                      onPress={() => Linking.openURL(selectedEventDetails.url)}
                    >
                      Abrir no Moodle / PAE
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onPress={() => setSelectedEventDetails(null)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </Dialog>
      }
    >
        {isMock && (
          <Badge variant="warning" icon="information-outline" size="sm" className="mb-3 self-start">
            Modo de demonstração (Eventos simulados de Calendário)
          </Badge>
        )}

        <View className="flex-row justify-between gap-2.5 mb-4">
          <View className="flex-1">
            <StatCard
              icon="calendar-clock"
              title="Total de Eventos"
              value={metrics.total}
              color="primary"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="file-document-edit-outline"
              title="Testes / Exames"
              value={metrics.exams + metrics.tests}
              color="destructive"
            />
          </View>
        </View>

        <SearchInput
          placeholder="Pesquisar evento, UC, professor..."
          value={searchText}
          onChangeText={setSearchText}
          className="mb-3"
        />

        <View className="mb-3">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Ano Letivo
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {[
              { label: 'Atual (2025/26)', value: 'CURRENT' },
              { label: '2024/25', value: '202425' },
              { label: '2023/24', value: '202324' },
            ].map((year) => (
              <Badge
                key={year.value}
                variant={selectedYear === year.value ? 'default' : 'secondary'}
                size="md"
                onPress={() => setSelectedYear(year.value)}
                className="mr-2"
              >
                {year.label}
              </Badge>
            ))}
          </ScrollView>
        </View>

        <View className="mb-3">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Tipo de Avaliação / Evento
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {[
              { label: 'Todos', value: 'ALL' },
              { label: 'Avaliações / Testes', value: 'TEST' },
              { label: 'Exames', value: 'EXAM' },
              { label: 'Entregas', value: 'DELIVERY' },
              { label: 'Apresentações', value: 'PRESENTATION' },
            ].map((type) => (
              <Badge
                key={type.value}
                variant={selectedEventType === type.value ? 'default' : 'secondary'}
                size="md"
                onPress={() => setSelectedEventType(type.value)}
                className="mr-2"
              >
                {type.label}
              </Badge>
            ))}
          </ScrollView>
        </View>

        {uniqueUcs.length > 0 && (
          <View className="mb-3">
            <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Filtrar por UC
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <Badge
                variant={selectedUc === 'ALL' ? 'default' : 'secondary'}
                size="md"
                onPress={() => setSelectedUc('ALL')}
                className="mr-2"
              >
                Todas ({events.length})
              </Badge>
              {uniqueUcs.map((uc) => {
                const count = events.filter(
                  (a) => (a.metadata?.ucCode || a.code) === uc.code
                ).length;
                return (
                  <Badge
                    key={uc.code}
                    variant={selectedUc === uc.code ? 'default' : 'secondary'}
                    size="md"
                    onPress={() => setSelectedUc(uc.code)}
                    className="mr-2"
                  >
                    {uc.name} ({count})
                  </Badge>
                );
              })}
            </ScrollView>
          </View>
        )}

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchCalendarEvents} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon="calendar-blank"
            title="Nenhum evento agendado"
            description="Não foram encontrados eventos que correspondam aos filtros de pesquisa atuais."
            actionLabel={searchText || selectedEventType !== 'ALL' ? 'Limpar Filtros' : undefined}
            onAction={() => {
              setSearchText('');
              setSelectedEventType('ALL');
              setSelectedUc('ALL');
            }}
          />
        ) : (
          <View className="gap-3">
            {filteredEvents.map((item, idx) => {
              const meta = item.metadata || {};
              const eventTypeInfo = getEventTypeBadge(meta.eventType);

              return (
                <Card
                  key={meta.assignementId ? `evt-${meta.assignementId}` : (item.code ? `evt-code-${item.code}-${idx}` : `evt-idx-${idx}`)}
                  onPress={() => setSelectedEventDetails(item)}
                >
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Badge variant={eventTypeInfo.variant} size="sm">
                        {eventTypeInfo.label}
                      </Badge>
                      <View className="flex-row items-center">
                        <Icon source="calendar-clock" size={14} color="#94a3b8" />
                        <Text className="text-[11px] font-semibold text-muted dark:text-muted-dark ml-1">
                          {meta.assignementDate ||
                            (item.timestamp
                              ? new Date(item.timestamp).toLocaleDateString('pt-PT')
                              : 'N/D')}
                        </Text>
                      </View>
                    </View>

                    <Text className="font-bold text-sm text-slate-900 dark:text-white">
                      {meta.assignementTitle || item.name}
                    </Text>

                    <Text className="text-xs font-semibold text-primary mt-1">
                      {meta.ucName || 'UC'} ({meta.ucCode || ''})
                    </Text>

                    {meta.assignementDescription ? (
                      <Text
                        numberOfLines={2}
                        className="text-xs text-slate-600 dark:text-slate-300 leading-4 mt-2"
                      >
                        {meta.assignementDescription}
                      </Text>
                    ) : null}

                    <View className="h-[1px] bg-border dark:bg-border-dark my-2.5" />

                    <View className="flex-row justify-between items-center">
                      <Text className="text-[11px] text-muted dark:text-muted-dark">
                        Docente: <Text className="font-medium text-slate-700 dark:text-slate-300">{meta.personName || 'Docente'}</Text>
                      </Text>
                      <Icon source="chevron-right" size={18} color="#94a3b8" />
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
    </ScreenContainer>
  );
}
