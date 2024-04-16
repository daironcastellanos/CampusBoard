//App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure this path is correct

import FeedScreen from './screens/FeedScreen';
import PostCreationScreen from './screens/PostCreationScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import BottomTabBar from './components/BottomTabBar';
import { DeletionProvider } from './components/DeletionContext';
// Ensure this path is correct

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Return the unsubscribe function to be called on cleanup
  }, []);

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );

  const MainApp = () => (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={PostCreationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );

  return (
    <DeletionProvider>
      <NavigationContainer>
        {user ? <MainApp /> : <AuthStack />}
      </NavigationContainer>
    </DeletionProvider>
  );
}

export default App;
