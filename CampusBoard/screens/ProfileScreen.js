import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import Post from '../components/Post';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const userId = route.params?.userId || auth.currentUser?.uid;

  // Check if the profile belongs to the current user
  const isCurrentUserProfile = userId === auth.currentUser?.uid;

  useEffect(() => {
    const fetchProfileData = async () => {
      const userDocRef = doc(db, 'users', userId);
      const followsDocRef = doc(db, 'follows', auth.currentUser.uid);

      // Fetch user profile
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile({
            id: userId,
            name: userDocSnap.data().name,
            profilePicUrl: userDocSnap.data().profileImageUrl || 'https://via.placeholder.com/150',
          });
        }

        // Fetch follow status
        const followsDocSnap = await getDoc(followsDocRef);
        if (followsDocSnap.exists()) {
          const following = followsDocSnap.data().following || [];
          setIsFollowing(following.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      // Fetch user's posts
      const postsQuery = query(collection(db, 'posts'), where("userId", "==", userId));
      const querySnapshot = await getDocs(postsQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(fetchedPosts);
    };

    fetchProfileData();
  }, [userId]);

  const handleFollowToggle = async () => {
    // Follow/Unfollow logic
    // Note: Update your database accordingly
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Assuming you have a navigation reset or redirect after sign out
      navigation.navigate('Login'); // Update with your login route name
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
      {isCurrentUserProfile ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
          <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Post
            userName={userProfile.name}
            userProfilePic={userProfile.profilePicUrl}
            postContent={item.content}
            imageUrl={item.imageUrl}
            createdAt={item.createdAt}
            tag={item.tag}
          />
        )}
      />
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
