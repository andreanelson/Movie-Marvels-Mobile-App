import { View, Text, TouchableWithoutFeedback, Dimensions, Image, StyleSheet } from 'react-native';
import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { image500 } from '../api/moviedb'; // Function to get image URL
import { useNavigation } from '@react-navigation/native'; // Hook for navigation

const { width, height } = Dimensions.get('window'); // Get device dimensions

// Functional component to display a carousel of trending movies
export default function TrendingMoviesCarousel({ data }) {
  const navigation = useNavigation(); // Initialize navigation hook

  // Function to handle click on a movie poster
  const handlePosterClick = (item) => navigation.navigate('Movie', item);

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>Trending Movies</Text>
      <Carousel
        data={data} 
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handlePosterClick(item)}>
            <Image source={{ uri: image500(item.poster_path) }} style={styles.carouselPictures} />
          </TouchableWithoutFeedback>
        )}
        firstItem={1} // Set the second item to display
        sliderWidth={width} // Width of the carousel slider
        itemWidth={width * 0.6} // Width of each item in the carousel
        inactiveSlideScale={0.88} // Scale of inactive slides
        inactiveSlideOpacity={0.7} // Opacity of inactive slides
        slideStyle={styles.carouselSlide} // Style for each slide
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 16,
  },
  carouselTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    paddingBottom: 10,
  },
  carouselPictures: {
    width: width * 0.62,
    height: height * 0.4,
    borderRadius: 24,
  },
  carouselSlide: {
    alignItems: 'center',
  },
});

