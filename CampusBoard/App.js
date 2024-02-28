import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from './screens/FeedScreen';
import PostCreationScreen from './screens/PostCreationScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="CreatePost" component={PostCreationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
