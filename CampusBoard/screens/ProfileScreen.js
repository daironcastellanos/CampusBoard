import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import Post from '../components/Post';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const userId = route.params?.userId || auth.currentUser?.uid;
  const isCurrentUserProfile = userId === auth.currentUser?.uid;

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      checkFollowingStatus();
    }, [userId])
  );

  const checkFollowingStatus = async () => {
    const followsDocRef = doc(db, 'follows', auth.currentUser.uid);
    const followsDocSnap = await getDoc(followsDocRef);
    if (followsDocSnap.exists()) {
      const following = followsDocSnap.data().following || [];
      setIsFollowing(following.includes(userId));
    } else {
      setIsFollowing(false);
    }
  };

  const fetchProfileData = async () => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      setUserProfile({
        id: userId,
        name: userDocSnap.data().name,
        profilePicUrl: userDocSnap.data().profileImageUrl || 'https://via.placeholder.com/150',
      });
    }

    const postsQuery = query(collection(db, 'posts'), where("userId", "==", userId));
    const querySnapshot = await getDocs(postsQuery);
    setPosts(querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      userProfilePic: userDocSnap.data().profileImageUrl || 'https://via.placeholder.com/150'  // Include profile picture URL in each post
    })));
  };

  const handleFollowToggle = async () => {
    const followsDocRef = doc(db, 'follows', auth.currentUser.uid);
    const followsDocSnap = await getDoc(followsDocRef);

    const isCurrentlyFollowing = isFollowing;
    setIsFollowing(!isCurrentlyFollowing);

    if (isCurrentlyFollowing) {
      await updateDoc(followsDocRef, {
        following: arrayRemove(userId)
      });
    } else {
      if (followsDocSnap.exists()) {
        await updateDoc(followsDocRef, {
          following: arrayUnion(userId)
        });
      } else {
        await setDoc(followsDocRef, {
          following: [userId]
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!userProfile) {
    return <View style={styles.centered}><Text>Loading profile...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile.profilePicUrl }} style={styles.profilePic} />
        <Text style={styles.userName}>{userProfile.name}</Text>
        <TouchableOpacity
          style={isCurrentUserProfile ? styles.logoutButton : styles.followButton}
          onPress={isCurrentUserProfile ? handleSignOut : handleFollowToggle}
        >
          <Text style={styles.buttonText}>{isCurrentUserProfile ? 'Log Out' : isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Post {...item} />}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Posts</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderColor: '#cccccc',
    borderWidth: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  followButton: {
    backgroundColor: '#5cb85c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});

export default ProfileScreen;
