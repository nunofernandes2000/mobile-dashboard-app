import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
  SkeletonList,
  EmptyState,
  ErrorCard,
  ScreenContainer,
} from '../../ui';

export default function BirthdayDashboard({ token, bffHost, onBack }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawEntities, setRawEntities] = useState([]);
  const [updateDate, setUpdateDate] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);

  const [viewMode, setViewMode] = useState('list');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [relativeDays, setRelativeDays] = useState('all');
  const [filterToday, setFilterToday] = useState(false);
  const [filterThisWeek, setFilterThisWeek] = useState(false);
  const [filterThisMonth, setFilterThisMonth] = useState(false);
  const [specificMonth, setSpecificMonth] = useState('all');

  const [ageRange, setAgeRange] = useState('all');
  const [roundBirthdaysOnly, setRoundBirthdaysOnly] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${bffHost}/birthdays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      const resData = data.result || {};
      setRawEntities(resData.entities || []);
      setUpdateDate(resData.updateDate || '');
      setIsSimulated(!!data.simulated);
    } catch (err) {
      console.error('Erro ao carregar aniversários:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setRelativeDays('all');
    setFilterToday(false);
    setFilterThisWeek(false);
    setFilterThisMonth(false);
    setSpecificMonth('all');
    setAgeRange('all');
    setRoundBirthdaysOnly(false);
    setSearchText('');
    setSortBy('date');
    setSortDirection('asc');
  };

  const hasActiveFilters = Boolean(
    filterToday ||
    filterThisWeek ||
    filterThisMonth ||
    relativeDays !== 'all' ||
    specificMonth !== 'all' ||
    ageRange !== 'all' ||
    roundBirthdaysOnly ||
    searchText
  );

  const filteredEntities = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const dayOfWeek = today.getDay();
    const distToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distToMon);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const currentMonthNum = today.getMonth() + 1;

    let result = rawEntities.filter((item) => {
      const meta = item.metadata || {};
      const bdayCurrent = meta.birthdayDateCurrentYear || '';
      const age = typeof meta.age === 'number' ? meta.age : 0;
      const code = item.code;
      const name = item.name || '';

      if (filterToday) {
        if (bdayCurrent !== todayStr) return false;
      }

      if (filterThisWeek) {
        if (!bdayCurrent) return false;
        const bdayDate = new Date(bdayCurrent + 'T00:00:00');
        if (bdayDate < monday || bdayDate > sunday) return false;
      }

      if (filterThisMonth) {
        if (!bdayCurrent) return false;
        const bdayDate = new Date(bdayCurrent + 'T00:00:00');
        if (bdayDate.getMonth() + 1 !== currentMonthNum) return false;
      }

      if (relativeDays !== 'all') {
        const days = parseInt(relativeDays, 10);
        if (bdayCurrent) {
          const bdayDate = new Date(bdayCurrent + 'T00:00:00');
          const todayDate = new Date(todayStr + 'T00:00:00');
          const diffTime = bdayDate - todayDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < 0 || diffDays > days) return false;
        }
      }

      if (specificMonth !== 'all') {
        const targetMonth = parseInt(specificMonth, 10);
        if (bdayCurrent) {
          const bdayDate = new Date(bdayCurrent + 'T00:00:00');
          if (bdayDate.getMonth() + 1 !== targetMonth) return false;
        }
      }

      if (ageRange !== 'all') {
        if (ageRange === '20-30' && (age < 20 || age > 30)) return false;
        if (ageRange === '31-40' && (age < 31 || age > 40)) return false;
        if (ageRange === '41-50' && (age < 41 || age > 50)) return false;
        if (ageRange === '51-60' && (age < 51 || age > 60)) return false;
        if (ageRange === '60+' && age <= 60) return false;
      }

      if (roundBirthdaysOnly) {
        if (age <= 0 || age % 10 !== 0) return false;
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
      if (sortBy === 'date') {
        const dateA = a.metadata?.birthdayDateCurrentYear || '';
        const dateB = b.metadata?.birthdayDateCurrentYear || '';
        cmp = dateA.localeCompare(dateB);
      } else if (sortBy === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'age') {
        cmp = (a.metadata?.age || 0) - (b.metadata?.age || 0);
      }

      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [
    rawEntities,
    relativeDays,
    filterToday,
    filterThisWeek,
    filterThisMonth,
    specificMonth,
    ageRange,
    roundBirthdaysOnly,
    searchText,
    sortBy,
    sortDirection,
  ]);

  const todayCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return rawEntities.filter((e) => e.metadata?.birthdayDateCurrentYear === todayStr).length;
  }, [rawEntities]);

  const avgAge = useMemo(() => {
    if (filteredEntities.length === 0) return 0;
    const total = filteredEntities.reduce((acc, curr) => acc + (curr.metadata?.age || 0), 0);
    return Math.round(total / filteredEntities.length);
  }, [filteredEntities]);

  const calculateDaysLeft = (birthdayDateStr) => {
    if (!birthdayDateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bday = new Date(birthdayDateStr + 'T00:00:00');
    const diff = Math.ceil((bday - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'É Hoje!';
    if (diff < 0) return `Já passou (${Math.abs(diff)}d)`;
    if (diff === 1) return 'Amanhã!';
    return `Faltam ${diff} dias`;
  };

  return (
    <ScreenContainer
      title="Aniversários"
      subtitle="Pessoal & Colaboradores IPP"
      onBack={onBack}
      rightIcon="refresh"
      onRightAction={fetchBirthdays}
      onRefresh={fetchBirthdays}
      refreshing={loading}
    >
        {isSimulated && (
          <Badge variant="warning" icon="information-outline" size="sm" className="mb-3 self-start">
            Modo de demonstração (Dados simulados de Aniversários)
          </Badge>
        )}

        <View className="flex-row justify-between gap-2 mb-4">
          <View className="flex-1">
            <StatCard
              icon="cake-variant"
              title="Colaboradores"
              value={filteredEntities.length}
              color="warning"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="calendar-star"
              title="Hoje"
              value={todayCount}
              color={todayCount > 0 ? "success" : "primary"}
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="account-clock"
              title="Idade Média"
              value={avgAge ? `${avgAge}a` : '-'}
              color="purple"
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
          title="Filtros Temporais & Idades"
        >
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Período
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge
              variant={filterToday ? 'default' : 'secondary'}
              size="md"
              onPress={() => {
                setFilterToday(!filterToday);
                setFilterThisWeek(false);
                setFilterThisMonth(false);
              }}
            >
              Hoje
            </Badge>
            <Badge
              variant={filterThisWeek ? 'default' : 'secondary'}
              size="md"
              onPress={() => {
                setFilterThisWeek(!filterThisWeek);
                setFilterToday(false);
                setFilterThisMonth(false);
              }}
            >
              Esta Semana
            </Badge>
            <Badge
              variant={filterThisMonth ? 'default' : 'secondary'}
              size="md"
              onPress={() => {
                setFilterThisMonth(!filterThisMonth);
                setFilterToday(false);
                setFilterThisWeek(false);
              }}
            >
              Este Mês
            </Badge>
            <Badge
              variant={roundBirthdaysOnly ? 'warning' : 'secondary'}
              size="md"
              onPress={() => setRoundBirthdaysOnly(!roundBirthdaysOnly)}
            >
              Anos Redondos (30, 40, 50...)
            </Badge>
          </View>

          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">
            Faixa Etária
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {['all', '20-30', '31-40', '41-50', '51-60', '60+'].map((range) => (
              <Badge
                key={range}
                variant={ageRange === range ? 'default' : 'secondary'}
                size="sm"
                onPress={() => setAgeRange(range)}
              >
                {range === 'all' ? 'Todas' : `${range} anos`}
              </Badge>
            ))}
          </View>
        </FilterBar>

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchBirthdays} />
        ) : viewMode === 'analytics' ? (
          <DashboardAnalyticsView
            type="birthdays"
            data={filteredEntities}
            title="Estatísticas de Aniversários"
            subtitle="Distribuição temporal e demográfica do pessoal"
          />
        ) : filteredEntities.length === 0 ? (
          <EmptyState
            icon="cake-variant"
            title="Nenhum aniversariante encontrado"
            description="Não foram encontrados registos que correspondam aos filtros de pesquisa selecionados."
            actionLabel={hasActiveFilters ? 'Limpar Filtros' : undefined}
            onAction={handleResetFilters}
          />
        ) : (
          <View className="gap-3">
            {filteredEntities.map((item, idx) => {
              const meta = item.metadata || {};
              const age = meta.age || item.age;
              const bdayDate = meta.birthdayDateCurrentYear || '';
              const daysLeftLabel = calculateDaysLeft(bdayDate);
              const isToday = daysLeftLabel === 'É Hoje!';

              return (
                <Card
                  key={item.url || (item.code && item.code !== 'null' ? `bday-${item.code}-${idx}` : `bday-idx-${idx}`)}
                  className={isToday ? 'border-2 border-warning' : ''}
                >
                  <CardContent className="p-4">
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-full bg-primary/15 items-center justify-center mr-3">
                        <Text className="text-primary font-bold text-base">
                          {(item.name || 'U').charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-sm text-slate-900 dark:text-white" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
                          {bdayDate ? `Aniversário: ${bdayDate}` : `Cód: ${item.code}`}
                        </Text>
                      </View>

                      <View className="items-end gap-1">
                        {isToday ? (
                          <Badge variant="warning" icon="party-popper" size="sm">
                            Hoje!
                          </Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">
                            {daysLeftLabel}
                          </Badge>
                        )}
                        {age > 0 && (
                          <Text className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {age} anos
                          </Text>
                        )}
                      </View>
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
