import axios from 'axios';

const API_BASE_URL = 'https://localhost:7056/api/auth';

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    registerRequest: { email, password },
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
  return response.data;
};
