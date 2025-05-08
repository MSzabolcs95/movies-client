import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/App.css';
import MoviesList from './MoviesList';
import MovieDetails from './MovieDetails';
import AuthPage from './AuthPage';
import AuthProvider from '../context/AuthContext';
import Navbar from './Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <div className="App">
        <Navbar />
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route
          path="/auth"
          element={
            <AuthProvider> 
              <AuthPage />
            </AuthProvider>
          }
        />
      </Routes>
    </div>
    </AuthProvider>
  );
};

export default App;