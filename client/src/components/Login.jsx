import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    // State variables
    const [username, setUsername] = useState(''); // State to store the username
    const [password, setPassword] = useState(''); // State to store the password
    const [errors, setErrors] = useState({}); // State to store form errors
    const [isDarkMode, setIsDarkMode] = useState(false); // State to manage dark mode
    const [notification, setNotification] = useState(''); // State to store login success or error messages

    const navigate = useNavigate(); // Initialize navigation function

    // Effect to load the saved theme from local storage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark'); // Set dark mode based on saved theme
    }, []);

    // Function to handle form submission
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setErrors({}); // Clear previous errors
        setNotification(''); // Clear previous notifications

        try {
            // Send login request to the server
            const response = await axios.post('http://localhost:3001/Login', { username, password });

            // Check if login was successful
            if (response.data.message === 'Login success') {
                const user = response.data;
                localStorage.setItem('userId', user._id); // Store user ID in local storage
                setNotification('Login successful'); // Set success notification
                setTimeout(() => {
                    navigate("/Profile"); // Navigate to Profile page after a delay
                }, 1000); // Delay to allow notification to be displayed
            } else {
                // Set form errors if login was unsuccessful
                setErrors({ form: response.data.message });
                setNotification(''); // Clear notification on login failure
            }
        } catch (err) {
            console.error(err); // Log error to the console
            // Set error message if there was an issue with the request
            setErrors({ form: 'Username or password is incorrect. Please try again.' });
            setNotification(''); // Clear notification on login failure
        }
    };

    return (
        <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`w-96 p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md`}>
                <h1 className={`text-3xl block text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <i className="fa-solid fa-user"></i> Login
                </h1>
                <hr className="mt-3" />
                <form onSubmit={handleLogin}>
                    {/* Username input field */}
                    <div className="mt-3">
                        <label htmlFor="username" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value); // Update username state
                                setErrors(prevErrors => ({ ...prevErrors, username: '' })); // Clear username errors
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.username ? 'border-red-500' : ''}`}
                            placeholder="Enter Username..."
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>} {/* Display username errors */}
                    </div>

                    {/* Password input field */}
                    <div className="mt-3">
                        <label htmlFor="password" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value); // Update password state
                                setErrors(prevErrors => ({ ...prevErrors, password: '' })); // Clear password errors
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter password..."
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} {/* Display password errors */}
                    </div>

                    {/* Display form-level errors and notifications */}
                    {errors.form && <p className="text-red-500 text-sm mt-3">{errors.form}</p>}
                    {notification && (
                        <p className={`text-green-500 text-sm mt-3 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                            {notification}
                        </p>
                    )}

                    {/* Login button */}
                    <div className="mt-5 flex justify-between items-center">
                        <button
                            type="submit"
                            className={`border-2 ${isDarkMode ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 bg-gray-300 text-black'} py-1 w-full rounded-md hover:bg-transparent hover:text-gray-800 font-semibold`}
                        >
                            <i className="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;Login
                        </button>
                    </div>
                </form>

                {/* Link to Forgot Password page */}
                <Link to="/ForgotPassword" className={`text-blue-500 hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                    Forgot Password?
                </Link>
            </div>
        </div>
    );
}

export default Login;

