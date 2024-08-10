import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const FavoritesPage = () => {
  // Access location state to get userId
  const location = useLocation();
  const userId = location.state?.userId;
  
  // State variables
  const [notification, setNotification] = useState(''); // Notification state for user feedback
  const [favorites, setFavorites] = useState([]); // State to store favorite news items
  const [loading, setLoading] = useState(true); // Loading state for fetching favorites
  const [error, setError] = useState(null); // Error state for handling fetch errors

  // Fetch favorite news items when component mounts or userId changes
  useEffect(() => {
    const fetchFavorites = async () => {
      const userIdFromStorage = localStorage.getItem('userId'); // Retrieve userId from localStorage
      console.log('Fetching favorites for userId:', userIdFromStorage);
      
      if (!userIdFromStorage) {
        setError('User ID is missing'); // Set error if userId is not found
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/favorites/${userIdFromStorage}`); // Fetch favorites from API
        setFavorites(response.data.favorites || []); // Update state with fetched favorites
      } catch (error) {
        setError('Failed to fetch favorite news'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFavorites();
  }, [userId]);

  // Remove a news item from favorites
  const removeFavorite = async (newsUrl) => {
    try {
      await axios.post(`http://localhost:3001/favorites/remove`, { userId, newsUrl }); // Send request to remove favorite
      setFavorites(favorites.filter(favorite => favorite.url !== newsUrl)); // Update favorites state
      setNotification('News item removed from favorites.'); // Set notification
    } catch (error) {
      console.error('Failed to remove favorite news', error);
      setError('Failed to remove favorite news'); // Set error message if removing fails
    }
  };

  // Clear notifications after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [notification]);

  return (
    <div className="flex flex-col items-center h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl mb-4 text-gray-900 dark:text-white">Favorite News</h1>
      
      {notification && (
        <div className={`mb-4 p-4 rounded text-white ${notification.includes('removed') ? 'bg-green-500' : 'bg-red-500'} dark:bg-${notification.includes('removed') ? 'green-600' : 'red-600'}`}>
          {notification}
        </div>
      )}
      
      {loading && <p className="text-gray-900 dark:text-white">Loading...</p>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      {!loading && !error && favorites.length ? (
        <ul className="w-full max-w-2xl">
          {favorites.map((newsItem, index) => (
            <li key={index} className="p-2 bg-white mb-2 border rounded shadow-md dark:bg-gray-700 dark:border-gray-600 flex justify-between items-center">
              <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 underline">
                Read more
              </a>
              <p className="ml-4 text-gray-900 dark:text-white">{newsItem.description}</p>
              <button 
                onClick={() => removeFavorite(newsItem.url)} 
                className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900 dark:text-white">No favorite news items found</p>
      )}
    </div>
  );
};

export default FavoritesPage;
