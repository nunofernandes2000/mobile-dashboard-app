import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  className = '',
  inputClassName = '',
  containerClassName = '',
  ...props
}) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">
          {label}
        </Text>
      )}

      <View className={`flex-row items-center bg-surface dark:bg-surface-dark border rounded-xl px-3 h-11 ${error ? 'border-destructive' : 'border-border dark:border-border-dark'} ${className}`}>
        {leftIcon && (
          <View className="mr-2">
            <Icon source={leftIcon} size={20} color="#94a3b8" />
          </View>
        )}

        <TextInput
          placeholderTextColor="#94a3b8"
          className={`flex-1 text-sm text-slate-900 dark:text-white py-1 ${inputClassName}`}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            className="p-1 -mr-1"
          >
            <Icon source={rightIcon} size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-xs text-destructive mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Pesquisar...',
  onClear,
  className = '',
  ...props
}) {
  const handleClear = () => {
    if (onChangeText) onChangeText('');
    if (onClear) onClear();
  };

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leftIcon="magnify"
      rightIcon={value ? 'close-circle' : undefined}
      onRightIconPress={value ? handleClear : undefined}
      className={className}
      {...props}
    />
  );
}

export default Input;
