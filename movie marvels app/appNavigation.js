// appNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import MovieScreen from './Screens/MovieScreen';
import PersonProfileScreen from './Screens/PersonScreen';
import MovieSearchScreen from './Screens/SearchScreen';
import UpcomingMoviesScreen from './Screens/UpcomingMoviesScreen';
import TopRatedMoviesScreen from './Screens/TopRatedMoviesScreen';
import CinemasScreen from './Screens/CinemasScreen';
import DrawerNavigator from './components/sidePanel'; // Ensure the path is correct

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Main drawer navigator */}
        <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
        
        {/* Screens for the stack navigator */}
        <Stack.Screen name="Movie" options={{ headerShown: false }} component={MovieScreen} />
        <Stack.Screen name="Person" options={{ headerShown: false }} component={PersonProfileScreen} />
        <Stack.Screen name="Search" options={{ headerShown: false }} component={MovieSearchScreen} />
        <Stack.Screen name="UpcomingMovies" options={{ headerShown: false }} component={UpcomingMoviesScreen} />
        <Stack.Screen name="TopRatedMovies" options={{ headerShown: false }} component={TopRatedMoviesScreen} />
        <Stack.Screen name="Cinemas" options={{ headerShown: false }} component={CinemasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
