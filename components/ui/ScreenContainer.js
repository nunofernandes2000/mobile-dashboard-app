import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Header } from './Header';

export function ScreenContainer({
  title,
  subtitle,
  onBack,
  onRefresh,
  refreshing = false,
  rightIcon,
  onRightAction,
  rightAction,
  children,
  scrollable = true,
  className = '',
  contentContainerClassName = '',
  contentContainerStyle,
  extra,
  bgClassName = 'bg-primary',
  ...props
}) {
  const showHeader = Boolean(title || onBack || rightAction || rightIcon);

  return (
    <View className={`flex-1 bg-background dark:bg-background-dark ${className}`} {...props}>
      {showHeader && (
        <Header
          title={title}
          subtitle={subtitle}
          onBack={onBack}
          rightIcon={rightIcon}
          onRightAction={onRightAction}
          rightAction={rightAction}
          bgClassName={bgClassName}
        />
      )}

      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={[{ padding: 16, paddingBottom: 110 }, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#ff9800']}
                tintColor="#ff9800"
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 p-4 pb-[110px] ${contentContainerClassName}`} style={contentContainerStyle}>
          {children}
        </View>
      )}

      {extra}
    </View>
  );
}

export default ScreenContainer;
