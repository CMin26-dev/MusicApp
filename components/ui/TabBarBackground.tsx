import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';

const BottomTabOverflowContext = createContext<{
  isOverflowing: boolean;
  setIsOverflowing: (value: boolean) => void;
}>({
  isOverflowing: false,
  setIsOverflowing: () => {},
});

export function useBottomTabOverflow() {
  return useContext(BottomTabOverflowContext);
}

export function TabBarBackground({ children }: { children: React.ReactNode }) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  return (
    <BottomTabOverflowContext.Provider value={{ isOverflowing, setIsOverflowing }}>
      <View style={[styles.container, isOverflowing && styles.overflowing]}>
        {children}
      </View>
    </BottomTabOverflowContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overflowing: {
    backgroundColor: '#000',
  },
}); 