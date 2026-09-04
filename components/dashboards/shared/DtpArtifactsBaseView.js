import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import DashboardAnalyticsView from './DashboardAnalyticsView';
import { normalizeStr } from '../../../utils/text';
import {
  Card,
  CardContent,
  Badge,
  SearchInput,
  LoadingState,
  SkeletonList,
  EmptyState,
  ErrorCard,
  Header,
  FilterBar,
} from '../../ui';

function parseAlertCategory(alertDescription) {
  const normalizedDescription = (alertDescription || '').toLowerCase();
  if (normalizedDescription.includes('planeamento')) return 'Planeamento em Falta';
  if (normalizedDescription.includes('sumarios') || normalizedDescription.includes('sumários')) return 'Sumários em Falta';
  if (normalizedDescription.includes('notas')) return 'DTP sem Notas';
  if (normalizedDescription.includes('enunciados')) return 'DTP sem Enunciados';
  if (normalizedDescription.includes('ficha de uc por validar')) return 'Ficha UC por Validar';
  if (normalizedDescription.includes('ficha de uc')) return 'Ficha UC em Falta';
  return 'Geral';
}

function determineAlertBadgeVariant(categoryName) {
  switch (categoryName) {
    case 'Planeamento em Falta': return 'destructive';
    case 'Sumários em Falta': return 'warning';
    case 'DTP sem Notas': return 'default';
    case 'DTP sem Enunciados': return 'info';
    case 'Ficha UC em Falta': return 'destructive';
    case 'Ficha UC por Validar': return 'success';
    default: return 'secondary';
  }
}

export function DtpArtifactsBaseView({
  token,
  bffHost,
  onBack,
  endpoint = '/dtp/faulty-artifacts',
  title = 'Alertas DTP / Falhas em UCs',
  subtitle = 'Ano Letivo 2025/26',
  accentColor = '#c2185b',
}) {
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [alertsErrorMessage, setAlertsErrorMessage] = useState(null);
  const [coursesWithAlertsList, setCoursesWithAlertsList] = useState([]);
  const [expandedCourseCodesMap, setExpandedCourseCodesMap] = useState({});
  const [collapsedCategorySectionsMap, setCollapsedCategorySectionsMap] = useState({});

  const [viewMode, setViewMode] = useState('list');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [searchFilterQuery, setSearchFilterQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  useEffect(() => {
    fetchDtpAlerts();
  }, [endpoint]);

  const fetchDtpAlerts = async () => {
    setIsLoadingAlerts(true);
    setAlertsErrorMessage(null);
    try {
      const response = await fetch(`${bffHost}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      const rawResultData = data.result || [];
      const loadedCoursesList = Array.isArray(rawResultData) ? rawResultData : [];
      setCoursesWithAlertsList(loadedCoursesList);

      if (loadedCoursesList.length > 0 && loadedCoursesList[0].entity?.code) {
        setExpandedCourseCodesMap({ [loadedCoursesList[0].entity.code]: true });
      }
    } catch (err) {
      console.error('Erro ao carregar alertas DTP:', err.message);
      setAlertsErrorMessage(err.message);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleResetAllFilters = () => {
    setSearchFilterQuery('');
    setSelectedCategoryFilter('all');
    setSelectedCourseFilter('all');
  };

  const toggleCourseExpansion = (courseCode) => {
    setExpandedCourseCodesMap((previousMap) => ({
      ...previousMap,
      [courseCode]: !previousMap[courseCode],
    }));
  };

  const toggleCategorySection = (categorySectionKey) => {
    setCollapsedCategorySectionsMap((previousMap) => ({
      ...previousMap,
      [categorySectionKey]: !previousMap[categorySectionKey],
    }));
  };

  const filteredCoursesWithAlerts = useMemo(() => {
    return coursesWithAlertsList
      .map((courseEntry) => {
        const courseEntity = courseEntry.entity || {};
        const courseCode = courseEntity.code || '';
        const courseName = courseEntity.name || '';
        const alertsList = courseEntry.alerts || [];

        if (selectedCourseFilter !== 'all' && courseCode !== selectedCourseFilter) {
          return null;
        }

        const matchingAlerts = alertsList
          .map((alertItem) => {
            const parsedCategory = parseAlertCategory(alertItem.description);

            if (selectedCategoryFilter !== 'all') {
              if (!parsedCategory.toLowerCase().includes(selectedCategoryFilter.toLowerCase())) {
                return null;
              }
            }

            const alertEntities = alertItem.entities || [];
            const matchingEntities = alertEntities.filter((curricularUnit) => {
              if (searchFilterQuery.trim() === '') return true;
              const normalizedQuery = normalizeStr(searchFilterQuery.trim());
              const normalizedUcName = normalizeStr(curricularUnit.name || '');
              const normalizedCourseName = normalizeStr(courseName);
              const normalizedUcCode = normalizeStr(curricularUnit.code || '');
              return (
                normalizedUcName.includes(normalizedQuery) ||
                normalizedCourseName.includes(normalizedQuery) ||
                normalizedUcCode.includes(normalizedQuery)
              );
            });

            if (matchingEntities.length === 0 && searchFilterQuery.trim() !== '') {
              return null;
            }

            return {
              ...alertItem,
              category: parsedCategory,
              entities: matchingEntities,
            };
          })
          .filter(Boolean);

        if (matchingAlerts.length === 0) {
          return null;
        }

        const totalFilteredAlertsCount = matchingAlerts.reduce(
          (sum, alertItem) => sum + (alertItem.entities?.length || 0),
          0
        );

        return {
          ...courseEntry,
          alerts: matchingAlerts,
          totalFilteredAlerts: totalFilteredAlertsCount,
        };
      })
      .filter(Boolean);
  }, [coursesWithAlertsList, selectedCourseFilter, selectedCategoryFilter, searchFilterQuery]);

  const totalFilteredAlertsCount = useMemo(() => {
    return filteredCoursesWithAlerts.reduce((sum, courseEntry) => sum + (courseEntry.totalFilteredAlerts || 0), 0);
  }, [filteredCoursesWithAlerts]);

  const AVAILABLE_ALERT_CATEGORIES = [
    'all',
    'Planeamento em Falta',
    'Sumários em Falta',
    'DTP sem Notas',
    'DTP sem Enunciados',
    'Ficha UC em Falta',
    'Ficha UC por Validar',
  ];

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        rightIcon="refresh"
        onRightAction={fetchDtpAlerts}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-2 mb-3">
          <View className="flex-1">
            <SearchInput
              placeholder="Pesquisar UC ou curso..."
              value={searchFilterQuery}
              onChangeText={setSearchFilterQuery}
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
          hasActiveFilters={selectedCategoryFilter !== 'all' || selectedCourseFilter !== 'all' || !!searchFilterQuery}
          onReset={handleResetAllFilters}
          title="Filtros Avançados DTP"
        >
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Filtrar por Categoria
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {AVAILABLE_ALERT_CATEGORIES.map((categoryOption) => (
              <Badge
                key={categoryOption}
                variant={selectedCategoryFilter === categoryOption ? 'default' : 'secondary'}
                size="sm"
                onPress={() => setSelectedCategoryFilter(categoryOption)}
              >
                {categoryOption === 'all' ? 'Todas' : categoryOption}
              </Badge>
            ))}
          </View>

          {coursesWithAlertsList.length > 0 && (
            <>
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Filtrar por Curso ({coursesWithAlertsList.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                <Badge
                  variant={selectedCourseFilter === 'all' ? 'default' : 'secondary'}
                  size="sm"
                  onPress={() => setSelectedCourseFilter('all')}
                  className="mr-1.5"
                >
                  Todos os Cursos
                </Badge>
                {coursesWithAlertsList.map((courseEntry, courseIdx) => {
                  const courseEntity = courseEntry.entity || {};
                  const isCourseSelected = selectedCourseFilter === courseEntity.code;
                  return (
                    <Badge
                      key={courseEntity.code ? `course-badge-${courseEntity.code}` : `course-badge-${courseIdx}`}
                      variant={isCourseSelected ? 'default' : 'secondary'}
                      size="sm"
                      onPress={() => setSelectedCourseFilter(isCourseSelected ? 'all' : courseEntity.code)}
                      className="mr-1.5"
                    >
                      {courseEntity.name || courseEntity.code} ({courseEntity.code})
                    </Badge>
                  );
                })}
              </ScrollView>
            </>
          )}
        </FilterBar>

        <View className="flex-row justify-between gap-2 mb-4">
          <View className="flex-1 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark py-2.5 px-2 items-center shadow-sm">
            <Text className="text-xl font-bold" style={{ color: accentColor }}>
              {totalFilteredAlertsCount}
            </Text>
            <Text className="text-[10px] font-semibold text-muted dark:text-muted-dark">
              Alertas Filtrados
            </Text>
          </View>
          <View className="flex-1 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark py-2.5 px-2 items-center shadow-sm">
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {filteredCoursesWithAlerts.length}
            </Text>
            <Text className="text-[10px] font-semibold text-muted dark:text-muted-dark">
              Cursos com Falhas
            </Text>
          </View>
        </View>

        {isLoadingAlerts ? (
          <SkeletonList count={4} />
        ) : alertsErrorMessage ? (
          <ErrorCard message={alertsErrorMessage} onRetry={fetchDtpAlerts} />
        ) : viewMode === 'analytics' ? (
          <DashboardAnalyticsView
            type="dtp"
            data={filteredCoursesWithAlerts}
            title="Estatísticas de Irregularidades DTP"
            subtitle="Distribuição por categoria e cursos com maior incidência"
            onSelectCategoryFilter={(categoryName) => {
              setSelectedCategoryFilter(categoryName);
              setViewMode('list');
            }}
          />
        ) : filteredCoursesWithAlerts.length === 0 ? (
          <EmptyState
            icon="check-circle-outline"
            iconColor="#2e7d32"
            title="Nenhum alerta encontrado"
            description="Não existem falhas detetadas que correspondam aos filtros de pesquisa atuais."
            actionLabel={searchFilterQuery || selectedCategoryFilter !== 'all' ? 'Limpar Filtros' : undefined}
            onAction={handleResetAllFilters}
          />
        ) : (
          filteredCoursesWithAlerts.map((courseEntry, courseIdx) => {
            const courseEntity = courseEntry.entity || {};
            const courseCode = courseEntity.code || '';
            const courseName = courseEntity.name || courseCode;
            const isExpanded = !!expandedCourseCodesMap[courseCode];
            const alertsList = courseEntry.alerts || [];

            return (
              <Card key={courseCode ? `dtp-course-${courseCode}` : `dtp-course-${courseIdx}`} className="mb-3.5">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleCourseExpansion(courseCode)}
                  className="p-4 flex-row items-center justify-between"
                >
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Badge variant="secondary" size="sm">
                        Cód: {courseCode}
                      </Badge>
                      <Badge variant="destructive" size="sm">
                        {courseEntry.totalFilteredAlerts} falhas
                      </Badge>
                    </View>
                    <Text className="font-bold text-sm text-slate-900 dark:text-white" numberOfLines={2}>
                      {courseName}
                    </Text>
                  </View>
                  <Icon source={isExpanded ? 'chevron-up' : 'chevron-down'} size={22} color="#94a3b8" />
                </TouchableOpacity>

                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-0 border-t border-border dark:border-border-dark">
                    {alertsList.map((alertItem, alertIndex) => {
                      const badgeVariant = determineAlertBadgeVariant(alertItem.category);
                      const categorySectionKey = `${courseCode}-${alertItem.category || alertIndex}`;
                      const isCategoryCollapsed = !!collapsedCategorySectionsMap[categorySectionKey];

                      return (
                        <View key={categorySectionKey} className="mt-3">
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => toggleCategorySection(categorySectionKey)}
                            className="flex-row items-center justify-between py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 mb-1.5"
                          >
                            <View className="flex-row items-center gap-2">
                              <Badge variant={badgeVariant} size="sm">
                                {alertItem.category}
                              </Badge>
                              <Text className="text-[11px] font-semibold text-muted dark:text-muted-dark">
                                {alertItem.entities?.length || 0} UC(s)
                              </Text>
                            </View>
                            <Icon
                              source={isCategoryCollapsed ? 'chevron-down' : 'chevron-up'}
                              size={18}
                              color="#94a3b8"
                            />
                          </TouchableOpacity>

                          {!isCategoryCollapsed && (
                            <View className="gap-1.5 pl-3.5 ml-2 border-l-2 border-slate-200 dark:border-slate-700 mb-2">
                              {(alertItem.entities || []).map((curricularUnit, unitIndex) => (
                                <View key={curricularUnit.code ? `unit-${curricularUnit.code}-${unitIndex}` : `unit-${unitIndex}`} className="py-1">
                                  <Text className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                    • {curricularUnit.name || curricularUnit.code} ({curricularUnit.code})
                                  </Text>
                                  {curricularUnit.url && (
                                    <TouchableOpacity
                                      onPress={() => Linking.openURL(curricularUnit.url)}
                                      className="flex-row items-center mt-0.5 ml-2"
                                    >
                                      <Text className="text-[11px] font-semibold text-primary">
                                        Abrir no PAE
                                      </Text>
                                      <Icon source="open-in-new" size={12} color="#ff9800" />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

export default DtpArtifactsBaseView;

