import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../components/loading'; // Component to display while data is loading
import TrendingMoviesCarousel from '../components/trendingMovies'; // Carousel for displaying trending movies
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import MovieCategoryList from '../components/movieList'; // Component to list movies by category
import { fetchTrendingMovies, fetchUpcomingMovies, fetchTopRatedMovies } from '../api/moviedb'; // API calls for fetching movie data

// Determine if the current platform is iOS
const isIOS = Platform.OS === 'ios';

export default function HomeScreen() {
  // State variables to store movie data
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State variable to handle loading state
  const navigation = useNavigation(); // Hook to access navigation functions

  // UseEffect hook to fetch movie data when the component mounts
  useEffect(() => {
    fetchAllMovies(); // Fetch all types of movie data
  }, []);

  // Function to fetch trending, upcoming, and top-rated movies
  const fetchAllMovies = async () => {
    try {
      // Concurrently fetch all movie data
      await Promise.all([
        loadTrendingMovies(),
        loadUpcomingMovies(),
        loadTopRatedMovies()
      ]);
    } catch (error) {
      console.error('Error fetching movies:', error); // Log any errors that occur
      setIsLoading(false); // Set loading to false if there's an error
    }
  };

  // Function to fetch and set upcoming movies
  const loadUpcomingMovies = async () => {
    const movieData = await fetchUpcomingMovies();
    if (movieData && movieData.results) setUpcomingMovies(movieData.results);
  };

  // Function to fetch and set trending movies
  const loadTrendingMovies = async () => {
    const movieData = await fetchTrendingMovies();
    if (movieData && movieData.results) setTrendingMovies(movieData.results);
  };

  // Function to fetch and set top-rated movies
  const loadTopRatedMovies = async () => {
    const movieData = await fetchTopRatedMovies();
    if (movieData && movieData.results) setTopRatedMovies(movieData.results);
    setIsLoading(false); // Set loading to false once data is fetched
  };

  return (
    <View style={styles.container}>
      {/* SafeAreaView ensures content is displayed within the safe area of the device */}
      <SafeAreaView style={isIOS ? styles.safeAreaIOS : styles.safeAreaAndroid}>
        {/* StatusBar component to control the appearance of the status bar */}
        <StatusBar style="light" />
        <View style={styles.header}>
          {/* TouchableOpacity for opening the side drawer */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome6 name="bars" size={30} color="white" />
          </TouchableOpacity>
          {/* Application title with embedded icon */}
          <Text style={styles.title}>
            M<MaterialCommunityIcons name="movie-open" size={26} color='#f4d62f' />vieMarvels
          </Text>
          {/* TouchableOpacity for navigating to the search screen */}
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Entypo name="magnifying-glass" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ScrollView to handle vertical scrolling for the content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Welcome message section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to Movie Marvels!</Text>
          <Text style={styles.welcomeSubText}>Your one stop app for all movies. Let's get watching!</Text>
        </View>

        {/* Display loading screen if data is being fetched */}
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Carousel for trending movies */}
            {trendingMovies.length > 0 && <TrendingMoviesCarousel data={trendingMovies} />}
            
            {/* Horizontal list for upcoming movies */}
            <MovieCategoryList title="Upcoming Releases" data={upcomingMovies} screenName="UpcomingMovies" />
            
            {/* Horizontal list for top-rated movies */}
            <MovieCategoryList title="Top Rated" data={topRatedMovies} screenName="TopRatedMovies" />

            {/* Section for finding cinemas */}
            <View style={styles.findCinemaContainer}>
              <Text style={styles.findCinemaText}>Find a cinema near you:</Text>
              <TouchableOpacity 
                style={styles.cinemaButton} 
                onPress={() => navigation.navigate('Cinemas')}
              >
                <Text style={styles.cinemaButtonText}>Go to Cinemas</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Styles for different components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  safeAreaIOS: {
    marginBottom: 0,
  },
  safeAreaAndroid: {
    marginBottom: 5,
  },
  //Page header styling
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 5,
  },
  scrollContainer: {
    paddingBottom: 15,
  },
  //Page title styling
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  //Welcome container styling
  welcomeContainer: {
    padding: 15,
    backgroundColor: '#444', // Slightly lighter gray background for welcome section
    marginBottom: 20,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  //Welcome text styling
  welcomeText: {
    fontSize: 24, 
    color: 'white', 
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  welcomeSubText: {
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center', 
    marginTop: 5, 
  },
  // styling for the find cinema container
  findCinemaContainer: {
    padding: 15,
    backgroundColor: '#444', 
    marginBottom: 20, 
    borderRadius: 8, 
    marginHorizontal: 15, 
    alignItems: 'center', 
  },
  findCinemaText: {
    fontSize: 18, 
    color: 'white', 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  // Button style
  cinemaButton: {
    backgroundColor: '#555', 
    padding: 10, 
    borderRadius: 8, 
    width: '100%', 
    alignItems: 'center',
  },
  // Button text style
  cinemaButtonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});
