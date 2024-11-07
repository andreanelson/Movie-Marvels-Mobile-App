import React, { createContext, useState, useContext } from 'react';

// Create a Context for managing liked movies and actors
const LikesContext = createContext();

// Custom hook to use the LikesContext
export function useLikes() {
  return useContext(LikesContext);
}

// Provider component to wrap around parts of the app that need access to liked items
export function LikesProvider({ children }) {
  // State to hold liked movies and actors
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedActors, setLikedActors] = useState([]);

  // Function to add a movie to the list of liked movies
  const addLikedMovie = (movie) => {
    setLikedMovies((prevMovies) => [...prevMovies, movie]);
  };

  // Function to add an actor to the list of liked actors
  const addLikedActor = (actor) => {
    setLikedActors((prevActors) => [...prevActors, actor]);
  };

  // Provide the context values to children components
  return (
    <LikesContext.Provider value={{ likedMovies, likedActors, addLikedMovie, addLikedActor }}>
      {children}
    </LikesContext.Provider>
  );
}
