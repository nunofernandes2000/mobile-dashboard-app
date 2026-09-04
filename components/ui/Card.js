import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function Card({ children, className = '', onPress, onLongPress, activeOpacity = 0.7, ...props }) {
  const baseClasses = "bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark shadow-sm";
  
  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        onLongPress={onLongPress}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={`${baseClasses} ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <View className={`p-4 pb-2 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className = '', numberOfLines, ...props }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`text-base font-bold text-slate-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({ children, className = '', numberOfLines, ...props }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`text-xs text-muted dark:text-muted-dark mt-0.5 leading-4 ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <View className={`p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <View className={`px-4 py-3 border-t border-border dark:border-border-dark flex-row items-center justify-between ${className}`} {...props}>
      {children}
    </View>
  );
}

export default Card;
