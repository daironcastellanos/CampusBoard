import React from 'react';
import { View } from 'react-native'; 
import BottomTabBar from './components/BottomTabBar';

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <BottomTabBar />
    </View>
  );
}
