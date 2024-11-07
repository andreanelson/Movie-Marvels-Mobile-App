// Import necessary modules and components
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../Screens/HomeScreen';
import UpcomingMoviesScreen from '../Screens/UpcomingMoviesScreen';
import TopRatedMoviesScreen from '../Screens/TopRatedMoviesScreen';
import MovieSearchScreen from '../Screens/SearchScreen';
import PersonProfileScreen from '../Screens/PersonScreen';
import GenresScreen from '../Screens/GenresScreen';
import CinemasScreen from '../Screens/CinemasScreen';

// Create a Drawer Navigator
const Drawer = createDrawerNavigator();

// Define the Drawer Navigator component
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // Hide the header for all screens in the drawer
        drawerStyle: {
          backgroundColor: '#4e4e4f', // Set background color for the drawer
        },
        drawerContentStyle: {
          backgroundColor: '#4e4e4f', // Ensure content background matches the drawer
        },
        drawerLabelStyle: {
          fontSize: 18, // Set font size for drawer labels
          color: '#f5f5f5', // Set font color for drawer labels
        },
      }}
    >
      {/* Define each screen in the drawer navigator */}
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Search" component={MovieSearchScreen} />
      <Drawer.Screen name="Upcoming Movies" component={UpcomingMoviesScreen} />
      <Drawer.Screen name="Top Rated Movies" component={TopRatedMoviesScreen} />
      <Drawer.Screen name="Genres" component={GenresScreen} />
      <Drawer.Screen name="Cinemas" component={CinemasScreen} />
      <Drawer.Screen name="Likes" component={PersonProfileScreen} />
    </Drawer.Navigator>
  );
}

// Export the Drawer Navigator component
export default DrawerNavigator;
