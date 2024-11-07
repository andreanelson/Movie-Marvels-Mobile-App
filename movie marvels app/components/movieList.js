import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { image185, fallbackMoviePoster } from '../api/moviedb'; // Utility functions for image URLs

const { width, height } = Dimensions.get('window'); // Device dimensions
// Component to display a horizontal list of movie categories
export default function MovieCategoryList({ title, data, seeAllHide, screenName }) {
  const navigation = useNavigation(); // Navigation hook

  return (
    <View style={styles.listContainer}>
      {/* Movie category header */}
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {!seeAllHide && (
          <TouchableOpacity onPress={() => navigation.navigate(screenName)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Scrollable movie cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {data.map((item, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => navigation.push('Movie', item)}>
            <View style={styles.movieCard}>
              <Image source={{uri: image185(item.poster_path) || fallbackMoviePoster}} style={styles.moviePoster} />
              <Text style={styles.movieTitle}>
                {item.title ? (item.title.length > 15 ? item.title.slice(0, 15) + '...' : item.title) : 'No Title'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 32,
    marginHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    color: 'white',
    fontSize: 24,
  },
  seeAllText: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    paddingHorizontal: 15,
  },
  movieCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  moviePoster: {
    width: width * 0.33,
    height: height * 0.22,
    borderRadius: 24,
  },
  movieTitle: {
    color: '#D1D5DB',
    marginTop: 4,
  },
});


