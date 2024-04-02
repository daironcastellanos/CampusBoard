import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import Post from '../components/Post';
import { Picker } from '@react-native-picker/picker';
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

      // Get the reference to the user's "follows" document
      const followsDocRef = doc(db, 'follows', currentUser.uid);
      const followsDocSnap = await getDoc(followsDocRef);

      // Check if the "follows" document exists
      if (!followsDocSnap.exists()) {
        console.log("Following list not found");
        return;
      }

       // Extract the list of followed user IDs
      const followingList = followsDocSnap.data().following || [];
      let postsList = [];
  
      for (const userId of followingList) {
        // Query posts collection for the current user ID
        const postsQuery = query(collection(db, 'posts'), where("userId", "==", userId));
        const querySnapshot = await getDocs(postsQuery);
        const userDocRef = doc(db, "users", userId); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef);

        // Check if the user document exists
        if (!userDocSnap.exists()) {
          console.log("User not found");
          continue;
        }

        // Extract user details
        const userData = userDocSnap.data(); 

        // Iterate over each post document
        querySnapshot.forEach((doc) => {
           // Create a post object with additional user details
          let post = { id: doc.id, ...doc.data(), userName: userData.name, userProfilePic: userData.profileImageUrl };
          // Filter posts based on the selected tag
          if (selectedTag === 'all' || post.tag === selectedTag) {
            postsList.push(post);
          }
        });
      }

      // Sort posts by createdAt timestamp in descending order
      postsList.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      
      // Update the state with the fetched posts
      setPosts(postsList);
    };
  
    fetchFollowingPosts();
  }, [selectedTag]);  // Re-fetch posts when the selected tag changes

  const renderPost = ({ item }) => (
    <Post
      userName={item.userName}
      userProfilePic={item.userProfilePic}
      postContent={item.content} // Ensure this matches your data structure
      imageUrl={item.imageUrl}
      createdAt={item.createdAt}
      tag={item.tag}
    
      />
    );
  };

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

// Styles for the component
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
