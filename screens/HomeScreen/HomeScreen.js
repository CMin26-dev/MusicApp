// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomBottomNavigationBar from "../../components/CustomBottomNavigationBar";
import { TextInput, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";
import { Audio } from "expo-av";
import PlaylistScreen from "./PlaylistScreen";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("Song");
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [songs, setSongs] = useState([]);


  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "songs"));
        const songList = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          artist: doc.data().artist,
          url: doc.data().url,
          image: doc.data().image ,
          gener: doc.data().gener,
    
        }));
        setSongs(songList);
      } catch (error) {
        console.error("Lỗi khi tải bài hát từ Firebase:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const lowerText = text.toLowerCase();
  
    const filteredResults = songs.filter((song) => {
      const title = song.title?.toLowerCase() || '';
      const artist = song.artist?.toLowerCase() || '';
      const gener = song.gener?.toLowerCase() || '';
      return (
        title.includes(lowerText) ||
        artist.includes(lowerText) ||
        gener.includes(lowerText)
      );
    });
  
    setSearchResults(filteredResults);
  };
  

  const handleAddToPlaylist = (song) => {
    alert(`Đã thêm "${song.title}" vào playlist!`);
    navigation.navigate('PlaylistScreen');
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
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToPlaylist(item)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#ffa500" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Song":
        return (
          <FlatList
            data={songs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        );
      case "Search":
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={handleSearch}
              />
              <TouchableOpacity style={styles.searchIcon}>
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchText ? searchResults : []}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              ListEmptyComponent={() =>
                searchText ? (
                  <Text style={styles.emptySearchText}>
                    Không tìm thấy kết quả nào.
                  </Text>
                ) : null
              }
            />
          </View>
        );
      case "Playlist":
        return <PlaylistScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <Text style={styles.title}>SOUNDIFY</Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogoutConfirm")}>
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.pageTitle}>
          {activeTab === "Song"
            ? "All Songs"
            : activeTab === "Search"
            ? "Search"
            : "Playlist"}
        </Text>
      </View>
      <View style={styles.content}>{renderContent()}</View>
      <CustomBottomNavigationBar
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
    color: "#ffa500",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  songArtist: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 2,
  },
  songGener: {
    color: "#888",
    fontSize: 12,
    fontStyle: 'italic',
  },
  rightContainer: {
    alignItems: "flex-end",
  },

  addButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: "#fff",
    fontSize: 16,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  emptySearchText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
