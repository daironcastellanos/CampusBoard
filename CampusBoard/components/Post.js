import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Define your tag colors
const tagColors = {
  safety: 'red',
  homework: 'blue',
  party: 'green',
  sublease: 'orange',
  // Add more tags and their corresponding colors as needed
};

const Post = ({ userName, userProfilePic, postContent, imageUrl, createdAt, tag }) => {
  // Format the date/time for display
  const displayDate = new Date(createdAt.seconds * 1000).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Get the color for the tag
  const tagColor = tagColors[tag] || 'grey'; // Default color if the tag is not found

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userProfilePic }} style={styles.profilePic} />
        <Text style={styles.userName}>{userName}</Text>
        {tag && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            <View style={[styles.tagDot, { backgroundColor: tagColor }]} />
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
      </View>
      <Text style={styles.content}>{postContent}</Text>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.postImage} />}
      <Text style={styles.creationDate}>{displayDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  tagText: {
    color: '#000',
  },
  creationDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default Post;
