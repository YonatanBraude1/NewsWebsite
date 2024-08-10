import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { fetchNews } from '../newsService'; // Import the function to fetch news articles

function Home() {
  // State variables
  const [articles, setArticles] = useState([]); // State to store fetched news articles
  const [query, setQuery] = useState(''); // State to store search query
  const [page, setPage] = useState(1); // State to manage pagination
  const [isDarkMode, setIsDarkMode] = useState(false); // State to handle dark mode

  const navigate = useNavigate(); // Initialize navigation function
  
  // Effect to load the saved theme from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);
  
  // Effect to fetch news articles whenever query or page changes
  useEffect(() => {
    const getNews = async () => {
      try {
        const news = await fetchNews(query, page);
        setArticles(news); // Update articles state with fetched news
      } catch (error) {
        console.error('Error fetching news:', error); // Log error to the console
      }
    };
    getNews(); // Call the function to fetch news
  }, [query, page]); // Dependencies: query and page

  // Function to navigate to the login page
  const handleLogin = () => {
    navigate('/Login'); // Navigate to the Login page
  };

  // Function to navigate to the registration page
  const handleSignIn = () => {
    navigate('/register'); // Navigate to the Register page
  };

  // Function to prompt user for a search query and update state
  const handleSearch = () => {
    const searchQuery = prompt('Enter search term:');
    if (searchQuery) {
      setQuery(searchQuery); // Update query state
      setPage(1); // Reset page to 1 on new search
    } else {
      setQuery(''); // Clear query if no input
      setPage(1); // Reset page to 1
    }
  };

  // Function to toggle between dark and light mode
  const toggleTheme = () => {
    const newMode = !isDarkMode; // Toggle dark mode
    setIsDarkMode(newMode); // Update state
    localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save new theme to local storage
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`w-full py-6 px-4 sm:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex flex-col items-center border-b border-gray-300`}>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>TRENDING NEWS</h1>
        <button
          className={`mt-4 px-4 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-400 hover:bg-blue-300'} ${isDarkMode ? 'text-white' : 'text-black'} font-bold rounded-lg transition-colors duration-300`}
          onClick={handleSearch}
        >
          Search
        </button>
      </header>
      <main className={`flex-grow flex flex-col items-center pt-8 pb-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="w-full max-w-4xl p-4">
          {articles.length === 0 ? (
            <p className="text-center text-gray-600">No articles found.</p>
          ) : (
            articles.map((article, index) => (
              <div key={index} className={`mb-4 p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">{article.title}</h3>
                <p className={`text-base mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:underline ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-700'}`}>
                  Read more
                </a>
              </div>
            ))
          )}
        </div>
      </main>
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex justify-around border-t border-gray-300`}>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-300"
          onClick={handleLogin}
        >
          Log In
        </button>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors duration-300"
          onClick={handleSignIn}
        >
          Sign up
        </button>
        <button
          className={`px-4 py-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-200'} ${isDarkMode ? 'text-white' : 'text-black'} font-bold rounded-lg transition-colors duration-300`}
          onClick={toggleTheme}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <footer className={`bg-${isDarkMode ? 'gray-900' : 'blue-100'} text-center py-8 mt-auto ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <p className="text-base md:text-lg">
          Stay informed with Trending News, your trusted source for timely and accurate news coverage. Explore breaking stories, in-depth analysis, and stay connected with the world around you.
        </p>
        <p className="text-base md:text-lg mt-4">Follow us for the latest updates:</p>
        <div className="mt-4 flex justify-center flex-wrap">
          <a href="https://www.facebook.com/login/" target="_blank" className={`text-blue-600 hover:underline mr-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Facebook</a>
          <a href="https://www.instagram.com/accounts/login/" target="_blank" className={`text-pink-600 hover:underline ${isDarkMode ? 'text-pink-400' : 'text-pink-700'}`}>Instagram</a>
        </div>
        <p className="text-sm mt-8">&copy; <span id="year"></span> Trending News. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

