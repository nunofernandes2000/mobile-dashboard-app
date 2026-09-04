import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  onPress,
  className = '',
  textClassName = '',
  ...props
}) {
  const variantStyles = {
    default: {
      container: 'bg-primary/15 dark:bg-primary/20 border-transparent',
      text: 'text-primary-dark dark:text-primary-light font-bold',
      iconColor: '#f57c00',
    },
    secondary: {
      container: 'bg-slate-100 dark:bg-slate-800 border-transparent',
      text: 'text-slate-700 dark:text-slate-300 font-semibold',
      iconColor: '#64748b',
    },
    outline: {
      container: 'bg-transparent border border-border dark:border-border-dark',
      text: 'text-slate-700 dark:text-slate-300 font-semibold',
      iconColor: '#64748b',
    },
    success: {
      container: 'bg-success/15 dark:bg-success/20 border-transparent',
      text: 'text-success dark:text-success-dark font-bold',
      iconColor: '#2e7d32',
    },
    destructive: {
      container: 'bg-destructive/15 dark:bg-destructive/20 border-transparent',
      text: 'text-destructive dark:text-destructive-dark font-bold',
      iconColor: '#d32f2f',
    },
    warning: {
      container: 'bg-warning/15 dark:bg-warning/20 border-transparent',
      text: 'text-warning dark:text-warning-dark font-bold',
      iconColor: '#ed6c02',
    },
    info: {
      container: 'bg-info/15 dark:bg-info/20 border-transparent',
      text: 'text-info dark:text-info-dark font-bold',
      iconColor: '#1976d2',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  const sizeStyles = {
    sm: {
      container: 'px-2 py-0.5 rounded-md min-h-[22px]',
      text: 'text-[11px]',
      iconSize: 12,
    },
    md: {
      container: 'px-2.5 py-1 rounded-lg min-h-[26px]',
      text: 'text-xs',
      iconSize: 14,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const containerClasses = `flex-row items-center self-start justify-center ${currentSize.container} ${currentVariant.container} ${className}`;
  const textClasses = `${currentSize.text} ${currentVariant.text} ${textClassName}`;

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className={containerClasses}
        {...props}
      >
        {icon && (
          <View className="mr-1">
            <Icon source={icon} size={currentSize.iconSize} color={currentVariant.iconColor} />
          </View>
        )}
        <Text className={textClasses}>{children}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClasses} {...props}>
      {icon && (
        <View className="mr-1">
          <Icon source={icon} size={currentSize.iconSize} color={currentVariant.iconColor} />
        </View>
      )}
      <Text className={textClasses}>{children}</Text>
    </View>
  );
}

export default Badge;
