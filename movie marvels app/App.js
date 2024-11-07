import React from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';
import { LikesProvider } from './components/LikesContext';
import AppNavigation from './appNavigation';

export default function App() {
  return (
    <LikesProvider>
      <AppNavigation />
    </LikesProvider>
  );
}

