import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';

export function Button({
  children,
  variant = 'default',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  textClassName = '',
  activeOpacity = 0.75,
  ...props
}) {
  // Variantes de Contentor
  const variantContainerClasses = {
    default: 'bg-primary border-transparent',
    secondary: 'bg-primary/15 dark:bg-primary/20 border-transparent',
    destructive: 'bg-destructive border-transparent',
    outline: 'bg-transparent border border-border dark:border-border-dark',
    ghost: 'bg-transparent border-transparent',
    tonal: 'bg-slate-100 dark:bg-slate-800 border-transparent',
  };

  // Variantes de Texto
  const variantTextClasses = {
    default: 'text-white font-bold',
    secondary: 'text-primary-dark dark:text-primary-light font-bold',
    destructive: 'text-white font-bold',
    outline: 'text-slate-800 dark:text-slate-200 font-semibold',
    ghost: 'text-slate-700 dark:text-slate-300 font-medium',
    tonal: 'text-slate-900 dark:text-white font-semibold',
  };

  // Tamanhos
  const sizeContainerClasses = {
    sm: 'h-8 px-3 py-1 rounded-lg',
    md: 'h-11 px-4 py-2 rounded-xl',
    lg: 'h-13 px-6 py-3 rounded-2xl',
    icon: 'h-10 w-10 p-0 rounded-xl items-center justify-center',
  };

  const sizeTextClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    icon: 'text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22,
    icon: 20,
  };

  const getIconColor = () => {
    switch (variant) {
      case 'default':
      case 'destructive':
        return '#ffffff';
      case 'secondary':
        return '#f57c00';
      case 'outline':
      case 'ghost':
      case 'tonal':
        return '#ff9800';
      default:
        return '#ffffff';
    }
  };

  const isDisabled = disabled || loading;
  const containerStyle = `${sizeContainerClasses[size] || sizeContainerClasses.md} ${variantContainerClasses[variant] || variantContainerClasses.default} flex-row items-center justify-center ${isDisabled ? 'opacity-50' : ''} ${className}`;
  const textStyle = `${sizeTextClasses[size] || sizeTextClasses.md} ${variantTextClasses[variant] || variantTextClasses.default} text-center ${textClassName}`;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={isDisabled}
      className={containerStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
          className="mr-2"
        />
      ) : icon && iconPosition === 'left' ? (
        typeof icon === 'string' ? (
          <View className={children ? "mr-2" : ""}>
            <Icon source={icon} size={iconSizes[size] || 18} color={getIconColor()} />
          </View>
        ) : (
          <View className={children ? "mr-2" : ""}>{icon}</View>
        )
      ) : null}

      {children && (
        <Text className={textStyle}>
          {children}
        </Text>
      )}

      {!loading && icon && iconPosition === 'right' ? (
        typeof icon === 'string' ? (
          <View className={children ? "ml-2" : ""}>
            <Icon source={icon} size={iconSizes[size] || 18} color={getIconColor()} />
          </View>
        ) : (
          <View className={children ? "ml-2" : ""}>{icon}</View>
        )
      ) : null}
    </TouchableOpacity>
  );
}

export default Button;
