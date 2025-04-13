// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomBottomNavigationBar from "../../components/CustomBottomNavigationBar";
import SongScreen from "./SongScreen"; // Import các màn hình con
import PlaylistScreen from "./PlaylistScreen"; // Import các màn hình con
import { TextInput, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";
import { Audio } from "expo-av";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("Song"); // State để theo dõi tab đang được chọn
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Để lưu trữ kết quả tìm kiếm
  const [songs, setSongs] = useState([]); // State để lưu trữ danh sách bài hát
  const [sound, setSound] = useState(null); // State để quản lý âm thanh đang phát
  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "songs"));
        const songList = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          artist: doc.data().artist,
          url: doc.data().url,
        }));
        setSongs(songList);
      } catch (error) {
        console.error(
          "Lỗi khi tải bài hát từ Firebase trong HomeScreen:",
          error
        );
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredResults = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(text.toLowerCase()) ||
        song.artist.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const playSound = async (url) => {
    if (sound && currentSongUrl === url) {
      // Nếu đang phát cùng bài hát, không làm gì
      return;
    }
    if (sound) {
      await sound.unloadAsync();
    }
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      setCurrentSongUrl(url); // Cập nhật URL bài hát đang phát
      await newSound.playAsync();
    } catch (error) {
      console.error("Lỗi khi phát nhạc:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setCurrentSongUrl(null); // Đặt lại URL bài hát đang phát
    }
  };

  const handleAddToPlaylist = (song) => {
    console.log("Thêm vào playlist:", song.title); // Tạm thời hiển thị một thông báo
    alert(`Đã thêm "${song.title}" vào playlist!`);
  };

  const renderSearchItem = ({ item }) => (
    <View style={styles.searchItem}>
      
      <View style={{ flex: 1 }}>
      <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          if (sound && item.url === currentSongUrl) {
            stopSound();
          } else {
            playSound(item.url);
          }
        }}
      >
        
        <Ionicons
          name={
            sound && item.url === currentSongUrl
              ? "stop-circle-outline"
              : "play-circle-outline"
          }
          size={24}
          color="#ffa500"
        />
        
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleAddToPlaylist(item)}
      >
      <Ionicons name="add-circle-outline" size={24} color="#fff" />
        
      </TouchableOpacity>
      
    </View>
  );

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]); // Unload sound khi component unmount hoặc sound thay đổi

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Song":
        return (
          <View style={{ flex: 1 }}>
          <SongScreen />
          </View>
        );
      case "Search":
        return (
          <View style={{ flex: 1, backgroundColor: "#242424" }}>
           
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
              data={searchText ? searchResults : []} // Hiển thị kết quả tìm kiếm nếu có text
              keyExtractor={(item) => item.id}
              renderItem={renderSearchItem}
              style={styles.searchResultsList}
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
        return <PlaylistScreen />; // Sử dụng component PlaylistScreen
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#242424" }}>
   
      <View style={{ paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 }}>
      
        <View style={styles.topBar}>
          <Text style={styles.title}>SOUNDIFY</Text>         {" "}
          <TouchableOpacity
            onPress={() => navigation.navigate("LogoutConfirm")}
          >
           
            <Ionicons name="person-circle-outline" size={28} color="#fff" />   
            
          </TouchableOpacity>
         
        </View>
       
        <Text style={styles.header}>
         
          {activeTab === "Song"
            ? "All Songs"
            : activeTab === "Search"
            ? "Search"
            : "Playlist"}
         
        </Text>
       
      </View>
     <View style={{ flex: 1 }}> {renderContent()} </View>
      
      <CustomBottomNavigationBar
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    fontStyle: "normal",
    color: "#fff",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
    fontStyle: "normal",
    color: "#ffff",
    marginTop: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  songTitle: {
    color: "#fff",
    fontSize: 16,
  },
  songArtist: {
    color: "#aaa",
    fontSize: 14,
  },
  playButton: {
    color: "#ffa500",
    fontSize: 16,
    fontWeight: "bold",
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
  searchResultsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  searchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  emptySearchText: {
    color: "#ffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  searchButton: {
    padding: 8,
  },
});

export default HomeScreen;
