import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Loader component to display a loading spinner and message
export default function Loader() {
  return (
    <View style={styles.container}>
      {/* ActivityIndicator component to show a spinning loader */}
      <ActivityIndicator size="large" color="yellow" />
      {/* Text component to show a loading message */}
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

// Styles for the Loader component
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 150, 
  },
  text: {
    marginTop: 16, // Adds space between the loader and text
    color: 'gray', 
    fontSize: 20, 
    fontWeight: 'bold', 
  },
});




