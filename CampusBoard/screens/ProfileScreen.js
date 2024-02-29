//ProfileScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook to navigate after sign out
import { auth } from '../firebaseConfig'; // Adjust the import path as necessary
import { signOut } from 'firebase/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // Function to handle sign-out
  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('User signed out');
      navigation.replace('Login'); // Assuming you have a 'Login' screen in your navigation stack
    }).catch((error) => {
      // An error happened.
      //console.error('Sign out error:', error);
    });
  };

  const userProfile = {
    name: 'John Doe',
    profilePicUrl: 'https://via.placeholder.com/150',
    posts: [
      { id: '1', content: 'This is my first post!' },
      { id: '2', content: 'Here is another interesting post.' },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
      </View>
      {userProfile.posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <Text>{post.content}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  post: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfileScreen;
