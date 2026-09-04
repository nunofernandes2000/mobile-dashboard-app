import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { Button } from './Button';

export function FilterBar({
  children,
  isOpen = false,
  onToggle,
  onReset,
  hasActiveFilters = false,
  activeCount = 0,
  title = 'Filtros & Opções',
  className = '',
  ...props
}) {
  return (
    <View className={`bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark mb-4 overflow-hidden shadow-sm ${className}`} {...props}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggle}
        className="flex-row items-center justify-between p-3.5"
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-lg bg-primary/15 items-center justify-center mr-2.5">
            <Icon source="filter-variant" size={18} color="#f57c00" />
          </View>
          <Text className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {title}
          </Text>
          {activeCount > 0 && (
            <View className="ml-2 px-2 py-0.5 rounded-full bg-primary">
              <Text className="text-[10px] font-bold text-white">
                {activeCount}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center">
          {hasActiveFilters && onReset && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="mr-2 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800"
            >
              <Text className="text-xs font-semibold text-primary-dark dark:text-primary-light">
                Limpar
              </Text>
            </TouchableOpacity>
          )}
          <Icon source={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="px-3.5 pb-3.5 pt-1 border-t border-border dark:border-border-dark gap-3">
          {children}
        </View>
      )}
    </View>
  );
}

export default FilterBar;
