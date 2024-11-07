import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { fetchTopRatedMovies, image185, fallbackMoviePoster } from '../api/moviedb'; // Import API functions and image URLs

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function TopRatedMoviesScreen() {
  const navigation = useNavigation(); // Hook for navigation
  const [movies, setMovies] = useState([]); // State to store movies
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  // Fetch top-rated movies when the component mounts
  useEffect(() => {
    const getTopRatedMovies = async () => {
      const topRatedMovies = await fetchTopRatedMovies(); // Fetch movies from API
      setMovies(topRatedMovies.results); // Update movies state
      setIsLoading(false); // Set loading to false
    };

    getTopRatedMovies();
  }, []);

  // Show loading text while movies are being fetched
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="stepbackward" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Rated Movies</Text>
      </View>
      
      {/* FlatList to display movies in a grid */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()} // Unique key for each movie item
        numColumns={2} // Display movies in two columns
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => navigation.push('Movie', item)} // Navigate to Movie screen with movie details
          >
            <Image
              source={{ uri: item.poster_path ? image185(item.poster_path) : fallbackMoviePoster }} // Set image source
              style={styles.movieImage}
            />
            <Text style={styles.movieTitle}>
              {item.title.length > 22 ? item.title.slice(0, 22) + '...' : item.title} {/* Truncate long titles */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a', // Matches background color
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Optional border to separate header from content
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingTop: 10, // Adjusted to account for header height
  },
  movieItem: {
    width: width * 0.44, // Adjust width to fit screen
    margin: 8,
  },
  movieImage: {
    width: '100%',
    height: height * 0.3, // Adjust height for images
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});
