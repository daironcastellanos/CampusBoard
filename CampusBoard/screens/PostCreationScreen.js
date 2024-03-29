import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Image, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Picker } from '@react-native-picker/picker';

const PostCreationScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('safety');
  const [image, setImage] = useState(null);
  const predefinedTags = ["safety", "homework", "party", "sublease"];

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert('Error', 'Could not pick the image. Please try again later.');
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

      await addDoc(collection(db, 'posts'), {
        content: postContent,
        imageUrl, // Store the image URL in the Firestore document
        userId: auth.currentUser.uid, // Consistent field name
        createdAt: new Date(),
        tag: selectedTag, // Store the selected tag
      });

      Alert.alert('Success', 'Post created successfully!');
      setPostContent('');
      setSelectedTag(predefinedTags[0]); // Reset the selected tag
      setImage(null);
    } catch (error) {
      console.error("Error uploading post: ", error);
      Alert.alert('Error', 'Could not create the post. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an Image" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        multiline
        numberOfLines={4}
        onChangeText={setPostContent}
        value={postContent}
      />
      <Text style={styles.label}>Select a Tag:</Text>
      <Picker
        selectedValue={selectedTag}
        onValueChange={(itemValue) => setSelectedTag(itemValue)}
        style={styles.picker}
      >
        {predefinedTags.map((tag) => (
          <Picker.Item key={tag} label={tag} value={tag} />
        ))}
      </Picker>
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
  picker: {
    width: '100%',
    height: 50,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});

export default PostCreationScreen;
