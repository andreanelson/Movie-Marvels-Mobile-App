import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Ensure this package is installed
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// API Key for Google Places API
const API_KEY = ' ' // Use your own API Key here

const CinemasScreen = () => {
  // State variables
  const [cinemas, setCinemas] = useState([]); // Stores list of cinemas
  const [region, setRegion] = useState({
    latitude: 37.78825 - 10, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.1, // Zoom level for latitude
    longitudeDelta: 0.1, // Zoom level for longitude
  });
  const [loading, setLoading] = useState(true); // Indicates loading state
  const [selectedLocation, setSelectedLocation] = useState(null); // Stores selected location details
  const [websiteLink, setWebsiteLink] = useState(''); // Stores website link of selected location
  const mapRef = useRef(null); // Reference to the MapView component
  const navigation = useNavigation(); // Hook for navigation

  // Fetch cinemas near the given latitude and longitude
  const fetchCinemas = async (lat, lng) => {
    try {
      // Fetch cinema data from Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=15000&type=movie_theater&key=${API_KEY}`
      );
      const data = await response.json();

      // Fetch detailed information for each cinema
      const cinemaDetails = await Promise.all(
        data.results.map(async (cinema) => {
          const details = await fetchPlaceDetails(cinema.place_id);
          return { ...cinema, website: details.website };
        })
      );
      setCinemas(cinemaDetails); // Update cinemas state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Fetch detailed place information based on place ID
  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.result && data.result.geometry && data.result.geometry.location) {
        return {
          location: data.result.geometry.location,
          website: data.result.website || 'No website available',
          name: data.result.name || 'No name available',
          address: data.result.formatted_address || 'No address available',
        };
      }
      throw new Error('Location data not found');
    } catch (error) {
      console.error('Error fetching place details:', error);
      return { website: 'No website available' }; // Default value for website
    }
  };

  // Get the user's current location and fetch cinemas around it
  useEffect(() => {
    const getLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get current location coordinates
      let { coords } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      });

      const { latitude, longitude } = coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.1, // Adjusted initial zoom level
        longitudeDelta: 0.1, // Adjusted initial zoom level
      });
      fetchCinemas(latitude, longitude); // Fetch cinemas around the current location
    };

    getLocation(); // Call function to get location on component mount
  }, []);

  // Handle selection of a place from the search bar
  const handlePlaceSelect = async (data, details = null) => {
    if (data.place_id) {
      const result = await fetchPlaceDetails(data.place_id);
      if (result) {
        const { location, website, name, address } = result;
        const { lat, lng } = location;

        // Update region to the selected place with zoom
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01, // Adjust zoom level
          longitudeDelta: 0.01, // Adjust zoom level
        };

        // Update state for region and selected location
        setRegion(newRegion);
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          name,
          address,
        });
        setWebsiteLink(website);

        // Animate map to the selected region
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        // Fetch cinemas around the new location
        fetchCinemas(lat, lng);
      } else {
        console.error('Details or location data is undefined', { data, details });
      }
    } else {
      console.error('Place ID not found', { data, details });
    }
  };

  // Zoom in the map view
  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 0.8,
      longitudeDelta: prevRegion.longitudeDelta * 0.8,
    }));
  };

  // Zoom out the map view
  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 1.2,
      longitudeDelta: prevRegion.longitudeDelta * 1.2,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Map</Text>
          <Text style={styles.smallTitle}>Let's Get Watching! Find a Cinema Near You Now</Text>
        </View>
      </View>
      {/* Show loading indicator while data is being fetched */}
      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <>
          {/* MapView component displaying cinemas and selected location */}
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
          >
            {cinemas.map((cinema) => (
              <Marker
                key={cinema.place_id}
                coordinate={{
                  latitude: cinema.geometry.location.lat,
                  longitude: cinema.geometry.location.lng,
                }}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{cinema.name}</Text>
                    <Text>{cinema.vicinity}</Text>
                    {cinema.website !== 'No website available' && (
                      <TouchableOpacity onPress={() => Linking.openURL(cinema.website)}>
                        <Text style={styles.calloutLink}>{cinema.website}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Callout>
              </Marker>
            ))}
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                pinColor="blue"
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{selectedLocation.name}</Text>
                    <Text>{selectedLocation.address}</Text>
                    {websiteLink !== 'No website available' && (
                      <TouchableOpacity onPress={() => Linking.openURL(websiteLink)}>
                        <Text style={styles.calloutLink}>{websiteLink}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Callout>
              </Marker>
            )}
          </MapView>
          {/* Search bar for finding places */}
          <GooglePlacesAutocomplete
            placeholder="Search for places"
            onPress={handlePlaceSelect}
            query={{
              key: API_KEY,
              language: 'en',
              types: 'establishment',
            }}
            styles={{
              container: {
                position: 'absolute',
                top: height * 0.2, // Move the search bar below the header
                width: width - 20, // Adding space on the sides
                left: 10, // Adding space from the left
                right: 10, // Adding space from the right
                zIndex: 1,
              },
              listView: {
                backgroundColor: 'white',
              },
            }}
          />
          {/* Zoom controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <AntDesign name="plus" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <AntDesign name="minus" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333', 
  },
  backButton: {
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    height: height*0.08,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', 
  },
  smallTitle: {
    fontSize: 14,
    color: 'white', 
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    color: 'gray', // Gray color for callout title
  },
  calloutLink: {
    color: 'blue', 
  },
  zoomControls: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    flexDirection: 'row',
  },
  zoomButton: {
    backgroundColor: '#333', // Gray background for zoom buttons
    padding: 10,
    borderRadius: 50,
    margin: 5,
  },
});

export default CinemasScreen;
