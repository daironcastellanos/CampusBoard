import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import Post from '../components/Post';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig'; // Make sure you import auth correctly

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("No user logged in");
        return;
      }

      // Fetch the following list for the current user
      const followsDocRef = doc(db, 'follows', currentUser.uid);
      const followsDocSnap = await getDoc(followsDocRef);

      if (!followsDocSnap.exists()) {
        console.log("Following list not found");
        return;
      }

      const followingList = followsDocSnap.data().following || [];
      const postsList = [];

      // Fetch posts for each following user
for (const userId of followingList) {
  const userPostsRef = collection(db, 'posts');
  const userPostsSnapshot = await getDocs(userPostsRef);
  userPostsSnapshot.forEach((doc) => {
    if (doc.data().userId === userId) {
      postsList.push({
        id: doc.id,
        ...doc.data(),
      });
    }
  });
}

// Sort posts by createdAt timestamp, assuming it's stored as a Firestore Timestamp
// Convert Firestore Timestamp to JavaScript Date if necessary
postsList.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      // Fetch user details for each post in parallel
      const postsWithUserDetails = await Promise.all(postsList.map(async (post) => {
        const userRef = doc(db, 'users', post.userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          return {
            ...post,
            userName: userData.name || 'Anonymous',
            userProfilePic: userData.profileImageUrl || 'default-profile-pic-url',
          };
        }

        return post;
      }));

      setPosts(postsWithUserDetails);
    };

    fetchFollowingPosts();
  }, []);

  const renderPost = ({ item }) => (
    <Post
      userName={item.userName}
      userProfilePic={item.userProfilePic}
      postContent={item.content}
      imageUrl={item.imageUrl}
    />
  );

  return (
    <View style={styles.container}>
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
