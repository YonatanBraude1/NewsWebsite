import React, { useEffect, useState } from 'react';
import { fetchNews } from '../newsService'; // Import the function to fetch news articles
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import axios from 'axios';

const Profile = () => {
  // State variables
  const [news, setNews] = useState([]); // Stores news articles
  const [loading, setLoading] = useState(true); // Loading state for news fetching
  const [error, setError] = useState(null); // Error state for news fetching
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true'); // Dark mode state
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category for filtering news
  const [favorites, setFavorites] = useState([]); // Stores favorite news articles
  const [notification, setNotification] = useState(''); // Notification state

  const navigate = useNavigate(); // Hook for navigation
  const userId = localStorage.getItem('userId'); // Fetch user ID from localStorage

  // Fetch news when the component mounts
  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNews(); // Fetch news data
        setNews(newsData); // Update state with news data
      } catch (error) {
        setError('Failed to fetch news'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    getNews();
  }, []);

  // Handle dark mode toggle and save preference to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark'); // Add dark mode class
      localStorage.setItem('darkMode', 'true'); // Save preference to localStorage
    } else {
      document.documentElement.classList.remove('dark'); // Remove dark mode class
      localStorage.setItem('darkMode', 'false'); // Save preference to localStorage
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle dark mode state
  };

  // Navigate to Favorites page
  const handleFavoritesPage = () => {
    navigate('/FavoriteNews', { state: { userId, darkMode: isDarkMode } });
  };

  // Log out and clear localStorage
  const handleLogOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('favorites');
    navigate('/'); // Navigate to the home screen
  };

  // Navigate to Profile Card page
  const handleProfileCardPage = () => {
    navigate('/ProfileCard', { state: { userId, darkMode: isDarkMode } });
  };

  // Categorize news articles
  const categorizedNews = news.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // Filter news based on selected category
  const filteredNews = selectedCategory === 'All' 
    ? news 
    : categorizedNews[selectedCategory] || [];

  // Handle adding or removing news from favorites
  const handleToggleFavorite = async (newsItem) => {
    const userId = localStorage.getItem('userId');
    try {
      const isFavorite = favorites.some(fav => fav.url === newsItem.url);

      if (isFavorite) {
        // Remove from favorites
        await axios.post('http://localhost:3001/favorites/remove', { userId, newsUrl: newsItem.url });
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.url !== newsItem.url));
        
      } else {
        // Add to favorites
        await axios.post('http://localhost:3001/favorites/add', { userId, newsUrl: newsItem.url, newsDescription: newsItem.description });
        setFavorites(prevFavorites => [...prevFavorites, { url: newsItem.url, description: newsItem.description }]);
        setNotification('News item added to favorites.');
      }
    } catch (error) {
      console.error('Failed to toggle favorite status', error);
      setNotification('Failed to update favorite status.');
    }
  };

  // Clear notifications after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`w-full py-6 px-4 sm:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex flex-col items-center border-b border-gray-300`}>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Profile</h1>
      </header>
      <main className="flex-grow p-4 sm:p-8">
        <div className="mb-4">
          <label htmlFor="category-select" className="block text-lg mb-2">Select Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full h-12 px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-black'}`}
          >
            <option value="All">All</option>
            {Object.keys(categorizedNews).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {notification && (
          <div className={`p-4 mb-4 rounded-lg border ${isDarkMode ? 'bg-green-800 text-green-300 border-green-600' : 'bg-green-100 text-green-800 border-green-300'}`}>
            {notification}
          </div>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (selectedCategory === 'Favorites' ? favorites : filteredNews).length ? (
          <ul className="space-y-4">
            {(selectedCategory === 'Favorites' ? favorites : filteredNews).map(newsItem => (
              <li key={newsItem.id} className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
                <h3 className="text-xl font-semibold">{newsItem.title}</h3>
                <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{newsItem.description}</p>
                <button
                  onClick={() => handleToggleFavorite(newsItem)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <i className={`fa-solid fa-star ${favorites.some(fav => fav.url === newsItem.url) ? 'text-yellow-600' : 'text-gray-400'}`}></i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available in this category</p>
        )}
      </main>
      <aside className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex justify-around border-t border-gray-300`}>
        <button
          onClick={handleProfileCardPage}
          className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-400 hover:bg-blue-300 text-black'}`}
        >
          Profile Card
        </button>
        <button
          onClick={handleFavoritesPage}
          className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${isDarkMode ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          Favorite News
        </button>
        <button
          onClick={handleLogOut}
          className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${isDarkMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Log Out
        </button>
        <button
          onClick={handleToggleDarkMode}
          className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-200 text-black'}`}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </aside>
      <footer className={`bg-${isDarkMode ? 'gray-900' : 'blue-100'} text-center py-8 mt-auto ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <p className="text-base md:text-lg">
          Stay informed with Trending News, your trusted source for timely and accurate news coverage. Explore breaking stories, in-depth analysis, and stay connected with the world around you.
        </p>
        <p className="text-base md:text-lg mt-4">Follow us for the latest updates:</p>
        <div className="mt-4 flex justify-center flex-wrap">
          <a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" className={`text-blue-600 hover:underline mr-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Facebook</a>
          <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" className={`text-pink-600 hover:underline ${isDarkMode ? 'text-pink-400' : 'text-pink-700'}`}>Instagram</a>
        </div>
        <p className="text-sm mt-8">&copy; <span id="year">{new Date().getFullYear()}</span> Trending News. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
