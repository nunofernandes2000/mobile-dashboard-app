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

function getDegreeIcon(degreeType) {
  const d = (degreeType || '').toLowerCase();
  if (d.includes('licenciatura')) return 'school-outline';
  if (d.includes('ctesp')) return 'hammer-wrench';
  if (d.includes('mestrado')) return 'certificate-outline';
  return 'book-open-page-variant';
}

export default function CoursesAwaitingRegistrationDashboard({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawEntities, setRawEntities] = useState([]);

  const [viewMode, setViewMode] = useState('list');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');

  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${bffHost}/courses/awaiting-registration`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      const resData = data.result || {};
      setRawEntities(resData.entities || []);
    } catch (err) {

      console.error('Erro ao carregar cursos a aguardar registo:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchText('');
    setDegreeFilter('all');
    setSchoolFilter('all');
    setSortBy('name');
    setSortDirection('asc');
  };

  const hasActiveFilters = Boolean(
    degreeFilter !== 'all' || schoolFilter !== 'all' || searchText
  );

  const filteredEntities = useMemo(() => {
    let result = rawEntities.filter((item) => {
      const name = item.name || '';
      const code = (item.code || '').toString();
      const obs = item.obs || '';
      const meta = item.metadata || {};
      const degreeType = meta.degreeType || '';
      const school = meta.school || obs;

      if (degreeFilter !== 'all') {
        if (!degreeType.toLowerCase().includes(degreeFilter.toLowerCase())) return false;
      }

      if (schoolFilter !== 'all') {
        const filterKey = schoolFilter.toLowerCase();
        const schoolText = (school + ' ' + obs).toLowerCase();

        let matches = schoolText.includes(filterKey);
        if (!matches) {
          if ((filterKey === 'ese' || filterKey === 'esecs') && (schoolText.includes('ese') || schoolText.includes('esecs') || schoolText.includes('educação'))) {
            matches = true;
          } else if ((filterKey === 'estg' || filterKey === 'estgd') && (schoolText.includes('estg') || schoolText.includes('estgd') || schoolText.includes('tecnologia'))) {
            matches = true;
          } else if (filterKey === 'ess' && (schoolText.includes('ess') || schoolText.includes('saúde'))) {
            matches = true;
          } else if (filterKey === 'esa' && (schoolText.includes('esa') || schoolText.includes('agrária'))) {
            matches = true;
          }
        }
        if (!matches) return false;
      }

      if (searchText.trim() !== '') {
        const query = normalizeStr(searchText.trim());
        const normName = normalizeStr(name);
        const normCode = normalizeStr(code);
        const normSiges = normalizeStr(meta.sigesCode || '');
        if (!normName.includes(query) && !normCode.includes(query) && !normSiges.includes(query)) {
          return false;
        }
      }

      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      const metaA = a.metadata || {};
      const metaB = b.metadata || {};
      if (sortBy === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'code') {
        cmp = (a.code || '').localeCompare(b.code || '');
      } else if (sortBy === 'degree') {
        cmp = (metaA.degreeType || '').localeCompare(metaB.degreeType || '');
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rawEntities, degreeFilter, schoolFilter, searchText, sortBy, sortDirection]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Cursos a Aguardar Registo"
        subtitle="Oferta Formativa Politécnico"
        onBack={onBack}
        rightIcon="refresh"
        onRightAction={fetchCourses}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between gap-2.5 mb-4">
          <View className="flex-1">
            <StatCard
              icon="school"
              title="Total de Cursos"
              value={filteredEntities.length}
              color="primary"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="clock-alert-outline"
              title="A Aguardar"
              value={rawEntities.length}
              color="warning"
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-2 mb-3">
          <View className="flex-1">
            <SearchInput
              placeholder="Pesquisar por curso ou código..."
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
              <Icon source="chart-pie" size={18} color={viewMode === 'analytics' ? '#fff' : '#94a3b8'} />
            </TouchableOpacity>
          </View>
        </View>

        <FilterBar
          isOpen={showFiltersPanel}
          onToggle={() => setShowFiltersPanel(!showFiltersPanel)}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          title="Filtros por Grau & Escola"
        >
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Grau Académico
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {['all', 'Licenciatura', 'CTeSP', 'Mestrado', 'Pós-Graduação'].map((deg) => (
              <Badge
                key={deg}
                variant={degreeFilter === deg ? 'default' : 'secondary'}
                size="sm"
                onPress={() => setDegreeFilter(deg)}
              >
                {deg === 'all' ? 'Todos os Graus' : deg}
              </Badge>
            ))}
          </View>

          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Escola / Unidade Orgânica
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {[
              { label: 'Todas as Escolas', value: 'all' },
              { label: 'ESTGD (Tecnologia e Gestão)', value: 'estg' },
              { label: 'ESECS (Educação)', value: 'esecs' },
              { label: 'ESS (Saúde)', value: 'ess' },
              { label: 'ESAE (Agrária - Elvas)', value: 'esa' },
            ].map((sch) => (
              <Badge
                key={sch.value}
                variant={schoolFilter === sch.value ? 'default' : 'secondary'}
                size="sm"
                onPress={() => setSchoolFilter(sch.value)}
              >
                {sch.label}
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
              variant={sortBy === 'degree' ? 'default' : 'secondary'}
              size="sm"
              onPress={() => {
                if (sortBy === 'degree') {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('degree');
                  setSortDirection('asc');
                }
              }}
            >
              Grau {sortBy === 'degree' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </Badge>
          </View>
        </FilterBar>

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchCourses} />
        ) : viewMode === 'analytics' ? (
          <DashboardAnalyticsView
            type="courses"
            data={filteredEntities}
            title="Estatísticas de Cursos"
            subtitle="Distribuição por grau académico e unidades orgânicas"
          />
        ) : filteredEntities.length === 0 ? (
          <EmptyState
            icon="school-outline"
            title="Nenhum curso encontrado"
            description="Não existem cursos que correspondam aos filtros selecionados."
            actionLabel={hasActiveFilters ? 'Limpar Filtros' : undefined}
            onAction={handleResetFilters}
          />
        ) : (
          <View className="gap-3">
            {filteredEntities.map((item, idx) => {
              const meta = item.metadata || {};
              const degreeType = meta.degreeType || 'Curso';
              const iconName = getDegreeIcon(degreeType);

              return (
                <Card key={item.url || (item.code && item.code !== 'null' ? `course-${item.code}-${idx}` : `course-idx-${idx}`)}>
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-xl bg-primary/15 items-center justify-center mr-3">
                        <Icon source={iconName} size={22} color="#f57c00" />
                      </View>

                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center gap-1.5 mb-0.5">
                          <Badge variant="secondary" size="sm">
                            {degreeType}
                          </Badge>
                          {item.code && (
                            <Badge variant="outline" size="sm">
                              Cód: {item.code}
                            </Badge>
                          )}
                        </View>
                        <Text className="font-bold text-sm text-slate-900 dark:text-white" numberOfLines={2}>
                          {item.name}
                        </Text>
                        {item.obs ? (
                          <Text className="text-xs text-muted dark:text-muted-dark mt-0.5" numberOfLines={1}>
                            {item.obs}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    {item.url && (
                      <View className="mt-3 pt-2.5 border-t border-border dark:border-border-dark flex-row justify-end">
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item.url)}
                          className="flex-row items-center gap-1"
                        >
                          <Text className="text-xs font-bold text-primary">
                            Ver no Portal IPP
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
