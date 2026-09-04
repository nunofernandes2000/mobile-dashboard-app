import { useState, useEffect, useCallback } from 'react';
import { matchesSchool } from './roomsConstants';
import { getUniqueOccupations, timeToMinutes } from './roomsHelpers';

// Hook para gerir o carregamento e estado das salas e horários
export function useRooms({ token, bffHost, onBack }) {
  const [rooms, setRooms] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pede a lista de salas e os respetivos horários diários em paralelo
  const fetchRooms = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [roomsRes, scheduleRes] = await Promise.all([
        fetch(`${bffHost}/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${bffHost}/schedule`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      ]);

      if (!roomsRes.ok) throw new Error(`Erro HTTP ${roomsRes.status}`);
      const roomsData = await roomsRes.json();
      if (!roomsData.success) throw new Error(roomsData.error || 'Erro ao carregar salas.');

      const scheduleMap = new Map();
      if (scheduleRes?.ok) {
        const scheduleData = await scheduleRes.json();
        for (const room of scheduleData?.schedule?.rooms || []) {
          const key = String(room.roomCode || room.cdSala || '');
          scheduleMap.set(key, getUniqueOccupations(room.occupations));
        }
      }

      // Mapeia ocupações e calcula se a sala tem aula a decorrer no momento atual
      const now = new Date();
      const currentMinutes = timeToMinutes(now.getHours(), now.getMinutes());

      const enriched = (roomsData.rooms || []).map((room) => {
        const key = String(room.cdSala || room.roomCode || '');
        const occupations = scheduleMap.get(key) || [];

        const active = occupations.find((occ) => {
          const start = timeToMinutes(occ.startHour, occ.startMinute);
          const end = timeToMinutes(occ.endHour, occ.endMinute);
          return currentMinutes >= start && currentMinutes < end;
        });

        return {
          ...room,
          ocupada: !!active,
          currentCourseName: active?.courseName || null,
          todayOccupations: occupations.length,
          occupations,
        };
      });

      setRooms(enriched);
    } catch (e) {
      setError(e.message || 'Falha na ligação ao servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [bffHost, token]);

  useEffect(() => {
    fetchRooms(true);
  }, [fetchRooms]);

  const handleSelectSchool = useCallback((schoolId) => setSelectedSchool(schoolId), []);
  const handleBack = useCallback(() => (selectedSchool ? setSelectedSchool(null) : onBack?.()), [selectedSchool, onBack]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchRooms(false); }, [fetchRooms]);
  const getSchoolRoomCount = useCallback((schoolId) => rooms.filter((r) => matchesSchool(r, schoolId)).length, [rooms]);

  return {
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
  };
}

export default useRooms;
