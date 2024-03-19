import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import Post from '../components/Post'; // Ensure this path is correct
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const db = getFirestore();
      const postsCol = collection(db, 'posts');
      const postSnapshot = await getDocs(postsCol);
      const postsList = await Promise.all(postSnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        let userProfilePic = 'default-profile-pic-url'; // Default profile picture
        let userName = 'Anonymous'; // Default user name
        
        // Fetch user data if userId is present in post data
        if (postData.userId) {
          const userRef = doc(db, 'users', postData.userId);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            userName = userData.name || userName; // Use user name if available
            userProfilePic = userData.profileImageUrl || userProfilePic; // Use profile image if available
          }
        }
        
        // Return combined post and user data
        return {
          id: postDoc.id,
          content: postData.content,
          imageUrl: postData.imageUrl, // Assuming your post might contain an image URL
          userName,
          userProfilePic,
        };
      }));
      
      setPosts(postsList);
    };

    fetchPostsAndUsers();
  }, []);

  const renderPost = ({ item }) => (
    <Post
      userName={item.userName}
      userProfilePic={item.userProfilePic}
      postContent={item.content}
      imageUrl={item.imageUrl} // Pass the imageUrl prop here
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
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
  post: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default FeedScreen;
