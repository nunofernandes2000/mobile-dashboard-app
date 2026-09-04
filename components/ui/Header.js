import React from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';

// Barra de cabeçalho padrão com suporte para safe area, navegação e ações à direita
export function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightAction,
  rightAction,
  className = '',
  bgClassName = 'bg-primary',
  children,
}) {
  const insets = useSafeAreaInsets();
  // Ajuste do espaçamento superior para a barra de estado (Safe Area / Android)
  const topInset = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0);

  return (
    <View className={`${bgClassName} shadow-sm z-10 ${className}`}>
      <View style={{ height: topInset }} />
      <View className="h-14 px-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              className="p-1 -ml-1 mr-3"
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon source="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            <Text className="text-white font-bold text-lg leading-tight" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-white/85 text-xs mt-0.5" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightAction ? (
          rightAction
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightAction}
            className="p-1.5 -mr-1"
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon source={rightIcon} size={22} color="#ffffff" />
          </TouchableOpacity>
        ) : null}

        {children}
      </View>
    </View>
  );
}

export default Header;
