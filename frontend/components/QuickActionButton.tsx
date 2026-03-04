import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function QuickActionButton({
  icon,
  label,
  color,
  onPress,
  style,
}: QuickActionButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '18' }]}>
        {icon}
      </View>
      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
