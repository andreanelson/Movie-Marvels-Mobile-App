import axios from 'axios';

// Define API key and base URL
const API_KEY = '28c2bb981509a75b07063123589f8e56';
const baseApiUrl = 'https://api.themoviedb.org/3';


// Define specific API routes for movie-related data
const movieUpcomingEndPoint = `https://api.themoviedb.org/3/movie/upcoming?api_key=28c2bb981509a75b07063123589f8e56`;
const movieTrendingEndPoint = `https://api.themoviedb.org/3/trending/movie/day?api_key=28c2bb981509a75b07063123589f8e56`;
const movieTopRatedEndPoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=28c2bb981509a75b07063123589f8e56`;

// Function to generate dynamic endpoints for movie details, genres, and related data
const detailsMovieEndPoint = id=> `https://api.themoviedb.org/3/movie/${id}?api_key=28c2bb981509a75b07063123589f8e56`;
const genresEndPoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=28c2bb981509a75b07063123589f8e56`;
const moviesByGenresEndPoint = (genreId) => `https://api.themoviedb.org/3/discover/movie?api_key=28c2bb981509a75b07063123589f8e56&with_genres=${genreId}`;
const similarMovieEndPoint = id=> `https://api.themoviedb.org/3/movie/${id}/similar?api_key=28c2bb981509a75b07063123589f8e56`;
const creditsMovieEndPoint = id=> `https://api.themoviedb.org/3/movie/${id}/credits?api_key=28c2bb981509a75b07063123589f8e56`;
const searchMovieEndPoint = `https://api.themoviedb.org/3/search/movie?api_key=28c2bb981509a75b07063123589f8e56`;
const personMovieEndPoint = id=> `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=28c2bb981509a75b07063123589f8e56`;
const detailsPersonEndPoint = id=> `https://api.themoviedb.org/3/person/${id}?api_key=28c2bb981509a75b07063123589f8e56`;


// Fallback image URLs in case of missing images
export const fallbackMoviePoster = require('../assets/images/fallbackPoster.png');
export const fallbackPersonImage = require('../assets/images/fallbackPoster.png');

// Utility functions to construct image URLs with different sizes
export const image500 = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : fallbackMoviePoster;
export const image342 = (path) => path ? `https://image.tmdb.org/t/p/w342${path}` : fallbackMoviePoster;
export const image185 = (path) => path ? `https://image.tmdb.org/t/p/w185${path}` : fallbackMoviePoster;

// Function to perform a generic API request
const apiRequest = async (endpoint, params) => {
  try {
    const response = await axios.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('API call error: ', error.response?.data || error.message);
    return {};
  }
};

// Functions to fetch different types of movie data
export const fetchUpcomingMovies = () => {
  return apiRequest(movieUpcomingEndPoint);
};

export const fetchTrendingMovies = () => {
  return apiRequest(movieTrendingEndPoint);
};

export const fetchTopRatedMovies = () => {
  return apiRequest(movieTopRatedEndPoint);
};

// Function to fetch detailed information about a specific movie
export const fetchMovieDetails = id=>{
  return apiRequest(detailsMovieEndPoint(id));
};

// Functions to fetch genres and movies by genre
export const fetchGenres = () =>{
  return apiRequest(genresEndPoint);
};

export const fetchMoviesByGenre = (genreId) =>{
  return apiRequest(moviesByGenresEndPoint(genreId));
};

// Function to fetch movies similar to a specific movie
export const fetchSimilarMovies = id=>{
  return apiRequest(similarMovieEndPoint(id));
};

// Function to fetch the cast and crew of a specific movie
export const fetchMovieCredits = id=>{
  return apiRequest(creditsMovieEndPoint(id));
};

// Function to search for movies based on query parameters
export const searchMovies = params=>{
  return apiRequest(searchMovieEndPoint, params);
};

// Function to fetch movies associated with a specific person
export const fetchPersonMovies = id=>{
  return apiRequest(personMovieEndPoint(id));
};

// Function to fetch detailed information about a specific person
export const fetchPersonInfo = id=>{
  return apiRequest(detailsPersonEndPoint(id));
};



