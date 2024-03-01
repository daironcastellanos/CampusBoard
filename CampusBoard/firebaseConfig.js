// Import the functions you need from the SDKs you need
// firebaseConfig.js
import apiKey from './apiKey';

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore'; // Import for Firestore
import { getStorage } from 'firebase/storage'; // Import for Firebase Storage


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "campusboard-f628b.firebaseapp.com",
  projectId: "campusboard-f628b",
  storageBucket: "campusboard-f628b.appspot.com",
  messagingSenderId: "614554576520",
  appId: "1:614554576520:web:1151a19a5380003b71a13d",
  measurementId: "G-4PG790P72K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with React Native Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Exporting the initialized services
export { auth, db, storage };