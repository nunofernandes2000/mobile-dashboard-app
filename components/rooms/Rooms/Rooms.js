import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRooms } from '../useRooms';
import { matchesSchool } from '../roomsConstants';
import { SchoolPicker } from '../SchoolPicker';
import RoomSchedule from '../RoomSchedule';
import { SkeletonList, ErrorCard, Header } from '../../ui';

export default function Rooms({ token, onBack, bffHost, profile }) {
  const {
    rooms,
    selectedSchool,
    loading,
    refreshing,
    error,
    fetchRooms,
    handleSelectSchool,
    handleBack,
    onRefresh,
    getSchoolRoomCount,
  } = useRooms({ token, bffHost, onBack });

  // Filtra as salas que pertencem à escola selecionada
  const schoolRooms = useMemo(() => {
    if (!selectedSchool) return [];
    return rooms.filter((roomItem) => matchesSchool(roomItem, selectedSchool));
  }, [rooms, selectedSchool]);

  // Se tiver escola selecionada, transita para a vista de horários detalhada
  if (selectedSchool) {
    return (
      <RoomSchedule
        rooms={schoolRooms}
        selectedSchool={selectedSchool}
        onBack={handleBack}
        onRefresh={() => fetchRooms(true)}
        profile={profile}
        token={token}
        bffHost={bffHost}
      />
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Escolas Politécnico"
        onBack={handleBack}
        rightIcon="refresh"
        onRightAction={() => fetchRooms(true)}
      />

      {loading ? (
        <View className="p-4">
          <SkeletonList count={4} />
        </View>
      ) : error ? (
        <View className="p-6">
          <ErrorCard message={error} onRetry={() => fetchRooms(true)} />
        </View>
      ) : (
        <SchoolPicker
          getSchoolRoomCount={getSchoolRoomCount}
          onSelectSchool={handleSelectSchool}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}
