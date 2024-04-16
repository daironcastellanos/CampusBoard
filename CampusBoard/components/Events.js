import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Events = ({ id, eventName, eventDescription, eventLocation, eventDate, imageUrl }) => {
  // Function to handle bell icon press
  const handleBellPress = () => {
    Alert.alert(
      "Notification Set",
      "You will be notified 3 hours before the event starts.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  // Format the event date for display
  const displayDate = eventDate ? new Date(eventDate).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : "Date not available";

  // Handle opening event location in Google Maps
  const openLocation = () => {
    const encodedLocation = encodeURIComponent(eventLocation);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <TouchableOpacity onLongPress={() => alert('Long press detected')} style={styles.container}>
      <TouchableOpacity onPress={handleBellPress} style={styles.bellButton}>
        <MaterialIcons name="notifications" size={24} color="black" />
      </TouchableOpacity>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.eventName}>{eventName}</Text>
      <Text style={styles.eventDescription}>{eventDescription}</Text>
      <TouchableOpacity onPress={openLocation}>
        <Text style={styles.eventLocation}>{eventLocation}</Text>
      </TouchableOpacity>
      <Text style={styles.eventDate}>{displayDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  eventLocation: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
  bellButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 8,
  },
});

export default Events;
