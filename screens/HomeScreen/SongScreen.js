import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SongScreen = ({ route }) => {
  const { song } = route.params || {};
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  const soundRef = useRef(null);

  useEffect(() => {
    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: song.url }, {}, onPlaybackStatusUpdate);
    soundRef.current = sound;
    setSound(sound);
  };

  const onPlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status);
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }

    setIsPlaying(!isPlaying);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.nowPlayingText}>ĐANG PHÁT TỪ NGHỆ SĨ</Text>
        <Text style={styles.artistName}>{song.artist}</Text>
      </View>

      {/* Song Image */}
      <Image source={{ uri: song.image }} style={styles.image} />

      {/* Song Info */}
      <View style={styles.songDetails}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: playbackStatus
                  ? `${(playbackStatus.positionMillis / playbackStatus.durationMillis) * 100}%`
                  : '0%',
              },
            ]}
          />
        </View>
        <View style={styles.progressTimes}>
          <Text style={styles.timeText}>
            {playbackStatus
              ? millisToMinutesAndSeconds(playbackStatus.positionMillis)
              : '0:00'}
          </Text>
          <Text style={styles.timeText}>
            {playbackStatus
              ? millisToMinutesAndSeconds(playbackStatus.durationMillis)
              : '0:00'}
          </Text>
        </View>
      </View>

      {/* Only Play/Pause Button */}
      <View style={styles.controlsCenter}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nowPlayingText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  artistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  image: {
    width: width - 40,
    height: width - 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  songDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#1DB954',
  },
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#bbb',
    fontSize: 12,
  },
  controlsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  playButton: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SongScreen;
