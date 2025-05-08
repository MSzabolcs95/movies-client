import React, { createContext, useState, useEffect } from 'react';
import { login, refreshToken } from '../api/authApi';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setAccessToken(data.accessToken);
    setUser({ email });
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  };

  const handleRefreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return;
  
    try {
      const data = await refreshToken(storedRefreshToken);
      setAccessToken(data.accessToken);
      setUser({ email: data.email, id: data.userId });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken); 
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Refresh token is invalid or expired. Logging out.');
        handleLogout(); 
      } else {
        console.error('An error occurred while refreshing the token:', error);
      }
    }
  };
  useEffect(() => {
    handleRefreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;