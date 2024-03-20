//ProfileScreen.js 
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);

  // Determine which user's profile to show: current user or another user
  const userId = route.params?.userId || auth.currentUser?.uid;
  const isCurrentUserProfile = userId === auth.currentUser?.uid;

  console.log('ProfileScreen: userId is', userId); // Debugging log

  useEffect(() => {
    const getUserProfile = async () => {
      console.log('Getting user profile for userId:', userId); // Debugging log
      try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log('User data found:', userData); // Debugging log
          setUserProfile({
            id: userId,
            name: userData.name,
            profilePicUrl: userData.profileImageUrl || 'https://via.placeholder.com/150',
            posts: [], // Assuming posts will be populated later
          });
        } else {
          console.log('No such document exists!'); // Debugging log
        }
      } catch (error) {
        console.error("Error fetching user profile:", error); // Debugging log
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
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error); // Debugging log
    }
  };

  // Function to handle follow action
  const handleFollow = async (userIdToFollow) => {
    const currentUserId = auth.currentUser.uid;
    console.log('Current user:', currentUserId, 'following:', userIdToFollow); // Debugging log
    const followsDocRef = doc(db, 'follows', currentUserId);

    try {
      await setDoc(followsDocRef, {
        following: arrayUnion(userIdToFollow)
      }, { merge: true });
      console.log(`Now following user with ID: ${userIdToFollow}`); // Debugging log
    } catch (error) {
      console.error("Error following user:", error); // Debugging log
    }
  };

  // If userProfile is null, show a loading indicator
  if (!userProfile) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Main render
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
      </View>

      {/* Render user posts here */}

      {!isCurrentUserProfile && userProfile && (
        <TouchableOpacity 
          style={styles.followButton} 
          onPress={() => handleFollow(userProfile.id)}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      )}

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
