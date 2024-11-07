import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown component
import { fetchGenres, fetchMoviesByGenre } from '../api/moviedb'; // Import API functions
import AntDesign from '@expo/vector-icons/AntDesign'; // Import icon for back button

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function GenresScreen() {
  const navigation = useNavigation(); // Hook for navigation
  const [genres, setGenres] = useState([]); // State to store genres
  const [selectedGenreId, setSelectedGenreId] = useState(null); // State to track selected genre ID
  const [movies, setMovies] = useState([]); // State to store movies

  // Fetch genres when the component mounts
  useEffect(() => {
    fetchGenres().then(data => setGenres(data.genres || []));
  }, []);

  // Handle genre selection
  const handleGenreSelect = async (genreId) => {
    setSelectedGenreId(genreId); // Update selected genre ID
    const moviesByGenre = await fetchMoviesByGenre(genreId); // Fetch movies for selected genre
    setMovies(moviesByGenre.results || []); // Update movies state
  };

  // Convert genres array to dropdown data format
  const dropdownData = genres.map(genre => ({ label: genre.name, value: genre.id }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="stepbackward" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Genres</Text>
      </View>

      {/* Dropdown for selecting genre */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={dropdownData}
        labelField="label"
        valueField="value"
        placeholder="Select Genre"
        value={selectedGenreId}
        onChange={item => handleGenreSelect(item.value)} // Handle genre selection
      />

      {/* Display list of movies if a genre is selected */}
      {selectedGenreId && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()} // Unique key for each movie item
          numColumns={2} // Display movies in two columns
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieItem}
              onPress={() => navigation.navigate('Movie', { id: item.id })} // Navigate to Movie screen with movie ID
            >
              <Image
                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : 'https://via.placeholder.com/185x278?text=No+Image' }}
                style={styles.movieImage}
              />
              <Text style={styles.movieTitle}>
                {item.title.length > 22 ? item.title.slice(0, 22) + '...' : item.title} {/* Truncate long titles */}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  dropdown: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingTop: 10,
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
