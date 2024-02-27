import React from 'react';
import { View } from 'react-native'; 
import BottomTabBar from './components/BottomTabBar';
import PostCreationScreen from './screens/PostCreationScreen';

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <PostCreationScreen />
    </View>
  );
}
