import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/loading'; // Loading spinner component
import { useNavigation, useRoute } from '@react-navigation/native'; // Navigation and route hooks
import Entypo from '@expo/vector-icons/Entypo'; // Icons for the like button
import AntDesign from '@expo/vector-icons/AntDesign'; // Icons for navigation buttons
import MovieCategoryList from '../components/movieList'; // Component for displaying movie lists
import { fetchPersonInfo, fetchPersonMovies, image342, fallbackPersonImage } from '../api/moviedb'; // API functions and image handling
import { useLikes } from '../components/LikesContext'; // Context for managing liked actors

const { width, height } = Dimensions.get('window'); // Get device dimensions
const isIOS = Platform.OS === 'ios'; // Check if platform is iOS
const verticalSpacing = isIOS ? {} : { marginVertical: 10 }; // Adjust spacing based on platform

export default function PersonProfileScreen() {
  const route = useRoute(); // Get route parameters
  const { id } = route.params; // Extract ID from route params
  const navigation = useNavigation(); // Navigation hook
  const [isFavourited, setIsFavourited] = useState(false); // State to manage like status
  const { addLikedActor } = useLikes(); // Function to add liked actor to context
  const [films, setFilms] = useState([]); // State to store films
  const [profile, setProfile] = useState({}); // State to store profile details
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  // Fetch profile and films details on component mount or ID change
  useEffect(() => {
    setIsLoading(true);
    fetchProfileDetails(id);
    fetchProfileFilms(id);
  }, [id]);

  // Fetch and set profile details
  const fetchProfileDetails = async (id) => {
    const details = await fetchPersonInfo(id);
    if (details) setProfile(details);
    setIsLoading(false);
  };

  // Fetch and set profile films
  const fetchProfileFilms = async (id) => {
    const filmsData = await fetchPersonMovies(id);
    if (filmsData && filmsData.cast) setFilms(filmsData.cast);
    setIsLoading(false);
  };

  // Handle adding/removing the actor from liked list
  const handleLike = () => {
    addLikedActor(profile);
    setIsFavourited(!isFavourited);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Creating the Navigation buttons */}
      <SafeAreaView style={[styles.safeArea, verticalSpacing]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.backButton]}>
          <AntDesign name="stepbackward" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
          <AntDesign name="home" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Loading the Profile details */}
      {isLoading ? (
        <Loader />
      ) : (
        <View>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: image342(profile?.profile_path) || fallbackPersonImage }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{profile?.name}</Text>
            <Text style={styles.profileLocation}>{profile?.place_of_birth}</Text>
          </View>

          {/* Like Button below the profile name */}
          <View style={styles.likeButtonContainer}>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <Entypo name="heart" size={35} color={isFavourited ? 'red' : 'white'} />
            </TouchableOpacity>
          </View>
          {/* Displaying all the actor proifle information */}
          <View style={styles.profileInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profile?.gender === 1 ? 'Female' : 'Male'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Birthday</Text>
              <Text style={styles.infoValue}>{profile?.birthday}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Known for</Text>
              <Text style={styles.infoValue}>{profile?.known_for_department}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Popularity</Text>
              <Text style={styles.infoValue}>{profile?.popularity?.toFixed(3)}%</Text>
            </View>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>Biography</Text>
            <Text style={styles.bioText}>{profile?.biography || 'N/A'}</Text>
          </View>
          {/* Films */}
          <MovieCategoryList title={'Films'} hideSeeAll={true} data={films} />
        </View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', 
  },
  safeArea: {
    zIndex: 20, // Ensure the safe area view stays above other elements
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-between', // Space buttons evenly
    alignItems: 'center', // Center align buttons vertically
    paddingHorizontal: 16, 
  },
  button: {
    padding: 8, 
    borderRadius: 10, 
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background for back button
  },
  profileImageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center', 
    shadowColor: 'gray', // Shadow color for profile image
    shadowRadius: 40, // Shadow blur radius
    shadowOffset: { width: 0, height: 5 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
  },
  profileImage: {
    height: height * 0.43, 
    width: width * 0.74, 
    borderRadius: height * 0.36, // Round profile image
    overflow: 'hidden', // Ensure the image stays within the border radius
    borderWidth: 1, // Border width around the image
    borderColor: '#5b5b5b', 
  },
  profileNameContainer: {
    alignItems: 'center', // Center align profile name and location
    marginTop: 20, // Space above the profile name container
  },
  profileName: {
    fontSize: 24, 
    color: 'white', 
  },
  profileLocation: {
    fontSize: 16, 
    color: '#9ca3af', 
  },
  profileInfo: {
    marginTop: 20, // Space above profile information section
    marginHorizontal: 20, // Horizontal margins for profile information
  },
  infoItem: {
    marginVertical: 5, // Vertical margin between info items
  },
  infoLabel: {
    fontSize: 14, 
    color: '#9ca3af', 
  },
  infoValue: {
    fontSize: 16, 
    color: 'white', 
  },
  bioContainer: {
    marginTop: 20, // Space above biography section
    marginHorizontal: 20, // Horizontal margins for biography section
  },
  bioTitle: {
    fontSize: 18, 
    color: 'white', 
    marginBottom: 10, // Space below biography title
  },
  bioText: {
    fontSize: 16, 
    color: 'white', 
  },
  likeButtonContainer: {
    alignItems: 'center', // Center align like button
    marginVertical: 10, // Vertical margin for like button
  },
  likeButton: {
    padding: 4, // Padding for like button
  },
});
