import React, { useState, useMemo, memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { TIMELINE_START_HOUR, TIMELINE_END_HOUR } from '../roomsConstants';
import {
  convertTimeToTimelinePercentage,
  formatTime,
  generateCourseColor,
  getUniqueOccupations,
  timeToMinutes,
} from '../roomsHelpers';

// Marcadores horários estáticos pré-calculados
const TIMELINE_MARKERS = [
  { hour: 8, label: '08:00', left: 0 },
  { hour: 10, label: '10:00', left: (2 / 14) * 100 },
  { hour: 12, label: '12:00', left: (4 / 14) * 100 },
  { hour: 14, label: '14:00', left: (6 / 14) * 100 },
  { hour: 16, label: '16:00', left: (8 / 14) * 100 },
  { hour: 18, label: '18:00', left: (10 / 14) * 100 },
  { hour: 20, label: '20:00', left: (12 / 14) * 100 },
  { hour: 22, label: '22:00', left: 100 },
];

export const TimelineBar = memo(function TimelineBar({ occupations, schoolColor }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const uniqueList = useMemo(() => getUniqueOccupations(occupations), [occupations]);

  const now = new Date();
  const currentHour = now.getHours();
  const currentTimelinePercentage = convertTimeToTimelinePercentage(currentHour, now.getMinutes());
  const isOperating = currentHour >= TIMELINE_START_HOUR && currentHour < TIMELINE_END_HOUR;

  return (
    <View className="mt-2">
      <View className="h-5 relative mb-0.5">
        {TIMELINE_MARKERS.map((m) => (
          <View
            key={`marker-${m.hour}`}
            className="absolute"
            style={{ left: `${m.left}%`, transform: [{ translateX: -14 }] }}
          >
            <Text className="text-[9px] font-semibold text-muted dark:text-muted-dark">{m.label}</Text>
          </View>
        ))}
      </View>

      <View className="h-10 rounded-xl relative overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border dark:border-border-dark">
        {TIMELINE_MARKERS.map((m) => (
          <View
            key={`guide-${m.hour}`}
            className="absolute top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-700"
            style={{ left: `${m.left}%` }}
          />
        ))}

        {uniqueList.map((occ, idx) => {
          const left = convertTimeToTimelinePercentage(occ.startHour, occ.startMinute);
          const right = convertTimeToTimelinePercentage(occ.endHour, occ.endMinute);
          const width = right - left;
          const isSelected = selectedIndex === idx;

          return (
            <TouchableOpacity
              key={`occ-${occ.cdAula || occ.startHour}-${occ.startMinute}-${idx}`}
              activeOpacity={0.75}
              onPress={() => setSelectedIndex(isSelected ? null : idx)}
              className="absolute top-[3px] bottom-[3px] rounded-md justify-center px-1"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 1.5)}%`,
                backgroundColor: generateCourseColor(occ.courseCode),
                borderColor: isSelected ? '#ffffff' : 'transparent',
                borderWidth: isSelected ? 2 : 0,
                elevation: isSelected ? 6 : 2,
                zIndex: isSelected ? 10 : 1,
              }}
            >
              {width > 8 && (
                <Text className="text-white text-[8px] font-bold" numberOfLines={1}>
                  {occ.courseName?.split(' ').slice(0, 2).join(' ')}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        {isOperating && (
          <View className="absolute -top-0.5 -bottom-0.5 w-0.5 bg-destructive z-20" style={{ left: `${currentTimelinePercentage}%` }}>
            <View className="absolute -top-[3px] -left-[3px] w-2 h-2 rounded-full bg-destructive" />
          </View>
        )}
      </View>

      {selectedIndex !== null && uniqueList[selectedIndex] && (
        <View className="mt-2.5 rounded-2xl border border-border dark:border-border-dark overflow-hidden bg-card dark:bg-card-dark shadow-sm">
          <OccupationDetail occupation={uniqueList[selectedIndex]} />
        </View>
      )}


      {uniqueList.length === 0 && (
        <View className="py-2 items-center">
          <View className="flex-row items-center gap-1.5">
            <Icon source="check" size={16} color="#2e7d32" />
            <Text className="font-semibold text-xs text-success dark:text-success-dark">Livre todo o dia</Text>
          </View>
        </View>
      )}
    </View>
  );
});

// Cartão com os detalhes da aula selecionada
export const OccupationDetail = memo(function OccupationDetail({ occupation }) {
  if (!occupation) return null;
  const courseColor = generateCourseColor(occupation.courseCode);

  return (
    <View className="flex-row">
      <View className="w-1.5" style={{ backgroundColor: courseColor }} />
      <View className="flex-1 p-3.5">
        <Text className="font-bold text-sm text-slate-900 dark:text-white mb-1">{occupation.courseName}</Text>
        <View className="flex-row mt-1">
          <View className="flex-row items-center gap-1">
            <Icon source="clock-outline" size={14} color="#94a3b8" />
            <Text className="text-xs text-muted dark:text-muted-dark">
              {formatTime(occupation.startHour, occupation.startMinute)} – {formatTime(occupation.endHour, occupation.endMinute)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 ml-4">
            <Icon source="timer-outline" size={14} color="#94a3b8" />
            <Text className="text-xs text-muted dark:text-muted-dark">{occupation.durationMinutes} min</Text>
          </View>
        </View>
        <View className="flex-row mt-1">
          <View className="flex-row items-center gap-1">
            <Icon source="book-outline" size={14} color="#94a3b8" />
            <Text className="text-xs text-muted dark:text-muted-dark">Cód: {occupation.courseCode}</Text>
          </View>
          <View className="flex-row items-center gap-1 ml-4">
            <Icon source="account-tie" size={14} color="#94a3b8" />
            <Text className="text-xs text-muted dark:text-muted-dark">Doc: {occupation.teacherCode}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

// Vista em lista com marcadores coloridos por aula
export const OccupationList = memo(function OccupationList({ occupations }) {
  const sorted = useMemo(() => {
    return getUniqueOccupations(occupations).sort(
      (a, b) => timeToMinutes(a.startHour, a.startMinute) - timeToMinutes(b.startHour, b.startMinute)
    );
  }, [occupations]);

  if (sorted.length === 0) {
    return (
      <View className="py-2 items-center">
        <View className="flex-row items-center gap-1.5">
          <Icon source="check" size={16} color="#2e7d32" />
          <Text className="font-semibold text-xs text-success dark:text-success-dark">Sem aulas programadas</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-1 gap-1">
      {sorted.map((occ, idx) => (
        <View key={`occ-legend-${occ.cdAula || occ.startHour}-${occ.startMinute}-${idx}`} className="flex-row items-center py-1">
          <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: generateCourseColor(occ.courseCode) }} />
          <Text className="text-[11px] font-bold mr-2 w-20 text-muted dark:text-muted-dark">
            {formatTime(occ.startHour, occ.startMinute)}–{formatTime(occ.endHour, occ.endMinute)}
          </Text>
          <Text className="flex-1 text-xs text-slate-800 dark:text-slate-200" numberOfLines={1}>
            {occ.courseName}
          </Text>
        </View>
      ))}
    </View>
  );
});

export default TimelineBar;
