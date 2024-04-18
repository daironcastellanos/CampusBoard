import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Post from '../components/Post';
import Events from '../components/Events';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const FeedScreen = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [error, setError] = useState(null);
  const predefinedTags = ['all ✅', 'events 🎊', 'safety 🦺', 'homework 📚', 'party 🎉', 'sublease 🏠'];

  const fetchFeedItems = useCallback(async () => {
    setIsLoading(true);
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("Authentication error: No user logged in.");
      setIsLoading(false);
      return;
    }

    try {
      const postsSnapshot = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('createdAt', 'desc')));
      const users = {};

      // Deduplicate user fetching
      const userIds = new Set([...postsSnapshot.docs, ...eventsSnapshot.docs].map(doc => doc.data().userId));
      await Promise.all(Array.from(userIds).map(userId => 
        getDoc(doc(db, 'users', userId)).then(userDoc => {
          users[userId] = userDoc.exists() ? {
            userName: userDoc.data().name,
            userProfilePic: userDoc.data().profileImageUrl || ''
          } : { userName: 'Unknown User', userProfilePic: '' };
        })
      ));

      const postsList = postsSnapshot.docs.map(doc => ({
        type: 'post',
        ...doc.data(),
        id: doc.id,
        ...users[doc.data().userId]
      }));

      const eventsList = eventsSnapshot.docs.map(doc => ({
        type: 'event',
        ...doc.data(),
        id: doc.id,
        ...users[doc.data().userId],
        eventDate: doc.data().eventDate ? new Date(doc.data().eventDate.seconds * 1000) : 'Invalid Date'
      }));

      setFeedItems([...postsList, ...eventsList].filter(item => selectedTag === 'all' || item.tag === selectedTag || (selectedTag === 'events 🎊' && item.type === 'event')).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    } catch (error) {
      console.error("Error fetching feed items:", error);
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedTag]); // dependency on selectedTag

  useEffect(() => {
    fetchFeedItems();
  }, [fetchFeedItems]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchFeedItems();
  };

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
        renderItem={({ item }) => item.type === 'post' ? <Post {...item} /> : <Events {...item} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#000',
  },
  tagText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
