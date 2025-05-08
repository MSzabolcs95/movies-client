import axios from 'axios';

const API_BASE_URL = 'https://localhost:7056/api/movies';

export const getNowPlayingMovies = async (pageNumber = 1) => {
    const response = await axios.get(`${API_BASE_URL}/now-playing?pageNumber=${pageNumber}`);
    return response.data;
  };
  
  export const getTopRatedMovies = async (pageNumber = 1) => {
    const response = await axios.get(`${API_BASE_URL}/top-rated?pageNumber=${pageNumber}`);
    return response.data;
  };

  export const getAllGenres = async () => {
    const response = await axios.get(`${API_BASE_URL}/genres`);
    return response.data;
  };

  export const searchMovies = async (query, pageNumber = 1, genreIds = []) => {
    const response = await axios.post(`${API_BASE_URL}`, {
      query,
      pageNumber,
      genreIds,
    });
    return response.data;
  };

  export const getMovieDetails = async (movieId) => {
    const response = await axios.get(`${API_BASE_URL}/details`, {
      params: { movieId },
    });
    return response.data;
  };
