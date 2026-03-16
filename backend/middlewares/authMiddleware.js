const jwt = require("jsonwebtoken"); //? Library used to verify JSON Web Tokens
const User = require("../models/UserModel"); //? User model to fetch user data from database

//* ============================================
//* AUTHENTICATION MIDDLEWARE
//* ============================================
//! Purpose: Protect private routes using JWT authentication
//? Flow:
//? 1. Check if request contains Authorization header
//? 2. Extract token from "Bearer <token>"
//? 3. Verify token using JWT secret
//? 4. Decode user ID from token payload
//? 5. Fetch user from database
//? 6. Attach user to request object (req.user)
//? 7. Continue to next middleware/route

const protect = async (req, res, next) => {
  let token; //! Variable to store extracted token

  //* Check if Authorization header exists and starts with "Bearer"
  //? Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {

    try {
      //* Extract token from header
      //? Splits "Bearer TOKEN_VALUE" → ["Bearer", "TOKEN_VALUE"]
      token = req.headers.authorization.split(" ")[1];

      //* Verify the token using secret key from environment variables
      //? If invalid or expired → error will be thrown
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //* Fetch user from database using decoded user ID
      //? select("-password") excludes password field from returned data
      req.user = await User.findById(decoded.id).select("-password");

      //* Attach user object to request
      //? Now any protected route can access req.user
      //? Example: req.user._id, req.user.username

      next(); //! Continue execution to the next middleware or route

    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" }); //! If token verification fails
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" }); //! If no token is provided
  }
};



//* ============================================
//* ADMIN AUTHORIZATION MIDDLEWARE
//* ============================================
//! Purpose: Restrict access to admin-only routes
//? Must be used AFTER the protect middleware
//? Example: router.delete("/users/:id", protect, isAdmin)

const isAdmin = (req, res, next) => {

  try {

    //* Check if user exists and has admin privileges
    if (req.user && req.user.isAdmin) {

      next(); //! User is admin → allow access to route

    } else {
      res.status(403).json({ message: "Forbidden, admin access required" }); //! User exists but is not an admin
    }

  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" }); //! Handle unexpected errors during authorization
  }

};


module.exports = { protect, isAdmin }; //? Allows other routes to use this middlewares