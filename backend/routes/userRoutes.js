//* Importing required modules
const express = require("express"); //? Express framework for handling HTTP requests
const User = require("../models/UserModel"); //? User model to interact with users collection
const userRouter = express.Router(); //? Creating a router instance
const jwt = require("jsonwebtoken"); //? Library used for generating authentication tokens (JWT)


//* ============================================
//* USER REGISTRATION ROUTE
//* ============================================
//! Handles POST request to register a new user
userRouter.post('/register', async (req, res) => {

    try {

        const { username, email, password } = req.body; //* Extract user input from request body

        const userExists = await User.findOne({ email }); //* Check if a user with the same email already exists

        //! If user already exists, return error response
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //* Create new user in database
        const user = await User.create({ username, email, password }); //? Password hashing happens automatically in pre("save") middleware

        //* If user successfully created, send response
        if (user) {
            res.status(201).json({
                _id: user._id, //? Unique user ID
                username: user.username,
                email: user.email,
            });
        }

    } catch (error) {
        res.status(400).json({ message: error.message }); //! Handle unexpected errors
    }

});



//* ============================================
//* USER LOGIN ROUTE
//* ============================================
//! Handles POST request to authenticate user
userRouter.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body; //* Extract login credentials from request body

        const user = await User.findOne({ email }); //* Find user by email

        //* Validate:
//? 1. User exists
//? 2. Entered password matches hashed password
        if (user && (await user.matchPassword(password))) {

            //* If authentication successful, return user data + JWT token
            res.json({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin, //? Indicates admin privileges
                    token: generateToken(user._id) //! Generate signed JWT token
                },
            });

        } else {
            res.status(401).json({ message: "Invalid email or password" }); //! If email or password is incorrect
        }

    } catch (error) {
        res.status(400).json({ message: error.message });//! Handle unexpected server errors
    }

});



//* ============================================
//* JWT TOKEN GENERATOR FUNCTION
//* ============================================
//! Creates a signed JSON Web Token
//? Used for authenticating protected routes
//? Token contains user ID inside payload
const generateToken = (id) => {

    return jwt.sign(
        { id }, //? Payload (data stored inside token)
        process.env.JWT_SECRET, //? Secret key from environment variables
        { expiresIn: "30d" } //? Token expiration time
    );

};


module.exports = userRouter; //! Exporting the router to be used in main server file