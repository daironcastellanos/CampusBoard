import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import Post from '../components/Post';
import { Picker } from '@react-native-picker/picker'; // Ensure this import is correct
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const FeedScreen = () => {
  // State variables
  const [posts, setPosts] = useState([]);// Stores the list of posts
  const [selectedTag, setSelectedTag] = useState('all'); // Stores the currently selected tag
  
  // Predefined tags for filtering posts
  const predefinedTags = ['all', 'safety', 'homework', 'party', 'sublease']; // Example tags

  useEffect(() => {
    // Function to fetch posts from the Firestore database
    const fetchFollowingPosts = async () => {
      const db = getFirestore();
      const currentUser = auth.currentUser;

      // Check if a user is logged in
      if (!currentUser) {
        console.log("No user logged in");
        return;
      }
  
      const followsDocRef = doc(db, 'follows', currentUser.uid);
      const followsDocSnap = await getDoc(followsDocRef);
  
      if (!followsDocSnap.exists()) {
        console.log("Following list not found");
        return;
      }
  
      const followingList = followsDocSnap.data().following || [];
      let postsList = [];
  
      // Fetch posts
      for (const userId of followingList) {
        const postsQuery = query(collection(db, 'posts'), where("userId", "==", userId));
        const querySnapshot = await getDocs(postsQuery);
        const userDocRef = doc(db, "users", userId); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef);
  
        if (!userDocSnap.exists()) {
          console.log("User not found");
          continue; // Skip this iteration if the user details are not found
        }
        
        const userData = userDocSnap.data(); // Extract user details
  
        querySnapshot.forEach((doc) => {
          let post = { id: doc.id, ...doc.data(), userName: userData.name, userProfilePic: userData.profileImageUrl };
          if (selectedTag === 'all' || post.tag === selectedTag) {
            postsList.push(post);
          }
        });
      }
  
      postsList.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setPosts(postsList);
    };
  
    fetchFollowingPosts();
  }, [selectedTag]);

  const renderPost = ({ item }) => (
    <Post
      userName={item.userName}
      userProfilePic={item.userProfilePic}
      postContent={item.content}
      imageUrl={item.imageUrl}
      createdAt={item.createdAt}
    />
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedTag}
        onValueChange={(itemValue, itemIndex) => setSelectedTag(itemValue)}
        style={styles.picker}>
        {predefinedTags.map((tag) => (
          <Picker.Item key={tag} label={tag} value={tag} />
        ))}
      </Picker>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
});

export default FeedScreen;
