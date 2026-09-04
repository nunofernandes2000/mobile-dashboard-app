import React from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { Card, CardContent } from '../../ui';
import { SCHOOLS } from '../roomsConstants';

// Lista das 4 escolas do IPP com contadores de salas e seleção interativa
export function SchoolPicker({ getSchoolRoomCount, onSelectSchool, refreshing, onRefresh }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#ff9800']}
          tintColor="#ff9800"
        />
      }
    >
      <Text className="text-sm font-semibold mx-4 mt-4 mb-4 text-muted dark:text-muted-dark">
        Escolha uma escola para explorar as salas disponíveis:
      </Text>

      <View className="px-4 gap-3.5">
        {SCHOOLS.map((school) => {
          const count = getSchoolRoomCount ? getSchoolRoomCount(school.id) : 0;
          return (
            <Card
              key={school.id}
              className="rounded-2xl border border-border dark:border-border-dark overflow-hidden"
              style={{ borderLeftWidth: 5, borderLeftColor: school.color }}
              onPress={() => onSelectSchool && onSelectSchool(school.id)}
            >
              <CardContent className="p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${school.color}20` }}
                  >
                    <Icon source={school.icon} size={24} color={school.color} />
                  </View>
                  <View
                    className="px-2.5 py-0.5 rounded-lg"
                    style={{ backgroundColor: `${school.color}18` }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: school.color }}
                    >
                      {count === 1 ? '1 sala' : `${count} salas`}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                  {school.name}
                </Text>
                <Text className="text-xs text-muted dark:text-muted-dark mt-0.5 leading-4">
                  {school.fullName}
                </Text>
              </CardContent>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default SchoolPicker;
