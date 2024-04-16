import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Keyboard,
  ScrollView
} from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const PostCreationScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('safety 🦺');
  const [image, setImage] = useState(null);
  const predefinedTags = ['all ✅', 'events 🎊', 'safety 🦺', 'homework 📚', 'party 🎉', 'sublease 🏠'];
  const [isEvent, setIsEvent] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleEventMode = useCallback(() => {
    setIsEvent((prevIsEvent) => !prevIsEvent);
  }, [isEvent]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === 'ios');
    setEventDate(currentDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storagePath = `events/${auth.currentUser.uid}/${Date.now()}`;
      const imageRef = ref(storage, storagePath);
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Ensure all fields are filled
    if (isEvent && (!eventName.trim() || !eventDescription.trim() || !eventLocation.trim())) {
      Alert.alert('Error', 'All event fields must be filled.');
      return;
    }

    // Convert the date to a Firebase timestamp
    const eventTimestamp = Timestamp.fromDate(eventDate);

    const eventData = {
      eventName: eventName.trim(),
      eventDescription: eventDescription.trim(),
      eventLocation: eventLocation.trim(),
      eventDate: eventTimestamp,
      imageUrl, // Will be empty string if no image was uploaded
      userId: auth.currentUser.uid,
      createdAt: Timestamp.now(), // Current time as Firebase timestamp
    };

    try {
      await addDoc(collection(db, 'events'), eventData);
      Alert.alert('Success', 'Event created successfully!');
      resetForm();
    } catch (error) {
      console.error("Error creating event: ", error);
      Alert.alert('Error', 'Could not create the event. Please try again later.');
    }
  };

  const resetForm = () => {
    setPostContent('');
    setSelectedTag(predefinedTags[0]);
    setImage(null);
    setIsEvent(false);
    setEventName('');
    setEventDescription('');
    setEventLocation('');
    setEventDate(new Date());
    Keyboard.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="What's happening?"
          multiline
          numberOfLines={4}
          onChangeText={setPostContent}
          value={postContent}
          returnKeyType="done"
          onSubmitEditing={resetForm}
        />
        <Picker
          selectedValue={selectedTag}
          onValueChange={(itemValue) => setSelectedTag(itemValue)}
          style={styles.picker}
        >
          {predefinedTags.map(tag => (
            <Picker.Item key={tag} label={tag} value={tag} />
          ))}
        </Picker>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Is this an event?</Text>
          <Switch
            onValueChange={toggleEventMode}
            value={isEvent}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEvent ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
        {isEvent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={eventName}
              onChangeText={setEventName}
              returnKeyType="done"
            />
            <TextInput
              style={styles.input}
              placeholder="Event Description"
              multiline
              numberOfLines={4}
              value={eventDescription}
              onChangeText={setEventDescription}
              returnKeyType="done"
            />
            <TextInput
              style={styles.input}
              placeholder="Event Location"
              value={eventLocation}
              onChangeText={setEventLocation}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text>Select Event Date & Time</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handlePostCreation}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#e1e1e1',
  },
  imagePickerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#e1e1e1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default PostCreationScreen;
