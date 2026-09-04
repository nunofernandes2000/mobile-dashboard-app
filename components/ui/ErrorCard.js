import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { Button } from './Button';

export function ErrorCard({
  message = 'Ocorreu um erro ao carregar os dados.',
  title = 'Erro de Comunicação',
  onRetry,
  retryLabel = 'Tentar Novamente',
  className = '',
  ...props
}) {
  return (
    <View className={`bg-destructive/10 dark:bg-destructive/15 border border-destructive/30 rounded-2xl p-4 my-2 ${className}`} {...props}>
      <View className="flex-row items-start">
        <View className="w-9 h-9 rounded-xl bg-destructive/20 items-center justify-center mr-3 mt-0.5">
          <Icon source="alert-circle-outline" size={20} color="#d32f2f" />
        </View>

        <View className="flex-1">
          {title && (
            <Text className="text-sm font-bold text-destructive dark:text-destructive-dark mb-0.5">
              {title}
            </Text>
          )}
          <Text className="text-xs text-slate-700 dark:text-slate-300 leading-4">
            {message}
          </Text>

          {onRetry && (
            <Button
              variant="destructive"
              size="sm"
              icon="reload"
              onPress={onRetry}
              className="mt-3 self-start"
            >
              {retryLabel}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

export default ErrorCard;
