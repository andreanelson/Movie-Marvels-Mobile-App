import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SimilarMoviesList from '../components/movieList'; // Import component for displaying similar movies
import Loader from '../components/loading'; // Import loader component for showing loading state
import AntDesign from '@expo/vector-icons/AntDesign'; // Import AntDesign icon set
import Entypo from '@expo/vector-icons/Entypo'; // Import Entypo icon set
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for gradient effect
import CastList from '../components/cast'; // Import component for displaying cast list
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, image500, fallbackMoviePoster } from '../api/moviedb'; // Import API functions for fetching movie data
import { useLikes } from '../components/LikesContext'; // Import context for managing liked movies

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios'; // Determine if platform is iOS
const marginTopAdjust = isIOS ? {} : { marginTop: 12 }; // Adjust margin for non-iOS devices

export default function MovieScreen() {
  // Get movie data from route parameters
  const { params: movie } = useRoute();
  const [castMembers, setCastMembers] = useState([]); // State for storing cast members
  const [movieDetails, setMovieDetails] = useState({}); // State for storing movie details
  const [relatedMovies, setRelatedMovies] = useState([]); // State for storing similar movies
  const { addLikedMovie } = useLikes(); // Context function for adding liked movies
  const [isFavorite, setIsFavorite] = useState(false); // State for managing favorite status
  const [loading, setLoading] = useState(false); // State for managing loading state
  const navigation = useNavigation(); // Hook for navigation

  // Fetch movie data when component mounts or movie changes
  useEffect(() => {
    setLoading(true);
    fetchDetails(movie.id);
    fetchSimilar(movie.id);
    fetchCredits(movie.id);
  }, [movie]);

  // Fetch movie details
  const fetchDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovieDetails(data);
    setLoading(false);
  };

  // Fetch similar movies
  const fetchSimilar = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setRelatedMovies(data.results);
  };

  // Fetch cast credits
  const fetchCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCastMembers(data.cast);
  };

  // Handle adding/removing movie from favorites
  const handleLike = () => {
    addLikedMovie(movieDetails);
    setIsFavorite(!isFavorite); // Toggle favorite status
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Poster section with gradient overlay */}
      <View style={styles.posterSection}>
        <SafeAreaView style={[styles.safeAreaView, marginTopAdjust]}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="stepbackward" size={28} color="black" />
          </TouchableOpacity>
          {/* Home button */}
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
            <AntDesign name="home" size={30} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loader /> // Show loading component while fetching data
        ) : (
          <View>
            {/* Movie poster image */}
            <Image
              source={{ uri: image500(movieDetails?.poster_path) || fallbackMoviePoster }}
              style={styles.posterImage}
            />
            {/* Gradient overlay for poster */}
            <LinearGradient
              colors={['transparent', 'rgba(24,24,24,0.6)', 'rgba(24,24,24,0.9)']}
              style={styles.gradientOverlay}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>
      <View style={styles.detailsSection}>
        {/* Movie title */}
        <Text style={styles.title}>{movieDetails?.title}</Text>
        {movieDetails?.id && (
          <Text style={styles.info}>
            {movieDetails?.status} • {movieDetails?.release_date?.split('-')[0]} • {movieDetails?.runtime} min
          </Text>
        )}
        {/* Movie genres */}
        <View style={styles.genreList}>
          {movieDetails?.genres?.map((genre, index) => (
            <Text key={index} style={styles.genreText}>
              {genre?.name}{index + 1 !== movieDetails.genres.length ? " •" : null}
            </Text>
          ))}
        </View>
        {/* Movie overview */}
        <Text style={styles.overview}>{movieDetails?.overview}</Text>
      </View>

      {/* Like button section */}
      <View style={styles.likeSection}>
        <Text style={styles.likeLabel}>Add this movie to likes:</Text>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Entypo name="heart" size={35} color={isFavorite ? "red" : "white"} />
        </TouchableOpacity>
      </View>

      {/* Cast list */}
      <CastList cast={castMembers} navigation={navigation} />
      {/* Similar movies list */}
      <SimilarMoviesList title="Similar Movies" hideSeeAllButton={true} data={relatedMovies} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25, // Adjusted padding for bottom spacing
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
  },
  posterSection: {
    width: '100%',
  },
  safeAreaView: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly more opaque
    borderRadius: 12, 
    padding: 8, 
  },
  button: {
    padding: 8, 
    borderRadius: 12, 
  },
  posterImage: {
    width: width,
    height: height * 0.6, // Increased height for better visibility
  },
  gradientOverlay: {
    width: width,
    height: height * 0.45, // Increased height for better gradient effect
    position: 'absolute',
    bottom: 0,
  },
  detailsSection: {
    marginTop: -(height * 0.08), // Adjusted margin for better spacing
    paddingHorizontal: 20, // Increased padding for better spacing
    marginBottom: 25, // Increased bottom margin
  },
  title: {
    color: 'white',
    fontSize: 26, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 17, 
    textAlign: 'center',
  },
  genreList: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12, 
  },
  genreText: {
    color: '#9ca3af',
    fontSize: 17, 
    marginHorizontal: 6, 
  },
  overview: {
    color: '#9ca3af',
    paddingHorizontal: 20, // Increased padding for better readability
    lineHeight: 24, // Increased line height for readability
  },
  likeSection: {
    alignItems: 'center',
    marginVertical: 25, // Increased vertical margin
  },
  likeLabel: {
    color: 'white',
    fontSize: 19, // Increased font size
    marginBottom: 12, // Increased bottom margin
  },
  likeButton: {
    padding: 8, 
  },
});
