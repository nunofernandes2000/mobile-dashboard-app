import React, { useState, useEffect, useMemo } from 'react';
import { View, Linking, Text } from 'react-native';
import { Icon, ProgressBar } from 'react-native-paper';
import { normalizeStr } from '../../../utils/text';
import {
  Card,
  CardContent,
  StatCard,
  Badge,
  SearchInput,
  Button,
  SkeletonList,
  EmptyState,
  ErrorCard,
  ScreenContainer,
} from '../../ui';

export default function TicketsDashboard({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${bffHost}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      setTicketData(data.result || null);
      setIsSimulated(!!data.simulated);
    } catch (err) {
      console.error('Erro ao carregar tickets abertos:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const alerts = ticketData?.alerts || [];
  const entityInfo = ticketData?.entity || {};

  const metrics = useMemo(() => {
    let totalOpen = 0;
    let maxCount = 0;
    alerts.forEach((item) => {
      const val = item.alertValueInt || parseInt(item.alertValueStr, 10) || 0;
      totalOpen += val;
      if (val > maxCount) maxCount = val;
    });
    return { totalOpen, categoriesCount: alerts.length, maxCount };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((item) => {
        if (!searchText) return true;
        const query = normalizeStr(searchText);
        const desc = normalizeStr(item.description || '');
        return desc.includes(query);
      })
      .sort((a, b) => (b.alertValueInt || 0) - (a.alertValueInt || 0));
  }, [alerts, searchText]);

  const getCategoryColor = (count) => {
    if (count >= 8) return '#d32f2f';
    if (count >= 5) return '#f57c00';
    return '#1976d2';
  };

  return (
    <ScreenContainer
      title="Tickets Abertos"
      subtitle="Por Categoria Monitorizada"
      onBack={onBack}
      rightIcon="refresh"
      onRightAction={fetchTickets}
      onRefresh={fetchTickets}
      refreshing={loading}
    >
        {isSimulated && (
          <Badge variant="warning" icon="information-outline" size="sm" className="mb-3 self-start">
            Modo de demonstração (Dados simulados de Tickets)
          </Badge>
        )}

        <View className="flex-row justify-between gap-2.5 mb-4">
          <View className="flex-1">
            <StatCard
              icon="ticket-confirmation-outline"
              title="Tickets Abertos"
              value={metrics.totalOpen}
              color="destructive"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="folder-table"
              title="Categorias"
              value={metrics.categoriesCount}
              color="primary"
            />
          </View>
        </View>

        <SearchInput
          placeholder="Pesquisar categoria de ticket..."
          value={searchText}
          onChangeText={setSearchText}
          className="mb-4"
        />

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchTickets} />
        ) : filteredAlerts.length === 0 ? (
          <EmptyState
            icon="ticket-confirmation-outline"
            title="Nenhum ticket encontrado"
            description="Não existem categorias que correspondam à sua pesquisa."
            actionLabel={searchText ? 'Limpar Pesquisa' : undefined}
            onAction={() => setSearchText('')}
          />
        ) : (
          <View className="gap-3">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Categorias Monitorizadas
            </Text>

            {filteredAlerts.map((item, index) => {
              const count = item.alertValueInt || parseInt(item.alertValueStr, 10) || 0;
              const color = getCategoryColor(count);
              const progress = metrics.maxCount > 0 ? count / metrics.maxCount : 0;

              return (
                <Card key={item.description ? `ticket-${item.description}-${index}` : `ticket-${index}`}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Icon source="ticket-account" size={22} color={color} />
                      </View>
                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.description}
                        </Text>
                        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                          Observação: {item.observationDate || 'Hoje'}
                        </Text>
                      </View>
                      <View
                        className="px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Text className="text-xs font-bold" style={{ color }}>
                          {count} {count === 1 ? 'ticket' : 'tickets'}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <ProgressBar progress={progress} color={color} className="h-1.5 rounded-full" />
                    </View>
                  </CardContent>
                </Card>
              );
            })}

            {entityInfo.url && (
              <Button
                variant="default"
                icon="open-in-new"
                onPress={() => Linking.openURL(entityInfo.url)}
                className="mt-2"
              >
                Gerir Tickets no PAE
              </Button>
            )}
          </View>
        )}
    </ScreenContainer>
  );
}
