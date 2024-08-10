const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://MarwaHamoud:Marwa2304@clusterweb.hnfso7d.mongodb.net/pro20')
  .then(() => {
    // Log a success message when the connection is established
    console.log('MongoDB connected');
  })
  .catch((err) => {
    // Log an error message if the connection fails
    console.log(err);
  });

// Define the schema for the User collection
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Add this to ensure username is always provided
    unique: true // Ensure each username is unique
  },
  email: {
    type: String,
    required: true, // Add this to ensure email is always provided
    unique: true // Ensure each email is unique
  },
  phone: {
    type: String,
    required: true // Add this to ensure phone is always provided
  },
  password: {
    type: String,
    required: true // Add this to ensure password is always provided
  },
  favoriteNews: [{
    url: String,
    description: String
  }]
});

// Create a model based on the UserSchema
const User = mongoose.model("User", UserSchema);

// Export the User model for use in other files
module.exports = {
  User
};

