import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import Post from '../components/Post';
import Events from '../components/Events';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const FeedScreen = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [error, setError] = useState(null);
  const predefinedTags = ['all ✅', 'events 🎊', 'safety 🦺', 'homework 📚', 'party 🎉', 'sublease 🏠'];

  useEffect(() => {
    const fetchFeedItems = async () => {
      setIsLoading(true);
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Authentication error: No user logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.reduce((acc, doc) => ({
          ...acc,
          [doc.id]: { userName: doc.data().name, userProfilePic: doc.data().profileImageUrl || '' }
        }), {});

        const postsSnapshot = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
        const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('createdAt', 'desc')));

        const postsList = postsSnapshot.docs.map(doc => ({
          type: 'post',
          ...doc.data(),
          id: doc.id,
          userName: users[doc.data().userId]?.userName || 'Unknown User',
          userProfilePic: users[doc.data().userId]?.userProfilePic,
        }));

        const eventsList = eventsSnapshot.docs.map(doc => ({
          type: 'event',
          ...doc.data(),
          id: doc.id,
          userName: users[doc.data().userId]?.userName || 'Unknown User',
          userProfilePic: users[doc.data().userId]?.userProfilePic,
          eventDate: doc.data().eventDate.toDate(), // Ensure date is converted from Firestore Timestamp to JavaScript Date object
        }));

        let combinedList = [...postsList, ...eventsList].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        setFeedItems(combinedList);
      } catch (error) {
        console.error("Error fetching feed items:", error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedItems();
  }, [selectedTag]);

  const renderFeedItem = ({ item }) => {
    if (item.type === 'post') {
      return <Post {...item} />;
    } else if (item.type === 'event') {
      return <Events {...item} />;
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <View style={styles.centeredContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagContainer}>
        {predefinedTags.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTag === tag && styles.tagSelected]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={feedItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderFeedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    width: 100, // Ensuring a fixed width
    height: 40, // Ensuring a fixed height
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#000',
  },
  tagText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default FeedScreen;
