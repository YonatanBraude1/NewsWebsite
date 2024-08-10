import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ProfileCard() {
  // State variables for profile data and errors
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(true);
  
  // Retrieve userId and darkMode from location state
  const location = useLocation();
  const { userId, darkMode } = location.state || {};
  const [isDarkMode, setIsDarkMode] = useState(darkMode || false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode theme based on state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save dark mode preference in localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode]);

  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setErrors({ userId: 'User ID is missing' }); // Set error if userId is not available
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/profilecard/${userId}`); // Fetch profile data from API
        const { username, email, phone } = response.data;
        setUsername(username);
        setEmail(email);
        setPhone(phone);
      } catch (error) {
        setNotification('Failed to fetch profile data.'); // Set notification if fetching fails
        setNotificationType('error');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfileData();
  }, [userId]);

  // Handle form submission to update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate email and phone
    const isValidEmail = email.endsWith('@gmail.com');
   

    if (!isValidEmail ) {
      setErrors({
        email: !isValidEmail ? 'Email must end with @gmail.com' : ''
        
      });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/update-profile/${userId}`, {
        username,
        email,
        phone
      });
      setNotification(response.data.message || 'Profile updated successfully');
      setNotificationType('success');
    } catch (error) {
      if (error.response && error.response.data) {
        setNotification(error.response.data.message || 'Failed to update profile.');
        setNotificationType('error');
      } else {
        setNotification('Failed to update profile.');
        setNotificationType('error');
      }
    } finally {
      setTimeout(() => {
        setNotification('');
        setNotificationType('');
      }, 2000); // Clear notification after 2 seconds
    }
  };

  // Clear errors after a delay
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 2000); // Clear errors after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [errors]);

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {loading ? (
          <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Loading...</p>
        ) : (
          <div>
            {notification && (
              <div
                className={`mb-4 p-4 rounded text-white ${
                  notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {notification}
              </div>
            )}
            <h1 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Profile Card
            </h1>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className={`block font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-black'}`}
                />
              </div>
              <div className="mb-4">
                <label className={`block font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-black'}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className={`block font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} htmlFor="phone">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-black'}`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Update
                </button>
              </div>
            </form>
            {errors.userId && <p className="text-red-500 text-sm text-center">{errors.userId}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
