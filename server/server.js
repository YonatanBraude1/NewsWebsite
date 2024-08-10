const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { User } = require('./mongodb');
const mongoose = require('mongoose');

const app = express();
//const port = 3001;
const port = process.env.PORT || 3001;
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://website-project-client.vercel.app/"
    ],
};


// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to handle password reset requests
app.post('/ForgotPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: 'Password reset success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to handle user login requests
app.post('/Login', async (req, res) => {
    const { username, password } = req.body;
    try {
       // Check if there is a user with the provided username
        const user = await User.findOne({ username: username });
        if (!user) {
            // If no user is found, respond with a 'User not found' message
            return res.status(200).json({ message: 'User not found' });
        }
        // Check if the provided password matches the stored password
        if (user.password === password) {
            // If the passwords match, respond with the user's ID and a 'Login success' message
            return res.status(200).json({ _id: user._id, message: 'Login success' });
       } else {
            // If the passwords do not match, respond with an 'Invalid credentials' message
            return res.status(200).json({ message: 'Invalid credentials' });
       }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to handle user registration requests
app.post('/Register', async (req, res) => {
    const { username, email, phone, password, confirmPassword } = req.body;
    try {
        const check = await User.findOne({ username: username });
        if (check) {
            return res.status(200).json({ message: 'User already exists' });

        }
        // Check if the email already exists
        const userByEmail = await User.findOne({ email: email });
        if (userByEmail) {
            return res.status(200).json({ message: 'Email already exists' });
        }
         else {
            const data = {
                username: username,
                email: email,
                phone: phone,
                password: password
            };
            await User.insertMany([data]);
            return res.status(200).json({ message: 'Registration success' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to add a news item to user's favorites
app.post('/favorites/add', async (req, res) => {
    const { userId, newsUrl, newsDescription } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }

        // Check if the news is already in the favorites
        const existingFavorite = user.favoriteNews.find(item => item.url === newsUrl);
        if (!existingFavorite) {
            // Add the news item to the user's list of favorite news
            user.favoriteNews.push({ url: newsUrl, description: newsDescription });
            await user.save();
        }

        return res.status(200).json({ message: 'News added to favorites' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to remove a news item from user's favorites
app.post('/favorites/remove', async (req, res) => {
    const { userId, newsUrl } = req.body;
    try {
        const user = await User.findById(userId);//find the userId 
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }
        // filters the news ,it keeps all favorite news items except the one that matches the specified URL.
        user.favoriteNews = user.favoriteNews.filter(item => item.url !== newsUrl);
        await user.save();

        return res.status(200).json({ message: 'News removed from favorites' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to get the user's favorite news items
app.get('/favorites/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ favorites: user.favoriteNews });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch user profile data
app.get('/profilecard/:userId', async (req, res) => {
    const { userId } = req.params; // Access userId from URL parameters
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ username: user.username, email: user.email, phone: user.phone });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Endpoint to update user profile data
app.put('/update-profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, email, phone } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the new username is already taken
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            user.username = username;
        }

        // Validate email and phone
        if (email && !email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'Email must end with @gmail.com' });
        }
        if (phone && phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }

        // Update user details
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
