// import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import ProfileCard from './ProfileCard';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';
import FavoriteNews from './FavoriteNews';
import './index.css';

// Configuring the base URL for API requests
// export const ipAddress = 'https://server-dunm.onrender.com'; // Use this for production
export const ipAddress = 'http://localhost:3001'; // Use this for local development

function App() {
  return (
    // BrowserRouter component wraps the application to enable routing
    <BrowserRouter>
      <Routes>
        {/* Define routes for the application */}
        <Route path="/" element={<Home />} /> {/* Route for the Home page */}
        <Route path="/Register" element={<Register />} /> {/* Route for the Register page */}
        <Route path="/ProfileCard" element={<ProfileCard />} /> {/* Route for the ProfileCard page */}
        <Route path="/Login" element={<Login />} /> {/* Route for the Login page */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} /> {/* Route for the ForgotPassword page */}
        <Route path="/Profile" element={<Profile />} /> {/* Route for the Profile page */}
        <Route path="/FavoriteNews" element={<FavoriteNews />} /> {/* Route for the FavoriteNews page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
