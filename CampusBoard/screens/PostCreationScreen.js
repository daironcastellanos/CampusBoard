import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../firebaseConfig'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostCreationScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handlePostCreation = async () => {
    try {
      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      // Use the same field name 'userId' as in Firestore
      await addDoc(collection(db, 'posts'), {
        content: postContent,
        imageUrl, // Store the image URL in the Firestore document
        userId: auth.currentUser.uid, // Consistent field name
        createdAt: new Date()
      });
  
      Alert.alert('Success', 'Post created successfully!');
      setPostContent('');
      setImage(null);
    } catch (error) {
      console.error("Error uploading post: ", error);
      Alert.alert('Error', 'Could not create the post. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      <Button title="Pick an Image" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        multiline
        numberOfLines={4}
        onChangeText={setPostContent}
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
