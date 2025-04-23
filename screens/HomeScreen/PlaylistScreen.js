import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PlaylistScreen = () => {
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const auth = getAuth();
  const navigation = useNavigation();

  const fetchPlaylistSongs = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const playlistRef = collection(db, 'playlists');
      const q = query(playlistRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const songs = [];
      querySnapshot.forEach((doc) => {
        songs.push({ id: doc.id, ...doc.data() });
      });
      
      setPlaylistSongs(songs);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  useEffect(() => {
    fetchPlaylistSongs();
  }, []);

  const handleRemoveFromPlaylist = async (songId) => {
    try {
      await deleteDoc(doc(db, 'playlists', songId));
      fetchPlaylistSongs(); // Refresh the playlist
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.songItem}
      onPress={() => navigation.navigate('SongScreen', { song: item })}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
        <Text style={styles.songGener}>Thể loại: {item.gener || 'Unknown Genre'}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromPlaylist(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#dc6353" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Playlist</Text>
      {playlistSongs.length === 0 ? (
        <Text style={styles.emptyText}>Your playlist is empty</Text>
      ) : (
        <FlatList
          data={playlistSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    padding: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    color: '#dc6353',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  songGener: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 10,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlaylistScreen;