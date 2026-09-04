import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function Skeleton({
  className = '',
  width,
  height,
  borderRadius = 8,
  style,
  ...props
}) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [opacityAnim]);

  const customStyle = {
    opacity: opacityAnim,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
    ...style,
  };

  return (
    <Animated.View
      className={`bg-slate-300 dark:bg-slate-700 ${className}`}
      style={customStyle}
      {...props}
    />
  );
}

export function SkeletonCard({ className = '', style, ...props }) {
  return (
    <View
      className={`bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-4 shadow-sm mb-3.5 ${className}`}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2 flex-1">
          <Skeleton width={70} height={22} borderRadius={11} />
          <Skeleton width={80} height={22} borderRadius={11} />
        </View>
        <Skeleton width={20} height={20} borderRadius={10} />
      </View>
      <Skeleton width="85%" height={18} borderRadius={6} className="mb-2" />
      <Skeleton width="55%" height={14} borderRadius={4} className="mb-3" />
      <View className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 gap-2">
        <Skeleton width="100%" height={12} borderRadius={4} />
        <Skeleton width="90%" height={12} borderRadius={4} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 4, className = '', ...props }) {
  return (
    <View className={`w-full ${className}`} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-item-${index}`} />
      ))}
    </View>
  );
}

export default Skeleton;
