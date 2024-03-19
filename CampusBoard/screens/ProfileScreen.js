import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);

  // Determine which user's profile to show: current user or another user
  const userId = route.params?.userId || auth.currentUser?.uid;
  const isCurrentUserProfile = userId === auth.currentUser?.uid;

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserProfile({
            name: userData.name,
            profilePicUrl: userData.profileImageUrl || 'https://via.placeholder.com/150',
            // Here, you would also fetch the posts if they are stored in Firestore
            posts: [],
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) {
      getUserProfile();
    }
  }, [userId]);

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigation.replace('Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Function to handle follow action
  const handleFollow = () => {
    // Implement the logic to follow the user
    console.log(`Following ${userProfile.name}`);
    // Update state to reflect follow status (not shown here)
  };

  // If userProfile is null, you may want to return a loading indicator instead
  if (!userProfile) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
      </View>

      {/* Render user posts here */}
      
      {/* Only show the follow button if it's not the current user's profile */}
      {!isCurrentUserProfile && (
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.followButtonText}>AllyGator</Text>
        </TouchableOpacity>
      )}
      
      {/* Show the logout button only if it's the current user's profile */}
      {isCurrentUserProfile && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      )}
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
  followButton: {
    backgroundColor: 'green', // Use a color that suits your app's theme
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 18,
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
  // Add any other styles you need here
});

export default ProfileScreen;
