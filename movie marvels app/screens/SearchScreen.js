import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { View, Text, Dimensions, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/loading'; // Loader component for displaying a loading spinner
import { searchMovies, image185, fallbackMoviePoster } from '../api/moviedb'; // API functions for searching movies
import EvilIcons from '@expo/vector-icons/EvilIcons'; // Icon library
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get device dimensions for responsive design

// Main functional component for the movie search screen
export default function MovieSearchScreen() {
  const navigation = useNavigation(); // Hook to access navigation functions
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  // Function to perform the search based on user input
  const performSearch = value => {
    if (value && value.length > 2) { // Only perform search if input length is greater than 2
      setIsLoading(true); // Show loading spinner
      searchMovies({
        query: value, include_adult: 'false', language: 'en-US', page: '1'
      }).then(data => {
        setIsLoading(false); // Hide loading spinner
        if (data && data.results) setSearchResults(data.results); // Set search results
      });
    } else {
      setIsLoading(false); // Hide loading spinner if no input
      setSearchResults([]); // Clear search results
    }
  };

  // Debounced search function to limit API calls
  const debouncedSearch = useCallback(debounce(performSearch, 375), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          onChangeText={debouncedSearch}
          placeholder='Search Movies'
          placeholderTextColor={'lightgray'}
          style={styles.searchField}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.closeButton}
        >
          <EvilIcons name="close-o" size={25} color="white" />
        </TouchableOpacity>
      </View>
      {/* Display search results */}
      {isLoading ? (
        <Loader /> // Show loader while data is being fetched
      ) : (
        searchResults.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsWrapper}
          >
            <Text style={styles.resultsHeader}>Results ({searchResults.length})</Text>
            <View style={styles.resultsGrid}>
              {searchResults.map((item, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)} // Navigate to movie details
                >
                  <View style={styles.searchResultItem}>
                    <Image
                      source={{ uri: item?.poster_path ? image185(item.poster_path) : fallbackMoviePoster }}
                      style={styles.searchResultImage}
                    />
                    <Text style={styles.searchResultText}>
                      {item?.title?.length > 22 ? item.title.slice(0, 22) + '...' : item?.title} 
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noResultsWrapper}>
            <Image
              source={require('../assets/images/noMovie.png')}
              style={styles.noResultsImage}
              resizeMode="contain"
            />
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d2d2d', // Dark background color
  },
  searchWrapper: {
    marginHorizontal: 20, // Increased horizontal margin
    marginBottom: 16, // Increased bottom margin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#717171',
    borderWidth: 1,
    borderRadius: 25, // Adjusted border radius for a different shape
  },
  searchField: {
    paddingHorizontal: 20, // Increased padding for better touch area
    paddingVertical: 10, // Increased padding for better touch area
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  closeButton: {
    borderRadius: 25, // Adjusted border radius to match the search wrapper
    padding: 10, // Increased padding for better touch area
    backgroundColor: 'black',
    marginRight: 8, // Increased margin for spacing
  },
  resultsWrapper: {
    paddingHorizontal: 20, // Increased horizontal padding for better spacing
  },
  resultsHeader: {
    color: 'white',
    fontSize: 18, // Increased font size for better visibility
    fontWeight: 'bold',
    marginBottom: 10, // Increased bottom margin for spacing
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchResultItem: {
    width: width * 0.45, // Adjusted width for better spacing
    height: height * 0.32, // Adjusted height for better spacing
    marginBottom: 18, // Increased bottom margin for spacing
    position: 'relative',
  },
  searchResultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16, // Adjusted border radius for different shape
  },
  searchResultText: {
    position: 'absolute',
    bottom: 12, // Adjusted bottom position for text
    left: 8, // Adjusted left position for text
    right: 8, // Adjusted right position for text
    textAlign: 'center',
    color: 'white',
    fontSize: 14, // Increased font size for better readability
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 12, // Increased shadow radius for better visibility
  },
  noResultsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Increased horizontal padding for better spacing
  },
  noResultsImage: {
    width: width * 0.85, // Adjusted width for better scaling
    height: height * 0.45, // Adjusted height for better scaling
    resizeMode: 'contain',
  },
});
