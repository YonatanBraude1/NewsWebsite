import React, { useState, useEffect } from "react";
import axios from 'axios'; // Ensure axios is installed and imported
import { useNavigate } from 'react-router-dom';

function Register() {
    // State variables
    const [username, setUsername] = useState(''); // State to store username
    const [email, setEmail] = useState(''); // State to store email address
    const [phone, setPhone] = useState(''); // State to store phone number
    const [password, setPassword] = useState(''); // State to store password
    const [confirmPassword, setConfirmPassword] = useState(''); // State to store password confirmation
    const [errors, setErrors] = useState({}); // State to store form errors
    const [notification, setNotification] = useState(''); // State to store success or error messages
    const [isDarkMode, setIsDarkMode] = useState(false); // State to manage dark mode
    const navigate = useNavigate(); // Initialize navigation function

    // Effect to load the saved theme from local storage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark'); // Set dark mode based on saved theme
    }, []);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setErrors({}); // Clear previous errors
        setNotification(''); // Clear any existing notification

        // Check if all fields are filled
        if (!username || !email || !phone || !password || !confirmPassword) {
            setErrors({ form: 'Please fill in all fields.' });
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrors({ form: 'Passwords do not match.' });
            return;
        }

        // Validate email
        if (!email.endsWith('@gmail.com')) {
            setErrors({ form: 'Email must end with @gmail.com.' });
            return;
        }

        // Validate phone number
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setErrors({ form: 'The phone number must be exactly 10 digits.' });
            return;
        }

        try {
            // Send registration request to the server
            const response = await axios.post('http://localhost:3001/Register', {
                username,
                email,
                phone,
                password
            });

            // Check if registration was successful
            if (response.data.message === 'Registration success') {
                setNotification('You have been signed up successfully.'); // Set success notification
                setTimeout(() => {
                    navigate("/Login"); // Navigate to Login page after a delay to show the notification
                }, 1000); // Delay to display notification
            } else {
                // Set form errors if registration was unsuccessful
                setErrors({ form: response.data.message });
            }
        } catch (err) {
            console.error(err); // Log error to the console
            // Set error message if there was an issue with the request
            setErrors({ form: 'An error occurred. Please try again later.' });
        }
    };

    return (
        <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`w-96 p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md`}>
                <h1 className={`text-3xl block text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <i className="fa-solid fa-user-plus"></i> Register
                </h1>
                <hr className="mt-3" />
                <form onSubmit={handleSubmit}>
                    {/* Username input field */}
                    <div className="mt-3">
                        <label htmlFor="username" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrors(prevErrors => ({ ...prevErrors, username: '' }));
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.username ? 'border-red-500' : ''}`}
                            placeholder="Enter Username..."
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>} {/* Display username errors */}
                    </div>

                    {/* Email input field */}
                    <div className="mt-3">
                        <label htmlFor="email" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors(prevErrors => ({ ...prevErrors, email: '' }));
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter email..."
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} {/* Display email errors */}
                    </div>

                    {/* Phone input field */}
                    <div className="mt-3">
                        <label htmlFor="phone" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.phone ? 'border-red-500' : ''}`}
                            placeholder="Enter phone..."
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>} {/* Display phone errors */}
                    </div>

                    {/* Password input field */}
                    <div className="mt-3">
                        <label htmlFor="password" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors(prevErrors => ({ ...prevErrors, password: '' }));
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter password..."
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} {/* Display password errors */}
                    </div>

                    {/* Confirm Password input field */}
                    <div className="mt-3">
                        <label htmlFor="confirmPassword" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
                            }}
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            placeholder="Confirm password..."
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>} {/* Display confirm password errors */}
                    </div>

                    {/* Display form-level errors and notifications */}
                    {errors.form && <p className="text-red-500 text-sm mt-3">{errors.form}</p>}
                    {notification && <p className={`text-green-500 text-sm mt-3 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>{notification}</p>}

                    {/* Register button */}
                    <div className="mt-5">
                        <button
                            type="submit"
                            className={`border-2 ${isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-gray-300'} text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-800 font-semibold`}
                        >
                            <i className="fa-solid fa-user-plus"></i>&nbsp;&nbsp;Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
