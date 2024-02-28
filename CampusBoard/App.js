import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from './screens/FeedScreen';
import PostCreationScreen from './screens/PostCreationScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomTabBar from './components/BottomTabBar';

const Tab = createBottomTabNavigator();

// We won't use Tab.Screen to define our tabs because we have a custom BottomTabBar
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
        {/* We define screens without specifying the `tabBar` because we use a custom one */}
        <Tab.Screen name="Home" component={FeedScreen} />
        <Tab.Screen name="Post" component={PostCreationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* Add other screens as needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
