//ProfileScreen.js 
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc,updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const userId = route.params?.userId || auth.currentUser?.uid;
  const isCurrentUserProfile = userId === auth.currentUser?.uid;

  console.log('ProfileScreen: userId is', userId); // Debugging log

  useEffect(() => {
    const getUserProfileAndFollowStatus = async () => {
      const userDocRef = doc(db, 'users', userId);
      const followsDocRef = doc(db, 'follows', auth.currentUser.uid);

      try {
        const userDocSnap = await getDoc(userDocRef);
        const followsDocSnap = await getDoc(followsDocRef);

        if (userDocSnap.exists()) {
          setUserProfile({
            id: userId,
            name: userDocSnap.data().name,
            profilePicUrl: userDocSnap.data().profileImageUrl || 'https://via.placeholder.com/150',
          });
        }

        if (followsDocSnap.exists()) {
          const following = followsDocSnap.data().following || [];
          setIsFollowing(following.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserProfileAndFollowStatus();
  }, [userId]);

  const handleFollowToggle = async () => {
    const followsDocRef = doc(db, 'follows', auth.currentUser.uid);
    try {
      if (isFollowing) {
        // Unfollow the user
        await updateDoc(followsDocRef, {
          following: arrayRemove(userId)
        });
        setIsFollowing(false);
      } else {
        // Follow the user
        await updateDoc(followsDocRef, {
          following: arrayUnion(userId)
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!userProfile) {
    return <View style={styles.centered}><Text>Loading profile...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
      </View>

      {/* Conditional rendering for Follow/Unfollow button */}
      {!isCurrentUserProfile ? (
        <TouchableOpacity 
          style={styles.followButton} 
          onPress={handleFollowToggle}>
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleSignOut}>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Add any other styles you need here
});

export default ProfileScreen;
