import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlaylistList from '../../components/PlaylistList';

const PlaylistScreen = () => {
  return (
    <View style={styles.container}>
      <PlaylistList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
  },
});

export default PlaylistScreen;