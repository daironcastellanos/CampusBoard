// components/Post.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Post = ({ userName, userProfilePic, postContent }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userProfilePic }} style={styles.profilePic} />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Text style={styles.content}>{postContent}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
});

export default Post;
