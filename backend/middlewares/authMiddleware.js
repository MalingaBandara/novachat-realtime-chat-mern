
const jwt = require('jsonwebtoken'); //? Library used to verify JSON Web Tokens
const User = require('../models/UserModel'); //? User model to fetch user data from database


//* ============================================
//* AUTHENTICATION MIDDLEWARE
//* ============================================
//! This middleware protects routes by verifying JWT token
//? If token is valid → user is authorized
//? If token is missing/invalid → request is denied

const protect = async (req, res, next) => {

    let token; //! Variable to store extracted token

    //* Check if Authorization header exists
    //? Example header: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {

            //* Extract token from header
            token = req.headers.authorization.split(" ")[1]; //? Split "Bearer TOKEN_VALUE" and get the second part

           
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //* Verify token using secret key

            //! decoded contains payload data stored in the token
            //? Example: { id: "userId", iat: ..., exp: ... }
            console.log(decoded);

        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' }); //! If token verification fails
        }
    }

    next(); //* Continue to next middleware or route handler

}


module.exports = protect; //? Allows other routes to use this middleware