import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useBottomTabOverflow } from './ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ParallaxScrollViewProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  parallaxHeight?: number;
  renderParallaxBackground?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
  children?: React.ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function ParallaxScrollView({
  style,
  contentContainerStyle,
  parallaxHeight = 300,
  renderParallaxBackground,
  renderHeader,
  headerBackgroundColor = {
    light: '#fff',
    dark: '#000',
  },
  children,
  onScroll,
}: ParallaxScrollViewProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const { isOverflowing } = useBottomTabOverflow();

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: onScroll,
    }
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={handleScroll}
        scrollIndicatorInsets={{ bottom: isOverflowing ? 49 : 0 }}
        contentContainerStyle={[
          contentContainerStyle,
          { paddingBottom: isOverflowing ? 49 : 0 },
        ]}>
        {renderParallaxBackground && (
          <Animated.View
            style={[
              styles.parallaxBackground,
              {
                height: parallaxHeight,
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-parallaxHeight, 0, parallaxHeight],
                      outputRange: [parallaxHeight / 2, 0, -parallaxHeight / 3],
                    }),
                  },
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-parallaxHeight, 0, parallaxHeight],
                      outputRange: [2, 1, 1],
                    }),
                  },
                ],
              },
            ]}>
            {renderParallaxBackground()}
          </Animated.View>
        )}
        {renderHeader && (
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: headerBackgroundColor[colorScheme],
                opacity: scrollY.interpolate({
                  inputRange: [0, parallaxHeight / 2],
                  outputRange: [0, 1],
                }),
              },
            ]}>
            {renderHeader()}
          </Animated.View>
        )}
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallaxBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
