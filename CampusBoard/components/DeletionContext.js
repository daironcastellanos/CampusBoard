//DeleteContext.js

import React, { createContext, useContext } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { Alert } from 'react-native';

const DeletionContext = createContext();

export const useDeletion = () => useContext(DeletionContext);

export const DeletionProvider = ({ children }) => {
  const db = getFirestore();

  const deletePostOrEvent = async (id, type) => {
    try {
      const collectionName = type === 'post' ? 'posts' : 'events';
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      Alert.alert('Success', 'The item has been deleted.');
    } catch (error) {
      console.error('Failed to delete the item:', error);
      Alert.alert('Error', 'Failed to delete the item.');
    }
  };

  return (
    <DeletionContext.Provider value={{ deletePostOrEvent }}>
      {children}
    </DeletionContext.Provider>
  );
};
