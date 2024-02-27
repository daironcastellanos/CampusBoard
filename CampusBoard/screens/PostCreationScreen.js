import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const PostCreationScreen = () => {
  const [postContent, setPostContent] = useState('');

  const handlePostCreation = () => {
    console.log('Post content:', postContent);
    // Here you will later handle the post submission to your backend
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        multiline
        numberOfLines={4}
        onChangeText={text => setPostContent(text)}
        value={postContent}
      />
      <Button title="Post" onPress={handlePostCreation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default PostCreationScreen;
