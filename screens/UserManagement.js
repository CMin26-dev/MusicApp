import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Alert} from 'react-native';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
const UserManagement = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

const fetchData = async () => {
   
    const userSnapshot = await getDocs(collection(db, 'users'));
    setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  // Delete user
    const handleDeleteUser = async (id) => {
      Alert.alert("Confirm", "Delete this user?", [
        { text: "Cancel" },
        { text: "Delete", onPress: async () => {
          await deleteDoc(doc(db, 'users', id));
          fetchData();
        }}
      ]);
    };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
     <Text style={styles.title}>SOUNDIFY</Text>
     </View>
     <Text style={styles.titleuser}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>{item.fullName} - {item.email}</Text>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#dc6353" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 25,
    
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontStyle : "normal",
    color: "#ffff",
    marginRight: 100
  },
  titleuser: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    
  },
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,

  },
  itemText: {
    color: "#fff"
  },
  row: {
    flexDirection: "row"
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});