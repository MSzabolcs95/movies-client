import axios from 'axios';

const API_BASE_URL = 'https://localhost:7056/api/Comment';

const getAuthToken = () => {
  return localStorage.getItem('accessToken'); 
};


const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllCommentsForMovie = async (movieId) => {
  const response = await axios.get(`${API_BASE_URL}/movie/${movieId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getCommentById = async (commentId) => {
  const response = await axios.get(`${API_BASE_URL}/${commentId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addComment = async (comment) => {
  const response = await axios.post(API_BASE_URL, comment, {
    headers: getAuthHeaders(),
  });
  return response.data;
};