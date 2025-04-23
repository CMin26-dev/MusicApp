import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type IconSymbolProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
  style?: any;
};

export function IconSymbol({ name, size = 24, color = '#000', weight = 'regular', style }: IconSymbolProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 