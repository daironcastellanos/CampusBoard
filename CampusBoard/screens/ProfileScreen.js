// screens/ProfileScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ProfileScreen = () => {
  // Sample data for the profile
  const userProfile = {
    name: 'John Doe',
    profilePicUrl: 'https://via.placeholder.com/150', // Placeholder image
    posts: [
      { id: '1', content: 'This is my first post!' },
      { id: '2', content: 'Here is another interesting post.' },
      // Add more sample posts as needed
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
      </View>
      <View style={styles.postsContainer}>
        {userProfile.posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Text>{post.content}</Text>
          </View>
        ))}
      </View>
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
});

export default ProfileScreen;
