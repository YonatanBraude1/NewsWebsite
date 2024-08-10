import React, { useState, useEffect } from "react";
import axios from 'axios'; // Ensure axios is installed and imported
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    // State variables
    const [email, setEmail] = useState(''); // State to store the email address
    const [newPassword, setNewPassword] = useState(''); // State to store the new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State to store the confirmation of the new password
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
    const handleForgotPassword = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setErrors({}); // Clear previous errors
        setNotification(''); // Clear any existing notification

        // Check if all fields are filled
        if (!email || !newPassword || !confirmPassword) {
            setErrors({ form: 'Please fill in all fields.' });
            return;
        }
        const isValidEmail = email.endsWith('@gmail.com');
        if(!isValidEmail){
            setErrors({ form:'Email must end with @gmail.com' });
            return;
        }

        // Check if new password and confirmation match
        if (newPassword !== confirmPassword) {
            setErrors({ form: 'Passwords do not match.' });
            return;
        }
        
        try {
            // Send password reset request to the server
            const response = await axios.post('http://localhost:3001/ForgotPassword', { email, newPassword });

            // Check if password reset was successful
            if (response.data.message === 'Password reset success') {
                setNotification('Password has been successfully reset.'); // Set success notification
                setTimeout(() => {
                    navigate("/Login"); // Navigate to Login page after a delay to show the notification
                }, 1000); // Delay to display notification
            } else {
                // Set form errors if password reset was unsuccessful
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
                    <i className="fa-solid fa-lock"></i> Forgot Password
                </h1>
                <hr className="mt-3" />
                <form onSubmit={handleForgotPassword}>
                    {/* Email input field */}
                    <div className="mt-3">
                        <label htmlFor="email" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter your email..."
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} {/* Display email errors */}
                    </div>

                    {/* New password input field */}
                    <div className="mt-3">
                        <label htmlFor="newPassword" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} // Update new password state
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.newPassword ? 'border-red-500' : ''}`}
                            placeholder="Enter new password..."
                        />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>} {/* Display new password errors */}
                    </div>

                    {/* Confirm new password input field */}
                    <div className="mt-3">
                        <label htmlFor="confirmPassword" className={`block text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                            className={`border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            placeholder="Confirm new password..."
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>} {/* Display confirm password errors */}
                    </div>

                    {/* Display form-level errors and notifications */}
                    {errors.form && <p className="text-red-500 text-sm mt-3">{errors.form}</p>}
                    {notification && <p className={`text-green-500 text-sm mt-3 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>{notification}</p>}

                    {/* Reset password button */}
                    <div className="mt-5">
                        {<button type="submit" className={`border-2 ${isDarkMode ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 bg-gray-300 text-black'} py-1 w-full rounded-md hover:bg-transparent hover:text-gray-800 font-semibold`}>
                             <i className="fa-solid fa-key"></i>&nbsp;&nbsp;Reset Password
                            </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
