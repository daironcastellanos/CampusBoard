// screens/FeedScreen.js
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Post from '../components/Post';

const initialPosts = [
  {
    id: '1',
    userName: 'Dairon Castellanos',
    userProfilePic: 'https://via.placeholder.com/150', // Placeholder or actual image URL
    content: 'This is a test post',
  },
  // Additional posts...
];

const FeedScreen = () => {
  const [posts, setPosts] = useState(initialPosts);

  const renderPost = ({ item }) => (
    <Post 
      userName={item.userName} 
      userProfilePic={item.userProfilePic} 
      postContent={item.content} 
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default FeedScreen;
