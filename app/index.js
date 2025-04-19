import { Text, View } from "react-native";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React ,{ useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import AdminDashboard from "../screens/AdminScreen/AdminDashboard"
import LogoutConfirmScreen from "../screens/LogoutConfirmScreen/LogoutConfirmScreen";
import { AppRegistry } from 'react-native';
import UserManagement from '../screens/UserManagement';

const Stack = createStackNavigator();
const ADMIN_EMAIL = "admin@gmail.com"
   
export default function Index() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);
    return (
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        isAdmin ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
      <Stack.Screen name="LogoutConfirm" component={LogoutConfirmScreen} />
      
    <Stack.Screen name="UserManagement" component={UserManagement} />
    </Stack.Navigator>

      );
}
