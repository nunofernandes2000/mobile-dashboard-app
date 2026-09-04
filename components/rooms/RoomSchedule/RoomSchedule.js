import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { TimelineBar, OccupationList } from '../TimelineBar';
import { SCHOOLS } from '../roomsConstants';
import { extractUserEnrolledUnits, isOccupationMatchingUserUnits } from '../roomsHelpers';
import { Card, CardContent, Badge, EmptyState, Header } from '../../ui';

const RoomCard = memo(function RoomCard({
  room,
  occupations,
  isFav,
  viewMode,
  schoolColor,
  onToggleFavorite,
}) {
  const count = occupations.length;

  return (
    <Card className="mb-3.5">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-start mb-1">
          <View className="flex-1 mr-2">
            <View className="flex-row items-center gap-1.5">
              <TouchableOpacity onPress={() => onToggleFavorite(room.cdSala)} className="p-1 -ml-1">
                <Icon source={isFav ? 'star' : 'star-outline'} size={20} color={isFav ? '#ff9800' : '#94a3b8'} />
              </TouchableOpacity>
              <Text className="font-bold text-sm text-slate-900 dark:text-white flex-1" numberOfLines={1}>
                {room.descricaoSala || room.roomName || `Sala ${room.cdSala}`}
              </Text>
            </View>
            <Text className="text-xs text-muted dark:text-muted-dark ml-6 mt-0.5">
              Cód: {room.cdSala} • Edifício: {room.cdEdificio}{room.locataoSala ? ` • ${room.locataoSala} lug.` : ''}
            </Text>
          </View>
          <Badge variant={count > 0 ? 'default' : 'success'} size="sm">
            {count > 0 ? `${count} aula${count > 1 ? 's' : ''}` : 'Livre'}
          </Badge>
        </View>

        {viewMode === 'timeline' ? (
          <TimelineBar occupations={occupations} schoolColor={schoolColor} />
        ) : (
          <OccupationList occupations={occupations} schoolColor={schoolColor} />
        )}
      </CardContent>
    </Card>
  );
});

export default function RoomSchedule({
  rooms: scheduleRooms = [],
  selectedSchool,
  onBack,
  onRefresh,
  profile,
  token,
  bffHost,
}) {
  const [viewMode, setViewMode] = useState('timeline');
  const [favoriteRooms, setFavoriteRooms] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'myCourses' | 'favorites'

  // Carrega salas favoritas sincronizadas via BFF
  useEffect(() => {
    if (!bffHost || !token) return;
    fetch(`${bffHost}/favorites/rooms`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.favorites)) {
          setFavoriteRooms(new Set(data.favorites.map(String)));
        }
      })
      .catch((err) => console.warn('Erro ao carregar salas favoritas:', err.message));
  }, [bffHost, token]);

  // Alterna o estado de favorito de uma sala
  const toggleFavorite = useCallback(async (roomCode) => {
    const key = String(roomCode);
    const next = new Set(favoriteRooms);
    next.has(key) ? next.delete(key) : next.add(key);
    setFavoriteRooms(next);

    if (bffHost && token) {
      try {
        await fetch(`${bffHost}/favorites/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ favoriteRooms: Array.from(next) }),
        });
      } catch (err) {
        console.error('Erro ao sincronizar favoritos:', err.message);
      }
    }
  }, [favoriteRooms, bffHost, token]);

  const school = useMemo(() => SCHOOLS.find((s) => s.id === selectedSchool), [selectedSchool]);
  const schoolColor = school?.color || '#ff9800';

  const myEnrolledUnits = useMemo(() => extractUserEnrolledUnits(profile), [profile]);
  const isMatchingUserCourse = useCallback((occ) => isOccupationMatchingUserUnits(occ, myEnrolledUnits), [myEnrolledUnits]);

  // Filtra as salas e calcula o resumo de métricas
  const { displayedRooms, stats } = useMemo(() => {
    let totalClasses = 0;
    let withClasses = 0;
    const list = [];
    const isStudentFilter = activeFilter === 'myCourses';

    for (const room of scheduleRooms) {
      const isFav = favoriteRooms.has(String(room.cdSala));
      const myCourseOccs = isStudentFilter ? (room.occupations || []).filter(isMatchingUserCourse) : null;
      const hasMyCourses = myCourseOccs ? myCourseOccs.length > 0 : false;

      if (activeFilter === 'favorites' && !isFav) continue;
      if (activeFilter === 'myCourses' && !hasMyCourses) continue;

      const occs = isStudentFilter ? myCourseOccs : (room.occupations || []);
      const count = occs.length;
      totalClasses += count;
      if (count > 0) withClasses += 1;

      list.push({ room, occupations: occs, isFav });
    }

    list.sort((a, b) => (b.room.todayOccupations || 0) - (a.room.todayOccupations || 0));

    return {
      displayedRooms: list,
      stats: [
        { label: 'Salas', value: list.length, color: schoolColor },
        { label: 'Com Aulas', value: withClasses, className: 'text-destructive' },
        { label: 'Livres', value: list.length - withClasses, className: 'text-success' },
        { label: 'Aulas', value: totalClasses, className: 'text-info' },
      ],
    };
  }, [scheduleRooms, activeFilter, favoriteRooms, isMatchingUserCourse, schoolColor]);

  const today = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  const renderHeader = useMemo(() => (
    <View className="pt-4">
      <View className="pb-2 flex-row items-center gap-2">
        <Icon source="calendar-month" size={20} color="#f57c00" />
        <Text className="font-semibold text-sm text-slate-800 dark:text-slate-200">{formattedDate}</Text>
      </View>

      <View className="flex-row justify-between gap-2 mb-4">
        {stats.map((s) => (
          <View key={s.label} className="flex-1 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark py-2.5 px-1 items-center shadow-sm">
            <Text className={`text-lg font-bold ${s.className || ''}`} style={s.color ? { color: s.color } : undefined}>
              {s.value}
            </Text>
            <Text className="text-[10px] font-semibold text-muted dark:text-muted-dark">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row gap-2 mb-4">
        <Badge
          variant={activeFilter === 'all' ? 'default' : 'secondary'}
          icon="view-dashboard"
          size="md"
          onPress={() => setActiveFilter('all')}
        >
          Todas
        </Badge>
        <Badge
          variant={activeFilter === 'myCourses' ? 'default' : 'secondary'}
          icon="book-open-variant"
          size="md"
          onPress={() => setActiveFilter('myCourses')}
        >
          Minhas Cadeiras
        </Badge>
        <Badge
          variant={activeFilter === 'favorites' ? 'warning' : 'secondary'}
          icon="star"
          size="md"
          onPress={() => setActiveFilter('favorites')}
        >
          Favoritas
        </Badge>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-slate-900 dark:text-white">Ocupação por Sala</Text>
        <View className="flex-row gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setViewMode('timeline')}
            className={`p-1.5 rounded-lg ${viewMode === 'timeline' ? 'bg-primary' : 'bg-transparent'}`}
          >
            <Icon source="chart-timeline" size={18} color={viewMode === 'timeline' ? '#fff' : '#94a3b8'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-primary' : 'bg-transparent'}`}
          >
            <Icon source="format-list-bulleted" size={18} color={viewMode === 'list' ? '#fff' : '#94a3b8'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [formattedDate, stats, activeFilter, viewMode]);

  const renderItem = useCallback(({ item }) => (
    <RoomCard
      room={item.room}
      occupations={item.occupations}
      isFav={item.isFav}
      viewMode={viewMode}
      schoolColor={schoolColor}
      onToggleFavorite={toggleFavorite}
    />
  ), [viewMode, schoolColor, toggleFavorite]);

  const keyExtractor = useCallback((item, index) => (
    item.room.cdSala ? `room-${item.room.cdSala}` : `room-idx-${index}`
  ), []);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title={`Horários: ${school?.name || ''}`}
        onBack={onBack}
        rightIcon="refresh"
        onRightAction={onRefresh}
      />

      <FlatList
        data={displayedRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} colors={[schoolColor]} tintColor={schoolColor} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-blank"
            title="Nenhuma sala disponível"
            description={
              activeFilter === 'favorites'
                ? 'Nenhuma sala marcada como favorita.'
                : activeFilter === 'myCourses'
                ? 'Nenhuma das suas cadeiras tem aulas agendadas hoje nestas salas.'
                : 'Sem dados de horários para esta escola.'
            }
          />
        }
      />
    </View>
  );
}
