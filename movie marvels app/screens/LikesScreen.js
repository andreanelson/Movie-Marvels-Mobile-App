import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLikes } from '../components/LikesContext'; // Import custom hook for accessing liked movies and actors
import MovieCategoryList from '../components/movieList'; // Import component for displaying a list of movies by category

export default function LikesScreen() {
  // Use the custom hook to get the liked movies and actors
  const { likedMovies, likedActors } = useLikes();

  return (
    <ScrollView style={styles.container}>
      {/* Section for displaying liked movies */}
      <View style={styles.section}>
        <Text style={styles.title}>Liked Movies</Text>
        {/* Render the list of liked movies using MovieCategoryList component */}
        <MovieCategoryList title={'Liked Movies'} data={likedMovies} hideSeeAll={true} />
      </View>
      
      {/* Section for displaying liked actors */}
      <View style={styles.section}>
        <Text style={styles.title}>Liked Actors</Text>
        {/* Conditionally render liked actors */}
        {likedActors.length > 0 ? (
          // Map through likedActors array and render each actor
          likedActors.map((actor, index) => (
            <View key={index} style={styles.actorItem}>
              <Text style={styles.actorName}>{actor.name}</Text>
            </View>
          ))
        ) : (
          // Display message if no actors are liked
          <Text style={styles.noLikes}>No liked actors yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  actorItem: {
    marginBottom: 10,
  },
  actorName: {
    fontSize: 18,
    color: 'white',
  },
  noLikes: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
