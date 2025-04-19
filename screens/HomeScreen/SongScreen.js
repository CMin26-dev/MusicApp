// SongScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SongScreen = ({ route }) => {
  const { song } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin chi tiết bài hát</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  songArtist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    color: '#888',
  },
});

export default SongScreen;