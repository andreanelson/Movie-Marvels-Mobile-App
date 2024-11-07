import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { image185, fallbackPersonImage } from '../api/moviedb';

// CastList component to display a horizontal list of cast members
export default function CastList({ cast, navigation }) {
  return (
    <View style={styles.container}>
      {/* Title for the cast list section */}
      <Text style={styles.title}>Cast Members</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {cast && cast.map((actor, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actorContainer}
            onPress={() => navigation.navigate('Person', { id: actor.id })}
          >
            {/* Image of the actor */}
            <Image 
              style={styles.actorImage}
              source={{uri: image185(actor?.profile_path) || fallbackPersonImage }}
            />
            {/* Text showing the character name the actor played */}
            <Text style={styles.characterName}>
              {actor?.character.length > 11 ? actor?.character.slice(0, 11) + '...' : actor?.character}
            </Text>
            {/* Text showing the actor's name */}
            <Text style={styles.actorName}>
              {actor?.original_name.length > 11 ? actor?.original_name.slice(0, 11) + '...' : actor?.original_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Styles for the CastList component
const styles = StyleSheet.create({
  container: {
    marginVertical: 23, // Adjusted vertical margin for the container
  },
  title: {
    color: 'white',
    fontSize: 20, // Increased font size for the title
    marginLeft: 12, // Adjusted left margin
    marginBottom: 10, // Adjusted bottom margin
  },
  scrollView: {
    paddingHorizontal: 12, // Adjusted horizontal padding
  },
  actorContainer: {
    marginRight: 14, // Adjusted right margin
    alignItems: 'center',
  },
  actorImage: {
    borderRadius: 14, // Adjusted border radius for the image
    height: 100, // Increased height for the image
    width: 85, // Adjusted width for the image
  },
  characterName: {
    color: 'white',
    fontSize: 14, // Increased font size for character name
    marginTop: 6, // Adjusted top margin
  },
  actorName: {
    color: '#9ca3af',
    fontSize: 14, // Increased font size for actor name
    marginTop: 6, // Adjusted top margin
  },
});
