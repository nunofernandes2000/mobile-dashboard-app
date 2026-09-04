import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { Button } from './Button';

export function EmptyState({
  icon = 'folder-open-outline',
  iconColor = '#94a3b8',
  iconSize = 48,
  title = 'Nenhum registo encontrado',
  description,
  actionLabel,
  onAction,
  className = '',
  ...props
}) {
  return (
    <View className={`items-center justify-center py-12 px-6 ${className}`} {...props}>
      <View className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mb-3">
        <Icon source={icon} size={iconSize} color={iconColor} />
      </View>

      <Text className="text-base font-bold text-slate-800 dark:text-slate-200 text-center mb-1">
        {title}
      </Text>

      {description && (
        <Text className="text-xs text-muted dark:text-muted-dark text-center leading-5 max-w-[280px]">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          variant="default"
          size="sm"
          onPress={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

export default EmptyState;
