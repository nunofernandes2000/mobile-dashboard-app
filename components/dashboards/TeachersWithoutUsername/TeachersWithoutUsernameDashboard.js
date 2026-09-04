import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import DashboardAnalyticsView from '../shared/DashboardAnalyticsView';
import { normalizeStr } from '../../../utils/text';
import {
  Card,
  CardContent,
  StatCard,
  Badge,
  SearchInput,
  FilterBar,
  Button,
  LoadingState,
  SkeletonList,
  EmptyState,
  ErrorCard,
  Header,
} from '../../ui';

function isTestOrInvalidRecord(item) {
  const name = (item.name || '').toLowerCase();
  const code = (item.code || '').toString().trim();
  if (code === '0' || code === 'null' || !code) return true;
  if (name.includes('professor teste') || name.includes('ignorar') || name.includes('colaboradores estg')) return true;
  return false;
}

export default function TeachersWithoutUsernameDashboard({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawEntities, setRawEntities] = useState([]);

  const [viewMode, setViewMode] = useState('list');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [hideTestRecords, setHideTestRecords] = useState(true);
  const [codeTypeFilter, setCodeTypeFilter] = useState('all');

  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${bffHost}/teachers/without-username`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      const resData = data.result || {};
      setRawEntities(resData.entities || []);
    } catch (err) {

      console.error('Erro ao carregar docentes sem username:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchText('');
    setHideTestRecords(false);
    setCodeTypeFilter('all');
    setSortBy('name');
    setSortDirection('asc');
  };

  const hasActiveFilters = Boolean(searchText || codeTypeFilter !== 'all' || !hideTestRecords);

  const filteredEntities = useMemo(() => {
    let result = rawEntities.filter((item) => {
      const name = item.name || '';
      const code = (item.code || '').toString();

      if (hideTestRecords && isTestOrInvalidRecord(item)) {
        return false;
      }

      if (codeTypeFilter === '5-digit') {
        if (code.length !== 5) return false;
      } else if (codeTypeFilter === '7-digit') {
        if (code.length !== 7) return false;
      }

      if (searchText.trim() !== '') {
        const query = normalizeStr(searchText.trim());
        const normName = normalizeStr(name);
        const normCode = normalizeStr(code);
        if (!normName.includes(query) && !normCode.includes(query)) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'code') {
        const codeA = parseInt(a.code, 10) || 0;
        const codeB = parseInt(b.code, 10) || 0;
        cmp = codeA - codeB;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rawEntities, searchText, hideTestRecords, codeTypeFilter, sortBy, sortDirection]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Docentes sem Username"
        subtitle="Auditoria de Contas & Perfis"
        onBack={onBack}
        rightIcon="refresh"
        onRightAction={fetchTeachers}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between gap-2.5 mb-4">
          <View className="flex-1">
            <StatCard
              icon="account-alert"
              title="Docentes sem User"
              value={filteredEntities.length}
              color="destructive"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="account-check"
              title="Total Auditados"
              value={rawEntities.length}
              color="primary"
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-2 mb-3">
          <View className="flex-1">
            <SearchInput
              placeholder="Pesquisar por nome ou código..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <View className="flex-row bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary' : 'bg-transparent'}`}
            >
              <Icon source="format-list-bulleted" size={18} color={viewMode === 'list' ? '#fff' : '#94a3b8'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('analytics')}
              className={`p-2 rounded-lg ${viewMode === 'analytics' ? 'bg-primary' : 'bg-transparent'}`}
            >
              <Icon source="chart-bar" size={18} color={viewMode === 'analytics' ? '#fff' : '#94a3b8'} />
            </TouchableOpacity>
          </View>
        </View>

        <FilterBar
          isOpen={showFiltersPanel}
          onToggle={() => setShowFiltersPanel(!showFiltersPanel)}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          title="Filtros de Docentes & Ordenação"
        >
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Registos de Teste
          </Text>
          <View className="flex-row gap-2 mb-3">
            <Badge
              variant={hideTestRecords ? 'default' : 'secondary'}
              size="sm"
              onPress={() => setHideTestRecords(!hideTestRecords)}
            >
              {hideTestRecords ? 'Ocultar Registos de Teste' : 'Mostrar Todos'}
            </Badge>
          </View>

          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Formato de Código
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {[
              { label: 'Todos os Códigos', value: 'all' },
              { label: '5 Dígitos (Ex: 12345)', value: '5-digit' },
              { label: '7 Dígitos (Ex: 1234567)', value: '7-digit' },
            ].map((ct) => (
              <Badge
                key={ct.value}
                variant={codeTypeFilter === ct.value ? 'default' : 'secondary'}
                size="sm"
                onPress={() => setCodeTypeFilter(ct.value)}
              >
                {ct.label}
              </Badge>
            ))}
          </View>

          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Ordenar Por
          </Text>
          <View className="flex-row gap-2">
            <Badge
              variant={sortBy === 'name' ? 'default' : 'secondary'}
              size="sm"
              onPress={() => {
                if (sortBy === 'name') {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('name');
                  setSortDirection('asc');
                }
              }}
            >
              Nome {sortBy === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </Badge>
            <Badge
              variant={sortBy === 'code' ? 'default' : 'secondary'}
              size="sm"
              onPress={() => {
                if (sortBy === 'code') {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('code');
                  setSortDirection('asc');
                }
              }}
            >
              Código {sortBy === 'code' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </Badge>
          </View>
        </FilterBar>

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchTeachers} />
        ) : viewMode === 'analytics' ? (
          <DashboardAnalyticsView
            type="teachers"
            data={filteredEntities}
            title="Estatísticas de Docentes"
            subtitle="Distribuição de irregularidades de acesso"
          />
        ) : filteredEntities.length === 0 ? (
          <EmptyState
            icon="account-check-outline"
            title="Nenhum docente com anomalia"
            description="Não foram encontrados docentes sem username para os filtros selecionados."
            actionLabel={hasActiveFilters ? 'Limpar Filtros' : undefined}
            onAction={handleResetFilters}
          />
        ) : (
          <View className="gap-3">
            {filteredEntities.map((item, idx) => {
              const isTest = isTestOrInvalidRecord(item);

              return (
                <Card key={item.url || (item.code && item.code !== 'null' ? `teacher-${item.code}-${idx}` : `teacher-idx-${idx}`)}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-full bg-destructive/15 items-center justify-center mr-3">
                        <Icon source="account-alert" size={22} color="#d32f2f" />
                      </View>

                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center gap-1.5 mb-0.5">
                          <Badge variant="destructive" size="sm">
                            Sem Username
                          </Badge>
                          {isTest && (
                            <Badge variant="warning" size="sm">
                              Teste
                            </Badge>
                          )}
                        </View>
                        <Text className="font-bold text-sm text-slate-900 dark:text-white" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                          Código de Pessoal: {item.code}
                        </Text>
                      </View>
                    </View>

                    {item.url && (
                      <View className="mt-3 pt-2.5 border-t border-border dark:border-border-dark flex-row justify-end">
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item.url)}
                          className="flex-row items-center gap-1"
                        >
                          <Text className="text-xs font-bold text-primary">
                            Configurar no PAE
                          </Text>
                          <Icon source="open-in-new" size={14} color="#ff9800" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
