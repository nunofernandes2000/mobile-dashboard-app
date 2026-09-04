import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Portal, Icon } from 'react-native-paper';

export function Dialog({
  visible,
  onDismiss,
  children,
  className = '',
  contentContainerClassName = '',
  dismissable = true,
  ...props
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        contentContainerStyle={{
          alignSelf: 'center',
          width: '90%',
          maxWidth: 420,
          maxHeight: '85%',
        }}
        {...props}
      >
        <View className={`bg-card dark:bg-card-dark rounded-3xl p-5 border border-border dark:border-border-dark shadow-xl overflow-hidden ${contentContainerClassName}`}>
          {children}
        </View>
      </Modal>
    </Portal>
  );
}

export function DialogHeader({ children, className = '', onClose, ...props }) {
  return (
    <View className={`flex-row items-center justify-between pb-3 border-b border-border dark:border-border-dark mb-3 ${className}`} {...props}>
      <View className="flex-1 mr-2">{children}</View>
      {onClose && (
        <TouchableOpacity onPress={onClose} className="p-1.5 -mr-1 rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon source="close" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <Text className={`text-lg font-bold text-slate-900 dark:text-white ${className}`} {...props}>
      {children}
    </Text>
  );
}

export function DialogDescription({ children, className = '', ...props }) {
  return (
    <Text className={`text-xs text-muted dark:text-muted-dark mt-0.5 leading-4 ${className}`} {...props}>
      {children}
    </Text>
  );
}

export function DialogContent({ children, scrollable = false, className = '', ...props }) {
  if (scrollable) {
    return (
      <ScrollView showsVerticalScrollIndicator={true} className={`my-2 max-h-[360px] ${className}`} {...props}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View className={`my-2 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function DialogFooter({ children, className = '', ...props }) {
  return (
    <View className={`flex-row items-center justify-end gap-2 pt-3 border-t border-border dark:border-border-dark mt-3 ${className}`} {...props}>
      {children}
    </View>
  );
}

export default Dialog;
