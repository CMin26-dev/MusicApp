import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaylistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chào mừng đến  hát!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424', // Màu nền tối (tùy chọn)
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});

export default PlaylistScreen;