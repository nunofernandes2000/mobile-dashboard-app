import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function LoadingState({
  label = 'A carregar...',
  size = 'large',
  color = '#ff9800',
  className = '',
  ...props
}) {
  return (
    <View className={`items-center justify-center py-12 px-4 ${className}`} {...props}>
      <ActivityIndicator size={size} color={color} />
      {label && (
        <Text className="text-sm text-muted dark:text-muted-dark mt-3 text-center font-medium">
          {label}
        </Text>
      )}
    </View>
  );
}

export default LoadingState;
