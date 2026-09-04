import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  onPress,
  className = '',
  ...props
}) {
  const colorMap = {
    primary: {
      bgIcon: 'bg-primary/15 dark:bg-primary/20',
      iconColor: '#f57c00',
      valueColor: 'text-primary-dark dark:text-primary-light',
      borderColor: 'border-primary/20',
    },
    success: {
      bgIcon: 'bg-success/15 dark:bg-success/20',
      iconColor: '#2e7d32',
      valueColor: 'text-success dark:text-success-dark',
      borderColor: 'border-success/20',
    },
    destructive: {
      bgIcon: 'bg-destructive/15 dark:bg-destructive/20',
      iconColor: '#d32f2f',
      valueColor: 'text-destructive dark:text-destructive-dark',
      borderColor: 'border-destructive/20',
    },
    warning: {
      bgIcon: 'bg-warning/15 dark:bg-warning/20',
      iconColor: '#ed6c02',
      valueColor: 'text-warning dark:text-warning-dark',
      borderColor: 'border-warning/20',
    },
    info: {
      bgIcon: 'bg-info/15 dark:bg-info/20',
      iconColor: '#1976d2',
      valueColor: 'text-info dark:text-info-dark',
      borderColor: 'border-info/20',
    },
    purple: {
      bgIcon: 'bg-purple-500/15 dark:bg-purple-500/20',
      iconColor: '#9333ea',
      valueColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    indigo: {
      bgIcon: 'bg-indigo-500/15 dark:bg-indigo-500/20',
      iconColor: '#4f46e5',
      valueColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-500/20',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;

  const Content = (
    <View className={`bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-3.5 shadow-sm flex-row items-center ${className}`}>
      {icon && (
        <View className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${scheme.bgIcon}`}>
          <Icon source={icon} size={22} color={scheme.iconColor} />
        </View>
      )}

      <View className="flex-1 justify-center">
        <Text className={`text-xl font-bold ${scheme.valueColor}`} numberOfLines={1}>
          {value}
        </Text>
        {title && (
          <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5" numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text className="text-[11px] text-muted dark:text-muted-dark mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} {...props}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
}

export default StatCard;
