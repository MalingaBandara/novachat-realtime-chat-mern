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


