// SongScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/firebaseConfig'; // Đảm bảo đường dẫn đúng
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const SongScreen = () => {
  const [songs, setSongs] = useState([]);
  const [soundObject, setSoundObject] = useState(null);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({}); // Lưu trạng thái phát của từng bài hát

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'songs'));
        const songList = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          artist: doc.data().artist,
          url: doc.data().url,
          duration: 0, // Khởi tạo duration
        }));
        setSongs(songList);
      } catch (error) {
        console.error('Lỗi khi tải bài hát từ Firebase:', error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const updatePlaybackStatus = (url, status) => {
    setPlaybackStatus(prevStatus => ({
      ...prevStatus,
      [url]: status,
    }));
  };

  const playSound = async (url, index) => {
    if (soundObject && currentSongUrl === url) {
      // Nếu cùng một bài hát đang phát, hãy dừng
      await soundObject.unloadAsync();
      setSoundObject(null);
      setCurrentSongUrl(null);
      updatePlaybackStatus(url, {});
    } else {
      // Nếu có bài hát khác đang phát, hãy dừng nó trước
      if (soundObject) {
        await soundObject.unloadAsync();
      }
      try {
        const { sound, status } = await Audio.Sound.createAsync({ uri: url });
        setSoundObject(sound);
        setCurrentSongUrl(url);
        updatePlaybackStatus(url, status);
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate(async (status) => {
          updatePlaybackStatus(url, status);
          if (status.didJustFinish && !status.isLooping) {
            await sound.unloadAsync();
            setSoundObject(null);
            setCurrentSongUrl(null);
            updatePlaybackStatus(url, {});
          }
        });
      } catch (error) {
        console.error('Lỗi khi phát nhạc:', error);
      }
    }
  };

  const stopSound = async () => {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      setSoundObject(null);
      setCurrentSongUrl(null);
      setPlaybackStatus({});
    }
  };

  const addToPlaylist = (title) => {
    alert(`ADD "${title}"  playlist!`);
    // Ở đây bạn sẽ thực hiện logic thêm vào playlist
  };

  const formatTime = (millis) => {
    if (millis === undefined || isNaN(millis)) {
      return '0:00';
    }
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.songItem}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
        {playbackStatus[item.url]?.isBuffering && <Text style={styles.playbackTime}>Đang tải...</Text>}
        {playbackStatus[item.url]?.isPlaying && playbackStatus[item.url]?.durationMillis !== undefined && (
          <Text style={styles.playbackTime}>
            {formatTime(playbackStatus[item.url]?.positionMillis)} / {formatTime(playbackStatus[item.url]?.durationMillis)}
          </Text>
        )}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => playSound(item.url, index)}>
          <Ionicons
            name={currentSongUrl === item.url && playbackStatus[item.url]?.isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
            size={30}
            color="#dc6353"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => addToPlaylist(item.title)}>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#aaa',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginLeft: 15,
  },
  playbackTime: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SongScreen;