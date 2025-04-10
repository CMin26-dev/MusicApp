import React, { useState,useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from "react-native";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../../MUSIC/configs/firebaseConfig";

// const AddSongForm = () => {
//   const [songs, setSongs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [title, setTitle] = useState("");
//   const [artist, setArtist] = useState("");
//   const [url,setUrl]=useState("")

//   const handleAddSong = async () => {
//     if (!title || !artist  || !url) return alert("Please fill in all fields");
//    try{
//       await addDoc(collection(db, "songs"), {
//         // id,
//         title,
//         artist,
//         url,
       
//       });
//       alert("Song added successfully!");
//       // setId("")
//       setTitle("");
//       setArtist("");
//       setUrl("");
//     }catch{
//       alert("Error adding song: " + error.message);

//     }

//   };

const AddSongForm = ({
  editingId,
  newTitle,
  setNewTitle,
  newArtist,
  setNewArtist,
  
  onEditDone
}) => {
  const handleSave = async () => {
    if (!newTitle || !newArtist ) return;

    if (editingId) {
      // 👉 Nếu có ID => đang chỉnh sửa
      const songRef = doc(db, 'songs', editingId);
      await updateDoc(songRef, {
        title: newTitle,
        artist: newArtist,
        url: newUrl
      });
    } else {
      // 👉 Nếu không có ID => thêm mới
      await addDoc(collection(db, 'songs'), {
        title: newTitle,
        artist: newArtist,
        
      });
    }

    onEditDone(); // reset form & gọi lại dữ liệu
  };

  return (
//     <View style={styles.formContainer}>
//       {/* <Text style={styles.label}>ID</Text>
//       <TextInput style={styles.input} value={id} onChangeText={setId} /> */}
//       <TextInput style={styles.input} placeholder="Song Title" value={title} onChangeText={setTitle} />
//       <TextInput style={styles.input} placeholder="Artist" value={artist} onChangeText={setArtist} />
//       <TextInput style={styles.input} placeholder="URL" value={url} onChangeText={setUrl} />
//       <TouchableOpacity style={styles.button} onPress={handleAddSong}>
//         <Text style={styles.buttonText}>Add Song</Text>
//       </TouchableOpacity> 
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   formContainer: { padding: 16,  gap:5 },
//   label: { color: "#fff", marginTop: 10 },
//   input: {
//     backgroundColor: "#333",
//     color: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 5,
//   },
//   button: {
//     backgroundColor: "#dc6353",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 18
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold"
//   },
// });
<View style={styles.container}>
<TextInput
  style={styles.input}
  placeholder="Tên bài hát"
  value={newTitle}
  onChangeText={setNewTitle}
  placeholderTextColor="#aaa"
/>
<TextInput
  style={styles.input}
  placeholder="Tác giả"
  value={newArtist}
  onChangeText={setNewArtist}
  placeholderTextColor="#aaa"
/>

<TouchableOpacity style={styles.button} onPress={handleSave}>
  <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add Song'}</Text>
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
padding: 12,
backgroundColor: '#333',
borderRadius: 12,
marginVertical: 10,
},
input: {
backgroundColor: '#444',
color: '#fff',
fontSize: 16,
padding: 10,
borderRadius: 10,
marginBottom: 10,
},
button: {
backgroundColor: '#dc6353',
padding: 12,
borderRadius: 10,
alignItems: 'center',
},
buttonText: {
color: '#fff',
fontWeight: 'bold'
}
});

export default AddSongForm;
